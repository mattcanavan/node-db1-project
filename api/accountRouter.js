const express = require('express');

const db = require("../data/dbConfig");

const router = express.Router()

/// HELPER FUNCTIONS
const Accounts = {
    getAll(){
        return db.select('*').from('accounts')
    },

    getById(id) {
        return db("accounts").where({ id: id }) //where takes obj with key:value pairs (column:value)
    },

    create(newAccount) {
        return db("accounts").insert(newAccount)
    },

    update(id, changes){
        return db("accounts").where({ id: id }).update(changes)
    },

    delete(id){
        return db("accounts").where({ id: id }).del()
    }
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
    Accounts.create(req.body) //on success, returns collection with account id #
    .then(newID => {
      return Accounts.getById(newID[0])
    })
    .then(success => {
      res.status(201).json(success[0]); //want only the first item in the success collection
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
})

router.put("/:id", (req,res) => {
    console.log("heres intersting stuff...", req.params.id, req.body)
    Accounts.update(req.params.id, req.body)
    .then(data => {
        return Accounts.getById(req.params.id) 
    })
    .then(success => {
        res.status(201).json({ message: success[0]})
    })
    .catch(error => {
        res.status(500).json({ message: error.message })
    })
})

router.delete("/:id", (req, res) => {

    Accounts.delete(req.params.id)
    .then(success => {
        res.status(200).json({ message: `successfully deleted account with id ${req.params.id}.`})
    })
    .catch(error => {
        res.status(500).json({ message: error.message })
    })
})

module.exports = router;