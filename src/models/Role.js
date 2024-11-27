const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true, // Đảm bảo không trùng tên vai trò
            enum: ['admin', 'user'] // Chỉ chấp nhận các giá trị cụ thể
        },
        description: { type: String } // Mô tả vai trò, tuỳ chọn
    },
    {
        timestamps: true // Thêm createdAt và updatedAt tự động
    }
);

const Role = mongoose.model('Role', roleSchema);
module.exports = Role;
