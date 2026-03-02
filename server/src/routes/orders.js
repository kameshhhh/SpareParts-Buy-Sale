const router = require('express').Router();
const ctrl = require('../controllers/orderController');

router.post('/', ctrl.create);
router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getOne);

module.exports = router;
