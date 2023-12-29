const express = require("express");
const sharp = require("sharp");
const User = require("../models/user");
const auth = require("../middleware/auth");
const { sendWelcomeEmail } = require("../emails/account");
const router = new express.Router();

router.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
});
router.post("/users", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    // sendWelcomeEmail(user.email,user.name)
    const token = await user.generateAuthToken();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error);
  }
});
router.post("/users/login", async function (req, res) {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});
router.post("/users/logout", auth, async function (req, res) {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send("success");
  } catch (e) {
    res.status(500).send();
  }
});
router.post("/users/logoutAll", auth, async function (req, res) {
  try {
    req.user.tokens = [];

    await req.user.save();
    res.send("success");
  } catch (e) {
    res.status(500).send();
  }
});
router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const updatesAllows = ["name", "email", "password"];
  const isAllowed = updates.every((update) => updatesAllows.includes(update));

  if (!isAllowed) {
    return res.status(400).send({ error: "invalid Update" });
  }
  try {
    // const user = await User.findById(req.params.id)
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();

    res.send(req.user);
  } catch (error) {
    res.send(error);
  }
});
router.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    res.send(req.user);
  } catch (error) {
    res.send(error);
  }
});
const multer = require("multer");
const upload = multer({
  limits: {
    //limits of file
    fileSize: 1000000,
  },
  fileFilter(req, file, callback) {
    //automatically call when upload
    // if (!file.originalname.endsWith(".pdf")) {
    if (!file.originalname.match(/\.(jpg|png)$/)) {
      return callback(new Error("Only jpg and png files are allowed"));
    }
    callback(undefined, true);
  },
});
//  name of the upload
router.post(
  "/user/me/avatar",
  auth,
  upload.single("upload") /*multer middleware */,
  async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, hieght: 250 })
      .png()
      .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.delete("/user/me/avatar", auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.send();
});
router.get("/user/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user.avatar || !user) {
      throw new Error();
    }
    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch {
    res.status(200).send();
  }
});
module.exports = router;
