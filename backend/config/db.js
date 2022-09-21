const mongoose = require('mongoose');
function connectDB() {
    mongoose.connect('mongodb+srv://sagaradgotra:hacknroll@cluster0.uphcme6.mongodb.net/?retryWrites=true&w=majority');

    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", () => {
        console.log("Database connected");
    });
}

module.exports = connectDB;