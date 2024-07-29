const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const jwtSecret = process.env.JWT_SECRET;

const supabase = createClient(supabaseUrl, supabaseKey);

app.use(cors());
app.use(express.json());

app.post("/signup", async (req, res) => {
  const { email, password, shopName, phoneNumber } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const { data, error } = await supabase
    .from("users")
    .insert([
      {
        email,
        password: hashedPassword,
        shop_name: shopName,
        phone_number: phoneNumber,
      },
    ]);

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.status(201).json(data);
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const { data: user, error } = await supabase
    .from("users")
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

  const token = jwt.sign({ id: user.id, email: user.email }, jwtSecret, {
    expiresIn: "1h",
  });
  res.json({ token });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
