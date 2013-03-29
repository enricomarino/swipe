/**
 * Dependencies
 */

var Emitter = require('emitter');

/**
 * Expose `Swipe`.
 */

module.exports = Swipe;

/**
 * Swipe
 *
 * @param {Element} el
 * @api public
 */

function Swipe(el) {
  if (!(this instanceof Swipe)) {
    return new Swipe(el);
  }
  Emitter.call(this);
  if (!el) {
    throw new TypeError('Swipe() requires an element');
  }
  this.el = el;
  this.onstart = this.ontouchstart.bind(this);
  this.onmove = this.ontouchmove.bind(this);
  this.onend = this.ontouchend.bind(this);

  this.bind();
}

/**
 * Inherit from `Emitter`.
 */

Swipe.prototype = Object.create(Emitter.prototype);
Swipe.prototype.constructor = Swipe;

/**
 * bind
 * Bind event handlers
 *
 * @return {Swipe} this for chaining
 * @api public
 */

Swipe.prototype.bind = function () {
  var el = this.el;
  el.addEventListener('mousedown', this.onstart);
  el.addEventListener('mousemove', this.onmove);
  el.addEventListener('touchstart', this.onstart);
  el.addEventListener('touchmove', this.onmove);
  document.addEventListener('mouseup', this.onend);
  document.addEventListener('touchend', this.onend);
  return this;
};

/**
 * unbind
 * Unbind event handlers.
 *
 * @return {Swipe} this for chaining
 * @api public
 */

Swipe.prototype.unbind = function () {
  el.removeEventListener('mousedown', this.onstart);
  el.removeEventListener('mousemove', this.onmove);
  el.removeEventListener('touchstart', this.onstart);
  el.removeEventListener('touchmove', this.onmove);
  document.removeEventListener('mouseup', this.onend);
  document.removeEventListener('touchend', this.onend);
  return this;
};

/**
 * ontouchstart
 * Handle touchstart.
 *
 * @api private
 */

Swipe.prototype.ontouchstart = function (e){
  e.stopPropagation();
  if (e.touches) {
    e = e.touches[0];
  }
  this.move = {
    start_x: e.pageX,
    start_y: e.pageY,
    start_t: new Date,
    dx: 0,
    dy: 0,
    dt: 0
  };
};

/**
 * ontouchmove
 * Handle touchmove.
 *
 * @param {MouseEvent|TouchEvent} e event
 * @api private
 */

Swipe.prototype.ontouchmove = function (e) {
  if (!this.move) {
    return;
  }
  if (e.touches && e.touches.length > 1) {
    return;
  }
  e.stopPropagation();
  e.preventDefault();
  if (e.touches) {
    e = e.touches[0];
  }
  var move = this.move;
  move.x = e.pageX;
  move.y = e.pageY;
  move.dx = move.x - move.start_x;
  move.dy = move.y - move.start_y;
  this.emit('move', move);
};

/**
 * ontouchend
 * Handle touchend.
 *
 * @param {MouseEvent|TouchEvent} e event
 * @api private
 */

Swipe.prototype.ontouchend = function(e){
  if (!this.move) {
    return;
  }
  e.stopPropagation();
  if (e.changedTouches) {
    e = e.changedTouches[0];
  }

  var move = this.move;

  move.x = e.pageX;
  move.y = e.pageY;
  move.t = new Date;
  move.dx = move.x - move.start_x;
  move.dy = move.y - move.start_y;
  move.dt = move.t - move.start_t;

  this.emit('swipeend', move);

  if (move.dx < 0) {
    this.emit('swipeleft', move);
  } else {
    this.emit('swiperight', move);
  }

  if (move.dy < 0) {
    this.emit('swipeup', move);
  } else {
    this.emit('swipedown', move);
  }
};
