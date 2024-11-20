const crypto = require('crypto');
const User = require('../models/User');
const { sendEmail } = require('../utils/email');

// Gửi liên kết đặt lại mật khẩu
exports.forgotPassword = async (email) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error('Email không tồn tại');

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    await sendEmail(email, 'Đặt lại mật khẩu', `Nhấp vào liên kết để đặt lại mật khẩu: ${resetUrl}`);

    return { message: 'Đã gửi email đặt lại mật khẩu' };
};

// Đặt lại mật khẩu
exports.resetPassword = async (token, newPassword) => {
    const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) throw new Error('Token không hợp lệ hoặc đã hết hạn');

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    return { message: 'Mật khẩu đã được cập nhật thành công' };
};
