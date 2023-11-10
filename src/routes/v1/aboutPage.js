const express = require("express");
const controller = require("../../controllers/aboutPage");
const { authorize, ADMIN } = require("../../middlewares/auth");
const upload = require("../../configs/upload");


const router = express.Router();

router
	.route("/")
	.get(controller.getAboutPage)
	.post(upload.single("image"), controller.createAboutPage)  // authorize(ADMIN), 
    .patch(upload.single("image"), controller.updateAboutPage)  // authorize(ADMIN), 

module.exports = router;