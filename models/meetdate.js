const mongoose = require('mongoose')
const Schema = mongoose.Schema
const meetdateSchema = new Schema({
    firstname: String,
    lastname: String,
    gender: String,
    pastsportid: String,
    birthday: Date,
    age: String,
    address: String,
    disease: String,
    drugAllergy: String,
    phonenumber: String,
    annotation: String,
    statuscase: Number,
    meetdateperson:Date,

},
    { timestamps: true, versionKey: false }
)
const meetdateModel = mongoose.model('meetdate', meetdateSchema)
module.exports = meetdateModel