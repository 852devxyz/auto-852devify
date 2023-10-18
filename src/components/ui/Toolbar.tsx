
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { InputData } from '../types';
import { ImageAtom } from '../atomValues';
import { masks } from '../../settings/masks';
import { useState } from 'react';
export function Toolbar() {
  const imgbtnStyle = { "width": "50px" };
  const setImageAtom = useSetAtom(ImageAtom);
  const { minConfidence, flip, showMask, showLM } = useAtomValue(ImageAtom);
  
  const [minConf, setminConf] = useState(0.35);
  const maskList = [masks.noggles1, masks.noggles2, masks.noggles3];
  function ToolbarHandler(e: any, widthAdjust: number) {
    console.log("ToolbarHandler", e.target.getAttribute("src"));
    setImageAtom((prev) => ({ ...prev, maskUri: e.target.getAttribute("src"), maskAdjust: widthAdjust }));
  }

  function chkHandler(e: any, chkKey: string) {
    console.log("chkHandler", chkKey, e.target?.checked);
    if (chkKey == "flip") {
      setImageAtom((prev) => ({ ...prev, flip: e.target?.checked }));
    }

    if (chkKey == "showMask") {
      setImageAtom((prev) => ({ ...prev, showMask: e.target?.checked }));

    }

    if (chkKey == "showLM") {
      setImageAtom((prev) => ({ ...prev, showLM: e.target?.checked }));
    }

  }

  function minConfidenceHandler(e: any) {
    console.log("minConfidenceHandler", e.target.value);
    //setminConf(e.target.value);
    setImageAtom((prev) => ({ ...prev, minConfidence: parseFloat(e.target.value) }));
  }
  const buttonList = maskList.map(m => (
    <button className="px-2 border-2 ml-2" key={m.uri}>
      <img src={m.uri} style={imgbtnStyle} onClick={(e) => ToolbarHandler(e, m.widthAdjust)} />
    </button>
  ))
  return (
    <>
      <div className="flex flex-row mr-2">
        <span className="relative top-1/4 mr-2">Min. Conf.</span>
        <input className="shadow rounded w-12" name="minConfidence" type="number" value={minConfidence} step="0.05" onBlur={minConfidenceHandler} />
        {buttonList}
      </div>

      <div className="h-10 flex flew-row">
        <div className="ml-1">
          <span className="relative top-1/4 mr-2">Auto-Flip
            <input type="checkbox" onChange={(e) => chkHandler(e, "flip")} defaultChecked={flip} name="chkFlip" />
          </span>

        </div>
        <div className="ml-1">
          <span className="relative top-1/4 mr-2">Auto-Mask
            <input type="checkbox" onChange={(e) => chkHandler(e, "showMask")} defaultChecked={showMask} name="chkMask" />
          </span>

        </div>
        <div className="ml-1">
          <span className="relative top-1/4 mr-2">Show-Landmarks
            <input type="checkbox" onChange={(e) => chkHandler(e, "showLM")} defaultChecked={showLM} name="chkLM" />

          </span>

        </div>

      </div>
    </>
  )

}