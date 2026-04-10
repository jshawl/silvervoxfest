<?php

defined('ABSPATH') || exit;
define('PLACES_MAP_DIR', plugin_dir_path(__FILE__));
define('PLACES_MAP_URL', plugin_dir_url(__FILE__));

function places_map_register()
{
    wp_register_style(
        'map-style',
        PLACES_MAP_URL . 'style.css',
        [],
        filemtime(PLACES_MAP_DIR . 'style.css')
    );

    wp_register_script(
        'map-script',
        PLACES_MAP_URL . 'script.js',
        [ 'wp-blocks', 'wp-element', 'wp-block-editor' ],
        filemtime(PLACES_MAP_DIR . 'script.js'),
        true
    );

    register_block_type(PLACES_MAP_DIR);
}

add_action('init', 'places_map_register');
