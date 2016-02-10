var grunt = require('grunt')
  , pkg   = grunt.file.readJSON('./package.json')
  ;

module.exports = {
  pkg: pkg,
  packagedeps: {
    files: [
      {
        expand: true,
        cwd: 'node_modules/',
        src: Object.keys(pkg.dependencies || {}).map(function (dep) {
          var depPkg;
          if (pkg.exportsOverride && pkg.exportsOverride[dep]) {
            return pkg.exportsOverride[dep].map(function (o) {
              return dep + '/' + o;
            });
          } else {
            depPkg = require(dep + '/package.json');
            if (!depPkg.main) {
              try {
                depPkg = require(dep + '/bower.json');
              } catch (e) {}
            }
            return dep + (depPkg.main ? '/' + depPkg.main : '/**/*');
          }
        }).concat(['!node_modules/**/*']),
        dest: 'scripts/vendor/'
      }
    ]
  }
};
