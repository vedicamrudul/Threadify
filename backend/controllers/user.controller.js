const User = require("../models/user.model");
const { StatusCodes } = require("http-status-codes");
const { v2: cloudinary } = require("cloudinary");

const notifications = require("../models/notifications.model");
const bcrypt = require("bcrypt");

const getUserProfile = async (req, res) => {
  if (req.user) return res.status(StatusCodes.OK).json(req.user);
  res.status(StatusCodes.NOT_FOUND).json({ msg: "could not get user profile" });
};

const suggestedUsers = async (req, res) => {
  try {
    const userId = req.user._id;
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "User not found" });
    }
    const suggestedUsers = await User.aggregate([
      { $match: { _id: { $ne: userId } } }, // Exclude the current user
      { $sample: { size: 5 } }, // Randomly select 5 users
    ]);

    res.status(StatusCodes.OK).json(suggestedUsers);
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Internal server error" });
  }
};

const followUnfollowUser = async (req, res) => {
  // okay lets say i am vedica who is logged in. i have a property of following => which is an array of user ids. req.params mei uss user ka id hoga jisse maine click kara hai. if that person is in the following list, then remove it from the following list. if not, then add it to the following list.
  const { id } = req.params;
  const user = req.user;

  if (user.id === id)
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "You cannot follow yourself" });

  if (!user || !id) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: "User not found" });
  }

  const isFollowing = user.following.includes(id);
  // In MongoDB, the $pull and $push operators are used to modify arrays within documents. Here is what they do:

  // $pull: Removes all instances of a value from an array.
  // $push: Adds a value to an array.

  if (isFollowing) {
    await User.findByIdAndUpdate(user._id, { $pull: { following: id } });
    await User.findByIdAndUpdate(id, { $pull: { followers: user._id } });
    res.status(StatusCodes.OK).json({ msg: "Unfollowed user" });
  } else {
    await User.findByIdAndUpdate(user._id, { $push: { following: id } });
    await User.findByIdAndUpdate(id, { $push: { followers: user._id } });

    await notifications.create({
      from: user._id,
      to: id,
      type: "follow",
    });

    res.status(StatusCodes.OK).json({ msg: "Followed user" });
  }
};

const updateProfile = async (req, res) => {
  const user = req.user;
  const { fullName, email, username, bio, currentPassword, newPassword, link } =
    req.body;
  let { profileImg, coverImg } = req.body;

  const userExists = await User.findById(user._id);
  if (!userExists) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: "User not found" });
  }

  if ((!currentPassword && newPassword) || (!newPassword && currentPassword)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please enter both current and new password" });
  }

  if (newPassword && currentPassword) {
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Invalid password" });
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      user.password = hashedPassword;
    }
  }

  if (profileImg) {
    // we must also destroy the previous image from cloudinary
    if (user.profileImg) {
        // // https://res.cloudinary.com/dyfqon1v6/image/upload/v1712997552/zmxorcxexpdbh8r0bkjb.png
        const profileImgId=user.profileImg.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(profileImgId);
    }
    const uploadedResponse = await cloudinary.uploader.upload(profileImg);
    profileImg = uploadedResponse.secure_url;
  }

  if (coverImg) {

    if (user.coverImg) {
        const coverImgId=user.coverImg.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(coverImgId);
    }
    const uploadedResponse = await cloudinary.uploader.upload(coverImg);
    coverImg = uploadedResponse.secure_url;
  }

  if (email) {
    // check if email matches regex and if email is already taken
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "Email already taken" });
    }
    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid Email" });
    } else {
      user.email = email;
    }
  }

  user.fullName = fullName || user.fullName;
  user.username = username || user.username;
  user.email = email || user.email;
  user.bio = bio || user.bio;
  user.link = link || user.link;
  user.profileImg = profileImg || user.profileImg;
  user.coverImg = coverImg || user.coverImg;

  await User.findByIdAndUpdate(user._id, user);

  res.status(StatusCodes.OK).json({ msg: "Profile updated successfully" });
};

module.exports = {
  getUserProfile,
  suggestedUsers,
  followUnfollowUser,
  updateProfile,
};
