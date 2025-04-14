import React, { useState, useEffect } from 'react';

const Slider = () => {
  const [time, setTime] = useState(0); // Waktu dalam detik
  const [isRunning, setIsRunning] = useState(false); // Status stopwatch

  useEffect(() => {
    let timer;
    if (true) {
      timer = setTimeout(() => {
        setTime(prevTime => prevTime + 1);
      }, 100);
    }
    return () => clearTimeout(timer); // Bersihkan timeout saat komponen di-unmount atau status berubah
  }, [isRunning, time]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
  };
 return time
  /*return (
    <div>
      <h1>Stopwatch</h1>
      <div style={{marginLeft: time % 300 === 0 ?0:(time+'px')}} className='font-bold w-40 h-40 bg-yellow-200'>{time} seconds</div>
      <button onClick={handleStart} disabled={isRunning}>Start</button>
      <button onClick={handleStop} disabled={!isRunning}>Stop</button>
      <button onClick={handleReset}>Reset</button>
    </div>
  );*/
};

export default Slider;