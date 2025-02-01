import React, { useState } from 'react';
import { Slider } from './slider';

const ExercisesSlider = () => {
  const [value, setValue] = useState([20, 80]);

  return (
    <div className="w-[200px] mb-5">
      <h2 className="mb-1">Баллы</h2>
      <div className="flex justify-between">
        <span className="text-sm">Min: {value[0]}</span>
        <span className="text-sm">Max: {value[1]}</span>
      </div>
      <Slider
        className="bg-orange-700"
        defaultValue={[20, 80]}
        value={value}
        onValueChange={(newValue) => setValue(newValue)}
        max={100}
        min={0}
        step={1}
      />
    </div>
  );
};

export default ExercisesSlider;
