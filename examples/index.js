var Swipe = require('swipe/index.js');

var swipe = Swipe(document);

swipe.on('swipeleft', function (move) {
  console.log('swipeleft', move);
});

swipe.on('swiperight', function (move) {
  console.log('swiperight', move);
});

swipe.on('swipeup', function (move) {
  console.log('swipeup', move);
});

swipe.on('swipedown', function (move) {
  console.log('swipedown', move);
});
