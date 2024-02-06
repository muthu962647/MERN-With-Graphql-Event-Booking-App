const {transformEvent, user } = require('./merge')

const Event = require('../../models/event');
const User = require('../../models/user');
const { dateToString } = require('../../helpers/date')


module.exports = {

    events: async () => {
        try {
            const events = await Event.find();
    
            return events.map(event => {
                return transformEvent(event);
            }
                );
        } catch (error) {
            console.error(error);
            throw error; 
        }
    },



    // ________________________________  *** Mutations  *** _______________________________________ 


    createEvent: async( args , req)=> {

        // if(!req.isAuth){
        //     throw new Error('Unauthenticated');
        // }

        const { title, description, price, date } = args.eventInput;

        const event = new Event({
            title,
            description,
            price,
            date,
            creator: req.userId
        });

        const result = await event.save()
        
        const creator =  await User.findById(req.userId)

        if(!creator){
                throw new Error("No user")
        }

        creator.createdEvents.push(event);
        await creator.save();

        createdEvent = {
            ...result._doc,
            date: dateToString(event.date),
            creator: user(result._doc.creator)
        };

        return createdEvent;

        }
};

