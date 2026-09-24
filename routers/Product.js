var express = require('express');
var router = express.Router();
var Product_Model = require('../app/Schema/products');
router.post('/insert', async (req, res) => {
    try {
        const products = [];

        for (let i = 1; i <= 50; i++) {
            products.push({
                name: `Product ${i}`,
                category: i % 2 === 0 ? "Electronics" : "Accessories",
                price: 1000 + i * 500,
                stock: 10 + i,
                companyName: `Company ${i}`
            });
        }

        var insertProductData = await Product_Model.insertMany(products);
        return res.status(200).json({ message: "Products inserted successfully", data: insertProductData })
    } catch (error) {
        return res.json({ response: 0, message: error })
    }

})


module.exports = router;