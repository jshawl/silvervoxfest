<?php


class SFMF_Admin
{
    public function __construct($file)
    {
        add_action('admin_menu', [ $this, 'add_settings_page' ]);
        add_action('admin_init', [$this, 'settings_init']);
        add_filter('plugin_action_links_' . plugin_basename($file), [$this,'action_links']);
    }

    public function action_links($links)
    {
        $settings_link = '<a href="' . admin_url('options-general.php?page=sfmf_places_settings') . '">' . __('Settings', 'places') . '</a>';
        array_unshift($links, $settings_link);
        return $links;
    }

    public function settings_init()
    {
        register_setting("places", "sfmf_places_settings", [$this, "sanitize"]);
        add_settings_section(
            "places_section",
            "",
            [$this, "settings_header"],
            "sfmf_places_settings",
        );
        add_settings_field(
            "sfmf_places_mapbox_access_token",
            __("Mapbox Access Token", "places"),
            [$this,"text_input"],
            "sfmf_places_settings",
            "places_section",
            [
            "label_for" => "sfmf_places_mapbox_access_token",
        ],
        );
    }

    public function sanitize($input)
    {
        $options = get_option("sfmf_places_settings", []);
        $output = $options;
        if (isset($input["sfmf_places_mapbox_access_token"])) {
            $output["sfmf_places_mapbox_access_token"] = sanitize_text_field(
                $input["sfmf_places_mapbox_access_token"],
            );
        }
        return $output;
    }

    public function text_input($args)
    {
        static $options = null;
        if ($options === null) {
            $options = get_option('sfmf_places_settings', []);
        }
        $value = "";
        if (isset($options[$args["label_for"]])) {
            $value = $options[$args["label_for"]];
        }

        ?>
	<input type="text"
           class="regular-text"
		   id="<?php echo esc_attr($args["label_for"]); ?>"
		   name="sfmf_places_settings[<?php echo esc_attr(
		       $args["label_for"],
		   ); ?>]"
		   value="<?php echo esc_attr($value); ?>" />
           
        <p class="description">
            <a href='https://docs.mapbox.com/help/dive-deeper/access-tokens/' target="_blank" rel="noopener noreferrer">Mapbox access tokens documentation</a>
        </p>
	<?php

    }

    public function add_settings_page()
    {

        add_options_page(
            __(
                "Places Settings",
                "places",
            ),
            __("Places", "places"),
            "manage_options",
            "sfmf_places_settings",
            [$this, "settings_html"],
        );
    }

    public function settings_html()
    {
        ?>
            <div class="wrap">
                <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
                <form action="options.php" method="post">
                <?php
        settings_fields("places");
        do_settings_sections("sfmf_places_settings");
        submit_button(__("Save Settings", "places"));
        ?>
                </form>
            </div>
        <?php
    }

    public function settings_header()
    {
        ?><p><?php
            esc_html_e('Configure settings for the places plugin and map below.', 'places'); ?>
        </p><?php
    }
}
