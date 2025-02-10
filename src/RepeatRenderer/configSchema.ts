import { ConfigurationSchema } from '@jbrowse/core/configuration'
import { types } from 'mobx-state-tree'

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
    displayStyle: {
      type: 'stringEnum',
      defaultValue: 'splay',
      model: types.enumeration('Display style', [
        'splay',
        'profile',
      ]),
      description:
          'Style of repeat visualisation',
    },
    F1colour: {
      type: 'color',
      description: 'the colour of the forward repeat instances',
      defaultValue: '#8b000080',
      contextVariable: ['feature'],
    },
    R1colour: {
      type: 'color',
      description: 'the colour of the reverse repeat instances',
      defaultValue: '#00A00080',
      contextVariable: ['feature'],
    },
    C1colour: {
      type: 'color',
      description: 'the colour of the complement repeat instances',
      defaultValue: '#0000FF80',
      contextVariable: ['feature'],
    },
    RC1colour: {
      type: 'color',
      description: 'the colour of the reverse-complement repeat instances',
      defaultValue: '#FF7F0080',
      contextVariable: ['feature'],
    },
    F2colour: {
      type: 'color',
      description: 'the colour of the forward repeat instance pairs',
      defaultValue: '#9000A080',
      contextVariable: ['feature'],
    },
    R2colour: {
      type: 'color',
      description: 'the colour of the reverse repeat instance pairs',
      defaultValue: '#A0900080',
      contextVariable: ['feature'],
    },
    C2colour: {
      type: 'color',
      description: 'the colour of the complement repeat instance pairs',
      defaultValue: '#00A09080',
      contextVariable: ['feature'],
    },
    RC2colour: {
      type: 'color',
      description: 'the colour of the reverse-complement repeat instance pairs',
      defaultValue: '#FDC08680',
      contextVariable: ['feature'],
    },
  },
  { explicitlyTyped: true },
)
