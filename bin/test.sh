#!/bin/sh

wp-env run tests-cli --env-cwd=wp-content/plugins/export-volunteers vendor/bin/phpunit --coverage-html coverage/php