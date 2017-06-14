import React, { Component } from 'react';
import logo from './images/logo-120.png';
import './App.css';
// I use lodash fp in react apps because of the benefits of
// immutable objects
import getOr from 'lodash/fp/getOr';
import pick from 'lodash/fp/pick';
import debounce from 'lodash/fp/debounce';
import { consts, request, defaultLatLng } from './utils';
import Weather from './components/Weather';
import classnames from 'classnames';
import weatherIcons from './images';
import moment from 'moment';
const { appid, mapUrl, initalMapConfig, headers, geoUrl } = consts;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleClick = this.handleClick.bind(this);
        this.handleMarkerDropped = this.handleMarkerDropped.bind(this);
        this.handleMarkerDragging = this.handleMarkerDragging.bind(this);
    }
    componentDidMount() {
        if (!window.google) return;
        this.gmap = new window.google.maps.Map(this.map, initalMapConfig);
        this.gmap.addListener('click', this.handleClick);
        this.setMarker(initalMapConfig.center);
        this.getAll(initalMapConfig.center, false);
    }
    componentWillUnmount() {
        this.gmap.removeListener('click', this.handleClick);        
    }
    setMarker(latLng) {
        if (!this.marker) {
            this.marker = new window.google.maps.Marker({
                map: this.gmap,
                draggable: true,
            });
            this.marker.addListener('drag', debounce(100, this.handleMarkerDragging));
            this.marker.addListener('dragend', this.handleMarkerDropped);
        }
        this.marker.setPosition(latLng);
    }
    handleMarkerDropped(param) {
        const { latLng } = param;
        const pos = { lat: latLng.lat(), lon: latLng.lng() };
        this.getAll(pos, true);
    }
    handleMarkerDragging(param) {
        const { latLng } = param;
        const pos = { lat: latLng.lat(), lon: latLng.lng() };
        this.getAll(pos, false);
    }
    handleClick(param) {
        const { latLng } = param;
        this.setMarker(latLng);
        const pos = { lat: latLng.lat(), lon: latLng.lng() };
        this.getAll(pos, true);
    }
    // these two calls could be done at the same time using Promise.all
    getAll(pos, pan) {
        return this.getWeather(pos).then((weather) => {
            this.getDemographics(pos).then(results => {
                this.setState({
                    weather,
                    geo: results.results,
                });
                pan && this.gmap.panTo(this.marker.getPosition());
            });
        });
    }
    // fetches additional geo location data by position from Google
    getDemographics({ lat, lon }) {
        return request.get({
            headers: pick(headers, ['text']),
            url: geoUrl,
            query: {
                latlng: `${lat},${lon}`,
                sensor: 'false',
            }
        })
        .then(geo => {
            return geo;
        })
        .catch(err => {
            console.error(err);
        });
    }
    // fetches weather data by position
    getWeather({ lat, lon }) {
        return request.get({
            headers: pick(headers, ['text']),
            url: mapUrl,
            query: {
                appid,
                lat,
                lon,
                units: 'imperial',
            }
        })
        .then(weather => {
            return weather;
        })
        .catch(err => {
            console.error(err);
        });
    }
    render() {
        const { weather = {}, geo = [] } = this.state;
        const temperature = getOr('', 'main.temp', weather);
        const icon = getOr('01d', 'weather[0].icon', weather);
        const classes = classnames('app', 'weather-background', `wi-${icon}`);
        const background = weatherIcons[icon] || weatherIcons[0];
        return (
            <div className={classes}>
                <div className="background">
                    <img src={background} alt="" />
                </div>
                <div className="app-header">
                    <img src={logo} className="app-logo" alt="logo" />
                    <h2>Forecast Clicker</h2>
                </div>
                <div className="map-container">
                    <div id="map" className="weather-map" ref={i => (this.map = i)} />
                    <Weather weatherDetails={weather} geo={geo} />
                </div>
                <div className="info">All temperatures in fahrenheit.</div>
                <div className="copyright">&copy; Copyright Jason Baddley {moment().format('YYYY')}</div>
            </div>
        );
    }
}

export default App;
