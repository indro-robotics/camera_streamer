import { PanelExtensionContext, RenderState, Topic} from "@foxglove/studio";
import { useLayoutEffect, useEffect, useState} from "react";
import ReactDOM from "react-dom";

import ReactPlayer from "./components/react-player/react-player";
// import InputGroup from "./components/input-group";

function ExamplePanel({ context }: { context: PanelExtensionContext }): JSX.Element {
  const [_topics, setTopics] = useState<readonly Topic[] | undefined>();
  // const [setMessages] = useState<readonly MessageEvent<unknown>[] | undefined>();
  // useScript("main.js")
  // const [url, setUrl] = useState<StringConstructor | undefined>();
  const [renderDone, setRenderDone] = useState<(() => void) | undefined>();
  const url = "http://10.13.13.22:8083/stream/front/channel/0/webrtc?uuid=front/&channel=0";
  // const options={
  //   parentElement: document.getElementById('player')
  // };
  // const player=new RTSPtoWEBPlayer(options);
  // const server='10.13.13.22:8083';//server and port where is running one of mediaserver
  // const uuid='front';//stream uuid
  // const channel=0;//stream channel optional
  // const source=`http://${server}/stream/${uuid}/channel/${channel}/webrtc?uuid=${uuid}/&channel=${channel}`;
  // We use a layout effect to setup render handling for our panel. We also setup some topic subscriptions.
  useLayoutEffect(() => {
    context.onRender = (renderState: RenderState, done) => {
      setRenderDone(() => done);
      setTopics(renderState.topics);
    };
    context.watch("currentFrame");

  }, []);

  // invoke the done callback once the render is complete
  useEffect(() => {

    renderDone?.();

  }, [renderDone]);

  return (
<div className="container mt-3">
            <h3 className="text-center">Simple Example RTSPtoWEB player React</h3>
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-header">
                            PLAYER
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
