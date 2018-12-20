// 书本实例控制器
var BookInstance = require('../models/bookinstance');
var Book = require('../models/book');
let { body, validationResult } = require('express-validator/check');
let { sanitizeBody } = require('express-validator/filter');
var async = require('async');

// 获取所有书本实例的列表，填充相关的书本信息，然后将列表传递给模板以呈现
exports.bookinstance_list = function(req, res, next) {
  BookInstance.find()
    .populate('book')
    .exec(function(err, list_bookinstances) {
      if (err) { return next(err); }
      res.render('bookinstance_list', { title: 'Book Instance List', bookinstance_list: list_bookinstances });
    });
};

exports.bookinstance_detail = function(req, res, next) {
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

exports.bookinstance_create_get = function(req, res, next) {
  Book.find({}, 'title')
    .exec(function(err, books) {
      if (err) { return next(err); }
      res.render('bookinstance_form', { title: 'Create Bookinstance', book_list: books });
    })
};

exports.bookinstance_create_post = [
  body('book', 'book must be specified.').isLength({ min: 1 }).trim(),
  body('imprint', 'imprint must be specified.').isLength({ min: 1 }).trim(),
  body('due_back', 'due_back must be specified.').optional({ checkFalsy: true }).isISO8601(),

  sanitizeBody('book').trim().escape(),
  sanitizeBody('imprint').trim().escape(),
  sanitizeBody('status').trim().escape(),
  sanitizeBody('due_back').trim().escape(),
  function(req, res, next) {
    var errors = validationResult(req);
    var bookinstance = new BookInstance({
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.due_back
    });
    if (!errors.isEmpty()) {
      Book.find({}, 'title')
        .exec(function(err, books) {
          if (err) { return next(err); }
          res.render('bookinstance_form', { title: 'Create bookinstance', book_list: books, bookinstance: bookinstance, selected_book: bookinstance.book._id, errors: errors.array() });
        });
    } else {
      bookinstance.save(function(err) {
        if (err) { return next(err); }
        res.redirect(bookinstance.url);
      })
    }
  }
];

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