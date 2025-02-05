import rendererFactory from './RepeatRenderer'
import RepeatRendering from './RepeatRendering'
import { configSchema } from './configSchema'

import type PluginManager from '@jbrowse/core/PluginManager'

export default function RepeatRendererF(pluginManager: PluginManager) {
  pluginManager.addRendererType(() => {
    // @ts-expect-error
    const RepeatRenderer = new rendererFactory(pluginManager)
    return new RepeatRenderer({
      name: 'RepeatRenderer',
      ReactComponent: RepeatRendering,
      configSchema,
      pluginManager,
    })
  })
}
