/*
  This function will search for elements with
  attribute of data-filter-*, with * corresponding to an
  item stored in sessionStorage.

  For example, if first_name => "Larry"

  <div data-filter-first_name="Bob Ricky"> is removed
  <div data-filter-first_name="Larry Ricky"> is preserved
*/

$(document).ready(function() {
  runPageFilters = function(){
    filterContent = function(target_attribute, filter_key) {
      $('*['+ target_attribute +']').each(function(){
        accepted_values = $.makeArray($(this).attr(target_attribute).split(" "));
        if (typeof window[filter_key] != "undefined") {
          if (accepted_values.indexOf(eval(filter_key).replace(/\s/g, '')) >= 0)  {
            /* Do Nothing */
          }
          else {
            $(this).remove();
          }
        }
        else {
          $(this).remove();
        }

      });
    }

    /*
      This function will traverse the DOM for elements by
      attribute string. This will be used next to find
      anything with 'data-filter-'
    */

    jQuery.extend(jQuery.expr[':'], {
      attrStartsWith: function (el, _, b) {
        for (var i = 0, atts = el.attributes, n = atts.length; i < n; i++) {
          if(atts[i].nodeName.toLowerCase().indexOf(b[3].toLowerCase()) === 0) {
            return true;
          }
        }
        return false;
      }
    });


    /* Finds all data-filter-* elements on the page */
    var all_data_filters = [];
    $('*:attrStartsWith("data-filter-")').each(function(){
      var e = $(this).prop('outerHTML')
      var start_pos = e.indexOf("data-filter-") + 12;
      var end_pos = e.indexOf('=',start_pos);
      var filter_key = e.substring(start_pos,end_pos);

      var data_attribute = "data-filter-" + filter_key;
      var data_attribute_value = $(this).attr("data-filter-" + filter_key);

      all_data_filters.push(data_attribute);
    });

    var unique_data_filters = [];
    $.each(all_data_filters, function(i, target_attribute){
        if($.inArray(target_attribute, unique_data_filters) === -1)  unique_data_filters.push(target_attribute);
    });

    $.each(unique_data_filters, function(i, target_attribute) {
      var filter_key = target_attribute.replace('data-filter-','');
      filterContent(target_attribute, filter_key);
    });
  }
});
