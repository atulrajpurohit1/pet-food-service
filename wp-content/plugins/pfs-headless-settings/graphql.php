<?php
/**
 * PFS Headless Settings — WPGraphQL Integration
 *
 * Registers a `headlessSettings` root query field.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function pfs_hs_register_graphql() {
	if ( ! function_exists( 'register_graphql_object_type' ) ) {
		return;
	}

	register_graphql_object_type( 'HeadlessNavItem', [
		'description' => 'A navigation menu item',
		'fields'      => [
			'label' => [ 'type' => 'String' ],
			'href'  => [ 'type' => 'String' ],
		],
	] );

	register_graphql_object_type( 'HeadlessColors', [
		'description' => 'Theme color palette',
		'fields'      => [
			'primary'   => [ 'type' => 'String' ],
			'secondary' => [ 'type' => 'String' ],
			'accent'    => [ 'type' => 'String' ],
		],
	] );

	register_graphql_object_type( 'HeadlessSettings', [
		'description' => 'Global headless site settings',
		'fields'      => [
			'siteTitle'   => [ 'type' => 'String' ],
			'siteTagline' => [ 'type' => 'String' ],
			'logoUrl'     => [ 'type' => 'String' ],
			'colors'      => [ 'type' => 'HeadlessColors' ],
			'navItems'    => [ 'type' => [ 'list_of' => 'HeadlessNavItem' ] ],
			'footerText'  => [ 'type' => 'String' ],
		],
	] );

	register_graphql_field( 'RootQuery', 'headlessSettings', [
		'type'        => 'HeadlessSettings',
		'description' => 'Global headless site settings',
		'resolve'     => function () {
			$nav = json_decode( get_option( 'pfs_nav_items', '[]' ), true ) ?: [];
			return [
				'siteTitle'   => get_option( 'pfs_site_title', 'Agoura Feed' ),
				'siteTagline' => get_option( 'pfs_site_tagline', 'Premium Pet Nutrition' ),
				'logoUrl'     => get_option( 'pfs_logo_url', '' ),
				'colors'      => [
					'primary'   => get_option( 'pfs_primary_color', '#16a34a' ),
					'secondary' => get_option( 'pfs_secondary_color', '#f97316' ),
					'accent'    => get_option( 'pfs_accent_color', '#1A1A1A' ),
				],
				'navItems'    => $nav,
				'footerText'  => get_option( 'pfs_footer_text', '' ),
			];
		},
	] );
}
add_action( 'graphql_register_types', 'pfs_hs_register_graphql' );
