const express = require("express");
const router = express.Router();
const authenticateToken = require("./userAuth");
const User = require("../db/models/user");
const Book = require("../db/models/books");

router.put(
  "/addtofavourites/:bookId",
  authenticateToken,
  async (req, res) => {
    try {
      const userId = req.user.id;
      const { bookId } = req.params;

      const book = await Book.findById(bookId);
      if (!book) return res.status(404).json({ message: "Book not found" });

      const user = await User.findById(userId);
      if (user.favourites.includes(bookId)) {
        return res.status(400).json({ message: "Book already in favourites" });
      }

      user.favourites.push(bookId);
      await user.save();

      res.status(200).json({
        message: "Book added to favourites",
        favourites: user.favourites,
      });
    } catch (error) {
      console.error("Add to favourites error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);
router.put(
  "/removefromfavourites/:bookId",
  authenticateToken,
  async (req, res) => {
    try {
      const userId = req.user.id;
      const { bookId } = req.params;

      const user = await User.findById(userId);

      if (!user.favourites.includes(bookId)) {
        return res.status(400).json({ message: "Book is not in favourites" });
      }

      user.favourites = user.favourites.filter(
        (id) => id.toString() !== bookId
      );
      await user.save();

      res
        .status(200)
        .json({
          message: "Book removed from favourites",
          favourites: user.favourites,
        });
    } catch (error) {
      console.error("Remove from favourites error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
