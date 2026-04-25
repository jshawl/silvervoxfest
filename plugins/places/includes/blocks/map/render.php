<?php
/** @var array    $attributes */
/** @var string   $content    */
/** @var WP_Block $block      */
?>

<div <?php echo get_block_wrapper_attributes() ?>>
  <script>
    globalThis.SFMF ??= {}
    globalThis.SFMF.mapboxAccessToken = "<?php echo get_option("sfmf_places_settings")["sfmf_places_mapbox_access_token"]; ?>";
  </script>
  <?php require_once plugin_dir_path(__FILE__) . "template.html"; ?>
</div>
