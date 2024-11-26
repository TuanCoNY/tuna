// models/VerificationCode.js
const mongoose = require('mongoose');

const VerificationCodeSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,  // Đảm bảo mỗi email chỉ có một mã xác thực duy nhất
    },
    code: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const VerificationCode = mongoose.model('VerificationCode', VerificationCodeSchema);
module.exports = VerificationCode;
