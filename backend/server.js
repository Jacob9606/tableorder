const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
const nodemailer = require("nodemailer");
const path = require("path");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const WebSocket = require("ws");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const app = express();
const port = process.env.PORT || 3000;
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const jwtSecret = process.env.JWT_SECRET;
const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;

const supabase = createClient(supabaseUrl, supabaseKey);

// CORS 설정 추가
const whitelist = ["http://localhost:3000", "http://localhost:3002"];
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  allowedHeaders: "Content-Type,Authorization",
};

app.use(cors(corsOptions));

// Multer 설정
const storage = multer.memoryStorage();
const upload = multer({ storage });

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: emailUser,
    pass: emailPass,
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API 라우트 설정
app.post("/signup", async (req, res) => {
  console.log("Request Body:", req.body);
  const { email, password, shopName, phoneNumber, address } = req.body;

  // 유효성 검사 추가
  if (!email || !password || !shopName || !phoneNumber || !address) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // 이메일 중복 검사
    const { data: existingUser, error: existingUserError } = await supabase
      .from("admin")
      .select("id")
      .eq("email", email)
      .single();
    ``;
    if (existingUserError && existingUserError.code !== "PGRST116") {
      // PGRST116은 'Row not found'를 의미합니다.
      return res.status(500).json({ error: existingUserError.message });
    }

    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const { data, error } = await supabase.from("admin").insert([
      {
        email,
        password: hashedPassword,
        shop_name: shopName,
        phone_number: phoneNumber,
        address,
        email_verified: false,
      },
    ]);

    if (error) {
      console.error("Supabase Error:", error);
      return res.status(400).json({ error: error.message });
    }

    const emailToken = jwt.sign({ email }, jwtSecret, { expiresIn: "1h" });
    const emailVerificationUrl = `http://localhost:${port}/verify-email?token=${emailToken}`;

    const mailOptions = {
      from: emailUser,
      to: email,
      subject: "Email Verification",
      text: `Please verify your email by clicking the following link: ${emailVerificationUrl}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Email Error:", error);
        return res
          .status(500)
          .json({ error: "Failed to send verification email" });
      }
      res
        .status(201)
        .json({ message: "Signup successful, please verify your email" });
    });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/verify-email", async (req, res) => {
  const token = req.query.token;

  if (!token) {
    return res.status(400).json({ error: "Invalid token" });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, jwtSecret);
  } catch (err) {
    return res.status(400).json({ error: "Invalid token" });
  }

  const { data, error } = await supabase
    .from("admin")
    .update({ email_verified: true })
    .eq("email", decoded.email);

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.json({ message: "Email verified successfully" });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const { data: user, error } = await supabase
    .from("admin")
    .select("*")
    .eq("email", email)
    .single();

  if (error || !user) {
    return res.status(400).json({ error: "Invalid email or password" });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(400).json({ error: "Invalid email or password" });
  }

  if (!user.email_verified) {
    return res.status(400).json({ error: "Email not verified" });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, jwtSecret, {
    expiresIn: "1h",
  });
  res.json({ token });
});

app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  const { data: user, error } = await supabase
    .from("admin")
    .select("*")
    .eq("email", email)
    .single();

  if (error || !user) {
    return res.status(400).json({ error: "User not found" });
  }

  const token = jwt.sign({ email }, jwtSecret, { expiresIn: "1h" });
  const resetLink = `http://localhost:${port}/reset-password?token=${token}`;

  const mailOptions = {
    from: emailUser,
    to: email,
    subject: "Password Reset",
    text: `Click the following link to reset your password: ${resetLink}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ error: "Failed to send email" });
    }
    res.status(200).json({ message: "Password reset link sent to your email" });
  });
});

app.get("/reset-password", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "build", "index.html"));
});

app.post("/reset-password", async (req, res) => {
  const { token, password } = req.body;

  try {
    const decoded = jwt.verify(token, jwtSecret);
    const hashedPassword = await bcrypt.hash(password, 10);
    const { data, error } = await supabase
      .from("admin")
      .update({ password: hashedPassword })
      .eq("email", decoded.email);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    res.status(400).json({ error: "Invalid or expired token" });
  }
});

app.post("/add-item", upload.single("image"), async (req, res) => {
  const { name, price, description } = req.body;
  const image = req.file;

  console.log("Request Body:", req.body);
  console.log("Request File:", req.file);

  try {
    const uniqueName = `${Date.now()}-${image.originalname}`;

    const { data: storageData, error: storageError } = await supabase.storage
      .from("items")
      .upload(uniqueName, image.buffer, {
        cacheControl: "3600",
        upsert: false,
        contentType: image.mimetype,
      });

    if (storageError) {
      console.error("Storage Error:", storageError);
      return res.status(400).json({ error: storageError.message });
    }

    const imageUrl = `https://nirarnqszpwmznmykxaf.supabase.co/storage/v1/object/public/items/${uniqueName}`;

    const { data: itemData, error: itemError } = await supabase
      .from("items")
      .insert([
        {
          name,
          price,
          description,
          image_url: imageUrl,
        },
      ]);

    if (itemError) {
      console.error("Item Error:", itemError);
      return res.status(400).json({ error: itemError.message });
    }

    res.status(201).json({ message: "Item added successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to add item" });
  }
});

app.get("/items", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("items")
      .select("name, price, description, image_url");
    if (error) {
      console.error("Supabase Error:", error);
      return res.status(400).json({ error: error.message });
    }
    res.status(200).json(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to fetch items" });
  }
});

// 프론트엔드 빌드 파일 제공 설정
app.use(express.static(path.join(__dirname, "..", "frontend", "build")));

// 나머지 모든 요청은 React 앱이 처리하도록 설정
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "build", "index.html"));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// WebSocket 설정 추가
const wss = new WebSocket.Server({ port: 3001 });

wss.on("connection", function connection(ws) {
  console.log("A new client connected");
  ws.on("message", function incoming(message) {
    console.log("received: %s", message);
    ws.send(`Echo: ${message}`);
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });

  ws.send("Welcome to the WebSocket server!");
});
