This repo can be used as a template to create Cinnamon applets with Typescript and webpack support (which allows to use node packages).

# Installation

1. Clone this repo into a folder with the name pattern `[appletName]@[authorName]` e.g.

```
git clone git@github.com:jonath92/cinnamon-template-applet.git myApplet@jonath92
```

> :exclamation: The naming convention must be retained as the build process otherwilse won't work

2. change into the directory:

```
cd [appletName]@[authorName]
```

3. Install the node dependencies

```
npm i
```

4. Insall xdotool:

```
sudo apt install xdotool
```

5. Build the applet

```
npm run build
```

6. Open the Cinnamon Applets Dialogue and search for `[appletName]@[authorName]`

![screenshot](./screenshot.png)

# Configuration

The three files created in the `files/appletName]@[authorName]` will be overwritten each time calling the command `npm run build` and therefore should be untouched.

For setting the Applet metadata (e.g. the name and description shown in the Cinnamon Applets Dialogue) change the variables in the `webpack.config.js` file.

It is no problem to add more files (such as a `icon.png` which is required to publish the applet) to the `files/appletName]@[authorName]` directory - all files excepct from the three auto generated files will be untouched when running the build command.

It is also no problem to rename the applet by changing the parent direcoty name. In that case it will be generated a new directory inside the `files` directory when running `npm run build`. However additional files added to the `files/appletName]@[authorName]` directory must be copied to the new folder manually and also the old directory must be deleted manually (therefore it might be necessary to run the build command twice to fully apply the changes)
