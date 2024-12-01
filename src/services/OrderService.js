const Order = require("../models/OrderProduct")
const Product = require("../models/ProductModel")
const EmailService = require("../services/EmailService")


const createOrder = (newOrder) => {
    return new Promise(async (resolve, reject) => {
        const { orderItems, paymentMethod, itemsPrice, shippingPrice, totalPrice, fullName, address, city, phone, user, isPaid, paidAt, email } = newOrder;
        try {
            // Kiểm tra tính hợp lệ của tất cả sản phẩm trong orderItems
            const promises = orderItems.map(async (order) => {
                const productData = await Product.findOneAndUpdate(
                    {
                        _id: order.product,
                        countInStock: { $gte: order.amount }
                    },
                    {
                        $inc: {
                            countInStock: -order.amount,
                            selled: +order.amount
                        }
                    },
                    { new: true }
                );

                if (productData) {
                    return {
                        status: 'OK',
                        message: 'SUCCESS'
                    }
                }
                else {
                    return {
                        status: 'OK',
                        message: 'ERR',
                        id: order.product
                    }
                }
            })
            const results = await Promise.all(promises)
            const newData = results && results.filter((item) => item.id)
            if (newData.length) {
                const arrId = []
                newData.forEach((item) => {
                    arrId.push(item.id)
                })
                resolve({
                    status: 'ERR',
                    message: `Sản phẩm với id ${arrId.join(',')} không đủ hàng`
                })
            } else {
                const createOrder = await Order.create({
                    orderItems,
                    shippingAddress: {
                        fullName,
                        address,
                        city,
                        phone
                    },
                    paymentMethod,
                    itemsPrice,
                    shippingPrice,
                    totalPrice,
                    user: user,
                    isPaid,
                    paidAt
                })
                if (createOrder) {
                    await EmailService.sendEmailCreateOrder(email, orderItems)
                    return resolve({
                        status: 'OK',
                        message: 'Success'
                    })
                }
            }
        } catch (e) {
            reject(e)
        }
    })
}


const getAllOrderDetails = (id) => {
    return new Promise(async (resolve, reject) => {

        try {
            const order = await Order.find({
                user: id
            })
            if (order === null) {
                resolve({
                    status: 'OK',
                    message: 'The order is not defined'
                })
            }
            resolve({
                status: 'OK',
                message: 'Successs',
                data: order

            })
        } catch (e) {
            reject(e)
        }
    })
}
const getOrderDetails = (id) => {
    return new Promise(async (resolve, reject) => {

        try {
            const order = await Order.findById({
                _id: id
            })
            if (order === null) {
                resolve({
                    status: 'OK',
                    message: 'The order is not defined'
                })
            }
            resolve({
                status: 'OK',
                message: 'Successs',
                data: order

            })
        } catch (e) {
            reject(e)
        }
    })
}

const cancelOrderDetails = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let order = []
            const promises = data.map(async (order) => {
                const productData = await Product.findOneAndUpdate({
                    _id: order.product,
                    selled: { $gte: order.amount }
                },
                    {
                        $inc: {
                            countInStock: +order.amount,
                            selled: -order.amount
                        }
                    },
                    { new: true }
                )
                if (productData) {
                    order = await Order.findByIdAndDelete(id)
                    if (order === null) {
                        resolve({
                            status: 'ERR',
                            message: 'The order is not defined'
                        })
                    }
                } else {
                    return ({
                        status: 'OK',
                        message: 'ERR',
                        id: order.product
                    })
                }
            })
            const results = await Promise.all(promises)
            const newData = results && results.filter((item) => item)
            if (newData.length) {
                resolve({
                    status: 'ERR',
                    message: `Sản phẩm với id${newData.join(',')} không tồn tại`
                })
            }
            resolve({
                status: 'OK',
                message: 'Success',
                data: order
            })
        } catch (e) {
            reject(e)
        }
    })
}
// const cancelOrderDetails = (id, data) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             if (!Array.isArray(data)) {
//                 return reject(new Error('Dữ liệu không hợp lệ, yêu cầu là mảng'));
//             }

//             // Kiểm tra các sản phẩm trong đơn hàng
//             const results = await Promise.all(data.map(async (orderData) => {
//                 const productData = await Product.findOneAndUpdate(
//                     { _id: orderData.product, selled: { $gte: orderData.amount } },
//                     { $inc: { countInStock: +orderData.amount, selled: -orderData.amount } },
//                     { new: true }
//                 );

//                 if (!productData) {
//                     return { status: 'ERR', message: 'Sản phẩm không tồn tại', id: orderData.product };
//                 }

//                 return null;
//             }));

//             const errors = results.filter(result => result);
//             if (errors.length > 0) {
//                 return resolve({
//                     status: 'ERR',
//                     message: `Lỗi với các sản phẩm ID: ${errors.map(e => e.id).join(', ')}`,
//                 });
//             }

//             // Cập nhật trạng thái đơn hàng thành "Chờ xác nhận hủy"
//             const order = await Order.findById(id);
//             if (!order) {
//                 return resolve({
//                     status: 'ERR',
//                     message: 'Đơn hàng không tồn tại',
//                 });
//             }

//             // Cập nhật trạng thái đơn hàng
//             order.status = 'Chờ xác nhận hủy'; // Trạng thái mới
//             await order.save();

//             resolve({
//                 status: 'OK',
//                 message: 'Đơn hàng đã được yêu cầu hủy, chờ xác nhận từ admin',
//                 data: order,
//             });
//         } catch (e) {
//             reject(e);
//         }
//     });
// };


const getAllOrder = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allOrder = await Order.find()
            resolve({
                status: 'OK',
                message: 'Success',
                data: allOrder
            })
        } catch (e) {
            reject(e)
        }
    })
}
const updateOrderStatus = async (id, status) => {
    try {
        // Cập nhật trạng thái cho đơn hàng
        const order = await Order.findByIdAndUpdate(
            id,
            { status },
            { new: true } // Trả về bản ghi mới sau khi cập nhật
        );

        // Kiểm tra nếu đơn hàng không tồn tại
        if (!order) {
            throw new Error('Order not found');
        }

        return {
            status: 'OK',
            message: 'Order status updated successfully',
            data: order,
        };
    } catch (error) {
        throw new Error(error.message);
    }
};
//
const deleteManyOrders = async (orderIds) => {
    try {
        // Xóa nhiều đơn hàng dựa trên danh sách ID
        const result = await Order.deleteMany({ _id: { $in: orderIds } });

        // Kiểm tra xem có đơn hàng nào bị xóa không
        if (result.deletedCount === 0) {
            return {
                status: 'ERR',
                message: 'Không tìm thấy đơn hàng nào để xóa.',
            };
        }

        return {
            status: 'OK',
            message: 'Đã xóa thành công các đơn hàng.',
            data: result, // Trả về thông tin kết quả
        };
    } catch (e) {
        throw new Error('Lỗi khi xóa đơn hàng: ' + e.message);
    }
};
const markOrderAsReceived = async (orderId) => {
    try {
        // Tìm đơn hàng theo orderId
        const order = await Order.findById(orderId);

        if (!order) {
            throw new Error('Order not found');
        }

        // Cập nhật trạng thái của đơn hàng
        order.status = 'Đã giao';
        order.deliveredAt = new Date(); // Ghi nhận thời gian giao hàng

        // Lưu lại thay đổi vào cơ sở dữ liệu
        await order.save();

        return {
            status: 'SUCCESS',
            message: 'Order marked as received',
            order,
        };
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    createOrder,
    getAllOrderDetails,
    getOrderDetails,
    cancelOrderDetails,
    getAllOrder,
    updateOrderStatus,
    deleteManyOrders,
    markOrderAsReceived,
}