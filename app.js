const fs = require("fs");
const express = require("express");

const app = express();
const PORT = 9000;

// middleware untuk membaca json dari request body ke kita
app.use(express.json());

// read file json
const customers = JSON.parse(fs.readFileSync(`${__dirname}/data/dummy.json`));

const defaultRouter = (req, res, next) => {
  res.send("<p>Hello fsw 1 tercinta</p>");
};

const getCustomers = (req, res, next) => {
  res.status(200).json({
    status: "success",
    totalData: customers.length,
    data: {
      customers,
    },
  });
};

const getCustomersById = (req, res, next) => {
  const id = req.params.id;

  console.log(req.params);
  console.log(req.params.id);

  // menggunakan array method untuk membantu menemukan spesifik data
  const customer = customers.find((cust) => cust._id === id);

  res.status(200).json({
    status: "success",
    totalData: customers.length,
    data: {
      customer,
    },
  });
};

const updateCustomer = (req, res) => {
  const id = req.params.id;

  // 1. melakukan pencarian data yang sesuai parameter id nya
  const customer = customers.find((cust) => cust._id === id);
  const customerIndex = customers.findIndex((cust) => cust._id === id);

  console.log(!customer);

  // 2. ada ga data customernya
  if (!customer) {
    return res.status(404).json({
      status: "fail",
      message: `customer dengan ID : ${id} ga ada`,
    });
  }

  // 3. kalau ada, berarti update data sesuai request body dari client/user
  // object assign = menggabungkan objek or spread operator
  customers[customerIndex] = { ...customers[customerIndex], ...req.body };

  // 4. melakukan update di dokumen json
  fs.writeFile(
    `${__dirname}/data/dummy.json`,
    JSON.stringify(customers),
    (err) => {
      res.status(200).json({
        status: "success",
        message: "berhasil update data",
      });
    }
  );
};

const deleteCustomer = (req, res) => {
  const id = req.params.id;

  // 1. melakukan pencarian data yang sesuai parameter id nya
  const customer = customers.find((cust) => cust._id === id);
  const customerIndex = customers.findIndex((cust) => cust._id === id);

  console.log(!customer);

  // 2. ada ga data customernya
  if (!customer) {
    return res.status(404).json({
      status: "fail",
      message: `customer dengan ID : ${id} ga ada`,
    });
  }

  // 3. kalau ada, berarti delete data
  customers.splice(customerIndex, 1);

  // 4. melakukan update di dokumen json
  fs.writeFile(
    `${__dirname}/data/dummy.json`,
    JSON.stringify(customers),
    (err) => {
      res.status(200).json({
        status: "success",
        message: "berhasil delete data",
      });
    }
  );
};

const createCustomer = (req, res) => {
  console.log(req.body);

  const newCustomer = req.body;

  customers.push(newCustomer);

  fs.writeFile(
    `${__dirname}/data/dummy.json`,
    JSON.stringify(customers),
    (err) => {
      res.status(201).json({
        status: "success",
        data: {
          customer: newCustomer,
        },
      });
    }
  );

  res.send("oke udah");
};

// localhost:8000
app.get("/", defaultRouter);

app.route("/api/v1/customers").get(getCustomers).post(createCustomer);

app
  .route("/api/v1/customers/:id")
  .get(getCustomersById)
  .patch(updateCustomer)
  .delete(deleteCustomer);

app.listen(PORT, () => {
  console.log(`APP running on port : ${PORT}`);
});
