<?php
/**
 * Agoura Feed Headless Admin — Centralized Control Panel
 * 
 * Creates a top-level "Headless Control" sidebar menu with sub-pages
 * for managing all frontend content from one place.
 */
if ( ! defined( 'ABSPATH' ) ) exit;

/* ═══════════════════════════════════════════
 * 1. REGISTER ADMIN MENUS
 * ═══════════════════════════════════════════ */

function pfs_ha_register_menus() {
    add_menu_page(
        'Agoura Feed Control',
        'Agoura Feed Control',
        'manage_options',
        'pfs-headless',
        'pfs_ha_render_dashboard',
        'dashicons-admin-site-alt3',
        3
    );
    add_submenu_page( 'pfs-headless', 'Dashboard',       'Dashboard',       'manage_options', 'pfs-headless',          'pfs_ha_render_dashboard' );
    add_submenu_page( 'pfs-headless', 'Pages',           '📄 Pages',        'manage_options', 'pfs-headless-pages',    'pfs_ha_render_pages' );
    add_submenu_page( 'pfs-headless', 'Global Settings', '⚙️ Global',       'manage_options', 'pfs-headless-global',   'pfs_ha_render_global' );
    add_submenu_page( 'pfs-headless', 'Navigation',      '🧭 Navigation',   'manage_options', 'pfs-headless-nav',      'pfs_ha_render_nav' );
    add_submenu_page( 'pfs-headless', 'Media',           '🖼️ Media',        'manage_options', 'pfs-headless-media',    'pfs_ha_render_media' );
}
add_action( 'admin_menu', 'pfs_ha_register_menus' );

/* ═══════════════════════════════════════════
 * 2. ENQUEUE ASSETS
 * ═══════════════════════════════════════════ */

function pfs_ha_enqueue( $hook ) {
    if ( strpos( $hook, 'pfs-headless' ) === false ) return;
    wp_enqueue_media();
    wp_enqueue_style( 'wp-color-picker' );
    wp_enqueue_style( 'pfs-ha-css', plugin_dir_url( __FILE__ ) . 'headless-admin.css', [], '2.0.0' );
    wp_enqueue_script( 'pfs-ha-js', plugin_dir_url( __FILE__ ) . 'headless-admin.js', [ 'jquery', 'jquery-ui-sortable', 'wp-color-picker' ], '2.0.0', true );
    wp_localize_script( 'pfs-ha-js', 'pfsHA', [
        'ajax'  => admin_url( 'admin-ajax.php' ),
        'nonce' => wp_create_nonce( 'pfs_ha_nonce' ),
        'wpUrl' => get_site_url(),
    ] );
}
add_action( 'admin_enqueue_scripts', 'pfs_ha_enqueue' );

/* ═══════════════════════════════════════════
 * 3. AJAX HANDLERS
 * ═══════════════════════════════════════════ */

// Save sections for a page
add_action( 'wp_ajax_pfs_save_sections', function() {
    check_ajax_referer( 'pfs_ha_nonce', 'nonce' );
    $post_id  = intval( $_POST['post_id'] );
    $sections = wp_unslash( $_POST['sections'] );
    $decoded  = json_decode( $sections, true );
    if ( ! is_array( $decoded ) ) wp_send_json_error( 'Invalid JSON' );
    update_post_meta( $post_id, '_pfs_sections', wp_json_encode( $decoded ) );
    pfs_hs_fire_webhook( null, null, 'sections_' . $post_id );
    wp_send_json_success( [ 'message' => 'Sections saved!' ] );
});

// Save page meta (title, slug, featured image)
add_action( 'wp_ajax_pfs_save_page_meta', function() {
    check_ajax_referer( 'pfs_ha_nonce', 'nonce' );
    $post_id = intval( $_POST['post_id'] );
    $title   = sanitize_text_field( $_POST['title'] ?? '' );
    $slug    = sanitize_title( $_POST['slug'] ?? '' );
    $image   = intval( $_POST['featured_image'] ?? 0 );
    wp_update_post( [ 'ID' => $post_id, 'post_title' => $title, 'post_name' => $slug ] );
    if ( $image ) set_post_thumbnail( $post_id, $image );
    else delete_post_thumbnail( $post_id );
    pfs_hs_fire_webhook( null, null, 'page_meta_' . $post_id );
    wp_send_json_success( [ 'message' => 'Page updated!' ] );
});

// Save global settings
add_action( 'wp_ajax_pfs_save_global', function() {
    check_ajax_referer( 'pfs_ha_nonce', 'nonce' );
    $fields = [ 'pfs_primary_color', 'pfs_secondary_color', 'pfs_accent_color', 'pfs_frontend_url', 'pfs_revalidation_secret' ];
    foreach ( $fields as $f ) {
        if ( isset( $_POST[ $f ] ) ) update_option( $f, sanitize_text_field( $_POST[ $f ] ) );
    }
    if ( isset( $_POST['pfs_contact_details'] ) ) update_option( 'pfs_contact_details', wp_unslash( $_POST['pfs_contact_details'] ) );
    if ( isset( $_POST['pfs_social_links'] ) ) update_option( 'pfs_social_links', wp_unslash( $_POST['pfs_social_links'] ) );
    if ( isset( $_POST['blogname'] ) ) update_option( 'blogname', sanitize_text_field( $_POST['blogname'] ) );
    pfs_hs_fire_webhook( null, null, 'global_settings' );
    wp_send_json_success( [ 'message' => 'Settings saved!' ] );
});

/* ═══════════════════════════════════════════
 * 4. PAGE RENDERERS
 * ═══════════════════════════════════════════ */

function pfs_ha_render_dashboard() {
    $pages_count    = wp_count_posts( 'page' )->publish;
    $products_count = wp_count_posts( 'products' )->publish ?? 0;
    $media_count    = wp_count_posts( 'attachment' )->inherit;
    $frontend_url   = get_option( 'pfs_frontend_url', 'http://localhost:3000' );
    ?>
    <div class="wrap pfs-ha-wrap">
        <div class="pfs-ha-topbar">
            <h1>🏗️ Agoura Feed Control Hub</h1>
            <span class="pfs-ha-live-badge">● Live</span>
        </div>
        <p class="pfs-ha-subtitle">Manage your entire Next.js frontend from WordPress. Every change syncs instantly.</p>

        <div class="pfs-ha-stats-grid">
            <div class="pfs-ha-stat-card">
                <div class="pfs-ha-stat-icon">📄</div>
                <div class="pfs-ha-stat-num"><?php echo $pages_count; ?></div>
                <div class="pfs-ha-stat-label">Pages</div>
                <a href="<?php echo admin_url('admin.php?page=pfs-headless-pages'); ?>" class="pfs-ha-stat-link">Manage →</a>
            </div>
            <div class="pfs-ha-stat-card">
                <div class="pfs-ha-stat-icon">📦</div>
                <div class="pfs-ha-stat-num"><?php echo $products_count; ?></div>
                <div class="pfs-ha-stat-label">Products</div>
                <a href="<?php echo admin_url('edit.php?post_type=products'); ?>" class="pfs-ha-stat-link">Manage →</a>
            </div>
            <div class="pfs-ha-stat-card">
                <div class="pfs-ha-stat-icon">🖼️</div>
                <div class="pfs-ha-stat-num"><?php echo $media_count; ?></div>
                <div class="pfs-ha-stat-label">Media Files</div>
                <a href="<?php echo admin_url('admin.php?page=pfs-headless-media'); ?>" class="pfs-ha-stat-link">Manage →</a>
            </div>
            <div class="pfs-ha-stat-card">
                <div class="pfs-ha-stat-icon">🌐</div>
                <div class="pfs-ha-stat-num" style="font-size:14px"><?php echo esc_html( $frontend_url ); ?></div>
                <div class="pfs-ha-stat-label">Frontend URL</div>
                <a href="<?php echo esc_url( $frontend_url ); ?>" target="_blank" class="pfs-ha-stat-link">Visit →</a>
            </div>
        </div>

        <div class="pfs-ha-card" style="margin-top:30px;">
            <h2>🔗 REST API Endpoint</h2>
            <p>Your site data is served at:</p>
            <code class="pfs-ha-code"><?php echo esc_url( rest_url( 'headless/v1/site' ) ); ?></code>
        </div>
    </div>
    <?php
}

function pfs_ha_render_pages() {
    $pages = get_posts( [ 'post_type' => 'page', 'post_status' => 'publish', 'numberposts' => -1, 'orderby' => 'menu_order', 'order' => 'ASC' ] );
    $pages_data = [];
    foreach ( $pages as $p ) {
        $sec_raw = get_post_meta( $p->ID, '_pfs_sections', true );
        $pages_data[] = [
            'id'       => $p->ID,
            'title'    => $p->post_title,
            'slug'     => $p->post_name,
            'thumb'    => get_the_post_thumbnail_url( $p->ID, 'medium' ) ?: '',
            'thumbId'  => get_post_thumbnail_id( $p->ID ) ?: 0,
            'sections' => json_decode( $sec_raw ?: '[]', true ) ?: [],
        ];
    }
    ?>
    <div class="wrap pfs-ha-wrap">
        <div class="pfs-ha-topbar">
            <h1>📄 Page Manager</h1>
            <span class="pfs-ha-badge"><?php echo count( $pages ); ?> pages</span>
        </div>
        <p class="pfs-ha-subtitle">Edit all page content, images, and sections. Changes sync to the live site instantly.</p>
        <div id="pfs-ha-pages-app" data-pages='<?php echo esc_attr( wp_json_encode( $pages_data ) ); ?>'></div>
    </div>
    <?php
}

function pfs_ha_render_global() {
    $contact = json_decode( get_option( 'pfs_contact_details', '{}' ), true );
    $social  = json_decode( get_option( 'pfs_social_links', '[]' ), true );
    $data = [
        'siteTitle'    => get_bloginfo( 'name' ),
        'logoUrl'      => '',
        'primary'      => get_option( 'pfs_primary_color', '#16a34a' ),
        'secondary'    => get_option( 'pfs_secondary_color', '#f97316' ),
        'accent'       => get_option( 'pfs_accent_color', '#1A1A1A' ),
        'contact'      => $contact,
        'social'       => $social,
        'frontendUrl'  => get_option( 'pfs_frontend_url', 'http://localhost:3000' ),
        'secret'       => get_option( 'pfs_revalidation_secret', '' ),
    ];
    $logo_id = get_theme_mod( 'custom_logo' );
    if ( $logo_id ) $data['logoUrl'] = wp_get_attachment_image_src( $logo_id, 'full' )[0];
    ?>
    <div class="wrap pfs-ha-wrap">
        <div class="pfs-ha-topbar">
            <h1>⚙️ Global Settings</h1>
        </div>
        <p class="pfs-ha-subtitle">Site-wide settings that apply to every page.</p>
        <div id="pfs-ha-global-app" data-settings='<?php echo esc_attr( wp_json_encode( $data ) ); ?>'></div>
    </div>
    <?php
}

function pfs_ha_render_nav() {
    ?>
    <div class="wrap pfs-ha-wrap">
        <div class="pfs-ha-topbar"><h1>🧭 Navigation</h1></div>
        <p class="pfs-ha-subtitle">Manage header and footer menus using native WordPress menus.</p>
        <div class="pfs-ha-card-grid">
            <div class="pfs-ha-card">
                <h3>📌 Header Menu</h3>
                <p>Controls the main navigation at the top of your site.</p>
                <a href="<?php echo admin_url( 'nav-menus.php' ); ?>" class="pfs-ha-btn pfs-ha-btn-primary">Edit Header Menu →</a>
            </div>
            <div class="pfs-ha-card">
                <h3>📌 Footer Menu</h3>
                <p>Controls the navigation links in your footer.</p>
                <a href="<?php echo admin_url( 'nav-menus.php' ); ?>" class="pfs-ha-btn pfs-ha-btn-primary">Edit Footer Menu →</a>
            </div>
        </div>
        <div class="pfs-ha-card" style="margin-top:20px;background:#f0fdf4;">
            <h3>💡 How it works</h3>
            <p>Assign menus to <strong>"Headless Header Menu"</strong> and <strong>"Headless Footer Menu"</strong> locations. The frontend reads them automatically via the REST API.</p>
        </div>
    </div>
    <?php
}

function pfs_ha_render_media() {
    ?>
    <div class="wrap pfs-ha-wrap">
        <div class="pfs-ha-topbar"><h1>🖼️ Media Manager</h1></div>
        <p class="pfs-ha-subtitle">All images used on the frontend come from the WordPress Media Library.</p>
        <div class="pfs-ha-card">
            <h3>Upload & Manage Media</h3>
            <p>Use the standard WordPress Media Library to upload, replace, or delete images. All page sections reference images from here.</p>
            <a href="<?php echo admin_url( 'upload.php' ); ?>" class="pfs-ha-btn pfs-ha-btn-primary">Open Media Library →</a>
        </div>
        <div class="pfs-ha-card" style="margin-top:20px;">
            <h3>📌 Where images are used</h3>
            <ul style="list-style:disc;padding-left:20px;margin-top:10px;">
                <li><strong>Page Hero Images</strong> → Set via Featured Image or section editor</li>
                <li><strong>Category Images</strong> → Set in the Page Builder sections</li>
                <li><strong>Team Photos</strong> → Set in the About page section editor</li>
                <li><strong>Product Images</strong> → Set via the Products post type</li>
            </ul>
        </div>
    </div>
    <?php
}
