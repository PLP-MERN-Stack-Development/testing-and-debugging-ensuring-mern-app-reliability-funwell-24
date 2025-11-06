const express = require('express');
const { getUsers, createUser, getUserById } = require('../controllers/userController');

const router = express.Router();

router.get('/', getUsers);
router.post('/', createUser);
router.get('/:id', getUserById);

module.exports = router;