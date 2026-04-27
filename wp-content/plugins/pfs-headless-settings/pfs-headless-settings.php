<?php
/**
 * Plugin Name: PFS Headless Settings
 * Description: Global headless site settings exposed via REST API & WPGraphQL with live sync to the Next.js frontend.
 * Version: 1.0.0
 * Author: PawFresh Dev
 * Text Domain: pfs-headless
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Load sub-modules.
require_once plugin_dir_path( __FILE__ ) . 'rest-api.php';
require_once plugin_dir_path( __FILE__ ) . 'graphql.php';

/* ───────────────────────────────────────────────
 * 0. Register Custom Post Types
 * ─────────────────────────────────────────────── */

function pfs_hs_register_post_types() {
	register_post_type( 'contact_inquiry', [
		'labels'      => [
			'name'          => __( 'Contact Inquiries', 'pfs-headless' ),
			'singular_name' => __( 'Contact Inquiry', 'pfs-headless' ),
		],
		'public'      => false,
		'show_ui'     => true,
		'menu_icon'   => 'dashicons-email-alt',
		'supports'    => [ 'title', 'editor', 'custom-fields' ],
		'has_archive' => false,
	] );
}
add_action( 'init', 'pfs_hs_register_post_types' );

/* ───────────────────────────────────────────────
 * 1. Register settings
 * ─────────────────────────────────────────────── */

function pfs_hs_register_settings() {
	// ── Branding ──
	register_setting( 'pfs_headless_settings', 'pfs_site_title', [
		'type'              => 'string',
		'sanitize_callback' => 'sanitize_text_field',
		'default'           => 'PAWFRESH',
	] );
	register_setting( 'pfs_headless_settings', 'pfs_site_tagline', [
		'type'              => 'string',
		'sanitize_callback' => 'sanitize_text_field',
		'default'           => 'Premium Pet Nutrition',
	] );
	register_setting( 'pfs_headless_settings', 'pfs_logo_url', [
		'type'              => 'string',
		'sanitize_callback' => 'esc_url_raw',
		'default'           => '',
	] );

	// ── Theme Colors ──
	register_setting( 'pfs_headless_settings', 'pfs_primary_color', [
		'type'              => 'string',
		'sanitize_callback' => 'sanitize_hex_color',
		'default'           => '#16a34a',
	] );
	register_setting( 'pfs_headless_settings', 'pfs_secondary_color', [
		'type'              => 'string',
		'sanitize_callback' => 'sanitize_hex_color',
		'default'           => '#f97316',
	] );
	register_setting( 'pfs_headless_settings', 'pfs_accent_color', [
		'type'              => 'string',
		'sanitize_callback' => 'sanitize_hex_color',
		'default'           => '#1A1A1A',
	] );

	// ── Navigation Items (serialized JSON) ──
	register_setting( 'pfs_headless_settings', 'pfs_nav_items', [
		'type'              => 'string',
		'sanitize_callback' => 'pfs_hs_sanitize_nav_items',
		'default'           => wp_json_encode( [
			[ 'label' => 'Home',       'href' => '/' ],
			[ 'label' => 'Categories', 'href' => '/categories' ],
			[ 'label' => 'About Us',   'href' => '/about' ],
			[ 'label' => 'Contact',    'href' => '/contact' ],
			[ 'label' => 'My Profile', 'href' => '/profile' ],
		] ),
	] );

	// ── Footer ──
	register_setting( 'pfs_headless_settings', 'pfs_footer_text', [
		'type'              => 'string',
		'sanitize_callback' => 'sanitize_textarea_field',
		'default'           => '© ' . date( 'Y' ) . ' PawFresh Pet Nutrition. Crafted with love.',
	] );

	// ── Sync ──
	register_setting( 'pfs_headless_settings', 'pfs_frontend_url', [
		'type'              => 'string',
		'sanitize_callback' => 'esc_url_raw',
		'default'           => 'http://localhost:3000',
	] );
	register_setting( 'pfs_headless_settings', 'pfs_revalidation_secret', [
		'type'              => 'string',
		'sanitize_callback' => 'sanitize_text_field',
		'default'           => 'pawfresh-revalidation-2026',
	] );
}
add_action( 'admin_init', 'pfs_hs_register_settings' );

/**
 * Sanitize navigation items JSON.
 */
function pfs_hs_sanitize_nav_items( $value ) {
	$items = json_decode( stripslashes( $value ), true );
	if ( ! is_array( $items ) ) {
		return '[]';
	}
	$clean = [];
	foreach ( $items as $item ) {
		if ( ! empty( $item['label'] ) && isset( $item['href'] ) ) {
			$clean[] = [
				'label' => sanitize_text_field( $item['label'] ),
				'href'  => sanitize_text_field( $item['href'] ),
			];
		}
	}
	return wp_json_encode( $clean );
}

/* ───────────────────────────────────────────────
 * 2. Admin menu page
 * ─────────────────────────────────────────────── */

function pfs_hs_admin_menu() {
	add_options_page(
		__( 'Headless Settings', 'pfs-headless' ),
		__( 'Headless Settings', 'pfs-headless' ),
		'manage_options',
		'pfs-headless-settings',
		'pfs_hs_render_settings_page'
	);
}
add_action( 'admin_menu', 'pfs_hs_admin_menu' );

/**
 * Enqueue the WP color picker and media uploader on our settings page.
 */
function pfs_hs_admin_scripts( $hook ) {
	if ( $hook !== 'settings_page_pfs-headless-settings' ) {
		return;
	}
	wp_enqueue_style( 'wp-color-picker' );
	wp_enqueue_media();
	wp_enqueue_script(
		'pfs-headless-admin',
		plugin_dir_url( __FILE__ ) . 'admin.js',
		[ 'wp-color-picker', 'jquery' ],
		'1.0.0',
		true
	);
}
add_action( 'admin_enqueue_scripts', 'pfs_hs_admin_scripts' );

/**
 * Render the settings page.
 */
function pfs_hs_render_settings_page() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}

	$site_title          = get_option( 'pfs_site_title', 'PAWFRESH' );
	$site_tagline        = get_option( 'pfs_site_tagline', 'Premium Pet Nutrition' );
	$logo_url            = get_option( 'pfs_logo_url', '' );
	$primary_color       = get_option( 'pfs_primary_color', '#16a34a' );
	$secondary_color     = get_option( 'pfs_secondary_color', '#f97316' );
	$accent_color        = get_option( 'pfs_accent_color', '#1A1A1A' );
	$nav_items_json      = get_option( 'pfs_nav_items', '[]' );
	$nav_items           = json_decode( $nav_items_json, true ) ?: [];
	$footer_text         = get_option( 'pfs_footer_text', '' );
	$frontend_url        = get_option( 'pfs_frontend_url', 'http://localhost:3000' );
	$revalidation_secret = get_option( 'pfs_revalidation_secret', '' );
	?>
	<div class="wrap">
		<h1 style="display:flex;align-items:center;gap:8px;">
			<span class="dashicons dashicons-admin-site-alt3" style="font-size:28px;color:#16a34a;"></span>
			<?php esc_html_e( 'Headless Settings', 'pfs-headless' ); ?>
		</h1>
		<p class="description" style="margin-bottom:20px;">
			<?php esc_html_e( 'Configure global settings that are exposed to the headless Next.js frontend. Changes are synced automatically.', 'pfs-headless' ); ?>
		</p>

		<form method="post" action="options.php" id="pfs-headless-form">
			<?php settings_fields( 'pfs_headless_settings' ); ?>

			<!-- ═══ Branding ═══ -->
			<div class="pfs-settings-card">
				<h2><span class="dashicons dashicons-art" style="color:#16a34a;"></span> Branding</h2>
				<table class="form-table">
					<tr>
						<th><label for="pfs_site_title">Site Title</label></th>
						<td><input type="text" id="pfs_site_title" name="pfs_site_title" value="<?php echo esc_attr( $site_title ); ?>" class="regular-text" /></td>
					</tr>
					<tr>
						<th><label for="pfs_site_tagline">Tagline</label></th>
						<td><input type="text" id="pfs_site_tagline" name="pfs_site_tagline" value="<?php echo esc_attr( $site_tagline ); ?>" class="regular-text" /></td>
					</tr>
					<tr>
						<th><label for="pfs_logo_url">Logo URL</label></th>
						<td>
							<input type="text" id="pfs_logo_url" name="pfs_logo_url" value="<?php echo esc_attr( $logo_url ); ?>" class="regular-text" />
							<button type="button" class="button pfs-upload-logo">Upload Logo</button>
							<div id="pfs-logo-preview" style="margin-top:10px;">
								<?php if ( $logo_url ) : ?>
									<img src="<?php echo esc_url( $logo_url ); ?>" style="max-height:60px;" />
								<?php endif; ?>
							</div>
						</td>
					</tr>
				</table>
			</div>

			<!-- ═══ Theme Colors ═══ -->
			<div class="pfs-settings-card">
				<h2><span class="dashicons dashicons-admin-appearance" style="color:#f97316;"></span> Theme Colors</h2>
				<table class="form-table">
					<tr>
						<th><label for="pfs_primary_color">Primary Color</label></th>
						<td><input type="text" id="pfs_primary_color" name="pfs_primary_color" value="<?php echo esc_attr( $primary_color ); ?>" class="pfs-color-picker" /></td>
					</tr>
					<tr>
						<th><label for="pfs_secondary_color">Secondary Color</label></th>
						<td><input type="text" id="pfs_secondary_color" name="pfs_secondary_color" value="<?php echo esc_attr( $secondary_color ); ?>" class="pfs-color-picker" /></td>
					</tr>
					<tr>
						<th><label for="pfs_accent_color">Accent / Dark Color</label></th>
						<td><input type="text" id="pfs_accent_color" name="pfs_accent_color" value="<?php echo esc_attr( $accent_color ); ?>" class="pfs-color-picker" /></td>
					</tr>
				</table>
			</div>

			<!-- ═══ Navigation ═══ -->
			<div class="pfs-settings-card">
				<h2><span class="dashicons dashicons-menu" style="color:#6366f1;"></span> Navigation Menu Items</h2>
				<p class="description">Add, remove, or reorder navigation links that appear in the header and footer.</p>
				<div id="pfs-nav-items-container">
					<!-- JS populates rows -->
				</div>
				<button type="button" class="button" id="pfs-add-nav-item" style="margin-top:10px;">+ Add Menu Item</button>
				<input type="hidden" id="pfs_nav_items" name="pfs_nav_items" value="<?php echo esc_attr( $nav_items_json ); ?>" />
			</div>

			<!-- ═══ Footer ═══ -->
			<div class="pfs-settings-card">
				<h2><span class="dashicons dashicons-editor-alignleft" style="color:#8b5cf6;"></span> Footer</h2>
				<table class="form-table">
					<tr>
						<th><label for="pfs_footer_text">Footer Copyright Text</label></th>
						<td><textarea id="pfs_footer_text" name="pfs_footer_text" rows="3" class="large-text"><?php echo esc_textarea( $footer_text ); ?></textarea></td>
					</tr>
				</table>
			</div>

			<!-- ═══ Sync Settings ═══ -->
			<div class="pfs-settings-card">
				<h2><span class="dashicons dashicons-update" style="color:#0ea5e9;"></span> Live Sync</h2>
				<table class="form-table">
					<tr>
						<th><label for="pfs_frontend_url">Frontend URL</label></th>
						<td>
							<input type="url" id="pfs_frontend_url" name="pfs_frontend_url" value="<?php echo esc_attr( $frontend_url ); ?>" class="regular-text" />
							<p class="description">The URL of your Next.js frontend (e.g., http://localhost:3000).</p>
						</td>
					</tr>
					<tr>
						<th><label for="pfs_revalidation_secret">Revalidation Secret</label></th>
						<td>
							<input type="password" id="pfs_revalidation_secret" name="pfs_revalidation_secret" value="<?php echo esc_attr( $revalidation_secret ); ?>" class="regular-text" />
							<p class="description">Shared secret used to authenticate webhook calls to the frontend.</p>
						</td>
					</tr>
				</table>
			</div>

			<?php submit_button( 'Save & Sync Settings', 'primary large', 'submit', true, [ 'style' => 'padding:8px 30px;' ] ); ?>
		</form>

		<!-- REST API Preview -->
		<div class="pfs-settings-card" style="margin-top:20px;background:#f0fdf4;">
			<h2><span class="dashicons dashicons-rest-api" style="color:#16a34a;"></span> API Endpoint</h2>
			<p>Your settings are available at:</p>
			<code style="display:inline-block;padding:8px 16px;background:#fff;border:1px solid #bbf7d0;border-radius:6px;font-size:14px;">
				<?php echo esc_url( rest_url( 'headless/v1/settings' ) ); ?>
			</code>
		</div>
	</div>

	<style>
		.pfs-settings-card {
			background: #fff;
			border: 1px solid #e5e7eb;
			border-radius: 12px;
			padding: 20px 24px;
			margin-bottom: 16px;
			box-shadow: 0 1px 3px rgba(0,0,0,.04);
		}
		.pfs-settings-card h2 {
			display: flex;
			align-items: center;
			gap: 8px;
			font-size: 16px;
			margin: 0 0 4px;
			padding: 0;
		}
		.pfs-nav-row {
			display: flex;
			align-items: center;
			gap: 8px;
			margin-bottom: 6px;
			padding: 8px 12px;
			background: #f9fafb;
			border: 1px solid #e5e7eb;
			border-radius: 8px;
		}
		.pfs-nav-row input { flex: 1; }
		.pfs-nav-row .dashicons-move { cursor: grab; color: #9ca3af; }
	</style>
	<?php
}

/* ───────────────────────────────────────────────
 * 3. Admin bar shortcut
 * ─────────────────────────────────────────────── */

function pfs_hs_admin_bar_link( $admin_bar ) {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}
	$admin_bar->add_node( [
		'id'    => 'pfs-headless-settings',
		'title' => '<span class="ab-icon dashicons dashicons-admin-site-alt3" style="margin-top:2px;"></span> Headless Settings',
		'href'  => admin_url( 'options-general.php?page=pfs-headless-settings' ),
		'meta'  => [ 'title' => 'Open Headless Settings' ],
	] );
}
add_action( 'admin_bar_menu', 'pfs_hs_admin_bar_link', 100 );

/* ───────────────────────────────────────────────
 * 4. Webhook on settings save
 * ─────────────────────────────────────────────── */

function pfs_hs_fire_webhook( $option ) {
	// Only fire for our settings.
	$tracked = [
		'pfs_site_title', 'pfs_site_tagline', 'pfs_logo_url',
		'pfs_primary_color', 'pfs_secondary_color', 'pfs_accent_color',
		'pfs_nav_items', 'pfs_footer_text',
	];
	if ( ! in_array( $option, $tracked, true ) ) {
		return;
	}

	$frontend_url = get_option( 'pfs_frontend_url', '' );
	$secret       = get_option( 'pfs_revalidation_secret', '' );

	if ( empty( $frontend_url ) || empty( $secret ) ) {
		return;
	}

	$webhook_url = trailingslashit( $frontend_url ) . 'api/revalidate';

	wp_remote_post( $webhook_url, [
		'timeout'   => 5,
		'blocking'  => false,   // fire-and-forget
		'headers'   => [ 'Content-Type' => 'application/json' ],
		'body'      => wp_json_encode( [
			'secret'  => $secret,
			'paths'   => [ '/', '/about', '/categories', '/contact', '/profile' ],
			'changed' => $option,
		] ),
	] );
}
add_action( 'updated_option', 'pfs_hs_fire_webhook', 10, 1 );
