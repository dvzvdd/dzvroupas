const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Servir o arquivo index.html e arquivos estáticos
app.use(express.static(__dirname));

// Conexão com o MySQL local
const db = mysql.createConnection({
    host: 'localhost',
    user: 'teste',
    password: 'teste',
    database: 'contas'
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar no MySQL:', err);
        return;
    }
    console.log('Conectado ao MySQL local na base "contas"!');
});

// Rota GET - Listar Produtos
app.get('/api/produtos', (req, res) => {
    db.query('SELECT * FROM produtos ORDER BY id DESC', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// Rota POST - Salvar / Editar
app.post('/api/produtos', (req, res) => {
    const { id, name, category, supplierUrl, costFabric, costPackaging, costShippingIn, sellPrice, taxPercent, cardFeePercent, marketingPercent } = req.body;

    if (id) {
        // Atualizar existente
        const sql = `UPDATE produtos SET name=?, category=?, supplierUrl=?, costFabric=?, costPackaging=?, costShippingIn=?, sellPrice=?, taxPercent=?, cardFeePercent=?, marketingPercent=? WHERE id=?`;
        db.query(sql, [name, category, supplierUrl, costFabric, costPackaging, costShippingIn, sellPrice, taxPercent, cardFeePercent, marketingPercent, id], (err) => {
            if (err) return res.status(500).json(err);
            res.json({ message: 'Produto atualizado' });
        });
    } else {
        // Criar novo
        const sql = `INSERT INTO produtos (name, category, supplierUrl, costFabric, costPackaging, costShippingIn, sellPrice, taxPercent, cardFeePercent, marketingPercent) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        db.query(sql, [name, category, supplierUrl, costFabric, costPackaging, costShippingIn, sellPrice, taxPercent, cardFeePercent, marketingPercent], (err, result) => {
            if (err) return res.status(500).json(err);
            res.json({ message: 'Produto cadastrado', id: result.insertId });
        });
    }
});

// Rota DELETE - Excluir
app.delete('/api/produtos/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM produtos WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Produto removido' });
    });
});

app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});