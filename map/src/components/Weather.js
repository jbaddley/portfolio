import React, { Component, PropTypes } from 'react';
import getOr from 'lodash/fp/getOr';
import get from 'lodash/fp/get';
import weatherIcons from '../images';
import sunrise from '../images/sunrise.png';
import sunset from '../images/sunset.png';
import numeral from 'numeral';
import { temperatureScale } from '../utils';
import Compass from './Compass';
import Humidity from './Humidity';
import WindSpeed from './WindSpeed';
import moment from 'moment';

class Weather extends Component {
    _getAddressPart(name, def = '') {
        const comps = this._addressComponents;
        const found = comps.find(c => c.types.includes(name));
        if (!found) return def;
        return found.short_name;
    }
    get _weather() {
        const { weatherDetails = {} } = this.props;
        return weatherDetails;
    }
    get _geo() {
        const { geo = [] } = this.props;
        return geo;
    }
    get _condition() {
        return getOr('', 'weather[0].description', this._weather);
    }
    get _humidity() {
        return getOr(0, 'main.humidity', this._weather);
    }
    get _windSpeed() {
        return getOr(0, 'wind.speed', this._weather);
    }
    get _windDegrees() {
        return getOr(0, 'wind.deg', this._weather);
    }
    get _sunrise() {
        return get('sys.sunrise', this._weather);
    }
    get _sunset() {
        return get('sys.sunset', this._weather);
    }
    get _temp() {
        return getOr(0, 'main.temp', this._weather);
    }
    get _icon() {
        return getOr('01d', 'weather[0].icon', this._weather);
    }
    get _addressComponents() {
        return getOr([], '[0].address_components', this._geo);        
    }
    get _fullAddress() {
        return getOr('', '[0].formatted_address', this._geo);
    }
    get _address() {
        return this._getAddressPart('route');
    }
    get _city() {
        return this._getAddressPart('locality');
    }
    get _county() {
        return this._getAddressPart('administrative_area_level_2');
    }
    get _state() {
        return this._getAddressPart('administrative_area_level_1');
    }
    get _country() {
        return this._getAddressPart('country');
    }
    get _cityState() {
        return this._city ? `${this._city}, ${this._state}` : this._state;
    }
    renderTemp() {
        const temp = +this._temp;
        const color = temperatureScale(temp);
        const style = {
            color,
        };
        return <span style={style} className="temperature">{numeral(temp).format('0')}&deg;</span>;
    }
    render() {
        const icon = weatherIcons[this._icon] || weatherIcons['01d'];
        // weather data comes in as time from 12am today, so we have to 
        // clear time from now and add it to the sunrise and sunset times to actually
        // get a date to format
        const today = new Date();
        today.setHours(0);
        today.setMinutes(0);
        today.setHours(0);
        today.setMilliseconds(0);
        const sunriseTime = moment(this._sunrise).add(today.getTime(), 'ms').format('hh:mm a');
        const sunsetTime = moment(this._sunset).add(today.getTime(), 'ms').format('hh:mm a');
        return (
            <div className="weather-details">
                <div className="header">
                    <div className="icon">
                        <img src={icon} alt="Weather Icon" className="weather-icon" />                    
                    </div>
                    <div className="title">
                        <h2 className="city-state">{this._cityState}</h2>
                        <h3 className="condition">{this.renderTemp()} <span>{this._condition}</span></h3>
                    </div>
                </div>
                <div className="information">
                    <div className="detail">
                        <label>Humidity</label>
                        <Humidity percent={this._humidity} />                        
                    </div>
                    <div className="detail wind-direction">
                        <label>Wind Dir.</label>                        
                        <Compass deg={this._windDegrees} />
                    </div>
                    <div className="detail">
                        <label>Wind Speed</label>
                        <WindSpeed speed={this._windSpeed} />
                    </div>
                    <div className="detail">
                        <label>Sunrise</label>                        
                        <div className="sunrise">
                            <img src={sunrise} />
                            <div>{sunriseTime}</div>
                        </div>
                    </div>
                    <div className="detail">
                        <label>Sunset</label>
                        <div className="sunset">
                            <img src={sunset} />
                            <div>{sunsetTime}</div>
                        </div>
                    </div>
                </div>
                <div className="full-address">
                    {this._fullAddress}
                </div>
            </div>   
        );
    }
}

Weather.propTypes = {
    weatherDetails: PropTypes.object,
    geo: PropTypes.array,
};

export default Weather;