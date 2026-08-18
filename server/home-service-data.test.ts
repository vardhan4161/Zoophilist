import { describe, expect, it } from "vitest";
import { normaliseServiceList } from "../artifacts/zoophilist/src/lib/service-data";

describe("normaliseServiceList", () => {
  const fallback = [{ id: "fallback-service" }];

  it("uses the static catalog while API data is absent or malformed", () => {
    expect(normaliseServiceList(undefined, fallback)).toEqual(fallback);
    expect(normaliseServiceList({ services: [] }, fallback)).toEqual(fallback);
    expect(normaliseServiceList([], fallback)).toEqual(fallback);
  });

  it("uses a non-empty API response for the homepage service preview", () => {
    const apiServices = [{ id: "mongo-service" }];
    expect(normaliseServiceList(apiServices, fallback)).toEqual(apiServices);
  });
});
