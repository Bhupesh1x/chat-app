const router = require("express").Router();
const User = require("../models/userModel");
const bcrypt = require("bcrypt");

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const isUserExist = await User.findOne({ email });

    if (isUserExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    const result = await user.save();

    res.status(201).json({
      result: {
        _id: result._id,
        username: result.username,
        email: result.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const isUserExist = await User.findOne({ email });

    if (!isUserExist) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isValidPassword = await bcrypt.compare(
      password,
      isUserExist.password
    );

    if (!isValidPassword) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    delete isUserExist.password;

    res.status(200).json({
      result: {
        _id: isUserExist._id,
        username: isUserExist.username,
        email: isUserExist.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.get("/allusers/:id", async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "_id",
    ]);

    res.status(200).json({
      users,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
