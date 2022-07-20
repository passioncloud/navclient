const NavClient = require('./nav-client.js');
const navodata = require('navodata');

/**
 * An Odata client for accessing NAV.
 */
class OdataClient extends NavClient {
    /**
     * @param {OdataBody['query'] } query 
     * @returns 
     */
    odataUrlFor(query) {
        const q = navodata(this.url, this.config.company);
        // @ts-ignore
        return q(query);
    }
    /**
     * 
     * @param {OdataBody} jsonObj 
     * @returns 
     */
    async odataRequest(jsonObj) {
        try {
            const config = {
                method: jsonObj.method,
                url: this.odataUrlFor(jsonObj.query),
                headers: {
                    'Content-Type': 'application/json',
                    'if-match': jsonObj.etag || ''
                },
                data: jsonObj.json
            };
            console.log('url', config.url);
            const result = await this.axios(config);
            // const result = await this.axios.post('http://www.google.com'); //(config);
            return result.data;
        }
        catch (error) {
            // unify the various possible error messages into one error message.
            // console.log(`error is , status: ${error?.response?.statusText }, body: ${error?.response?.body}, message: ${error?.message}`)
            let msg = error?.response?.statusText || error?.response?.body || error?.message;
            if (msg === 'Unauthorized' || error?.response?.statusCode === 401) {
                msg += '. Check that "Use NTLM Authentication" is ticked if you are using windows authentication. Also confirm that you supplied the correct username and password. These should match credentials used in NAV.';
            }
            throw new Error(msg);
        }
    }

    get url() {
        return this.config.odataBaseUrl;
    }
}


/**
 * 
 * @param {OdataBody} odataBody 
 * @param {Config} config 
 * @returns 
 */
async function odata(odataBody, config) {
    const odataClient = new OdataClient(config);
    return odataClient.odataRequest(odataBody);
}

module.exports = odata;

