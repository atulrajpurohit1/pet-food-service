/**
 * PFS Headless Control Hub — Admin JS
 *
 * Handles: color pickers, dynamic social link rows, contact detail sync.
 */
(function ($) {
  "use strict";

  $(document).ready(function () {
    /* ── Color Pickers ── */
    $(".pfs-color-picker").wpColorPicker();

    /* ── Social Links ── */
    var $socialContainer = $("#pfs-social-links-container");
    var $socialHidden = $("#pfs_social_links");
    var socialItems = [];

    try {
      socialItems = JSON.parse($socialHidden.val()) || [];
    } catch (e) {
      socialItems = [];
    }

    function renderSocialRows() {
      $socialContainer.empty();
      socialItems.forEach(function (item, i) {
        var $row = $(
          '<div class="pfs-social-row" data-index="' + i + '">' +
            '<input type="text" placeholder="Platform (e.g. Facebook)" value="' + escAttr(item.platform) + '" class="pfs-social-platform" style="width:140px;" />' +
            '<input type="url" placeholder="https://..." value="' + escAttr(item.url) + '" class="pfs-social-url" style="flex:1;" />' +
            '<button type="button" class="button pfs-remove-social" title="Remove">&times;</button>' +
          '</div>'
        );
        $socialContainer.append($row);
      });
      syncSocialHidden();
    }

    function syncSocialHidden() {
      var data = [];
      $socialContainer.find(".pfs-social-row").each(function () {
        var platform = $(this).find(".pfs-social-platform").val();
        var url = $(this).find(".pfs-social-url").val();
        if (platform || url) {
          data.push({ platform: platform, url: url });
        }
      });
      socialItems = data;
      $socialHidden.val(JSON.stringify(data));
    }

    $socialContainer.on("input", ".pfs-social-platform, .pfs-social-url", syncSocialHidden);

    $socialContainer.on("click", ".pfs-remove-social", function () {
      $(this).closest(".pfs-social-row").remove();
      syncSocialHidden();
    });

    $("#pfs-add-social").on("click", function () {
      socialItems.push({ platform: "", url: "" });
      renderSocialRows();
      $socialContainer.find(".pfs-social-row:last .pfs-social-platform").focus();
    });

    /* ── Contact Details ── */
    var $contactHidden = $("#pfs_contact_details");
    
    function syncContactHidden() {
      var data = {};
      $(".pfs-contact-input").each(function() {
        data[$(this).data('key')] = $(this).val();
      });
      $contactHidden.val(JSON.stringify(data));
    }

    $(".pfs-contact-input").on("input", syncContactHidden);

    /* ── Utilities ── */
    function escAttr(s) {
      return String(s || "")
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    }

    /* ── Init ── */
    renderSocialRows();

    /* ── Final Sync before Submit ── */
    $("#pfs-headless-form").on("submit", function() {
      syncSocialHidden();
      syncContactHidden();
    });
  });
})(jQuery);
