import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import {PlacesContext} from "./PlacesContext"

export default function Dashboard() {

    const [placesOfInterest, setPlaces] = useContext(PlacesContext)
    console.log(placesOfInterest)
    const placesList = placesOfInterest.map((place, index) => {
        return (

            <div className="card" style={{width: "18rem"}} key={index}>
                <h4>{place.title}</h4>
                <img className="card-img-top dashboard-image" src={place.image ? place.image : "/image.svg"} alt={place.title}/>
                <div className="card-body">
                    <p className="card-text">
                        <p>Rating: {place.rating}</p>
                        <p>{place.description}</p>
                        <p>Visited on: {new Date(place.visited_at).toLocaleDateString()}</p>
                    </p>
                </div>
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
