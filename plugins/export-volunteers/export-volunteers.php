<?php

/**
 * Plugin Name: Export Volunteers
 * Description: Allows editors to export volunteer form submissions
 * Version: 1.2604130628
 * Author: Jesse Shawl
 * Author URI: https://jesse.sh/
 * License: GPLv2 or later
 */

require_once plugin_dir_path(__FILE__) . 'mock-gravity-forms.php';

class SFMF_Export
{
    public const FORM_ID = 2;
    public function __construct()
    {
        add_action('wp_ajax_export_volunteers', [$this,'export_volunteers_handler']);
        add_action('admin_menu', [$this, 'add_settings_page']);
    }

    public function add_settings_page()
    {
        add_management_page(
            'Export Volunteers',
            'Export Volunteers',
            'edit_others_posts',
            'gf-export',
            [$this, 'settings_page_html']
        );
    }

    public function get_entries()
    {
        $search_criteria = [
            "status" => "active"
        ];
        $sorting = null;
        $paging = array( 'offset' => 0, 'page_size' => 1000 );
        $total_count = 0;
        return GFAPI::get_entries(self::FORM_ID, $search_criteria, $sorting, $paging, $total_count);
    }

    public function settings_page_html()
    {
        $entries = $this->get_entries();
        $total_count = count($entries);
        $last_submission = $entries[0]["date_created"];
        $time_ago = human_time_diff(strtotime($last_submission), current_time('timestamp'));
        $url = admin_url('admin-ajax.php?action=export_volunteers');
        ?>
        <div class="wrap">
            <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
            <p class="notice">There are <?php echo $total_count; ?> total volunteers!
            <small><em>last submission <?php echo $time_ago; ?> ago</em></small></p>
            <a class="button button-primary" href="<?php echo esc_url($url); ?>">Download CSV</a>
        </div><?php
        if (isset($_REQUEST["debug"])) { ?><pre><?php
            $form = GFAPI::get_form(self::FORM_ID);
            echo "DEBUG: fields\n";
            var_dump($form['fields']);
            echo "DEBUG: entries[0]\n";
            var_dump($entries[0]);
        }?></pre><?php
    }

    public function export_volunteers_handler()
    {
        if (! current_user_can('edit_others_posts')) {
            wp_die('Unauthorized', 403);
        }
        $rows = $this->get_rows();
        $headers = array_keys($rows[0]);
        header('Content-Type: text/csv');
        $filename = "volunteer-export-" . date('Y-m-d') . ".csv";
        header("Content-Disposition: attachment; filename=\"".  $filename ."\"");
        $out = fopen('php://output', 'w');
        fputcsv($out, $headers, ',', '"', '\\');
        foreach ($rows as $row) {
            fputcsv($out, $row, ',', '"', '\\');
        }
        fclose($out);
        wp_die();
    }

    public function get_rows()
    {
        $form = GFAPI::get_form(self::FORM_ID);
        $entries = $this->get_entries();
        $rows = [];

        foreach ($entries as $entry) {
            $row = [];
            foreach ($form['fields'] as $field) {
                if ($field->visibility === 'administrative') {
                    continue;
                }
                if (in_array($field->type, ['html', 'section', 'page'])) {
                    continue;
                }
                $field_id = (string) $field->id;
                $value = rgar($entry, $field_id);
                if (!empty($field->inputs)) {
                    $values = [];
                    foreach ($field->inputs as $input) {
                        $input_value = rgar($entry, (string) $input['id']);
                        if ($input_value !== '') {
                            $values[] = $input_value;
                        }
                    }
                    $value = implode(', ', $values);
                } else {
                    $value = rgar($entry, $field_id);
                }
                $row[$field->label] = $value;
            }
            $rows[] = $row;
        }
        return $rows;
    }
}

add_action("plugins_loaded", function () {
    new SFMF_Export();
});
