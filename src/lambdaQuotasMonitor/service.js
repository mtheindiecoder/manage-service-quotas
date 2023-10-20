/* client-lambda doc: https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/lambda/command/GetAccountSettingsCommand/ */
import {
  LambdaClient,
  GetAccountSettingsCommand,
} from "@aws-sdk/client-lambda";

export const getAccountSettings = async () => {
  const config = {}; // see LambdaClientConfig. https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/Package/-aws-sdk-client-lambda/Interface/LambdaClientConfig/
  const client = new LambdaClient(config);
  const input = {};
  const command = new GetAccountSettingsCommand(input);
  const accountSettings = await client.send(command);
  return accountSettings;
};

export const monitorCodeStorage = async (accountSettings) => {
  const accountLimit = accountSettings.AccountLimit;
  const accountUsage = accountSettings.AccountUsage;

  if (isCodeStorageCloseToMaxUsage(accountLimit, accountUsage)) {
    const details = getMonitorDetails(accountLimit, accountUsage);
    sendNotification(details);
  }
  console.log(accountSettings);
};

/**
 * REL01-BP06 Ensure that a sufficient gap exists between the current quotas and the maximum usage to accommodate failover.
 *  An appropriate gap could be 20%.
 * @param {AccountLimit} accountLimit Limits that are related to concurrency and code storage.
 * @param {AccountUsage} accountUsage The number of functions and amount of storage in use.
 * @returns boolean, true if the codeStorage is greater than 80% else otherwise
 */
export const isCodeStorageCloseToMaxUsage = (accountLimit, accountUsage) => {
  const maxUsage = accountLimit.TotalCodeSize;
  const codeStorage = accountUsage.TotalCodeSize;

  const gap = 0.8;
  return codeStorage / maxUsage > gap;
};

export const getMonitorDetails = (accountLimit, accountUsage) => {
  return {
    codeStorage: accountUsage.TotalCodeSize,
    codeStorageLimit: accountLimit.TotalCodeSize,
    usagePercentage: codeStorage / maxUsage,
  };
};

/*
 * you could send the details to a slack channel, to an sns topic (to which an email address is subscribed) or using
 * data to create your own dashboard.
 */
export const sendNotification = (details) => {
  console.log(details);
};
