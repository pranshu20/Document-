const mongoose=require("mongoose");

const fileSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
	},
	views: [{
		type: String,
		required: true,
	}],
    
    File: {
        type: String,
        required: true,
    }

});

const file = mongoose.model("file",fileSchema);
module.exports = file;