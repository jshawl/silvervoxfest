<?php
/** @var array    $attributes */
/** @var string   $content    */
/** @var WP_Block $block      */
?>

<div <?php echo get_block_wrapper_attributes() ?>>
  <div id="map-wrapper-outer">
    <div class="map-filter">
      <input type="search" placeholder="Filter">
    </div>
    <div id="map-wrapper-inner">
      <div id="map"></div>
    </div>
  </div>
</div>
