/**
 * PFS Page Builder — Admin sidebar editor
 * Reads/writes structured sections JSON from a hidden textarea.
 */
(function($) {
  'use strict';

  const SECTION_TYPES = {
    hero:            { label: 'Hero Banner',      icon: '🎯' },
    image_text:      { label: 'Image + Text',     icon: '🖼️' },
    cards_grid:      { label: 'Cards Grid',       icon: '🃏' },
    categories_grid: { label: 'Categories Grid',  icon: '📦' },
    team:            { label: 'Team Members',      icon: '👥' },
    testimonials:    { label: 'Testimonials',      icon: '⭐' },
    contact_info:    { label: 'Contact Info',      icon: '📞' },
    text_block:      { label: 'Text Block',        icon: '📝' },
    banner:          { label: 'Banner CTA',        icon: '📢' },
  };

  let sections = [];
  const $root = $('#pfs-pb-root');
  const $data = $('#pfs-sections-data');

  function init() {
    try { sections = JSON.parse($data.val()) || []; } catch(e) { sections = []; }
    render();
  }

  function save() {
    $data.val(JSON.stringify(sections));
  }

  function render() {
    let html = '<div class="pfs-pb-header"><h3>Page Sections</h3><span class="pfs-pb-badge">' + sections.length + ' sections</span></div>';
    if (!sections.length) {
      html += '<div class="pfs-pb-empty"><div class="pfs-pb-empty-icon">📄</div><p>No sections yet. Add one below!</p></div>';
    }
    html += '<div id="pfs-pb-list">';
    sections.forEach(function(sec, i) {
      var info = SECTION_TYPES[sec.type] || { label: sec.type, icon: '❓' };
      var title = sec.data?.title || sec.data?.name || info.label;
      html += '<div class="pfs-pb-section" data-index="' + i + '">';
      html += '<div class="pfs-pb-section-header" data-idx="' + i + '">';
      html += '<span class="pfs-pb-drag-handle">⠿</span>';
      html += '<span class="pfs-pb-type-badge">' + info.icon + ' ' + info.label + '</span>';
      html += '<span class="pfs-pb-section-title">' + esc(title) + '</span>';
      html += '<div class="pfs-pb-section-actions"><button type="button" class="pfs-pb-btn-icon pfs-pb-delete" data-idx="' + i + '" title="Delete">✕</button></div>';
      html += '<span class="pfs-pb-toggle" data-idx="' + i + '">▾</span>';
      html += '</div>';
      html += '<div class="pfs-pb-section-body" id="pfs-pb-body-' + i + '">';
      html += renderFields(sec, i);
      html += '</div></div>';
    });
    html += '</div>';
    html += renderAddButton();
    $root.html(html);
    $('#pfs-pb-list').sortable({ handle: '.pfs-pb-drag-handle', update: onReorder });
    bindEvents();
  }

  function esc(s) { return $('<span>').text(s || '').html(); }

  // ── Field Renderers ──
  function field(label, name, val, type, idx) {
    var id = 'pfs-f-' + idx + '-' + name;
    if (type === 'textarea') {
      return '<div class="pfs-pb-field"><label for="' + id + '">' + label + '</label><textarea id="' + id + '" data-idx="' + idx + '" data-key="' + name + '" class="pfs-pb-input">' + esc(val) + '</textarea></div>';
    }
    if (type === 'image') {
      var preview = val ? '<img src="' + esc(val) + '" class="pfs-pb-image-preview">' : '<div class="pfs-pb-image-preview empty">🖼</div>';
      return '<div class="pfs-pb-field"><label>' + label + '</label><div class="pfs-pb-image-picker">' + preview +
        '<button type="button" class="pfs-pb-btn pfs-pb-pick-image" data-idx="' + idx + '" data-key="' + name + '">Choose</button>' +
        (val ? '<button type="button" class="pfs-pb-btn pfs-pb-btn-danger pfs-pb-clear-image" data-idx="' + idx + '" data-key="' + name + '">✕</button>' : '') +
        '</div></div>';
    }
    return '<div class="pfs-pb-field"><label for="' + id + '">' + label + '</label><input type="text" id="' + id + '" value="' + esc(val) + '" data-idx="' + idx + '" data-key="' + name + '" class="pfs-pb-input"></div>';
  }

  function repeater(label, items, idx, itemFields, itemLabel) {
    var h = '<div class="pfs-pb-field"><label>' + label + '</label>';
    (items || []).forEach(function(item, ri) {
      var title = item.name || item.title || (itemLabel + ' ' + (ri+1));
      h += '<div class="pfs-pb-repeater-item" data-ridx="' + ri + '">';
      h += '<div class="pfs-pb-repeater-item-header"><span class="pfs-pb-repeater-item-title">' + esc(title) + '</span>';
      h += '<button type="button" class="pfs-pb-repeater-remove" data-idx="' + idx + '" data-ridx="' + ri + '">✕</button></div>';
      itemFields.forEach(function(f) {
        var fid = 'pfs-r-' + idx + '-' + ri + '-' + f.key;
        if (f.type === 'image') {
          var v = item[f.key] || '';
          var prev = v ? '<img src="' + esc(v) + '" class="pfs-pb-image-preview">' : '<div class="pfs-pb-image-preview empty">🖼</div>';
          h += '<div class="pfs-pb-field"><label>' + f.label + '</label><div class="pfs-pb-image-picker">' + prev +
            '<button type="button" class="pfs-pb-btn pfs-pb-pick-rimage" data-idx="' + idx + '" data-ridx="' + ri + '" data-key="' + f.key + '">Choose</button></div></div>';
        } else if (f.type === 'textarea') {
          h += '<div class="pfs-pb-field"><label for="' + fid + '">' + f.label + '</label><textarea id="' + fid + '" data-idx="' + idx + '" data-ridx="' + ri + '" data-key="' + f.key + '" class="pfs-pb-rinput">' + esc(item[f.key] || '') + '</textarea></div>';
        } else {
          h += '<div class="pfs-pb-field"><label for="' + fid + '">' + f.label + '</label><input type="text" id="' + fid + '" value="' + esc(item[f.key] || '') + '" data-idx="' + idx + '" data-ridx="' + ri + '" data-key="' + f.key + '" class="pfs-pb-rinput"></div>';
        }
      });
      h += '</div>';
    });
    h += '<button type="button" class="pfs-pb-repeater-add" data-idx="' + idx + '">+ Add ' + itemLabel + '</button></div>';
    return h;
  }

  function renderFields(sec, idx) {
    var d = sec.data || {}, h = '';
    switch(sec.type) {
      case 'hero':
        h += field('Tag Line', 'tag', d.tag, 'text', idx);
        h += field('Title', 'title', d.title, 'text', idx);
        h += field('Subtitle', 'subtitle', d.subtitle, 'textarea', idx);
        h += field('Hero Image', 'image', d.image, 'image', idx);
        h += '<div class="pfs-pb-field-row">';
        h += field('CTA Label', 'ctaPrimaryLabel', d.ctaPrimaryLabel, 'text', idx);
        h += field('CTA Link', 'ctaPrimaryHref', d.ctaPrimaryHref, 'text', idx);
        h += '</div><div class="pfs-pb-field-row">';
        h += field('Secondary Label', 'ctaSecondaryLabel', d.ctaSecondaryLabel, 'text', idx);
        h += field('Secondary Link', 'ctaSecondaryHref', d.ctaSecondaryHref, 'text', idx);
        h += '</div>';
        break;
      case 'image_text':
        h += field('Tag', 'tag', d.tag, 'text', idx);
        h += field('Heading', 'title', d.title, 'text', idx);
        h += field('Body', 'body', d.body, 'textarea', idx);
        h += field('Image', 'image', d.image, 'image', idx);
        h += '<div class="pfs-pb-field-row">';
        h += field('Link Label', 'linkLabel', d.linkLabel, 'text', idx);
        h += field('Link URL', 'linkHref', d.linkHref, 'text', idx);
        h += '</div>';
        break;
      case 'text_block':
        h += field('Heading', 'title', d.title, 'text', idx);
        h += field('Body', 'body', d.body, 'textarea', idx);
        break;
      case 'cards_grid':
        h += field('Section Title', 'title', d.title, 'text', idx);
        h += repeater('Cards', d.items, idx, [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'icon', label: 'Icon (emoji)', type: 'text' },
          { key: 'image', label: 'Image', type: 'image' },
          { key: 'description', label: 'Description', type: 'textarea' },
        ], 'Card');
        break;
      case 'categories_grid':
        h += field('Section Title', 'title', d.title, 'text', idx);
        h += repeater('Categories', d.items, idx, [
          { key: 'name', label: 'Name', type: 'text' },
          { key: 'subtitle', label: 'Subtitle', type: 'text' },
          { key: 'image', label: 'Image', type: 'image' },
        ], 'Category');
        break;
      case 'team':
        h += field('Section Title', 'title', d.title, 'text', idx);
        h += repeater('Members', d.items, idx, [
          { key: 'name', label: 'Name', type: 'text' },
          { key: 'role', label: 'Role', type: 'text' },
          { key: 'image', label: 'Photo', type: 'image' },
        ], 'Member');
        break;
      case 'testimonials':
        h += field('Section Title', 'title', d.title, 'text', idx);
        h += repeater('Reviews', d.items, idx, [
          { key: 'name', label: 'Name', type: 'text' },
          { key: 'role', label: 'Role', type: 'text' },
          { key: 'quote', label: 'Quote', type: 'textarea' },
          { key: 'image', label: 'Avatar', type: 'image' },
        ], 'Review');
        break;
      case 'contact_info':
        h += field('Phone', 'phone', d.phone, 'text', idx);
        h += field('Email', 'email', d.email, 'text', idx);
        h += field('Address', 'address', d.address, 'textarea', idx);
        h += field('Urgent Title', 'urgentTitle', d.urgentTitle, 'text', idx);
        h += field('Urgent Text', 'urgentText', d.urgentText, 'textarea', idx);
        break;
      case 'banner':
        h += field('Title', 'title', d.title, 'text', idx);
        h += field('Subtitle', 'subtitle', d.subtitle, 'textarea', idx);
        h += field('Background Image', 'image', d.image, 'image', idx);
        h += '<div class="pfs-pb-field-row">';
        h += field('Button Label', 'ctaLabel', d.ctaLabel, 'text', idx);
        h += field('Button Link', 'ctaHref', d.ctaHref, 'text', idx);
        h += '</div>';
        break;
    }
    return h;
  }

  function renderAddButton() {
    var h = '<div class="pfs-pb-add-section"><div class="pfs-pb-section-picker" id="pfs-pb-picker">';
    Object.keys(SECTION_TYPES).forEach(function(key) {
      var t = SECTION_TYPES[key];
      h += '<button type="button" class="pfs-pb-section-picker-item" data-type="' + key + '"><span class="icon">' + t.icon + '</span><span>' + t.label + '</span></button>';
    });
    h += '</div><button type="button" class="pfs-pb-add-section-btn" id="pfs-pb-add-btn">+ Add Section</button></div>';
    return h;
  }

  // ── Events ──
  function bindEvents() {
    $root.off('.pfs');
    // Toggle section
    $root.on('click.pfs', '.pfs-pb-section-header', function(e) {
      if ($(e.target).closest('.pfs-pb-btn-icon,.pfs-pb-delete').length) return;
      var i = $(this).data('idx');
      $('#pfs-pb-body-' + i).toggleClass('open');
      $(this).find('.pfs-pb-toggle').toggleClass('open');
    });
    // Delete section
    $root.on('click.pfs', '.pfs-pb-delete', function(e) {
      e.stopPropagation();
      if (!confirm('Delete this section?')) return;
      sections.splice($(this).data('idx'), 1);
      save(); render();
    });
    // Text inputs
    $root.on('input.pfs', '.pfs-pb-input', function() {
      var idx = $(this).data('idx'), key = $(this).data('key');
      sections[idx].data[key] = $(this).val();
      save();
    });
    // Repeater inputs
    $root.on('input.pfs', '.pfs-pb-rinput', function() {
      var idx = $(this).data('idx'), ridx = $(this).data('ridx'), key = $(this).data('key');
      sections[idx].data.items[ridx][key] = $(this).val();
      save();
    });
    // Image picker (section-level)
    $root.on('click.pfs', '.pfs-pb-pick-image', function(e) {
      e.preventDefault();
      var idx = $(this).data('idx'), key = $(this).data('key');
      openMedia(function(url) { sections[idx].data[key] = url; save(); render(); });
    });
    $root.on('click.pfs', '.pfs-pb-clear-image', function(e) {
      e.preventDefault();
      var idx = $(this).data('idx'), key = $(this).data('key');
      sections[idx].data[key] = ''; save(); render();
    });
    // Image picker (repeater-level)
    $root.on('click.pfs', '.pfs-pb-pick-rimage', function(e) {
      e.preventDefault();
      var idx = $(this).data('idx'), ridx = $(this).data('ridx'), key = $(this).data('key');
      openMedia(function(url) { sections[idx].data.items[ridx][key] = url; save(); render(); });
    });
    // Repeater remove
    $root.on('click.pfs', '.pfs-pb-repeater-remove', function(e) {
      e.preventDefault();
      var idx = $(this).data('idx'), ridx = $(this).data('ridx');
      sections[idx].data.items.splice(ridx, 1);
      save(); render();
    });
    // Repeater add
    $root.on('click.pfs', '.pfs-pb-repeater-add', function(e) {
      e.preventDefault();
      var idx = $(this).data('idx');
      if (!sections[idx].data.items) sections[idx].data.items = [];
      var template = {};
      var type = sections[idx].type;
      if (type === 'team') template = { name: '', role: '', image: '' };
      else if (type === 'testimonials') template = { name: '', role: '', quote: '', image: '' };
      else if (type === 'categories_grid') template = { name: '', subtitle: '', image: '' };
      else template = { title: '', icon: '', image: '', description: '' };
      sections[idx].data.items.push(template);
      save(); render();
    });
    // Add section toggle
    $root.on('click.pfs', '#pfs-pb-add-btn', function() {
      $('#pfs-pb-picker').toggleClass('open');
    });
    // Add section pick
    $root.on('click.pfs', '.pfs-pb-section-picker-item', function() {
      var type = $(this).data('type');
      sections.push({ type: type, data: getEmptyData(type) });
      save(); render();
      // Open the new section
      var last = sections.length - 1;
      $('#pfs-pb-body-' + last).addClass('open');
    });
  }

  function onReorder() {
    var newOrder = [];
    $('#pfs-pb-list .pfs-pb-section').each(function() {
      newOrder.push(sections[$(this).data('index')]);
    });
    sections = newOrder;
    save(); render();
  }

  function openMedia(cb) {
    var frame = wp.media({ title: 'Select Image', multiple: false, library: { type: 'image' } });
    frame.on('select', function() {
      var url = frame.state().get('selection').first().toJSON().url;
      cb(url);
    });
    frame.open();
  }

  function getEmptyData(type) {
    switch(type) {
      case 'hero': return { tag:'', title:'', subtitle:'', image:'', ctaPrimaryLabel:'', ctaPrimaryHref:'', ctaSecondaryLabel:'', ctaSecondaryHref:'' };
      case 'image_text': return { tag:'', title:'', body:'', image:'', imagePosition:'left', linkLabel:'', linkHref:'' };
      case 'text_block': return { title:'', body:'' };
      case 'cards_grid': return { title:'', items:[] };
      case 'categories_grid': return { title:'', items:[] };
      case 'team': return { title:'', items:[] };
      case 'testimonials': return { title:'', items:[] };
      case 'contact_info': return { phone:'', email:'', address:'', urgentTitle:'', urgentText:'' };
      case 'banner': return { title:'', subtitle:'', image:'', ctaLabel:'', ctaHref:'' };
      default: return {};
    }
  }

  $(document).ready(init);
})(jQuery);
