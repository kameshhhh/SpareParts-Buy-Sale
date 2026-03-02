const router = require('express').Router();
const ctrl = require('../controllers/categoryController');

router.get('/', ctrl.getAll);
router.get('/:slug', ctrl.getOne);
router.get('/:slug/products', ctrl.getProducts);

module.exports = router;
