'use strict';

function p() {
  for (var _len = arguments.length, items = Array(_len), _key = 0; _key < _len; _key++) {
    items[_key] = arguments[_key];
  }

  if (items.length === 0) {
    console.log('===============================');
    return;
  }
  items.forEach(function (item) {
    if (typeof item === 'undefined') {
      console.log('UNDEFINED');
    } else {
      console.log(item);
    }
  });
}