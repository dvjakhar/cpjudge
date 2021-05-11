const mongoose = require('mongoose')

const workspaceSchema = new mongoose.Schema(
  {
    id: String,
    problem: {
      title: String,
      index: String,
      problemNum: String,
      difficulty: String,
      timeLimit: String,
      memoryLimit: String,
      input: String,
      output: String,
      statement: {
        text: [String],
        inputSpec: [String],
        outputSpec: [String],
        sampleTests: [
          {
            input: String,
            output: String,
          },
        ],
        notes: [String],
      },
      link: String,
      submitLink: String,
      author: String,
      solved: Number
    },
    solution: {
      language: Number,
      code: String,
    },
  },
  { timestamps: { createdAt: 'created_on', updatedAt: 'updated_on' } }
);

module.exports = mongoose.model('Workspace', workspaceSchema);
