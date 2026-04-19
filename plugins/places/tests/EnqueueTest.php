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
}
?>