import { lazy } from 'react'

import { DisplayType } from '@jbrowse/core/pluggableElementTypes'

import { configSchemaFactory } from './configSchemaFactory'
import { stateModelFactory } from './stateModelFactory'

import WigglePlugin from '@jbrowse/plugin-wiggle'

import PluginManager from '@jbrowse/core/PluginManager'

export default function RepeatDisplayF(pluginManager: PluginManager) {

  const WiggleP = pluginManager.getPlugin('WigglePlugin') as unknown as WigglePlugin
  const RepeatDisplayReactComponent = WiggleP.exports.LinearWiggleDisplayReactComponent

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
