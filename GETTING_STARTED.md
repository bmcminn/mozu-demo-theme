# Getting Your Mozu Theme Development Environment Up and Running

Before we get started, you should have the following software(s) setup:

1. A text editor/IDE:
    - [Sublime Text](http://www.sublimetext.com/) and [Visual Studio Code](https://code.visualstudio.com/) are good cross-platform options (Win/OSX/Linux), but there are others available:
        - Windows:
            - [Visual Studio Express](http://www.visualstudio.com/downloads/download-visual-studio-vs)
            - [Notepad++](http://notepad-plus-plus.org/)
        - Mac OSX:
            - [Coda](https://panic.com/coda/)
            - [Textmate](http://macromates.com/)
        - Linux users usually have their preferred editors.
1. A terminal/shell application:
    - Windows: [Git Bash](https://msysgit.github.io/), Cmd/PowerShell (standard)
    - OSX: [iTerm](http://iterm2.com/), Mac Terminal (standard)
    - Linux: Konsole (standard)
        - You probably have a preferred shell anyway, so by all means.


-----

**NOTE:** For the purpose of this training session, we will use BASH shell as it is widely supported in many UNIX environments.


### FOR WINDOWS USERS

We recommend using [Git Bash//msysgit.github.io/) as it is a fully featured terminal application that works consistently with existing BASH flavors on UNIX systems.

Some other options:

- We also recommend setting up [Cmder](https://github.com/cmderdev/cmder) as this provides a much better developer experience with syntax highlighting and better tab completion for system commands and file path completion.
- If you prefer Cmd/PowerShell, you may need to use different commands to complete this tutorial, OR you may optionally install [GOW (Gnu on Windows)](https://github.com/bmatzelle/gow/wiki).



-----

## Installation

1. Install your text editor of choice:
    - I personally prefer Sublime Text and will be using it during the demonstration.
    - If you would like to use Sublime Text as well, I highly suggest installing the following Sublime Text packages:
        - Package Control: https://packagecontrol.io/installation
        - Djaneiro: [https://packagecontrol.io/packages/Djaneiro](https://packagecontrol.io/packages/Djaneiro)
        - Django:   [https://packagecontrol.io/packages/Django](https://packagecontrol.io/packages/Django)
        - LESS:     [https://packagecontrol.io/packages/LESS](https://packagecontrol.io/packages/LESS)
        - Emmet:    [https://packagecontrol.io/packages/Emmet](https://packagecontrol.io/packages/Emmet)
        - Alignment: [https://packagecontrol.io/packages/Alignment](https://packagecontrol.io/packages/Alignment)
    - These mostly provide syntax highlighting, however Django and Emmet provide code completion for common template tags to save time typing.
1. Be sure your shell application is running correctly.
1. Install Git, Python, and/or Node.js binaries as needed:
    - **Git**: [http://git-scm.com/downloads](http://git-scm.com/downloads)
        - We suggest that Windows folks install Git Bash when prompted
        - After it is installed, open Git Bash from the Start Menu and continue
    - **Node.js**: [http://nodejs.org/dist](http://nodejs.org/dist)
        - Node latest stable build (5.0.x+) should work just fine
        - For Linux Ubuntu/Debian users, we suggest installing Node.js with NVM
            - [https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-an-ubuntu-14-04-server#how-to-install-using-nvm](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-an-ubuntu-14-04-server#how-to-install-using-nvm)
    - **Yeoman**: [https://www.npmjs.com/package/yo](https://www.npmjs.com/package/yo)
        - Application scaffolding framework.
    - **Mozu Theme Generator**: [https://www.npmjs.com/package/generator-mozu-theme](https://www.npmjs.com/package/generator-mozu-theme)
        - Mozu theme scaffolding module for initializing.


## Check your work

1. Open your terminal and enter the following commands:
    - You can ignore the comments (`# < this is a comment`)

    ``` bash
    $ git --version   # should be 2.X.X+
    $ node -v         # should be 4.X.X+
    $ npm -v          # should be 3.X.X+; installed with Node.js
    $ yo -v           # should be 1.6.x+
    ```

    - Once these are installed correctly and returning the correct version number(s), move on to the next step.
    - **NOTE:** if you encountered an error here, refer to the above [Installation guide](#installation) for more information.

1. Next, we will need a project folder to host our theme(s), so in your shell app, enter the following commands:

    ``` bash
    $ mkdir ~/github
    $ cd github
    $ git clone https://github.com/bmcminn/mozu-demo-theme.git
    $ cd mozu-demo-theme
    ```

1. Next we will run the following commands to install our node dependencies and build our project:

    ``` bash
    $ npm i
    # Wait for it to finish processing...
    ```

1. If the build runs without fail, you're ready to get started!


## Final installation notes

We will be performing this same set of instructions as part of our theme setup check during training. However setting up your local dev environment prior to your scheduled training date helps to identify potential system issues ahead of time.



Happy Coding!
