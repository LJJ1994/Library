// 实现一个作者控制器，导入模型来访问和更新我们使用的数据
var Author = require('../models/author.js');
var Book = require('../models/book.js');
var async = require('async');

// 作者列表
exports.author_list = function(req, res) {
  Author.find()
    .sort([
      ['family_name', 'ascending']
    ])
    .exec(function(err, list_authors) {
      if (err) { return next(err); }
      res.render('author_list', { title: 'Author List', author_list: list_authors });
    })
}

// 具体作者的详细信息
exports.author_detail = function(req, res) {
  async.parallel({
    author: function(callback) {
      Author.findById(req.params.id)
        .exec(callback);
    },
    author_books: function(callback) {
      Book.find({ 'author': req.params.id }, 'title summary')
        .exec(callback);
    }
  }, function(err, results) {
    if (err) { return next(err); }
    if (results.author == null) {
      var err = new Error('Author NOT FOUND.');
      err.status = 404;
      return next(err);
    }
    res.render('author_detail', { title: 'Authot detail', author: results.author, author_books: results.author_books });
  });
}

// 从GET方法创建作者
exports.author_create_get = function(req, res) {
  res.send('NOT IMPLEMENTED:Author create get.');
}

// 从POST方法创建作者
exports.author_create_post = function(req, res) {
  res.send('NOT IMPLEMENTED: Author create post.');
}

// 从GET方法删除作者
exports.author_delete_get = function(req, res) {
  res.send('NO IMPLEMENTED: Author delete get.');
}

// 从POST方法删除作者
exports.author_delete_post = function(req, res) {
  res.send('NO IMPLEMENTED: Author delete post.');
}

// 从GET方法更新作者
exports.author_update_get = function(req, res) {
  res.send('NO IMPLEMENTED: Author update get.');
}

// 从POST方法更新作者
exports.author_update_post = function(req, res) {
  res.send('NO IMPLEMENTED:Author update post.');
}