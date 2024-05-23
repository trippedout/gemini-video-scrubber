import { useAtom } from "jotai";
import { videoSrcAtom, videoFileAtom } from "./atoms";

export function VideoInput() {
  const [, setVideoSrc] = useAtom(videoSrcAtom);
  const [, setVideoFile] = useAtom(videoFileAtom);

  return (
    <>
      <input
        className="bg-neutral-700 p-4 pl-4 pr-8"
        type="file"
        accept="video/*"
        onChange={(e) => {
          if (e.target.files) {
            const file = e.target.files[0];
            setVideoFile(file)
            setVideoSrc(URL.createObjectURL(file));
          }
        }} />
    </>
  );
}

