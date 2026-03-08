import "@fontsource/jetbrains-mono";

import { DialogProvider } from "@/popup/components/providers/dialog-provider";
import { Popup } from "@/popup/popup";

import "./index.built.css";

function Index() {
  return (
    <DialogProvider>
      <Popup />
    </DialogProvider>
  );
}

export default Index;
