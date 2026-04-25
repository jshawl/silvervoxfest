<?php
/** @var array    $attributes */
/** @var string   $content    */
/** @var WP_Block $block      */
?>

<div <?php echo get_block_wrapper_attributes() ?>>
  <?php require_once plugin_dir_path(__FILE__) . "template.html"; ?>
</div>
