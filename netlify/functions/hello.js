import {getStore} from "@netlify/blobs";

exports.handler = async (event, context) => {
    const store = getStore("main-store");
    return {
        statusCode: 200,
        body: JSON.stringify({message: 'Hello from server! ' + await store.getJSON("v")})
    };
};