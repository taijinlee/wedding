APP_ROOT = $(shell pwd)
GIT_REV = $(shell git rev-parse --verify HEAD)
USER = "`whoami`+dev"
NODE_VERSION = v0.8.16

PATH := ${PATH}:${APP_ROOT}/vendor/nvm/${NODE_VERSION}/bin
export PATH

build-common:
	git submodule init; git submodule update
	. ${APP_ROOT}/vendor/nvm/nvm.sh; nvm install ${NODE_VERSION}
	`which npm` install

build-prod:
	APP_ROOT=${APP_ROOT} node config/build/webBuild.js

console: build-common
	NODE_ENV=dev APP_ROOT=${APP_ROOT} node

versions: build-common
	node config/util/packageVersions.js

test: build-common
	NODE_ENV=test APP_ROOT=${APP_ROOT} find specs -type f -a -name *.spec.js -exec ./node_modules/mocha/bin/mocha --globals requirejsVars -R list --require should {} \;

lint: build-common
	find . -type f -a ! -path './mytests/*' -a ! -path './.git/*' -a ! -path './web/*' -a ! -path './node_modules/*' -exec ./node_modules/jshint/bin/hint {} --config config/build/jshint.config.json \;
	find web -type f -a ! -path 'web/css/*' -a ! -path 'web/images/*' -a ! -path 'web/js/libs/*' -a ! -path 'web/js/templates/*' -a ! -path 'web/layout.html' -exec ./node_modules/jshint/bin/hint {} --config config/build/jshint.config.web.json \;

clean:
	rm -Rf web-build

sandbox: build-common
	NODE_ENV=dev APP_ROOT=${APP_ROOT} node config/build/mongoIndexes.js
	NODE_ENV=dev APP_ROOT=${APP_ROOT} USER=${USER} node app/server.js

dev: build-common
	NODE_ENV=dev APP_ROOT=${APP_ROOT} node config/build/mongoIndexes.js
	NODE_ENV=dev APP_ROOT=${APP_ROOT} ./node_modules/forever/bin/forever stop devserver.js
	NODE_ENV=dev APP_ROOT=${APP_ROOT} ./node_modules/forever/bin/forever start -l /service/log/forever.log -o /service/log/app.log -e /service/log/app-stderr.log -p /service/tmp --append devserver.js

prod: build-common build-prod
	NODE_ENV=prod APP_ROOT=${APP_ROOT} node config/build/mongoIndexes.js
	NODE_ENV=prod APP_ROOT=${APP_ROOT} GIT_REV=${GIT_REV} ./node_modules/forever/bin/forever stop app/server.js
	NODE_ENV=prod APP_ROOT=${APP_ROOT} GIT_REV=${GIT_REV} ./node_modules/forever/bin/forever start -l /service/log/forever.log -o /service/log/app.log -e /service/log/app-stderr.log -p /service/tmp --append app/server.js
