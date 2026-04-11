<?php

defined('ABSPATH') || exit;
define('PLACES_MAP_DIR', plugin_dir_path(__FILE__));
define('PLACES_MAP_URL', plugin_dir_url(__FILE__));

function places_map_register()
{
    wp_register_style(
        'map-style',
        PLACES_MAP_URL . 'assets/style.css',
        [],
        filemtime(PLACES_MAP_DIR . 'assets/style.css')
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
        PLACES_MAP_URL . 'assets/editor.js',
        [ 'wp-blocks', 'wp-element', 'wp-block-editor' ],
        filemtime(PLACES_MAP_DIR . 'assets/editor.js'),
        true
    );

    wp_register_script_module(
        '@places/map',
        PLACES_MAP_URL . 'assets/map.js',
        [],
        filemtime(PLACES_MAP_DIR . 'assets/map.js')
    );

    wp_register_script_module(
        '@places/marker',
        PLACES_MAP_URL . 'assets/marker.js',
        [],
        filemtime(PLACES_MAP_DIR . 'assets/marker.js')
    );

    wp_register_script_module(
        '@places/filter',
        PLACES_MAP_URL . 'assets/filter.js',
        [],
        filemtime(PLACES_MAP_DIR . 'assets/filter.js')
    );

    wp_register_script_module(
        '@places/view',
        PLACES_MAP_URL . 'assets/view.js',
        ['@places/map', '@places/marker', '@places/filter'],
        filemtime(PLACES_MAP_DIR . 'assets/view.js')
    );
    wp_enqueue_script_module('@places/view');

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
