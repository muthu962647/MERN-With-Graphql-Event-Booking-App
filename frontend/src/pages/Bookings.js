import React, { useContext, useEffect, useState } from 'react'
import AuthContext from '../context/auth-context';
import Spinner from '../components/Spinner/Spinner.js';
import BookingList from '../components/Bookings/BookingList.js';


function Bookingspage(props){

    const { token } = useContext(AuthContext);
    const [bookings, setBookings] = useState([]);
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        fetchBookings();
    }, [])

    const fetchBookings = () => {
        const requestBody = {
            query: `
            query{
                bookings{
                    createdAt
                    _id
                  event{
                    title
                    description
                  }
                  user{
                    email
                  }
                  
                }
              }`
          }
    
          const options = {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        };
    
        setLoading(true);
    
        fetch(`http://localhost:8000/graphql`, options)
            .then(res => {
                console.log(res);
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Failed!')
                }
                return res.json();
            })
            .then(resData => {
    
                setBookings(resData.data.bookings);
                setLoading(false);

            })
            .catch(err => {
    
                console.log(err);
                setLoading(false);
    
            });
        
    }

    const CancelBooking = (bookingId) => {

        const requestBody = {
            query: `
                mutation{
                    cancelBooking(bookingId: "${bookingId}"){
                    title
                    description
                    price
                    }
                }
            `
          }
    
          const options = {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        };
    
        setLoading(true);
    
        fetch(`http://localhost:8000/graphql`, options)
            .then(res => {
                console.log(res);
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Failed!')
                }
                return res.json();
            })
            .then(resData => {
                
                console.log("Deleted");
                fetchBookings();
                setLoading(false);

            })
            .catch(err => {
    
                console.log(err);
                setLoading(false);
    
            });
    }

    return (
        <>
                { isLoading ? <Spinner/> : <BookingList bookings = {bookings}  onDelete = {CancelBooking}/> }
        </>
    )
}

export default Bookingspage;