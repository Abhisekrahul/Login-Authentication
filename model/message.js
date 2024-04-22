const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    tokens:[{token:String}],
});


//generating tokens
userSchema.methods.generateAuthToken  =  async function(){
    try {
        console.log(this._id);
        const token = jwt.sign({_id:this._id.toString()}, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token:token});
        // await this.save();
        return token;
    } catch (error) {
        // res.send("this is error"+ error);
        console.log("this is error"+ error);
    }
}
//Converting password into hash
userSchema.pre('save', async function(next){
    if(this.isModified("password")){
        console.log(`the current password is ${this.password}`);
        this.password = await bcrypt.hash(this.password,10);
        console.log(`the current password is ${this.password}`);
    }
    next();

})
const User = mongoose.model('registers', userSchema);
module.exports = User;