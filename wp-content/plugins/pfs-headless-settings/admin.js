/**
 * PFS Headless Settings — Admin JS
 *
 * Handles: color pickers, media uploader, dynamic nav-item rows.
 */
(function ($) {
  "use strict";

  $(document).ready(function () {
    /* ── Color Pickers ── */
    $(".pfs-color-picker").wpColorPicker();

    /* ── Media Uploader for Logo ── */
    $(".pfs-upload-logo").on("click", function (e) {
      e.preventDefault();
      var frame = wp.media({
        title: "Select Logo",
        button: { text: "Use as Logo" },
        multiple: false,
        library: { type: "image" },
      });
      frame.on("select", function () {
        var attachment = frame.state().get("selection").first().toJSON();
        $("#pfs_logo_url").val(attachment.url);
        $("#pfs-logo-preview").html(
          '<img src="' + attachment.url + '" style="max-height:60px;" />'
        );
      });
      frame.open();
    });

    /* ── Navigation Items ── */
    var $container = $("#pfs-nav-items-container");
    var $hidden = $("#pfs_nav_items");
    var items = [];

    // Parse existing items.
    try {
      items = JSON.parse($hidden.val()) || [];
    } catch (e) {
      items = [];
    }

    function renderRows() {
      $container.empty();
      items.forEach(function (item, i) {
        var $row = $(
          '<div class="pfs-nav-row" data-index="' + i + '">' +
            '<span class="dashicons dashicons-move"></span>' +
            '<input type="text" placeholder="Label" value="' + escAttr(item.label) + '" class="pfs-nav-label" />' +
            '<input type="text" placeholder="/path" value="' + escAttr(item.href) + '" class="pfs-nav-href" />' +
            '<button type="button" class="button pfs-remove-nav" title="Remove">&times;</button>' +
          '</div>'
        );
        $container.append($row);
      });
      syncHidden();
    }

    function syncHidden() {
      var data = [];
      $container.find(".pfs-nav-row").each(function () {
        data.push({
          label: $(this).find(".pfs-nav-label").val(),
          href: $(this).find(".pfs-nav-href").val(),
        });
      });
      items = data;
      $hidden.val(JSON.stringify(data));
    }

    function escAttr(s) {
      return String(s || "")
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    }

    // Live-update hidden field on input.
    $container.on("input", ".pfs-nav-label, .pfs-nav-href", syncHidden);

    // Remove button.
    $container.on("click", ".pfs-remove-nav", function () {
      var idx = $(this).closest(".pfs-nav-row").data("index");
      items.splice(idx, 1);
      renderRows();
    });

    // Add button.
    $("#pfs-add-nav-item").on("click", function () {
      items.push({ label: "", href: "/" });
      renderRows();
      $container.find(".pfs-nav-row:last .pfs-nav-label").focus();
    });

    // Drag-to-reorder using simple swap (jQuery UI sortable light).
    if ($.fn.sortable) {
      $container.sortable({
        handle: ".dashicons-move",
        update: syncHidden,
      });
    }

    // Initial render.
    renderRows();

    /* ── Sync hidden before submit ── */
    $("#pfs-headless-form").on("submit", syncHidden);
  });
})(jQuery);
