import { DisplayType } from '@jbrowse/core/pluggableElementTypes'

import { configSchemaFactory } from './configSchemaFactory'
import { stateModelFactory } from './stateModelFactory'
import { BaseLinearDisplayComponent } from '@jbrowse/plugin-linear-genome-view'

import PluginManager from '@jbrowse/core/PluginManager'
import WigglePlugin from '@jbrowse/plugin-wiggle'

import YScaleBar from './YScaleBar'

export default async function RepeatDisplayF(pluginManager: PluginManager) {
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
      //ReactComponent: BaseLinearDisplayComponent,
      ReactComponent: RepeatDisplayReactComponent,
    })
  })
}
