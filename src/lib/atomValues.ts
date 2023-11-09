import { InputData } from "./types";
import { atom } from 'jotai';
import { settings } from "@/settings/global";
const ImageAtom = atom<InputData>({ uri: null, maskLUri: settings.default.mask.uriL, maskRUri: settings.default.mask.uriR, minConfidence: settings.default.confidence, filename: null, maskAdjust: settings.default.mask.widthAdjust, flip: settings.default.flip, showMask: settings.default.showMask, showLM: settings.default.showLM, maskType: 0, enlarge: settings.default.enlarge });
export {ImageAtom}