const jwt = require("jsonwebtoken");
const Role = require("../helpers/role");
const config = require("../../config/secure.json");

const users = [
  {
    id: 1,
    username: "admin",
    password: "admin",
    role: Role.Admin,
  },
  {
    id: 2,
    username: "user",
    password: "user",
    role: Role.User,
  },
];

const authenticate = ({ username, password }) => {
  const resultUser = users.find((u) => {
    return u.username === username && u.password === password;
  });
  if (resultUser) {
    const token = jwt.sign(
      { sub: resultUser.id, role: resultUser.role },
      config.secret
    );
    const { password, ...userWithoutPassword } = resultUser;
    return {
      ...userWithoutPassword,
      token,
    };
  }
  return null;
};

module.exports = {
  authenticate,
};
