<?php
/** @var array    $attributes */
/** @var string   $content    */
/** @var WP_Block $block      */
?>

<div <?php
  $height = empty($attributes["height"]) ? "500px" : $attributes["height"];
echo get_block_wrapper_attributes(["style" => "height: " . $height ]) ?>>
  <script>
    globalThis.SFMF ??= {};
    <?php
    $settings = get_option("sfmf_places_settings");
if ($settings) {
    $token = $settings["sfmf_places_mapbox_access_token"];
    echo "globalThis.SFMF.mapboxAccessToken = \"".$token."\"";
}
?>
  </script>
  <?php require_once plugin_dir_path(__FILE__) . "template.html"; ?>
</div>
