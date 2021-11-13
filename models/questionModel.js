const mongoose = require("mongoose");

const questionSchema = mongoose.Schema(
  {
    questionNumber: {
      type: Number,
      required: [true, "Question must have a number"],
      unique: true,
    },
    annotation: {
      type: [String],
      trim: true,
      required: [true, "Question must have at least one annotation"],
    },
  },
  {
    timestamps: true,
  }
);

questionSchema.index({ annotation: 1 });

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
