import { FileMetadataResponse } from "@google/generative-ai/files";
import { atomWithStorage } from "jotai/utils"
import { atom } from "jotai";

export const videoFileAtom = atom<File | null>(null);
export const videoSrcAtom = atom<string | null>(null);
export const videoElAtom = atom<HTMLVideoElement | null>(null);
export const isPlayingAtom = atom<boolean>(false);
export const playPositionAtom = atom<number>(0);
export const videoLengthAtom = atom<number>(0);
export const timestampTextAtom = atom("");
export const timestampDefaultDurationAtom = atom<number>(1.5);
export const padStartAtom = atom<number>(0.2);
export const timelineScrollRefAtom = atom<{ current: HTMLDivElement | null }>({
  current: null,
});
export const timeoutRefAtom = atom<{ current: number }>({ current: 0 });
export const isPlayingAllAtom = atom<boolean>(false);
export const uploadResultAtom = atom<FileMetadataResponse | null>(null);
export const promptAtom = atom<string>("");
export const processedVideoAtom = atomWithStorage('processedVideos', [])