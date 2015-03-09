# Getting Your Mozu Theme Development Environment Up and Running

> https://gist.github.com/bmcminn/635e8e763b3de232e8a6

Before we get started, you should have the following software(s) setup:

1. A text editor/IDE:
  - [Sublime Text](http://www.sublimetext.com/) and [Atom](https://atom.io/) are good cross-platform options (Win/OSX/Linux), but there are others available:
    - Windows: [Visual Studio Express](http://www.visualstudio.com/downloads/download-visual-studio-vs), [Notepad++](http://notepad-plus-plus.org/)
    - OSX: [Coda](https://panic.com/coda/), [Textmate](http://macromates.com/)
    - Linux: [Neovim](http://neovim.org/), Vim/Vi, Emacs, Komodo, etc.
1. A terminal application:
  - Windows: [Git Bash](https://msysgit.github.io/), Cmd/PowerShell (standard)
  - OSX: [iTerm](http://iterm2.com/), Mac Terminal (standard)
  - Linux: Konsole (standard) or any terminal that comes with your flavor of Linux

---

**NOTE:** For the purpose of this tutorial, we will use BASH shell as it is widely supported in many UNIX environments.

For Windows users, we recommend using Git Bash as it is a fully featured terminal application that works consistently with existing BASH flavors on UNIX systems. If you prefer Cmd/PowerShell, you may need to use different commands to complete this tutorial.

---


1. Install Git and/or Node.js binaries as needed:
    - Git: http://git-scm.com/downloads
      - We suggest Windows folks install Git Bash when prompted
      - After it is installed, open Git Bash from the Start Menu and continue
    - Node.js: http://nodejs.org/dist/
      - **NOTE:** Make sure to install node.js version <=0.11.12
        - There are some breaking changes in later Node.js versions that affect our current build chain
      - For Linux Ubuntu/Debian users, we suggest installing Node.js with NVM
        - https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-an-ubuntu-14-04-server#how-to-install-using-nvm
  - **NOTE:** If you want to get fancy with using package control systems like [Homebrew](http://brew.sh/) (OSX), [Chocolatey](https://chocolatey.org/) (Windows), or [apt-get](https://help.ubuntu.com/community/AptGet/Howto) (Linux Ubuntu/Debian), I would highly suggest doing so, but that is beyond the scope of this tutorial.

#### Check your work

Open a terminal and enter the following commands:
  - You can ignore the comments (`# < this is a comment`)

    ``` bash
    $ git --version   # should be 1.9.0+
    $ node -v         # should be 0.10.28+ and <=0.11.12
    $ npm -v          # should be 1.3.0+
    ```

1. We'll need a projects folder to host our theme(s), so in terminal, enter the following commands:

    ``` bash
    $ mkdir ~/github && cd $_
    $ git clone https://github.com/mozu/base-blank-theme.git demo-theme && cd $_
    ```

1. Once we're inside the local repo folder (`~/github/demo-theme`), we'll run the following commands to configure our project and install our node dependencies:

    ``` bash
    $ node configure.js

    > # this will take a minute, though you should get a confirmation
    > # message similar to this:
    >> Done! Your system and this directory are now set up to work with Mozu themes.
    ```

1. Last step is to test your setup by running `grunt` to initialize a build:

    ``` bash
    $ grunt build
    ```

1. Once the setup and build runs without fail, you're ready to get started!
