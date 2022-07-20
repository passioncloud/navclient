const axios = require('axios');
const { NtlmClient } = require('axios-ntlm');
const config = require('./config.js');

/** Base class for making authenticated requests to NAV */
class AuthClient {
}
class BasicAuthClient extends AuthClient {
    request(config) {
        config.headers = {
            ...config.headers,
            Authorization: this.basicAuthorizationValue
        };
        return axios(config);
    }
    get basicAuthorizationValue() {
        const username = config.navUsername;
        const password = config.navPassword;
        const cred = Buffer.from((username + ':' + password) || '').toString('base64');
        return 'Basic ' + cred;
    }
    ;
}
class NtlmAuthClient extends AuthClient {
    ntlmClient() {
        const username = config.navUsername;
        const password = config.navPassword;
        return NtlmClient({ username, password, domain: 'UGA' });
    }
    request(config) {
        return this.ntlmClient()(config);
    }
}
// factory method that produces the appropriate AuthClient
function authClientFactory() {
    switch (config.navCredentialType) {
        case 'Windows': return new NtlmAuthClient();
        case 'NavUserPassword': return new BasicAuthClient();
        default: throw Error(`Unrecognized nav credential type ${config.navCredentialType}. Please use Windows or NavUserPassword`);
    }
}
module.exports = authClientFactory;


