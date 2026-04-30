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
require_once plugin_dir_path( __FILE__ ) . 'page-builder.php';
require_once plugin_dir_path( __FILE__ ) . 'headless-admin.php';

/* ───────────────────────────────────────────────
 * 0. Register Custom Post Types & Menu Locations
 * ─────────────────────────────────────────────── */

function pfs_hs_init() {
	// Register CPT for contact submissions
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

	// Register Navigation Menu Locations
	register_nav_menus( [
		'header-menu' => __( 'Headless Header Menu', 'pfs-headless' ),
		'footer-menu' => __( 'Headless Footer Menu', 'pfs-headless' ),
	] );

	// Auto-create Headless Pages with Full Content
	pfs_hs_ensure_headless_pages();
}
add_action( 'init', 'pfs_hs_init' );

/**
 * Ensure all required site pages exist in the WordPress database with full premium content.
 */
function pfs_hs_ensure_headless_pages() {
	$pages = [
		'home' => [
			'title'   => 'Home',
			'content' => '<!-- wp:paragraph -->\n<p>We provide high-quality food for your pet to keep them healthy and happy. Our food is made with fresh and organic ingredients.</p>\n<!-- /wp:paragraph -->\n\n<!-- wp:paragraph -->\n<p>Wellness Every Pet Deserves the Best. We are committed to providing the best nutrition for your pets. Our food is designed to fuel a longer, more vibrant life for every pet parent out there.</p>\n<!-- /wp:paragraph -->',
			'excerpt' => 'We provide high-quality food for your pet to keep them healthy and happy.'
		],
		'about' => [
			'title'   => 'About Us',
			'content' => '<!-- wp:heading {"italic":true} -->\n<h2 className="italic uppercase">Our Story</h2>\n<!-- /wp:heading -->\n\n<!-- wp:paragraph -->\n<p>It all started with our own pets. We wanted to give them the best nutrition possible, but couldn\'t find anything on the market that met our standards. So, we decided to make our own. Using fresh, organic ingredients and working with veterinary experts.</p>\n<!-- /wp:paragraph -->\n\n<!-- wp:heading {"italic":true} -->\n<h2 className="italic uppercase">Our Mission</h2>\n<!-- /wp:heading -->\n\n<!-- wp:paragraph -->\n<p>To provide premium nutrition for every pet, ensuring they live long, healthy, and happy lives with their families.</p>\n<!-- /wp:paragraph -->\n\n<!-- wp:heading {"italic":true} -->\n<h2 className="italic uppercase">Our Vision</h2>\n<!-- /wp:heading -->\n\n<!-- wp:paragraph -->\n<p>To become the global leader in fresh pet nutrition, setting the highest standards for transparency and quality.</p>\n<!-- /wp:paragraph -->',
			'excerpt' => 'It all started with our own pets. We wanted to give them the best nutrition possible.'
		],
		'categories' => [
			'title'   => 'Categories',
			'content' => '<!-- wp:paragraph -->\n<p>Fresh nutrition for your pet. Shop our premium collections of organic food, treats, and supplements.</p>\n<!-- /wp:paragraph -->',
			'excerpt' => 'Fresh nutrition for your pet.'
		],
		'contact' => [
			'title'   => 'Contact',
			'content' => '<!-- wp:paragraph -->\n<p>We\'d love to hear from you. Our team of experts is here to help you choose the best nutrition for your pet. Get in touch with our pet nutrition experts.</p>\n<!-- /wp:paragraph -->',
			'excerpt' => 'We\'d love to hear from you. Our team of experts is here to help.'
		],
	];

	foreach ( $pages as $slug => $data ) {
		$query = new WP_Query( [
			'post_type'   => 'page',
			'name'        => $slug,
			'post_status' => 'any',
		] );

		if ( ! $query->have_posts() ) {
			wp_insert_post( [
				'post_type'    => 'page',
				'post_title'   => $data['title'],
				'post_name'    => $slug,
				'post_content' => str_replace('\\n', "\n", $data['content']),
				'post_excerpt' => $data['excerpt'],
				'post_status'  => 'publish',
			] );
		} else {
			// If page exists but is empty, update it with full content
			$existing_page = $query->posts[0];
			if ( strlen( trim( $existing_page->post_content ) ) < 100 ) {
				wp_update_post( [
					'ID'           => $existing_page->ID,
					'post_content' => str_replace('\\n', "\n", $data['content']),
					'post_excerpt' => $data['excerpt'],
				] );
			}
		}
	}
}

/* ───────────────────────────────────────────────
 * 1. Register settings (Headless Exclusives)
 * ─────────────────────────────────────────────── */

function pfs_hs_register_settings() {
	// ── Social Links ──
	register_setting( 'pfs_headless_settings', 'pfs_social_links', [
		'type'              => 'string',
		'sanitize_callback' => 'pfs_hs_sanitize_json',
		'default'           => wp_json_encode( [
			[ 'platform' => 'Facebook',  'url' => 'https://facebook.com' ],
			[ 'platform' => 'Instagram', 'url' => 'https://instagram.com' ],
			[ 'platform' => 'Twitter',   'url' => 'https://twitter.com' ],
		] ),
	] );

	// ── Contact Info ──
	register_setting( 'pfs_headless_settings', 'pfs_contact_details', [
		'type'              => 'string',
		'sanitize_callback' => 'pfs_hs_sanitize_json',
		'default'           => wp_json_encode( [
			'email'   => 'hello@pawfresh.com',
			'phone'   => '+1 (555) 000-PAWS',
			'address' => '123 Pet Lane, Nutrition City',
		] ),
	] );

	// ── Theme Colors ──
	register_setting( 'pfs_headless_settings', 'pfs_primary_color', [ 'type' => 'string', 'default' => '#16a34a' ] );
	register_setting( 'pfs_headless_settings', 'pfs_secondary_color', [ 'type' => 'string', 'default' => '#f97316' ] );
	register_setting( 'pfs_headless_settings', 'pfs_accent_color', [ 'type' => 'string', 'default' => '#1A1A1A' ] );

	// ── Sync ──
	register_setting( 'pfs_headless_settings', 'pfs_frontend_url', [ 'type' => 'string', 'default' => 'http://localhost:3000' ] );
	register_setting( 'pfs_headless_settings', 'pfs_revalidation_secret', [ 'type' => 'string', 'default' => 'pawfresh-revalidation-2026' ] );
}
add_action( 'admin_init', 'pfs_hs_register_settings' );

function pfs_hs_sanitize_json( $value ) {
	$data = json_decode( stripslashes( $value ), true );
	return is_array( $data ) ? wp_json_encode( $data ) : '[]';
}

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

	$site_title          = get_bloginfo( 'name' );
	$site_tagline        = get_bloginfo( 'description' );
	$logo_id             = get_theme_mod( 'custom_logo' );
	$logo_url            = $logo_id ? wp_get_attachment_image_src( $logo_id, 'full' )[0] : '';
	
	$primary_color       = get_option( 'pfs_primary_color', '#16a34a' );
	$secondary_color     = get_option( 'pfs_secondary_color', '#f97316' );
	$accent_color        = get_option( 'pfs_accent_color', '#1A1A1A' );
	
	$social_links_json   = get_option( 'pfs_social_links', '[]' );
	$contact_details     = json_decode( get_option( 'pfs_contact_details', '{}' ), true );
	
	$frontend_url        = get_option( 'pfs_frontend_url', 'http://localhost:3000' );
	$revalidation_secret = get_option( 'pfs_revalidation_secret', '' );
	?>
	<div class="wrap">
		<h1 style="display:flex;align-items:center;gap:12px;">
			<span class="dashicons dashicons-admin-site-alt3" style="font-size:32px;width:32px;height:32px;color:#16a34a;"></span>
			<?php esc_html_e( 'Headless Control Hub', 'pfs-headless' ); ?>
		</h1>
		<p class="description" style="margin-bottom:30px;font-size:14px;">
			<?php esc_html_e( 'Manage your entire Next.js frontend from one place. We reuse native WordPress features whenever possible.', 'pfs-headless' ); ?>
		</p>

		<form method="post" action="options.php" id="pfs-headless-form">
			<?php settings_fields( 'pfs_headless_settings' ); ?>

			<div class="pfs-grid">
				<!-- ═══ Branding (Native Reuse) ═══ -->
				<div class="pfs-settings-card">
					<div class="pfs-card-header">
						<span class="dashicons dashicons-art"></span>
						<h2>Branding & Identity</h2>
					</div>
					<table class="form-table">
						<tr>
							<th>Site Title</th>
							<td>
								<strong><?php echo esc_html( $site_title ); ?></strong>
								<p class="description"><a href="<?php echo esc_url( admin_url( 'options-general.php' ) ); ?>">Edit in General Settings</a></p>
							</td>
						</tr>
						<tr>
							<th>Logo</th>
							<td>
								<?php if ( $logo_url ) : ?>
									<img src="<?php echo esc_url( $logo_url ); ?>" style="max-height:50px;display:block;margin-bottom:10px;background:#f8f8f8;padding:5px;border-radius:4px;" />
								<?php else : ?>
									<p>No logo set.</p>
								<?php endif; ?>
								<p class="description"><a href="<?php echo esc_url( admin_url( 'customize.php?autofocus[section]=title_tagline' ) ); ?>">Change in Customizer</a></p>
							</td>
						</tr>
					</table>
				</div>

				<!-- ═══ Navigation (Native Reuse) ═══ -->
				<div class="pfs-settings-card">
					<div class="pfs-card-header">
						<span class="dashicons dashicons-menu"></span>
						<h2>Navigation Menus</h2>
					</div>
					<p>We use native WordPress menu locations for the frontend.</p>
					<ul style="margin:15px 0;padding-left:20px;list-style:disc;">
						<li><strong>Header Menu:</strong> Displayed at the top.</li>
						<li><strong>Footer Menu:</strong> Displayed at the bottom.</li>
					</ul>
					<a href="<?php echo esc_url( admin_url( 'nav-menus.php' ) ); ?>" class="button button-secondary">Manage Menus & Assignments</a>
				</div>

				<!-- ═══ Social Links (Custom) ═══ -->
				<div class="pfs-settings-card">
					<div class="pfs-card-header">
						<span class="dashicons dashicons-share"></span>
						<h2>Social Media</h2>
					</div>
					<div id="pfs-social-links-container">
						<!-- Populated by JS -->
					</div>
					<button type="button" class="button" id="pfs-add-social" style="margin-top:10px;">+ Add Platform</button>
					<input type="hidden" id="pfs_social_links" name="pfs_social_links" value="<?php echo esc_attr( $social_links_json ); ?>" />
				</div>

				<!-- ═══ Contact Info (Custom) ═══ -->
				<div class="pfs-settings-card">
					<div class="pfs-card-header">
						<span class="dashicons dashicons-location"></span>
						<h2>Global Contact Details</h2>
					</div>
					<table class="form-table">
						<tr>
							<th><label for="contact_email">Public Email</label></th>
							<td><input type="email" id="contact_email" value="<?php echo esc_attr( $contact_details['email'] ?? '' ); ?>" class="regular-text pfs-contact-input" data-key="email" /></td>
						</tr>
						<tr>
							<th><label for="contact_phone">Phone Number</label></th>
							<td><input type="text" id="contact_phone" value="<?php echo esc_attr( $contact_details['phone'] ?? '' ); ?>" class="regular-text pfs-contact-input" data-key="phone" /></td>
						</tr>
						<tr>
							<th><label for="contact_address">Address</label></th>
							<td><textarea id="contact_address" class="regular-text pfs-contact-input" data-key="address"><?php echo esc_textarea( $contact_details['address'] ?? '' ); ?></textarea></td>
						</tr>
					</table>
					<input type="hidden" id="pfs_contact_details" name="pfs_contact_details" value="<?php echo esc_attr( wp_json_encode( $contact_details ) ); ?>" />
				</div>

				<!-- ═══ Theme Styles ═══ -->
				<div class="pfs-settings-card">
					<div class="pfs-card-header">
						<span class="dashicons dashicons-admin-appearance"></span>
						<h2>Frontend Theme Colors</h2>
					</div>
					<table class="form-table">
						<tr>
							<th>Primary</th>
							<td><input type="text" name="pfs_primary_color" value="<?php echo esc_attr( $primary_color ); ?>" class="pfs-color-picker" /></td>
						</tr>
						<tr>
							<th>Secondary</th>
							<td><input type="text" name="pfs_secondary_color" value="<?php echo esc_attr( $secondary_color ); ?>" class="pfs-color-picker" /></td>
						</tr>
						<tr>
							<th>Accent</th>
							<td><input type="text" name="pfs_accent_color" value="<?php echo esc_attr( $accent_color ); ?>" class="pfs-color-picker" /></td>
						</tr>
					</table>
				</div>

				<!-- ═══ Sync & Infrastructure ═══ -->
				<div class="pfs-settings-card">
					<div class="pfs-card-header">
						<span class="dashicons dashicons-update"></span>
						<h2>Sync & Infrastructure</h2>
					</div>
					<table class="form-table">
						<tr>
							<th>Frontend URL</th>
							<td><input type="url" name="pfs_frontend_url" value="<?php echo esc_attr( $frontend_url ); ?>" class="regular-text" /></td>
						</tr>
						<tr>
							<th>Revalidation Secret</th>
							<td><input type="password" name="pfs_revalidation_secret" value="<?php echo esc_attr( $revalidation_secret ); ?>" class="regular-text" /></td>
						</tr>
					</table>
				</div>
			</div>

			<div style="margin-top:30px;">
				<?php submit_button( 'Save & Sync Frontend', 'primary large', 'submit', true, [ 'style' => 'padding:10px 40px;font-size:16px;' ] ); ?>
			</div>
		</form>
	</div>

	<style>
		.pfs-grid {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
			gap: 20px;
		}
		.pfs-settings-card {
			background: #fff;
			border: 1px solid #e2e8f0;
			border-radius: 12px;
			padding: 24px;
			box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
		}
		.pfs-card-header {
			display: flex;
			align-items: center;
			gap: 10px;
			margin-bottom: 20px;
			padding-bottom: 15px;
			border-bottom: 1px solid #f1f5f9;
		}
		.pfs-card-header h2 {
			margin: 0;
			font-size: 18px;
			font-weight: 700;
			color: #1e293b;
		}
		.pfs-card-header .dashicons {
			color: #16a34a;
			font-size: 24px;
			width: 24px;
			height: 24px;
		}
		.form-table th { width: 140px; font-weight: 600; color: #475569; }
		.pfs-social-row {
			display: flex;
			gap: 10px;
			margin-bottom: 10px;
			background: #f8fafc;
			padding: 10px;
			border-radius: 8px;
			border: 1px solid #f1f5f9;
		}
	</style>

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

function pfs_hs_fire_webhook( $value = null, $old_value = null, $option = '' ) {
	$frontend_url = get_option( 'pfs_frontend_url', '' );
	$secret       = get_option( 'pfs_revalidation_secret', '' );

	if ( empty( $frontend_url ) || empty( $secret ) ) {
		return $value;
	}

	$webhook_url = trailingslashit( $frontend_url ) . 'api/revalidate';

	wp_remote_post( $webhook_url, [
		'timeout'   => 5,
		'blocking'  => false,
		'headers'   => [ 'Content-Type' => 'application/json' ],
		'body'      => wp_json_encode( [
			'secret'  => $secret,
			'paths'   => [ '/', '/about', '/categories', '/contact', '/profile' ],
			'reason'  => 'Setting updated: ' . $option,
		] ),
	] );

	return $value;
}

// Fire on custom settings
add_action( 'update_option_pfs_social_links', 'pfs_hs_fire_webhook', 10, 3 );
add_action( 'update_option_pfs_contact_details', 'pfs_hs_fire_webhook', 10, 3 );
add_action( 'update_option_pfs_primary_color', 'pfs_hs_fire_webhook', 10, 3 );
add_action( 'update_option_pfs_secondary_color', 'pfs_hs_fire_webhook', 10, 3 );
add_action( 'update_option_pfs_accent_color', 'pfs_hs_fire_webhook', 10, 3 );

// Fire on native settings
add_action( 'update_option_blogname', 'pfs_hs_fire_webhook', 10, 3 );
add_action( 'update_option_blogdescription', 'pfs_hs_fire_webhook', 10, 3 );
add_action( 'update_option_theme_mods_twentytwentyfour', 'pfs_hs_fire_webhook', 10, 3 ); // For logo

// Fire on menu updates
add_action( 'wp_update_nav_menu', function($menu_id) {
    pfs_hs_fire_webhook(null, null, 'menu_' . $menu_id);
}, 10, 1 );

// Fire on post/page updates
add_action( 'save_post', function( $post_id, $post, $update ) {
	if ( wp_is_post_revision( $post_id ) || wp_is_post_autosave( $post_id ) ) {
		return;
	}
	
	// Only trigger for public post types we care about
	$public_types = [ 'post', 'page', 'products' ];
	if ( is_object($post) && in_array( $post->post_type, $public_types ) ) {
		pfs_hs_fire_webhook( null, null, 'post_' . $post_id );
	}
}, 10, 3 );

// Fire on attachment updates/deletions
add_action( 'add_attachment', function( $post_id ) {
	pfs_hs_fire_webhook( null, null, 'attachment_added' );
} );

add_action( 'delete_attachment', function( $post_id ) {
	pfs_hs_fire_webhook( null, null, 'attachment_deleted' );
} );

// Fire on post status transitions (e.g. publish, trash)
add_action( 'transition_post_status', function( $new_status, $old_status, $post ) {
	if ( $new_status !== $old_status ) {
		pfs_hs_fire_webhook( null, null, 'status_change_' . $post->ID );
	}
}, 10, 3 );
