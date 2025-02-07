import { useRef, lazy } from 'react';
import React from 'react'
import { getConf } from '@jbrowse/core/configuration'
import { useTheme } from '@mui/material'
import { observer } from 'mobx-react'
import { makeStyles } from 'tss-react/mui'

import BaseLinearDisplay from '@jbrowse/plugin-linear-genome-view'
import type { BaseBlock } from '@jbrowse/core/util/blockTypes'
import {
  getContainingTrack,
  getContainingView,
  measureText,
} from '@jbrowse/core/util'
import YScaleBar from './YScaleBar'
import stateModelFactory from '@jbrowse/plugin-wiggle/dist/LinearWiggleDisplay/model'
import type { Instance } from 'mobx-state-tree'
import type { LinearGenomeViewModel } from '@jbrowse/plugin-linear-genome-view'

type Coord = [number, number]

type LGV = LinearGenomeViewModel
export type WiggleDisplayModel = Instance<ReturnType<typeof stateModelFactory>>

const useStyles = makeStyles()({
  contentBlock: {
    position: 'relative',
    minHeight: '100%',
    boxSizing: 'border-box',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
  linearBlocks: {
    whiteSpace: 'nowrap',
    textAlign: 'left',
    position: 'absolute',
    minHeight: '100%',
    display: 'flex',
  },
  heightOverflowed: {
    position: 'absolute',
    color: 'rgb(77,77,77)',
    borderBottom: '2px solid rgb(77,77,77)',
    textShadow: 'white 0px 0px 1px',
    whiteSpace: 'nowrap',
    width: '100%',
    fontWeight: 'bold',
    textAlign: 'center',
    zIndex: 2000,
    boxSizing: 'border-box',
  },
  display: {
    position: 'relative',
    whiteSpace: 'nowrap',
    textAlign: 'left',
    width: '100%',
    minHeight: '100%',
  },
  elidedBlock: {
    minHeight: '100%',
    boxSizing: 'border-box',
    backgroundColor: '#999',
    backgroundImage:
      'repeating-linear-gradient(90deg, transparent, transparent 1px, rgba(255,255,255,.5) 1px, rgba(255,255,255,.5) 3px)',
  },
  interRegionPaddingBlock: {
    minHeight: '100%',
    backgroundColor: 'cyan', /* theme.palette.text.disabled  */
  },
  boundaryPaddingBlock: {
    minHeight: '100%',
    backgroundColor: 'magenta', /* theme.palette.action.disabledBackground  */
  },
})

const RepeatDisplayComponent = observer((props: { model: WiggleDisplayModel } ) => {
  const { classes } = useStyles()
  const ref = useRef<HTMLDivElement>(null)
  const { model } = props
  const { stats, height, needsScalebar, blockDefinitions,
    blockState, DisplayMessageComponent } = model
  const viewModel = getContainingView(model) as LGV
  const { trackLabels, totalBp } = getContainingView(model) as LGV
  const track = getContainingTrack(model)
  const logLinTotalBp = totalBp
  const left =
    trackLabels === 'overlapping'
      ? measureText(getConf(track, 'name'), 12.8) + 100
      : 50
  return (
    <div>
      <h1>Here is some text</h1>
      <div
        ref={ref}
        data-testid={`display-${getConf(model, 'displayId')}`}
        className={classes.display}
      >
        {DisplayMessageComponent ? (
          <DisplayMessageComponent model={model} />
        ) : (
          <div
            className={classes.linearBlocks}
            style={{
              left: blockDefinitions.offsetPx - viewModel.offsetPx,
            }}
          >
            <>
              {blockDefinitions.map(block => {
                const key = `${model.id}-${block.key}`
                if (block.type === 'ContentBlock') {
                  const state = blockState.get(block.key)
                  return (
                    <div style={{ width: block.widthPx }} className={classes.contentBlock}>
                      {state?.ReactComponent ? (
                        <state.ReactComponent model={state} />
                      ) : null}
                    </div>
                  )
                }
                if (block.type === 'ElidedBlock') {
                  return (
                    <div className={classes.elidedBlock} style={{ width:block.widthPx }} />
                  )
                }
                if (block.type === 'InterRegionPaddingBlock') {
                  return (
                    <div style={{ background: 'none', width:block.widthPx }}
                      className={
                        block.variant === 'boundary'
                          ? classes.boundaryPaddingBlock
                          : classes.interRegionPaddingBlock
                      } >
                    </div>
                  )
                }
                throw new Error(`invalid block type ${JSON.stringify(block)}`)
              })}
            </>
          </div>
        )}
        <svg>
          <rect x="120" width="100" height="100" rx="15" />
        </svg>
      </div>
      <div>
      {stats && needsScalebar ? (
        <svg style={{ position: 'absolute', top: 0, left, pointerEvents: 'none',
                      height, width: 50, }} >
          <YScaleBar model={model} logLinSeqLength={logLinTotalBp} />
        </svg>
      ) : null}
      </div>
    </div>
  )})

export default RepeatDisplayComponent
