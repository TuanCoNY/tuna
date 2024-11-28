const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const validatePromotionData = (req, res, next) => {
    const { name, description, discountType, discountValue, startDate, endDate } = req.body;
    console.log('req', req.body)

    if (!name || !description || !discountType || discountValue == null || !startDate || !endDate) {
        return res.status(400).json({
            status: 'ERR',
            message: 'All fields are required!'
        });
    }
    next();
};
module.exports = {
    validatePromotionData,
}