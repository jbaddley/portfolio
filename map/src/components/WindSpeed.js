import React, { Component, PropTypes } from 'react';
import { scaleLinear } from 'd3-scale';
import windSpeed from '../images/wind-cloud-small.png';
class WindSpeed extends Component {
    render() {
        const { speed } = this.props;
        return (
            <div className="wind-speed">
                <img src={windSpeed} alt="wind-speed" />
                <div>{speed} mph</div>
            </div>
        );
    }
}

WindSpeed.propTypes = {
    speed: PropTypes.number,
};

export default WindSpeed;
