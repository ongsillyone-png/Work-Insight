const express = require('express');
const router = express.Router();
const locationController = require('../controllers/location.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.get('/', authMiddleware, locationController.renderIndex);
router.post('/create', authMiddleware, locationController.createLocation);
router.put('/update/:id', authMiddleware, locationController.updateLocation);
router.delete('/delete/:id', authMiddleware, locationController.deleteLocation);

module.exports = router;
