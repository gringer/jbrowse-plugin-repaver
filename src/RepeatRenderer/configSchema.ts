import { ConfigurationSchema } from '@jbrowse/core/configuration'

export const configSchema = ConfigurationSchema(
  'RepeatRenderer',
  {
    /**
     * #slot
     */
    color: {
      type: 'color',
      description: 'the color of the marks',
      defaultValue: 'darkblue',
      contextVariable: ['feature'],
    },
  },
  { explicitlyTyped: true },
)
