const mongoose=require("mongoose");

const fileSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	path: {
		type: String,
		required: true,
	},
    

});

const file = mongoose.model("file",fileSchema);
module.exports = file;