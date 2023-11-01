/* https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/service-quotas/ */
import {
  ServiceQuotasClient,
  ListServicesCommand,
  ListServiceQuotasCommand,
  AppliedLevelEnum,
  RequestServiceQuotaIncreaseCommand,
  ServiceInfo,
  ListServicesCommandOutput,
  RequestServiceQuotaIncreaseCommandOutput,
} from "@aws-sdk/client-service-quotas";

/**
 *  To find the service code value for an Amazon Web Services service, use the ListServices operation.
 * @param serviceName the AWS service name of interest.
 * @returns
 */
export const getServiceCode = async (serviceName: string) => {
  const services = await getServices();
  const service = getServiceByName(services, serviceName);
  if (service.ServiceCode) {
    return service.ServiceCode;
  } else {
    throw new Error("no ServiceCode found for this service");
  }
};

export const getServices = async () => {
  let listServicesResult = await listServices();
  if (listServicesResult.Services) {
    const services = [];
    const recursiveResult = await getRecursiveResult(listServicesResult);
    services.push(...recursiveResult);
    return services;
  } else {
    throw new Error("no services listed");
  }
};

export const getRecursiveResult = async (
  listServicesResult: ListServicesCommandOutput
) => {
  if (listServicesResult.Services) {
    const services = [...listServicesResult.Services];
    let isNextToken = true;
    while (isNextToken) {
      if (listServicesResult.NextToken) {
        listServicesResult = await listServices(listServicesResult.NextToken);
        if (listServicesResult.Services) {
          services.push(...listServicesResult.Services);
        }
      } else {
        isNextToken = false;
      }
    }
    return services;
  } else {
    throw new Error("Something went wrong");
  }
};

export const getServiceByName = (
  services: ServiceInfo[],
  serviceName: string
) => {
  const serviceWithName = services.find((service) => {
    if (service.ServiceName === serviceName) {
      return service;
    }
  });
  if (serviceWithName !== undefined) {
    return serviceWithName;
  } else {
    throw new Error("Service not found");
  }
};

/**
 * To find the quota code for a specific quota, use the ListServiceQuotas operation, and look for the QuotaCode response in the output for the quota you want.
 * @param serviceCode the identifier of the related AWS service
 * @param quotaName the name of the quota you want to request an increase for
 * @returns the identifier of the quota you want to request an increase for
 */
export const getQuotaCodeByService = async (
  serviceCode: string,
  quotaName: string
) => {
  const serviceQuotas = await getQuotasCodesByService(serviceCode);
  console.log(serviceQuotas);
  if (serviceQuotas) {
    const filteredServiceQuotas = serviceQuotas.filter((serviceQuota) => {
      if (serviceQuota.QuotaName === quotaName) {
        return serviceQuota;
      }
    });
    if (filteredServiceQuotas[0]?.QuotaCode) {
      return filteredServiceQuotas[0].QuotaCode;
    } else {
      throw new Error("no QuotaCode found for the service quota");
    }
  } else {
    throw new Error("no quotas found for this service");
  }
};
export const listServices = async (nextToken?: string) => {
  const config = {};
  const client = new ServiceQuotasClient(config);
  const input = {
    // ListServicesRequest
    NextToken: nextToken,
  };
  const command = new ListServicesCommand(input);
  const response = await client.send(command);
  return response;
};

export const listServiceQuotas = async (
  serviceCode: string,
  nextToken?: string
) => {
  const config = {};
  const client = new ServiceQuotasClient(config);
  const input = {
    // ListServiceQuotasRequest
    ServiceCode: serviceCode, // required
    NextToken: nextToken,
    QuotaAppliedAtLevel: AppliedLevelEnum.ALL, // see https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-client-service-quotas/Variable/AppliedLevelEnum/
  };
  const command = new ListServiceQuotasCommand(input);
  const response = await client.send(command);

  return response;
};

export const getQuotasCodesByService = async (serviceCode: string) => {
  let listServiceQuotasResult = await listServiceQuotas(serviceCode);
  if (listServiceQuotasResult.Quotas) {
    const quotaCodes = [...listServiceQuotasResult.Quotas];
    let isNextToken = true;
    while (isNextToken) {
      if (listServiceQuotasResult.NextToken) {
        listServiceQuotasResult = await listServices(
          listServiceQuotasResult.NextToken
        );
        if (listServiceQuotasResult.Quotas) {
          quotaCodes.push(...listServiceQuotasResult.Quotas);
        }
      } else {
        isNextToken = false;
      }
    }
    return quotaCodes;
  }
};

export const requestServiceQuotaIncrease = async (
  quotaCode: string,
  serviceCode: string,
  desiredValue: number
) => {
  const config = {};
  const client = new ServiceQuotasClient(config);
  const input = {
    // RequestServiceQuotaIncreaseRequest
    ServiceCode: serviceCode, // required
    QuotaCode: quotaCode, // required
    DesiredValue: desiredValue, // required
  };
  const command = new RequestServiceQuotaIncreaseCommand(input);
  const response = await client.send(command);
  return response;
};

/* you could send the details to a slack channel, to an sns topic (to which an email address is subscribed) */
export const sendNotificationWithRequestStatus = async (
  response: RequestServiceQuotaIncreaseCommandOutput
) => {
  console.log(response);
};
