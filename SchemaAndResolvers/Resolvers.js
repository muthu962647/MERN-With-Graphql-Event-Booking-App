const bcrypt = require('bcryptjs');

const Event = require('../models/event');
const User = require('../models/user');

const event = (eventIds) => {
    // console.log(eventIds);
    return Event.find({_id: { $in : eventIds}})
    .then(events => {
        return events.map(event => {
            console.log({...event});
            return {
                ...event._doc,
                creator: user.bind(this, event.creator)
            }
        })
    })
} 

const user = (userId) => {
    return User.findById(userId)
    .then(user => {
        // console.log({...user._doc},"Hey", {...user}, "123",user);
        // console.log(user._doc.createdEvents)
        return {...user._doc , createdEvents: event.bind(this,user._doc.createdEvents )}
        return user
    })
    .catch(err => {
        throw err;
    })
}


const rootValue = {

    events: async() => {
        return Event.find()
        .populate('creator')
        .then(events => {
            console.log("2")
            return events.map(event => {
                // console.log("hEYYY ",{
                //        ...event._doc.creator._doc
                //    },"End"
                //  );
                return {...event._doc,
                     _id: event._doc._id.toString(),
                    creator: user.bind(this, event._doc.creator._doc._id )
                 }
            })
        })
        .catch(err => {
            throw err;
        })
    },



    // ________________________________  *** Mutations  *** _______________________________________ 




    createEvent: args => {
        const { title, description, price, date } = args.eventInput;

        const event = new Event({
            title,
            description,
            price,
            date,
            creator: '65b63f037e640047b3ede24a'
        });

        let createdEvent;

        return event.save()
        .then(result => {
            createdEvent = {...result._doc, creator: user.bind(this, result._doc.creator)};
            return User.findById('65b63f037e640047b3ede24a')
        })
        .then(user =>{

            if(!user){
                 throw new Error("No user")
            }

            user.createdEvents.push(event);
            return user.save();

        })
        .then(result => {
            console.log(createdEvent);
            return createdEvent;
        })
        .catch(err => {
            console.log(err);
            throw err;
        }) 
    },

    createUser: args => {
        const {email, password} = args.userInput;

        return User.findOne({email})
        .then(email =>{
            if(email){
                throw new Error('User already exists');
            }
            return bcrypt.hash(password,12)
        })
        .then(hashedPassword => {
            console.log(hashedPassword);
            const user = new User({
                email,
                password:hashedPassword
            });

            return user.save()
            .then(user => {
                return {...user._doc, password: null};
            })
            .catch(err => {
                console.log(`"Error in createUserMutation ${err}`);
                throw err;
            })
        })
        

    }
};


module.exports = {rootValue};