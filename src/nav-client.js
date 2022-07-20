const logger = console.log;
const authClientFactory = require('./authclient.js');
const { AxiosRequestConfig} = require('axios-ntlm');

class NavClient {
    config;
    /**
     * 
     * @param {Config} config 
     */
    constructor(config) {
        this.config = config;
    }
    /**
     * Produces an axios instance that is ready to use. The instance is
     * setup to connect using NTLM Authentication, the credentials are already configured.
     * Please note that this getter returns a function and the function returned accepts arguments.
     * This means that you can do sth like: this.axios(myRequestConfig);
     * @param {AxiosRequestConfig} config - please note that this config is different from the config defined on this class.
     */
    axios(config) {
        return authClientFactory(this.config).request(config);
    }
    /**
     * Produces the url used to access the web service.
     * @returns { string }
     */
    get url() {
        throw Error('Not implemented')
    }
    cleanStatusMessage(errorMessage) {
        console.error(errorMessage);
        // based on nav-api/src/soap.js#getStatusMessage
        let startPhrase = '{"string":"';
        if (errorMessage.includes(startPhrase)) {
            let startIdx = errorMessage.indexOf(startPhrase) + startPhrase.length;
            errorMessage = errorMessage.substring(startIdx);
            let endIdx = errorMessage.indexOf('"');
            errorMessage = errorMessage.substring(0, endIdx);
        }
        // Replae invalid characters
        errorMessage = errorMessage.replace(/\r?\n|\r/g, '__');
        return errorMessage;
    }
}
module.exports = NavClient;

