const Question = require("../models/questionModel");
const catchAsync = require("../utilities/catchAsync");
const APIFeatures = require("../utilities/apiFeatures");
const factory = require("./handlerFactory");

exports.getAllQuestions = factory.getAll(Question);
exports.getQuestion = factory.getOne(Question);
exports.createQuestion = factory.createOne(Question);
exports.updateQuestion = factory.updateOne(Question);
exports.deleteQuestion = factory.deleteOne(Question);

exports.searchAllQuestions = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.specialQuery) {
    filter = req.specialQuery;
  }

  // EXECUTE QUERY

  const features = new APIFeatures(Question.find(filter), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const docs = await features.query;

  res.status(200).json({
    status: "success",
    results: docs.length,
    data: {
      question: docs.map((el) => el.questionNumber),
    },
  });
});
