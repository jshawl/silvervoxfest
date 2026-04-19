#!/bin/sh

for plugin in plugins/*; do
    wp-env run tests-cli --env-cwd=wp-content/$plugin vendor/bin/phpunit --coverage-html coverage/php
done
