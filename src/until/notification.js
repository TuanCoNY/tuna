const { io } = require('../index'); // Import đối tượng io từ index.js nơi bạn cấu hình WebSocket

const notifyOrderCancellation = (data) => {
    // Gửi thông báo tới tất cả admin đã kết nối qua WebSocket
    io.emit('order-cancellation', data); // 'order-cancellation' là event name
    console.log("Notification sent to admin:", data);
};

module.exports = { notifyOrderCancellation };
