import http from "k6/http";
import { Counter } from "k6/metrics";
import { config } from "../../config.js";

export const rateLimited = new Counter("rate_limited");

function loginRequest() {
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

  if (res.status === 429) {
    rateLimited.add(1);
  }

  return res;
}

export const options = {
  scenarios: {
    below_limit: {
      executor: "constant-arrival-rate",
      rate: 8,
      timeUnit: "1s",
      duration: "60s",
      preAllocatedVUs: 20,
      exec: "belowLimit",
    },

    above_limit: {
      executor: "constant-arrival-rate",
      rate: 12,
      timeUnit: "1s",
      duration: "60s",
      preAllocatedVUs: 20,
      startTime: "70s",
      exec: "aboveLimit",
    },
  },
};

export function belowLimit() {
  loginRequest();
}

export function aboveLimit() {
  loginRequest();
}
