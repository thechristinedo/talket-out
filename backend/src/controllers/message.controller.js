import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../libs/cloudinary.js";
import { getReceiverSocketId, io } from "../libs/socket.js";

export const getUsers = async (req, res) => {
  try {
    // get all users besides currently logged in user for sidebar
    const currentUserId = req.user._id;
    const filterUsers = await User.find({ _id: { $ne: currentUserId } }).select(
      "-password"
    );

    res.status(200).json(filterUsers);
  } catch (error) {
    console.log("Error in getUsers", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    // get currentuser and chattingwithuser
    const { id: chattingWithUserId } = req.params;
    const currentUserId = req.user._id;

    // get messages between currentuser and chattingwithuer
    const messages = await Message.find({
      $or: [
        { senderId: currentUserId, receiverId: chattingWithUserId },
        { senderId: chattingWithUserId, receiverId: currentUserId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    // checks if there is an image and uploads the image to cloudinary
    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    // create new message and save
    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });
    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    // if it exists, that means the user is online
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage); // to is to an individual
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
