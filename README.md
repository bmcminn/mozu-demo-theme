
# Getting Your Mozu Theme Development Environment Up and Running

Before we get started, you should have the following software(s) setup:

1. A text editor/IDE:
	- [Sublime Text](http://www.sublimetext.com/) and [Atom](https://atom.io/) are good cross-platform options (Win/OSX/Linux), but there are others available:
		- Windows: [Visual Studio Express](http://www.visualstudio.com/downloads/download-visual-studio-vs), [Notepad++](http://notepad-plus-plus.org/)
		- OSX: [Coda](https://panic.com/coda/), [Textmate](http://macromates.com/)
		- Linux: [Neovim](http://neovim.org/), Vim/Vi, Emacs, Komodo, etc.
1. A terminal/shell application:
	- Windows: [Git Bash](https://msysgit.github.io/), Cmd/PowerShell (standard)
	- OSX: [iTerm](http://iterm2.com/), Mac Terminal (standard)
	- Linux: Konsole (standard)
		- You probably have a preferred shell anyway, so by all means.

---

**NOTE:** For the purpose of this tutorial, we will use BASH shell as it is widely supported in many UNIX environments.

For Windows users, we recommend using Git Bash as it is a fully featured terminal application that works consistently with existing BASH flavors on UNIX systems. If you prefer Cmd/PowerShell, you may need to use different commands to complete this tutorial.

---

## Installation

1. Install Git, Python, and/or Node.js binaries as needed:
	- **Git**: [http://git-scm.com/downloads](http://git-scm.com/downloads)
		- We suggest that Windows folks install Git Bash when prompted
		- After it is installed, open Git Bash from the Start Menu and continue
	- **Python**: [https://www.python.org/downloads/release/python-2710/](https://www.python.org/downloads/release/python-2710/)
		- **NOTE: _WINDOWS USERS_:**  It is possible you do not have Python installed which is required for `node-gyp` to build correctly.
	- **Node.js**: [http://nodejs.org/dist](http://nodejs.org/dist)
		- **NOTE:**: Node 4.0.0 is currently unsupported by Mozu/Enablement Services as we have not been able to properly vet it against our build tools. Please use a Node version of 0.12.X for the time being.
		- For Linux Ubuntu/Debian users, we suggest installing Node.js with NVM
			- [https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-an-ubuntu-14-04-server#how-to-install-using-nvm](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-an-ubuntu-14-04-server#how-to-install-using-nvm)
	- **NOTE:** If you want to get fancy with using package control systems like [Homebrew](http://brew.sh/) (OSX), [Chocolatey](https://chocolatey.org/) (Windows), or [apt-get](https://help.ubuntu.com/community/AptGet/Howto) (Linux Ubuntu/Debian), I would highly suggest doing so, but that is beyond the scope of this tutorial.


## Check your work

1. Open a terminal and enter the following commands:
	- You can ignore the comments (`# < this is a comment`)

	``` bash
	$ git --version   # should be 2.X.X+
	$ python -V       # should be ~2.7.X+
	$ node -v         # should be 0.12.X+
	$ npm -v          # should be 2.X.X+
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

1. Once we are inside the project folder (`~/github/mozu-demo-theme`) we will need to duplicate the `mozu.config.json.base` file and rename it `mozu.config.json`.
	- **NOTE:** We will configure `mozu.config.json` during the training course.

1. Next we will run the following commands to configure our project and install our node dependencies:

	``` bash
	$ git checkout training
	# Wait for it to process...

	$ npm i
	# Wait for it to process...

	$ grunt updatereferences
	# Wait for it to process...
	```

1. Last step is to test your setup by running `grunt` to initialize a build:

	``` bash
	$ grunt         # quick and painless, should create a theme-files.zip
	# OR
	$ grunt build   # takes longer, but is production ready
	```

1. Once the build runs without fail, you're ready to get started!


## Working through the exercises

During the training course/webinar, feel free to code along with our instructor, or if you get lost, you can copy the completed exercise assets from the respective `FED Exercises/Exercise #` folder into the root of this project directory and follow along that way.


Happy Coding!
