const { describe, it, expect } = require("@jest/globals");
const { soap } = require("../src");

/** @type { Config } */
const config = {
    company: "Demo Company",
    credentialType: "Windows",
    odataBaseUrl: "http://localhost:7048/BC140/ODataV4",
    soapBaseUrl: "http://localhost:7047/BC140/WS/Demo%20Company",
    username: "SSG",
    password: "Lynn100"
}

describe('soap', () => {
    it('fetches employee list using soap', async () => {
        const response = await soap({
            action: "ReadMultiple",
            serviceType: "Page",
            serviceName: "Employee",
            requestArgs: {
                filter: [
                    {
                        Field: 'First_Name',
                        Criteria: "B*"
                    }
                ],
                setSize: 2
            }
        }, config);
        // console.log(response);
        expect(response['ReadMultiple_Result']['Employee']).toHaveLength(2);
    });
})