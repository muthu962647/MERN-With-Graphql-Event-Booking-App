const Event = require('../../models/event');
const User = require('../../models/user');
const { dateToString } = require('../../helpers/date')
const DataLoader = require('dataloader')

const eventLoader = new DataLoader((eventId) => {
    return event(eventId)
})

const userLoader = new DataLoader(userIds => {
    return User.find({_id: {$userIds}})
})


const transformEvent = event => {
   
    return {
        ...event._doc,
        date: dateToString(event.date),
        creator: user.bind(this, event.creator)
    }
};


const transformBooking = booking =>{

    const userId = booking._doc.user;
  

    return {
        ...booking._doc,
        user: user.bind(this, userId),
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
        throw new Error("Can't Find the User")
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