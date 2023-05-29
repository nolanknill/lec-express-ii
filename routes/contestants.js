// All route paths in this file are prefixed with "/contestants"
const express = require('express');
const router = express.Router();
const fs = require('fs');

const filepath = "./data/contestants.json";

function getContestants() {
    const contestantsJson = fs.readFileSync(filepath);

    return JSON.parse(contestantsJson);
}

function setContestants(contestants) {
    fs.writeFileSync(filepath, JSON.stringify(contestants));
}

//   GET /contestants
router.get('/', (_req, res) => {
    const contestants = getContestants();

    res.json(contestants);
});

router.route("/:id")
    .get((req, res) => {
        const requestedId = Number(req.params.id);

        const foundContestant = getContestants().find((contestant) => {
            return contestant.id === requestedId;
        })

        if (foundContestant) {
            return res.json(foundContestant);
        } else {
            return res.status(404).json({
                error: `Unable to find contestant with id ${requestedId}`
            })
        } 
    })
    .delete((req, res) => {
        const requestedId = Number(req.params.id);

        const contestants = getContestants();

        const newContestants = contestants.filter((contestant) => {
            return contestant.id !== requestedId;
        })

        if (contestants.length === newContestants.length) {
            return res.status(404).json({
                error: `Unable to find contestant with id ${requestedId}`
            });
        }

        setContestants(newContestants);

        res.sendStatus(204);
    })
    .put((req, res) => {
        const requestedId = Number(req.params.id);

        const contestants = getContestants();

        let foundContestant = contestants.find((contestant) => {
            return contestant.id === requestedId;
        })

        if (!foundContestant) {
            return res.status(404).json({
                error: `Unable to find contestant with id ${requestedId}`
            })
        }
        
        // express.json middleware required to have this -> req.body
        // Validate all fields are present
        if ( ! req.body.name ||
             ! req.body.hometown ||
             ! req.body.country ||
             ! req.body.age ||
             ! req.body.originalSeason ||
             ( !req.body.rating && req.body.rating !== 0)
        ) {
            return res.status(400).json({
                error: `Missing required fields`
            })
        }

        const updatedContestant = {
            ...foundContestant,
            name: req.body.name,
            hometown: req.body.hometown,
            country: req.body.country,
            age: req.body.age,
            originalSeason: req.body.originalSeason,
            rating: req.body.rating
        }
        
        const newContestants = contestants.map((contestant) => {
            // unchanged
            if (contestant.id !== foundContestant.id) {
                return contestant;
            }
            
            return updatedContestant;
        })

        setContestants(newContestants);

        res.json(foundContestant);
    })

module.exports = router;