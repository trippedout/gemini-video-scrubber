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

// Validates if a string is in mm:ss format
function isValidTimestamp(timestamp: string): boolean {
  const timeRegex = /^(?:[0-5][0-9]):(?:[0-5][0-9])$/;
  return timeRegex.test(timestamp.trim());
}

// Extracts timestamp and annotation from a string
function extractTimestampAndAnnotation(text: string): { timestamp: string, annotation: string | null } {
  // Remove any brackets if present
  const withoutBrackets = text.replace(/[\[\]]/g, '').trim();
  
  // Try different delimiters
  const delimiters = [',', '-', ' '];
  for (const delimiter of delimiters) {
    const parts = withoutBrackets.split(delimiter);
    if (parts.length > 1) {
      const potentialTimestamp = parts[0].trim();
      if (isValidTimestamp(potentialTimestamp)) {
        return {
          timestamp: potentialTimestamp,
          annotation: parts.slice(1).join(delimiter).trim()
        };
      }
    }
  }

  // If no delimiter found, check if the entire string is a timestamp
  if (isValidTimestamp(withoutBrackets)) {
    return {
      timestamp: withoutBrackets,
      annotation: null
    };
  }

  return {
    timestamp: '',
    annotation: null
  };
}

export function parseTimestamps(text: string): ParsedTimestamp[] {
  if (!text.trim()) {
    return [];
  }

  const parsed = text.split("\n")
    .map((line) => {
      const object: ParsedTimestamp = { start: '', end: null, annotation: null };
      const trimmedLine = line.trim();
      
      if (!trimmedLine) {
        return object;
      }

      // Check for timestamp range (e.g., "00:10-00:15")
      if (trimmedLine.includes('-')) {
        const [startPart, endPart] = trimmedLine.split('-');
        const startResult = extractTimestampAndAnnotation(startPart);
        const endResult = extractTimestampAndAnnotation(endPart);

        if (startResult.timestamp && endResult.timestamp) {
          object.start = startResult.timestamp;
          object.end = endResult.timestamp;
          object.annotation = endResult.annotation || startResult.annotation;
          return object;
        }
      }

      // Handle single timestamp
      const { timestamp, annotation } = extractTimestampAndAnnotation(trimmedLine);
      object.start = timestamp;
      object.annotation = annotation;
      return object;
    })
    .filter(obj => obj.start && isValidTimestamp(obj.start) && (!obj.end || isValidTimestamp(obj.end)));

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
