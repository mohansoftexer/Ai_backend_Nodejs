var express = require('express');
var httperror = require('http-errors');
var path = require('path');
var morgan = require('morgan');
var http = require('http');
var cookieParser = require('cookie-parser');
var cors = require('cors')
var app = express();
app.use(express.json());
var server = http.createServer(app);
var indexRouter = require('./routers/index');
var customersRouter = require('./routers/customers');
var ProductRouter = require('./routers/Product');
var ordersRouter = require('./routers/orders')

app.use('/customers', customersRouter);
app.use('/product',ProductRouter);
app.use('/orders',ordersRouter)
app.use('', indexRouter);
config = require('dotenv').config();


app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    next(httperror(404, 'Not Found'))
});
app.use(cookieParser())
app.use(morgan('dev'));
app.use(cors({ origin: true }));



server.listen(3000, function () {
    console.log('Server is running on port 3000');
})
