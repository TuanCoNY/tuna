const User = require("../models/UserModel")
const bcrypt = require("bcryptjs");
const { genneralAccessToken, genneralRefreshToken } = require("./JwtService")
// 
// services/UserService.js
const { getVerificationCodeForEmail } = require('./verificationService'); // Import hàm từ verificationService
const VerificationCode = require('../models/VerificationCode');  // Import model




// Mail 
const nodemailer = require('nodemailer');

const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const { name, email, password, phone } = newUser;

        try {
            const checkUser = await User.findOne({ email: email });
            if (checkUser) {
                reject({
                    status: 'ERR',
                    message: 'Email already exists.',
                    existingUserName: checkUser.name,
                });
            }

            const hash = await bcrypt.hash(password, 10); // Sử dụng bất đồng bộ
            const createdUser = await User.create({ name, email, password: hash, phone });

            resolve({
                status: 'OK',
                message: 'User created successfully',
                data: createdUser
            });
        } catch (e) {
            reject({
                status: 'ERR',
                message: e.message || 'Something went wrong.'
            });
        }
    });
};

const loginUser = (userLogin) => {
    return new Promise(async (resolve, reject) => {
        const { email, password } = userLogin;

        try {
            const checkUser = await User.findOne({ email });
            if (!checkUser) {
                reject({
                    status: 'ERR',
                    message: 'User not found.'
                });
            }

            const comparePassword = await bcrypt.compare(password, checkUser.password); // Bất đồng bộ

            if (!comparePassword) {
                reject({
                    status: 'ERR',
                    message: 'Incorrect password.'
                });
            }

            const access_token = await genneralAccessToken({ id: checkUser.id, isAdmin: checkUser.isAdmin });
            const refresh_token = await genneralRefreshToken({ id: checkUser.id, isAdmin: checkUser.isAdmin });

            resolve({
                status: 'OK',
                message: 'Login successful',
                access_token,
                refresh_token
            });
        } catch (e) {
            reject({
                status: 'ERR',
                message: e.message || 'Something went wrong.'
            });
        }
    });
};

const updateUser = (id, data) => {
    return new Promise(async (resolve, reject) => {

        try {
            const checkUser = await User.findOne({
                _id: id
            })
            if (checkUser === null) {
                resolve({
                    status: 'OK',
                    message: 'The user is not defined'
                })
            }
            const updateUser = await User.findByIdAndUpdate(id, data, { new: true })
            resolve({
                status: 'OK',
                message: 'Success',
                data: updateUser

            })
        } catch (e) {
            reject(e)
        }
    })
}

const deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {

        try {
            const checkUser = await User.findOne({
                _id: id
            })
            if (checkUser === null) {
                resolve({
                    status: 'OK',
                    message: 'The user is not defined'
                })
            }
            await User.findByIdAndDelete(id)
            resolve({
                status: 'OK',
                message: ' delete user Success',

            })
        } catch (e) {
            reject(e)
        }
    })
}

const deleteManyUser = (ids) => {
    return new Promise(async (resolve, reject) => {
        try {
            await User.deleteMany({ _id: ids })
            resolve({
                status: 'OK',
                message: ' delete user Success',
            })
        } catch (e) {
            reject(e)
        }
    })
}
const getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allUser = await User.find()
            resolve({
                status: 'OK',
                message: 'Success',
                data: allUser
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getDetailsUser = (id) => {
    return new Promise(async (resolve, reject) => {

        try {
            const user = await User.findOne({
                _id: id
            })
            if (user === null) {
                resolve({
                    status: 'OK',
                    message: 'The user is not defined'
                })
            }
            resolve({
                status: 'OK',
                message: 'Success',
                data: user

            })
        } catch (e) {
            reject(e)
        }
    })
}
const resetPasswordService = async (email, newPassword) => {
    try {
        // Kiểm tra xem email có tồn tại không
        const user = await User.findOne({ email });
        // if (!user) {
        //     throw new Error('Email không tồn tại trong hệ thống');
        // }

        // Hash mật khẩu mới trước khi lưu
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        // Cập nhật mật khẩu mới vào cơ sở dữ liệu
        await user.save();

        return {
            status: 'OK',
            message: 'Mật khẩu đã được cập nhật thành công'
        };
    } catch (err) {
        throw new Error(err.message || 'Có lỗi xảy ra khi cập nhật mật khẩu');
    }
};


// 
const sendVerificationCode = async (email) => {
    try {
        // Kiểm tra xem email có tồn tại không
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('Email không tồn tại trong hệ thống');
        }

        // Tạo mã xác thực ngẫu nhiên
        const verificationCode = Math.floor(100000 + Math.random() * 900000);

        // Cấu hình transporter để gửi email
        const transporter = nodemailer.createTransport({
            service: "gmail", // Hoặc SMTP khác
            auth: {
                user: "anhtuanhyehye2002@gmail.com", // Thay bằng email của bạn
                pass: "nmhurvnqyqetocsk", // Thay bằng App Password
            },
        });

        // Cấu hình nội dung email
        const mailOptions = {
            from: "your-email@gmail.com",
            to: email,
            subject: "Your Verification Code",
            text: `Your verification code is: ${verificationCode}`,
        };

        // Gửi email
        await transporter.sendMail(mailOptions);

        // Lưu mã xác thực vào bảng VerificationCode trong cơ sở dữ liệu
        const existingCode = await VerificationCode.findOne({ email });
        if (existingCode) {
            // Nếu mã xác thực đã tồn tại cho email, cập nhật mã xác thực mới
            existingCode.code = verificationCode;
            existingCode.createdAt = Date.now();  // Cập nhật thời gian tạo lại
            await existingCode.save();
        } else {
            // Nếu chưa có mã xác thực cho email, tạo mới bản ghi
            const newVerificationCode = new VerificationCode({
                email,
                code: verificationCode,
            });
            await newVerificationCode.save();
        }

        // 
        return {
            status: 'OK',
            message: 'Mã xác thực đã được gửi thành công',
        };
    } catch (err) {
        throw new Error(err.message || 'Có lỗi xảy ra khi gửi mã xác thực');
    }
};

// 
const verifyCode = async (email, code) => {
    console.log('email (100)', email, code)
    // Logic để kiểm tra mã xác thực
    // Giả sử bạn có một cơ sở dữ liệu để kiểm tra mã xác thực
    const savedCode = await getVerificationCodeForEmail(email);  // Giả sử bạn có hàm này để lấy mã đã lưu trữ trong DB
    if (savedCode === code) {
        return { status: 'OK', message: 'Mã xác thực chính xác' };
    } else {
        throw new Error('(200)Mã xác thực không đúng');
    }
};

// const redisClient = require('./redisClient');
const saveCodeForEmail = (email, code) => {
    const expiresIn = 600; // Mã xác thực hết hạn sau 10 phút (600 giây)

    // Lưu mã vào Redis với khóa là email
    redisClient.setex(email, expiresIn, code, (err, response) => {
        if (err) {
            console.error('Error saving verification code to Redis:', err);
        } else {
            console.log(`Verification code for ${email} saved in Redis with expiration time of ${expiresIn} seconds.`);
        }
    });
};

module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
    deleteManyUser,
    resetPasswordService,
    //
    sendVerificationCode, // Thêm hàm vào export
    verifyCode,
    saveCodeForEmail,


}