import React from 'react'
import { Link } from 'react-router-dom'

function NoPage(props){
    console.log("Hey");
    return (
        <>
        <p>Error 404: Not Found </p>
        <Link to='/events'> Event Page </Link>
        </>
    )
}

export default NoPage;