const router = require("express").Router();
const { z } = require("zod");
const User = require("../db/models/user");
const Book = require("../db/models/books");
const authenticateToken = require("./userAuth");

// Book schema validation --zod ka help
const bookSchema = z.object({
  url: z.string().url("Invalid image URL"),
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  price: z.number().nonnegative("Price must be non-negative"),
  desc: z.string().min(5, "Description must be at least 5 characters"),
  language: z.string().min(1, "Language is required"),
});

// Add book route (only admin)
router.post("/addbook", authenticateToken, async (req, res) => {
  try {
    const parsed = bookSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.errors[0].message });
    }

    const user = await User.findById(req.user.id);
    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can add books" });
    }

    const book = new Book(parsed.data);
    await book.save();

    return res.status(201).json({ message: "Book added successfully " });
  } catch (error) {
    console.error("Add Book Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
