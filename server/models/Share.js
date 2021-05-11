const mongoose = require('mongoose')

const shareSchema = new mongoose.Schema(
  {
    id: String,
    solution: {
      language: Number,
      code: String,
    },
  },
  { timestamps: { createdAt: 'created_on', updatedAt: 'updated_on' } }
);

exports.Share = mongoose.model('Share', shareSchema);