const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    contactImage:{ type: String },
    name:{type:String,require:true},
    primarynumber:{type:String,require:true},
    secondarynumber:{type:String},
    email:{type:String},
    address:{type:String},
    category:{type:String,require:true},
    creation_dt:{type:Date,require:true},
});

module.exports = schema;
