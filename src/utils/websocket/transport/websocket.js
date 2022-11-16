import { Emitter } from '../emitter/Emitter.js';

class WebsocketClass extends Emitter {
  connected = false;
  ws;
  url = '';
  readyState = '';
  protocol = {};
  reconnectionCount = 0;
  reconnectTimeoutId = 0;
  constructor(url, options = {}) {
    super();
    this.url = url;
    this.protocol = options.protocol || [];
    // 是否重連
    this.reconnection = options.reconnection || false;
    // 重連次數
    this.reconnectionAttempts = options.reconnectionAttempts || Infinity;
    // 重連時間
    this.reconnectionDelay = options.reconnectionDelay || 1000;

    this.store = options.store || null;
    this.storeNamespace = options.storeNamespace || '';
    this.autoCollect = options.autoCollect || false;

    this.autoCollect && this.doOpen();
    return this;
  }
  doOpen() {
    try {
      this.readyState = 'opening';
      this.ws = new WebSocket(this.url, this.protocol);
      this.addEventListeners();
    } catch (err) {
      console.error('error', err);
    }
    return this;
  }
  reconnect() {
    if (
      this.reconnectionCount < this.reconnectionAttempts &&
      this.readyState === 'closed'
    ) {
      console.log('%c 💕 重連中', 'color:green;');
      window.clearTimeout(this.reconnectTimeoutId);
      this.reconnectTimeoutId = window.setTimeout(() => {
        this.doOpen();
      }, this.reconnectionDelay);
    }
  }
  send(msg) {
    if ('closing' === this.readyState || 'closed' === this.readyState) {
      return;
    }
    if ('open' === this.readyState) {
      this.ws.send(JSON.stringify(msg));
    }
    return this;
  }
  addEventListeners() {
    ['onopen', 'onclose', 'onmessage', 'onerror'].forEach((res) => {
      this.ws[res] = (data) => {
        if (res === 'onopen') {
          super.emit(res);
          this.readyState = 'open';
          console.log('%c 🙂 連接成功', 'color:green;');
        }
        if (res === 'onerror') {
          super.emit(res, data);
          this.readyState = 'closed';
          console.log('%c 😕 連接失敗,發生錯誤', 'color:red;');
        }
        if (res === 'onmessage') {
          super.emit(res, data.data);
          let { type, msg } = JSON.parse(data.data);
          let names =
            this.store &&
            this.store._mutations[this.storeNamespace + '/set' + type] &&
            this.storeNamespace + '/set' + type;
          if (names) {
            this.store.commit(names, msg);
          }
          console.log('%c 😄 成功收到訊息,訊息為 ' + data.data, 'color:green;');
        }
        if (res === 'onclose') {
          super.emit(res, data);
          this.readyState = 'closed';
          this.reconnection && this.reconnect();
          console.log('%c 連接已關閉', 'color:red;');
        }
      };
    });
    return this;
  }
  doClose() {
    this.ws.close();
    this.ws = null;
    this.reconnection = false;
  }
}

// var socket = new WebsocketClass("http://localhost:7002", {});
// socket.on("open", () => {
//   console.log("connect");
//   socket.on("message", (res) => {
//     console.log(res);
//   });
//   socket.on("error", (res) => {
//     console.log(res);
//   });
//   socket.send("lalala");
// });
export default WebsocketClass;
