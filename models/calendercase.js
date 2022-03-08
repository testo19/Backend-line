const mongoose = require('mongoose')
const Schema = mongoose.Schema
const calendercaseSchema = new Schema({
    firstname: String,
    lastname: String,
    appointmenttime: String,
    doingwhat: String,
    doctorname: String,
},
    { timestamps: true, versionKey: false }
)
const calendercaseModel = mongoose.model('calendercase', calendercaseSchema)
module.exports = calendercaseModel