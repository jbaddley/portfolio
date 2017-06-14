// I normally would not create yet another ajax wrapper, but in this case
// it was easy to do and helped reduce some redundant code
class Request {
    buildQueryString(param) {
        if (!param) return '';
        const tokens = [];
        Object.keys(param).forEach(key => {
            let value = param[key];
            // I assume here that the array is formed
            // correctly for simplicity, normally I would validate
            // the array
            // I'm not going to support objects
            if (value instanceof Array) {
               value = value.join(',');
            } else if(typeof value === 'object') {
                throw 'Nested Objects are not supported';
            }
            tokens.push(`${key}=${value}`);
        });
        return `?${tokens.join('&')}`;
    }
    buildHeaders(param) {
        if (!param) return;
        return new Headers(param);
    }
    get({ url, query, headers, init }) {
        const queryString = this.buildQueryString(query);
        const param = Object.assign({
            method: 'GET',
            headers: this.buildHeaders(headers),
        }, init);
        return fetch(`${url}${queryString}`, init)
        .then((response) => response.json())
        .catch(err => {
            console.log(err);
        });
    }
}

export default new Request();