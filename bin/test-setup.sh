#!/bin/sh

for plugin in plugins/*; do
    wp-env run tests-cli --env-cwd=wp-content/$plugin composer update
    wp-env run tests-cli -- sudo pecl install pcov > /dev/null 2>&1
    wp-env run tests-cli bash -- -c 'echo "extension=pcov" | sudo tee /usr/local/etc/php/conf.d/99-pcov.ini > /dev/null'
    wp-env run tests-cli bash -- -c 'echo "pcov.enabled=1" | sudo tee -a /usr/local/etc/php/conf.d/99-pcov.ini > /dev/null'
done
