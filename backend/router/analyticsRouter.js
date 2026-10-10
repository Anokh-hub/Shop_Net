const express = require("express");
const { protect } = require("../middleware/authMidleware");
const { admin } = require("../middleware/adminMiddleware");
const { getAdminStats } = require("../controllers/analyticsController.js");
const router = express.Router();

router.get("/process", protect, admin, getAdminStats);

module.exports = router;
