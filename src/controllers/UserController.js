const UserService = require('../services/UserService')
const JwtService = require('../services/JwtService')
const createUser = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, phone } = req.body
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        const isCheckEmail = reg.test(email)

        if (!email || !password || !confirmPassword) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        } else if (!isCheckEmail) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is email'
            })

        } else if (password !== confirmPassword) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The password is equal confirmPassword'
            })

        }


        const response = await UserService.createUser(req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e,
        })

    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        const isCheckEmail = reg.test(email)

        if (!email || !password) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        } else if (!isCheckEmail) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is email'
            })

        }
        const response = await UserService.loginUser(req.body)
        const { refresh_token, ...newResponse } = response
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: false,
            samesite: 'strict',

        })
        return res.status(200).json(newResponse)
    } catch (e) {
        return res.status(404).json({
            message: e,
        })
    }
}

const updateUser = async (req, res) => {
    try {
        const userId = req.params.id
        const data = req.body

        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const response = await UserService.updateUser(userId, data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e,
        })
    }
}

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const response = await UserService.deleteUser(userId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e,
        })
    }
}

const deleteMany = async (req, res) => {
    try {
        const ids = req.body.ids
        if (!ids) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The ids is required'
            })
        }
        const response = await UserService.deleteManyUser(ids)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e,
        })
    }
}
const getAllUser = async (req, res) => {
    try {

        const response = await UserService.getAllUser()
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e,
        })
    }
}

const getDetailsUser = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const response = await UserService.getDetailsUser(userId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e,
        })
    }
}

const refreshToken = async (req, res) => {
    try {
        const token = req.cookies.refresh_token
        //const token = req.headers.token.split(' ')[1]
        if (!token) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The token is required'
            })
        }
        const response = await JwtService.refreshTokenJwtService(token)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e,
        })
    }
}

const logoutUser = async (req, res) => {
    try {
        res.clearCookie('refresh_token')
        return res.status(200).json({
            status: 'OK',
            message: 'Logout successfully'
        })
    } catch (e) {
        return res.status(404).json({
            message: e,
        })
    }
}
const resetPasswordController = async (req, res) => {
    try {
        const { email, newPassword } = req.body.email;

        // Kiểm tra các điều kiện nhập liệu
        // if (!email || !newPassword) {
        //     return res.status(400).json({
        //         status: 'ERR',
        //         message: 'Cần cung cấp email và mật khẩu mới'
        //     });
        // }

        // Gọi service để thực hiện logic quên mật khẩu
        const response = await UserService.resetPasswordService(email, newPassword);

        // Trả về phản hồi nếu thành công
        return res.status(200).json(response);
    } catch (err) {
        return res.status(500).json({
            status: 'ERR',
            message: err.message || 'Có lỗi xảy ra trong quá trình xử lý'
        });
    }
};

//
const { sendVerificationCode } = require('../services/UserService'); // Import service
// services/UserService.js
const { getVerificationCodeForEmail } = require('../services/verificationService'); // Import hàm từ verificationService

//
const sendCodeController = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            status: 'ERR',
            message: 'Email không được để trống',
        });
    }

    try {
        const result = await sendVerificationCode(email);
        return res.status(200).json(result);
    } catch (err) {
        return res.status(500).json({
            status: '(500) ERR',
            message: err.message || 'Đã xảy ra lỗi',
        });
    }
};

//
const verifyCodeController = async (req, res) => {
    const { email, code } = req.body.email; // Truy cập đúng vào trường 'email' và 'code' trong req.body

    console.log('req', req.body.email); // Để kiểm tra cấu trúc của req.body
    console.log('email:', email, 'code:', code); // Để kiểm tra giá trị email và code

    if (!email || !code) {
        return res.status(400).json({
            status: 'ERR',
            message: 'Email và mã xác thực không được để trống',
        });
    }

    try {
        //
        console.log("Mã xác thực và email đã được lấy", email);
        // Lấy mã xác thực đã lưu trong Redis cho email
        const savedCode = await getVerificationCodeForEmail(email);

        // So sánh mã người dùng nhập với mã đã lưu trong Redis
        if (savedCode === code) {
            return res.status(200).json({
                status: 'OK',
                message: 'Mã xác thực chính xác',
            });
        } else {
            return res.status(400).json({
                status: 'ERR',
                message: 'Mã xác thực không đúng',
            });
        }
    } catch (err) {
        return res.status(400).json({
            status: 'ERR',
            message: err.message || 'Mã xác thực không hợp lệ hoặc đã hết hạn',
        });
    }
};


module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
    refreshToken,
    logoutUser,
    deleteMany,
    resetPasswordController,
    //
    sendCodeController,
    verifyCodeController,

}