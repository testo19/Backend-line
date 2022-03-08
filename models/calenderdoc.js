const mongoose = require('mongoose')
const Schema = mongoose.Schema
const calenderdocSchema = new Schema({
   firstname: String,
   lastname: String,
   datedoc: String,
   secton: String,

},
    { timestamps: true, versionKey: false }
)
const calenderdocModel = mongoose.model('calenderdoc', calenderdocSchema)
module.exports = calenderdocModel