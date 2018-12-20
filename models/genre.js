// 定义一个genre的模型
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// 定义一个genre纲要
var genreSchema = new Schema({
  name: { type: String, min: 3, max: 100, require: true }
});

// 虚拟化genre的URL
genreSchema
  .virtual('url')
  .get(function() {
    return '/catalog/genre/' + this._id;
  });

// 导出模块
// 将纲要转换为模型实例'Author'
module.exports = mongoose.model('Genre', genreSchema);