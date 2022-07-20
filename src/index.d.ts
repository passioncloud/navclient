const { Method } = require("axios");

/**
 * Example: {
 *  company: "Test Company",
 *  soapBaseUrl: "http://localhost:7047/BC140/WS/Test%20Company",
 *  odataBaseUrl: "http://localhost:7048/BC140/ODataV4",
 *  credentialType: "Windows",
 *  username: "JOHN",
 *  password: "John100"
 * }
 */
interface Config {
    company: string,
    soapBaseUrl: string,
    odataBaseUrl: string,
    credentialType: 'Windows' | 'NavUserPassword',
    username: string,
    password: string
}

interface SoapBody {
    action: string,
    serviceType: 'Codeunit' | 'Page'
    serviceName: string,
    requestArgs: Record<string, any>
}

interface OdataBody {
    method: Method,
    etag?: string,
    query: {
        serviceName: string,
        id?: string | Record<string, any>,
        count?: boolean,
        top?: number,
        skip?: number,
        // filter is an object / array. If object, it has properties: property, and one of these: endswith, startswith, equals, contains
        filter?: OdataQueryFilter,
        orderby?: OdataQueryOrderby,
        select?: string[],
        /**
         * boundedAction
         * For Odata V4 (> MS Dynamics 2018)
        * Note that this applies to OData V4 and above.
        * Version of NAV earlier than NAV 2018 use older Odata versions that do not support exposing 
        * functions as external services
        * Also, the action is not application to a collection. In our
        * case, an id parameter should also be provided to identify the resource.
        * Its a good thing we have this requirement of providing an id, it prevents us
        * from accidentally inserting a new record when we forget to specify a boundAction value
        * Also note that boundedActions begin with: "NAV." eg NAV.PerformPost
        * Moreover, in the json for the request body, ensure all your keys begin with a small letter, eg
        * use { requestId: 52 } and not { RequestId: 52 } lest you get a BadRequest error.
         */
        boundedAction?: string,
        /**
         *  json support
         * if you donot want to use json, and the web service eg for old NAV versions like NAV 2015
         * supports or defaults to xml, set property -> disableJson: true 
         **/
        disableJson?: boolean
    },
    json?: Record<string, any>
}

interface OdataQueryFilter {
    property: string;
    endswith?: string | number;
    startswith?: string | number;
    equals?: string | number;
    contains?: string | number
}

interface OdataQueryOrderby {
    property: string;
    isDescending: boolean
}

interface ReportBody {
    reportName: string, 
    ext: 'pdf'|'xlsx'|'docx',
    [index]: string
} 