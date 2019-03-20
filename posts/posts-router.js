const express = require('express');

const router = express.Router();

const db = require('../data/helpers/postDb')

router.get('/', (req, res) => {
    db
        .get()
        .then(db => {
            res.status(200).json(db);
        })
        .catch(error => {
            res.status(500).json({ error: "This post information could not be retrieved." })
        })
})

router.get('/:id', (req, res) => {
    const id = req.params.id;
    db
        .getById(id)
        .then(post => {
            if(post.length === 0) {
                res.status(404).json({ message: "The post with the specified ID does not exist." });
            } else {
                res.status(200).json(post);
            }
        })
        .catch(error => {
            res.status(500).json({ error: "The post information could not be retrieved." });
        })
})

router.post('/', (req, res) => {
    const { text } = req.body;

    if (!text) {
        res.status(400).json({ errorMessage: "Please provide text for the post." });
    } else {
    db 
        .insert(req.body)
        .then(post => {
            res.status(201).json(post);
        })
        .catch(error => {
            res.status(500).json({ error: "There was an error while saving the post to the database" });
        })
    }
})

router.delete('/:id', (req, res) => {
    const id = req.params.id;
    db
        .remove(id)
        .then(post => {
            if(post) {
                res.status(204).end();
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist." });
            }
        })
        .catch(error => {
            res.status(500).json({ error: "The post information could not be retrieved." });
        })
})

router.put('/:id', (req, res) => {
    const id = req.params.id;
    const postInfo = req.body;

    !postInfo.text
    ? res
        .status(400)
        .json({ errorMessage: "Please provide text for the post." })
    : db 
        .update(id, postInfo)
        .then(postBody => {
            if (postBody === 0) {
                res
                .status(404)
                .json({ message: "The post with the specified ID does not exist." });
            }
            db
                .findById(id)
                .then(post => {
                    if (post.length === 0) {
                        res
                        .status(404)
                        .json({ message: "The post with the specified ID could not be located." });
                    } else {
                    res
                    .json(post)
                    }
                })
                .catch(error => {
                    res
                        .status(500)
                        .json({ message: "Error occurred while locating post."})
                })
        })
        .catch (error => {
            res
                .status(500)
                .json({ error: "The post info could not be modified"})
        })

});

module.exports = router;