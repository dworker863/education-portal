import React, { Dispatch, FC, SetStateAction, useState } from 'react';
import { Slider } from './slider';

type TExercisesSliderProps = {
  range: number[];
  setRange: Dispatch<SetStateAction<number[]>>;
};

const ExercisesSlider: FC<TExercisesSliderProps> = ({ range, setRange }) => {
  return (
    <div className="w-[200px] mb-5">
      <h2 className="mb-1">Баллы</h2>
      <div className="flex justify-between">
        <span className="text-sm">Min: {range[0]}</span>
        <span className="text-sm">Max: {range[1]}</span>
      </div>
      <Slider
        className="bg-orange-700"
        defaultValue={range}
        value={range}
        onValueChange={(newValue) => setRange(newValue)}
        max={100}
        min={0}
        step={1}
      />
    </div>
  );
};

export default ExercisesSlider;
