const Topic = require("../models/topicModel");
const catchAsync = require("../utilities/catchAsync");
const factory = require("./handlerFactory");

const FirstLevelTopic = Topic.FirstLevelTopic;
const SecondLevelTopic = Topic.SecondLevelTopic;
const ThirdLevelTopic = Topic.ThirdLevelTopic;

const extractTopic = (topicArray) => {
  let topicList = [];

  for (let item of topicArray) {
    topicList.push(item.topic);

    if (item.subTopic && item.subTopic.length > 0) {
      for (let topic of extractTopic(item.subTopic)) {
        topicList.push(topic);
      }
    }
  }

  return topicList;
};

exports.setSearchQuery = catchAsync(async (req, res, next) => {
  if (req.query.q) {
    const doc1 = FirstLevelTopic.find({
      topic: req.query.q,
    });
    const doc2 = SecondLevelTopic.find({
      topic: req.query.q,
    });
    const doc3 = ThirdLevelTopic.find({
      topic: req.query.q,
    });

    const doc = await Promise.all([doc1, doc2, doc3]);

    const flattenedDoc = [].concat.apply([], doc);
    req.specialQuery = {
      annotation: { $in: extractTopic(flattenedDoc) },
    };
  }

  next();
});

exports.getAllFirstLevelTopics = factory.getAll(FirstLevelTopic);
exports.getFirstLevelTopic = factory.getOne(FirstLevelTopic);
exports.createFirstLevelTopic = factory.createOne(FirstLevelTopic);
exports.updateFirstLevelTopic = factory.updateOne(FirstLevelTopic);
exports.deleteFirstLevelTopic = factory.deleteOne(FirstLevelTopic);

exports.getAllSecondLevelTopics = factory.getAll(SecondLevelTopic);
exports.getSecondLevelTopic = factory.getOne(SecondLevelTopic);
exports.createSecondLevelTopic = factory.createOne(SecondLevelTopic);
exports.updateSecondLevelTopic = factory.updateOne(SecondLevelTopic);
exports.deleteSecondLevelTopic = factory.deleteOne(SecondLevelTopic);

exports.getAllThirdLevelTopics = factory.getAll(ThirdLevelTopic);
exports.getThirdLevelTopic = factory.getOne(ThirdLevelTopic);
exports.createThirdLevelTopic = factory.createOne(ThirdLevelTopic);
exports.updateThirdLevelTopic = factory.updateOne(ThirdLevelTopic);
exports.deleteThirdLevelTopic = factory.deleteOne(ThirdLevelTopic);
