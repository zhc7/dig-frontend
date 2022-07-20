import {defineEventHandler, setCookie, useBody} from "h3";


export default defineEventHandler ( async (event) => {
    console.log(event.req.headers);
    if (event.req.method === "POST") {
        const response = await $fetch.raw("http://localhost:5000" + event.req.url, {
            method: "POST",
            body: await useBody(event),
            headers: event.req.headers,
        })
        if (response.headers.get("set-cookie") ) {
            for (let cookie of response.headers.get('set-cookie').split(";")) {
                console.log(cookie);
                let [key, val] = cookie.split("=");
                console.log(key);
                console.log(val);
                setCookie(event.res, key, val);
            }
        }
        return response._data;
    } else if (event.req.method === "GET") {
        return await $fetch("http://localhost:5000" + event.req.url, {
            method: "GET",
            headers: event.req.headers
        })
    }
})