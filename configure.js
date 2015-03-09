var childProcess = require('child_process'),
  windows = /^win/.test(process.platform);
(function(cmds, done) {
  return cmds.reduceRight(function(cb, command) {
    return function() {
      console.log('\n>> ' + command.msg + "...");
      // the below platform sniff courtesy of https://github.com/joyent/node/issues/2318
      if (windows) command.cmd = 'cmd /c ' + command.cmd;
      var cmd = command.cmd.split(' ');
      var p = childProcess.spawn(cmd[0], cmd.slice(1), { stdio: 'inherit' });
      p.on('close', function(code) {
        if (code !== 0) {
          if (command.err) {
            if (command.err(code) === true) {
              cb();
            }
          } else {
            console.error('\n>> Command `' + cmd.join(' ') + '` exited with code ' + code + '. Aborting rest of configure.');
          }
        } else {
          cb();
        }
      });
    }
  }, done);
})([
  {
    msg: 'Installing global Grunt',
    cmd: 'npm install -g grunt-cli',
    err: function(code) {
      if (!windows) {
        console.error('\n>> Installing global Grunt failed. Your directory permissions may be wrong. Try running this: \n\n\   sudo chown `whoami` `npm prefix -g` && sudo chown `whoami` `npm get cache`');
      }
    }
  },
  {
    msg: 'Installing global Bower',
    cmd: 'npm install -g bower'
  },
  {
    msg: 'Installing local npm dependencies',
    cmd: 'npm install'
  },
  {
    msg: 'Running grunt updatereferences task to install core theme references',
    cmd: 'grunt updatereferences'
  }
], function() {
    console.log('\n>> Done! Your system and this directory are now set up to work with Mozu themes.\n');
    process.exit(0);
})();
