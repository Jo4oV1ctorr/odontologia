const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const PDFDocument = require("pdfkit");

let laudos = [];
let laudoId = 1;
global.pacientes = global.pacientes || [];

// Middleware para verificar Token JWT
const verifyToken = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ error: "Acesso negado! Token não fornecido." });

    try {
        const secretKey = process.env.JWT_SECRET || "seuSegredoSuperSecreto";
        const decoded = jwt.verify(token.replace("Bearer ", ""), secretKey);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json({ error: "Token inválido!" });
    }
};

// 🔹 Listar todos os laudos
router.get("/", verifyToken, (req, res) => {
    res.json(laudos);
});

// 🔹 Criar um novo laudo
router.post("/", verifyToken, (req, res) => {
    try {
        const { pacienteId, diagnostico, observacoes, dataLaudo } = req.body;

        if (!pacienteId || !diagnostico || !observacoes) {
            return res.status(400).json({ error: "Paciente, diagnóstico e observações são obrigatórios!" });
        }

        // 🔹 Agora a verificação busca na lista global.pacientes
        const pacienteExiste = global.pacientes.find(p => p.id === Number(pacienteId));

        if (!pacienteExiste) {
            return res.status(404).json({ error: "Paciente não encontrado" });
        }

        const novoLaudo = {
            id: laudoId++,
            pacienteId,
            diagnostico,
            observacoes,
            dataLaudo: dataLaudo || new Date().toISOString(),
        };

        laudos.push(novoLaudo);
        res.status(201).json(novoLaudo);
    } catch (error) {
        res.status(500).json({ error: "Erro ao criar o laudo", detalhes: error.message });
    }
});

// 🔹 Gerar PDF do laudo
router.get("/:id/pdf", verifyToken, (req, res) => {
    const laudo = laudos.find(l => l.id === Number(req.params.id));
    if (!laudo) {
        return res.status(404).json({ error: "Laudo não encontrado" });
    }

    const paciente = global.pacientes.find(p => p.id === Number(laudo.pacienteId));
    if (!paciente) {
        return res.status(404).json({ error: "Paciente não encontrado" });
    }

    // Criar o documento PDF
    const doc = new PDFDocument();
    const filePath = `laudo_${laudo.id}.pdf`;

    res.setHeader("Content-Disposition", `attachment; filename=${filePath}`);
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    doc.fontSize(20).text("Laudo Pericial", { align: "center" });
    doc.moveDown();
    doc.fontSize(14).text(`Paciente: ${paciente.nome}`);
    doc.text(`Idade: ${paciente.idade}`);
    doc.text(`CPF: ${paciente.cpf}`);
    doc.moveDown();
    doc.fontSize(14).text(`Diagnóstico: ${laudo.diagnostico}`);
    doc.text(`Observações: ${laudo.observacoes}`);
    doc.text(`Data do Laudo: ${new Date(laudo.dataLaudo).toLocaleDateString()}`);

    doc.end();
});

module.exports = router;
