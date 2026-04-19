#!/bin/sh

for plugin in plugins/*; do
    cd $plugin
    npm test
    cd -
    wp-env run tests-cli --env-cwd=wp-content/$plugin vendor/bin/phpunit --coverage-html coverage/php
done
