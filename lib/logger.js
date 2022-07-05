'use strict';

class Log {
  constructor(event, payload) {
    this.event = event;
    this.timestamp = new Date();
    this.payload = payload;
  }
}

module.exports = Log;