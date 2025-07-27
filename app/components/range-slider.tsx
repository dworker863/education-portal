import React, { Dispatch, FC, SetStateAction } from 'react';
import { Slider } from './slider';

type TRangeSliderProps = {
  title: string;
  maxValue: number;
  minValueText: string;
  maxValueText: string;
  range: number[];
  setRange: Dispatch<SetStateAction<number[]>>;
};

const RangeSlider: FC<TRangeSliderProps> = ({ title, maxValue, minValueText, maxValueText, range, setRange }) => {
  return (
    <div className="w-[400px] mb-5 space-y-2 cursor-pointer">
      <h2 className="mb-1 text-md font-medium">{title}</h2>
      <div className="flex justify-between">
        <p className="text-sm">{minValueText}</p>
        <p className="text-sm">{maxValueText}</p>
      </div>
      <Slider
        className="bg-customPrimary"
        defaultValue={range}
        value={range}
        onValueChange={(newValue) => setRange(newValue)}
        max={maxValue}
        min={0}
        step={1}
      />
    </div>
  );
};

export default RangeSlider;
