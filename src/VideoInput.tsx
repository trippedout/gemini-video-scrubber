import { useAtom } from "jotai";
import { videoSrcAtom, videoFileAtom, processedVideoAtom } from "./atoms";

export function VideoInput() {
  const [, setVideoSrc] = useAtom(videoSrcAtom);
  const [, setVideoFile] = useAtom(videoFileAtom);
  const [processedVideos] = useAtom(processedVideoAtom);

  return (
    <div>
      <input
        className="bg-neutral-700 p-4 pl-4 pr-8 mb-4"
        type="file"
        accept="video/*"
        onChange={(e) => {
          if (e.target.files) {
            const file = e.target.files[0];
            const src = URL.createObjectURL(file);
            console.log(src, file)
            setVideoFile(file)
            setVideoSrc(src);
          }
        }} />

      {/* {processedVideos.length > 0 ||
        <>
          <h2 className="text-xl">Previously used videos:</h2>
          <div />
        </>
      } */}
    </div >
  );
}

