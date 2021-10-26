const fs = require("fs");
const logger = require("../../config/winston");
const myFunct = () => {
  try {
    const boardsJSON = fs.readFileSync(process.env.BOARD_DB_PATH, "utf8");
    const boards = JSON.parse(boardsJSON);
    return boards || [];
  } catch (error) {
    logger.error(error.message);
    console.error(error.message);
  }
};

module.exports = {
  myFunct,
};
