const express = require("express");
const { validate } = require("express-validation");
const controller = require("../../controllers/auth");
const { signin, signup, signout, refresh } = require("../../validations/auth");

const router = express.Router();

router.route("/signup").post(validate(signup), controller.signup);

router.route("/signin").post(validate(signin), controller.signin);

router.route("/signout").post(validate(signout), controller.signout);

router.route("/refresh").post(validate(refresh), controller.refresh);

module.exports = router;
