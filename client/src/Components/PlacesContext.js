import React, {useState, useEffect, createContext} from 'react'
import Cookies from 'js-cookie'

export const PlacesContext = createContext();

export const PlacesProvider = props =>  {
    const [placesOfInterest, setPlaces] = useState([])

    const fetchLogs = async () => {
        if (Cookies.get("auth")) {
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
    }
        

    useEffect(()=> {
        fetchLogs();
    }, [])

    return (
        <PlacesContext.Provider value={[placesOfInterest, setPlaces]}>
            {props.children}
        </PlacesContext.Provider>
    )
}
