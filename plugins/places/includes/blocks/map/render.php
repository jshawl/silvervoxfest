<?php
/** @var array    $attributes */
/** @var string   $content    */
/** @var WP_Block $block      */
?>

<div <?php echo get_block_wrapper_attributes() ?>>
  <div id="map-wrapper-outer">
    <div class="map-filter">
      <div class="flex">
        <input type="search" placeholder="Filter">
        <span class="dashicons dashicons-no-alt close-filter" aria-label="Close"></span>
      </div>
      <div class="no-results hidden filter-item">No results.</div>
    </div>
    <div id="map-wrapper-inner">
      <div id="map"></div>
    </div>
  </div>
</div>
