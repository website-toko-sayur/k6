import http from "k6/http";
import { check } from "k6";
import { config } from "../../config.js";

export function login() {
  const res = http.post(
    `${config.auth.baseUrl}/api/v1/signin`,
    JSON.stringify({
      username: config.credentials.username,
      password: config.credentials.password,
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  check(res, {
    "login success": (r) => r.status === 200,
  });

  if (res.status !== 200) {
    throw new Error(`Login failed: ${res.status} - ${res.body}`);
  }

  const body = res.json();

  if (!body?.data?.access_token) {
    throw new Error(`Access token not found: ${res.body}`);
  }

  return body.data.access_token;
}
