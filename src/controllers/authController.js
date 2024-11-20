const authService = require('../services/authService');

exports.forgotPassword = async (req, res) => {
    try {
        const result = await authService.forgotPassword(req.body.email);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message, status: 'ERROR' });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const result = await authService.resetPassword(req.params.token, req.body.newPassword);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message, status: 'ERROR' });
    }
};
