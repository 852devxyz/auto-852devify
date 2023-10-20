import { InputData } from "./types";
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { masks } from "@/settings/masks";
const ImageAtom = atom<InputData>({ uri: null, maskLUri: masks.noggles1.uriL, maskRUri: masks.noggles1.uriR, minConfidence: 0.30, filename: null, maskAdjust: masks.noggles1.widthAdjust, flip: true, showMask: true, showLM: false });

export {ImageAtom}