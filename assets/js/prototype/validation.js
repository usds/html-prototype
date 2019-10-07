$(document).ready(function(){
  'use strict';
  var $inputs = $('input:not([type="hidden"]), input:not([type="submit"]), select'),
      $form = $('form'),
      $submit = $('button[type="submit"]'),
      errorClass = "contains-error",
      labelErrorClass = "usa-input-error-label",
      errorID = "error",
      $errorplaceholder = $('.error-placeholder'),
      errorContainer = ('<div class="usa-input-error"></div>');


  var displayErrors = function($el) {

    var errorMessage = $el.attr('data-custom-validity') || $el[0].validationMessage,
      errorFieldName = $el.attr('id'),
      $label = $('label[for="'+errorFieldName+'"]'),
      $container = $el.closest('.field-group');

    if (($el.attr("type") != "radio") && ($el.attr("type") != "checkbox")) {
      var errorMessage = '<span id="error" aria-atomic="true" class="usa-input-error-message" role="alert">'+errorMessage+'</span>';
      $el.add($label).wrapAll(errorContainer);
      $el.addClass(errorClass);
      $label.addClass(labelErrorClass);
      $el.next().remove('.form-feedback');
      if ($el.parents().find($errorplaceholder).length) {
        $errorplaceholder.html(errorMessage);
      }
      else {
        $el.after(errorMessage);
      }
    }
    else if ($el.attr("type") == "checkbox") {
      $el.before('<span aria-atomic="true" class="usa-input-error-message" role="alert">'+errorMessage+'</span>');
    }
    else {
      $el.parent().parent().before('<span aria-atomic="true" class="usa-input-error-message" role="alert">'+errorMessage+'</span>');
    }
    $el.focus();
    $container.attr('id',  errorID).addClass(errorClass);
    location.href = "#" + errorID;
  };

  var clearErrors = function($el) {
    $el.removeClass(errorClass);
    $('.usa-input-error-message').remove();
    $('label.'+ labelErrorClass).removeClass(labelErrorClass);
    $('#error').removeClass(errorClass).removeAttr('id');
    $('.usa-input-error').replaceWith(function() { return $(this).contents(); });
  };

  var checkValidations = function(event) {
    // Redefine the inputs since some will be removed on page load
    $inputs = $('input:not([type="hidden"]), input:not([type="submit"]), select');

    // Validate each input
    $inputs.each(function() {
      var $el = $(this);
      if (!this.checkValidity()) {
        event.preventDefault();
        clearErrors($el);
        displayErrors($el);
        return false;
      }
      else {
        clearErrors($el);
      }
    });
  };

  

});
