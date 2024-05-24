import { useState } from "react";
import {
  promptAtom,
  videoFileAtom,
  uploadResultAtom,
  timestampTextAtom,
  processedVideoAtom
} from "./atoms";
import { FileMetadataResponse } from "@google/generative-ai/files";
import { useAtom } from "jotai";

const post = async (url: string, body: string | FormData) => {
  const opts: RequestInit = {
    method: "POST",
    body,
  };
  if (typeof body === "string") {
    opts.headers = {
      "Content-Type": "application/json",
    };
  }
  const f = await fetch(url, opts);
  return await f.json();
};

export function Gemini() {
  const [videoFile] = useAtom(videoFileAtom);
  const [prompt, setPrompt] = useAtom(promptAtom);
  const [uploadResult, setUploadResult] = useAtom(uploadResultAtom);
  const [, setTimestampText] = useAtom(timestampTextAtom);
  const [processedVideos, setProcessedVideos] = useAtom(processedVideoAtom);

  const enum UploadState {
    Waiting = "",
    Uploading = "Uploading...",
    Processing = "Processing...",
    Processed = "Processed!",
    Failure = "Upload failed, please try again.",
  }
  const [state, setState] = useState<UploadState>(UploadState.Waiting);

  const enum MODEL {
    Gemini = "gemini-1.5-pro-latest",
    Flash = "gemini-1.5-flash-latest"
  }
  const [model, setModel] = useState(MODEL.Gemini);

  const CONCISE_PROMPT = "ONLY return the timestamps (in the format ##:##) and the descriptions, with no added commentary."
  const [useConcise, setUseConcise] = useState(true);
  const [sendingPrompt, setSendingPrompt] = useState(false);

  const handleUploadClick = async () => {
    console.log("upload:", videoFile);

    try {
      if (videoFile) {
        setState((_) => UploadState.Uploading);
        const formData = new FormData();
        formData.set("video", videoFile);
        const resp = await post("/api/upload", formData);
        console.log("uploadResult:", resp.data);
        setUploadResult((_) => resp.data);
        setState((_) => UploadState.Processing);
        checkProcessing(resp.data);
      }
    } catch (err) {
      console.error("Error Uploading Video", err);
    }
  };

  const checkProcessing = async (result: FileMetadataResponse) => {
    setTimeout(async () => {
      const progressResult = await post(
        "/api/progress",
        JSON.stringify({ result }),
      );
      const state = progressResult.progress.state;
      console.log("progress:", state);
      if (state == "ACTIVE") {

        setState((_) => UploadState.Processed);
      } else if (state == "FAILED") {
        setState((_) => UploadState.Failure);
      } else {
        setState((_) => UploadState.Processing);
        checkProcessing(result);
      }
    }, 5000);
  };

  const handlePromptKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && event.metaKey) {
      sendPrompt();
    }
  };

  const sendPrompt = async () => {
    if (state == UploadState.Processed && !sendingPrompt) {
      setSendingPrompt(true);

      let p = prompt;
      if (useConcise) {
        p += '\n' + CONCISE_PROMPT;
      }

      console.log("sendPrompt", uploadResult, p);

      const response = await post(
        "/api/prompt",
        JSON.stringify({
          uploadResult,
          prompt: p,
          model
        }),
      );
      setSendingPrompt(false);
      const modelResponse = response.text;
      setTimestampText(modelResponse.trim());
    }
  };

  const showConcise = () => {
    alert('Appends simple prompt for force response to only include timestamps and descriptions: "' +
      CONCISE_PROMPT + '"'
    )
  }

  return (
    <div className="mt-4">
      <button
        disabled={state == UploadState.Uploading || state == UploadState.Processing}
        className="bg-gray-500 enabled:hover:bg-gray-800 disabled:opacity-25 mr-4 font-bold py-2 px-4 rounded mb-4"
        onClick={handleUploadClick}
      >
        Upload to Gemini
      </button>
      <span>{state}</span>
      <div className="flex mb-4">
        <div className="w-full relative mr-4">
          <textarea
            disabled={sendingPrompt}
            className="w-full h-24 bg-neutral-800 p-2 pr-32 focus:outline-none flex-auto mr-4"
            name="prompt"
            placeholder="Prompt your video here, then cmd+enter to send once video is 'Processed!'"
            value={prompt}
            onKeyDown={handlePromptKeyDown}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button
            className="absolute top-2 right-2 bg-gray-500 enabled:hover:bg-gray-800 disabled:opacity-25 font-bold py-2 px-4 rounded"
            disabled={state != UploadState.Processed || sendingPrompt}
            onClick={sendPrompt}
          >Prompt!
          </button>
        </div>
        <div className="min-w-48">
          <div className="flex flex-col mb-4">
            <div className="flex">
              <input className="mr-4" type="radio" id="gemini" name="gemini" value={MODEL.Gemini} checked={model == MODEL.Gemini} onChange={() => { setModel(MODEL.Gemini) }} />
              <label htmlFor="gemini">Gemini 1.5 Pro</label>
            </div>
            <div className="flex">
              <input className="mr-4" type="radio" id="flash" name="flash" value={MODEL.Flash} checked={model == MODEL.Flash} onChange={() => { setModel(MODEL.Flash) }} />
              <label htmlFor="flash">Gemini Flash</label>
            </div>
          </div>
          <div className="flex items-center">
            <input type="checkbox" className="mr-2 h-10" checked={useConcise} onChange={() => setUseConcise(!useConcise)} />
            <span>Auto-format</span>
            <span className="google-symbols ml-2 cursor-pointer" onClick={showConcise}>help</span>
          </div>
        </div>
      </div>
    </div>
  );
}
