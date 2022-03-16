const mongoose = require('mongoose')
const Schema = mongoose.Schema
const meetdateSchema = new Schema({
    firstname: String,
    lastname: String,
    pastsportid: String,
    meetdateperson:Date,
    namedoctor:String,

},
    { timestamps: true, versionKey: false }
)
const meetdateModel = mongoose.model('meetdate', meetdateSchema)
module.exports = meetdateModel