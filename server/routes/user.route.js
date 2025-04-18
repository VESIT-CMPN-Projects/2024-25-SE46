const express = require('express');
const {test, getUser, updateUser, deleteUser, getUserListings} = require('../controllers/user.controller');
const verifyToken = require('../utils/verifyUser');
const addUser = require('../utils/addUser');

const router = express.Router();

router.get('/test', test);
router.post('/update/:id', verifyToken,  updateUser)
router.delete('/delete/:id', verifyToken, deleteUser);
router.get('/listings/:id', verifyToken, getUserListings)
router.get('/:id', verifyToken, getUser);

router.get('/add-sample-user', async (req, res) => {
    try {
        await addUser();
        res.status(200).json({ success: true, message: 'Sample user added' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error adding user' });
    }
});

module.exports = router;