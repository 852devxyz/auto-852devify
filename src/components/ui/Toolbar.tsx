
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { InputData, Mask } from '../types';
import { ImageAtom } from '../atomValues';
import { masks } from '../../settings/masks';
import { RefreshCcwDotIcon } from 'lucide-react';
import { Key, useState } from 'react';
export function Toolbar() {
  const imgbtnStyle = { "width": "50px" };
  const setImageAtom = useSetAtom(ImageAtom);
  const { minConfidence, flip, showMask, showLM } = useAtomValue(ImageAtom);

  //const [minConf, setminConf] = useState(0.35);
  //const maskList = [masks.noggles1, masks.noggles2, masks.noggles3];
  const defaultMask = masks.noggles1;
  const [mask, setMask] = useState<Mask>(defaultMask);
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

  function widthAdjustHandler(e: any){
    console.log("widthAdjustHandler", e.target.value);
  }

  interface MaskButtonProps{
    title: String,
    key: string
    uri: string,
    widthAdjust: number
  }

  function changeMaskHandler(e: any, key:string){
    //e.target
    setMask({uriL: "", uriR: "", widthAdjust: 1})
  }

  function MaskButton(props:MaskButtonProps) {
    return (
      <div className="ml-2 bg-black rounded-sm w-20 flex flex-col">
        <div className="text-white text-xs text-center">{props.title}</div>
        
        <button className="bg-white px-2 border-2" key={props.key}>
          <img src={props.uri} style={imgbtnStyle} />
        </button>
        <input onChange={(e) => changeMaskHandler(e, props.key)} type="file" id="files" accept=".jpg,.jpeg,.png" />
        {/* <div className="text-center"><button onClick={(e) => ToolbarHandler(e, props.widthAdjust)}><RefreshCcwDotIcon color="white" size={12}></RefreshCcwDotIcon></button></div> */}
      </div>
    )
  }
  // const buttonList = maskList.map(m => (
  //   <button className="px-2 border-2 ml-2" key={m.uri}>
  //     <img src={m.uri} style={imgbtnStyle} onClick={(e) => ToolbarHandler(e, m.widthAdjust)} />
  //   </button>
  // ))
  return (
    <>
      <div className="flex flex-row mr-2 justify-start">
        <div className="flex flex-col justify-start w-24 rounded-sm border-2 px-2">
          <span>Min. Conf.</span>
          <input className="shadow rounded justify-self-start" name="minConfidence" type="number" value={minConfidence} step="0.05" onBlur={minConfidenceHandler} />

        </div>
       <MaskButton title="Left" key={"uriL"} uri={mask.uriL.toString()} widthAdjust={mask.widthAdjust}></MaskButton>
       <MaskButton title="Right" key={"uriR"} uri={mask.uriR.toString()} widthAdjust={mask.widthAdjust}></MaskButton>
       
     
        <div className="flex flex-col ml-2 justify-start w-32 rounded-sm border-2 px-2">
          <span>Width Adjust</span>
          <input className="shadow rounded" name="widthAdjust" type="number" value={mask.widthAdjust} step="0.01" onBlur={widthAdjustHandler} />

        </div>
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