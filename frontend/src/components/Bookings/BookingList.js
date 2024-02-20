import './BookingList.css'


function BookingList (props) {
    console.log(props.bookings);
    return(
        <ul key = {props._id} className='bookings__list'>
            {props.bookings.map((booking) => (
                
                    <li className="bookings_item">
                        <div className="bookings__item-data">
                            {booking.event.title} - {new Date(booking.createdAt).toLocaleString()}
                       </div>

                        <div className="bookings__item-actions">
                            <button className='btn' onClick={() => props.onDelete(booking._id)}>Cancel</button>
                        </div>
        
                    </li>

            ))}
        </ul>
    )

}

export default BookingList;