const router = require("express").Router();
const { z } = require("zod");
const User = require("../db/models/user");
const Book = require("../db/models/books");
const authenticateToken = require("./userAuth");

const bookSchema = z.object({
  url: z.string().url("Invalid image URL"),
  title: z.string().min(1),
  author: z.string().min(1),
  price: z.string().min(1),
  desc: z.string().min(5),
  language: z.string().min(1),
});

// Admin - Add book
router.post("/addbook", authenticateToken, async (req, res) => {
  const parsed = bookSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: parsed.error.errors[0].message });
  }

  const user = await User.findById(req.user.id);
  if (user.role !== "admin") {
    return res.status(403).json({ message: "Only admin can add books" });
  }

  const book = new Book(parsed.data);
  await book.save();
  return res
    .status(201)
    .json({ message: "Book added successfully", bookId: book._id });
});

// Admin - Update book
router.put("/updatebook/:bookId", authenticateToken, async (req, res) => {
  const user = await User.findById(req.user.id);
  if (user.role !== "admin") {
    return res.status(403).json({ message: "Only admin can update books" });
  }

  const updated = await Book.findByIdAndUpdate(req.params.bookId, req.body, {
    new: true,
  });

  if (!updated) return res.status(404).json({ message: "Book not found" });

  res.status(200).json({ message: "Book updated", book: updated });
});

// Admin - Delete book
router.delete("/deletebook/:bookId", authenticateToken, async (req, res) => {
  const user = await User.findById(req.user.id);
  if (user.role !== "admin") {
    return res.status(403).json({ message: "Only admin can delete books" });
  }

  const deleted = await Book.findByIdAndDelete(req.params.bookId);
  if (!deleted) return res.status(404).json({ message: "Book not found" });

  res.status(200).json({ message: "Book deleted successfully" });
});

// Public - Get all books
router.get("/allbooks", async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.status(200).json({ books });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
