APP_ROOT = `pwd`
GIT_REV = `git rev-parse --verify HEAD`
USER = "`whoami`+dev"

console:
	NODE_ENV=dev APP_ROOT=${APP_ROOT} node

versions:
	node config/util/packageVersions.js

test:
	NODE_ENV=test APP_ROOT=${APP_ROOT} find specs -type f -a -name *.spec.js -exec ./node_modules/mocha/bin/mocha --globals requirejsVars -R list --require should {} \;

lint:
	find . -type f -a ! -path './mytests/*' -a ! -path './.git/*' -a ! -path './web/*' -a ! -path './node_modules/*' -exec ./node_modules/jshint/bin/hint {} --config config/build/jshint.config.json \;
	find web -type f -a ! -path 'web/css/*' -a ! -path 'web/images/*' -a ! -path 'web/js/libs/*' -a ! -path 'web/js/templates/*' -a ! -path 'web/layout.html' -exec ./node_modules/jshint/bin/hint {} --config config/build/jshint.config.web.json \;

build:
	APP_ROOT=${APP_ROOT} node config/build/webBuild.js

clean:
	rm -Rf web-build

run-dev:
	NODE_ENV=dev APP_ROOT=${APP_ROOT} node config/build/mongoIndexes.js
	NODE_ENV=dev APP_ROOT=${APP_ROOT} USER=${USER} node app/server.js

run-prod:
	NODE_ENV=prod APP_ROOT=${APP_ROOT} node config/build/mongoIndexes.js
	NODE_ENV=prod APP_ROOT=${APP_ROOT} GIT_REV=${GIT_REV} node app/server.js
