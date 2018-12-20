// 书本实例控制器
var BookInstance = require('../models/bookinstance');
var Book = require('../models/book')
var async = require('async')

// 获取所有书本实例的列表，填充相关的书本信息，然后将列表传递给模板以呈现
exports.bookinstance_list = function(req, res, next) {
  BookInstance.find()
    .populate('book')
    .exec(function(err, list_bookinstances) {
      if (err) { return next(err); }
      res.render('bookinstance_list', { title: 'Book Instance List', bookinstance_list: list_bookinstances });
    });
};

exports.bookinstance_detail = function(req, res) {
  BookInstance.findById(req.params.id)
    .populate('book')
    .exec(function(err, bookinstance) {
      if (err) { return next(err); }
      if (bookinstance == null) {
        var err = new Error('book copy not found.');
        err.status = 404;
        return next(err);
      }
      res.render('bookinstance_detail', { title: 'Book', bookinstance: bookinstance });
    });
};

exports.bookinstance_create_get = function(req, res) {
  res.send('NO IMPLEMENTED: bookinstance create get.');
};

exports.bookinstance_create_post = function(req, res) {
  res.send('NO IMPLEMENTED: bookinstance create post.');
};

exports.bookinstance_delete_get = function(req, res) {
  res.send('NO IMPLEMENTED: bookinstance delete get.');
};

exports.bookinstance_delete_post = function(req, res) {
  res.send('NO IMPLEMENTED: bookinstance delete post.');
};

exports.bookinstance_update_get = function(req, res) {
  res.send('NO IMPLEMENTED: bookinstance update get.');
};

exports.bookinstance_update_post = function(req, res) {
  res.send('NO IMPLEMENTED: bookinstance update post.');
};