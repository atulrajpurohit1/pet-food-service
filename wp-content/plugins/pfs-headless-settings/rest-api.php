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

	register_rest_route( 'headless/v1', '/contact', [
		'methods'             => 'POST',
		'callback'            => 'pfs_hs_rest_post_contact',
		'permission_callback' => '__return_true',
	] );
}
add_action( 'rest_api_init', 'pfs_hs_register_rest_route' );

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
	$nav_items = json_decode( get_option( 'pfs_nav_items', '[]' ), true );
	
	if ( empty( $nav_items ) ) {
		$nav_items = [
			[ 'label' => 'Home', 'href' => '/' ],
			[ 'label' => 'Categories', 'href' => '/categories' ],
			[ 'label' => 'About Us', 'href' => '/about' ],
			[ 'label' => 'Contact', 'href' => '/contact' ],
		];
	}

	$data = [
		'siteTitle'   => get_option( 'pfs_site_title', 'PAWFRESH' ),
		'siteTagline' => get_option( 'pfs_site_tagline', 'Premium Pet Nutrition' ),
		'logoUrl'     => get_option( 'pfs_logo_url', '' ),
		'colors'      => [
			'primary'   => get_option( 'pfs_primary_color', '#16a34a' ),
			'secondary' => get_option( 'pfs_secondary_color', '#f97316' ),
			'accent'    => get_option( 'pfs_accent_color', '#1A1A1A' ),
		],
		'navItems'     => $nav_items,
		'footerText'   => get_option( 'pfs_footer_text', '© ' . date( 'Y' ) . ' PawFresh Pet Nutrition. Crafted with love.' ),
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
