const mongoose = require('mongoose');

const PacienteSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    idade: { type: Number, required: true },
    cpf: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('Paciente', PacienteSchema);
