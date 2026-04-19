 <?php

class AdminTest extends WP_UnitTestCase
{
    private SFMF_Export $plugin;
    public function setUp(): void
    {
        parent::setUp();
        wp_set_current_user(
            WP_UnitTestCase_Base::factory()->user->create(["role" => "administrator"])
        );
        $this->plugin = new SFMF_Export();
    }

    public function test_menu()
    {
        do_action('admin_menu');
        global $submenu;
        $this->assertArrayHasKey('tools.php', $submenu);
        $slugs = array_column($submenu['tools.php'], 2);
        $this->assertContains('gf-export', $slugs);
    }

    public function test_admin_page()
    {
        do_action('admin_menu');
        set_current_screen('tools_page_gf-export');
        global $pagenow, $plugin_page;
        $pagenow = 'tools.php';
        $plugin_page = 'gf-export';
        ob_start();
        $this->plugin->settings_page_html();
        $output = ob_get_clean();
        $this->assertStringContainsString('Export Volunteers', $output);
        $this->assertStringContainsString('Download CSV', $output);
    }

    public function test_csv()
    {
        ob_start();
        try {
            $this->plugin->export_volunteers_handler();
        } catch (WPDieException $e) {
            // expected — wp_die() at end of handler
        }
        $output = ob_get_clean();
        $this->assertStringContainsString('Name,Email', $output);
    }
}
?>