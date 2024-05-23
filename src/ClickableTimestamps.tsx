import { useAtom } from "jotai";
import {
  padStartAtom,
  timelineScrollRefAtom,
  timeoutRefAtom,
  timestampDefaultDurationAtom,
  timestampTextAtom,
  videoElAtom,
  videoLengthAtom
} from "./atoms";
import {
  parseTimestamps,
  timestampToSeconds
} from "./utils";
import { secondWidth } from "./consts";

export function ClickableTimestamps() {
  const [timestampText] = useAtom(timestampTextAtom);
  const [videoEl] = useAtom(videoElAtom);
  const player = videoEl!;
  const [padStart] = useAtom(padStartAtom);
  const [timelineScrollRef] = useAtom(timelineScrollRefAtom);
  const [videoLength] = useAtom(videoLengthAtom);
  const [timeoutRef] = useAtom(timeoutRefAtom);
  const [defaultDuration] = useAtom(timestampDefaultDurationAtom);

  const scrollEl = timelineScrollRef.current!;

  const timestamps = parseTimestamps(timestampText);
  const timestampSeconds = timestamps.map((tobject) => {
    return {
      start: timestampToSeconds(tobject.start),
      end: tobject.end ? timestampToSeconds(tobject.end) : timestampToSeconds(tobject.start) + defaultDuration,
      annotation: tobject.annotation
    };
  });

  return (
    <div className="flex flex-wrap gap-1 p-1">
      {timestamps.map((tobject, i) => {
        return (
          <div
            key={`${tobject.start}-${i}`}
            className="bg-neutral-600 hover:bg-neutral-500 select-none cursor-pointer px-1"
            onClick={() => {
              const { start, end } = timestampSeconds[i];
              const timelineWidth = videoLength * secondWidth;
              const playPositionLeft = (start / player.duration) * timelineWidth;
              if (playPositionLeft < scrollEl.scrollLeft) {
                scrollEl.scrollLeft = playPositionLeft - 64;
              } else if (playPositionLeft + 64 >
                scrollEl.scrollLeft + scrollEl.clientWidth) {
                scrollEl.scrollLeft =
                  playPositionLeft - 64;
              }
              if (timeoutRef.current) {
                window.clearTimeout(timeoutRef.current);
              }
              player.play();
              player.currentTime = start - padStart;
              timeoutRef.current = window.setTimeout(
                () => {
                  player.pause();
                  player.currentTime = end;
                },
                (end - start + padStart) * 1000
              );
            }}
          >
            {tobject.start}{tobject.end ? `-${tobject.end}` : ""} {tobject.annotation ? `${tobject.annotation}` : ""}
          </div>
        );
      })}
    </div>
  );
}

