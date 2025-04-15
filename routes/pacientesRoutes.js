const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

let pacientes = []; // Lista para armazenar os pacientes em memória
let pacienteId = 1; // ID incremental para os pacientes

// Middleware para verificar o Token JWT
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization'); // Pega o token do cabeçalho da requisição
    if (!token) return res.status(401).json({ error: "Acesso negado! Token não fornecido." });

    try {
        const secretKey = process.env.JWT_SECRET || "seuSegredoSuperSecreto"; // 🛑 Variável de ambiente recomendada!
        const decoded = jwt.verify(token.replace('Bearer ', ''), secretKey); // Verifica o token
        req.user = decoded; // Armazena os dados do usuário autenticado na requisição
        next(); // Continua para a próxima função da rota
    } catch (error) {
        res.status(403).json({ error: "Token inválido!" });
    }
};

// 🔒 Rota protegida - Listar pacientes
router.get('/', verifyToken, (req, res) => {
    res.json(pacientes);
});

// 🔒 Rota protegida - Adicionar paciente
router.post('/', verifyToken, (req, res) => {
    const { nome, idade, cpf } = req.body;
    if (!nome || !idade || !cpf) return res.status(400).json({ error: "Todos os campos são obrigatórios!" });

    try {
        const novoPaciente = {
            id: pacienteId++, // ID autoincrementado
            nome,
            idade,
            cpf
        };

        pacientes.push(novoPaciente); // Adiciona à lista em memória
        res.status(201).json(novoPaciente);
    } catch (error) {
        res.status(500).json({ error: "Erro ao adicionar paciente" });
    }
});

module.exports = router;
