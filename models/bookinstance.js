// 表示某人可能借阅的书籍的特定副本，并包含有关该副本是否可用，或预期返回日期的信息，“印记”或版本详细信息
// 定义一个bookInstance的模型
var mongoose = require('mongoose');
var moment = require('moment');
var Schema = mongoose.Schema;

// 定义一个book纲要
var bookInstanceSchema = new Schema({
  book: { type: Schema.ObjectId, ref: 'Book', required: true },
  imprint: { type: String, required: true },
  status: { type: String, required: true, enum: ['Available', 'Maintenance', 'Loaned', 'Reserved'], default: 'Maintenance' },
  due_back: { type: Date, default: Date.now }
});

// 虚拟化book的URL
bookInstanceSchema
  .virtual('url')
  .get(function() {
    return '/catalog/bookinstance/' + this._id;
  });

// 格式化日期
bookInstanceSchema
  .virtual('due_back_formatted')
  .get(function() {
    return moment(this.due_back).format('MMM Do, YYYY');
  });
// 导出模块
// 将纲要转换为模型实例'Author'
module.exports = mongoose.model('BookInstance', bookInstanceSchema);