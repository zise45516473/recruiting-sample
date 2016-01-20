var BaseRes = require('./base_res')
  , _ = require('underscore');

var AppRes = module.exports = BaseRes.extend({
  route: function (app) {
  },

  all: function (req, res) {
    res.render('app/index');
  }
});
