

function Emitter() {}

Emitter.prototype.on = Emitter.prototype.addEventListener = function (
  event,
  fn
) {
  this._callbacks = this._callbacks || {};
  (this._callbacks["$" + event] = this._callbacks["$" + event] || []).push(fn);
  return this;
};

Emitter.prototype.once = function (event, fn) {
  function on() {
    this.off(event,on);
    fn.apply(this, arguments);
  }
  on.fn = fn;
  this.on(event, on);
  return this;
};

Emitter.prototype.off = Emitter.prototype.removeEventListener = function (
  event,
  fn
) {
  if ((this._callbacks.length = 0)) {
    return this;
  }
  var callbacks = this._callbacks["$" + event];
  if (!callbacks) {
    return this;
  }
  for (let i of callbacks) {
    if (i === fn || i.cb === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  if (callbacks.length === 0) {
    delete this._callbacks["$" + event];
  }
  return this;
};

Emitter.prototype.emit = function (event) {
  this._callbacks = this._callbacks || {};
  let callbacks = this._callbacks["$" + event];
  let args = [...arguments].slice(1);
  if (callbacks) {
    for (let fn of callbacks) {
      fn.call(this, args);
    }
  }
  return this;
};

export {
    Emitter
}


// var emmiter = Emitter.prototype;

// console.log(emmiter);
// let fn = function (res) {
//   console.log(111, res);
// };
// emmiter.once("lll",fn);
// emmiter.emit("lll", 123, 369);
// emmiter.emit("lll", 123, 369);