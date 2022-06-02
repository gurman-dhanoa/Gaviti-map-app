import React from 'react'
import './content.css'
import marker from './../images/placeholder 1.png'
import { GoogleMap, Marker, useJsApiLoader,Autocomplete,DirectionsRenderer, } from '@react-google-maps/api';
import { useRef, useState } from 'react'
const center = { lat: 22.362440, lng: 78.753417 }

const Content = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_API_KEY,
    libraries: ['places'],
  })

  const [map, setMap] = useState(null)
  const [directionsResponse, setDirectionsResponse] = useState(null)
  const [distance, setDistance] = useState('')
  const [newOrigin, setOrigin] = useState('')
  const [newdestination, setDestination] = useState('')

  const originRef = useRef()
  const destiantionRef = useRef()

  if (!isLoaded) {
    return (
      <h1>loading...</h1>
    )
  }

  async function calculateRoute() {
    if (originRef.current.value === '' || destiantionRef.current.value === '') {
      return
    }
    const directionsService = new window.google.maps.DirectionsService()
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destiantionRef.current.value,
      travelMode: window.google.maps.TravelMode.DRIVING,
    })
    setDirectionsResponse(results)
    setDistance(results.routes[0].legs[0].distance.text)
    setOrigin(originRef.current.value.split(",")[0])
    setDestination(destiantionRef.current.value.split(",")[0])
  }
  return (
    <div className='content'>
    <p>Let's calculate <b>distance</b> from Google maps</p>
    <div className='sub-content'>
      <div className='input-feilds'>
        <div>
        <label htmlFor="origin">Origin</label>
          <div>
            <img src={marker} alt="location" />
            <Autocomplete>
            <input type="text" id='origin' ref={originRef}/>
            </Autocomplete>
          </div>
        </div>
        <div>
        <button onClick={calculateRoute}>Calculate</button>
        </div>
        <div>
        <label htmlFor="destination">Destination</label>
          <div>
            <img src={marker} alt="location" />
            <Autocomplete>
            <input type="text" id='destination' ref={destiantionRef}/>
            </Autocomplete>
        </div>
        </div>
        <div className='result'>
          <div>
            <span>Distance</span>
            <span>{distance}</span>
          </div>
          <div>
            <p>The distance between <b>{newOrigin}</b> and <b>{newdestination}</b> is <b>{distance}</b>.</p>
          </div>
        </div>
      </div>
      <div className='map'>
        <GoogleMap center={center} zoom={4} mapContainerStyle={{ width: '100%', height: '100%' }} options={{zoomControl: false,streetViewControl: false,mapTypeControl: false,fullscreenControl: false,}} onLoad={map => setMap(map)}>
          <Marker position={center} />
          {directionsResponse && (
        <DirectionsRenderer directions={directionsResponse} />
      )}
        </GoogleMap>
      </div>
    </div>
</div>
  )
}

export default Content