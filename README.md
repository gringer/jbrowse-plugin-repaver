![Integration](git@github.com:gringer/jbrowse-plugin-repaver/workflows/Integration/badge.svg?branch=main)

# jbrowse-plugin-repaver

REpetitive PAttern VisualisER for BED files created using Hashasher

This JBrowse2 plugin adds a new 'Repeat BED' track type to JBrowse2, which visualises
repetitive elements in sequences, showing distances between the elements via a
split log/linear scale.

## Getting started

### Development

To develop against JBrowse Web:

- Start a development version of JBrowse Web (see
  [here](https://github.com/GMOD/jbrowse-components/blob/master/CONTRIBUTING.md))
- In this project, run `yarn start` (or `npm run start`)
- Assuming JBrowse Web is being served on port 3000, navigate in your web
  browser to
  http://localhost:3000/?config=http://localhost:9000/jbrowse_config.json
- When you make changes to your plugin, it will automatically be re-built. You
  can then refresh JBrowse Web to see the changes.

**Note:** The current version of `jbrowse-plugin-template` is only compatible
with "JBrowse 2" v2.0 or greater. If you are developing for a version of
"JBrowse 2" v1.x, please consider upgrading, or you will have to manually
downgrade the package dependencies in this template to ensure compatibility.

### Testing

To test your plugin, there are several commands available:

#### `yarn browse` or `npm run browse`

Launches your local JBrowse 2 build that is used for integration testing, with
your plugin already included in the configuration. Your plugin must also be
running (`yarn start` or `npm run start`).

#### `yarn test` or `npm test`

Runs any unit tests defined during plugin development.

#### `yarn cypress:run` or `npm run cypress:run`

Runs the [cypress](https://www.cypress.io/) integration tests for your plugin.
Both the plugin and `browse` must already be running.

#### `yarn test:e2e` or `npm run test:e2e`

Starts up the JBrowse 2 build as well as your plugin, and runs the
[cypress](https://www.cypress.io/) integration tests against them. Closes both
resources after tests finish.

#### `yarn cypress` or `npm run cypress`

Launches the [cypress](https://www.cypress.io/) test runner, which can be very
useful for writing integration tests for your plugin. Both the plugin and
`browse` must already be running.

#### Github Action

This template includes a [Github action](https://github.com/features/actions)
that runs your integration tests when you push new changes to your repository.

### Publishing to NPM

Once you have developed your plugin, you can publish it to NPM. Remember to
remove `"private": true` from `package.json` before doing so.

### Using plugins with embedded components

If you are using plugins in the embedded apps such as
`@jbrowse/react-linear-genome-view`, then you can install jbrowse plugins such
as this one using normal "npm install jbrowse-plugin-yourplugin" if you have
published them to NPM, and use code like this

```typescript
import React from 'react'
import ViewType from '@jbrowse/core/pluggableElementTypes/ViewType'
import PluginManager from '@jbrowse/core/PluginManager'
import Plugin from '@jbrowse/core/Plugin'

// in your code
import { createViewState, JBrowseLinearGenomeView } from '@jbrowse/react-linear-genome-view'
import MyPlugin from 'jbrowse-plugin-yourplugin'

export const MyApp = () => {
  const state = createViewState({
    assembly: {/*...your assembly config...*/},
    plugins: [MyPlugin],
    tracks: [/*...your track configs...*/],
    location: 'ctgA:1105..1221',
  })

  return (
    <JBrowseLinearGenomeView viewState={state} />
  )
}
```

See https://jbrowse.org/storybook/lgv/main/?path=/docs/using-plugins--docs for
live example, and also method for loading plugins from urls instead of from NPM
in embedded

### Using plugins with JBrowse Web

If you are using JBrowse Web, after the plugin is published to NPM, you can use
[unpkg](https://unpkg.com/) to host plugin bundle. The plugin can then be
referenced by URL in the config.json

A JBrowse Web config using this plugin would look like this:

```json
{
  "plugins": [
    {
      "name": "MyProject",
      "url": "https://unpkg.com/jbrowse-plugin-my-project/dist/jbrowse-plugin-my-project.umd.production.min.js"
    }
  ]
}
```

You can also use a specific version in unpkg, such as
`https://unpkg.com/jbrowse-plugin-my-project@1.0.1/dist/jbrowse-plugin-my-project.umd.production.min.js`

### TypeScript vs. JavaScript

This template is set up in such a way that you can use both TypeScript and
JavaScript for development. If using only JavaScript, you can change
`src/index.ts` to `src/index.js`.

If using only TypeScript, you can remove `"allowJs": true` from `tsconfig.json`
and `"@babel/preset-react"` from `.babelrc` (and from "devDependencies" in
`package.json`).
