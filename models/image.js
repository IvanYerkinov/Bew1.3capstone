const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Populate = require("../utils/autopopulate");


const ImageSchema = new Schema({
  title: { type: String, required: true },
  imgurl: { type: String, required: true },
  summary: { type: String},
  author: {type: Schema.Types.ObjectId, ref: 'User'},
  comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}]

});

ImageSchema
    .pre('findOne', Populate('author'))
    .pre('find', Populate('author'))
    .pre('find', Populate('comments'))
    .pre('findById', Populate('comments'))

module.exports = mongoose.model("Image", ImageSchema);
