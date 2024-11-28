const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const authMiddleware = (req, res, next) => {
    const token = req.headers.token?.split(' ')[1];
    const userId = req.params.id;
    if (!token) {
        return res.status(401).json({
            message: 'Thiếu token xác thực',
            status: 'ERROR'
        });
    }
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
        if (err) {
            return res.status(401).json({
                message: 'Xác thực thất bại',
                status: 'ERROR'
            });
        }
        if (user?.isAdmin || user?.id === userId) {
            next();
        } else {
            return res.status(403).json({
                message: 'Truy cập bị từ chối',
                status: 'ERROR'

            });
        }
    });
};

const authUserMiddleware = (req, res, next) => {

    const token = req.headers.token?.split(' ')[1];
    const userId = req.params.id;
    console.log('Userid của param', userId)

    if (!token) {
        return res.status(401).json({
            message: 'Thiếu token xác thực',
            status: 'ERROR'
        });
    }
    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
        if (err) {
            return res.status(401).json({
                message: 'Xác thực thất bại',
                status: 'ERROR'
            });
        } console.log('User', user)
        console.log("URL  trc User ID:", userId);
        if (user?.isAdmin) {
            next();

        } else if (user?.id === userId) {
            next();
        }

        else {

            return res.status(403).json({
                message: 'Truy cập bị từ chối',
                status: 'ERROR',
                reason: 'User is not admin and user ID does not match',
                req: req.params,
            });
        }

    });
};
exports.verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Không có token', status: 'ERROR' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token không hợp lệ', status: 'ERROR' });
        }
        req.user = user;
        next();
    });
};


module.exports = {
    authMiddleware,
    authUserMiddleware,

};
