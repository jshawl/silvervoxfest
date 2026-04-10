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

    wp_enqueue_style(
        'map-mapbox-style',
        'https://api.mapbox.com/mapbox-gl-js/v3.20.0/mapbox-gl.css',
        [],
        false
    );

    wp_enqueue_style('dashicons');

    wp_register_script(
        'map-editor-script',
        PLACES_MAP_URL . 'editor.js',
        [ 'wp-blocks', 'wp-element', 'wp-block-editor' ],
        filemtime(PLACES_MAP_DIR . 'editor.js'),
        true
    );

    wp_register_script(
        'map-view-script',
        PLACES_MAP_URL . 'view.js',
        [],
        filemtime(PLACES_MAP_DIR . 'view.js'),
        true,
        []
    );

    wp_enqueue_script(
        'map-mapbox-script',
        'https://api.mapbox.com/mapbox-gl-js/v3.20.0/mapbox-gl.js',
        [],
        false,
        true
    );

    register_block_type(PLACES_MAP_DIR);
}

add_action('init', 'places_map_register');
