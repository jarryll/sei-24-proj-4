import React, {useState, useEffect, createContext} from 'react'

export const ViewportContext = createContext();

export const ViewportProvider = props => {

    const [viewport, setViewport] = useState({
        width: "100vw",
        height: "100vh",
        latitude: 1.3521,
        longitude: 103.8198,
        zoom: 12
    })

useEffect(() => {
    // fetchLogs();
    navigator.geolocation.getCurrentPosition(pos => {
      setViewport({
        ...viewport,
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude
      });
    });
  }, []);

  return (
      <ViewportContext.Provider value={[viewport, setViewport]}>
          {props.children}
      </ViewportContext.Provider>
  )
}