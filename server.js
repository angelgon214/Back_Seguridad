require('dotenv').config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { db } = require("./firebase");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ statusCode: 400, message: "Faltan datos." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      email,
      username,
      password: hashedPassword,
      role: "common_user",
      "date-register": new Date(),
      "last-login": null,
    };

    const userRef = db.collection("users").doc(username);
    const doc = await userRef.get();
    if (doc.exists) {
      return res.status(400).json({ statusCode: 400, message: "Usuario ya registrado." });
    }

    await userRef.set(newUser);
    res.status(201).json({ statusCode: 201, message: "Usuario registrado correctamente." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ statusCode: 500, message: "Error interno al registrar el usuario." });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      statusCode: 400,
      message: "Complete los campos usuario y contraseña"
    });
  }

  try {
    
    const userRef = db.collection("users").doc(username);
    const doc = await userRef.get();

    if (!doc.exists) {
      return res.status(401).json({
        statusCode: 401,
        message: "Credenciales incorrectas"
      });
    }

    const user = doc.data();

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        statusCode: 401,
        message: "Credenciales incorrectas"
      });
    }

    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: "1m" });

    res.json({
      statusCode: 200,
      intDataMessage: [{ credentials: token }],
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      statusCode: 500,
      message: "Error interno"
    });
  }
});

app.get("/", (req, res) => {
  res.send("Servidor funcionando");
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
