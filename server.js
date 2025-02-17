require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const users = [
  { 
    username: "admin", 
    password: "123456" 
  },
];

app.post("/login", (req, res) => {
  const username = req.body.username?.trim();
  const password = req.body.password?.trim();

  if (!username || !password) {
    return res.status(400).json(
      { statusCode: 400, 
        message: "Complete los campos usuario y contraseña" 
      }
    );
  }

  const user = users.find((u) => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json(
      { statusCode: 401, 
        message: "Credenciales incorrectas" 
      }
    );
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json(
      { statusCode: 500, 
        message: "Error interno: JWT_SECRET no está definido" 
      }
    );
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
