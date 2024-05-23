import { useAtom } from "jotai";
import { playPositionAtom, timestampDefaultDurationAtom, timestampTextAtom } from "./atoms";
import { parseTimestamps, timestampToSeconds } from "./utils";

export function Annotations() {
  const [timestampText] = useAtom(timestampTextAtom);
  const [playPosition] = useAtom(playPositionAtom);
  const [defaultDuration] = useAtom(timestampDefaultDurationAtom);

  const timestamps = parseTimestamps(timestampText);
  const timestampSeconds = timestamps.map((tobject) => {
    return { 
      start: timestampToSeconds(tobject.start),
      end: tobject.end ? timestampToSeconds(tobject.end) : timestampToSeconds(tobject.start) + defaultDuration,
      annotation: tobject.annotation
    };
  });

  const activeAnnotation = timestampSeconds.find((range) => {
    return playPosition >= range.start && playPosition <= range.end;
  })?.annotation;

  return <div className="relative">
    <div className="absolute bottom-0 left-0 w-full h-16 text-white text-center">
      {activeAnnotation ? <span className="text-lg bg-neutral-800 bg-opacity-80 px-1">{activeAnnotation}</span> : null}
    </div>
  </div>;
}
