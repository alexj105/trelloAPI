const fs = require("fs");
const logger = require("../../config/winston");
const BoardService = require("../services/boardService");

exports.createBoard = (req, res) => {
  try {
    BoardService.create(req.body);
    res.status(201).send("Object was created successfully");
  } catch (error) {
    res.status(409).send(error.message);
  }
};

exports.getBoardCards = (req, res) => {
  try {
    const { board_name } = req.query;
    let boardCards = BoardService.getBoardCards(board_name);
    res.status(200).send(boardCards);
  } catch (error) {
    logger.error(error.message);
    res.status(404).send(error.message);
  }
};

exports.getAllBoards = (req, res) => {
  try {
    let allBoards = BoardService.getAllBoards();
    res.status(200).send(allBoards);
  } catch (error) {
    res.status(404).send(error.message);
  }
};

exports.getBoardByName = (req, res) => {
  try {
    const findBoard = BoardService.findByName(req.params.name);
    res.status(200).send(findBoard);
  } catch (error) {
    res.status(404).send(error.message);
  }
};

exports.deleteBoard = (req, res) => {
  try {
    BoardService.deleteBoard(req.params.name);
    res.status(201).send("Object was deleted successfully");
  } catch (error) {
    logger.error(error.message);
    res.status(404).send(error.message);
  }
};

exports.updateBoard = (req, res) => {
  try {
    BoardService.updateBoard(req.params.name, req.body);
    res.status(204).send("Object was updated successfully");
  } catch (error) {
    logger.error(error.message);
    res.status(404).send(error.message);
  }
};
