const PromotionService = require('../services/PromotionService');

// Tạo chương trình khuyến mại mới
const createPromotion = async (req, res) => {
    try {
        const promotionData = req.body;
        const newPromotion = await PromotionService.createPromotion(promotionData);
        return res.status(201).json({
            status: 'OK',
            message: 'Promotion created successfully',
            data: newPromotion
        });
    } catch (error) {
        return res.status(400).json({
            status: 'ERR',
            message: error.message
        });
    }
};

// Lấy tất cả chương trình khuyến mại
const getAllPromotions = async (req, res) => {
    try {
        const promotions = await PromotionService.getAllPromotions();
        return res.status(200).json({
            status: 'OK',
            message: 'Promotions retrieved successfully',
            data: promotions
        });
    } catch (error) {
        return res.status(400).json({
            status: 'ERR',
            message: error.message
        });
    }
};

// Cập nhật chương trình khuyến mại
const updatePromotion = async (req, res) => {
    try {
        const promotionId = req.params.id;
        const promotionData = req.body;
        const updatedPromotion = await PromotionService.updatePromotion(promotionId, promotionData);
        return res.status(200).json({
            status: 'OK',
            message: 'Promotion updated successfully',
            data: updatedPromotion
        });
    } catch (error) {
        return res.status(400).json({
            status: 'ERR',
            message: error.message
        });
    }
};

// Xóa chương trình khuyến mại
const deletePromotion = async (req, res) => {
    try {
        const promotionId = req.params.id;
        await PromotionService.deletePromotion(promotionId);
        return res.status(200).json({
            status: 'OK',
            message: 'Promotion deleted successfully'
        });
    } catch (error) {
        return res.status(400).json({
            status: 'ERR',
            message: error.message
        });
    }
};

module.exports = {
    createPromotion,
    getAllPromotions,
    updatePromotion,
    deletePromotion
};
