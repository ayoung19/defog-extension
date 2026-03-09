import iconOff from "data-base64:~assets/iconOff128.png";
import iconOn from "data-base64:~assets/iconOn128.png";

export async function setActionIcon(enabled: boolean) {
  await chrome.action.setIcon({
    path: { "128": enabled ? iconOn : iconOff },
  });
}
