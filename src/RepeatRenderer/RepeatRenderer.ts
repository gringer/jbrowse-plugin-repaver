import { readConfObject } from '@jbrowse/core/configuration'
import { featureSpanPx } from '@jbrowse/core/util'
import RBush from 'rbush'

import { scaleLinear } from '@mui/x-charts-vendor/d3-scale'

import type PluginManager from '@jbrowse/core/PluginManager'
import type WigglePlugin from '@jbrowse/plugin-wiggle'

export const YSCALEBAR_LABEL_OFFSET = 5

export interface ScaleOpts {
  domain: number[]
  range: number[]
  scaleType: string
  pivotValue?: number
  inverted?: boolean
}

export function checkStopToken(stopToken?: string) {
  if (stopToken !== undefined) {
    const xhr = new XMLHttpRequest()

    // synchronous XHR usage to check the token
    xhr.open('GET', stopToken, false)
    try {
      xhr.send(null)
    } catch (e) {
      throw new Error('aborted')
    }
  }
}

function getScale({
  domain = [],
  range = [],
  scaleType,
  pivotValue,
  inverted,
}: ScaleOpts) {
  let scale: ReturnType<typeof scaleLinear<number>>
  const [min, max] = domain
  if (min === undefined || max === undefined) {
    throw new Error('invalid domain')
  }
  scale = scaleLinear()
  scale.domain(pivotValue !== undefined ? [min, pivotValue, max] : [min, max])
  scale.nice()

  const [rangeMin, rangeMax] = range
  if (rangeMin === undefined || rangeMax === undefined) {
    throw new Error('invalid range')
  }
  scale.range(inverted ? range.slice().reverse() : range)
  return scale
}

export default function rendererFactory(pluginManager: PluginManager) {
  const WigglePlugin = pluginManager.getPlugin('WigglePlugin') as unknown as WigglePlugin
  const {
    WiggleBaseRenderer,
  } = WigglePlugin.exports

  return class RepeatPlotRenderer extends WiggleBaseRenderer {
    async draw(ctx: CanvasRenderingContext2D, props: any) {
      const {
        features,
        regions,
        bpPerPx,
        config,
        scaleOpts,
        height: unadjustedHeight,
        displayCrossHatches,
        ticks: { values },
        stopToken,
      } = props
      const [region] = regions
      const YSCALEBAR_LABEL_OFFSET = 5
      const height = unadjustedHeight - YSCALEBAR_LABEL_OFFSET * 2
      const width = (region.end - region.start) / bpPerPx
      const rbush = new RBush<any>()
      const flipScore = (config.displayStyle.value === "profile")

      const scale = getScale({
        ...scaleOpts,
        range: [0, height],
      })
      const toY = (n: number) => height - scale(n) + YSCALEBAR_LABEL_OFFSET

      let start = performance.now()
      checkStopToken(stopToken)
      let lastRenderedBlobX = 0
      let lastRenderedBlobY = 0
      ctx.lineWidth = 4
      ctx.lineCap = "round"
      const repeatColours: ReadonlyMap<string, string> = new Map([
        ["F+", config.F1colour.value], ["F-", config.F2colour.value],
        ["R+", config.R1colour.value], ["R-", config.R2colour.value],
        ["C+", config.C1colour.value], ["C-", config.C2colour.value],
        ["RC+",config.RC1colour.value],["RC-",config.RC2colour.value]
      ]);
      const featureCount = features.size
      // If there are fewer than 5000 features, draw them all
      const sampleFeatureCount = ((featureCount < 5000) ?
        1 : Math.floor(featureCount / 5000))
      var featureCountInc = 0
      var lastFeatureBp = -1
      var lastY = -5000
      for (const feature of features.values()) {
        if (performance.now() - start > 200) {
          checkStopToken(stopToken)
          start = performance.now()
        }
        const featureDelta = feature.data.start - lastFeatureBp
        // Subsample data if there are too many features, but preserve
        // the first vertical line after skipping
        if((featureDelta < ((10 * bpPerPx) - 1)) && (featureDelta > 0) &&
          (++featureCountInc < sampleFeatureCount))
          {
            lastY = -5000
            continue
          } else {
            if((featureDelta >= ((10 * bpPerPx) - 1))){
              lastFeatureBp = feature.data.start
            }
            featureCountInc = 0
          }
        const [leftPx, rightPx] = featureSpanPx(feature, region, bpPerPx)
        const score = feature.get('score') as number
        const repeatDir: string = feature.get('repeatClass') + feature.get('direction')
        const y = toY(score * (flipScore && (score < 0) ? -1 : 1))
        // Note: the pixel output for featureSpanPx is rounded to 0.1 px
        if (
          Math.abs(leftPx - lastRenderedBlobX) > 1 ||
            Math.abs(y - lastRenderedBlobY) > 1
        ) {
          ctx.fillStyle = repeatColours.get(repeatDir) as string
          ctx.strokeStyle = repeatColours.get(repeatDir) as string
          ctx.beginPath()
          ctx.moveTo(leftPx, y)
          ctx.lineTo(rightPx, y)
          ctx.stroke()
          lastRenderedBlobY = y
          lastRenderedBlobX = leftPx
          rbush.insert({
            minX: leftPx,
            minY: y,
            maxX: rightPx + 4,
            maxY: y + 4,
            feature: feature.toJSON(),
          })
        }
      }

      if (displayCrossHatches) {
        ctx.lineWidth = 1
        ctx.strokeStyle = 'rgba(200,200,200,0.5)'
        values.forEach((tick: number) => {
          ctx.beginPath()
          ctx.moveTo(0, Math.round(toY(tick)))
          ctx.lineTo(width, Math.round(toY(tick)))
          ctx.stroke()
        })
      }
      return {
        clickMap: rbush.toJSON(),
      }
    }
  }
}
