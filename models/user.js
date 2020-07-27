const mongoose= require("mongoose")
const passportlocalMongoose= require("passport-local-mongoose")

const userSchema= new mongoose.Schema({
    name: String,
    password: String
})
userSchema.plugin(passportlocalMongoose)
module.exports= mongoose.model("user", userSchema)
