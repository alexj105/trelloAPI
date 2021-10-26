const fs = require("fs");
const logger = require("../../config/winston");

const getAllBoards = () => {
  try {
    const boardsJSON = fs.readFileSync(process.env.BOARD_DB_PATH, "utf8");
    const boards = JSON.parse(boardsJSON);
    return boards || [];
  } catch (error) {
    logger.error(error.message);
    console.error(error.message);
  }
};

const findByName = (boardName) => {
  try {
    const boards = getAllBoards();
    let findBoard = boards.find((board) => {
      return board.name == boardName;
    });
    if (!findBoard) throw new Error(`${boardName} doesn't exist`);
    return findBoard;
  } catch (error) {
    throw error;
    logger.error(error.message);
    console.error(error.message);
  }
};

const create = (board) => {
  try {
    let findBoard = findByName(board.name);
    if (findBoard) {
      throw new Error("Object already exist");
    } else {
      let allBorads = getAllBoards();
      allBorads.push(board);
      fs.writeFileSync(
        process.env.BOARD_DB_PATH,
        JSON.stringify(allBorads),
        (err) => {
          if (err) throw err;
        }
      );
      return board;
    }
  } catch (error) {
    throw error;
    logger.error(error.message);
  }
};

const deleteBoard = (boardName) => {
  try {
    let allBoards = getAllBoards();
    let deletedBoard = allBoards.find((board) => {
      return board.name == boardName;
    });
    if (!deletedBoard) throw new Error("Object doesn't exist");
    const currentBoardIndex = allBoards.indexOf(deletedBoard);
    allBoards.splice(currentBoardIndex, 1);
    fs.writeFileSync(
      process.env.BOARD_DB_PATH,
      JSON.stringify(allBoards),
      (err) => {
        if (err) throw err;
      }
    );
    logger.info(`${deletedBoard.name} was deleted successfully`);
  } catch (error) {
    throw error;
    logger.error(error.message);
  }
};

const updateBoard = (boardName, newBoard) => {
  try {
    let allBoards = getAllBoards();
    let updatedBoard = allBoards.find((board) => {
      return board.name == boardName;
    });
    if (!updatedBoard) throw new Error("Object doesn't exist");

    const updatedBoardIndex = allBoards.indexOf(updatedBoard);
    allBoards[updatedBoardIndex] = { ...updatedBoard, ...newBoard };
    fs.writeFileSync(
      process.env.BOARD_DB_PATH,
      JSON.stringify(allBoards),
      (err) => {
        if (err) throw err;
      }
    );
    logger.info(`${updatedBoard.name} was updated successfully`);
  } catch (error) {
    throw error;
    logger.error(error.message);
  }
};

const getBoardCards = (boardName) => {
  try {
    let boardByName = findByName(boardName);
    if (!boardByName) throw new Error(`Board ${boardName} doesn't exist`);
    const allCards = require("./cardService").getAllCards();
    const result = allCards.filter((card) => card.board === boardName);
    return result || [];
  } catch (error) {
    throw error;
    logger.error(error.message);
  }
};

module.exports = {
  getAllBoards,
  getBoardCards,
  findByName,
  create,
  deleteBoard,
  updateBoard,
};
