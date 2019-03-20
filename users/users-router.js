const express = require('express');

const router = express.Router();

const db = require('../data/helpers/userDb')

router.get('/', (req, res) => {
    db
        .get()
        .then(db => {
            res.status(200).json(db);
        })
        .catch(error => {
            res.status(500).json({ error: "This user information could not be retrieved." })
        })
})

router.get('/:id', (req, res) => {
    const id = req.params.id;
    db
        .getById(id)
        .then(user => {
            if(user.length === 0) {
                res.status(404).json({ message: "The user with the specified ID does not exist." });
            } else {
                res.status(200).json(user);
            }
        })
        .catch(error => {
            res.status(500).json({ error: "The user information could not be retrieved." });
        })
})

router.post('/', (req, res) => {
    const { name } = req.body;

    if (!name) {
        res.status(400).json({ errorMessage: "Please provide name for the user." });
    } else {
    db 
        .insert(req.body)
        .then(user => {
            res.status(201).json(user);
        })
        .catch(error => {
            res.status(500).json({ error: "There was an error while saving the user to the database" });
        })
    }
})

router.delete('/:id', (req, res) => {
    const id = req.params.id;
    db
        .remove(id)
        .then(user => {
            if(user ) {
                res.status(204).end();
            } else {
                res.status(404).json({ message: "The user with the specified ID does not exist." });
            }
        })
        .catch(error => {
            res.status(500).json({ error: "The user information could not be retrieved." });
        })
})

router.put('/:id', (req, res) => {
    const id = req.params.id;
    const userInfo = req.body;

    !userInfo.name
    ? res
        .status(400)
        .json({ errorMessage: "Please provide name for the post." })
    : db 
        .update(id, userInfo)
        .then(postBody => {
            if (postBody === 0) {
                res
                .status(404)
                .json({ message: "The user with the specified ID does not exist." });
            }
            db
                .getById(id)
                .then(user => {
                    if (user.length === 0) {
                        res
                        .status(404)
                        .json({ message: "The user with the specified ID could not be located." });
                    } else {
                    res
                    .json(user)
                    }
                })
                .catch(error => {
                    res
                        .status(500)
                        .json({ message: "Error occurred while locating user."})
                })
        })
        .catch (error => {
            res
                .status(500)
                .json({ error: "The user info could not be modified"})
        })

});

module.exports = router;