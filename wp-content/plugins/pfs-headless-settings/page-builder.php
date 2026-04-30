<?php
/**
 * PFS Page Builder — Structured section-based page editor
 * 
 * Stores editable sections as JSON in _pfs_sections post meta.
 * Each section has a type + data object that the Next.js frontend renders.
 */

if ( ! defined( 'ABSPATH' ) ) exit;

/* ────────────────────────────────────────────
 * 1. Register post meta for REST API exposure
 * ──────────────────────────────────────────── */

function pfs_pb_register_meta() {
    register_post_meta( 'page', '_pfs_sections', [
        'show_in_rest'  => true,
        'single'        => true,
        'type'          => 'string',
        'default'       => '[]',
        'auth_callback' => function() { return current_user_can( 'edit_posts' ); },
    ] );
}
add_action( 'init', 'pfs_pb_register_meta' );

/* ────────────────────────────────────────────
 * 2. Add meta box to the page editor sidebar
 * ──────────────────────────────────────────── */

function pfs_pb_add_meta_box() {
    add_meta_box(
        'pfs-page-builder',
        '🏗️ PFS Page Builder',
        'pfs_pb_render_meta_box',
        'page',
        'normal',
        'high'
    );
}
add_action( 'add_meta_boxes', 'pfs_pb_add_meta_box' );

function pfs_pb_render_meta_box( $post ) {
    wp_nonce_field( 'pfs_pb_save', 'pfs_pb_nonce' );
    $sections = get_post_meta( $post->ID, '_pfs_sections', true );
    if ( empty( $sections ) || $sections === '[]' ) {
        $sections = wp_json_encode( pfs_pb_get_defaults_for_slug( $post->post_name ) );
    }
    ?>
    <div id="pfs-page-builder-app" data-post-id="<?php echo esc_attr( $post->ID ); ?>">
        <textarea id="pfs-sections-data" name="_pfs_sections" style="display:none;"><?php echo esc_textarea( $sections ); ?></textarea>
        <div id="pfs-pb-root"></div>
    </div>
    <?php
}

/* ────────────────────────────────────────────
 * 3. Save meta on post save
 * ──────────────────────────────────────────── */

function pfs_pb_save_meta( $post_id ) {
    if ( ! isset( $_POST['pfs_pb_nonce'] ) || ! wp_verify_nonce( $_POST['pfs_pb_nonce'], 'pfs_pb_save' ) ) return;
    if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) return;
    if ( ! current_user_can( 'edit_post', $post_id ) ) return;
    if ( get_post_type( $post_id ) !== 'page' ) return;

    if ( isset( $_POST['_pfs_sections'] ) ) {
        $raw = wp_unslash( $_POST['_pfs_sections'] );
        $decoded = json_decode( $raw, true );
        if ( is_array( $decoded ) ) {
            update_post_meta( $post_id, '_pfs_sections', wp_json_encode( $decoded ) );
        }
    }
}
add_action( 'save_post', 'pfs_pb_save_meta', 5 );

/* ────────────────────────────────────────────
 * 4. Enqueue admin scripts and styles
 * ──────────────────────────────────────────── */

function pfs_pb_admin_assets( $hook ) {
    if ( ! in_array( $hook, [ 'post.php', 'post-new.php' ] ) ) return;
    if ( get_post_type() !== 'page' ) return;

    wp_enqueue_media();
    wp_enqueue_style(
        'pfs-page-builder-css',
        plugin_dir_url( __FILE__ ) . 'admin-page-builder.css',
        [],
        '1.0.0'
    );
    wp_enqueue_script(
        'pfs-page-builder-js',
        plugin_dir_url( __FILE__ ) . 'admin-page-builder.js',
        [ 'jquery', 'jquery-ui-sortable' ],
        '1.0.0',
        true
    );
}
add_action( 'admin_enqueue_scripts', 'pfs_pb_admin_assets' );

/* ────────────────────────────────────────────
 * 5. Seed default sections on plugin load
 * ──────────────────────────────────────────── */

function pfs_pb_seed_defaults() {
    $slugs = [ 'home', 'about', 'categories', 'contact' ];
    foreach ( $slugs as $slug ) {
        $page = get_page_by_path( $slug );
        if ( ! $page ) continue;
        $existing = get_post_meta( $page->ID, '_pfs_sections', true );
        if ( empty( $existing ) || $existing === '[]' || $existing === 'null' ) {
            $defaults = pfs_pb_get_defaults_for_slug( $slug );
            update_post_meta( $page->ID, '_pfs_sections', wp_json_encode( $defaults ) );
        }
    }
}
add_action( 'admin_init', 'pfs_pb_seed_defaults' );

/* ────────────────────────────────────────────
 * 6. Default section data per page
 * ──────────────────────────────────────────── */

function pfs_pb_get_defaults_for_slug( $slug ) {
    $defaults = [
        'home' => [
            [
                'type' => 'hero',
                'data' => [
                    'tag'      => 'Premium Pet Nutrition',
                    'title'    => 'Healthy Food for Happy Pets',
                    'subtitle' => 'We provide high-quality food for your pet to keep them healthy and happy. Our food is made with fresh and organic ingredients.',
                    'image'    => 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=1200',
                    'ctaPrimaryLabel' => 'Explore Menu',
                    'ctaPrimaryHref'  => '/categories',
                    'ctaSecondaryLabel' => 'Our Story',
                    'ctaSecondaryHref'  => '/about',
                ],
            ],
            [
                'type' => 'categories_grid',
                'data' => [
                    'title' => 'Shop by Category',
                    'items' => [
                        [ 'name' => 'Dog Food', 'image' => 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&q=80&w=600', 'subtitle' => 'High quality nutrition for dogs' ],
                        [ 'name' => 'Cat Food', 'image' => 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=600', 'subtitle' => 'Healthy food for your cats' ],
                        [ 'name' => 'Treats', 'image' => 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=600', 'subtitle' => 'Delicious organic pet treats' ],
                        [ 'name' => 'Supplements', 'image' => 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&q=80&w=600', 'subtitle' => 'Extra care for your pet health' ],
                    ],
                ],
            ],
            [
                'type' => 'image_text',
                'data' => [
                    'tag'           => 'Our Mission',
                    'title'         => 'Wellness Every Pet Deserves the Best',
                    'body'          => 'We are committed to providing the best nutrition for your pets. Our food is designed to fuel a longer, more vibrant life for every pet parent out there.',
                    'image'         => 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=1200',
                    'imagePosition' => 'left',
                    'linkLabel'     => 'See More',
                    'linkHref'      => '/about',
                ],
            ],
            [
                'type' => 'cards_grid',
                'data' => [
                    'title' => 'Why Choose PawFresh?',
                    'items' => [
                        [ 'title' => 'Best Quality', 'icon' => '💎', 'description' => 'We ensure only the best ingredients for your pets.' ],
                        [ 'title' => 'Fast Delivery', 'icon' => '🚚', 'description' => 'Fresh food delivered right to your doorstep.' ],
                        [ 'title' => 'Organic Ingredients', 'icon' => '🍃', 'description' => '100% natural and organic components.' ],
                        [ 'title' => 'Vet Recommended', 'icon' => '🩺', 'description' => 'Approved by leading pet health experts.' ],
                    ],
                ],
            ],
            [
                'type' => 'testimonials',
                'data' => [
                    'title' => 'What Pet Parents Say',
                    'items' => [
                        [ 'name' => 'John Doe', 'role' => 'Dog Parent', 'quote' => 'My dog loves the food! He has never been more energetic and happy.', 'image' => 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200' ],
                        [ 'name' => 'Jane Smith', 'role' => 'Cat Parent', 'quote' => 'The cat food is amazing. Her coat is so shiny now. Highly recommend!', 'image' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200' ],
                        [ 'name' => 'Mike Ross', 'role' => 'Pet Parent', 'quote' => 'Fast delivery and great customer service. The best pet food brand out there.', 'image' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200' ],
                    ],
                ],
            ],
        ],

        'about' => [
            [
                'type' => 'hero',
                'data' => [
                    'tag'      => 'About PawFresh',
                    'title'    => 'About Us',
                    'subtitle' => 'Giving the best care to your pets since 2020',
                    'image'    => 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=800',
                    'ctaPrimaryLabel' => '',
                    'ctaPrimaryHref'  => '',
                    'ctaSecondaryLabel' => '',
                    'ctaSecondaryHref'  => '',
                ],
            ],
            [
                'type' => 'image_text',
                'data' => [
                    'tag'           => '',
                    'title'         => 'Our Story',
                    'body'          => "It all started with our own pets. We wanted to give them the best nutrition possible, but couldn't find anything on the market that met our standards. So, we decided to make our own. Using fresh, organic ingredients and working with veterinary experts.",
                    'image'         => 'https://images.unsplash.com/photo-1522276493077-9fe5ad01add4?auto=format&fit=crop&q=80&w=1200',
                    'imagePosition' => 'left',
                    'linkLabel'     => 'Contact Us Today',
                    'linkHref'      => '/contact',
                ],
            ],
            [
                'type' => 'cards_grid',
                'data' => [
                    'title' => '',
                    'items' => [
                        [ 'title' => 'Our Mission', 'icon' => '', 'description' => 'To provide premium nutrition for every pet, ensuring they live long, healthy, and happy lives with their families.' ],
                        [ 'title' => 'Our Vision', 'icon' => '', 'description' => 'To become the global leader in fresh pet nutrition, setting the highest standards for transparency and quality.' ],
                    ],
                ],
            ],
            [
                'type' => 'cards_grid',
                'data' => [
                    'title' => 'Why Choose Us?',
                    'items' => [
                        [ 'title' => 'Pure Ingredients', 'icon' => '🍃', 'description' => '100% natural components.' ],
                        [ 'title' => 'Vet Recommended', 'icon' => '🩺', 'description' => 'Experts approved nutrition.' ],
                        [ 'title' => 'Eco Friendly', 'icon' => '♻️', 'description' => 'Sustainably sourced.' ],
                        [ 'title' => 'Fast Delivery', 'icon' => '🚚', 'description' => 'Fresh to your door.' ],
                    ],
                ],
            ],
            [
                'type' => 'team',
                'data' => [
                    'title' => 'Meet Our Team',
                    'items' => [
                        [ 'name' => 'Dr. Sarah Wilson', 'role' => 'Chief Veterinarian', 'image' => 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=600' ],
                        [ 'name' => 'Mark Thompson', 'role' => 'Head of Nutrition', 'image' => 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600' ],
                        [ 'name' => 'Emily Davis', 'role' => 'Supply Chain Manager', 'image' => 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600' ],
                    ],
                ],
            ],
        ],

        'categories' => [
            [
                'type' => 'hero',
                'data' => [
                    'tag'      => '',
                    'title'    => 'Shop by Categories',
                    'subtitle' => 'Fresh nutrition for your pet',
                    'image'    => '',
                    'ctaPrimaryLabel' => '',
                    'ctaPrimaryHref'  => '',
                    'ctaSecondaryLabel' => '',
                    'ctaSecondaryHref'  => '',
                ],
            ],
            [
                'type' => 'categories_grid',
                'data' => [
                    'title' => '',
                    'items' => [
                        [ 'name' => 'Dog Food', 'image' => 'https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&q=80&w=800', 'subtitle' => '' ],
                        [ 'name' => 'Cat Food', 'image' => 'https://images.unsplash.com/photo-1548247416-ec66f4900b2e?auto=format&fit=crop&q=80&w=800', 'subtitle' => '' ],
                        [ 'name' => 'Treats', 'image' => 'https://images.unsplash.com/photo-1582456891925-a53965520520?auto=format&fit=crop&q=80&w=800', 'subtitle' => '' ],
                        [ 'name' => 'Supplements', 'image' => 'https://images.unsplash.com/photo-1583947581924-860bda6a26df?auto=format&fit=crop&q=80&w=800', 'subtitle' => '' ],
                        [ 'name' => 'Organic Food', 'image' => 'https://images.unsplash.com/photo-1545249390-3b4a5315fe05?auto=format&fit=crop&q=80&w=800', 'subtitle' => '' ],
                        [ 'name' => 'Accessories', 'image' => 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=800', 'subtitle' => '' ],
                        [ 'name' => 'Toys', 'image' => 'https://images.unsplash.com/photo-1576707064479-3139e7e8a93e?auto=format&fit=crop&q=80&w=800', 'subtitle' => '' ],
                        [ 'name' => 'Health Care', 'image' => 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&q=80&w=800', 'subtitle' => '' ],
                    ],
                ],
            ],
        ],

        'contact' => [
            [
                'type' => 'hero',
                'data' => [
                    'tag'      => '',
                    'title'    => 'Contact Us',
                    'subtitle' => "We'd love to hear from you. Our team of experts is here to help you choose the best nutrition for your pet.",
                    'image'    => 'https://images.unsplash.com/photo-1541599540903-216a46ca1dfc?auto=format&fit=crop&q=80&w=1200',
                    'ctaPrimaryLabel' => '',
                    'ctaPrimaryHref'  => '',
                    'ctaSecondaryLabel' => '',
                    'ctaSecondaryHref'  => '',
                ],
            ],
            [
                'type' => 'contact_info',
                'data' => [
                    'phone'       => '+1 (555) 000-PAWS',
                    'email'       => 'hello@pawfresh.com',
                    'address'     => '123 Pet Lane, Nutrition City',
                    'urgentTitle' => 'Need Urgent Help?',
                    'urgentText'  => 'Our support lines are open 24/7 for any pet emergencies.',
                ],
            ],
        ],
    ];

    return $defaults[ $slug ] ?? [];
}
