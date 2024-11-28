const PromotionService = require('../services/PromotionService');

// Tạo chương trình khuyến mại mới
const createPromotion = async (req, res) => {
    try {
        const promotion = await PromotionService.createPromotion(req.body);
        return res.status(201).json({
            status: 'OK',
            message: 'Promotion created successfully',
            data: promotion
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
        const { id } = req.params; // Lấy `id` từ route params
        console.log('id', id)
        const updatedPromotion = await PromotionService.updatePromotion(id, req.body); // Truyền dữ liệu từ `req.body`
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
        const { id } = req.params; // Lấy `id` từ route params
        const deletedPromotion = await PromotionService.deletePromotion(id);
        return res.status(200).json({
            status: 'OK',
            message: 'Promotion deleted successfully',
            data: deletedPromotion
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
