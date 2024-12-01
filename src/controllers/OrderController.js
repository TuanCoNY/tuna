const OrderService = require('../services/OrderService')

const createOrder = async (req, res) => {
    try {
        const { paymentMethod, itemsPrice, shippingPrice, totalPrice, fullName, address, city, phone } = req.body;
        if (
            paymentMethod == null || // Kiểm tra cả undefined và null
            itemsPrice == null ||
            shippingPrice == null || // Cho phép giá trị 0 hợp lệ
            totalPrice == null ||
            !fullName ||
            !address ||
            !city ||
            !phone
        ) {
            return res.status(200).json({
                status: 'ERR',
                message: 'sai ở đây'
            });
        }
        const response = await OrderService.createOrder(req.body);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(404).json({
            message: e,
        });
    }
};

const getAllOrderDetails = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const response = await OrderService.getAllOrderDetails(userId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e,
        })
    }
}
const getDetailsOrder = async (req, res) => {
    try {
        const orderId = req.params.id
        if (!orderId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The orderId is required'
            })
        }
        const response = await OrderService.getOrderDetails(orderId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e,
        })
    }
}

const cancelOrderDetails = async (req, res) => {
    try {
        const orderId = req.params.id
        const data = req.body
        if (!orderId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The orderId is required'
            })
        }
        const response = await OrderService.cancelOrderDetails(orderId, data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e,
        })
    }
}
// const cancelOrderDetails = async (req, res) => {
//     try {
//         const orderId = req.params.id;
//         const { orderItems } = req.body; // Lấy orderItems từ request body
//         console.log(orderId)

//         if (!orderId) {
//             return res.status(400).json({
//                 status: 'ERR',
//                 message: 'orderId là bắt buộc',
//             });
//         }

//         // Kiểm tra orderItems có phải là mảng không
//         if (!Array.isArray(orderItems)) {
//             return res.status(400).json({
//                 status: 'ERR',
//                 message: 'orderItems phải là mảng',
//             });
//         }

//         const response = await OrderService.cancelOrderDetails(orderId, orderItems);

//         return res.status(200).json(response);
//     } catch (e) {
//         return res.status(500).json({
//             status: 'ERR',
//             message: 'Đã có lỗi xảy ra khi hủy đơn hàng',
//             error: e.message || e,
//         });
//     }
// };



const getAllOrder = async (req, res) => {
    try {
        const data = await OrderService.getAllOrder()
        return res.status(200).json(data)
    } catch (e) {
        return res.status(404).json({
            message: e,
        })
    }
}
const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params; // Lấy `orderId` từ URL
        const { status } = req.body; // Lấy `status` từ body request

        // Kiểm tra trạng thái hợp lệ
        const validStatuses = ['Đã giao', 'Xác nhận hủy', 'Hủy đơn', 'Đang xử lý'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Invalid status value',
            });
        }

        // Gọi service để cập nhật trạng thái đơn hàng
        const result = await OrderService.updateOrderStatus(id, status);

        // Trả về kết quả từ service
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({
            status: 'ERR',
            message: error.message,
        });
    }
};
//
const deleteManyOrders = async (req, res) => {
    try {
        const { orderIds } = req.body; // Lấy danh sách ID từ request body
        console.log('orderIds', orderIds)
        if (!orderIds || !Array.isArray(orderIds)) {
            return res.status(400).json({
                status: 'ERR',
                message: 'orderIds phải là một mảng.',
            });
        }

        const response = await OrderService.deleteManyOrders(orderIds);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({
            status: 'ERR',
            message: 'Đã xảy ra lỗi khi xóa đơn hàng.',
            error: e.message,
        });
    }
};
const markOrderAsReceived = async (req, res) => {
    try {
        const { orderId } = req.params; // Lấy orderId từ tham số URL

        if (!orderId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'Order ID is required'
            });
        }

        // Gọi service để cập nhật trạng thái đơn hàng
        const response = await OrderService.markOrderAsReceived(orderId);

        return res.status(200).json(response);
    } catch (e) {
        return res.status(500).json({
            message: e.message || e,
        });
    }
};



module.exports = {
    createOrder,
    getAllOrderDetails,
    getDetailsOrder,
    cancelOrderDetails,
    getAllOrder,
    updateOrderStatus,
    deleteManyOrders,
    markOrderAsReceived,
}