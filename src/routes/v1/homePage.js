const express = require("express");
const controller = require("../../controllers/homePage");
const { authorize, ADMIN } = require("../../middlewares/auth");
const upload = require("../../configs/upload");

const router = express.Router();

router
	.route("/")
	.get(controller.getHomePage)
	.post(upload.fields([{ name: 'headerImage', maxCount: 1 }, { name: 'footerImage', maxCount: 1 }]), controller.createHomePage)  // authorize(ADMIN), 
    .patch(upload.fields([{ name: 'headerImage', maxCount: 1 }, { name: 'footerImage', maxCount: 1 }]), controller.updateHomePage)  // authorize(ADMIN), 

module.exports = router;