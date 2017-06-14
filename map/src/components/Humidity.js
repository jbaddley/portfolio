import React, { Component, PropTypes } from 'react';

class Humidity extends Component {
    render() {
        const { percent = 0 } = this.props;
        let rotation = 0;
        const deg = 360 * (percent / 100);
        rotation += deg;
        const style = {
            transition: 'transform .25s cubic-bezier(.75,-0.5,0,1.75)',
            transform: `rotate(${deg}deg)`,
            transformOrigin: '24px',
        };
        return (
            <svg width="48" height="60">
                <g>
                    <circle r="20" fill="transparent" cx="24" cy="24" stroke="white" opacity="0.1" strokeWidth="2" />
                    <text fill="white" x="24" y="58" style={{ fontSize: '12px' }} textAnchor="middle">{percent}%</text>
                    <g style={style}>
                        <path d="M 24,8 l 4,15 l -8,0 z" fill="white" />
                        <circle r="4" fill="white" cx="24" cy="24" />
                        <path d="M 24,40 l 4,-15 l -8,0 z" fill="white" opacity="0" />

                    </g>
                </g>
            </svg>
        );
    }
}

Humidity.propTypes = {
    percent: PropTypes.number,
};

export default Humidity;
