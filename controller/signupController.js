const argon2 = require("argon2");
const { createNewUser } = require("../model/db");

const signupController = async (req, res) => {
  const { fullname, email, username, password } = req.body;
  const mainPassword = await argon2.hash(password);
  const result = await createNewUser({
    Full_Name: fullname,
    Email: email,
    Username: username,
    Password: mainPassword,
  });
  switch (result) {
    case 419:
      res
        .status(result)
        .json({
          status: false,
          message: "User with this name and username already exist",
        });
      break;
    case 500:
      res
        .status(result)
        .json({ status: false, message: "Server error, try again" });
      break;
    case 200:
      res
        .status(result)
        .json({ status: true, message: "Registration successful" });
      break;
    default:
      break;
  }
};

module.exports = signupController;
