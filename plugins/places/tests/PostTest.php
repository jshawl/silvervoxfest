<?php

class PostTest extends WP_UnitTestCase
{
    public function test_meta_boxes_are_registered()
    {
        wp_set_current_user($this->factory->user->create(['role' => 'administrator']));

        new SFMF_Admin(SFMF_PLUGIN_FILE);
        do_action('add_meta_boxes');

        global $wp_meta_boxes;
        $this->assertArrayHasKey('meta_box_address', $wp_meta_boxes['place']['normal']['high']);
        $this->assertArrayHasKey('meta_box_url', $wp_meta_boxes['place']['normal']['high']);
    }

    public function test_meta_box_renders_saved_value()
    {
        $post_id = $this->factory->post->create(['post_type' => 'place']);
        update_post_meta($post_id, '_place_url', 'https://example.com/');
        update_post_meta($post_id, '_place_address', '123 Main St');

        $post = new SFMF_Place(SFMF_PLUGIN_FILE);
        ob_start();
        $post->render_place_url_meta_box(get_post($post_id));
        $output = ob_get_clean();
        $this->assertStringContainsString('value="https://example.com/"', $output);
        $this->assertStringContainsString('name="place_nonce"', $output);

        ob_start();
        $post->render_place_address_meta_box(get_post($post_id));
        $output = ob_get_clean();
        $this->assertStringContainsString('value="123 Main St"', $output);
    }

    public function test_post_type_meta()
    {
        new SFMF_Place(SFMF_PLUGIN_FILE);
        wp_set_current_user(
            $this->factory->user->create(["role" => "administrator"]),
        );
        $post_id = $this->factory->post->create(['post_type' => 'place']);
        $_POST['_place_url'] = 'https://example.com';
        $_POST['_place_address'] = '123 Main St';
        $_POST['place_nonce'] = wp_create_nonce('place_meta_nonce');

        add_filter('pre_http_request', function ($preempt, $args, $url) {
            return [
                'response' => ['code' => 200],
                'body'     => json_encode([['lat' => '1.23', 'lon' => '4.56']]),
            ];
        }, 10, 3);
        do_action('save_post_place', $post_id, get_post($post_id), true);

        $this->assertEquals('https://example.com', get_post_meta($post_id, '_place_url', true));
        $this->assertEquals('1.23', get_post_meta($post_id, '_place_lat', true));
        $this->assertEquals('4.56', get_post_meta($post_id, '_place_lng', true));
    }

    public function test_rest_fields_are_registered()
    {
        new SFMF_Place(SFMF_PLUGIN_FILE);

        do_action('rest_api_init');

        global $wp_rest_additional_fields;
        $this->assertArrayHasKey('place', $wp_rest_additional_fields);
        $this->assertArrayHasKey('address', $wp_rest_additional_fields['place']);
        $this->assertArrayHasKey('lat', $wp_rest_additional_fields['place']);
        $this->assertArrayHasKey('lng', $wp_rest_additional_fields['place']);
        $this->assertArrayHasKey('url', $wp_rest_additional_fields['place']);
    }
}
