const line = require("@line/bot-sdk");
const express = require("express");
// const axios = require('axios').default
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const https = require("https");
// ! mongo db
const Product = require("./models/product");
const Member = require("./models/member");
const Heal = require("./models/heal");
const Patient = require("./models/patient");
const Calendercase = require("./models/calendercase");
const Calenderdoc = require("./models/calenderdoc");
const Meetdate = require("./models/meetdate");

const env = dotenv.config().parsed;
const app = express();

// ! connect cloud database
mongoose
  .connect("mongodb://localhost:27017/proj", {
    useNewUrlParser: true,
    useUnifiedTopology: false,
  })
  .then(() => console.log("database connected"))
  .catch((err) => console.log(err));

// ! middle ware
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cors());
// app.use(morgan("dev"));

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`start server in port ${port}`));

// const mongoose = require("mongoose");
// mongoose.connect("mongodb://localhost:27017/proj", { useNewUrlParser: true });
// mongoose.connection.on("error", (err) => {
//   console.error("MongoDB error", err);
// });

// console.log(env);
// app.use(express.json());

// const http = require('http');
// const requestListener = function (req, res) {
//   res.writeHead(200);
//   res.end('Hello, World!');
// }
// const server = http.createServer(requestListener);
// server.listen(4000);

// ! line



const lineConfig = {
  channelAccessToken: env.ACCESS_TOKEN,
  channelSecret: env.SECRET_TOKEN,
};
console.log(lineConfig);
// app.use(middleware(lineConfig))
// const client = new line.Client(lineConfig);
// app.use(bodyParser.json())
const client = new line.Client(lineConfig);
app.post("/webhook" ,async (req, res)=> {

  try {
    // res.send("HTTP POST request sent to the webhook URL!");
    // console.log(req.body.events);
   
    const event = req.body.events[0]

    // console.log(event.message.contentProvider);
   
    console.log(req.body);
    //การประกาศ object
    var msg = {
      type: 'text',
      text: '',
      wrap: true
  }
    
    
    
    // patient.length==13 ? msg.text = "คุณ "+ patient[0].firstname +" "+ patient[0].lastname +" มีนัดวัน " + events.toLocaleDateString('th-th', options) : msg.text ='กรุณากรอกเลขบัตรประชาชนให้ถูกต้อง'
  //  console.log(msg.text);
  if(event.message.text.length==13){

    const meetdatedata = await Meetdate.find({pastsportid:event.message.text})
   
    if(meetdatedata.length>0){
     // .reverse()
      const meetdate = meetdatedata.reverse();
      const date = new Date((meetdate[0].meetdateperson));
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const datehours = new Date((meetdate[0].meetdateperson));
      const datemins = new Date((meetdate[0].meetdateperson));
      console.log(meetdate);

      // console.log(date.toLocaleDateString('th-th', options));
      // console.log(meetdate);
     
     msg.text = " คุณ"+ meetdate[0].firstname +" "+ meetdate[0].lastname +"\n มีนัด " + date.toLocaleDateString('th-th', options) + "\n เวลา " + date.toLocaleTimeString('th-th') +" น."+"\n นพ."+meetdate[0].namedoctor
     
     client.replyMessage(event.replyToken, msg);
    }else{
      //การกำหนดค่า object
    msg.text= 'กรุณาพิมพ์เลขบัตรประชาชนให้ถูกต้อง'
    
    client.replyMessage(event.replyToken, msg);
    }

  }else{
    msg.text = 'กรุณาพิมพ์เลขบัตรประชาชน'
    client.replyMessage(event.replyToken, msg);


  }
 

  //  client.replyMessage(req.body.events[0].replyToken, msg);
  } catch (error) {
    console.log(error);
    
  }
  
})


//   ! api

app.get("/", async (req, res) => {
  res.send("ควย");
});
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

app.get("/meetdates", async (req, res) => {
  const meetdates = await Meetdate.find({});
  res.json(meetdates);
});

app.get("/meetdates/:id", async (req, res) => {
  const { id } = req.params;
  const meetdate = await Meetdate.findById(id);
  res.json(meetdate);
});

app.get("/meetdatesByPatient/:id", async (req, res) => {
  const { id } = req.params;
  const idpat = {
    idpatient: id,
  };
  const meetdate = await Meetdate.find(idpat);
  res.json(meetdate);
});

app.post("/meetdates", async (req, res) => {
  const payload = req.body;
  const meetdate = new Meetdate(payload);
  await meetdate.save();
  res.status(201).end();
});

app.put("/meetdates/:id", async (req, res) => {
  const payload = req.body;
  const { id } = req.params;
  const meetdate = await Meetdate.findByIdAndUpdate(id, { $set: payload });
  res.json(meetdate);
});

app.delete("/meetdates/:id", async (req, res) => {
  const { id } = req.params;
  await Meetdate.findByIdAndDelete(id);
  res.status(204).end();
});
