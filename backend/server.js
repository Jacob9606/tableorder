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

let interval; // interval 변수를 상단에서 선언합니다.

// WebSocket 이벤트 처리
wss.on("connection", function connection(ws) {
  console.log("A new client connected");

  ws.isAlive = true;
  ws.on("pong", () => {
    ws.isAlive = true; // 클라이언트가 살아 있음을 확인합니다.
  });

  ws.on("message", function incoming(message) {
    console.log("received: %s", message);

    const parsedMessage = JSON.parse(message);

    if (parsedMessage.type === "call_staff") {
      console.log(
        `Table ${parsedMessage.table_id} is calling for staff assistance.`
      );
      // 필요한 로직을 여기에 추가
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
    ws.ping(); // 서버에서 클라이언트로 핑을 보냅니다.
  });
}, 30000);

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

// 메시지 수신 처리
wss.on("connection", function connection(ws) {
  console.log("A new client connected");

  ws.isAlive = true;
  ws.on("pong", () => {
    ws.isAlive = true; // 클라이언트가 살아 있음을 확인합니다.
  });

  ws.on("message", function incoming(message) {
    console.log("received: %s", message);

    const parsedMessage = JSON.parse(message);

    if (parsedMessage.type === "call_staff") {
      console.log(
        `Table ${parsedMessage.table_id} is calling for staff assistance.`
      );
      broadcastCallStaff(parsedMessage.table_id); // 메시지를 관리자로 전달
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

// 1. 정적 파일 제공 설정
app.use(express.static(path.join(__dirname, "public")));

// 프론트엔드 빌드 파일 제공 설정
app.use(express.static(path.join(__dirname, "..", "frontend", "build")));

app.use(
  "/tableorder",
  express.static(path.join(__dirname, "..", "frontend", "public"))
);

app.use((req, res, next) => {
  console.log(`Received ${req.method} request for ${req.url}`);
  next();
});

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

    if (existingUserError && existingUserError.code !== "PGRST116") {
      // PGRST116은 'Row not found'를 의미합니다.
      return res.status(500).json({ error: existingUserError.message });
    }

    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Ensure await is used here
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
      console.error("Supabase Insert Error:", error);
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

    transporter.sendMail(mailOptions, (emailError, info) => {
      if (emailError) {
        console.error("Email Error:", emailError);
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

  // 응답 데이터 디버깅 로그 추가
  console.log("Login successful:", { token, admin_id: user.id });

  res.json({ token, admin_id: user.id });
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
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

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
  const { name, price, description, category } = req.body;
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
          category,
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
  const { admin_id } = req.query; // URL에서 admin_id 가져오기
  console.log("Request received for /items with admin_id:", admin_id); // 로깅 추가

  try {
    const { data, error } = await supabase
      .from("items")
      .select("id, name, price, description, image_url, category")
      .eq("admin_id", admin_id); // admin_id에 따라 필터링
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

// Update item
app.put("/items/:id", upload.single("image"), async (req, res) => {
  const itemId = req.params.id; // URL에서 ID 추출
  const { name, price, description } = req.body;
  const image = req.file;

  console.log("Received update request for item ID:", itemId);
  console.log("Received data:", { name, price, description });

  if (!itemId) {
    return res.status(400).json({ error: "Item ID is required" });
  }

  try {
    const updateData = {
      name,
      price,
      description,
    };

    if (image) {
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

      updateData.image_url = `https://nirarnqszpwmznmykxaf.supabase.co/storage/v1/object/public/items/${uniqueName}`;
    }

    const { data, error } = await supabase
      .from("items")
      .update(updateData)
      .eq("id", itemId);

    if (error) {
      console.error("Update Error:", error);
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json({ message: "Item updated successfully", data });
  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).json({ error: "Failed to update item" });
  }
});

// Delete Item
app.delete("/items/:id", async (req, res) => {
  const itemId = req.params.id;

  try {
    const { data, error } = await supabase
      .from("items")
      .delete()
      .eq("id", itemId);

    if (error) {
      console.error("Delete Error:", error);
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json({ message: "Item deleted successfully", data });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({ error: "Failed to delete item" });
  }
});

// Get Profile
app.get("/profile", async (req, res) => {
  const token = req.headers.authorization.split(" ")[1]; // Bearer token

  try {
    const decoded = jwt.verify(token, jwtSecret);
    const { data: user, error } = await supabase
      .from("admin")
      .select("shop_name, email, phone_number")
      .eq("id", decoded.id)
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// Update Profile
app.put("/profile", async (req, res) => {
  const token = req.headers.authorization.split(" ")[1]; // Bearer token
  const { email, shopName, phoneNumber } = req.body;

  try {
    const decoded = jwt.verify(token, jwtSecret);
    const { data, error } = await supabase
      .from("admin")
      .update({
        shop_name: shopName,
        email,
        phone_number: phoneNumber,
      })
      .eq("id", decoded.id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

// make order
app.post("/cart", async (req, res) => {
  const items = req.body;

  console.log("Received order items:", items);

  if (!items.every((item) => item.table_id)) {
    return res
      .status(400)
      .json({ error: "Table ID is required for each item." });
  }

  try {
    const { data, error } = await supabase.from("orders").insert(items);

    if (error) {
      console.error("Error inserting orders:", error);
      return res.status(500).json({ error: error.message });
    }

    broadcastNewOrder(data); // WebSocket을 통해 새 주문을 브로드캐스트합니다.

    res.status(200).json({ data });
  } catch (error) {
    console.error("Error processing order:", error);
    res.status(500).json({ error: "Failed to process order." });
  }
});

//Get Orders
app.get("/orders", async (req, res) => {
  const { admin_id } = req.query;

  try {
    // 특정 admin_id에 해당하는 모든 주문을 가져옵니다.
    const { data, error } = await supabase
      .from("orders")
      .select("id, item, price, status, created_at, customer_number, table_id")
      .eq("admin_id", admin_id);

    if (error) {
      console.error("Error fetching orders from database:", error);
      return res.status(400).json({ error: error.message });
    }

    if (data.length === 0) {
      console.warn(`No orders found for admin_id ${admin_id}.`);
      return res.status(404).json({ error: "No orders found" });
    }

    // table_id와 customer_number를 기준으로 주문을 그룹화합니다.
    const groupedOrders = data.reduce((acc, order) => {
      const key = `${order.table_id}-${order.customer_number}`;
      if (!acc[key]) {
        acc[key] = {
          table_id: order.table_id,
          customer_number: order.customer_number,
          total: 0,
          items: [],
        };
      }
      acc[key].items.push(order);
      acc[key].total += order.price;
      return acc;
    }, {});

    // 객체를 배열로 변환하여 반환합니다.
    res.status(200).json(Object.values(groupedOrders));
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// Update Order status
app.put("/orders/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    // 상태 업데이트 및 업데이트된 결과를 다시 조회
    const { data, error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id)
      .select(); // 업데이트된 데이터를 반환

    if (error) {
      console.error("Error updating order status in database:", error);
      return res.status(400).json({ error: error.message });
    }

    if (data.length === 0) {
      console.warn(`Order with id ${id} not found.`);
      return res.status(404).json({ error: "Order not found" });
    }

    console.log("Order status updated:", data);
    res
      .status(200)
      .json({ message: "Order status updated successfully", data });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ error: "Failed to update order status" });
  }
});

// 2. 정적 파일을 먼저 처리하고 나머지 모든 요청은 React 앱으로 리디렉션
app.get("*", (req, res) => {
  if (req.path.includes(".") && req.path.split(".").pop().length > 0) {
    const filePath = path.join(__dirname, "public", req.path);
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error(`File not found: ${filePath}`);
        res.status(404).send("File not found");
      }
    });
  } else {
    res.sendFile(path.join(__dirname, "..", "frontend", "build", "index.html"));
  }
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
