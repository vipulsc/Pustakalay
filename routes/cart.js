const express = require("express");
const router = express.Router();
const authenticateToken = require("./userAuth");
const User = require("../db/models/user");

// Add to cart
router.put("/addtocart/:bookId", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { bookId } = req.params;

    const user = await User.findById(userId);

    if (user.cart.includes(bookId)) {
      return res.status(400).json({ message: "Book is already in cart" });
    }

    user.cart.push(bookId);
    await user.save();

    res.status(200).json({ message: "Book added to cart", cart: user.cart });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Remove from cart
router.put("/removefromcart/:bookId", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { bookId } = req.params;

    const user = await User.findById(userId);

    if (!user.cart.includes(bookId)) {
      return res.status(400).json({ message: "Book is not in cart" });
    }

    user.cart = user.cart.filter((id) => id.toString() !== bookId);
    await user.save();

    res
      .status(200)
      .json({ message: "Book removed from cart", cart: user.cart });
  } catch (error) {
    console.error("Remove from cart error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports=router;