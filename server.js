const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config(); // Carregar variáveis de ambiente do .env

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json()); 

// 🔹 Lista de pacientes armazenada na memória (torna-se acessível a outros módulos)
global.pacientes = []; 

global.JWT_SECRET = process.env.JWT_SECRET || "seuSegredoSuperSecreto"; // Define o segredo globalmente

// 🔹 Importando rotas
const laudoRoutes = require("./routes/laudoRoutes");
app.use("/api/laudos", laudoRoutes);

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

// 🔹 Rotas de Pacientes
app.get("/api/pacientes", (req, res) => {
    res.json(global.pacientes);
});

app.post("/api/pacientes", (req, res) => {
    const { nome, idade, cpf } = req.body;

    if (!nome || !idade || !cpf) {
        return res.status(400).json({ error: "Todos os campos são obrigatórios!" });
    }

    const novoPaciente = { id: global.pacientes.length + 1, nome, idade, cpf };
    global.pacientes.push(novoPaciente);

    res.status(201).json(novoPaciente);
});

// 🔹 Rota 404
app.use((req, res) => {
    res.status(404).json({ error: "Rota não encontrada!" });
});

// 🔹 Iniciar servidor
app.listen(PORT, () => {
    console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
});
