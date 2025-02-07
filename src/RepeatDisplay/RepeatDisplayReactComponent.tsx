import { lazy } from 'react';
import React from 'react'
import { getConf } from '@jbrowse/core/configuration'
import { BaseLinearDisplayComponent } from '@jbrowse/plugin-linear-genome-view'
import {
  getContainingTrack,
  getContainingView,
  measureText,
} from '@jbrowse/core/util'
import { observer } from 'mobx-react'
import YScaleBar from './YScaleBar'
import stateModelFactory from '@jbrowse/plugin-wiggle/dist/LinearWiggleDisplay/model'
import type { Instance } from 'mobx-state-tree'
import type { LinearGenomeViewModel } from '@jbrowse/plugin-linear-genome-view'

type LGV = LinearGenomeViewModel
export type WiggleDisplayModel = Instance<ReturnType<typeof stateModelFactory>>

//<BaseLinearDisplayComponent {...props} />
const RepeatDisplayComponent = observer((props: { model: WiggleDisplayModel } ) => {
  const { model } = props
  const { stats, height, needsScalebar } = model
  const { trackLabels, totalBp } = getContainingView(model) as LGV
  const track = getContainingTrack(model)
  const logLinTotalBp = (model.scaleType == 'repeat') ? totalBp : undefined
  const left =
    trackLabels === 'overlapping'
      ? measureText(getConf(track, 'name'), 12.8) + 100
      : 50
  return (
    <div>
      <h1>Here is some text</h1>
      {stats && needsScalebar ? (
        <svg style={{ position: 'absolute', top: 0, left, pointerEvents: 'none',
                      height, width: 50, }} >
          <YScaleBar model={model} logLinSeqLength={logLinTotalBp} />
        </svg>
      ) : null}
    </div>
  )})

export default RepeatDisplayComponent
