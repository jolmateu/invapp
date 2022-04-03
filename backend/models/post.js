const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    empresa: { type: String, required: true },
    usuario: { type: String, required: true },
    estado: { type: String, required: true },
    fabricante: { type: String, required: true },
    modelo: { type: String, required: true },
    tipo: { type: String, required: true },
    serie: { type: String, required: true },
    etiqueta: { type: String, required: true }
});

module.exports = mongoose.model('Post', postSchema);