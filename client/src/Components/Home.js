import React, { useState, useRef, useCallback, useContext, useEffect } from 'react';
import ReactMapGL, {Marker, Popup} from 'react-map-gl';
import Geocoder from 'react-map-gl-geocoder';
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css';
import Cookies from 'js-cookie';
import AddLocationForm from "./AddLocationForm";
import 'mapbox-gl/dist/mapbox-gl.css';
import Nav from './Nav';
import Loader from './Loader';
import {PlacesContext} from './PlacesContext';
import {ViewportContext} from './ViewportContext';

export default function Home() {
 
    const [showPopup, setShowPopup] = useState(null)
    const [addLocation, setAddLocation] = useState(null)
    const [addLocationError, setAddLocationError] = useState(false)
    const [placesOfInterest, setPlaces] = useContext(PlacesContext)
    const [imgPreview, setImgPreview] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [viewport, setViewport] = useContext(ViewportContext)


    const mapRef = useRef();
    const handleViewportChange = useCallback(
        (newViewport) => setViewport(newViewport),
    []
  );

    const handleGeocoderViewportChange = useCallback(
        (newViewport) => {
        const geocoderDefaultOverrides = { transitionDuration: 1000 };
        return handleViewportChange({
            ...newViewport,
            ...geocoderDefaultOverrides
      });
    },
    []
  );


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

    const showAddLocation = (e) => {
        const [ longitude, latitude ] = e.lngLat;
        setAddLocation({
            latitude,
            longitude
        })
    }

    const previewFile = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setImgPreview(reader.result)
        }
        
    }

    //Function to handle user input data on AddLocationForm
    const handleLocationOnChange = (e) => {
        setAddLocation({
            ...addLocation,
            [e.target.id]: e.target.value
        })
        if (e.target.files) {
            const file = e.target.files[0]
            previewFile(file)
        }
    }
    
    const validate = () =>{
        if (!addLocation.title || !addLocation.visited_at ) {
            return true
        }
        return false
    }

    const addEntry = async (data) => {
        const response = await fetch ('/api/log', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        const result = await response.json()
        console.log(result)
        setAddLocation(null)
        setIsLoading(false)
        setAddLocationError(false)
        setImgPreview(null)
        setPlaces([...placesOfInterest, result])
        setViewport({...viewport, 
            latitude: result.latitude, 
            longitude: result.longitude})
    }
    const uploadImg = async (base64Img) => {
        try {
            const response = await fetch('api/upload', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ image: base64Img })
            })
            const parsedResponse = await response.json()
            const { image_url } = parsedResponse
            const data = {
                ...addLocation,
                image: image_url,
                user_id: Cookies.get('auth')}
            addEntry(data)             
        } catch (err) {
            console.log(err.stack)
        }
    }

    const handleAddLocation = (e) => {
        e.preventDefault();
        setIsLoading(true)
        const err = validate();
        if (!err) {
            if (!imgPreview) {
                addEntry({...addLocation, user_id: Cookies.get('auth')})
            } else {
                uploadImg(imgPreview)
            }
        } else {
            setAddLocationError(true)
        }
    }

    const handleDelete = async (e) => {
        console.log("Delete button clicked")
        e.preventDefault();
        setIsLoading(true)
        try {
            const response = await fetch('api/log', {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ id: showPopup._id })
            })
            const result = await response.json()
            setIsLoading(false)
            setPlaces(placesOfInterest.filter(place => place._id !== showPopup._id))
            setShowPopup(null)
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div>
            <Nav />
            <ReactMapGL
            {...viewport}
            ref={mapRef}
            mapboxApiAccessToken = {process.env.REACT_APP_MAPBOX_TOKEN}
            mapStyle="mapbox://styles/jarryl/ckggo2kqv3e7z1aok773nnr9i"
            onViewportChange={handleViewportChange}
            onDblClick={showAddLocation}
            getCursor={(e) => "crosshair"}
            doubleClickZoom={false}
            >

                {isLoading ? <Loader /> : null }

                <Geocoder
                mapRef={mapRef}
                onViewportChange={handleGeocoderViewportChange}
                mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
                position="bottom-right"
                />

                {placesOfInterest.map(place => {
                    return (
                        <div key={place._id}>
                            <Marker latitude={place.latitude} longitude={place.longitude}>
                            <img id="map-pin" src="/images/map-pin.png" alt="map-pin" onClick={()=> setShowPopup(place)}/>
                            </Marker>
                            {showPopup ? <Popup className="Popup" onClose={()=>setShowPopup(null)} latitude={showPopup.latitude} longitude={showPopup.longitude} anchor="left" dynamicPosition={true} closeOnClick={false}>
                                <h3>{showPopup.title}</h3>
                                {showPopup.image ? <img src={showPopup.image} alt={showPopup.title}/> : null}
                                <p>Rating: {showPopup.rating}</p>
                                <p>{showPopup.description}</p>
                                <p>Visited on: {new Date(showPopup.visited_at).toLocaleDateString()}</p>
                                <input className="btn btn-danger" type="button" value="Delete" onClick={(e)=> handleDelete(e)}/>
                            </Popup> : null}
                        </div>                    
                    )
                })}

                {addLocation ? <>
                    <Marker latitude={addLocation.latitude} longitude={addLocation.longitude}>
                        <img id="entry-pin" src="/images/pin.png" alt="entry-pin"/>
                    </Marker>
                    <Popup latitude={addLocation.latitude} longitude={addLocation.longitude} onClose={()=> {
                        setAddLocation(null)
                        setAddLocationError(false)
                    }} dynamicPosition={true} anchor="left" closeOnClick={false}>
                        <AddLocationForm handleLocationOnChange={handleLocationOnChange} handleAddLocation={handleAddLocation} addLocationError={addLocationError} imgPreview={imgPreview}/>
                    </Popup>
                </> : null}
        </ReactMapGL>
            
        </div>
    )
}
