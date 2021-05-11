var mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: String,
    author: String,
    body: String,
    likes: [{
      type: mongoose.Types.ObjectId,
      ref: 'User'
    }],
    dislikes: [{
      type: mongoose.Types.ObjectId,
      ref: 'User'
    }],
    tags: [{
      type: String
    }],
  },
  { timestamps: { createdAt: 'created_on', updatedAt: 'updated_on' } }
);

module.exports = mongoose.model('Post', postSchema);