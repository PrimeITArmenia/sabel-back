const express = require("express");
const articleRoutes = require("./articles");
const authRoutes = require("./auth");
const categoryRoutes = require("./category")
const subscribersRoutes = require("./subscribers");
const userRoutes = require("./user");
const passwordRoutes = require("./password");
const commentRoutes = require("./comment");
const tagRoutes = require("./tag");
const homePageRoutes = require("./homePage");
const aboutPageRoutes = require("./aboutPage");
const router = express.Router();

/**
 * GET v1/status
 */
router.get("/status", (req, res) => {
	res.json({ status: 200 });
});

router.use("/articles", articleRoutes);
router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/password", passwordRoutes);
router.use("/categories", categoryRoutes);
router.use("/comments", commentRoutes);
router.use("/tags", tagRoutes);
router.use("/homepage", homePageRoutes);
router.use("/aboutpage", aboutPageRoutes);
router.use("/subscribers", subscribersRoutes);

module.exports = router;
