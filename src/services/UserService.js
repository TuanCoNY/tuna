const User = require("../models/UserModel")
const bcrypt = require("bcryptjs");
const { genneralAccessToken, genneralRefreshToken } = require("./JwtService")

const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const { name, email, password, phone } = newUser;

        try {
            const checkUser = await User.findOne({ email: email });
            if (checkUser) {
                reject({
                    status: 'ERR',
                    message: 'Email already exists.'
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


module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
    deleteManyUser

}