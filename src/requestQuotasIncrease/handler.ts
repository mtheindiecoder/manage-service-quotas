import {
  requestServiceQuotaIncrease,
  getServiceCode,
  getQuotaCodeByService,
  sendNotificationWithRequestStatus,
} from "./service";

/**
 * In order to request a quota increase using aws-sdk, you have to specified:
 * the new desired value for the quota,
 * the quota code and the service code.
 * docs: https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-client-service-quotas/Class/RequestServiceQuotaIncreaseCommand/
 * @param request the object that contains RequestServiceQuotaIncreaseCommandInput values
 */
export const requestQuotaIncrease = async (request: QuotaIncreaseRequest) => {
  const serviceCode = await getServiceCode(request.serviceName);
  console.log(serviceCode);
  const quotaCode = await getQuotaCodeByService(serviceCode, request.quotaName);
  console.log(quotaCode);
  const response = await requestServiceQuotaIncrease(
    quotaCode,
    serviceCode,
    request.desiredValue
  );
  await sendNotificationWithRequestStatus(response);
};

export interface QuotaIncreaseRequest {
  serviceName: string;
  quotaName: string;
  desiredValue: number;
}
