$(function() {
  var
    rules = document.styleSheets[0].cssRules,
    sample = $('.sample'),
    sample_inner = sample.find('.inner'),
    edit = $('.edit'),
    output = $('.output'),
    textarea = $('textarea'),
    storage_key = 'taper';

  $.each(rules, function(i, rule) {
    var selector = rule.selectorText;
    // only want typography selectors we're defining
    if (selector === undefined || !selector.match(/^.font-/)) return;

    // HACK: placeholders concatenated onto a single line, just grab the last
    selector = selector.split(', ').pop();

    var style = selector.replace('.font-', '');
    var font_family = rule.style.fontFamily.replace(/'/g, '');
    style += ' (' + font_family + ', ' + rule.style.fontSize + '/' + rule.style.lineHeight + ')';
    style = '<span class="type__name">' + style + '</span>';
    if(selector.match(/-caps/)) style = '';

    var element = $('<p>', {
      html: style + '<span class="type__text ' + selector.replace('.', '') + '">Lorem ipsum dolor</span>',
      class: 'type'
    });

    sample_inner.append(element);
  });

  if (sessionStorage[storage_key]) {
    textarea.val(sessionStorage[storage_key]);
    output.html(sessionStorage[storage_key]);
  }

  var save = function() {
    sessionStorage[storage_key] = textarea.val();
  }

  var fill_code = function() {
    var html = output.html();
    html = html.replace(/ contenteditable="true"/igm, '');
    html = html.replace(/ style=""/igm, '');
    html = html.replace(/ selected"/igm, '"');
    textarea.val(html);
    save();
  }

  textarea.on('keyup', function() {
    output.html($(this).val());
    save();
  }).trigger('keyup');

  output.on('keypress', function(e) {
    if(e.keyCode === 13) {
      e.preventDefault();
      return;
    }
  });

  output.on('keyup', function(e) {
    fill_code();
  });

  edit.on('click', '.output *', function() {
    output.find('*').attr('contentEditable', 'true');
    output.find('.selected').removeClass('selected');
    $(this).addClass('selected');
    $('.type__text').text($(this).text());
  });

  edit.on('click', function(e) {
    var target = $(e.target);
    if(target.parents('.output').length) return;
    edit.find('.selected').removeClass('selected');
  });

  $('.sample .type__text').on('click', function() {
    var selected = $('.output').find('.selected');
    var style = $(this).attr('class').match(/font-[a-z-]{1,}/)[0];
    selected.attr('class', style);
    fill_code();
    selected.addClass('selected');
  });

  $(window).on('resize', function() {
    var h = $(this).height() - 60;
    sample_inner.height(h);
  }).trigger('resize');

});
