var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/todo', {useNewUrlParser: true});

var listSchema = new mongoose.Schema({
    title: String,
    content: String,
    status: Boolean
});
listSchema.set('collection', 'list');
var model = mongoose.model('list', listSchema);
module.exports = model;