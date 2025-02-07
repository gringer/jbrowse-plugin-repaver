import React from 'react'

import { useTheme } from '@mui/material'
import { observer } from 'mobx-react'
import { Axis, LEFT, RIGHT } from 'react-d3-axis-mod'

import type { axisPropsFromTickScale } from 'react-d3-axis-mod'

type Ticks = ReturnType<typeof axisPropsFromTickScale>

/**
 * adds scientific notation to a number
 *
 * @param val - number to convert
 * @param unit - unit to add to the end of the value
 */
function valToSci(val: number, unit = "") : string {
    const sv = Math.sign(val);
    val = Math.abs(val);
    if(val == 0){
        return("0");
    }
    const units = [
        "" + unit, "k" + unit, "M" + unit,
        "G" + unit, "T" + unit, "P" + unit,
        "E" + unit, "Z" + unit, "Y" + unit];
    const logRegion = Math.floor(Math.log(val) / Math.log(1000));
    val = val / Math.pow(1000, logRegion);
    val = Math.round(val * 100) / 100;
    return("" + sv * val + " " + units[logRegion]);
}

/**
 * returns a number from -2000 to 2000 based on where a point will sit in a piecewise log/linear function conversion.
 * the function follows a log curve until 1/25th of the sequence length (about 1/3 of the output height), and is linear
 * from that point onwards, with the linear component of the function adjusted to make the transition point smooth.
 */
function pwFun(seqLen: number, x: number, log?: boolean) : number {
    if(seqLen <= 100) {
        return((x * 2000) / seqLen);
    }
    const sx = Math.sign(x);
     x = Math.abs(x);
    if(x > seqLen) {
        return(2001);
    }
    if(x == 0) {
        return(0);
    }
    const a = seqLen / 25;
    const endPos = (seqLen - a) / (a * Math.log(a)) + 1;
    const xtr = (x < a) ? (Math.log(x) / Math.log(a)) :
        ((x-a) / (a * Math.log(a)) + 1);
    const retVal = sx * ((2000 * xtr) / endPos);
    return(retVal);
}

/**
 * returns the inverse of the above function
 *
 */
function pwInvFun(seqLen: number, retVal: number) : number {
    if(seqLen <= 100) {
        return((retVal / 2000) * seqLen);
    }
    const sx = Math.sign(retVal);
    if(Math.abs(retVal) > 2000){
        return(sx * seqLen);
    }
    const a = seqLen / 25;
    const endPos = (seqLen - a) / (a * Math.log(a)) + 1;
    const xtr = (Math.abs(retVal) * endPos) / 2000;
    if(xtr < 1){
        return(sx * Math.exp(xtr * Math.log(a)));
    } else {
        return(sx * ((xtr - 1) * (a * Math.log(a)) + a));
    }
}


const YScaleBar = observer(function ({
  model,
  orientation,
  logLinSeqLength,
}: {
  model: { ticks?: Ticks }
  orientation?: string
  logLinSeqLength?: number
}) {
  const { ticks } = model
  const theme = useTheme()
  if(logLinSeqLength === undefined){
    return ticks ? (
      <Axis
        {...ticks}
        shadow={2}
        format={ (n: number) => n }
        style={{ orient: orientation === 'left' ? LEFT : RIGHT }}
        bg={theme.palette.background.default}
        fg={theme.palette.text.primary}
      />
    ) : null
  } else {
    const chrLength = logLinSeqLength;
    const majorVals = Array.from({length: Math.ceil(Math.log10(chrLength) + 1)}, (_, i) => pwFun(chrLength, Math.pow(10, i))).concat(
      Array.from({length: Math.ceil(Math.log10(chrLength) + 1)}, (_, i) => -pwFun(chrLength, Math.pow(10, i))));
    if(ticks){
      ticks.values =  Array.from({length: Math.ceil(Math.log10(chrLength) + 1) * 9}, (_, i) => pwFun(chrLength, Math.pow(10, Math.floor(i / 9)) * (i % 9 + 1))).concat(
        Array.from({length: Math.ceil(Math.log10(chrLength) + 1) * 9}, (_, i) => -pwFun(chrLength, Math.pow(10, Math.floor(i / 9)) * (i % 9 + 1))));
    }
    return ticks ? (
      <Axis
        {...ticks}
        shadow={2}
        format={(n: number) => n == 0 ? "-1 / 0 / 1" : majorVals.includes(n) ? valToSci(Math.round(pwInvFun(chrLength, n))) : ""}
        style={{ orient: orientation === 'left' ? LEFT : RIGHT }}
        bg={theme.palette.background.default}
        fg={theme.palette.text.primary}
      />
    ) : null
  }
})

export default YScaleBar
