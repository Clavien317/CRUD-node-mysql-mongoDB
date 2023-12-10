const express = require("express")
const app = express()
const port = 4000
const mysql = require("mysql")

// Ajouter le middleware pour analyser le corps JSON
app.use(express.json());

const connexion = mysql.createConnection({
    database: "tp",
    host: "localhost",
    user: "root",
    password: ""
})

app.get("/", (req, res) => {
    res.send("Pratique CRUD de Node-Express et Mysql")
})

app.post("/add/phone", (req, res) => {
    const sql = "INSERT INTO phone (marque, prix) VALUES (?, ?)"

    const values = [
        req.body.marque,
        req.body.prix
    ]

    connexion.query(sql, values, (err, result) => {
        if (err) {
            console.log("Problème lors de l'insertion des données :", err);
            res.status(500).json({ "message": "Internal Server Error" });
        } else {
            res.status(202).json({ "message": "Successful" })
        }
    })
})

app.get("/liste/phone", (req, res) => {
    const sql = "SELECT * FROM phone"
    connexion.query(sql, (err, result) => {
        res.status(200).json({ "Listes de nos telephone : ": result })
    })
})


app.put("/update/phone/:id", (req, res) => {
    const id = req.params.id;
    const { marque, prix } = req.body;

    const sql = "UPDATE phone SET marque = ?, prix = ? WHERE code = ?";
    const values = [marque, prix, id];

    connexion.query(sql, values, (err, result) => {
        if (err) {
            console.log("Problème lors de la modification des données :", err);
            res.status(500).json({ "message": "Internal Server Error" });
        } else {
            res.status(200).json({ "message": "Modifiee avec succes" });
        }
    });
});

app.delete("/delete/phone/:id", (req, res) => {
    const id = req.params.id;
    const sql = "DELETE FROM phone WHERE code = ?";
    const values = [id];

    connexion.query(sql, values, (err, result) => {
        if (err) {
            console.log("Problème lors de la suppression des données :", err);
            res.status(500).json({ "message": "Internal Server Error" });
        } else {
            res.status(200).json({ "message": "Supprimee avec succes" });
        }
    });
});

app.listen(port, console.log(`Serveur démarré sur http://localhost:${port}`))