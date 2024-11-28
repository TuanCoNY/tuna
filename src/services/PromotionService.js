const Promotion = require('../models/Promotion');

// Tạo chương trình khuyến mại mới
const createPromotion = async (data) => {
    const { name, description, discountType, discountValue, startDate, endDate } = data;
    if (!name || !description || !discountType || !discountValue || !startDate || !endDate) {
        throw new Error('All fields are required');
    }
    return await Promotion.create({ name, description, discountType, discountValue, startDate, endDate });
};

const getAllPromotions = async () => {
    return await Promotion.find().sort({ createdAt: -1 }); // Lấy danh sách khuyến mãi theo thời gian tạo mới nhất
};

// Cập nhật chương trình khuyến mại
const updatePromotion = async (id, data) => {
    const { name, description, discountType, discountValue, startDate, endDate } = data;
    if (!name || !description || !discountType || !discountValue || !startDate || !endDate) {
        throw new Error('All fields are required');
    }

    const updatedPromotion = await Promotion.findByIdAndUpdate(
        id,
        { name, description, discountType, discountValue, startDate, endDate },
        { new: true } // Trả về dữ liệu sau khi đã cập nhật
    );

    if (!updatedPromotion) {
        throw new Error('Promotion not found');
    }

    return updatedPromotion;
};

// Xóa chương trình khuyến mại
const deletePromotion = async (id) => {
    const deletedPromotion = await Promotion.findByIdAndDelete(id);

    if (!deletedPromotion) {
        throw new Error('Promotion not found');
    }

    return deletedPromotion;
};

module.exports = {
    createPromotion,
    getAllPromotions,
    updatePromotion,
    deletePromotion
};
