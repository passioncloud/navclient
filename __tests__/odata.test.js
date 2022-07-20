const { describe, it, expect } = require("@jest/globals");
const { soap, odata } = require("../src");

/** @type { Config } */
const config = {
    company: "Demo Company",
    credentialType: "Windows",
    odataBaseUrl: "http://localhost:7048/BC140/ODataV4",
    soapBaseUrl: "http://localhost:7047/BC140/WS/Demo%20Company",
    username: "SSG",
    password: "Lynn100"
}

describe('odata', () => {
    it('fetches employee list using odata', async () => {
        const response = await odata({
            method: 'GET',
            query: {
                serviceName: 'Employee',
                count: true,
                filter: {
                    property: 'First_Name',
                    startswith: 'B'
                },
                top: 2
            }
        }, config);
        // console.log(response);
        expect(response.value).toHaveLength(2);
    });
})