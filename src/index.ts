import Plugin from '@jbrowse/core/Plugin'
import PluginManager from '@jbrowse/core/PluginManager'
import ViewType from '@jbrowse/core/pluggableElementTypes/ViewType'
import { AbstractSessionModel, isAbstractMenuManager } from '@jbrowse/core/util'
import { version } from '../package.json'

import LinearManhattanDisplayF from './LinearManhattanDisplay'
import LinearManhattanRendererF from './LinearManhattanRenderer'

export default class RepaverPlugin extends Plugin {
  name = 'RepaverPlugin'
  version = version

  install(pluginManager: PluginManager) {
    LinearManhattanDisplayF(pluginManager)
    LinearManhattanRendererF(pluginManager)
  }

  configure(pluginManager: PluginManager) {
  }
}
