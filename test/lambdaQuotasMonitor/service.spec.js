import { assert } from "chai";
import * as service from "../../src/lambdaQuotasMonitor/service.js";
describe("service", () => {
  describe("isCodeStorageCloseToMaxUsage", () => {
    it("should return true if code storage is close to max usage", () => {
      const accountLimit = {
        TotalCodeSize: 100,
      };
      const accountUsage = {
        TotalCodeSize: 81,
      };
      const isCloseToMaxUsage = service.isCodeStorageCloseToMaxUsage(
        accountLimit,
        accountUsage
      );
      assert.isTrue(isCloseToMaxUsage);
    });
    it("should return false if code storage is not close to max usage", () => {
      const accountLimit = {
        TotalCodeSize: 100,
      };
      const accountUsage = {
        TotalCodeSize: 10,
      };
      const isCloseToMaxUsage = service.isCodeStorageCloseToMaxUsage(
        accountLimit,
        accountUsage
      );
      assert.isFalse(isCloseToMaxUsage);
    });
  });
});
