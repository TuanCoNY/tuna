const express = require('express');
const router = express.Router();
const PromotionController = require('../controllers/PromotionController');
const { validatePromotionData } = require("../middleware/validatePromotionData");


// Tạo chương trình khuyến mại mới
router.post('/promotions', validatePromotionData, PromotionController.createPromotion);

// Lấy tất cả chương trình khuyến mại
router.get('/promotions', PromotionController.getAllPromotions);

// Cập nhật chương trình khuyến mại
router.put('/promotions/:id', PromotionController.updatePromotion); // Cập nhật khuyến mãi


// Xóa chương trình khuyến mại
router.delete('/promotions/:id', PromotionController.deletePromotion); // Xóa khuyến mãi


module.exports = router;
