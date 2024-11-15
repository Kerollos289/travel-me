const express = require("express");
const router = express.Router();
const travelJobsController = require("../controllers/travelJobs.controllers");

router.patch(
  "/:username/addItinerary",
  travelJobsController.addItineraryToAccount
);

module.exports = router;
