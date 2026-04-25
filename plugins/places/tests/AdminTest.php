<?php

class AdminTest extends WP_UnitTestCase
{
    public function setUp(): void
    {
        parent::setUp();
        update_option("sfmf_places_settings", [
            "sfmf_places_mapbox_access_token" => "pk.eyJ"
        ]);
    }

    public function tearDown(): void
    {
        delete_option("sfmf_places_settings");
        parent::tearDown();
    }

    public function test_admin_init_integration()
    {
        $admin = new SFMF_Admin(SFMF_PLUGIN_FILE);
        wp_set_current_user(
            $this->factory->user->create(["role" => "administrator"]),
        );
        $this->assertNotFalse(
            has_action(
                "admin_init",
                [$admin, "settings_init"]
            ),
        );
        ob_start();
        $admin->settings_init();
        do_settings_sections("sfmf_places_settings");
        $output = ob_get_clean();
        $this->assertStringContainsString(
            'name="sfmf_places_settings[sfmf_places_mapbox_access_token]"',
            $output,
        );
    }

    public function test_action_links_filter_is_registered()
    {
        $file = SFMF_PLUGIN_FILE;
        new SFMF_Admin($file);

        $links = apply_filters(
            'plugin_action_links_' . plugin_basename($file),
            ['deactivate']
        );

        $this->assertStringContainsString('options-general.php?page=sfmf_places_settings', $links[0]);
    }

    public function test_sanitize_strips_html()
    {
        $admin = new SFMF_Admin(SFMF_PLUGIN_FILE);
        $result = $admin->sanitize([
            'sfmf_places_mapbox_access_token' => 'pk.eyJ<script>alert(1)</script>'
        ]);
        $this->assertEquals('pk.eyJ', $result['sfmf_places_mapbox_access_token']);
    }

    public function test_settings_page_is_added()
    {
        $admin = new SFMF_Admin(SFMF_PLUGIN_FILE);
        wp_set_current_user($this->factory->user->create(['role' => 'administrator']));

        do_action('admin_menu');

        global $submenu;
        $this->assertArrayHasKey('options-general.php', $submenu);

        $slugs = array_column($submenu['options-general.php'], 2);
        $this->assertContains('sfmf_places_settings', $slugs);
    }

    public function test_settings_html_renders_form()
    {
        $admin = new SFMF_Admin(SFMF_PLUGIN_FILE);

        ob_start();
        set_current_screen('options_page_sfmf_places_settings');
        global $pagenow, $plugin_page;
        $pagenow = 'options-general.php';
        $plugin_page = 'sfmf_places_settings';
        $admin->settings_html();
        $output = ob_get_clean();

        $this->assertStringContainsString('<div class="wrap">', $output);
        $this->assertStringContainsString('action="options.php"', $output);
        $this->assertStringContainsString('method="post"', $output);
    }
}
