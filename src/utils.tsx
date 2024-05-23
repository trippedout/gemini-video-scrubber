export function secondsToTimestamp(seconds: number): string {
  let minutes = Math.floor(seconds / 60);
  let hours = null;
  if (minutes >= 60) {
    hours = Math.floor(minutes / 60);
    minutes = minutes % 60;
  }
  seconds = Math.floor((seconds % 60) * 10) / 10;
  return `${hours ? hours + ":" : ""}${minutes}:${seconds < 10 ? "0" : ""
    }${seconds}`;
}

type ParsedTimestamp = {
  start: string;
  end: string | null;
  annotation: string | null;
};
export function parseTimestamps(text: string): ParsedTimestamp[] {
  const parsed = text.split("\n").map((timestamp) => {
    const object: ParsedTimestamp = { start: '', end: null, annotation: null };
    let toParse = timestamp.trim();
    // handle annotation
    if (toParse.includes(" ")) {
      const annotationCheck = toParse.split(" ").slice(1).join(" ").trim();
      if (annotationCheck.length > 0) {
        toParse = toParse.split(" ")[0].trim();
        object.annotation = annotationCheck;
      } else {
        toParse = toParse.trim();
      }
    }
    // handle start and end
    if (toParse.includes("-")) {
      const [start, end] = toParse.split("-").map((t) => t.trim());
      object.start = start;
      object.end = end;
    } else {
      object.start = toParse;
    }
    return object;
  });
  return parsed;
}

export function timestampToSeconds(timestamp: string): number {
  const splits = timestamp.split(":");
  if (splits.length === 3) {
    return (
      Number(splits[0]) * 3600 + Number(splits[1]) * 60 + Number(splits[2])
    );
  } else if (splits.length === 2) {
    return Number(splits[0]) * 60 + Number(splits[1]);
  } else {
    return Number(splits[0]);
  }
}
