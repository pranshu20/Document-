//import { ObjectID } from "bson";
const mongoose =require("mongoose");
//import { stringify } from "querystring";

const UserSchema = new mongoose.Schema({
	email: {
		type: String,
		//required: true,
        unique: true,
	},
    uuid:{
        type:String,

    },
    // password: {
    //     type: String,
    //     required: true,
    // },
    name:{
        type: String,
        //required: true,
    },
    shared:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'file',
    }],
    // edit: [{
    //     type: String,
    //     required: true,
    // }],
    MyFiles : [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'file',
    }]


});
const user = mongoose.model("user",UserSchema);
module.exports = user;
//export default mongoose.model("user", UserSchema);