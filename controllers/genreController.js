// Genre控制器
var Genre = require('../models/genre');
var Book = require('../models/book');
var async = require('async');
var { body, validationResult } = require('express-validator/check');
var { sanitizeBody } = require('express-validator/filter');

exports.genre_list = function(req, res, next) {
  Genre.find()
    .sort([
      ['name', 'ascending']
    ])
    .exec(function(err, list_genres) {
      if (err) { return next(err); }
      res.render('genre_list', { title: 'Genre List.', genre_list: list_genres });
    });
}

exports.genre_detail = function(req, res, next) {
  async.parallel({
    genre: function(callback) {
      Genre.findById(req.params.id)
        .exec(callback);
    },
    genre_books: function(callback) {
      Book.find({ 'genre': req.params.id })
        .exec(callback);
    }
  }, function(err, results) {
    if (err) { return next(err); }
    if (results.genre == null) {
      var err = new Error('Genre not found.');
      err.status = 404;
      return next(err);
    }
    res.render('genre_datail', { title: 'Genre Detail', genre: results.genre, genre_books: results.genre_books })
  })
};

exports.genre_create_get = function(req, res, next) {
  res.render('genre_form', { title: 'Create Genre' });
};

exports.genre_create_post = [
  // 验证name的输入域是否为空
  body('name', 'Genre name required.').isLength({ min: 1 }).trim(),
  // 对输入域(trim, escape)进行消毒
  sanitizeBody('name').trim().escape(),
  function(req, res, next) {
    // 从一个req请求中提取error验证错误
    var errors = validationResult(req);
    // 创建一个genre对象
    var genre = new Genre({
      name: req.body.name
    });
    // 利用isEmpty()判断是否有错误
    if (!errors.isEmpty()) {
      // 检测到有错误，重新返回带有消毒过的信息和错误信息组成的数组
      res.render('genre_form', { title: 'Create Genre', genre: genre, errors: errors.array() });
      return;
    } else {
      // 表单发送的数据为合法
      // 检测Genre中是否有相同的name
      Genre.findOne({ 'name': req.body.name })
        .exec(function(err, found_genre) {
          if (err) { return next(err); }
          if (found_genre) {
            // 已存在genre，重定向到该genre的页面
            res.redirect(found_genre.url);
          } else {
            // 保存该genre
            genre.save(function(err) {
              if (err) { return next(err); }
              res.redirect(genre.url);
            });
          }
        });
    }
  }
];

exports.genre_delete_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Genre delete GET');
};

exports.genre_delete_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Genre delete POST');
};

exports.genre_update_get = function(req, res) {
  res.send('NOT IMPLEMENTED: Genre update GET');
};

exports.genre_update_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Genre update POST');
};