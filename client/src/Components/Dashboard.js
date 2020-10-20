import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import {PlacesContext} from "./PlacesContext"
import {ViewportContext} from "./ViewportContext";

export default function Dashboard() {

    const linkStyle = {
        textDecoration: "none",
        color: "black"
    }

    const [placesOfInterest, setPlaces] = useContext(PlacesContext)
    const [viewport, setViewport] = useContext(ViewportContext)

    const placesList = placesOfInterest.map((place, index) => {
        return (

            <div className="card" style={{width: "18rem"}} key={index}>
                <Link to="/" style={linkStyle} 
                onClick={()=>setViewport({
                    ...viewport,
                    latitude: place.latitude,
                    longitude: place.longitude
                    })}>
                    <h4>{place.title}</h4>

                    <img className="card-img-top dashboard-image" src={place.image ? place.image : "images/image.svg"} alt={place.title}/>

                    <div className="card-body">
                        <p className="card-text">
                            <p>Rating: {place.rating}</p>
                            <p>{place.description}</p>
                            <p>Visited on: {new Date(place.visited_at).toLocaleDateString()}</p>
                        </p>
                    </div>
                </Link>   
            </div>
        )
    })
    return (
        <div className="container">
            <div className="dashboard-header">
                <h1>Your Dashboard</h1>
                <h4 className="back-to-map">
                    <Link to="/">Back to Map</Link>
                </h4>
            </div>

            <h2>You have visited {placesOfInterest.length} places</h2>

            <div className="places-list">
                {placesList}
            </div>
        </div>
        
    )
}
