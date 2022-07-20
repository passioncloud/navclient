const { Buffer } = require('node:buffer');
const makeSoapRequest = require('./soap.js');

class Report {
    reportBody;
    config;
    /**
     * @param {ReportBody} reportBody
     * @param {Config} config 
     * @returns 
     */
    constructor(reportBody, config) {
        this.reportBody = reportBody;
        this.config = config;
    }
    async report() {
        /** @type { SoapBody } */
        const soapBody = {
            "serviceName": "WS_Report",
            "serviceType": "Codeunit",
            "action": this.reportBody.reportName,
            "requestArgs": this.reportBody
        };
        const response = await makeSoapRequest(soapBody, this.config);
        const base64Text = response['return_value'];
        return Buffer.from(base64Text, 'base64');
    }
}



/**
 * @param {ReportBody} reportBody
 * @param {Config} config
 */
function reportBuffer(reportBody, config) {
    return new Report(reportBody, config).report();
}

module.exports = reportBuffer;

