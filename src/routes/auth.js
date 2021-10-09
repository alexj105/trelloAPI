const express = require("express");
const authController = require("../controllers/authController");
const router = new express.Router();

router.get("/login", authController.login);
module.exports = router;
