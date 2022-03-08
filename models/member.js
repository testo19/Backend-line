const mongoose = require('mongoose')
const Schema = mongoose.Schema
const memberSchema = new Schema({
    firstname: String,
    lastname: String,
    username: String,
    password: String,
    code:String,
    note:String,
    statusmember: String,


},
    { timestamps: true, versionKey: false }
)
const memberModel = mongoose.model('member', memberSchema)
module.exports = memberModel