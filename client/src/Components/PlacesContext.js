import React, {useState, createContext} from 'react'

export const PlacesContext = createContext();

export const PlacesProvider = props =>  {
    
    const [placesOfInterest, setPlaces] = useState([])

    return (
        <PlacesContext.Provider value={[placesOfInterest, setPlaces]}>
            {props.children}
        </PlacesContext.Provider>
    )
}
