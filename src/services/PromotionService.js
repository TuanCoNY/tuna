const Promotion = require('../models/Promotion');

// Tạo chương trình khuyến mại mới
const createPromotion = async (promotionData) => {
    const promotion = new Promotion(promotionData);
    return await promotion.save();
};

// Lấy tất cả các chương trình khuyến mại
const getAllPromotions = async () => {
    return await Promotion.find({ isActive: true }); // Lọc những chương trình khuyến mại còn hoạt động
};

// Cập nhật chương trình khuyến mại
const updatePromotion = async (promotionId, promotionData) => {
    return await Promotion.findByIdAndUpdate(promotionId, promotionData, { new: true });
};

// Xóa chương trình khuyến mại
const deletePromotion = async (promotionId) => {
    return await Promotion.findByIdAndDelete(promotionId);
};

module.exports = {
    createPromotion,
    getAllPromotions,
    updatePromotion,
    deletePromotion
};
