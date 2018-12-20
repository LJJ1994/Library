// 书本控制器，index用于显示站点欢迎页面
var Book = require('../models/book');
var Author = require('../models/author');
var Genre = require('../models/genre');
var BookInstance = require('../models/bookinstance');
var async = require('async');
var { body, validationResult } = require('express-validator/check');
var { sanitizeBody } = require('express-validator/filter');

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

exports.book_detail = function(req, res, next) {
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

exports.book_create_get = function(req, res, next) {
  async.parallel({
    //查找所有的authors和genres，用来添加book
    author: function(callback) {
      Author.find(callback);
    },
    genre: function(callback) {
      Genre.find(callback)
    }
  }, function(err, results) {
    if (err) { return next(err); }
    res.render('book_form', { title: 'Create Book.', authors: results.author, genres: results.genre });
  })
};

exports.book_create_post = [
  // 将genre转换为数组
  function(req, res, next) {
    if (!(req.body.genre instanceof Array)) {
      if (typeof req.body.genre === 'undefined') {
        req.body.genre = [];
      } else {
        req.body.genre = new Array(req.body.genre);
      }
    }
    next();
  },

  // 验证数据
  body('title', 'Title must not be empty.').isLength({ min: 1 }).trim(),
  body('author', 'author must not be empty.').isLength({ min: 1 }).trim(),
  body('summary', 'summary must not be empty.').isLength({ min: 1 }).trim(),
  body('isbn', 'isbn must not be empty.').isLength({ min: 1 }).trim(),

  // 使用通配符*对所有输入进行消毒
  sanitizeBody('*').trim().escape(),

  // 验证和消毒后对请求进行处理
  function(req, res, next) {
    var errors = validationResult(req);
    var book = new Book({
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      isbn: req.body.isbn,
      genre: req.body.genre
    });
    if (!errors.isEmpty()) {
      // 从表单获取所有的authors和genres
      async.parallel({
        authors: function(callback) {
          Author.find(callback);
        },
        genres: function(callback) {
          Genre.find(callback);
        },
        function(err, results) {
          if (err) { return next(err); }
          // 将选中的种类标记为已检查
          for (var i = 0; i < results.genres.length; i++) {
            if (book.genre.indexOf(results.genres[i]._id) > -1) {
              results.genres[i].checkd = 'true';
            }
          }
          res.render('book_form', { title: 'Create Book', authors: results.authors, genres: results.genres, book: book, errors: errors.array() });
        }
      });
      return;
    } else {
      book.save(function(err) {
        if (err) { return next(err); }
        res.redirect(book.url);
      });
    }
  }
];

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