import './EventItem.css'
import { useContext } from "react";

import AuthContext from '../../../../context/auth-context'

const EventItem = (props) =>{

    const { userId } = useContext(AuthContext);


    return (

        <li key={props._id} className="events__list-item">
    
            <div>
                <div>
                    <h1>{props.title}</h1>
                    <p>Price: {props.price} - Date: {new Date(props.date).toLocaleDateString()}</p>
                </div>
                <div>
                    {userId === props.creator._id ? <p>You are the Owner of this event</p> : <button className='btn' onClick={() => props.onViewDetail(props._id)}>View Details</button>}
                </div>
            </div>
             
            
        </li>
    
    )

} 

export default EventItem