import React, { Dispatch, FC, SetStateAction, useState } from 'react';
import { Slider } from './slider';

type TRangeSliderProps = {
  title: string;
  range: number[];
  setRange: Dispatch<SetStateAction<number[]>>;
};

const RangeSlider: FC<TRangeSliderProps> = ({ title, range, setRange }) => {
  return (
    <div className="w-[400px] mb-5 space-y-2 cursor-pointer">
      <h2 className="mb-1">{title}</h2>
      <div className="flex justify-between">
        <p className="text-sm">Начало через {range[0]} дней</p>
        <p className="text-sm">Окончание через {range[1]} дней</p>
      </div>
      <Slider
        className="bg-customPrimary"
        defaultValue={range}
        value={range}
        onValueChange={(newValue) => setRange(newValue)}
        max={180}
        min={0}
        step={1}
      />
    </div>
  );
};

export default RangeSlider;
