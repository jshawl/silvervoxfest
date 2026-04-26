 <?php

class EnqueueTest extends WP_UnitTestCase
{
    public function setUp(): void
    {
        parent::setUp();
    }

    public function test_custom_post_type_is_registered()
    {
        $place = new SFMF_Place();
        $place->register();

        $this->assertTrue(post_type_exists('place'));
    }

    public function test_block_is_registered()
    {
        WP_Block_Type_Registry::get_instance()->unregister('places/map');
        $map = new SFMF_Map();
        $map->register();
        $this->assertTrue(
            WP_Block_Type_Registry::get_instance()->is_registered('places/map')
        );
    }

    public function test_block_renders()
    {
        $block = new WP_Block([
            'blockName' => 'places/map',
        ]);
        $output = $block->render();
        $this->assertStringNotContainsString('mapboxAccessToken', $output);
        update_option("sfmf_places_settings", [
            "sfmf_places_mapbox_access_token" => "pk.eyJ"
        ]);
        $output = $block->render();
        $this->assertStringContainsString('data-mapbox-access-token="pk.eyJ', $output);
        $this->assertStringContainsString('height: 500px', $output);
    }

    public function test_block_height()
    {
        $block = new WP_Block([
            'blockName' => 'places/map',
            'attrs'     => ['height' => '123px']
        ]);
        $output = $block->render();
        $this->assertStringContainsString('height: 123px', $output);
    }
}
?>