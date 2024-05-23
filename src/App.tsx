import { useAtom } from "jotai";
import {
  videoElAtom,
} from "./atoms";
import { VideoInput } from "./VideoInput";
import { Video } from "./Video";
import { VideoState } from "./VideoState";
import { Controls } from "./Controls";
import { Timelines } from "./Timelines";
import { ClickableTimestamps } from "./ClickableTimestamps";
import { TimestampText } from "./TimestampText";
import { Annotations } from "./Annotations";
import { Gemini } from "./Gemini";

function App() {
  const [videoEl] = useAtom(videoElAtom);

  return (
    <>
      <h1 className="text-xl mb-6">Gemini Video Scrubber</h1>
      <Video />
      {videoEl ?
        <>
          <Annotations />
          <Controls />
          <Timelines />
          <ClickableTimestamps />
          <VideoState />
          <Gemini />
          <TimestampText />
        </> : <VideoInput />
      }
    </>
  );
}

export default App;
