/*

  Form functions for storing and retrieving data
  for prototyping forms in static sites
*/

$(document).ready(function() {

  // Preload Data from a JSON file
  preloadData = function(src) {
    $.getJSON( src, function( data ) {
      var items = [];
      $.each( data, function( key, val ) {
        sessionStorage.setItem(key, val);
      });
    });
    getData();
  }

  // Can get previously stored data to run events
  getData = function() {
    for (i = 0; i < sessionStorage.length; i++) {
      if (sessionStorage.getItem(sessionStorage.key(i)) != "undefined") {
        window[sessionStorage.key(i)] = sessionStorage.getItem(sessionStorage.key(i));
      }
      else {
        window[sessionStorage.key(i)] = "";
      }
    }
  }
  // Initially run the function
  getData();

  //Save Data
  storeData = function() {
    $('input[type="tel"], input[type="number"], input[type="text"], input[type="date"], input[type="email"], input[type="password"], input[type="hidden"], select, textarea').each(function(){
        var value = $(this).val();
        var key = $(this).attr('id');
        sessionStorage.setItem(key, value);
    });

    $("input[type='radio']:checked").each(function(){
        var value = $(this).val();
        var key = $(this).attr('name');
        sessionStorage.setItem(key, value);
    });
    $("input[type='file']").each(function(){
        var value = $(this).val().replace(/^.*[\\\/]/, '');
        var key = $(this).attr('id');
        sessionStorage.setItem(key, value);
    });
    $("input[type='checkbox']").each(function(){
        var value = "no";
        var key = $(this).attr('id');
        sessionStorage.setItem(key, value);
    });
    $("input[type='checkbox']:checked").each(function(){
        var value = "yes";
        var key = $(this).attr('id');
        var set = $(this).attr('name');
        sessionStorage.setItem(key, value);
        var selections = $("input[type='checkbox']:checked").map(function(){
          return $(this).attr('value');
        }).get().join(', ');
        sessionStorage.setItem(set, selections);
    });
  }

  // Simple function to go to the next page
  nextPage = function(page) {
    window.location.href = page;
  }

  printData = function() {
    getData();

    var $placeholder = $('[data-print]');

    $placeholder.each(function() {
      placeholder_key = $(this).attr('data-print');
      var printed_text = window[placeholder_key];

      var element_type = $(this).prop('nodeName').toLowerCase();

      if ($(element_type).is('input')) {
        if ($(this).attr("type") == "radio") {
          if ($(this).attr("value") == printed_text) {
            $(this).prop('checked', true);
          }
        }
        if ($(this).attr("type") == "checkbox") {
          if ( printed_text == "yes") {
            $(this).prop('checked', true);
          }
        }
        else {
          if ((printed_text != "[object HTMLInputElement]") && ($(this).attr("type") != "radio")) {
            $(this).attr('data-print', placeholder_key).val(printed_text);
          }
        }
      }
      else if ($(element_type).is('select')) {
        if ((printed_text != "[object HTMLInputElement]") && (printed_text != "[object HTMLSelectElement]")) {
          $(this).find('option[value="'+ printed_text +'"]').prop('selected', true);
        }
      }
      else {
        if ((printed_text != "[object HTMLInputElement]") && (printed_text != "[object HTMLSelectElement]") && (printed_text != "")) {
          $(this).attr('data-print', placeholder_key).text(printed_text);
        }
      }
    });

  }
  printData();

  updateStoredData = function() {
    storeData();
    getData();
  }

  // For now, if browser does not support HTML5 validation, allow form data to be submitted without validation.
  // In practice, this should be replaced with a shim for IE9.
  checkValidityIfSupported = function(elem) {
    if (typeof elem.checkValidity == 'function') {
        return elem.checkValidity();
    } else {
        return true;
    }
  }
});
