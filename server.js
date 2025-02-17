require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const users = [
  { username: "admin", password: bcrypt.hashSync("123456", 10) },
  { username: "user", password: bcrypt.hashSync("password", 10) },
];

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ statusCode: 400, message: "Campos requeridos" });
  }

  const user = users.find((u) => u.username === username);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ statusCode: 401, message: "Credenciales incorrectas" });
  }

  const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: "1m" });

  res.json({
    statusCode: 200,
    intDataMessage: [{ credentials: token }],
  });
});

app.get("/", (req, res) => {
  res.send("Servidor funcionando");
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
