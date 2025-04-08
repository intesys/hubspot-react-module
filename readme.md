# Hubspot react module

If you want to use react in Hubspot modules, try using this template. It's based on React, Typescript and Parcel.

## Install

Add to your project as devDependency from github:

`npm i -D https://github.com/intesys/hubspot-react-module.git`

### Add a new module

`npm exec create-react-module [path/to/folder.module] [module-name]`

A new module will be created in the directory you set, and you can start coding your React components.

#### Using workspaces

I strongly suggest to add the new modules to npm workspace, in `package.json`:

```json
{
  "workspaces": [
    "path/to/folder.module"
  ]
}
```

Then you can run npm commands typing `npm run -w folder.module` [command]

## Development

### Step 1

`npm run -w folder.module dev`

It watches changes to react code and automatically builds the module. 

### Step 2

In order to test it, you have to open another terminal running hubspot sync.

A typical configuration is:

package.json
```json
{
  "scripts": {
    "init": "hs init",
    "download": "hs fetch --account=production --overwrite theme_name",
    "upload": "hs upload --account=production theme_name",
    "watch": "hs watch --account=production theme_name",
    "hs": "hs"
  },
}
```

Run sync with `npm run watch`. Now all changes are available in your production environment, just reload the page where your module is used.

## Development tips

### CSS

I suggest to write plain old css in `module.css`, use regular `className` attributes in react, to match CSS rules.