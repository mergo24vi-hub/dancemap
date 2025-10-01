import {getStore} from "@netlify/blobs";

export default async function handler(req, context) {
    const store = getStore("main-store");
    const raw = await store.get("v");
    const value = raw !== null ? JSON.parse(raw) : null;
    return new Response(JSON.stringify({ message: 'Hello from server! ' + value }));
}