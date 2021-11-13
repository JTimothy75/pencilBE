const mongoose = require("mongoose");

const firstLevelTopicSchema = mongoose.Schema(
  {
    topic: { type: String, trim: true, unique: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

firstLevelTopicSchema.index({ topic: 1 });

firstLevelTopicSchema.virtual("subTopic", {
  ref: "SecondLevelTopic",
  localField: "_id",
  foreignField: "parentTopic",
});

firstLevelTopicSchema.pre(/^find/, function () {
  this.populate({
    path: "subTopic",
    select: "topic thirdLevelTopic",
  });
});

const secondLevelTopicSchema = mongoose.Schema(
  {
    topic: { type: String, trim: true, unique: true },
    parentTopic: {
      type: mongoose.Schema.ObjectId,
      ref: "FirstLevelTopic",
      required: [true, "Review must belong to a First Level Topic"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

secondLevelTopicSchema.index({ topic: 1 });

secondLevelTopicSchema.virtual("subTopic", {
  ref: "ThirdLevelTopic",
  localField: "_id",
  foreignField: "parentTopic",
});

secondLevelTopicSchema.pre(/^find/, function () {
  this.populate({
    path: "subTopic",
    select: "topic",
  });
});

const thirdLevelTopicSchema = mongoose.Schema(
  {
    topic: { type: String, trim: true, unique: true },
    parentTopic: {
      type: mongoose.Schema.ObjectId,
      ref: "SecondLevelTopic",
      required: [true, "Review must belong to a second Level Topic"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

thirdLevelTopicSchema.index({ topic: 1 });

exports.FirstLevelTopic = mongoose.model(
  "FirstLevelTopic",
  firstLevelTopicSchema
);
exports.SecondLevelTopic = mongoose.model(
  "SecondLevelTopic",
  secondLevelTopicSchema
);
exports.ThirdLevelTopic = mongoose.model(
  "ThirdLevelTopic",
  thirdLevelTopicSchema
);
