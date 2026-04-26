<?php
/** @var array    $attributes */
/** @var string   $content    */
/** @var WP_Block $block      */
?>

<div <?php
 $settings = get_option("sfmf_places_settings");
$token = "";
if ($settings) {
    $token = $settings["sfmf_places_mapbox_access_token"];
}
$height = empty($attributes["height"]) ? "500px" : $attributes["height"];
echo get_block_wrapper_attributes([
  "style"                    => "height: " . $height,
  "data-mapbox-access-token" => $token
  ]) ?>>
  <?php require_once plugin_dir_path(__FILE__) . "template.html"; ?>
</div>
