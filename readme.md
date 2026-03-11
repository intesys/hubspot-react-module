# HubSpot React Module

Use this package to scaffold HubSpot modules powered by React.

The template compiles React and TypeScript source code into HubSpot-compatible module files using Rolldown.

## Overview

This package provides:

- a scaffolding command for creating new HubSpot modules
- a React + TypeScript module structure
- a development workflow for local build and HubSpot sync

## Installation

Install the package as a development dependency:

`npm i -D https://github.com/intesys/hubspot-react-module.git`

## Create a Module

Run the scaffold command:

`npm exec create-hubspot-react-module [path/to/folder.module] [module-name]`

The command creates a new module in the target directory.

## Workspace Setup (Recommended)

If you use npm workspaces, add the generated module path to `package.json`:

```json
{
  "workspaces": ["path/to/folder.module"]
}
```

Then run module-specific scripts with:

`npm run -w folder.module [command]`

## Development Workflow

### 1. Start the module build watcher

`npm run -w folder.module dev`

This command watches React source files and rebuilds the module on change.

### 2. Sync changes to HubSpot

In a second terminal, run your HubSpot watch script.

Example root `package.json` scripts:

```json
{
  "scripts": {
    "init": "hs init",
    "download": "hs fetch --account=production --overwrite theme_name",
    "upload": "hs upload --account=production theme_name",
    "watch": "hs watch --account=production theme_name",
    "hs": "hs"
  }
}
```

Start sync with:

`npm run watch`

After sync completes, reload the page where the module is used to verify changes.

## Authoring Guidelines

### CSS

Define styles in `module.css` and use standard React `className` attributes to match selectors.

### HubSpot fields

HubSpot module properties are configured as fields in the page builder.

Recommended workflow:

- create the module locally: `npm exec create-hubspot-react-module [path/to/folder.module] [module-name]`
- upload to HubSpot: `npm run upload`
- add fields in the HubSpot web app
- download the updated module: `npm run download`
- review field definitions in `fields.json`
- use field values in your React component props