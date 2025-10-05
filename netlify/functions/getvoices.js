import {getStore} from "@netlify/blobs";

export default async function handler(req, context) {
    const url = new URL(req.url);
    const userid = url.searchParams.get("pollid");
    console.log("pollid:", pollid);
    const store = getStore("main-store");
    const raw = await store.get("partyvoices");
    const partyvoters = raw !== null ? JSON.parse(raw) : {
        "2025-10-05-kyiv-signal-event-hall-bachata-party":0,
        "2025-10-05-kyiv-campus-community-latin-party":0,
        "2025-10-05-kyiv-ravado-studio-kizomba-party":0
    }

    console.log(partyvoters.length, partyvoters[0])
    return new Response(JSON.stringify())
}