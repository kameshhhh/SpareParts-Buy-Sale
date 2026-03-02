const router = require('express').Router();
const ctrl = require('../controllers/productController');
const upload = require('../middleware/upload');

router.get('/', ctrl.getAll);
router.get('/brands', ctrl.getBrands);
router.get('/bikes', ctrl.getBikes);
router.get('/:id', ctrl.getOne);
router.post('/', upload.array('images', 5), ctrl.create);

module.exports = router;
