(function() {
  var Live, Seat, crypto, fs, request, retrieveBot, tmpDir, util,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  fs = require('fs');

  request = require('request');

  util = require('util');

  crypto = require('crypto');

  Seat = require('../seat').Seat;

  tmpDir = __dirname + "/../../tmp";

  exports.Seat = Live = (function(superClass) {
    extend(Live, superClass);

    function Live(opts) {
      this.opts = opts;
      this.setupFinished = bind(this.setupFinished, this);
      this.loaded = false;
    }

    Live.prototype.setup = function(module) {
      this.player = module;
      this.playerInfo = module.info || {};
      this.name = this.playerInfo.name || "Unnamed";
      return this.setupFinished();
    };

    Live.prototype.setupFinished = function(err) {
      this.loaded = true;
      return this.emit('ready');
    };

    Live.prototype.update = function(game, callback) {
      var result;
      this.player.update(game, callback, this.player.socket);
    };

    return Live;

  })(Seat);

  exports.create = function(id, opts, socket) {
    var bot;
    bot = new Live(opts);
    if (socket)
      bot.setup(new id(socket));
    else
      bot.setup(new id());
    return bot;
  };

}).call(this);
