import { getAccountSettings, monitorCodeStorage } from "./service";

export const monitor = async () => {
  const accountSettings = await getAccountSettings();
  await monitorCodeStorage(accountSettings);
};
