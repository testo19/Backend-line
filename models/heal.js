const mongoose = require('mongoose')
const Schema = mongoose.Schema
const healSchema = new Schema({
    
    idpatient:String,
    firstname: String,
    lastname: String,
    namedoc: String,
    medicine: String,
    historyrestore: [],
    historyrestore2: [],
    healdate: Date,
    annotation: String,

},
    { timestamps: true, versionKey: false }
)
const healModel = mongoose.model('heal', healSchema)
module.exports = healModel