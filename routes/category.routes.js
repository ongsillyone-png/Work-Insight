const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Render Index
router.get('/', authMiddleware, categoryController.renderIndex);

// Category CRUD
router.post('/create', authMiddleware, categoryController.createCategory);
router.put('/update/:id', authMiddleware, categoryController.updateCategory);
router.delete('/delete/:id', authMiddleware, categoryController.deleteCategory);

// Activity Group CRUD
router.post('/group/create', authMiddleware, categoryController.createGroup);
router.put('/group/update/:id', authMiddleware, categoryController.updateGroup);
router.delete('/group/delete/:id', authMiddleware, categoryController.deleteGroup);

module.exports = router;
