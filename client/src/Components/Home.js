import React, {useState, useEffect, useRef, useCallback} from 'react';
import ReactMapGL, {Marker, Popup} from 'react-map-gl';
import Geocoder from 'react-map-gl-geocoder';
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css';
import Cookies from 'js-cookie';
import AddLocationForm from "./AddLocationForm";
import 'mapbox-gl/dist/mapbox-gl.css';
import Logout from './Logout';
import Loader from './Loader';

export default function Home() {
 
    const [showPopup, setShowPopup] = useState(null)
    const [addLocation, setAddLocation] = useState(null)
    const [addLocationError, setAddLocationError] = useState(false)
    const [successfullyAdded, setSuccessfullyAdded] = useState(false)
    const [placesOfInterest, setPlaces] = useState([])
    const [imgPreview, setImgPreview] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [viewport, setViewport] = useState({
        width: "100vw",
        height: "100vh",
        latitude: 1.3521,
        longitude: 103.8198,
        zoom: 12

    })

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

    useEffect(() => {
        fetchLogs();
        setIsLoading(false)
        navigator.geolocation.getCurrentPosition(pos => {
          setViewport({
            ...viewport,
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
          });
        });
      }, []);

      useEffect(()=>{
          fetchLogs();
          setIsLoading(false)
      }, [successfullyAdded])

    // const fetchPoints = async () => {
    //     console.log("this triggered")
    //     try {
    //         const response = await fetch('/info/placesOfInterest', {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json"
    //             },
    //             body: JSON.stringify({
    //                 latitude: viewport.latitude,
    //                 longitude: viewport.longitude
    //             })
    //         })
    //         console.log("request sent")
    //         const points = await response.json();
    //         setPlaces(points.data) 
    //     } catch (err) {
    //         console.log(err.stack)
    //     }
      
    // }

    const fetchLogs = async () => {
        setIsLoading(true)
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
        setAddLocation(null)
        setIsLoading(false)
        setAddLocationError(false)
        setSuccessfullyAdded(true)
        setImgPreview(null)
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

    return (
        <div>
      
            <ReactMapGL
            {...viewport}
            ref={mapRef}
            // onViewportChange={nextViewport => setViewport(nextViewport)}
            mapboxApiAccessToken = {process.env.REACT_APP_MAPBOX_TOKEN}
            mapStyle="mapbox://styles/jarryl/ckggo2kqv3e7z1aok773nnr9i"
            onViewportChange={handleViewportChange}
            onDblClick={showAddLocation}
            getCursor={(e) => "crosshair"}
            doubleClickZoom={false}
            >
                <Logout />
                {isLoading ? <Loader /> : null }
                <Geocoder
                mapRef={mapRef}
                onViewportChange={handleGeocoderViewportChange}
                mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
                position="top-left"
                />

                {placesOfInterest.map(place => {
                    return (
                        <div key={place._id}>
                            <Marker latitude={place.latitude} longitude={place.longitude}>
                            <img id="map-pin" src="/map-pin.png" alt="map-pin" onClick={()=> setShowPopup(place)}/>
                            </Marker>
                            {showPopup ? <Popup className="Popup" onClose={()=>setShowPopup(null)} latitude={showPopup.latitude} longitude={showPopup.longitude} anchor="left" dynamicPosition={true}>
                                <h3>{showPopup.title}</h3>
                                <img src={showPopup.image} alt={showPopup.title}/>
                                <p>Rating: {showPopup.rating}</p>
                                <p>{showPopup.description}</p>
                                <p>{new Date(showPopup.visited_at).toLocaleDateString()}</p>
                            </Popup> : null}
                        </div>                    
                    )
                })}

                {addLocation ? <>
                    <Marker latitude={addLocation.latitude} longitude={addLocation.longitude}>
                        <img id="entry-pin" src="/pin.png" alt="entry-pin"/>
                    </Marker>
                    <Popup latitude={addLocation.latitude} longitude={addLocation.longitude}onClose={()=> {
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
