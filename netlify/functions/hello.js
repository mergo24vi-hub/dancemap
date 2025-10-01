import {connectLambda, getStore} from "@netlify/blobs";

exports.handler = async (event, context) => {
    connectLambda(event);
    const store = getStore("main-store");
    return {
        statusCode: 200,
        body: JSON.stringify({message: 'Hello from server! ' + await store.getJSON("v")})
    };
};