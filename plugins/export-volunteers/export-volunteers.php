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
        $search_criteria = array();
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
        fputcsv($out, $headers);
        foreach ($rows as $row) {
            fputcsv($out, $row);
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

                $field_id = (string) $field->id;
                $value = rgar($entry, $field_id);

                // RADIO / SELECT / MULTI
                if (in_array($field->type, ['radio', 'select', 'multi_choice'])) {
                    $selected_value = $value;
                    $label = $selected_value; // fallback

                    if (!empty($field->choices)) {
                        foreach ($field->choices as $choice) {

                            $choice_value = $choice['value'] ?? '';
                            $choice_text = $choice['text'] ?? '';

                            // Case 1: normal GF setup (value matches stored value)
                            if ($choice_value !== '' && $choice_value == $selected_value) {
                                $label = $choice_text;
                                break;
                            }
                        }
                    }
                    $row[$field->label] = $label;
                }

                // CHECKBOX (multiple inputs)
                elseif ($field->type === 'checkbox' && !empty($field->inputs)) {
                    $checked = [];

                    foreach ($field->inputs as $input) {
                        $val = rgar($entry, (string) $input['id']);
                        if ($val !== '') {
                            $checked[] = $val;
                        }
                    }

                    $row[$field->label] = implode(', ', $checked);
                }

                // COMPOSITE (name, address, etc.)
                elseif (!empty($field->inputs)) {
                    foreach ($field->inputs as $input) {
                        $row[$field->label . ' ' . $input['label']] =
                            rgar($entry, (string) $input['id']);
                    }
                }

                // LIST FIELD (serialized array of rows)
                elseif ($field->type === 'list' && !empty($value)) {
                    $list = maybe_unserialize($value);

                    foreach ($list as $i => $list_row) {
                        foreach ($list_row as $col => $val) {
                            $key = $field->label . " " . ($i + 1) . " - " . $col;
                            $row[$key] = $val;
                        }
                    }
                }

                // REPEATER FIELD (Gravity Forms 2.7+)
                elseif ($field->type === 'repeater' && !empty($value)) {
                    $repeater = maybe_unserialize($value);

                    if (is_array($repeater)) {
                        foreach ($repeater as $index => $repeater_row) {
                            foreach ($field->fields as $sub_field) {
                                $sub_id = (string) $sub_field->id;

                                if (isset($repeater_row[$sub_id])) {
                                    $key = $field->label . " {$index} - " . $sub_field->label;
                                    $row[$key] = $repeater_row[$sub_id];
                                }
                            }
                        }
                    }
                }

                // FALLBACK (text, textarea, number, email, etc.)
                else {
                    if (is_serialized($value)) {
                        $unserialized = maybe_unserialize($value);

                        if (is_array($unserialized)) {
                            $row[$field->label] = implode(', ', $unserialized);
                        } else {
                            $row[$field->label] = $unserialized;
                        }
                    } else {
                        $row[$field->label] = $value;
                    }
                }
            }

            $rows[] = $row;
        }
        return $rows;
    }
}

new SFMF_Export();
