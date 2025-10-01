import {connectLambda, getStore} from "@netlify/blobs";

exports.handler = async (event, context) => {
    connectLambda(event);
    const store = getStore("main-store");
    const raw = await store.get("v");
    const value = raw !== null ? JSON.parse(raw) : null;
    return {
        statusCode: 200,
        body: JSON.stringify({message: 'Hello from server! ' + value})
    };
};
