const User = require("../model/User");
const bcrypt = require("bcrypt");

const handlerNewUser = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }
  // Check for duplicate usernames in the db
  const duplicate = await User.findOne({ username: user }).exec();

  if (duplicate) {
    res.status(400).json({ error: "Username already exists" });
    return;
  }
  try {
    // Encrypt the password
    const hashedPwd = await bcrypt.hash(pwd, 10);
    // Creat and Store the new user
    const result = await User.create({
      username: user,
      password: hashedPwd,
    });

    console.log(result);

    res.status(201).json({ message: ` ${user} User created` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { handlerNewUser };
