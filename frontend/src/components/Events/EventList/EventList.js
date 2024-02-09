import { useContext } from "react";

import EventItem from "./EventItem/EventItem"
import './EventList.css'
import AuthContext from "../../../context/auth-context";


const EventList = (props) => {

    const events = props.events.map(event =>{
        return ( <EventItem key = {event._id} {...event} onViewDetail= {props.onViewDetail}/> )
    })

    return (<ul className="events__list">{events}</ul>)
} 

export default EventList