 <?php

class AdminTest extends WP_UnitTestCase
{
    public function test_menu()
    {
        $export = new SFMF_Export();
        wp_set_current_user(
            WP_UnitTestCase_Base::factory()->user->create(["role" => "administrator"])
        );

        $this->assertNotFalse(
            has_action(
                "admin_menu",
                [$export, "add_settings_page"],
            ),
        );
    }
}
?>