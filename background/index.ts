import { Storage } from "@plasmohq/storage";

import { ENABLED_KEY } from "@/types/storage";

import { setActionIcon } from "./utils";

const storage = new Storage({ area: "local" });

async function setup() {
  const enabled = (await storage.get<boolean>(ENABLED_KEY)) ?? true;
  await setActionIcon(enabled);
}

chrome.runtime.onStartup.addListener(setup);
chrome.runtime.onInstalled.addListener(setup);
