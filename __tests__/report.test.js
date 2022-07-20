const { describe, it, expect } = require("@jest/globals");
const { reportBuffer } = require("../src");
const fs = require('fs');

/** @type { Config } */
const config = {
    company: "Demo Company",
    credentialType: "Windows",
    odataBaseUrl: "http://localhost:7048/BC140/ODataV4",
    soapBaseUrl: "http://localhost:7047/BC140/WS/Demo%20Company",
    username: "SSG",
    password: "Lynn100"
}

describe('report', () => {
    it('generates a report', async () => {
        // download url will look like:  `${process.env.REACT_APP_API}/report?reportName=${reportName}&status=${status}&ext=${ext}&periodId=${periodId}&employeeNo=${employeeNo}&tenantId=${tenantId}`;
        // http://20.233.7.163:4000/report?reportName=MyTimesheetReport&status=Approved&ext=pdf&periodId=06-2022&employeeNo=KL135&tenantId=AVSI
        const responseBuffer = await reportBuffer({
                ext: 'pdf',
                reportName: 'MyTimesheetReport',
                status: 'Approved',
                periodId: '11-2021',
                employeeNo: 'GU036'
            }, config);
        // console.log(responseBuffer);
        // console.log(responseBuffer.byteLength)
        expect(responseBuffer.byteLength).toBeGreaterThan(1000);
        const destination = './__tests__/report.pdf';
        const writeStream = fs.createWriteStream(destination);
        writeStream.write(responseBuffer);
        writeStream.end();
    });
})