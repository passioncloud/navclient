const { XMLBuilder, XMLParser } = require('fast-xml-parser');
const NavClient = require('./nav-client.js');

class SoapClient extends NavClient {
    /**
     * @param {SoapBody} soapBody 
     * @returns { Promise<any> }
     */
    request(soapBody) {
        const {
            serviceType,
            serviceName,
            action
        } = soapBody;
        const body = this.xmlBodyFor(soapBody);
        const config = {
            method: 'post',
            url: `${this.url}/${serviceType}/${serviceName}`,
            headers: {
                'Content-Type': 'text/xml;',
                SOAPAction: '""'
            },
            data: body
        };
        const self = this;
        return this.axios(config).then(function (response) {
            return self.parseSoapResponse(response.data, action);
        }, function (error) {
            // if (error) console.error(error); // the big error msg
            throw self.enrichError(error);
        });
    }
    /**
     *
     * @param {import('axios').AxiosError} error
     * @returns
     */
    enrichError(error) {
        let body, statusCode, statusMessage;
        if (error.response) {
            console.info(Object.keys(error.response));
            console.info(Object.values(error.response));
            console.info(Object.keys(error.response.config));
            try {
                body = JSON.parse(this.parseSoapErrorResponse(error.response.data));
                statusMessage = body['faultstring'] || error.response.statusText;
                statusMessage = this.cleanStatusMessage(statusMessage);
            }
            catch (e) {
                body = this.parseSoapErrorResponse(error.response.data);
                statusMessage = JSON.parse(body)['faultstring'] || error.response.statusText;
            }
            statusCode = error.response.status;
        }
        else {
            body = error.message;
            statusCode = 500;
            statusMessage = error.message;
        }
        return Error(JSON.stringify({ body, statusCode, statusMessage }));
    }
    /**
     *
     * @param {any} data
     * @param {string} action
     * @returns {string} parsed soap response
     */
    parseSoapResponse(data, action) {
        const obj = this.jsonObjFor(data);
        try {
            const body = obj['Soap:Envelope']['Soap:Body'][`${action}_Result`];
            // console.log('body is ', body);
            return JSON.stringify(body);
        }
        catch (e) {
            console.info('soap response is', this.jsonObjFor(data));
            console.error(e);
            throw e;
        }
    }
    parseSoapErrorResponse(data) {
        const obj = this.jsonObjFor(data);
        try {
            const body = obj['s:Envelope']['s:Body']['s:Fault'];
            return JSON.stringify(body);
        }
        catch (e) {
            return JSON.stringify(obj);
        }
    }
    /**
     * @see https://www.w3.org/TR/2000/NOTE-SOAP-20000508/#_Toc478383497
     * @param {*} param0
     */
    xmlBodyFor({ serviceType, serviceName, action, requestArgs }) {
        const result = `
        <soap:Envelope 
            xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
            >
            <soap:Header />
            <soap:Body xmlns="${this.namespaceFor(serviceType, serviceName)}">
                <${action}>
                    ${this.xmlFor(requestArgs)}
                </${action}>
            </soap:Body>
        </soap:Envelope>
    `;
        console.warn(this.namespaceFor(serviceType, serviceName));
        return result;
    }
    namespaceFor(serviceType, serviceName) {
        switch (serviceType) {
            case 'Codeunit':
                return `urn:microsoft-dynamics-schemas/codeunit/${serviceName}`;
            case 'Page':
                return `urn:microsoft-dynamics-schemas/page/${serviceName.toLowerCase()}`;
        }
        throw Error(`Invalid serviceType ${serviceType}, should be Codeunit or Page`);
    }
    /**
     *
     * @param {string} xml
     * @returns javascript json object
     */
    jsonObjFor(xml) {
        return new XMLParser().parse(xml);
    }
    xmlFor(obj) {
        return new XMLBuilder({}).build(obj);
    }
    get url() {
        return this.config.soapBaseUrl;
    }
}

/**
 * 
 * @param {SoapBody} soapBody 
 * @param {Config} config 
 * @returns 
 */
async function makeSoapRequest(soapBody, config) {
    const soapClient = new SoapClient(config);
    return soapClient.request(soapBody);
}

module.exports.makeSoapRequest = makeSoapRequest;



