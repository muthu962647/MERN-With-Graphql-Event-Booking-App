import React, { useContext, useEffect, useState } from "react";
import Modal from "../components/Modal/Modal.js";
import "./Events.css";
import Backdrop from "../components/Backdrop/Backdrop.js";
import AuthContext from "../context/auth-context.js";
import EventList from "../components/Events/EventList/EventList.js";
import Spinner from "../components/Spinner/Spinner.js";

import {  useSnackbar } from 'notistack';

function Eventspage(props) {

    const [create, setCreate] = useState(false);
    
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [price, setPrice] = useState(0);
    const [events, setEvents] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const { enqueueSnackbar } = useSnackbar();
    

    const { token, userId } = useContext(AuthContext);

    useEffect(() => {
      fetchEvents();
    }, [])

    const startCreateEventHandler = () =>{

        setCreate(true)
    }

    const modalCancelHandler = () =>{
        setCreate(false);
        setSelectedEvent(null)
        
    }

    const fetchEvents = () => {
      const requestBody = {
        query: `
          query {
            events{
              _id,
              title,
              description,
              date,
              price,
              creator{
                _id
              }   
            }
         }`
      }

      const options = {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
            'Content-Type': 'application/json'
        }
    };

    setLoading(true);

    fetch(`https://backend-5kak.onrender.com/graphql`,options)
        .then(res => {
            console.log(res);
            if (res.status !== 200 && res.status !== 201) {
                throw new Error('Failed!')
            }
            return res.json();
        })
        .then(resData => {

            setEvents(resData.data.events);
            setLoading(false);

        })
        .catch(err => {

            console.log(err);
            setLoading(false);

        });
    }

    const modalConfirmHandler = () => {
      
  
      if (title.trim().length === 0 || price === null || date.trim().length === 0 || description.trim().length === 0) {
          return;
      }
  
      let requestBody = {
          query: `
              mutation {
                  createEvent(eventInput: {
                      title: "${title}",
                      description: "${description}",
                      price: ${price},
                      date: "${date}"
                  }) {
                      _id
                      title
                      description
                      price
                      date
                  }
              }
          `
      };
  
      const options = {
          method: 'POST',
          body: JSON.stringify(requestBody),
          headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token
          }
      };
  
      fetch(`https://backend-5kak.onrender.com/graphql`,options)
          .then(res => {
              
              if (res.status !== 200 && res.status !== 201) {
                  throw new Error('Failed!')
              }
              return res.json();
          })
          .then(resData => {

            const {_id, title, description, date, price, creator} = resData.data.createEvent;

            setEvents((prevEvents) => {

                let updatedEvents = [...prevEvents];
                updatedEvents.push({
                        _id,
                        title,
                        description,
                        date,
                        price,
                        creator: {
                            _id: userId
                        }
                    });

                    console.log(updatedEvents);
                
                return updatedEvents;

            })

            enqueueSnackbar("Event Created",{variant: "success", style: { backgroundColor: '#9b5ff5', color: 'white' }})
             
          })
          .catch(err => {
              console.log(err);
          });
  
      setCreate(false);
  }

    const showDetailHandler = (eventId) => {
        
        events.map((event) => {
            if (event._id == eventId){
                setSelectedEvent(event);
                console.log(selectedEvent);
            }
        }) 

    }

    const BookEvent = () => {

        let requestBody = {
            query: `
                mutation{
                    bookEvent(eventId:"${selectedEvent._id}"){
                    _id
                    createdAt
                    updatedAt
                    }
                }
            `
        };
    
        const options = {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        };
    
        fetch(`https://backend-5kak.onrender.com/graphql`,options)
            .then(res => {
                
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Failed!')
                }
                return res.json();
            })
            .then(resData => {
  
                setCreate(false);
                setSelectedEvent(null)

                enqueueSnackbar("Booked successfully",{variant: "success", style: { backgroundColor: '#9b5ff5', color: 'white' }})

  
            })
            .catch(err => {
                console.log(err);
            });

    }

  
    

  return (
    <>

      {create && <Backdrop/>}

      {create && <Modal title='Add Event' canCancel canConfirm confirmText = {"Confirm"} onCancel = {modalCancelHandler} onConfirm = {modalConfirmHandler}>
         <form >

            <div className="form-event">
                {/* <label htmlFor="title">Title</label> */}
                <input type="text" id="title" placeholder = "Title" onChange= {(e) => setTitle(e.target.value)}/>
            </div>

            <div className="form-event">
                {/* <label htmlFor="price">Price</label> */}
                <input type="number" id="price" placeholder = "Price" onChange={(e) => setPrice(e.target.value)}/>
            </div>

            <div className="form-event">
                {/* <label htmlFor="date">Date</label> */}
                <input type="datetime-local" id="date" placeholder = "Date" onChange={(e) => setDate(e.target.value)}/>
            </div>

            <div className="form-event">
                {/* <label htmlFor="description">Description</label> */}
                <textarea  id="description" rows="4" placeholder = "Description" onChange={(e) => setDescription(e.target.value)}></textarea>
            </div>


         </form>
        </Modal>}

        { token && 
          <div className="events-control">
          <p>Share your own Events</p>
          <button className="btn" onClick={startCreateEventHandler}>Create Event</button>
          </div>
          }

        <section>

            {selectedEvent && <Backdrop/>}
            {selectedEvent &&
            <Modal title = {selectedEvent.title} confirmText = {"Book"} onCancel = {modalCancelHandler} onConfirm = {BookEvent} >
                <h1>{selectedEvent.title}</h1>
                <h2>
                {selectedEvent.price} - {new Date(selectedEvent.date).toLocaleDateString()}
                </h2>
            </Modal>
         }
        {isLoading ? <Spinner/> : <EventList events= {events} onViewDetail = {showDetailHandler}/>}
    
        </section>
    </>
  );
}

export default Eventspage;
