const PDFDocument = require('pdfkit');

const generateInvoice = (order) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50 });
            let buffers = [];

            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                let pdfData = Buffer.concat(buffers);
                resolve(pdfData);
            });

            // Header
            doc
                .fillColor('#444444')
                .fontSize(20)
                .text(process.env.BUSINESS_NAME || 'GroceryMart', 50, 50)
                .fontSize(10)
                .text(process.env.BUSINESS_ADDRESS || '', 200, 50, { align: 'right', width: 350 })
                .text(`Phone: ${process.env.BUSINESS_PHONE || ''}`, 200, 75, { align: 'right' })
                .text(`Email: ${process.env.BUSINESS_EMAIL || ''}`, 200, 90, { align: 'right' })
                .moveDown();

            // Horizontal Line
            doc.strokeColor('#aaaaaa').lineWidth(1).moveTo(50, 100).lineTo(550, 100).stroke();

            // Invoice Info
            doc
                .fillColor('#444444')
                .fontSize(20)
                .text('Invoice', 50, 125);

            doc
                .fontSize(10)
                .text(`Order Number: ${order.orderNumber || order._id.toString().slice(-8).toUpperCase()}`, 50, 155)
                .text(`Order Date: ${new Date(order.createdAt).toLocaleDateString()}`, 50, 170)
                .text(`Total Amount: ${order.totalAmount.toFixed(2)}`, 50, 185)
                .moveDown();

            // Shipping Details
            const shipping = order.shippingAddress || {};
            doc
                .fontSize(12)
                .text('Shipping Details:', 50, 215, { bold: true })
                .fontSize(10)
                .text(order.user?.name || 'Customer', 50, 230)
                .text(shipping.street || '', 50, 245)
                .text(`${shipping.city || ''}, ${shipping.state || ''} ${shipping.pincode || ''}`, 50, 260)
                .text(`Phone: ${shipping.phone || ''}`, 50, 275)
                .moveDown();

            // Table Header
            const tableTop = 320;
            doc.fontSize(10);
            doc.text('Item', 50, tableTop);
            doc.text('Qty', 250, tableTop, { width: 50, align: 'right' });
            doc.text('Price', 340, tableTop, { width: 90, align: 'right' });
            doc.text('Total', 450, tableTop, { width: 90, align: 'right' });

            doc.strokeColor('#aaaaaa').lineWidth(1).moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

            // Table Items
            let i = 0;
            order.items.forEach((item) => {
                const y = tableTop + 30 + i * 25;
                doc.text(item.name, 50, y);
                doc.text(item.quantity.toString(), 250, y, { width: 50, align: 'right' });
                doc.text(item.price.toFixed(2), 340, y, { width: 90, align: 'right' });
                doc.text((item.price * item.quantity).toFixed(2), 450, y, { width: 90, align: 'right' });
                i++;
            });

            const tableBottom = tableTop + 30 + i * 25;
            doc.strokeColor('#aaaaaa').lineWidth(1).moveTo(50, tableBottom).lineTo(550, tableBottom).stroke();

            // Summary
            const summaryTop = tableBottom + 20;
            const subtotal = order.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

            doc.fontSize(10);
            doc.text('Subtotal:', 350, summaryTop, { width: 100, align: 'right' });
            doc.text(subtotal.toFixed(2), 450, summaryTop, { width: 90, align: 'right' });

            doc.text('Delivery Fee:', 350, summaryTop + 20, { width: 100, align: 'right' });
            doc.text(order.deliveryFee.toFixed(2), 450, summaryTop + 20, { width: 90, align: 'right' });

            doc.fontSize(12).text('Total:', 350, summaryTop + 45, { width: 100, align: 'right', bold: true });
            doc.text(order.totalAmount.toFixed(2), 450, summaryTop + 45, { width: 90, align: 'right', bold: true });

            // Footer
            doc
                .fontSize(10)
                .fillColor('#888888')
                .text('Thank you for shopping with GroceryMart!', 50, 700, { align: 'center', width: 500 });

            doc.end();
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = { generateInvoice };
