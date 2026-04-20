<?php

/**
 * Plugin Name: Places
 * Description: Adds the "Places" custom post type
 * Version: 1.2604200554
 * Author: Jesse Shawl
 * Author URI: https://jesse.sh/
 * License: GPLv2 or later
 */


add_action('plugins_loaded', function () {
    require_once plugin_dir_path(__FILE__) . 'includes/post-types/place.php';
    require_once plugin_dir_path(__FILE__) . 'includes/blocks/map/map.php';
    new SFMF_Place();
    new SFMF_Map();
});
