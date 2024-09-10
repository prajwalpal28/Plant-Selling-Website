const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const { getUserProfile, updateUserProfile, deleteUserProfile, verifyUser, validateVerificationToken } = require('../controllers/userController');

// public routes not required the auth middleware
router.route('/verification/:token').post(verifyUser);
router.route('/validateVerificationToken/:token').post(validateVerificationToken)

router.use(auth);

router.route('/profile')
    .get(getUserProfile)
    .patch(updateUserProfile)
    .delete(deleteUserProfile);


module.exports = router;