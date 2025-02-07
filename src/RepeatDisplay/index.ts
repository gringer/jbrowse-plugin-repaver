import React from 'react'

import { DisplayType } from '@jbrowse/core/pluggableElementTypes'

import { configSchemaFactory } from './configSchemaFactory'
import { stateModelFactory } from './stateModelFactory'

import { BaseLinearDisplayComponent } from '@jbrowse/plugin-linear-genome-view'

import RepeatDisplayReactComponent from './RepeatDisplayReactComponent'

import PluginManager from '@jbrowse/core/PluginManager'

export default function RepeatDisplayF(pluginManager: PluginManager) {

  pluginManager.addDisplayType(() => {
   
    const configSchema = configSchemaFactory(pluginManager)
    return new DisplayType({
      name: 'RepeatDisplay',
      configSchema,
      stateModel: stateModelFactory(pluginManager, configSchema),
      trackType: 'FeatureTrack',
      viewType: 'LinearGenomeView',
      ReactComponent: RepeatDisplayReactComponent,
    })
  })
}
