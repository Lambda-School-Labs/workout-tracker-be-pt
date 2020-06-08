const express = require('express');

const Diet = require('../models/dietModel');
const restricted = require('../../validation/middleware/restricted-middlware');
const router = express.Router();

// Get a list of existing diet foods
router.get('/', (req, res) => {
  Diet.getAll()
    .then((diet) => {
      res.status(200).json(diet);
    })
    .catch((err) => {
      res.status(500).json({ message: 'Could not retrieve diet', err });
    });
});

// Get a diet food entry by id
router.get('/:id', (req, res) => {
  const { id } = req.params;

  Diet.findById(id)
    .then((entry) => {
      if (entry) {
        res.json(entry);
      } else {
        res
          .status(404)
          .json({ message: 'Could not find this entry with the given id' });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: 'Could not retrieve this entry', err });
    });
});

// Add a diet food entry
router.post('/', restricted, (req, res) => {
  const dietData = req.body;
  dietData.user_id = req.userId;

  Diet.add(dietData)
    .then((diet) => {
      res.status(201).json(diet);
    })
    .catch((err) => {
      res.status(500).json({ message: 'Could not add a new food entry', err });
    });
});

// Update a diet food entry
router.put('/:id', restricted, (req, res) => {
  const { id } = req.params;
  const changes = req.body;
  changes.user_id = req.userId;

  Diet.findById(id)
    .then((food) => {
      if (food) {
        Diet.update(changes, id).then((updatedDiet) => {
          res.status(200).json(updatedDiet);
        });
      } else {
        res.status(404).json({ message: 'Could not find a matching entry' });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: 'Could not update this entry', err });
    });
});

// Delete a diet food entry
router.delete('/:id', restricted, (req, res) => {
  const { id } = req.params;

  Diet.remove(id)
    .then((deleted) => {
      if (deleted) {
        res.json({ removed: deleted });
      } else {
        res.status(404).json({ message: 'Could not find a matching entry' });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: 'Could not remove this entry', err });
    });
});

module.exports = router;