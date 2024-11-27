const mongoose = require('mongoose');

// Định nghĩa schema cho khuyến mại
const promotionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    discountType: {
        type: String, // 'percent' or 'amount'
        enum: ['percent', 'amount'],
        required: true
    },
    discountValue: {
        type: Number, // Giá trị khuyến mại (20% hoặc 50,000 VND)
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true // Trạng thái hoạt động của chương trình khuyến mại
    }
}, {
    timestamps: true // Thêm thời gian tạo và cập nhật
});

// Tạo model từ schema
const Promotion = mongoose.model('Promotion', promotionSchema);

module.exports = Promotion;
