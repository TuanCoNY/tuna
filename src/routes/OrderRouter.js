const express = require("express");
const router = express.Router()
const OrderController = require('../controllers/OrderController');
const { authUserMiddleware, authMiddleware } = require("../middleware/authMiddleware");

router.post('/create', OrderController.createOrder)
router.get('/get-all-order/:id', authUserMiddleware, OrderController.getAllOrderDetails)
router.get('/get-details-order/:id', OrderController.getDetailsOrder)
router.delete('/cancel-order/:id', OrderController.cancelOrderDetails)
//router.patch('/cancel-order/:id', OrderController.cancelOrderDetails)
router.get('/get-all-order', authMiddleware, OrderController.getAllOrder)
router.patch('/update-status/:id', OrderController.updateOrderStatus);
router.delete('/delete-many-orders', OrderController.deleteManyOrders);
//
router.put('/mark-received/:orderId', OrderController.markOrderAsReceived);





module.exports = router     