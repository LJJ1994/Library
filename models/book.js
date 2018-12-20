// 定义一个book的模型
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// 定义一个book纲要
var bookSchema = new Schema({
  title: { type: String, required: true },
  author: { type: Schema.ObjectId, ref: 'Author', required: true },
  summary: { type: String, required: true },
  isbn: { type: String, required: true },
  genre: [{ type: Schema.ObjectId, ref: 'Genre' }]
});

// 虚拟化book的URL
bookSchema
  .virtual('url')
  .get(function() {
    return '/catalog/book/' + this._id;
  });

// 导出模块
// 将纲要转换为模型实例'Author'
module.exports = mongoose.model('Book', bookSchema);