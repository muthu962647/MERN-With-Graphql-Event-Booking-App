const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../../models/user');


module.exports = {

    createUser: async (args) => {
        
        const {email, password} = args.userInput;

        const existUser = await User.findOne({email})
    
        if(existUser){
            throw new Error('User already exists');
        }
    
        const hashedPassword = await bcrypt.hash(password,12)
    
    
        const user = new User({
            email,
            password:hashedPassword
        });

        const result = await user.save()
        
        return result;
    },

    login: async(args) => {

        const {email, password} = args.Credentials

        const user = await User.findOne({email});

        if(!user){
            throw new Error('User does not exist');
        }

        const isEqual = await bcrypt.compare(password, user.password);

        if(!isEqual){
            throw new Error('Password is Incorrect')
        }

        const token = jwt.sign({userId: user.id, email: user.email, password: user.password}, 'somesupersecretkey', {expiresIn: '10h'} )

        return {
            userId: user._id,
            token,
            tokenExpiration: 10
        }
    }

}
