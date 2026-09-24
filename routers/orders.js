var express = require('express');
var router = express.Router();
var orders_Model = require('../app/Schema/orders');
var Customers_Model = require('../app/Schema/customer');
var Products_Model = require('../app/Schema/products')
router.post('/insert', async (req, res) => {
    const customers = await Customers_Model.find();
    const products = await Products_Model.find();

    console.log("Customers:", customers.length);
    console.log("Products:", products.length);

    const orders = [];

    for (let i = 21; i < 50; i++) {
        const customer = customers[i % customers.length];
        const product = products[i % products.length];

        const quantity = (i % 3) + 1;

        const totalAmount = product.price * quantity;

        orders.push({
            customerEmail: customer.email,
            productId: product._id,
            productName: product.name,
            quantity,
            price: product.price,
            totalAmount,
            status:
                i % 4 === 0
                    ? "pending"
                    : i % 4 === 1
                        ? "confirmed"
                        : i % 4 === 2
                            ? "shipped"
                            : "delivered"
        });
    }

    var ordersInsert = await orders_Model.insertMany(orders);

    console.log(`${orders.length} orders inserted successfully`);

    return res.status(200).json({ message: "orders inserted successfully", data: ordersInsert })
})


module.exports = router;