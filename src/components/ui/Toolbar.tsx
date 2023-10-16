
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { InputData } from '../types';
import { ImageAtom } from '../atomValues';
import { masks } from '../../settings/masks';
export function Toolbar() {
    const imgbtnStyle = { "width": "50px" };
    const setImageAtom = useSetAtom(ImageAtom);
    const maskList = [masks.noggles1, masks.noggles2, masks.noggles3];
    function ToolbarHandler(e: any, widthAdjust:number) {
      setImageAtom((prev) => ({ ...prev, maskUri: e.target.getAttribute("src"), maskAdjust: widthAdjust }));
    }
    const buttonList = maskList.map(m => (
        <button className="px-2 border-2 mr-1" key={m.uri}>
            <img src={m.uri} style={imgbtnStyle} onClick={(e) => ToolbarHandler(e, m.widthAdjust)} />
        </button>
    ))
    return (
      <div className="h-10 flex flew-row">
        {buttonList}
        </div>
    )
  
  }