import Plugin from '@jbrowse/core/Plugin'
import PluginManager from '@jbrowse/core/PluginManager'
import ViewType from '@jbrowse/core/pluggableElementTypes/ViewType'
import { AbstractSessionModel, isAbstractMenuManager } from '@jbrowse/core/util'
import { version } from '../package.json'

import RepeatDisplayF from './RepeatDisplay'
import RepeatRendererF from './RepeatRenderer'

export default class RepaverPlugin extends Plugin {
  name = 'RepaverPlugin'
  version = version

  install(pluginManager: PluginManager) {
    RepeatDisplayF(pluginManager)
    RepeatRendererF(pluginManager)
  }

  configure(pluginManager: PluginManager) {
  }
}
