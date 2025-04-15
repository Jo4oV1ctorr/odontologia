const mongoose = require('mongoose');

const LaudoSchema = new mongoose.Schema({
    pacienteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Paciente', required: true },
    diagnostico: { type: String, required: true },
    observacoes: { type: String, required: true },
    data: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Laudo', LaudoSchema);
