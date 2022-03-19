const mongoose = require('mongoose')
const Schema = mongoose.Schema
const patientSchema = new Schema({
    no: String,
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

},
    { timestamps: true, versionKey: false }
)
const patientModel = mongoose.model('patient', patientSchema)
module.exports = patientModel