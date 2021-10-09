const express = require("express");

const router = new express.Router();
const BoardSchema = require("../models/board");
const validation = require("../middleware/validation");
const Role = require("../helpers/role");
const authorize = require("../middleware/authorize");
const boardsController = require("../controllers/boardsController");

router.post(
  "/board/create",
  [authorize(Role.Admin), validation(BoardSchema, "board")],
  boardsController.createBoard
);

router.get("/board/cards", boardsController.getBoardCards);

router.get("/board/all", boardsController.getAllBoards);

router.get("/board/:name", boardsController.getBoardByName);

router.delete(
  "/board/:name",
  authorize(Role.Admin),
  boardsController.deleteBoard
);

router.patch(
  "/board/:name",
  validation(BoardSchema, "board"),
  boardsController.updateBoard
);

module.exports = router;
