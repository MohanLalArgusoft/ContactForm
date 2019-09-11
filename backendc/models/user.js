const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    username:{type:String,require:true},
    number:{type:String,require:true},
    password:{type:String,require:true},
    creation_dt:{type:Date,require:true},
    categorylist:{type:Array, default:["Friends",
    "Family Members",
    "Business",
    "Others",]}
});

module.exports = mongoose.model('User',schema);