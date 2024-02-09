const { transformBooking , transformEvent} = require("./merge")
const Event = require('../../models/event');
const Booking =require('../../models/booking');

module.exports ={


    bookings: async(args,req) => {

        // if(!req.isAuth){
        //     throw new Error('Unauthenticated');
        // }

        try{

            const bookings = await Booking.find();

            return bookings.map(booking => (transformBooking(booking)))

        }catch(err) {
            throw err
        }
    },

    // ________________________________  *** Mutations  *** _______________________________________ 


    bookEvent: async (args, req) => {

        
        if(!req.isAuth){
            throw new Error('Unauthenticated');
        }

        const fetchedEvent = await Event.findOne({ _id: args.eventId})        
        const booking = new Booking({
            user: '65bf258a34dd9e38be84780a',
            event: fetchedEvent
        });

        const result = await booking.save();

        return {...result._doc  }
    } ,

    cancelBooking: async (args, req) => {

        
        if(!req.isAuth){
            throw new Error('Unauthenticated');
        }

        try{

            console.log(args.bookingId);

            const booking = await Booking.findById(args.bookingId).populate('event');

            if(!booking){
                throw new Error("The booking event may be already deleted or the id you provided is invalid");
            }

            const event = transformEvent(booking.event);

            await booking.deleteOne({_id: args.bookingId})
                       
            return event;

        }
        catch(err){
            throw err
        }

    }
};


