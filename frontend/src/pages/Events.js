import React, { useState } from "react";
import Modal from "../components/Modal/Modal.js";
import "./Events.css";
import Backdrop from "../components/Backdrop/Backdrop.js";

function Eventspage(props) {

    const [create, setCreate] = useState(false);
    
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [price, setPrice] = useState(0);

    const startCreateEventHandler = () =>{

        setCreate(true)
    }

    const modalCancelHandler = () =>{
        setCreate(false);
    }

    const modalConfirmHandler = () => {

        const event = {title,price,date,description};

        if(title.trim().length === 0 || price.trim().length === 0 || date.trim().length === 0 || description.trim().length === 0){
          return
        }

        let requestBody = {
          query:`
          mutation {
            createEvent(eventInput: {
              title: ${title},
              description: ${description},
              price: ${price},
              date: ${date}
            }) {
              _id
              title
              description
              price
              date
            }
          }       `
        }

        const options = {

          method: 'POST',
          body: JSON.stringify(requestBody),
          headers: {
              'Content-Type': 'application/json'   
          }
      }

      fetch(`http://localhost:8000/graphql`,options)
      .then(res => {

        console.log(res); 
      
          if(res.status !== 200 && res.status !==201){
              throw new Error('Failed!')
          }
          return res.json();
          
      }).then(resData => {

          console.log(resData);
      }
      )
      .catch(err => {
          console.log(err);
      })
  
        setCreate(false);

    }

    

  return (
    <>

      {create && <Backdrop/>}

      {create && <Modal title='Add Event' canCancel canConfirm onCancel = {modalCancelHandler} onConfirm = {modalConfirmHandler}>
         <form >

            <div className="form-control">
                <label htmlFor="title">Title</label>
                <input type="text" id="title" onChange= {(e) => setTitle(e.target.value)}/>
            </div>

            <div className="form-control">
                <label htmlFor="price">Price</label>
                <input type="number" id="price" onChange={(e) => setPrice(e.target.value)}/>
            </div>

            <div className="form-control">
                <label htmlFor="date">Date</label>
                <input type="datetime-local" id="date" onChange={(e) => setDate(e.target.value)}/>
            </div>

            <div className="form-control">
                <label htmlFor="description">Description</label>
                <textarea  id="description" rows="4" onChange={(e) => setDescription(e.target.value)}></textarea>
            </div>


         </form>
        </Modal>}

      <div className="events-control">
        <p>Share your own Events</p>
        <button className="btn" onClick={startCreateEventHandler}>Create Event</button>
      </div>

    </>
  );
}

export default Eventspage;
