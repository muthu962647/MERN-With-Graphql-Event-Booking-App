// const bcrypt = require('bcryptjs');

// const Event = require('../../models/event');
// const User = require('../../models/user');
// const Booking =require('../../models/booking');
// const { dateToString } = require('../../helpers/date')

const  authResolvers  = require('./auth');
const  bookingResolvers  = require('./booking');
const  eventResolvers  = require('./events')

// console.log({...bookingResolvers});

const rootValue = {
    ...authResolvers,
    ...bookingResolvers,
    ...eventResolvers
}

// const transformEvent = event => {
//     return {
//         ...event._doc,
//         date: dateToString(event.date),
//         creator: user.bind(this, event.creator)
//     }
// };

// const transformBooking = booking =>{
//     return {
//         ...booking._doc,
//         user: user.bind(this, booking._doc.user),
//         event: singleEvent.bind(this, booking._doc.event),
//         createdAt: dateToString(booking._doc.createdAt),
//         updatedAt: dateToString(booking._doc.updatedAt)
//     }
// } 

// // ________________________________*** Transform***___________

// const event = async (eventIds) => {
//     try{

//         const events = await Event.find({_id: { $in : eventIds}})
        
//         return  events.map(event => {
            
//             return transformEvent(event);

//         });

//     }catch(err){

//         throw err
//     }
 

// } 

// const user = async (userId) => {

//     try{

//         const user = await User.findById(userId);

//         return {...user._doc , createdEvents: event.bind(this,user._doc.createdEvents )}
    

//     }catch(err){
//         throw err
//     }
    
// }

// const singleEvent = async (eventId) =>{
//     try{
//         const event = await Event.findById(eventId);

//         return transformEvent(event);
//     }
//     catch(err){
//         throw err;
//     }
// }


// // ____________________________________*** Query ***________________________



// const rootValue = {

//     events: async () => {
//         try {
//             const events = await Event.find();
    
//             return events.map(event => {
//                 return transformEvent(event);
//             }
//                 );
//         } catch (error) {
//             console.error(error);
//             throw error; 
//         }
//     },

//     bookings: async() => {
//         try{

//             const bookings = await Booking.find();

//             return bookings.map(booking => (transformBooking(booking)))

//         }catch(err) {
//             throw err
//         }
//     },



//     // ________________________________  *** Mutations  *** _______________________________________ 


//     createEvent: async( args )=> {

//         const { title, description, price, date } = args.eventInput;

//         const event = new Event({
//             title,
//             description,
//             price,
//             date,
//             creator: '65b63f037e640047b3ede24a'
//         });

//         const result = await event.save()
        
//         const creator =  await User.findById('65b63f037e640047b3ede24a')

//         if(!creator){
//                 throw new Error("No user")
//         }

//         creator.createdEvents.push(event);
//         await creator.save();

//         createdEvent = {
//             ...result._doc,
//             date: dateToString(event.date),
//             creator: user(result._doc.creator)
//         };

//         return createdEvent;

//         },

//     createUser: async (args) => {

//             const {email, password} = args.userInput;

//             const existUser = await User.findOne({email})
        
//             if(existUser){
//                 throw new Error('User already exists');
//             }
        
//             const hashedPassword = await bcrypt.hash(password,12)
        
        
//             const user = new User({
//                 email,
//                 password:hashedPassword
//             });

//             const result = await user.save()
            
//             return result;
//     },

//     bookEvent: async (args) => {

//         const fetchedEvent = await Event.findOne({ _id: args.eventId})        
//         const booking = new Booking({
//             user: '65b63f037e640047b3ede24a',
//             event: fetchedEvent
//         });

//         const result = await booking.save();

//         return {...result._doc  }
//     } ,

//     cancelBooking: async (args) => {

//         try{

//             const booking = await Booking.findById(args.bookingId).populate('event');

//             if(!booking){
//                 throw new Error("The booking event may be already deleted or the id you provided is invalid");
//             }

//             const event = transformEvent(booking.event);

//             await booking.deleteOne({_id: args.bookingId})
                       
//             return event;

//         }
//         catch(err){
//             throw err
//         }

//     }
// };


module.exports = {rootValue};