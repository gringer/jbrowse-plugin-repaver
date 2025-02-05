import {
  getContainingTrack,
  getContainingView,
  getSession,
  isSelectionContainer,
  isSessionModelWithWidgets,
} from '@jbrowse/core/util'

import PluginManager from '@jbrowse/core/PluginManager'
import { Feature } from '@jbrowse/core/util'
import WigglePlugin from '@jbrowse/plugin-wiggle'

export function stateModelFactory(
  pluginManager: PluginManager,
  configSchema: any,
) {
  const { types } = pluginManager.lib['mobx-state-tree']
  const WigglePlugin = pluginManager.getPlugin('WigglePlugin') as unknown as WigglePlugin
  const { linearWiggleDisplayModelFactory } = WigglePlugin.exports
  return types.compose(
    'RepeatDisplay',
    linearWiggleDisplayModelFactory(pluginManager, configSchema),
    types
      .model({
        type: types.literal('RepeatDisplay'),
      })
      .views(() => ({
        get rendererTypeName() {
          return 'RepeatRenderer'
        },
        get needsScalebar() {
          return true
        },
        get regionTooLarge() {
          return false
        },
      }))
      .actions(self => ({
        /**
         * #action
         * this overrides the BaseLinearDisplayModel to avoid popping up a
         * feature detail display, but still sets the feature selection on the
         * model so listeners can detect a click
         */
        selectFeature(feature: Feature) {
          const session = getSession(self)
          if (isSessionModelWithWidgets(session)) {
            const featureWidget = session.addWidget(
              'BaseFeatureWidget',
              'baseFeature',
              {
                view: getContainingView(self),
                track: getContainingTrack(self),
                featureData: feature.toJSON(),
              },
            )

            session.showWidget(featureWidget)
          }
          if (isSelectionContainer(session)) {
            session.setSelection(feature)
          }
        },
      })),
  )
}

export type RepeatDisplayModel = ReturnType<typeof stateModelFactory>
