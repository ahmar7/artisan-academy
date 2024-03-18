import React, { useState, useRef, useCallback, useEffect } from 'react';
import classnames from 'classnames';
import moment from 'moment';
import './multiRangeSlider.css'
function secondsToHMS(seconds) {
  const milliseconds = seconds * 1000;
  const duration = moment.duration(milliseconds);

  const formattedTime = moment
    .utc(duration.asMilliseconds())
    .format('HH:mm:ss');
  return formattedTime;
}

const MultiRangeSlider = ({ min, max}) => {
  const [minVal, setMinVal] = useState(min);
  const [maxVal, setMaxVal] = useState(max);
  const minValRef = useRef(null);
  const maxValRef = useRef(null);
  const range = useRef(null);

  const getPercent = useCallback(
    (value) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxVal);

    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, maxVal, getPercent]);

//   useEffect(() => {
//     onChange({ min: minVal, max: maxVal });
//   }, [minVal, maxVal, onChange]);

  return (
    <div className="multiRangeSlider-container">
      <input
        type="range"
        min={min}
        max={max}
        value={minVal}
        ref={minValRef}
        onChange={(event) => {
          const value = Math.min(+event.target.value, maxVal - 1);
          setMinVal(value);
          onChange({ min: value, max: maxVal }); // Optional: Immediate feedback
        }}
        className={classnames('multiRangeSlider-thumb multiRangeSlider-thumb--zindex-3', {
          'multiRangeSlider-thumb--zindex-5': minVal > max - 100,
        })}
      />
      <input
        type="range"
        min={min}
        max={max}
        value={maxVal}
        ref={maxValRef}
        onChange={(event) => {
          const value = Math.max(+event.target.value, minVal + 1);
          setMaxVal(value);
          onChange({ min: minVal, max: value }); // Optional: Immediate feedback
        }}
        className="multiRangeSlider-thumb multiRangeSlider-thumb--zindex-4"
      />

      <div className="multiRangeSlider-slider">
        <div className="multiRangeSlider-slider__track"></div>
        <div ref={range} className="multiRangeSlider-slider__range"></div>
        <div className="multiRangeSlider-slider__left-value multiRangeSlider-text">
          {secondsToHMS(minVal)}
        </div>
        <div className="multiRangeSlider-slider__right-value multiRangeSlider-text">
          {secondsToHMS(maxVal)}
        </div>
      </div>
    </div>
  );
};

export default MultiRangeSlider;
