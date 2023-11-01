import { assert } from "chai";
import * as service from "../../src/requestQuotasIncrease/service";
import { services } from "../data/ListServicesResponse";
import * as sinon from "sinon";
import { ListServicesCommandOutput } from "@aws-sdk/client-service-quotas";

describe("service", () => {
  const sandbox = sinon.createSandbox();
  describe("getServiceCode", () => {
    afterEach(() => {
      sandbox.restore();
    });
    it("should filter in only the service required among the list of services", async () => {
      sandbox
        .stub(service, "listServices")
        .resolves(services as ListServicesCommandOutput);
      const serviceCode = await service.getServiceCode("service-name-1");
      assert.equal(serviceCode, services.Services[0].ServiceCode);
    });
    it("should throw error if more than one services has same", async () => {
      sandbox
        .stub(service, "listServices")
        .resolves(services as ListServicesCommandOutput);
      const serviceCode = await service.getServiceCode("service-name-1");
      assert.equal(serviceCode, services.Services[0].ServiceCode);
    });
  });
});
