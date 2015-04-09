$(document).ready(function(){

var BASE = $('base').attr('href');
var LANG = $('#lang').text();
var EXT_LINK_TTL = (LANG == 'el')? 'Εξωτερικός σύνδεσμος - Ανοίγει σε νέο παράθυρο':'External link - Opens in a new tab';
var PAGE = $('#page').text();
var TEMPLATE = $('#template').text();

// ------- Initiate for js enabled clients
$('#footerMail').show();


// ------- Template related

if (TEMPLATE == 'home') {

  function handleArrowKeys2(e) {
    var keynum = 0;
    if(e.which) {keynum = e.which;}    // Firefox/Opera/Webkit
    if(keynum == 37) { // left
      $('#rw').click();
    }
    if(keynum == 39) { // right
      $('#ff').click();
    }
  }

  document.onkeyup = handleArrowKeys2;

  function resize_homepage(){
    var w_height = $(window).height();
    var diff = w_height - 660;
    var marginTop = (-150)+(diff/2.4);
    if (diff > 0) {
      $('#slideshow').css('margin-top', marginTop).css('margin-bottom', Math.abs(marginTop)-90);
    } else {
      $('#slideshow').css('margin-top', -150).css('margin-bottom', 60);
    }
  }

  resize_homepage();

  // ------- Slideshow
  
  $('#slideshow').css('margin', '-150px auto 60px auto');
  $('#slideshow').hide().fadeIn(1000);

  $('#slideshow').cycle({
      timeout: 2500,
      speed:   400,
      delay:   0,
      slideExpr: 'img',
      prev:   '#rw',
      next:   '#ff',
      pause:   1,
      sync:    1,
      before: function() {
        var caption = this.alt.split('@@');
        $('#slideshow_caption').html('<span class="ss_caption_title">'+caption[0]+'</span>/<span class="ss_caption_client">'+caption[1]+'</span>');
      }
  });

  $('#slideshow').mouseenter(function(){
    $('#slideshow_bar').show(100);
  }).mouseleave(function(){
    $('#slideshow_bar').hide(100);
  });

  $('#slideshow img').click(function(){
    window.location = BASE + $(this).attr('rel');
  });
}

if (PAGE == 'home'){
  resize_homepage();
  $(window).resize(function() {
    resize_homepage();
  });
}

//--- COMPANY
if (TEMPLATE == 'company') {
  $('#submenu li a.anchor').show();
  $('#submenu li:first a').addClass('selected');

  $('.anchor').click(function(){
    $('.anchor').removeClass('selected');
    var target = $(this).attr('rel');
    $(this).addClass('selected');
    $('body').scrollTo('#'+target, 1200, {offset:-175});
    return false;
  });

  $('.box:last').css('border','none');
}

// --- PROJECTS
if (TEMPLATE == 'projects') {

  $('#archive').show();

  $('#view_archive_btn').click(function(){
    $(this).addClass('active');
    $(this).html($('#loadingLabel').text()+'<img src="graphics/ajax-loader_small.gif" width="16" height="16" alt="" />');
    $.ajax({
      type: 'POST',
      url: 'load-archive.php',
      data: 'lang='+LANG,
      success: function(response){
        $('#archive').html(response)
      },
      error:function(request,status,error){
        var err_msg = (LANG == 'el')? 'Δυστυχώς η σύνδεση δεν είναι εφικτή. Παρακαλούμε δοκιμάστε πάλι σε μια στιγμή.':'Unfortunately the connection to the server is currently unavailable. Please try again in a moment.';
        $(this).html('<p>'+err_msg+'</p>');
      }
    });
  });

  $('#searchIcon').click(function(){
    if ($('#search').hasClass('filterON')) {
      if ($('#search').hasClass('expanded')) {
        $('#search').removeClass('expanded');
        $('#filter').show();
      } else {
        $('#search').addClass('expanded');
        $('#filter').hide();
      }
    }
  });

  // Detect if there is native support for the HTML5 placeholder attribute
  var fakeInput = document.createElement("input"), placeHolderSupport = ("placeholder" in fakeInput);
  if (!placeHolderSupport) {
    if ($('#searchTerm').val().length === 0) { // alt way of checking val() == ''
      $('#searchTerm').val($('#searchLabel').val());
    }
    $('#searchTerm').focus(function(){
      if ($(this).val() == $('#searchLabel').val()) {
        $(this).val('');
      }
    }).blur(function(){
      if ($(this).val() == '') {
        $(this).val($('#searchLabel').val());
      }
    });
  }

  $('.project-thumb').each(function(){
    console.log($(this).attr('href'));
  });
  console.log('---------------------------');

  $('.project').live('mouseenter', function(){
    var $this = $(this);
    var title = $this.find('.project-title').html();
    var client = $this.find('.project-client').html();
    var details = $this.find('.project-details').html();
    var awards = $this.find('.project-awards').html();
    $('#projects-hover-title').html(title);
    $('#projects-hover-client').html(client);
    $('#projects-hover-details').html(details);
    $('#projects-hover-awards').html(awards);
    $('#hidden-link').text($this.find('.project-thumb').attr('href'));
    console.log($('#hidden-link').text());
    var top = $this.position().top; //-45
    var left = $this.position().left; //-54
    $('#projects-hover').css('top',top).css('left',left).show();
  }).live('mouseleave', function(){
    //$('#hidden-link').text('');
    $('#projects-hover').css('display','none');
  });

  $('#projects-hover').live('mouseover', function(e){
    //$('#hidden-link').text('');
    $('#projects-hover').show();
  });

  $('#projects-hover').live('mouseleave', function(){
    //$('#hidden-link').text('');
    $(this).css('display','none');
  });

  $('#projects-hover').live('click', function(){
    if ($('#hidden-link').text() == '') {
      console.log('hidden-link is empty ->'+$('#hidden-link').text())
      return false;
    }
//    var destination = BASE + $('#hidden-link').text();
//    destination = destination.replace('//','/');
    if ($('#related').length > 0){
      var category_alias = $('#category_alias').text();
      $.ajax({
        type: 'POST',
        url: 'set-filter.php',
        data: 'filter=category:'+category_alias,
        success: function(){
          //window.location = BASE + $('#hidden-link').text();
          window.location = $('#hidden-link').text();
        },
        error:function(request,status,error){
          $(this).html('<p>Unfortunately the connection to the server is currently unavailable. Please try again in a moment.</p>');
        }
      });
    } else {
      if ($('#hidden-link').text().indexOf('http://')>-1) {
        window.location = $('#hidden-link').text(); // for bloody IE7
      } else {
        //window.location = BASE + $('#hidden-link').text();
        window.location = $('#hidden-link').text();
      }
    }
    return true;
  });

}

// --- CONTACT
if (TEMPLATE == 'contact') {
  $('#map_symbol').show();
  $('#map_link').show();
  $('.mailLabel').show();

  $('#map_link').click(function(){
    if ($('#mapArea').css('height') == '0px') {
      $('#mapArea').animate({height:'520px'}, 300, function() {});
    } else {
      $('#mapArea').animate({height:'0'}, 300);
    }
  }).mouseover(function(){
    $('#map_symbol').css('background-position', '-610px -40px');
  }).mouseout(function(){
    $('#map_symbol').css('background-position', '-610px 0');
  });
}
// --- NEWS
if (TEMPLATE == 'news') {
  $('.newspost:last').css('border-bottom', 'none');
  $('.expand').show();
  $('.collapse').hide();
  $('.newstext').hide();

  $('.expand').click(function(){
    var parent = $(this).parent('.newsbody');
    parent.find('.expand').hide();
    parent.find('.collapse').show();
    parent.find('.newstext').slideDown(500);
  });
  $('.collapse').click(function(){
    var parent = $(this).parent('.newsbody');
    parent.find('.expand').show();
    parent.find('.collapse').hide();
    parent.find('.newstext').slideUp(50);
    $('body').scrollTo(parent, 500, {offset:-175});
  });
}

// ------- General

$('img').not('#home img').lazyload({threshold:0, effect:"fadeIn", placeholder:"graphics/white.gif", failurelimit:10});

$("a[href^='http']").not("[href^='"+BASE+"']").addClass('external').attr('title',EXT_LINK_TTL).click(function() {
  window.open($(this).attr('href'));
  return false;
});

if ($('.contactMail').length){
  var name;
  var domain;
  var displayed;
  $('.contactMail').each(function(){
    name = $('span:last', this).text();
    domain = $('span:first', this).text();
    displayed = name+"@"+domain;
    $(this).append('<a id="sp" href=mailto:' + name + '@' + domain + '>' + displayed + '</a>');
  });
}

function handleArrowKeys(e) {
  var keynum = 0;

  if(e.which) {keynum = e.which;}    // Firefox/Opera/Webkit

  if(keynum == 37) { // left
    var prev = $('#prevlink').parent('a').attr('href');
    if (prev != undefined) {
      window.location = BASE + prev;
    }
  }
  if(keynum == 39) { // right
    var next = $('#nextlink').parent('a').attr('href');
    if (next != undefined) {
      window.location = BASE + next;
    }
  }
  if(keynum == 38) { // up arrow
    var up = $('#thumblink').parent('a').attr('href');
    window.location = BASE + up;
  }
  if(keynum == 27) { // esc
    var esc = $('#projects-close a:first').attr('href');
    window.location = esc;
  }
}

if($('#project-details').length) {
  document.onkeyup = handleArrowKeys;
}
});