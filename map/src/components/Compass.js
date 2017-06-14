import React, { Component, PropTypes } from 'react';

class Compass extends Component {
    render() {
        const { deg = 0 } = this.props;
        const style = {
            transition: 'transform .25s cubic-bezier(.75,-0.5,0,1.75)',
            transform: `rotate(${deg}deg)`,
            transformOrigin: '24px',
        };
        return (
            <svg width="48" height="60">
                <g>
                    <circle r="20" fill="transparent" cx="24" cy="24" stroke="white" opacity="0.1" strokeWidth="2" />
                    <text fill="white" x="24" y="8" style={{ fontSize: '10px' }} textAnchor="middle">N</text>
                    <text fill="white" x="24" y="58" style={{ fontSize: '12px' }} textAnchor="middle">{deg}&deg;</text>
                    <g style={style}>
                        <path d="M 24,8 l 4,15 l -8,0 z" fill="white" />
                        <path d="M 24,40 l 4,-15 l -8,0 z" fill="white" opacity="0.1" />
                    </g>
                </g>
            </svg>
        );
    }
}

Compass.propTypes = {
    deg: PropTypes.number,
};

export default Compass;
