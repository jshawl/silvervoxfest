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
            $common = [
                'form_id'      => $form_ids,
                'date_created' => '2024-01-01 10:00:00',
                'status'       => 'active',
                '1'            => 'Jane',
                '1.3'          => 'Jane',
                '1.6'          => 'Doe',
                '2'            => 'jane@example.com',
                '3'            => 'Hello world',
                '4'            => 'Yes',
                '6'            => 'Morning',
                '7'            => 'Afternoon',
                '8'            => ''
            ];
            $entries = [
                ['id' => 1] + $common,
                ['id' => 2] + $common,
                ['id' => 3] + $common
            ];
            $total_count = count($entries);
            return $entries;
        }

        private static function mock_fields()
        {
            $defaults = [
                'inputType'  => 'unknown',
                'visibility' => 'visible',
                'type'       => 'unknown'
            ];
            return [
                (object) array_merge($defaults, [ 'id' => 1, 'label' => 'Name', 'type' => 'name']),
                (object) array_merge($defaults, [ 'id' => 2, 'label' => 'Email']),
                (object) array_merge($defaults, [ 'id' => 3, 'label' => 'Message']),
                (object) array_merge($defaults, [ 'id' => 4, 'label' => 'Yes or No radio', 'type' => 'radio', 'choices' => [
                    ['text' => 'Yes', 'value' => 'Yes'],
                    ['text' => 'No', 'value' => 'No']
                ]]),
                (object) array_merge($defaults, [ 'id' => 6, 'label' => 'AdminField', 'type' => 'radio', 'visibility' => 'administrative']),
                (object) array_merge($defaults, [ 'id' => 7, 'label' => 'SectionField', 'type' => 'section']),
                (object) array_merge($defaults, [ 'id' => 8, 'label' => 'MAE Checkbox', 'inputType' => 'checkbox' ,'inputs' => [
                    ['id' => 6, 'text' => 'Morning', 'value' => 'Morning'],
                    ['id' => 7, 'text' => 'Afternoon', 'value' => 'Afternoon'],
                    ['id' => 8, 'text' => 'Evening', 'value' => '']
                ]])

            ];
        }
    }
}
