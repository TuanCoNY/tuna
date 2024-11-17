const nodemailer = require("nodemailer");

const sendEmailCreateOrder = async (email, orderItems) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // true for port 465, false for other ports
            auth: {
                user: "anhtuanhyehye2002@gmail.com", // Thay bằng email hợp lệ
                pass: "wmqvfqywlpszagho", // Mật khẩu ứng dụng
            },
        });
        let listItem = ''
        const attachImage = []
        orderItems.forEach((order) => {
            listItem += `<div><div>Bạn đã đặt sản phẩm <b> ${order.name} </b> với số lượng: <b> ${order.amount}</b> và giá là: <b>${order.price} VNĐ </b></div>
            <div> <img src = ${order.image} alt ="sản phẩm"/> </div>
            </div>`
            attachImage.push({ path: order.image })
        })


        // Gửi email
        const info = await transporter.sendMail({
            from: '"Your Shop" <anhtuanhyehye2002@gmail.com>', // Địa chỉ gửi
            to: "anhtuanhyehye2002@gmail.com", // Địa chỉ nhận
            subject: "Bạn đã đặt hàng tại shop tuna", // Tiêu đề
            text: "Đơn hàng mới đã được tạo!", // Nội dung dạng plain text
            html: `<div><b> Cảm ơn bạn đã đặt hàng tại shop</b></div> ${listItem}`, // Nội dung dạng HTML
            attachments: attachImage
        });

        return { success: true, messageId: info.messageId };
    } catch (error) {
        return { success: false, error };
    }
};

module.exports = {
    sendEmailCreateOrder,
};
