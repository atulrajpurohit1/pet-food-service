/**
 * PFS Headless Admin — Interactive Control Hub JS
 */
(function($){
'use strict';

var SEC_TYPES = {
  hero:'🎯 Hero', image_text:'🖼️ Image+Text', cards_grid:'🃏 Cards',
  categories_grid:'📦 Categories', team:'👥 Team', testimonials:'⭐ Reviews',
  contact_info:'📞 Contact', text_block:'📝 Text', banner:'📢 Banner'
};

// ═══ PAGES APP ═══
var $pagesApp = $('#pfs-ha-pages-app');
if ($pagesApp.length) {
  var pages = JSON.parse($pagesApp.attr('data-pages') || '[]');
  renderPages();
}

function renderPages() {
  var h = '<div class="pfs-ha-page-list">';
  pages.forEach(function(p, pi) {
    var secCount = (p.sections||[]).length;
    h += '<div class="pfs-ha-page-card" data-pi="'+pi+'">';
    h += '<div class="pfs-ha-page-header" data-pi="'+pi+'">';
    h += '<div class="pfs-ha-page-thumb">'+(p.thumb?'<img src="'+esc(p.thumb)+'">':'📄')+'</div>';
    h += '<div class="pfs-ha-page-info"><div class="pfs-ha-page-title">'+esc(p.title)+'</div><div class="pfs-ha-page-slug">/'+esc(p.slug)+'</div></div>';
    h += '<span class="pfs-ha-page-sections-badge">'+secCount+' sections</span>';
    h += '<span class="pfs-ha-page-toggle" data-pi="'+pi+'">▾</span>';
    h += '</div>';
    h += '<div class="pfs-ha-page-body" id="pfs-ha-pb-'+pi+'">';
    h += renderPageEditor(p, pi);
    h += '</div></div>';
  });
  h += '</div>';
  $pagesApp.html(h);
  // Make sections sortable
  pages.forEach(function(p,pi){ $('#pfs-ha-seclist-'+pi).sortable({handle:'.pfs-ha-sec-drag',update:function(){reorderSecs(pi);}}); });
  bindPageEvents();
}

function renderPageEditor(p, pi) {
  var h = '<div class="pfs-ha-meta-grid">';
  h += fld('Title','text','pg-title-'+pi, p.title, 'data-pi="'+pi+'" data-mk="title"', 'pfs-ha-pg-meta');
  h += fld('Slug','text','pg-slug-'+pi, p.slug, 'data-pi="'+pi+'" data-mk="slug"', 'pfs-ha-pg-meta');
  h += '</div>';
  h += '<div class="pfs-ha-field"><label>Featured Image</label><div class="pfs-ha-img-pick">';
  h += '<div class="pfs-ha-img-prev">'+(p.thumb?'<img src="'+esc(p.thumb)+'">':'🖼')+'</div>';
  h += '<button type="button" class="pfs-ha-btn pfs-ha-btn-sm pfs-ha-pg-thumb-pick" data-pi="'+pi+'">Choose</button>';
  if(p.thumb) h += '<button type="button" class="pfs-ha-btn pfs-ha-btn-sm pfs-ha-btn-danger pfs-ha-pg-thumb-clear" data-pi="'+pi+'">✕</button>';
  h += '</div></div>';
  h += '<div class="pfs-ha-save-bar"><button type="button" class="pfs-ha-btn pfs-ha-btn-primary pfs-ha-save-page-meta" data-pi="'+pi+'">Save Page Info</button><span class="pfs-ha-toast" id="pfs-ha-toast-meta-'+pi+'"></span></div>';
  h += '<hr style="border:0;border-top:1px solid #f1f5f9;margin:20px 0">';
  h += '<div class="pfs-ha-sections-header"><h4>Sections</h4><span class="pfs-ha-badge">'+((p.sections||[]).length)+' sections</span></div>';
  h += '<div id="pfs-ha-seclist-'+pi+'">';
  (p.sections||[]).forEach(function(sec,si){ h += renderSec(sec,pi,si); });
  h += '</div>';
  h += renderAddSec(pi);
  h += '<div class="pfs-ha-save-bar" style="margin-top:14px"><button type="button" class="pfs-ha-btn pfs-ha-btn-primary pfs-ha-save-secs" data-pi="'+pi+'">💾 Save All Sections</button><span class="pfs-ha-toast" id="pfs-ha-toast-sec-'+pi+'"></span></div>';
  return h;
}

function renderSec(sec, pi, si) {
  var label = SEC_TYPES[sec.type]||sec.type, title = sec.data?.title||sec.data?.name||label;
  var h = '<div class="pfs-ha-sec" data-si="'+si+'">';
  h += '<div class="pfs-ha-sec-head" data-pi="'+pi+'" data-si="'+si+'">';
  h += '<span class="pfs-ha-sec-drag">⠿</span><span class="pfs-ha-sec-type">'+label+'</span>';
  h += '<span class="pfs-ha-sec-name">'+esc(title)+'</span>';
  h += '<button type="button" class="pfs-ha-sec-del" data-pi="'+pi+'" data-si="'+si+'">✕</button>';
  h += '<span class="pfs-ha-sec-toggle">▾</span></div>';
  h += '<div class="pfs-ha-sec-body" id="pfs-ha-sb-'+pi+'-'+si+'">'+renderSecFields(sec,pi,si)+'</div>';
  return h+'</div>';
}

function renderSecFields(sec,pi,si) {
  var d=sec.data||{}, p='s-'+pi+'-'+si, h='';
  switch(sec.type){
    case 'hero':
      h+=sfld('Tag',p+'-tag',d.tag,pi,si,'tag');
      h+=sfld('Title',p+'-title',d.title,pi,si,'title');
      h+=sfld('Subtitle',p+'-sub',d.subtitle,pi,si,'subtitle','textarea');
      h+=simg('Image',pi,si,'image',d.image);
      h+='<div class="pfs-ha-sec-field-row">'+sfld('CTA Label',p+'-cl',d.ctaPrimaryLabel,pi,si,'ctaPrimaryLabel')+sfld('CTA Link',p+'-ch',d.ctaPrimaryHref,pi,si,'ctaPrimaryHref')+'</div>';
      h+='<div class="pfs-ha-sec-field-row">'+sfld('2nd Label',p+'-sl',d.ctaSecondaryLabel,pi,si,'ctaSecondaryLabel')+sfld('2nd Link',p+'-sh',d.ctaSecondaryHref,pi,si,'ctaSecondaryHref')+'</div>';
      break;
    case 'image_text':
      h+=sfld('Tag',p+'-tag',d.tag,pi,si,'tag');
      h+=sfld('Heading',p+'-t',d.title,pi,si,'title');
      h+=sfld('Body',p+'-b',d.body,pi,si,'body','textarea');
      h+=simg('Image',pi,si,'image',d.image);
      h+='<div class="pfs-ha-sec-field-row">'+sfld('Link Label',p+'-ll',d.linkLabel,pi,si,'linkLabel')+sfld('Link URL',p+'-lh',d.linkHref,pi,si,'linkHref')+'</div>';
      break;
    case 'text_block':
      h+=sfld('Heading',p+'-t',d.title,pi,si,'title');
      h+=sfld('Body',p+'-b',d.body,pi,si,'body','textarea');
      break;
    case 'cards_grid':
      h+=sfld('Section Title',p+'-t',d.title,pi,si,'title');
      h+=rep(d.items,pi,si,[{k:'title',l:'Title'},{k:'icon',l:'Icon'},{k:'description',l:'Description',t:'textarea'}],'Card');
      break;
    case 'categories_grid':
      h+=sfld('Section Title',p+'-t',d.title,pi,si,'title');
      h+=rep(d.items,pi,si,[{k:'name',l:'Name'},{k:'subtitle',l:'Subtitle'},{k:'image',l:'Image',t:'image'}],'Category');
      break;
    case 'team':
      h+=sfld('Section Title',p+'-t',d.title,pi,si,'title');
      h+=rep(d.items,pi,si,[{k:'name',l:'Name'},{k:'role',l:'Role'},{k:'image',l:'Photo',t:'image'}],'Member');
      break;
    case 'testimonials':
      h+=sfld('Section Title',p+'-t',d.title,pi,si,'title');
      h+=rep(d.items,pi,si,[{k:'name',l:'Name'},{k:'role',l:'Role'},{k:'quote',l:'Quote',t:'textarea'},{k:'image',l:'Avatar',t:'image'}],'Review');
      break;
    case 'contact_info':
      h+=sfld('Phone',p+'-ph',d.phone,pi,si,'phone');
      h+=sfld('Email',p+'-em',d.email,pi,si,'email');
      h+=sfld('Address',p+'-ad',d.address,pi,si,'address','textarea');
      h+=sfld('Urgent Title',p+'-ut',d.urgentTitle,pi,si,'urgentTitle');
      h+=sfld('Urgent Text',p+'-ux',d.urgentText,pi,si,'urgentText','textarea');
      break;
    case 'banner':
      h+=sfld('Title',p+'-t',d.title,pi,si,'title');
      h+=sfld('Subtitle',p+'-s',d.subtitle,pi,si,'subtitle','textarea');
      h+=simg('Background',pi,si,'image',d.image);
      h+='<div class="pfs-ha-sec-field-row">'+sfld('Button',p+'-cl',d.ctaLabel,pi,si,'ctaLabel')+sfld('Link',p+'-ch',d.ctaHref,pi,si,'ctaHref')+'</div>';
      break;
  }
  return h;
}

// Field helpers
function esc(s){return $('<span>').text(s||'').html();}
function fld(l,t,id,v,extra,cls){return '<div class="pfs-ha-field"><label for="'+id+'">'+l+'</label><input type="text" id="'+id+'" value="'+esc(v)+'" class="'+(cls||'')+'" '+extra+'></div>';}
function sfld(l,id,v,pi,si,k,t){
  var c='pfs-ha-sec-input';
  if(t==='textarea') return '<div class="pfs-ha-field"><label>'+l+'</label><textarea id="'+id+'" data-pi="'+pi+'" data-si="'+si+'" data-k="'+k+'" class="'+c+'">'+esc(v)+'</textarea></div>';
  return '<div class="pfs-ha-field"><label>'+l+'</label><input type="text" id="'+id+'" value="'+esc(v)+'" data-pi="'+pi+'" data-si="'+si+'" data-k="'+k+'" class="'+c+'"></div>';
}
function simg(l,pi,si,k,v){
  var prev=v?'<img src="'+esc(v)+'">':'🖼';
  return '<div class="pfs-ha-field"><label>'+l+'</label><div class="pfs-ha-img-pick"><div class="pfs-ha-img-prev">'+prev+'</div>'+
    '<button type="button" class="pfs-ha-btn pfs-ha-btn-sm pfs-ha-sec-img-pick" data-pi="'+pi+'" data-si="'+si+'" data-k="'+k+'">Choose</button>'+
    (v?'<button type="button" class="pfs-ha-btn pfs-ha-btn-sm pfs-ha-btn-danger pfs-ha-sec-img-clear" data-pi="'+pi+'" data-si="'+si+'" data-k="'+k+'">✕</button>':'')+
    '</div></div>';
}
function rep(items,pi,si,fields,label){
  var h='<div class="pfs-ha-field"><label>'+label+'s</label>';
  (items||[]).forEach(function(item,ri){
    h+='<div class="pfs-ha-rep-item"><div class="pfs-ha-rep-head"><span class="pfs-ha-rep-title">'+esc(item.name||item.title||label+' '+(ri+1))+'</span>';
    h+='<button type="button" class="pfs-ha-rep-del" data-pi="'+pi+'" data-si="'+si+'" data-ri="'+ri+'">✕</button></div>';
    fields.forEach(function(f){
      if(f.t==='image'){
        var v=item[f.k]||'',prev=v?'<img src="'+esc(v)+'">':'🖼';
        h+='<div class="pfs-ha-field"><label>'+f.l+'</label><div class="pfs-ha-img-pick"><div class="pfs-ha-img-prev">'+prev+'</div>';
        h+='<button type="button" class="pfs-ha-btn pfs-ha-btn-sm pfs-ha-rep-img" data-pi="'+pi+'" data-si="'+si+'" data-ri="'+ri+'" data-k="'+f.k+'">Choose</button></div></div>';
      } else if(f.t==='textarea'){
        h+='<div class="pfs-ha-field"><label>'+f.l+'</label><textarea data-pi="'+pi+'" data-si="'+si+'" data-ri="'+ri+'" data-k="'+f.k+'" class="pfs-ha-rep-input">'+esc(item[f.k]||'')+'</textarea></div>';
      } else {
        h+='<div class="pfs-ha-field"><label>'+f.l+'</label><input type="text" value="'+esc(item[f.k]||'')+'" data-pi="'+pi+'" data-si="'+si+'" data-ri="'+ri+'" data-k="'+f.k+'" class="pfs-ha-rep-input"></div>';
      }
    });
    h+='</div>';
  });
  h+='<button type="button" class="pfs-ha-rep-add" data-pi="'+pi+'" data-si="'+si+'">+ Add '+label+'</button></div>';
  return h;
}
function renderAddSec(pi){
  var h='<div class="pfs-ha-add-sec"><div class="pfs-ha-picker" id="pfs-ha-picker-'+pi+'">';
  Object.keys(SEC_TYPES).forEach(function(k){h+='<button type="button" class="pfs-ha-picker-item" data-pi="'+pi+'" data-type="'+k+'">'+SEC_TYPES[k]+'</button>';});
  h+='</div><button type="button" class="pfs-ha-add-btn" data-pi="'+pi+'">+ Add Section</button></div>';
  return h;
}
function emptyData(t){
  switch(t){
    case 'hero':return{tag:'',title:'',subtitle:'',image:'',ctaPrimaryLabel:'',ctaPrimaryHref:'',ctaSecondaryLabel:'',ctaSecondaryHref:''};
    case 'image_text':return{tag:'',title:'',body:'',image:'',linkLabel:'',linkHref:''};
    case 'text_block':return{title:'',body:''};
    case 'cards_grid':case 'categories_grid':case 'team':case 'testimonials':return{title:'',items:[]};
    case 'contact_info':return{phone:'',email:'',address:'',urgentTitle:'',urgentText:''};
    case 'banner':return{title:'',subtitle:'',image:'',ctaLabel:'',ctaHref:''};
    default:return{};
  }
}
function emptyItem(t){
  if(t==='team')return{name:'',role:'',image:''};
  if(t==='testimonials')return{name:'',role:'',quote:'',image:''};
  if(t==='categories_grid')return{name:'',subtitle:'',image:''};
  return{title:'',icon:'',description:''};
}

function bindPageEvents(){
  var $w=$pagesApp;
  $w.off('.ha');
  // Toggle page
  $w.on('click.ha','.pfs-ha-page-header',function(){
    var pi=$(this).data('pi');$('#pfs-ha-pb-'+pi).toggleClass('open');$(this).find('.pfs-ha-page-toggle').toggleClass('open');
  });
  // Toggle section
  $w.on('click.ha','.pfs-ha-sec-head',function(e){
    if($(e.target).closest('.pfs-ha-sec-del').length)return;
    var pi=$(this).data('pi'),si=$(this).data('si');
    $('#pfs-ha-sb-'+pi+'-'+si).toggleClass('open');$(this).find('.pfs-ha-sec-toggle').toggleClass('open');
  });
  // Section text input
  $w.on('input.ha','.pfs-ha-sec-input',function(){
    var pi=$(this).data('pi'),si=$(this).data('si'),k=$(this).data('k');
    pages[pi].sections[si].data[k]=$(this).val();
  });
  // Repeater input
  $w.on('input.ha','.pfs-ha-rep-input',function(){
    var pi=$(this).data('pi'),si=$(this).data('si'),ri=$(this).data('ri'),k=$(this).data('k');
    pages[pi].sections[si].data.items[ri][k]=$(this).val();
  });
  // Section image pick
  $w.on('click.ha','.pfs-ha-sec-img-pick',function(e){e.preventDefault();
    var pi=$(this).data('pi'),si=$(this).data('si'),k=$(this).data('k');
    pickImage(function(url){pages[pi].sections[si].data[k]=url;renderPages();});
  });
  $w.on('click.ha','.pfs-ha-sec-img-clear',function(e){e.preventDefault();
    var pi=$(this).data('pi'),si=$(this).data('si'),k=$(this).data('k');
    pages[pi].sections[si].data[k]='';renderPages();
  });
  // Repeater image pick
  $w.on('click.ha','.pfs-ha-rep-img',function(e){e.preventDefault();
    var pi=$(this).data('pi'),si=$(this).data('si'),ri=$(this).data('ri'),k=$(this).data('k');
    pickImage(function(url){pages[pi].sections[si].data.items[ri][k]=url;renderPages();});
  });
  // Delete section
  $w.on('click.ha','.pfs-ha-sec-del',function(e){e.stopPropagation();
    if(!confirm('Delete this section?'))return;
    var pi=$(this).data('pi'),si=$(this).data('si');
    pages[pi].sections.splice(si,1);renderPages();
  });
  // Repeater delete
  $w.on('click.ha','.pfs-ha-rep-del',function(e){e.preventDefault();
    var pi=$(this).data('pi'),si=$(this).data('si'),ri=$(this).data('ri');
    pages[pi].sections[si].data.items.splice(ri,1);renderPages();
  });
  // Repeater add
  $w.on('click.ha','.pfs-ha-rep-add',function(e){e.preventDefault();
    var pi=$(this).data('pi'),si=$(this).data('si'),sec=pages[pi].sections[si];
    if(!sec.data.items)sec.data.items=[];
    sec.data.items.push(emptyItem(sec.type));renderPages();
  });
  // Add section toggle
  $w.on('click.ha','.pfs-ha-add-btn',function(){$('#pfs-ha-picker-'+$(this).data('pi')).toggleClass('open');});
  // Add section pick
  $w.on('click.ha','.pfs-ha-picker-item',function(){
    var pi=$(this).data('pi'),t=$(this).data('type');
    pages[pi].sections.push({type:t,data:emptyData(t)});renderPages();
  });
  // Save page meta
  $w.on('click.ha','.pfs-ha-save-page-meta',function(){
    var pi=$(this).data('pi'),p=pages[pi];
    p.title=$('#pg-title-'+pi).val();p.slug=$('#pg-slug-'+pi).val();
    $.post(pfsHA.ajax,{action:'pfs_save_page_meta',nonce:pfsHA.nonce,post_id:p.id,title:p.title,slug:p.slug,featured_image:p.thumbId||0},function(r){
      toast('pfs-ha-toast-meta-'+pi,r.success);
    });
  });
  // Page thumb pick
  $w.on('click.ha','.pfs-ha-pg-thumb-pick',function(e){e.preventDefault();
    var pi=$(this).data('pi');
    pickImageFull(function(id,url){pages[pi].thumb=url;pages[pi].thumbId=id;renderPages();});
  });
  $w.on('click.ha','.pfs-ha-pg-thumb-clear',function(e){e.preventDefault();
    var pi=$(this).data('pi');pages[pi].thumb='';pages[pi].thumbId=0;renderPages();
  });
  // Save sections
  $w.on('click.ha','.pfs-ha-save-secs',function(){
    var pi=$(this).data('pi'),p=pages[pi];
    $.post(pfsHA.ajax,{action:'pfs_save_sections',nonce:pfsHA.nonce,post_id:p.id,sections:JSON.stringify(p.sections)},function(r){
      toast('pfs-ha-toast-sec-'+pi,r.success);
    });
  });
}

function reorderSecs(pi){
  var newOrder=[];
  $('#pfs-ha-seclist-'+pi+' .pfs-ha-sec').each(function(){newOrder.push(pages[pi].sections[$(this).data('si')]);});
  pages[pi].sections=newOrder;renderPages();
}

function pickImage(cb){var f=wp.media({title:'Select Image',multiple:false,library:{type:'image'}});f.on('select',function(){cb(f.state().get('selection').first().toJSON().url);});f.open();}
function pickImageFull(cb){var f=wp.media({title:'Select Image',multiple:false,library:{type:'image'}});f.on('select',function(){var a=f.state().get('selection').first().toJSON();cb(a.id,a.url);});f.open();}
function toast(id,ok){var $t=$('#'+id);$t.removeClass('success error').addClass(ok?'success':'error').text(ok?'✅ Saved!':'❌ Error').show();setTimeout(function(){$t.fadeOut();},3000);}

// ═══ GLOBAL SETTINGS APP ═══
var $globalApp=$('#pfs-ha-global-app');
if($globalApp.length){
  var gs=JSON.parse($globalApp.attr('data-settings')||'{}');
  renderGlobal();
}

function renderGlobal(){
  var c=gs.contact||{}, h='<div class="pfs-ha-global-grid">';
  // Branding
  h+='<div class="pfs-ha-card"><h3>🎨 Branding</h3>';
  h+=fld('Site Title','text','gs-title',gs.siteTitle,'','pfs-ha-gs');
  h+='<div class="pfs-ha-field"><label>Logo</label><p style="color:#94a3b8;font-size:12px">Manage via <a href="'+pfsHA.wpUrl+'/wp-admin/customize.php?autofocus[section]=title_tagline">Customizer</a></p></div>';
  h+='</div>';
  // Colors
  h+='<div class="pfs-ha-card"><h3>🎨 Theme Colors</h3>';
  h+=fld('Primary','text','gs-primary',gs.primary,'class="pfs-ha-color"','');
  h+=fld('Secondary','text','gs-secondary',gs.secondary,'class="pfs-ha-color"','');
  h+=fld('Accent','text','gs-accent',gs.accent,'class="pfs-ha-color"','');
  h+='</div>';
  // Contact
  h+='<div class="pfs-ha-card"><h3>📞 Contact</h3>';
  h+=fld('Email','text','gs-email',c.email||'','','pfs-ha-gs-contact');
  h+=fld('Phone','text','gs-phone',c.phone||'','','pfs-ha-gs-contact');
  h+='<div class="pfs-ha-field"><label>Address</label><textarea id="gs-address" class="pfs-ha-gs-contact">'+(c.address||'')+'</textarea></div>';
  h+='</div>';
  // Sync
  h+='<div class="pfs-ha-card"><h3>🔄 Sync</h3>';
  h+=fld('Frontend URL','text','gs-frontend',gs.frontendUrl,'','');
  h+='<div class="pfs-ha-field"><label>Revalidation Secret</label><input type="password" id="gs-secret" value="'+esc(gs.secret)+'"></div>';
  h+='</div>';
  h+='</div>';
  h+='<div class="pfs-ha-save-bar" style="margin-top:20px"><button type="button" class="pfs-ha-btn pfs-ha-btn-primary" id="pfs-ha-save-global">💾 Save Global Settings</button><span class="pfs-ha-toast" id="pfs-ha-toast-global"></span></div>';
  $globalApp.html(h);
  $('.pfs-ha-color').wpColorPicker();
  $('#pfs-ha-save-global').on('click',saveGlobal);
}

function saveGlobal(){
  var contact=JSON.stringify({email:$('#gs-email').val(),phone:$('#gs-phone').val(),address:$('#gs-address').val()});
  $.post(pfsHA.ajax,{
    action:'pfs_save_global',nonce:pfsHA.nonce,
    blogname:$('#gs-title').val(),
    pfs_primary_color:$('#gs-primary').val()||$('.pfs-ha-color').eq(0).wpColorPicker('color'),
    pfs_secondary_color:$('#gs-secondary').val()||$('.pfs-ha-color').eq(1).wpColorPicker('color'),
    pfs_accent_color:$('#gs-accent').val()||$('.pfs-ha-color').eq(2).wpColorPicker('color'),
    pfs_contact_details:contact,
    pfs_frontend_url:$('#gs-frontend').val(),
    pfs_revalidation_secret:$('#gs-secret').val()
  },function(r){toast('pfs-ha-toast-global',r.success);});
}

})(jQuery);
