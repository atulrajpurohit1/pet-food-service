<?php
/**
 * PFS Headless Settings — REST API
 *
 * Endpoint: GET /wp-json/headless/v1/settings
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Enable CORS globally for Headless frontend.
 */
add_action( 'rest_api_init', function() {
	remove_filter( 'rest_pre_serve_request', 'rest_send_cors_headers' );
	add_filter( 'rest_pre_serve_request', function( $value ) {
		$frontend_url = get_option( 'pfs_frontend_url', 'http://localhost:3000' );
		header( 'Access-Control-Allow-Origin: ' . untrailingslashit( $frontend_url ) );
		header( 'Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, PATCH, DELETE' );
		header( 'Access-Control-Allow-Credentials: true' );
		header( 'Access-Control-Allow-Headers: Authorization, Content-Type, X-WP-Nonce' );

		if ( 'OPTIONS' === $_SERVER['REQUEST_METHOD'] ) {
			status_header( 200 );
			exit;
		}

		return $value;
	});
}, 15 );

function pfs_hs_register_rest_route() {
	register_rest_route( 'headless/v1', '/settings', [
		'methods'             => 'GET',
		'callback'            => 'pfs_hs_rest_get_settings',
		'permission_callback' => '__return_true',
	] );

	register_rest_route( 'headless/v1', '/site', [
		'methods'             => 'GET',
		'callback'            => 'pfs_hs_rest_get_site_data',
		'permission_callback' => '__return_true',
	] );

	register_rest_route( 'headless/v1', '/contact', [
		'methods'             => 'POST',
		'callback'            => 'pfs_hs_rest_post_contact',
		'permission_callback' => '__return_true',
	] );
}
add_action( 'rest_api_init', 'pfs_hs_register_rest_route' );

/**
 * Unified Site Data Endpoint
 * GET /wp-json/headless/v1/site
 */
function pfs_hs_rest_get_site_data( WP_REST_Request $request ) {
	// 1. Settings & Identity
	$site_title   = get_bloginfo( 'name' );
	$site_tagline = get_bloginfo( 'description' );
	$logo_id      = get_theme_mod( 'custom_logo' );
	$logo_url     = $logo_id ? wp_get_attachment_image_src( $logo_id, 'full' )[0] : '';
	
	$social_links = json_decode( get_option( 'pfs_social_links', '[]' ), true );
	$contact      = json_decode( get_option( 'pfs_contact_details', '{}' ), true );

	// 2. Menus
	$menus = [
		'header' => pfs_hs_get_menu_by_location( 'header-menu' ),
		'footer' => pfs_hs_get_menu_by_location( 'footer-menu' ),
	];

	// 3. Pages (with Gutenberg Blocks)
	$pages_query = new WP_Query( [
		'post_type'      => 'page',
		'post_status'    => 'publish',
		'posts_per_page' => -1,
	] );
	
	$pages = [];
	foreach ( $pages_query->posts as $page ) {
		$sections_raw = get_post_meta( $page->ID, '_pfs_sections', true );
		$sections = ! empty( $sections_raw ) ? json_decode( $sections_raw, true ) : [];

		$pages[] = [
			'id'            => $page->ID,
			'title'         => $page->post_title,
			'excerpt'       => get_the_excerpt( $page ),
			'slug'          => $page->post_name,
			'path'          => '/' . $page->post_name,
			'sections'      => is_array( $sections ) ? $sections : [],
			'featuredImage' => get_the_post_thumbnail_url( $page->ID, 'full' ),
			'parent'        => $page->post_parent,
			'menuOrder'     => $page->menu_order,
		];
	}

	// 4. Posts
	$posts_query = new WP_Query( [
		'post_type'      => 'post',
		'post_status'    => 'publish',
		'posts_per_page' => 10,
	] );

	$posts = [];
	foreach ( $posts_query->posts as $post ) {
		$posts[] = [
			'id'      => $post->ID,
			'title'   => $post->post_title,
			'slug'    => $post->post_name,
			'excerpt' => get_the_excerpt( $post ),
			'date'    => $post->post_date_gmt,
			'image'   => get_the_post_thumbnail_url( $post, 'large' ),
		];
	}

	// 5. Products (Custom Post Type)
	$products_query = new WP_Query( [
		'post_type'      => 'products',
		'post_status'    => 'publish',
		'posts_per_page' => -1,
	] );

	$products = [];
	foreach ( $products_query->posts as $product ) {
		$products[] = [
			'id'    => $product->ID,
			'title' => $product->post_title,
			'slug'  => $product->post_name,
			'price' => get_post_meta( $product->ID, '_price', true ),
			'image' => get_the_post_thumbnail_url( $product, 'large' ),
		];
	}

	// 6. Media Library (Recent)
	$media_query = new WP_Query( [
		'post_type'      => 'attachment',
		'post_status'    => 'inherit',
		'post_mime_type' => 'image',
		'posts_per_page' => 50,
	] );

	$media = [];
	foreach ( $media_query->posts as $item ) {
		$media[] = [
			'id'  => $item->ID,
			'url' => wp_get_attachment_url( $item->ID ),
			'alt' => get_post_meta( $item->ID, '_wp_attachment_image_alt', true ),
		];
	}

	$data = [
		'settings' => [
			'siteTitle'   => $site_title,
			'siteTagline' => $site_tagline,
			'logoUrl'     => $logo_url,
			'socialLinks' => $social_links,
			'contact'     => $contact,
			'colors'      => [
				'primary'   => get_option( 'pfs_primary_color', '#16a34a' ),
				'secondary' => get_option( 'pfs_secondary_color', '#f97316' ),
				'accent'    => get_option( 'pfs_accent_color', '#1A1A1A' ),
			],
		],
		'menus'    => $menus,
		'pages'    => $pages,
		'posts'    => $posts,
		'products' => $products,
		'media'    => $media,
		'updated'  => gmdate( 'c' ),
	];

	return new WP_REST_Response( $data, 200 );
}

function pfs_hs_rest_post_contact( WP_REST_Request $request ) {
	$params = $request->get_json_params();

	$name    = sanitize_text_field( $params['name'] ?? '' );
	$email   = sanitize_email( $params['email'] ?? '' );
	$subject = sanitize_text_field( $params['subject'] ?? '' );
	$message = sanitize_textarea_field( $params['message'] ?? '' );

	if ( empty( $name ) || empty( $email ) || empty( $message ) ) {
		return new WP_Error( 'missing_fields', 'Please fill in all required fields.', [ 'status' => 400 ] );
	}

	$post_id = wp_insert_post( [
		'post_type'    => 'contact_inquiry',
		'post_title'   => $subject ? $subject : 'New Inquiry from ' . $name,
		'post_content' => $message,
		'post_status'  => 'publish',
		'meta_input'   => [
			'human_name' => $name,
			'user_email' => $email,
		],
	] );

	if ( is_wp_error( $post_id ) ) {
		return $post_id;
	}

	return new WP_REST_Response( [
		'success' => true,
		'message' => 'Thank you! Your message has been saved in our den.',
		'id'      => $post_id,
	], 200 );
}

function pfs_hs_rest_get_settings( WP_REST_Request $request ) {
	// 1. Site Identity (Native)
	$site_title   = get_bloginfo( 'name' );
	$site_tagline = get_bloginfo( 'description' );
	$logo_id      = get_theme_mod( 'custom_logo' );
	$logo_url     = $logo_id ? wp_get_attachment_image_src( $logo_id, 'full' )[0] : '';

	// 2. Menus (Native)
	$header_menu = pfs_hs_get_menu_by_location( 'header-menu' );
	$footer_menu = pfs_hs_get_menu_by_location( 'footer-menu' );

	// 3. Social & Contact (Custom Headless)
	$social_links = json_decode( get_option( 'pfs_social_links', '[]' ), true );
	$contact      = json_decode( get_option( 'pfs_contact_details', '{}' ), true );

	$data = [
		'siteTitle'   => $site_title,
		'siteTagline' => $site_tagline,
		'logoUrl'     => $logo_url,
		'colors'      => [
			'primary'   => get_option( 'pfs_primary_color', '#16a34a' ),
			'secondary' => get_option( 'pfs_secondary_color', '#f97316' ),
			'accent'    => get_option( 'pfs_accent_color', '#1A1A1A' ),
		],
		'menus' => [
			'header' => $header_menu,
			'footer' => $footer_menu,
		],
		'socialLinks'  => $social_links,
		'contact'      => $contact,
		'lastModified' => gmdate( 'c' ),
	];

	$response = new WP_REST_Response( $data, 200 );
	$etag = md5( wp_json_encode( $data ) );
	$response->header( 'ETag', '"' . $etag . '"' );
	$response->header( 'Cache-Control', 'public, max-age=60, stale-while-revalidate=300' );

	$frontend_url = get_option( 'pfs_frontend_url', '' );
	if ( $frontend_url ) {
		$response->header( 'Access-Control-Allow-Origin', untrailingslashit( $frontend_url ) );
	}

	return $response;
}

/**
 * Helper to get menu items by location.
 */
function pfs_hs_get_menu_by_location( $location ) {
	$locations = get_nav_menu_locations();
	if ( ! isset( $locations[ $location ] ) ) {
		return [];
	}

	$menu = wp_get_nav_menu_object( $locations[ $location ] );
	if ( ! $menu ) {
		return [];
	}

	$items = wp_get_nav_menu_items( $menu->term_id );
	$clean = [];

	foreach ( (array) $items as $item ) {
		// Convert absolute WP URLs to relative for headless if they belong to this site.
		$url = $item->url;
		$site_url = get_site_url();
		if ( strpos( $url, $site_url ) === 0 ) {
			$url = str_replace( $site_url, '', $url );
		}
		if ( empty( $url ) ) $url = '/';

		$clean[] = [
			'label' => $item->title,
			'href'  => $url,
			'id'    => $item->ID,
		];
	}

	return $clean;
}
