<?php

/**
 * Plugin Name: Places
 * Description: Adds the "Places" custom post type
 * Version: 1.0
 * Author: Jesse Shawl
 * Author URI: https://jesse.sh/
 * License: GPLv2 or later
 */


add_action('plugins_loaded', function () {
    require_once plugin_dir_path(__FILE__) . 'includes/admin.php';
    new SFMF_Admin(__FILE__);
    require_once plugin_dir_path(__FILE__) . 'includes/blocks/map/map.php';
    new SFMF_Map();
    require_once plugin_dir_path(__FILE__) . 'includes/post-types/place.php';
    new SFMF_Place();
});
