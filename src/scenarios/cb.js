import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
    scenarios: {
        circuit_breaker_test: {
            executor: "constant-vus",
            vus: 20,
            duration: "20s",
        },
    },
};

const BASE_URL = "http://localhost:8080";

const TOKEN =
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3ODQwMzQxMjcsImlzcyI6InVzZXItc2VydmljZSIsInVzZXJfaWQiOjF9.Z1e96MSGUU4GoYjSwuciWrGZrrOaG_g53zzGp019wl4";

export default function () {
    const res = http.get(`${BASE_URL}/api/v1/auth/unstable-profile`, {
        headers: {
            Authorization: TOKEN,
        },
    });

    check(res, {
        "response received": (r) => r.status > 0,
    });

    console.log(`status=${res.status}`);

    sleep(0.2);
}