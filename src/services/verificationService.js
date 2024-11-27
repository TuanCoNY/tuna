// // services/verificationService.js
// const VerificationCode = require('../models/VerificationCode');

// // services/verificationService.js
// const { getVerificationCodeForEmail } = require('./verificationService'); // Giả sử bạn đã tạo service để lấy mã từ DB

// const verifyCodeController = async (req, res) => {
//     const { email, code } = req.body;  // Truy cập đúng vào trường 'email' và 'code' trong req.body

//     console.log('req', req.body); // Kiểm tra cấu trúc của req.body
//     console.log('email:', email, 'code:', code); // Kiểm tra giá trị email và code

//     if (!email || !code) {
//         return res.status(400).json({
//             status: 'ERR',
//             message: 'Email và mã xác thực không được để trống',
//         });
//     }

//     try {
//         console.log("Mã xác thực và email đã được lấy");

//         // Lấy mã xác thực đã lưu trong cơ sở dữ liệu cho email
//         const savedCode = await getVerificationCodeForEmail(email);

//         console.log("Mã xác thực đã được lấy từ cơ sở dữ liệu");

//         // So sánh mã người dùng nhập với mã đã lưu trong cơ sở dữ liệu
//         if (savedCode === code) {
//             return res.status(200).json({
//                 status: 'OK',
//                 message: 'Mã xác thực chính xác',
//             });
//         } else {
//             return res.status(400).json({
//                 status: 'ERR',
//                 message: 'Mã xác thực không đúng',
//             });
//         }
//     } catch (err) {
//         return res.status(400).json({
//             status: 'ERR',
//             message: err.message || 'Mã xác thực không hợp lệ hoặc đã hết hạn',
//         });
//     }
// };
// const getVerificationCodeForEmail = async (email) => {
//     try {
//         const verificationRecord = await VerificationCode.findOne({ email });
//         if (!verificationRecord) {
//             throw new Error('Mã xác thực không tồn tại hoặc đã hết hạn');
//         }

//         // Kiểm tra thời gian hết hạn của mã xác thực
//         const expirationTime = new Date(verificationRecord.createdAt).getTime() + 10 * 60 * 1000;  // 10 phút hết hạn
//         if (Date.now() > expirationTime) {
//             throw new Error('Mã xác thực đã hết hạn');
//         }

//         console.log('Mã xác thực hợp lệ');
//         return verificationRecord.code;
//     } catch (err) {
//         throw new Error('Lỗi khi lấy mã xác thực từ cơ sở dữ liệu');
//     }
// };


// module.exports = { saveVerificationCode };

// services/verificationService.js
const VerificationCode = require('../models/VerificationCode');  // Import model

// Hàm lấy mã xác thực từ cơ sở dữ liệu và kiểm tra
const getVerificationCodeForEmail = async (email) => {
    try {
        console.log("Đã nhận được email", email);
        const verificationRecord = await VerificationCode.findOne({ email });
        console.log("Trả về bản ghi đã được lấy", verificationRecord);
        if (!verificationRecord) {
            throw new Error('Mã xác thực không tồn tại hoặc đã hết hạn');
        }

        const expirationTime = new Date(verificationRecord.createdAt).getTime() + 10 * 60 * 1000;  // 10 phút hết hạn
        if (Date.now() > expirationTime) {
            throw new Error('Mã xác thực đã hết hạn');
        }
        
        return verificationRecord.code;  // Trả về mã xác thực
    } catch (err) {
        throw new Error('Lỗi khi lấy mã xác thực từ cơ sở dữ liệu');
    }
};

// Export hàm
module.exports = { getVerificationCodeForEmail };
