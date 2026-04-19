<?php

if (!function_exists('rgar')) {
    function rgar($array, $key, $default = '')
    {
        return isset($array[$key]) ? $array[$key] : $default;
    }
}

if (! class_exists('GFForms')) {
    class GFForms
    {
    }
}

if (! class_exists('GFAPI')) {
    class GFAPI
    {
        public static function get_forms($active = true, $trash = false, $sort_column = 'id', $sort_dir = 'ASC')
        {
            return [
                [ 'id' => 1, 'title' => 'Contact Form',   'fields' => self::mock_fields() ],
                [ 'id' => 2, 'title' => 'Feedback Form',  'fields' => self::mock_fields() ],
            ];
        }

        public static function get_form($form_id)
        {
            return [ 'id' => $form_id, 'title' => 'Mock Form ' . $form_id, 'fields' => self::mock_fields() ];
        }

        public static function get_entries($form_ids, $search_criteria = array(), $sorting = null, $paging = null, &$total_count = null)
        {
            $entries = [
                [ 'id' => 1, 'form_id' => $form_ids, 'date_created' => '2024-01-01 10:00:00', 'status' => 'active', '1' => 'Jane',  '2' => 'jane@example.com',  '3' => 'Hello world', '4' => 'a:1:{i:0;a:6:{s:22:"Week of June 14th 2026";s:21:"Evenings and weekends";s:23:"Thursday June 18th 2026";s:0:"";s:21:"Friday June 19th 2026";s:0:"";s:23:"Saturday June 20th 2026";s:0:"";s:21:"Sunday June 21st 2026";s:0:"";s:21:"Monday June 22nd 2026";s:0:"";}}' ],
                [ 'id' => 2, 'form_id' => $form_ids, 'date_created' => '2024-01-02 11:00:00', 'status' => 'active', '1' => 'John',  '2' => 'john@example.com',  '3' => 'Test message', '4' => 'a:1:{i:0;a:6:{s:22:"Week of June 14th 2026";s:21:"Evenings and weekends";s:23:"Thursday June 18th 2026";s:0:"";s:21:"Friday June 19th 2026";s:0:"";s:23:"Saturday June 20th 2026";s:0:"";s:21:"Sunday June 21st 2026";s:0:"";s:21:"Monday June 22nd 2026";s:0:"";}}' ],
                [ 'id' => 3, 'form_id' => $form_ids, 'date_created' => '2024-01-03 12:00:00', 'status' => 'active', '1' => 'Alice', '2' => 'alice@example.com', '3' => 'Another one' , '4' => 'a:1:{i:0;a:6:{s:22:"Week of June 14th 2026";s:21:"Evenings and weekends";s:23:"Thursday June 18th 2026";s:0:"";s:21:"Friday June 19th 2026";s:0:"";s:23:"Saturday June 20th 2026";s:0:"";s:21:"Sunday June 21st 2026";s:0:"";s:21:"Monday June 22nd 2026";s:0:"";}}']
            ];

            $total_count = count($entries);
            return $entries;
        }

        private static function mock_fields()
        {
            return [
                (object) [ 'id' => 1, 'label' => 'Name', 'type' => 'unknown' ],
                (object) [ 'id' => 2, 'label' => 'Email', 'type' => 'unknown' ],
                (object) [ 'id' => 3, 'label' => 'Message', 'type' => 'unknown' ],
                (object) [ 'id' => 4, 'label' => 'Availability', 'type' => 'list' ],
            ];
        }
    }
}
