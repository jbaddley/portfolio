import Request from './Request';
const appid = '6753bbcd2344891748f76e7ae7fe4be5';
const mapUrl = 'http://api.openweathermap.org/data/2.5/weather';
const geoUrl = 'http://maps.googleapis.com/maps/api/geocode/json';

export const initalMapConfig = {
    center: { lat: 40.296898, lng: -111.694647, lon: -111.694647 },
    zoom: 8,
};
export const defaultLatLng = {
    lat: () => initalMapConfig.lat,
    lng: () => initalMapConfig.lng,
};
export const headers = {
    text: {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    },
};
export const consts = {
    appid,
    mapUrl,
    geoUrl,
    initalMapConfig,
    headers,
};

export const request = Request;

// I was going to use a linear scale but the colors got muddy quick
// this is not the palette I would actually use, but it serves its purpose
export const temperatureScale = (val) => {
    if (val <= 30) return 'white';
    if (val <= 50) return 'azure';
    if (val <= 65) return 'blue';
    if (val <= 90) return 'yellow';
    if (val <= 110) return 'orange';
    return 'red';
};
