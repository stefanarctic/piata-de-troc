<?php
/**
 * Plugin Name: Piata Users API
 * Description: REST endpoints for user profiles and dashboard (extends piata/v1).
 * Version: 1.0.0
 * Author: Piata de Troc
 */

if (!defined('ABSPATH')) {
    exit;
}

add_action('rest_api_init', function () {
    register_rest_route('piata/v1', '/me', [
        'methods' => 'GET',
        'callback' => 'piata_users_rest_get_me',
        'permission_callback' => 'piata_users_rest_require_login',
    ]);

    register_rest_route('piata/v1', '/users/(?P<slug>[a-zA-Z0-9_-]+)', [
        'methods' => 'GET',
        'callback' => 'piata_users_rest_get_user',
        'permission_callback' => '__return_true',
    ]);

    register_rest_route('piata/v1', '/users/(?P<slug>[a-zA-Z0-9_-]+)/listings', [
        'methods' => 'GET',
        'callback' => 'piata_users_rest_get_user_listings',
        'permission_callback' => '__return_true',
        'args' => [
            'status' => [
                'required' => false,
                'type' => 'string',
            ],
        ],
    ]);
});

function piata_users_rest_require_login() {
    return is_user_logged_in();
}

function piata_users_rest_find_user_by_slug($slug) {
    $slug = sanitize_title($slug);

    $user = get_user_by('slug', $slug);
    if ($user) {
        return $user;
    }

    $user = get_user_by('login', $slug);
    if ($user) {
        return $user;
    }

    $users = get_users(['number' => 200, 'fields' => 'all']);
    foreach ($users as $candidate) {
        if (sanitize_title($candidate->display_name) === $slug) {
            return $candidate;
        }
    }

    return null;
}

function piata_users_rest_listing_stats($user_id) {
    $statuses = ['publish', 'pending', 'private', 'expired', 'draft'];
    $counts = [
        'total' => 0,
        'active' => 0,
        'expired' => 0,
        'pending' => 0,
        'private' => 0,
    ];

    foreach ($statuses as $status) {
        $query = new WP_Query([
            'post_type' => 'dp_listing',
            'author' => $user_id,
            'post_status' => $status,
            'posts_per_page' => -1,
            'fields' => 'ids',
            'no_found_rows' => true,
        ]);

        $count = (int) $query->found_posts;

        if ($status === 'publish') {
            $counts['active'] = $count;
        } elseif (isset($counts[$status])) {
            $counts[$status] = $count;
        }

        $counts['total'] += $count;
    }

    return $counts;
}

function piata_users_rest_format_user($user, $include_email = false) {
    return [
        'id' => $user->ID,
        'login' => $user->user_login,
        'slug' => $user->user_nicename,
        'displayName' => $user->display_name,
        'email' => $include_email ? $user->user_email : '',
        'avatar' => get_avatar_url($user->ID, ['size' => 256]),
        'registered' => $user->user_registered,
        'memberSince' => sprintf(
            'Member since %s',
            date_i18n('M j, Y', strtotime($user->user_registered))
        ),
        'stats' => piata_users_rest_listing_stats($user->ID),
    ];
}

function piata_users_rest_get_me() {
    $user = wp_get_current_user();
    if (!$user || !$user->exists()) {
        return new WP_Error('not_logged_in', 'Trebuie sa fii autentificat.', ['status' => 401]);
    }

    return piata_users_rest_format_user($user, true);
}

function piata_users_rest_get_user(WP_REST_Request $request) {
    $user = piata_users_rest_find_user_by_slug($request['slug']);
    if (!$user) {
        return new WP_Error('user_not_found', 'Utilizatorul nu a fost gasit.', ['status' => 404]);
    }

    return piata_users_rest_format_user($user, false);
}

function piata_users_rest_map_listing($post) {
    $meta = get_post_meta($post->ID);
    $thumb_id = get_post_thumbnail_id($post->ID);
    $image = $thumb_id ? wp_get_attachment_image_url($thumb_id, 'medium') : '';

    return [
        'id' => $post->ID,
        'slug' => $post->post_name,
        'title' => $post->post_title,
        'status' => $post->post_status,
        'image' => $image ?: '',
        'views' => $meta['_total_clicks'][0] ?? '',
        'date' => get_the_date('', $post),
        'url' => get_permalink($post),
    ];
}

function piata_users_rest_get_user_listings(WP_REST_Request $request) {
    $user = piata_users_rest_find_user_by_slug($request['slug']);
    if (!$user) {
        return new WP_Error('user_not_found', 'Utilizatorul nu a fost gasit.', ['status' => 404]);
    }

    $status = $request->get_param('status');
    $allowed = ['publish', 'pending', 'private', 'expired', 'draft', 'all'];

    $args = [
        'post_type' => 'dp_listing',
        'author' => $user->ID,
        'posts_per_page' => 50,
        'orderby' => 'date',
        'order' => 'DESC',
    ];

    if ($status && $status !== 'all' && in_array($status, $allowed, true)) {
        $args['post_status'] = $status;
    } else {
        $args['post_status'] = ['publish', 'pending', 'private', 'expired', 'draft'];
    }

    $posts = get_posts($args);

    return array_map('piata_users_rest_map_listing', $posts);
}
