const Event = require('../../models/event');
const User = require('../../models/user');
const { dateToString } = require('../../helpers/date')


const transformEvent = event => {
    return {
        ...event._doc,
        date: dateToString(event.date),
        creator: user.bind(this, event.creator)
    }
};

const transformBooking = booking =>{
    return {
        ...booking._doc,
        user: user.bind(this, booking._doc.user),
        event: singleEvent.bind(this, booking._doc.event),
        createdAt: dateToString(booking._doc.createdAt),
        updatedAt: dateToString(booking._doc.updatedAt)
    }
} 

// ________________________________*** Transform***___________

const event = async (eventIds) => {
    try{

        const events = await Event.find({_id: { $in : eventIds}})
        
        return  events.map(event => {
            
            return transformEvent(event);

        });

    }catch(err){

        throw err
    }
 

} 

const user = async (userId) => {

    try{

        const user = await User.findById(userId);

        return {...user._doc , createdEvents: event.bind(this,user._doc.createdEvents )}
    

    }catch(err){
        throw err
    }
    
}

const singleEvent = async (eventId) =>{
    try{
        const event = await Event.findById(eventId);

        return transformEvent(event);
    }
    catch(err){
        throw err;
    }
}


module.exports = {
    singleEvent,
    user,
    event,
    transformBooking,
    transformEvent
}