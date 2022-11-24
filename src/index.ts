import { ExtensionContext } from "@foxglove/studio";
import { initStreamerPanel } from "./StreamerPanel";

export function activate(extensionContext: ExtensionContext): void {
  extensionContext.registerPanel({ name: "camera-streamer", initPanel: initStreamerPanel });
}
