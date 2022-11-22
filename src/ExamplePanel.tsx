import { PanelExtensionContext, RenderState, SettingsTree, SettingsTreeAction, Topic} from "@foxglove/studio";
import { useLayoutEffect, useEffect, useState} from "react";
import ReactDOM from "react-dom";
import ReactPlayer from "./components/react-player/react-player";

type State = {
  url: string;
  Title: string;
};

function ExamplePanel({ context}: { context: PanelExtensionContext}): JSX.Element {
  const [_topics, setTopics] = useState<readonly Topic[] | undefined>();
  const [state, setState] = useState<State>({ url: "http://10.13.13.22:8083/stream/front/channel/0/webrtc?uuid=front/&channel=0", Title: "Front"});
  // var [panelTitle] = useState<string | undefined>();
  // const [setMessages] = useState<readonly MessageEvent<unknown>[] | undefined>();
  // useScript("main.js")
  // const [url, setUrl] = useState<StringConstructor | undefined>();
  const [renderDone, setRenderDone] = useState<(() => void) | undefined>();
  const url = "";
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
            value: state.Title,
          },
          url: {
            label: "URL",
            input: "string",
            // `panelTitle` refers to a value in your extension panel's config
            value: state.url,
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
            setState({ ...state, Title: action.payload.value as string });
            console.log("panelTitle", panelTitle);
          } else if (action.payload.path[0] === "general" && action.payload.path[1] === "url") {
            // Read action.payload.value for the new panel title value
            setState({ ...state, url: action.payload.value as string });
            console.log("url", url);
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
                            {state.Title}
                        </div>
                        <div className="card-body p-0">
                            <ReactPlayer url={state.url}/>
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
