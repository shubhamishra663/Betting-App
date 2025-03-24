const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    id:{
        type:String,
    },
    password:{
        type:String
    },
    coins:{
        type:Number,
        default:0,
    }
})


const UserModel=mongoose.model("user",userSchema);
module.exports=UserModel;