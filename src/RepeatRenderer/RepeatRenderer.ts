import { readConfObject } from '@jbrowse/core/configuration'
import { featureSpanPx } from '@jbrowse/core/util'
import RBush from 'rbush'

import {
  scaleLinear,
  scaleLog,
  scaleQuantize,
} from '@mui/x-charts-vendor/d3-scale'

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
  let scale:
    | ReturnType<typeof scaleLinear<number>>
    | ReturnType<typeof scaleLog<number>>
    | ReturnType<typeof scaleQuantize<number>>
  const [min, max] = domain
  if (min === undefined || max === undefined) {
    throw new Error('invalid domain')
  }
  if (scaleType === 'linear') {
    scale = scaleLinear()
  } else if (scaleType === 'log') {
    scale = scaleLog().base(2)
  } else if (scaleType === 'quantize') {
    scale = scaleQuantize()
  } else if (scaleType === 'repeat') {
    scale = scaleLinear()
  } else {
    throw new Error('undefined scaleType')
  }
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

      const scale = getScale({
        ...scaleOpts,
        range: [0, height],
      })
      const toY = (n: number) => height - scale(n) + YSCALEBAR_LABEL_OFFSET

      let start = performance.now()
      checkStopToken(stopToken)
      let lastRenderedBlobX = 0
      let lastRenderedBlobY = 0
      const { isCallback } = config.color
      if (!isCallback) {
        ctx.fillStyle = config.color.value
        ctx.strokeStyle = config.color.value
      }
      ctx.lineWidth = 4
      ctx.lineCap = "round"
      for (const feature of features.values()) {
        if (performance.now() - start > 200) {
          checkStopToken(stopToken)
          start = performance.now()
        }
        const [leftPx, rightPx] = featureSpanPx(feature, region, bpPerPx)
        const score = feature.get('score') as number
        const y = toY(score)
        if (
          Math.abs(leftPx - lastRenderedBlobX) > 1 ||
          Math.abs(y - lastRenderedBlobY) > 1
        ) {
          if (isCallback) {
            ctx.fillStyle = readConfObject(config, 'color', { feature })
            ctx.strokeStyle = readConfObject(config, 'color', { feature })
          }
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
        ctx.strokeStyle = 'rgba(200,200,200,0.8)'
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
