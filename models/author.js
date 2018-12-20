// 定义一个作者的模型
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// 定义一个作者纲要
var authorSchema = new Schema({
  first_name: { type: String, max: 100, required: true },
  family_name: { type: String, max: 100, required: true },
  date_of_birth: { type: Date },
  date_of_death: { type: Date }
});

// 虚拟化作者的全名
authorSchema
  .virtual('name')
  .get(function() {
    return this.first_name + ',' + this.family_name;
  });

// 虚拟化作者的URL
authorSchema
  .virtual('url')
  .get(function() {
    return '/catalog/author/' + this._id;
  });

// 导出模块
// 将纲要转换为模型实例'Author'
module.exports = mongoose.model('Author', authorSchema);