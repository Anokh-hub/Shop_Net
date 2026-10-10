const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getUsers } = require("../controllers/authController");
const { protect } = require("../middleware/authMidleware")
const { admin } = require("../middleware/adminMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/user", protect, admin, getUsers);
router.post("/verify-email", async (req, res) => {
    const { email } = req.body;

    if (!email) return res.json({ verify: false });

    const user = await User.findOne({ email });

    if (!user) return res.json({ verify: false });

    return res.json({ verify: true });
});
module.exports = router;