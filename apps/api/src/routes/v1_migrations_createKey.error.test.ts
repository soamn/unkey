import { expect, test } from "vitest";

import { randomUUID } from "node:crypto";
import type { ErrorResponse } from "@/pkg/errors";
import { schema } from "@unkey/db";
import { newId } from "@unkey/id";
import { IntegrationHarness } from "src/pkg/testutil/integration-harness";

import type {
  V1MigrationsCreateKeysRequest,
  V1MigrationsCreateKeysResponse,
} from "./v1_migrations_createKey";

test("when the api does not exist", async (t) => {
  const h = await IntegrationHarness.init(t);
  const apiId = newId("api");

  const root = await h.createRootKey([`api.${apiId}.create_key`]);
  /* The code snippet is making a POST request to the "/v1/keys.createKey" endpoint with the specified headers. It is using the `h.post` method from the `Harness` instance to send the request. The generic types `<V1MigrationsCreateKeysRequest, V1MigrationsCreateKeysResponse>` specify the request payload and response types respectively. */

  const res = await h.post<V1MigrationsCreateKeysRequest, V1MigrationsCreateKeysResponse>({
    url: "/v1/migrations.createKeys",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${root.key}`,
    },
    body: [
      {
        start: "x",
        hash: {
          value: "x",
          variant: "sha256_base64",
        },
        apiId,
      },
    ],
  });
  expect(res.status, `received: ${JSON.stringify(res)}`).toEqual(404);
  expect(res.body).toMatchObject({
    error: {
      code: "NOT_FOUND",
      docs: "https://unkey.dev/docs/api-reference/errors/code/NOT_FOUND",
      message: `api ${apiId} not found`,
    },
  });
});

test("when the api has no keyAuth", async (t) => {
  const h = await IntegrationHarness.init(t);
  const apiId = newId("api");
  await h.db.primary.insert(schema.apis).values({
    id: apiId,
    name: randomUUID(),
    workspaceId: h.resources.userWorkspace.id,
  });

  const root = await h.createRootKey([`api.${apiId}.create_key`]);

  const res = await h.post<V1MigrationsCreateKeysRequest, V1MigrationsCreateKeysResponse>({
    url: "/v1/migrations.createKeys",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${root.key}`,
    },
    body: [
      {
        start: "x",
        hash: {
          value: "x",
          variant: "sha256_base64",
        },
        apiId,
      },
    ],
  });
  expect(res.status).toEqual(412);
  expect(res.body).toMatchObject({
    error: {
      code: "PRECONDITION_FAILED",
      docs: "https://unkey.dev/docs/api-reference/errors/code/PRECONDITION_FAILED",
      message: `api ${apiId} is not setup to handle keys`,
    },
  });
});

test("reject invalid ratelimit config", async (t) => {
  const h = await IntegrationHarness.init(t);
  const { key } = await h.createRootKey(["*"]);

  const res = await h.post<V1MigrationsCreateKeysRequest, ErrorResponse>({
    url: "/v1/migrations.createKeys",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: [
      {
        start: "x",
        hash: {
          value: "x",
          variant: "sha256_base64",
        },
        apiId: h.resources.userApi.id,
        ratelimit: {
          // @ts-expect-error
          type: "x",
        },
      },
    ],
  });

  expect(res.status).toEqual(400);
  expect(res.body.error.code).toEqual("BAD_REQUEST");
});
