const express = require("express");
const topicController = require("../controllers/topicController");
const questionRouter = require("./questionRoute");

const router = express.Router();

router
  .route("/firstLevel")
  .post(topicController.createFirstLevelTopic)
  .get(topicController.getAllFirstLevelTopics);

router
  .route("/firstLevel/:id")
  .patch(topicController.updateFirstLevelTopic)
  .get(topicController.getFirstLevelTopic)
  .delete(topicController.deleteFirstLevelTopic);

router
  .route("/secondLevel")
  .post(topicController.createSecondLevelTopic)
  .get(topicController.getAllSecondLevelTopics);

router
  .route("/secondLevel/:id")
  .patch(topicController.updateSecondLevelTopic)
  .get(topicController.getSecondLevelTopic)
  .delete(topicController.deleteSecondLevelTopic);

router
  .route("/thirdLevel")
  .post(topicController.createThirdLevelTopic)
  .get(topicController.getAllThirdLevelTopics);

router
  .route("/thirdLevel/:id")
  .patch(topicController.updateThirdLevelTopic)
  .get(topicController.getThirdLevelTopic)
  .delete(topicController.deleteThirdLevelTopic);

router.use("/questions", topicController.setSearchQuery, questionRouter);

module.exports = router;
