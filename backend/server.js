const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
const nodemailer = require("nodemailer");
const path = require("path");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const WebSocket = require("ws");
const http = require("http"); // http 모듈 추가
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const app = express();
const port = process.env.PORT || 3000;
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const jwtSecret = process.env.JWT_SECRET;
const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;

const supabase = createClient(supabaseUrl, supabaseKey);

// HTTP 서버 생성
const server = http.createServer(app); // HTTP 서버 생성

// WebSocket 설정 추가
const wss = new WebSocket.Server({ server }); // HTTP 서버에 WebSocket 연결

console.log(`HTTP server is running on port ${port}`);
console.log(`WebSocket server is running on port ${port}`);

let interval; // interval 변수를 상단에서 선언

// WebSocket 이벤트 처리
wss.on("connection", function connection(ws) {
  console.log("A new client connected");

  ws.isAlive = true;
  ws.on("pong", () => {
    ws.isAlive = true; // 클라이언트가 pong을 보낼 때, alive 상태로 설정
  });

  ws.on("message", function incoming(message) {
    console.log("received: %s", message);
    const parsedMessage = JSON.parse(message);

    if (parsedMessage.type === "call_staff") {
      console.log(
        `Table ${parsedMessage.table_id} is calling for staff assistance.`
      );
      broadcastCallStaff(parsedMessage.table_id); // call_staff 요청을 관리자에게 전달
    }
  });

  ws.on("close", (code, reason) => {
    console.log(
      `Client disconnected. Close code: ${code}, Reason: ${
        reason || "No reason provided"
      }`
    );
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
});

// Ping/pong 타임아웃 설정
interval = setInterval(() => {
  wss.clients.forEach((ws) => {
    if (ws.isAlive === false) {
      console.log("Terminating client due to lack of pong response");
      return ws.terminate();
    }

    ws.isAlive = false;
    ws.ping(); // 서버에서 클라이언트로 ping을 보냄
  });
}, 30000); // 30초마다 ping/pong 상태 확인

wss.on("close", function close() {
  clearInterval(interval);
});

// 주문이 추가되었을 때 WebSocket을 통해 클라이언트에게 알림
function broadcastNewOrder(orderData) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: "new_order", data: orderData }));
    }
  });
}

// 직원 호출 시 WebSocket으로 알림 브로드캐스트
function broadcastCallStaff(tableId) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: "call_staff", table_id: tableId }));
    }
  });
}

// CORS 설정 추가
const whitelist = [
  "http://localhost:3000",
  "http://localhost:3002",
  "http://localhost:3001",
  "https://jacob9606.github.io",
  "https://serve-me-70c148e5be60.herokuapp.com", // Heroku app domain
];

const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      console.error(`Blocked by CORS: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  allowedHeaders: "Content-Type,Authorization",
};

app.use(cors(corsOptions));

// Multer 설정 - 파일 크기와 유형에 대한 유효성 검사 추가
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 파일 크기 5MB 제한
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only images are allowed."));
    }
  },
});

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: emailUser,
    pass: emailPass,
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 정적 파일 제공 설정
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "..", "frontend", "build")));
app.use(
  "/tableorder",
  express.static(path.join(__dirname, "..", "frontend", "public"))
);

app.use((req, res, next) => {
  console.log(`Received ${req.method} request for ${req.url}`);
  next();
});

// 회원가입 처리
app.post("/signup", async (req, res) => {
  const { email, password, shopName, phoneNumber, address } = req.body;

  if (!email || !password || !shopName || !phoneNumber || !address) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const { data: existingUser, error: existingUserError } = await supabase
      .from("admin")
      .select("id")
      .eq("email", email)
      .single();

    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

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
      return res.status(400).json({ error: error.message });
    }

    const emailToken = jwt.sign({ email }, jwtSecret, { expiresIn: "1h" });
    const emailVerificationUrl = `https://serve-me-70c148e5be60.herokuapp.com/verify-email?token=${emailToken}`;
    //const emailVerificationUrl = `http://localhost:${port}/verify-email?token=${emailToken}`;

    const mailOptions = {
      from: emailUser,
      to: email,
      subject: "Email Verification",
      text: `Please verify your email by clicking the following link: ${emailVerificationUrl}`,
    };

    transporter.sendMail(mailOptions, (emailError) => {
      if (emailError) {
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

// 이메일 인증 처리
app.get("/verify-email", async (req, res) => {
  const token = req.query.token;

  if (!token) {
    return res.status(400).json({ error: "Invalid token" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);

    const { data, error } = await supabase
      .from("admin")
      .update({ email_verified: true })
      .eq("email", decoded.email);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(400).json({ error: "Invalid or expired token" });
  }
});

// 로그인 처리
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
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

    res.json({ token, admin_id: user.id });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 주문 추가 API
app.post("/cart", async (req, res) => {
  const items = req.body;

  if (!items.every((item) => item.table_id)) {
    return res
      .status(400)
      .json({ error: "Table ID is required for each item." });
  }

  try {
    const { data, error } = await supabase.from("orders").insert(items);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    broadcastNewOrder(data); // WebSocket을 통해 새 주문 알림 브로드캐스트

    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ error: "Failed to process order." });
  }
});

// 404 처리: 모든 요청을 React로 리디렉션
app.get("*", (req, res) => {
  if (req.path.includes(".") && req.path.split(".").pop().length > 0) {
    const filePath = path.join(__dirname, "public", req.path);
    res.sendFile(filePath, (err) => {
      if (err) {
        res.status(404).send("File not found");
      }
    });
  } else {
    res.sendFile(path.join(__dirname, "..", "frontend", "build", "index.html"));
  }
});

// 서버 시작
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
