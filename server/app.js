require('dotenv').config(); // Load .env into environment variables

// SQL
const oracledb = require('oracledb');
const db_config = {
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    connectionString: 'localhost:1521/orcl'
}

// General purpose function to query the DB
async function queryDB(query, parameters, autoCommit) {
    let rows;
    let conn;
    try {
        conn = await oracledb.getConnection(db_config);
        result = await conn.execute(query, parameters || [], {outFormat: oracledb.OUT_FORMAT_OBJECT, autoCommit: autoCommit || false});
        rows = result.rows;
    } catch (err) {
        throw err;
    } finally {
        if (conn) {
            try {
                await conn.close();
                return rows;
            } catch (err) {
                console.log("Error closing DB connection", err);
            }
        }
    }
}

async function getAllProducts() {
    return await queryDB(`
        SELECT Product.product_id, Product.name, Product.type, Product.price, Manufacturer.name "MANUFACTURER_NAME" 
        FROM Manufacturer JOIN Product ON Manufacturer.manufacturer_id=Product.manufacturer_id
    `);
}

async function getProductsWithSimilarName(name) {
    return await queryDB(`
        SELECT Product.product_id, Product.name, Product.type, Product.price, Manufacturer.name "MANUFACTURER_NAME" 
        FROM Manufacturer JOIN Product ON Manufacturer.manufacturer_id=Product.manufacturer_id
        WHERE Product.name LIKE :name
    `, {name: '%' + name + '%'});
}

async function getProductInfo(id) {
    return await queryDB(`
        SELECT Product.name, Product.type, Product.price, Manufacturer.name "MANUFACTURER_NAME" 
        FROM Manufacturer JOIN Product ON Manufacturer.manufacturer_id=Product.manufacturer_id
        WHERE Product.product_id=:id
    `, {id: id});
}

async function getPurchaseHistory(email) {
    return await queryDB(`
        SELECT product_id, name, time, tracking_number, status
        FROM (
            SELECT * 
            FROM Sale 
            LEFT JOIN Online_Sales ON Sale.sale_id=Online_Sales.sale_id
            WHERE customer_id IN (SELECT customer_id FROM Customer WHERE email=:email)
        ) 
        NATURAL JOIN Product
    `, {email: email})
}

async function getCustomerInfo(email) {
    return await queryDB(`
        SELECT first_name, last_name, street, city, state, zip_code, card_num
        FROM Customer 
        WHERE email=:email
    `, {email: email});
}


async function getContract(email) {
    return await queryDB(`
        SELECT *
        FROM contract 
        WHERE customer_id = (SELECT customer_id FROM customer WHERE email=:email)
    `, {email: email});
}


// List of acceptable attribute names when updating customer info
const validInfoKeys = ['first_name', 'last_name', 'street', 'city', 'state', 'zip_code', 'card_num'];

async function updateCustomerInfo(email, data) {
    // Dynamically create the query based on what the customer wants to change
    let binds = {email: email};
    let query = "UPDATE Customer SET ";
    let sets = [];

    for(var key in data) {
        const value = data[key]
        if(validInfoKeys.includes(key)) {
            sets.push(key + "=:" + key);
            binds[key] = value;
        }
    }

    query += sets.join(", ");
    query += " WHERE email=:email";

    console.log(query, binds);

    return await queryDB(query, binds, true);
}

async function purchaseItem(email, id) {
    const trackingNum = Math.floor(Math.random() * 1000000);
    return await queryDB(`declare 
                                new_sale_id int;
                            begin
                                INSERT INTO Sale (sale_id, product_id, store_id, customer_id, time)
                                VALUES (NULL, :id, NULL, (SELECT customer_id FROM customer WHERE email=:email), CURRENT_TIMESTAMP) 
                                RETURNING sale_id INTO new_sale_id;
                                
                                INSERT INTO Online_Sales (sale_id, tracking_number, status)
                                VALUES (new_sale_id, :trackingNum, 'SHIPPING');
                            end;
    `, {email: email, id: id, trackingNum: trackingNum}, true);
}

async function createUser(email) {
    return await queryDB(`INSERT INTO customer(email) Values(:email)`, {email: email}, true);
}

// Server endpoints
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());

app.get('/', (req, res) => {
    res.send("Hello, world!");
    // TODO send built react file
});

app.get('/purchaseItem', (req, res) => {
    let email = req.query.email;
    let id = req.query.id;
    if(!email || !id) {
        res.sendStatus(400);
        return;
    }
    console.log(`Request from ${email} to purchase product ${id}`);
    purchaseItem(email, id).then(() => res.sendStatus(200));
});

app.get('/login', (req, res) => {
    let email = req.query.email;
    if(!email) {
        res.sendStatus(400);
        return;
    }
    console.log(`Request for login of customer with email ${email}`);
    createUser(email).then(() => res.sendStatus(200));
});

app.get('/getCustomerInfo', (req, res) => {
    let email = req.query.email;
    if(!email) { 
        res.sendStatus(400);
        return; 
    }
    console.log(`Request for info of customer with email ${email}`);
    getCustomerInfo(email).then(info => {
        res.json(info);
    });
});

app.get('/getContract', (req, res) => {
    let email = req.query.email;
    if(!email) { 
        res.sendStatus(400);
        return; 
    }
    console.log(`Request for contract for customer with email ${email}`);
    getContract(email).then(info => {
        res.json(info);
    });
});

app.get('/updateCustomerInfo', (req, res) => {
    let email = req.query.email;
    if(!email) { 
        res.sendStatus(400);
        return; 
    }
    console.log(`Request to update info of customer with email ${email}`);
    updateCustomerInfo(email, req.query).then(() => {
        res.sendStatus(200);
    })
});

app.get('/purchaseHistory', (req, res) => {
    let email = req.query.email;
    if(!email) {
        res.sendStatus(400);
        return;
    };
    console.log(`Request for purchase history of customer with email ${email}`);
    getPurchaseHistory(email).then(history => res.json(history));
});

app.get('/products', (req, res) => {
    let searchQuery = req.query.s;
    if(searchQuery) {
        // Search query --> Return products with name like the query
        console.log('Request for products like', searchQuery);
        getProductsWithSimilarName(searchQuery).then(products => res.json(products));
    } else {
        // No search query --> Return all products
        console.log('Request for all products');
        getAllProducts().then(products => res.json(products));
    }
});

app.get('/getProductInfo', (req, res) => {
    let id = req.query.id;
    if(!id) {
        res.sendStatus(400);
        return;
    }
    console.log('Request for info of product with id', id);
    getProductInfo(id).then(product => res.json(product));
})

// app.get('/stores', (req, res) => {
//     getStores().then(stores => res.json(stores));
// })

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Express server running on port ${port}`);
})
