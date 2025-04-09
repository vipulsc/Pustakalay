const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const User = require("../db/models/user");

const signupSchema = z.object({
  username: z.string().min(4, "Username must be at least 4 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(5, "Password must be at least 5 characters"),
  address: z.string().min(3, "Address must be at least 3 characters"),
});

// Signup Route
router.post("/signup", async (req, res) => {
  try {
    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.errors[0].message });
    }

    const { username, email, password, address } = parsed.data;

    const existUsername = await User.findOne({ username });
    if (existUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const existEmail = await User.findOne({ email });
    if (existEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      address,
    });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(200).json({
      message: "Signup successful",
      token,
      user: { id: newUser._id, username, email },
    });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});


//signin

router.post("/sigin",async(req,res)=>{
	try{

	}
	catch(error)
	{
		
	}
})