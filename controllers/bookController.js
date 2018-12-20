// 书本控制器，index用于显示站点欢迎页面
var Book = require('../models/book');
var Author = require('../models/author');
var Genre = require('../models/genre');
var BookInstance = require('../models/bookinstance');
var async = require('async');

exports.index = function(req, res, next) {
  async.parallel({
    book_count: function(callback) {
      // 传递一个空对象作为匹配条件去查找这个集合所有的文档
      Book.count({}, callback);
    },
    book_instance_count: function(callback) {
      BookInstance.count({}, callback);
    },
    book_instance_available_count: function(callback) {
      BookInstance.count({ status: 'Available' }, callback);
    },
    author_count: function(callback) {
      Author.count({}, callback);
    },
    genre_count: function(callback) {
      Genre.count({}, callback);
    }
  }, function(err, results) {
    res.render('index', { title: 'LocalLibrary Home', error: err, data: results });
  });
};

// 获取数据库中所有Book对象的列表，然后将这些对象传递给模板视图进行呈现
exports.book_list = function(req, res, next) {
  Book.find({}, 'author title')
    .populate('author')
    .exec(function(err, list_books) {
      if (err) { return next(err); }
      res.render('book_list', { title: 'Book List', book_list: list_books })
    })
};

exports.book_detail = function(req, res) {
  async.parallel({
    book: function(callback) {
      Book.findById(req.params.id)
        .populate('author')
        .populate('genre')
        .exec(callback);
    },
    book_instance: function(callback) {
      BookInstance.find({ 'book': req.params.id })
        .exec(callback);
    }
  }, function(err, results) {
    if (err) { return next(err); }
    if (results.book == null) {
      var err = new Error('Book NOT FOUND.');
      err.status = 404;
      return next(err);
    }
    res.render('book_detail', { title: 'Title', book: results.book, book_instances: results.book_instance });
  });
};

exports.book_create_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Book create GET');
};

exports.book_create_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Book create POST');
};

exports.book_delete_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Book delete GET');
};

exports.book_delete_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Book delete POST');
};

exports.book_update_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Book update GET');
};

exports.book_update_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Book update POST');
};