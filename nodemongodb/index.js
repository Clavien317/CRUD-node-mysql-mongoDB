const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const cors = require("cors");

app.use(cors());
app.use(express.json());

// Connexion à MongoDB
const url = "mongodb://localhost:27017/tp";

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Base de données connectée!");

    })
    .catch((err) => {
        console.error("Erreur de connexion à la base de données:", err);
    });
const schema = new mongoose.Schema({
    marque: {
        type: String,
        required: true
    },
    prix: {
        type: String,
        required: true
    },
});

const model = mongoose.model("produit", schema);

// Insertion de données
app.post("/ajout", async(req, res) => {
    const { marque, prix } = req.body;
    const value = [
        req.body.marque,
        req.body.prix
    ]
    console.log(value);
    // Vérifier si la marque et le prix sont présents dans les données de la requête
    if (!marque || !prix) {
        return res.status(400).json("La marque et le prix sont requis");
    }
    try {
        await model.create({ marque: marque, prix: prix });
        res.send("Insertion réussie");
    } catch (error) {
        console.error(error);
        res.status(500).json("Erreur serveur lors de l'insertion");
    }
});

//Liste de donnees
app.get("/", async(req, res) => {
    const data = await model.find()
    res.json({ "liste de donnees : ": data })
})

//un seul donnees
app.get("/:id", async(req, res) => {
    const id = req.params.id
    const data = await model.find({ _id: id })
    res.json({ "Voici l'un de nos element :": data })
})


//Modification de donnees
app.put("/:id", async(req, res) => {
    const id = req.params.id;
    const data = {
        marque: req.body.marque,
        prix: req.body.prix
    };
    try {
        const d = await model.findByIdAndUpdate(id, data, { new: true });
        if (d) {
            res.json("Modifiée avec succès");
        } else {
            res.status(404).json("ID non trouvé");
        }
    } catch (error) {
        console.error(error);
        res.status(500).json("Erreur serveur");
    }
});


//Suppression de donnees
app.delete("/:id", async(req, res) => {
    const id = req.params.id
    await model.findOneAndDelete({ _id: id })
    res.json("Supprimee avec succes")
})

app.listen(port, console.log("serveur demarre...."))