
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { InputData, MaskButtonProps } from '../../lib/types';
import { ImageAtom } from '../../lib/atomValues';
import { Key, useState, ChangeEvent } from 'react';
import { settings, maskTypes } from '@/settings/global';
export function Toolbar() {
  const imgbtnStyle = { "width": "50px" };
  const setImageAtom = useSetAtom(ImageAtom);
  const { maskLUri, maskRUri, maskAdjust, minConfidence, flip, showMask, showLM, maskType } = useAtomValue(ImageAtom);


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
    setImageAtom((prev) => ({ ...prev, minConfidence: parseFloat(e.target.value) }));
  }

  function widthAdjustHandler(e: ChangeEvent<HTMLInputElement>) {
    console.log("widthAdjustHandler", e.target.value);
    if (e.target?.value) {
      setImageAtom((prev) => ({ ...prev, maskAdjust: parseFloat(e.target.value) }));
    }

  }

  function maskTypeHandler(e: ChangeEvent<HTMLSelectElement>) {
    console.log("maskTypeHandler", e.target.value);
    if (e.target?.value) {
      const mt = parseInt(e.target.value);
      setImageAtom((prev) => ({ ...prev, maskType: mt, enlarge: settings.enlargeByTypes.length > mt ? settings.enlargeByTypes[mt] : settings.default.enlarge }));
    }

  }



  function changeMaskLeftHandler(e: ChangeEvent<HTMLInputElement>) {
    if (e.currentTarget.files && e.currentTarget.files.length == 1) {
      const src = URL.createObjectURL(e.currentTarget.files[0]);
      setImageAtom((prev) => ({ ...prev, maskLUri: src }));
    }
  }

  function changeMaskRightHandler(e: ChangeEvent<HTMLInputElement>, key: string) {
    if (e.currentTarget.files && e.currentTarget.files.length == 1) {
      const src = URL.createObjectURL(e.currentTarget.files[0]);
      setImageAtom((prev) => ({ ...prev, maskRUri: src }));
    }
  }

  function MaskButton(props: MaskButtonProps) {
    if (props.uri) {
      return (
        <div className="bg-black rounded-sm w-20 flex flex-col">
          <div className="text-white text-xs text-center">{props.title}</div>
          <div className="bg-white px-2 border-2" key={props.buttonKey}>
            <img src={props.uri} style={imgbtnStyle} />
          </div>
          <input onChange={(e) => props.changeHandler(e)} type="file" id="files" accept=".jpg,.jpeg,.png" />
        </div>
      )
    } else {
      return (
        <div className="bg-black rounded-sm w-20 flex flex-col">
          <div className="text-white text-xs text-center">{props.title}</div>
          <input onChange={(e) => props.changeHandler(e)} type="file" id="files" accept=".jpg,.jpeg,.png" />
        </div>
      )
    }

  }

  function MaskTypeOptions() {
    const keys = Object.keys(maskTypes).filter((v) => isNaN(Number(v)));

    return keys.map((key, index) => {
      return (<option value={index} key={key}>{key}</option>)

    })
  }
  return (
    <>

      <div className="flex sm:flex-row flex-col justify-start gap-1">
      <div className="flex flex-row sm:justify-start justify-center sm:gap-0 sm:gap-x-1 gap-2">
        <MaskButton title="Left" buttonKey="maskLUri" uri={maskLUri} changeHandler={changeMaskLeftHandler}></MaskButton>
        <MaskButton title="Right" buttonKey="maskRUri" uri={maskRUri} changeHandler={changeMaskRightHandler}></MaskButton>
      </div>  
        <div className="flex flex-col">
          <div className="flex flex-row border-2 justify-stretch">
            <label className="w-32">Mask Type</label>
            <select className="shadow rounded" onChange={maskTypeHandler}>
              {MaskTypeOptions()}
            </select>
          </div>
          <div className="flex flex-row border-2 justify-stretch">
            <label className="w-32 justify-self-start">Min. Conf.</label>
            <input className="shadow rounded" name="minConfidence" type="number" defaultValue={minConfidence} step="0.05" onChange={minConfidenceHandler} />
          </div>

          <div className="flex flex-row border-2 justify-stretch">
            <span className="w-32">Width Adjust</span>
            <input className="shadow rounded" name="widthAdjust" type="number" defaultValue={maskAdjust} step="0.01" onChange={widthAdjustHandler} />

          </div>

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