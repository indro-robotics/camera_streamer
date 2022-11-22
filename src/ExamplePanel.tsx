import { PanelExtensionContext, RenderState, SettingsTree, SettingsTreeAction, Topic} from "@foxglove/studio";
import { useLayoutEffect, useEffect, useState} from "react";
import ReactDOM from "react-dom";
import ReactPlayer from "./components/react-player/react-player";


function ExamplePanel({ context}: { context: PanelExtensionContext}): JSX.Element {
  const [_topics, setTopics] = useState<readonly Topic[] | undefined>();
  // var [panelTitle] = useState<string | undefined>();
  // const [setMessages] = useState<readonly MessageEvent<unknown>[] | undefined>();
  // useScript("main.js")
  // const [url, setUrl] = useState<StringConstructor | undefined>();
  const [renderDone, setRenderDone] = useState<(() => void) | undefined>();
  const url = "http://10.13.13.22:8083/stream/front/channel/0/webrtc?uuid=front/&channel=0";
  var panelTitle = "Camera Streamer";

  useLayoutEffect(() => {
    context.onRender = (renderState: RenderState, done) => {
      setRenderDone(() => done);
      setTopics(renderState.topics);
    };
    context.watch("currentFrame");
    // context.updatePanelSettingsEditor(panelSettings);

  }, []);

  
  const panelSettings: SettingsTree = {
    nodes: {
      general: {
        label: "General",
        fields: {
          title: {
            label: "Title",
            input: "string",
            // `panelTitle` refers to a value in your extension panel's config
            value: panelTitle,
          },
        },
      },
    },
    actionHandler: (action: SettingsTreeAction) => {
      switch (action.action) {
        case "perform-node-action":
          // Handle user-defined actions for nodes in the settings tree
          break;
        case "update":
          if (action.payload.path[0] === "general" && action.payload.path[1] === "title") {
            // Read action.payload.value for the new panel title value
            let panelTitle = String(action.payload.value);
            console.log("panelTitle", panelTitle);
  
            // Update your panel's state accordingly
            // context.updatePanelSettingsEditor(panelSettings)
          }
          break;
      }
    },
  }
  context.updatePanelSettingsEditor(panelSettings);
  // invoke the done callback once the render is complete
  useEffect(() => {
    // context.updatePanelSettingsEditor(panelSettings);
    renderDone?.();

  }, [renderDone, panelSettings]);
  return (
      <div className="container mt-3">
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header">
                            {panelTitle}
                        </div>
                        <div className="card-body p-0">
                            <ReactPlayer url={url}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>

  );
}

export function initExamplePanel(context: PanelExtensionContext): void {
  ReactDOM.render(<ExamplePanel context={context} />, context.panelElement);
}
