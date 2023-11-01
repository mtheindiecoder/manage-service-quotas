/* client-lambda doc: https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/lambda/command/GetAccountSettingsCommand/ */
import {
  LambdaClient,
  GetAccountSettingsCommand,
  GetAccountSettingsCommandOutput,
  AccountLimit,
  AccountUsage,
} from "@aws-sdk/client-lambda";

export const getAccountSettings = async () => {
  const config = {}; // see LambdaClientConfig. https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-client-lambda/Interface/LambdaClientConfig/
  const client = new LambdaClient(config);
  const input = {};
  const command = new GetAccountSettingsCommand(input);
  const accountSettings = await client.send(command);
  return accountSettings;
};

export const monitorCodeStorage = async (
  accountSettings: GetAccountSettingsCommandOutput
) => {
  const accountLimit = accountSettings.AccountLimit;
  const accountUsage = accountSettings.AccountUsage;

  if (accountLimit && accountUsage) {
    if (isCodeStorageCloseToMaxUsage(accountLimit, accountUsage)) {
      const monitorDetail = getMonitorDetail(accountLimit, accountUsage);
      sendNotification(monitorDetail);
    }
    console.log(accountSettings);
  } else {
    throw new Error("AccountLimit or AccountUsage undefined");
  }
};

/**
 * REL01-BP06 Ensure that a sufficient gap exists between the current quotas and the maximum usage to accommodate failover.
 *  An appropriate gap could be 20%.
 * @param {AccountLimit} accountLimit Limits that are related to concurrency and code storage.
 * @param {AccountUsage} accountUsage The number of functions and amount of storage in use.
 * @returns boolean, true if the codeStorage is greater than 80% else otherwise
 */
export const isCodeStorageCloseToMaxUsage = (
  accountLimit: AccountLimit,
  accountUsage: AccountUsage
) => {
  const maxUsage = accountLimit.TotalCodeSize;
  const codeStorage = accountUsage.TotalCodeSize;

  const gap = 0.8;
  if (codeStorage && maxUsage) {
    return codeStorage / maxUsage >= gap;
  } else {
    throw new Error("actual code storage or code storage limit undefined");
  }
};

export const getMonitorDetail = (
  accountLimit: AccountLimit,
  accountUsage: AccountUsage
) => {
  const codeStorage = accountUsage.TotalCodeSize;
  const codeStorageLimit = accountLimit.TotalCodeSize;
  if (codeStorage && codeStorageLimit) {
    const usagePercentage = codeStorage / codeStorageLimit;
    return {
      codeStorage,
      codeStorageLimit,
      usagePercentage,
    };
  } else {
    throw new Error("actual code storage or code storage limit undefined");
  }
};

/*
 * you could send the details to a slack channel, to an sns topic (to which an email address is subscribed) or using
 * data to create your own dashboard.
 */
export const sendNotification = (detail: MonitorDetail) => {
  console.log(detail);
};

export interface MonitorDetail {
  codeStorage: number;
  codeStorageLimit: number;
  usagePercentage: number;
}
