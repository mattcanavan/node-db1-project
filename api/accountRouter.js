const express = require('express');

const db = require("../data/dbConfig");

const router = express.Router()

/// HELPER FUNCTIONS
const Accounts = {
    getAll(){
        return db.select('*').from('accounts')
    },

    getByID(id) {
        return db("accounts").where({ id: id }) //where takes obj with key:value pairs (column:value)
    },

    create(newAccount) {
        return db("accounts").insert(newAccount)
    },

    update(id, changes){
        return db("accounts").where({ id: id }).update(changes)
    }

    // delete(id)
}

// function handleError(error) {
//     res.status(500).json({ message: error.message })
// }

///ENDPOINTS
router.get("/", (req, res) => {
    Accounts.getAll()
    .then(success => {
        res.status(200).json(success)
    })
    .catch(error => {
        res.status(500).json({ message: error.message })
    })
});

router.get("/:id", (req, res) => {
    const { id } = req.params;

    Accounts.getByID(id)
    .then(success => {
        res.status(200).json(success[0]) //we know prmise is returning collection with length 1, so why not return just the obj.
    })
    .catch(error => {
        res.status(500).json({ message: error.message })
    })
});

router.post("/", (req, res) => {
    console.log(req.body)
    Accounts.create(req.body)
    .then(([id]) => {
      return Accounts.getById(id)
    })
    .then(success => {
      res.status(201).json(success[0]);
    })
    .catch((error) => {
      res.status(500).json(error);
    });
})

module.exports = router;