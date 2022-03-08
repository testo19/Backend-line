const line = require("@line/bot-sdk");
const express = require("express");
// const axios = require('axios').default
const dotenv = require("dotenv");

// ! mongo db
const Product = require("./models/product");
const Member = require("./models/member");
const Heal = require("./models/heal");
const Patient = require("./models/patient");
const Calendercase = require("./models/calendercase");
const Calenderdoc = require("./models/calenderdoc");

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/proj", { useNewUrlParser: true });
mongoose.connection.on("error", (err) => {
  console.error("MongoDB error", err);
});

const env = dotenv.config().parsed;
const app = express();
// console.log(env);

// ! line

const lineConfig = {
  channelAccessToken: env.ACCESS_TOKEN,
  channelSecret: env.SECRET_TOKEN,
};
const client = new line.Client(lineConfig);
app.post("/webhook", line.middleware(lineConfig), async (req, res) => {
  try {
    const events = req.body.events;
    console.log("event=>>>>", events);
    // return handleEvent(events[0])
    return events.length > 0 ? await events.map((item) => handleEvent(item))  : res.status(200).send("OK");
  } catch (error) {
    res.status(500).end();
  }
});
const handleEvent = async (event) => {

    const IDCardLen = event.message.text.length
    let content =''
    if(IDCardLen == 13){
        content = 'SUCCESS'
    }else{
        content= "โปรดกรอกเลขบัตรประชาชนอีกครั้งค่ะ"
    }


  // console.log(event);
//   const Patients = await Patient.find({
//       age:event.message.text
//   });
//   const pantient = Patients[0]

//   const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
//  const textToSend = `${pantient.firstname} ${pantient.lastname} ${new Date(pantient.birthday).toLocaleDateString(undefined, options)}`
  console.log(content);
  return client.replyMessage(event.replyToken, { type: "text", text: content });
};
app.listen(env.PORT || 4000, () => {
  console.log("listening on 4000");
});

//   ! api

app.get("/products", async (req, res) => {
  const products = await Product.find({});
  res.json(products);
  console.log(products);
});

app.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  res.json(product);
});

app.post("/products", async (req, res) => {
  const payload = req.body;
  const product = new Product(payload);
  await product.save();
  res.status(201).end();
});

app.put("/products/:id", async (req, res) => {
  const payload = req.body;
  const { id } = req.params;
  const product = await Product.findByIdAndUpdate(id, { $set: payload });
  res.json(product);
});

app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  await Product.findByIdAndDelete(id);
  res.status(204).end();
});

app.get("/members", async (req, res) => {
  const members = await Member.find({});
  res.json(members);
});

app.get("/members/:id", async (req, res) => {
  const { id } = req.params;
  const member = await Member.findById(id);
  res.json(member);
});

app.post("/members", (req, res) => {
  const payload = req.body;
  // const member = new Member(payload);
  Member.insertMany(payload, function (rs, err) {
    console.log(rs);
    if (rs) {
      res.json(rs);
    } else {
      res.status(204).end();
    }
  });
});

app.put("/members/:id", async (req, res) => {
  const payload = req.body;
  const { id } = req.params;
  const member = await Member.findByIdAndUpdate(id, { $set: payload });
  res.json(member);
});

app.delete("/members/:id", async (req, res) => {
  const { id } = req.params;
  await Member.findByIdAndDelete(id);
  res.status(204).end();
});

app.get("/heals", async (req, res) => {
  const heals = await Heal.find({});
  res.json(heals);
});

app.get("/heals/:id", async (req, res) => {
  const { id } = req.params;
  const heal = await Heal.findById(id);
  res.json(heal);
});

app.get("/healsByPatient/:id", async (req, res) => {
  const { id } = req.params;
  const idpat = {
    idpatient: id,
  };
  const heal = await Heal.find(idpat);
  res.json(heal);
});

app.post("/heals", async (req, res) => {
  const payload = req.body;
  const heal = new Heal(payload);
  await heal.save();
  res.status(201).end();
});

app.put("/heals/:id", async (req, res) => {
  const payload = req.body;
  const { id } = req.params;
  const heal = await Heal.findByIdAndUpdate(id, { $set: payload });
  res.json(heal);
});

app.delete("/heals/:id", async (req, res) => {
  const { id } = req.params;
  await Heal.findByIdAndDelete(id);
  res.status(204).end();
});

app.get("/patients", async (req, res) => {
  const patients = await Patient.find({});
  res.json(patients);
});

app.get("/patients/:id", async (req, res) => {
  const { id } = req.params;
  const patient = await Patient.findById(id);
  res.json(patient);
});

app.post("/patients", async (req, res) => {
  let BD = new Date(req.body.birthday);
  req.body.birthday = BD;
  const payload = req.body;
  const patient = new Patient(payload);
  await patient.save();
  res.status(201).end();
});

app.put("/patients/:id", async (req, res) => {
  const payload = req.body;
  const { id } = req.params;
  const patient = await Patient.findByIdAndUpdate(id, { $set: payload });
  res.json(patient);
});

app.delete("/patients/:id", async (req, res) => {
  const { id } = req.params;
  await Patient.findByIdAndDelete(id);
  res.status(204).end();
});

app.get("/calendercases", async (req, res) => {
  const calendercases = await Calendercase.find({});
  res.json(calendercases);
});

app.get("/calendercases/:id", async (req, res) => {
  const { id } = req.params;
  const calendercase = await Calendercase.findById(id);
  res.json(calendercase);
});

app.post("/calendercases", async (req, res) => {
  const payload = req.body;
  const calendercase = new Calendercase(payload);
  await calendercase.save();
  res.status(201).end();
});

app.put("/calendercases/:id", async (req, res) => {
  const payload = req.body;
  const { id } = req.params;
  const calendercase = await Calendercase.findByIdAndUpdate(id, {
    $set: payload,
  });
  res.json(calendercase);
});

app.delete("/calendercases/:id", async (req, res) => {
  const { id } = req.params;
  await Calendercase.findByIdAndDelete(id);
  res.status(204).end();
});

app.get("/calenderdocs", async (req, res) => {
  const calenderdocs = await Calenderdoc.find({});
  res.json(calenderdocs);
});

app.get("/calenderdocs/:id", async (req, res) => {
  const { id } = req.params;
  const calenderdoc = await Calenderdoc.findById(id);
  res.json(calenderdoc);
});

app.post("/calenderdocs", async (req, res) => {
  const payload = req.body;
  const calenderdoc = new Calenderdoc(payload);
  await calenderdoc.save();
  res.status(201).end();
});

app.put("/calenderdocs/:id", async (req, res) => {
  const payload = req.body;
  const { id } = req.params;
  const calenderdoc = await Calenderdoc.findByIdAndUpdate(id, {
    $set: payload,
  });
  res.json(calenderdoc);
});

app.delete("/calenderdocs/:id", async (req, res) => {
  const { id } = req.params;
  await Calenderdoc.findByIdAndDelete(id);
  res.status(204).end();
});
