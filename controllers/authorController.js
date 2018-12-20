// 实现一个作者控制器，导入模型来访问和更新我们使用的数据
var Author = require('../models/author.js');
var Book = require('../models/book.js');
var async = require('async');
var { body, validationResult } = require('express-validator/check');
var { sanitizeBody } = require('express-validator/filter');

// 作者列表
exports.author_list = function(req, res, next) {
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
exports.author_detail = function(req, res, next) {
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
exports.author_create_get = function(req, res, next) {
  res.render('author_form', { title: 'Create Author' });
}

// 从POST方法创建作者
exports.author_create_post = [
  //对输入域进行验证 
  body('first_name').isLength({ min: 1 }).trim().withMessage('first_name must be spicified.')
  .isAlphanumeric().withMessage('first_name must be spicified.'),
  body('family_name').isLength({ min: 1 }).trim().withMessage('family_name must be spicified')
  .isAlphanumeric().withMessage('family_name must be spicified.'),
  body('date_of_birth', 'Invalid date.').optional({ checkFalsy: true }).isISO8601(),
  body('date_of_death', 'Invalid date.').optional({ checkFalsy: true }).isISO8601(),

  //对验证后的输入进行消毒 
  sanitizeBody('first_name').trim().escape(),
  sanitizeBody('family_name').trim().escape(),
  sanitizeBody('date_of_birth').toDate(),
  sanitizeBody('date_of_death').toDate(),

  // 在验证和消毒后处理process
  function(req, res, next) {
    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('author_form', { title: 'Create Author', author: req.body, errors: errors.array() });
      return;
    } else {
      var author = new Author({
        first_name: req.body.first_name,
        family_name: req.body.family_name,
        date_of_birth: req.body.date_of_birth,
        date_of_death: req.body.date_of_death
      });
      author.save(function(err, results) {
        if (err) { return next(err); }
        res.redirect(author.url);
      });
    }
  }
]

// 从GET方法删除作者
exports.author_delete_get = function(req, res, next) {
  async.parallel({
      author: function(callback) {
        Author.findById(req.params.id)
          .exec(callback);
      },
      author_books: function(callback) {
        Book.find({ 'author': req.params.id })
          .exec(callback);
      },
    },
    function(err, results) {
      if (err) { return next(err); }
      if (results.author == null) {
        res.redirect('/catalog/authors');
      }
      res.render('author_delete', { title: 'Delete Author', author: results.author, author_books: results.author_books });
    })
}

// 从POST方法删除作者
exports.author_delete_post = function(req, res) {
  async.parallel({
    author: function(callback) {
      Author.findById(req.body.authorid).exec(callback);
    },
    author_books: function(callback) {
      Book.find({ 'author': req.body.authorid })
        .exec(callback);
    }
  }, function(err, results) {
    if (err) { return next(err); }
    // 如果数据库中还有该作者相关的书籍，则由get相同的路由返回页面
    if (results.author_books.length > 0) {
      res.render('author_delete', { title: 'Delete Author', author: results.author, author_books: results.author_books })
      return;
    } else {
      // 如果数据库中没有该作者的相关书籍，则删除该作者并且重定向到作者列表
      Author.findByIdAndRemove(req.body.authorid, function deleteAuthor(err) {
        if (err) { return next(err); }
        res.redirect('/catalog/authors');
      })
    }
  })
}

// 从GET方法更新作者
exports.author_update_get = function(req, res) {
  res.send('NO IMPLEMENTED: Author update get.');
}

// 从POST方法更新作者
exports.author_update_post = function(req, res) {
  res.send('NO IMPLEMENTED:Author update post.');
}