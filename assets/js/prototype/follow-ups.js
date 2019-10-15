/*

  Show and hide followup fields for radio buttons and checkboxes
  Todo: we need to DRY up the code a little bit.
*/

$(document).ready(function() {
  var aria_hidden_attr = "aria-hidden",
      $radio = $("input:radio"),
      $checkbox = $('input:checkbox[data-followup]'),
      $selectbox = $('select');

  var showFollowup = function(control, target) {
    target.removeAttr("hidden");
    control.attr("aria-expanded", "true");
    target.find('input, select, textarea').removeAttr("disabled");
  }

  var hideFollowup = function(control, target) {
    target.attr("hidden", "");
    control.attr("aria-expanded", "false");
    target.find('input, select, textarea').attr("disabled", "true");
  };

  // Handle Radio Buttons
  $radio.change(function () {
    var name = $(this).attr("name");
    var $control = $('input:radio[name="'+ name +'"]');

    $control.each(function(){
      var target = $(this).attr('data-followup');
      if ($(this).is(":checked")) {
        showFollowup($control, $('#' + target));
      }
      else {
        hideFollowup($control, $('#' + target));
      }
    });
  });

  // Handle Checkboxes
  $checkbox.change(function(){
    var $control = $(this),
        target = $(this).attr('data-followup');
    if ($(this).is(":checked")) {
      showFollowup($control, $('#' + target));
    }
    else {
      hideFollowup($control, $('#' + target));
    }
  });

  // Handle Select Boxes
  var previous;
  $selectbox.on('click focus keydown', function(){
    previous = $(this).find(':selected').attr('data-followup');
  }).change(function(){
    var $control = $(this).find('option[data-followup]:selected'),
        selected_val = $(this).find('option[data-followup]:selected').val(),
        target = $(this).find(':selected').attr('data-followup');
    if ($(this).find(':selected').val() == selected_val) {
      showFollowup($control, $('#' + target));
    }
    if (selected_val != previous) {
      hideFollowup($control, $('#' + previous));
    }
  });

});
