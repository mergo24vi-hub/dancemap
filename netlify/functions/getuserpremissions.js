import {getStore} from "@netlify/blobs";

export default async function handler(req, context) {
    const url = new URL(req.url);
    const userid = url.searchParams.get("userid");
    console.log("userid:", userid);
    const store = getStore("main-store");
    const raw = await store.get("partyvoters");
    const partyvoters = raw !== null ? JSON.parse(raw) : [1,2,3];

    console.log(partyvoters.length, partyvoters[0])
    return new Response(JSON.stringify({canuservote: !partyvoters.includes(userid), userid, partyvoters}));
}