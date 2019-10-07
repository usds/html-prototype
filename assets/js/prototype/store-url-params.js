/*
  Store URL Params:
  This function will store URL params into sessionStorage for use with prototypes.
*/

$(document).ready(function() {
storeUrlParams = function () {
  var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
  for(var i = 0; i < hashes.length; i++)
  {
    hash = hashes[i].split('=');
    sessionStorage.setItem(hash[0], decodeURI(hash[1]).replace("#",""));
  }
}

});
