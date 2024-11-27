const express = require('express');
const router = express.Router();
const PromotionController = require('../controllers/PromotionController');

// Tạo chương trình khuyến mại mới
router.post('/promotions', PromotionController.createPromotion);

// Lấy tất cả chương trình khuyến mại
router.get('/promotions', PromotionController.getAllPromotions);

// Cập nhật chương trình khuyến mại
router.put('/promotions/:id', PromotionController.updatePromotion);

// Xóa chương trình khuyến mại
router.delete('/promotions/:id', PromotionController.deletePromotion);

module.exports = router;
