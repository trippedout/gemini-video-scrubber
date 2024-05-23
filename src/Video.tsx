import { useAtom } from "jotai";
import { videoElAtom, videoSrcAtom } from "./atoms";

export function Video() {
  const [, setVideoEl] = useAtom(videoElAtom);
  const [videoSrc] = useAtom(videoSrcAtom);

  return (
    <div className="w-full flex justify-center">
      {videoSrc ? (
        <video
          className="max-w-full max-h-[50vh]"
          ref={(ref) => {
            setVideoEl(ref);
          }}
          src={videoSrc} />
      ) : null}
    </div>
  );
}

