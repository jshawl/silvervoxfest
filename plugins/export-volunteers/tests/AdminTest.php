 <?php

class AdminTest extends WP_UnitTestCase
{
    public function setUp(): void
    {
        parent::setUp();
        wp_set_current_user(
            WP_UnitTestCase_Base::factory()->user->create(["role" => "administrator"])
        );
    }

    public function test_menu()
    {
        do_action('admin_menu');
        global $submenu;
        $this->assertArrayHasKey('tools.php', $submenu);
        $slugs = array_column($submenu['tools.php'], 2);
        $this->assertContains('gf-export', $slugs);
    }
}
?>