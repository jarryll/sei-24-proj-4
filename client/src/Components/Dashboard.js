import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {PlacesContext} from "./PlacesContext"
import {ViewportContext} from "./ViewportContext";
import Nav from "./Nav";
import Cookies from 'js-cookie';

export default function Dashboard() {

    const linkStyle = {
        textDecoration: "none",
        color: "black"
    }

    const [placesOfInterest, setPlaces] = useContext(PlacesContext)
    const [viewport, setViewport] = useContext(ViewportContext)

    const fetchLogs = async () => {
        const response = await fetch('/api/log/find', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user_id: Cookies.get('auth')
            })
        })
        const result = await response.json()
        setPlaces(result)
}

    useEffect(()=> {
        fetchLogs();
    }, [])

    const placesList = placesOfInterest.map((place, index) => {
        return (
            <div className="col-sm-4" key={index}>
                <div className="card" style={{width: "18rem"}} >
                <Link to="/" style={linkStyle} 
                onClick={()=>setViewport({
                    ...viewport,
                    latitude: place.latitude,
                    longitude: place.longitude
                    })}>
                    <h4>{place.title}</h4>

                    <img className="card-img-top dashboard-image" src={place.image ? place.image : "images/image.svg"} alt={place.title}/>

                    <div className="card-body">
                        <div className="card-text">
                            <p>Rating: {place.rating}</p>
                            <p>{place.description}</p>
                            <p>Visited on: {new Date(place.visited_at).toLocaleDateString()}</p>
                        </div>
                    </div>
                </Link>   
            </div>
            </div>
            
        )
    })
    return (
        <div>
            <Nav />

            <div className="container">

            <h2 className="dashboard-header">You have visited {placesOfInterest.length} places</h2>

            <div className="places-list row">
                {placesList}
            </div>
        </div>
        </div>
       
        
    )
}
