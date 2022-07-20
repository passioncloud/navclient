const axios = require('axios').default;
const { NtlmClient, AxiosRequestConfig } = require('axios-ntlm');

/** Base class for making authenticated requests to NAV */
class AuthClient {
    constructor(config) {
        this.config = config;
    }
}
class BasicAuthClient extends AuthClient {
    /** @param { AxiosRequestConfig } config */
    request(config) {
        config.headers = {
            ...config.headers,
            Authorization: this.basicAuthorizationValue
        };
        return axios(config);
    }
    get basicAuthorizationValue() {
        const { username, password } = this.config;
        const cred = Buffer.from((username + ':' + password) || '').toString('base64');
        return 'Basic ' + cred;
    }
}
class NtlmAuthClient extends AuthClient {
    ntlmClient() {
        const { username, password } = this.config;
        return NtlmClient({ username, password, domain: '' });
    }
    /** @param { AxiosRequestConfig } config */
    request(config) {
        return this.ntlmClient()(config);
    }
}

/**
 * factory method that produces the appropriate AuthClient
 * @param {Config} config 
 * @returns 
 */
function authClientFactory(config) {
    switch (config.credentialType) {
        case 'Windows': return new NtlmAuthClient(config);
        case 'NavUserPassword': return new BasicAuthClient(config);
        default: throw Error(`Unrecognized nav credential type ${config.credentialType}. Please use Windows or NavUserPassword`);
    }
}
module.exports = authClientFactory;


