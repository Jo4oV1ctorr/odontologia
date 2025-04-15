const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const router = express.Router();
const users = []; // Armazenamento temporário

const JWT_SECRET = process.env.JWT_SECRET || "chave_super_secreta";

// Rota para registrar usuário
router.post("/register", async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ error: "E-mail e senha são obrigatórios!" });
    }

    const hashedPassword = await bcrypt.hash(senha, 10);
    users.push({ email, senha: hashedPassword });

    res.status(201).json({ message: "Usuário registrado com sucesso!" });
});

// Rota de login para gerar token
router.post("/login", async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ error: "E-mail e senha são obrigatórios!" });
    }

    const user = users.find((u) => u.email === email);

    if (!user) {
        return res.status(401).json({ error: "Usuário não encontrado!" });
    }

    const senhaValida = await bcrypt.compare(senha, user.senha);
    if (!senhaValida) {
        return res.status(401).json({ error: "Senha incorreta!" });
    }

    // Geração correta do token
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "1h" });

    res.json({ message: "Login bem-sucedido!", token });
});

module.exports = router;
