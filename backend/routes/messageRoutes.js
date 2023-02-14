const router = require("express").Router();
const Message = require("../models/messageModel");

router.post("/addmsg", async (req, res) => {
  const { from, to, message } = req.body;
  try {
    const data = await Message.create({
      message: {
        text: message,
      },
      users: [from, to],
      sender: from,
    });
    if (!data) {
      return res
        .status(400)
        .json({ message: "Failed to add message to the database" });
    }

    return res.status(201).json({ message: "Message added sucessfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post("/getmsg", async (req, res) => {
  const { from, to } = req.body;
  try {
    const messages = await Message.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const projectMessage = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });

    res.status(200).json(projectMessage);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
