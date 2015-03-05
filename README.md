# The Mozu Base Blank Theme

The Mozu Base Blank Theme extends the Mozu Core6 Theme by default. This theme is a good starting point for Mozu theme development. For information on the Mozu Core Theme, refer to the [Mozu Core Theme repository](https://github.com/Mozu/core-theme).

## Build Tooling Requirements

This theme includes a set of build tools. These tools work on Windows 7 and later, Mac OSX 10.4 and later, and most modern Linux distros. To use them, here's what you need.

* [NodeJS](http://nodejs.org) > 0.10.0 
* [Git](http://git-scm.com/) or another command-line-based version control system if you want to control versioning with packages

If you want to use the build tools, run the following from a command line in your new theme directory:
```bash
  node configure.js
```

This command installs two global command line utilities, Grunt (for running build tasks) and Bower (for managing frontend packages). This command also installs local development dependencies for your theme in the `node_modules` folder, and the Core themes in the `references` folder.

## Getting Started

1.  Create your new theme in the [Mozu Developer Center](https://developer.mozu.com/Console/theme). **The theme creation workflow in Dev Center no longer gives you a base blank theme to download. Instead, download a new copy of this theme (use the most current release in the [Releases](https://github.com/mozu/base-blank-theme/releases) tab).**

2.  Install the build tools by running the `node configure.js` command described in the [Build Tooling Requirements](#build-tooling-requirements) section.

3. Design your theme. If you're starting from scratch, begin by editing `theme.json` and setting the name of your new theme.

## Theme Development Best Practices

*   Use the `references/core6` directory as a reference. The theme you're building inherits from the Core6 base theme by default. For each file you discover you need to override, copy the Core6 version from your `references/core6` folder and into the corresponding location in your own theme. 

*   Use the `references/core4` and `references/core5` directory as references. If you're experienced building themes on Core4 or Core5, you can use the side-by-side Core directories to compare and contrast for relevant Core6 changes.

*   You should regularly synchronize your theme with the Mozu Dev Center. The build tools help you by automatically checking your scripts for common errors, then building a named and tagged zipfile for you to upload. If you have installed the build tools, the basic command you can run to do this is `grunt`.

## Command reference

All commands should be run from a command line (Terminal in OSX, Command Prompt in Windows) in the root directory of your theme.

### Install build tools
```bash
node configure.js
```

### Build theme into a zipfile, checking for errors and updates along the way
```bash
grunt
```
The name of the zipfile is taken from your `package.json` file. This file manages the build tools' dependencies on npm modules and establishes its identity as a "package". Therefore we use the name from this configuration as the filename for a generated zip. Unless you publish your theme to a package registry (which is not common), this name won't be used for any other purpose.

### Build and create a release with a synchronized version number across package.json, theme.json, etc
```bash
grunt release --to 1.2.3
```
Replace `1.2.3` with the desired version number.

### Update your references directory with released patches or updates to the Core themes
```bash
grunt updatereferences
```

### Add source control integration to your build process
```bash
grunt setup-vcs-tagging
```
This command configures your build system so that your zipfile names are appended with an abbreviation of the current Git commit hash. If you're not using Git source control, but your source control system has a command which would output a unique commit/changeset/version ID, then you can supply it to this command with the option `--tagcmd`.

```
grunt setup-vcs-tagging --tagcmd="hg id -i"
```
This command configures the build system so that zipfile names are appended with a Mercurial ID from a Mercurial repository instead of a Git repository.

**Note: This command can only be run safely once, since it modifies code in the Gruntfile. To make this change manually, look for the variable `versionCmd` inside your `Gruntfile.js` file.**

## Troubleshooting

Issue               | Platform | Suggestion
:------------------ | -------- |:---------
**Configure script fails with `EACCES` error on `/usr/local`** | OSX or Linux | If your `node configure.js` script fails on its first task (installing global Grunt), you may have a permissions issue installing global NPM modules. This is very common and a frequently advised solution is to run the install command with `sudo`. We advise instead to change the permissions appropriately on your global NPM module directory and cache, which by convention should not contain privileged files. Run `sudo chown -R $(whoami) $(npm prefix -g) && sudo chown -R $(whoami) $(npm get cache)` instead.
**Configure script fails on `updatereferences` task** | OSX or Linux | If your `node configure.js` script fails on its last task (running the `grunt updatereferences` task), you may not have Git installed. On OSX, your system may show a dialog suggesting that you install XCode to install Git. Installing XCode will work, though it takes a long time and is very large. You can also install the OSX git client directly, through http://git-scm.com/download/mac or through an OSX package manager like Homebrew.
**Configure script fails on `npm link bower` task** | Windows 7 | You're running an old version of the build scripts that used `npm link`, a command which requires administrator access in Windows 7. The current version of the build tools doesn't use this command!
**Configure script fails on `updatereferences` task** | Windows | If your `node configure.js` script fails on its last task (running the `grunt updatereferences` task), you may not have Git installed. Install Git for Windows using a Windows package manager like Chocolatey, or through the installer at http://git-scm.com.

