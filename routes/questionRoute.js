const express = require("express");
const questionController = require("../controllers/questionController");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(questionController.createQuestion)
  .get(questionController.getAllQuestions);

router.route("/search").get(questionController.searchAllQuestions);

router
  .route("/:id")
  .patch(questionController.updateQuestion)
  .get(questionController.getQuestion)
  .delete(questionController.deleteQuestion);

module.exports = router;
