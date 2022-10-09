// export default OwnMap
import React from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
// icon creation
import L from 'leaflet'
import requests from '../helpers/requests'
import { Button } from '@mui/material';
import language from '../languages/languages';


import { useNavigate, Link } from 'react-router-dom';  
export let map;


class OwnMap extends React.Component { //Test Area to check how a popup would look like
    constructor(props) {
        super(props);
        this.state = {                 // patricular, non-included station in the network
            stations :[
                {
                    location: {lat: 51.9607, lng: 7.6261}, // from here
                    name: 'Munster',
                    station_id: 1,
                    temp: 12,
                    humidity: 27                           // to here it can be deleted
                }
            ]
        };
    };
    componentDidMount(){
        map= this.refs.map;
        this.getStations()
    };


    getStations () {                       // collecting data from the station
        let self = this;
        let stations = [];
        requests.getStations()
        .then ( ( res ) => {
           
            stations= res.data;            
            console.log(stations)
            this.state.stations = stations // stations - state setted
            this.setState({
                            stations: stations
                        })


        })
        .catch ( ( res ) => console.log(res))
    }



    render() {
        const bounds = [[
            48.87194147722911,
            5.943603515625
          ],
          [52.415822612378776,
            9.810791015625,
            
          ]]
        return (
            <MapContainer style={{ height: "90vh" }} bounds={bounds} zoom={15} ref="map" > //Area for creating popups
                <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {/* Map markers on the Map,if marker was clicked turn green */}
                {this.state.stations.map((marker, i) => {   //only one marker (the test station) existing
                    return <Marker  key={"marker" + i}
                        position={[marker.location.lat, marker.location.lng ? marker.location.lng : marker.location.lon]}>                 
                        <Popup minWidth={90}>
                        <span >
                          {language[this.props.language]["map"]["stationName"]}{marker.name} //Name of station
                        </span>
                        <br/>
                        temperature: {marker.temp} <br/> //measurement data for temperature
                        humidity: {marker.humidity} <br/> // "         "        humidity
                        <Button component={Link} to={"/view/station/"+ marker.station_id}>{language[this.props.language]["map"]["inspect"]}</Button>
                      </Popup> </Marker>
                })}
            </MapContainer>
        );
    }
}
export default OwnMap