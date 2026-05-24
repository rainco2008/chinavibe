"use client";

import { AnimatePresence } from "framer-motion";
import React, { useEffect, useCallback, useRef } from "react";
import BackgroundImage from "./BackgroundImage";
import Slides from "./Slides";
import SlideInfo from "./SlideInfo";
import Controls from "./Controls";
import { SliderData, CurrentSlideData } from "./types";

type Props = {
  sliderData: SliderData[];
};

export default function Slider({ sliderData }: Props) {
  if (!sliderData || sliderData.length === 0) {
    return null;
  }

  const initData = sliderData[0];
  const [data, setData] = React.useState<SliderData[]>(sliderData.slice(1));
  const [transitionData, setTransitionData] = React.useState<SliderData>(
    sliderData[0]
  );
  const [currentSlideData, setCurrentSlideData] =
    React.useState<CurrentSlideData>({
      data: initData,
      index: 0,
    });

  const handlePrev = useCallback(() => {
    setData((prevData) => [
      transitionData ? transitionData : initData,
      ...prevData.slice(0, prevData.length - 1),
    ]);
    setCurrentSlideData({
      data: transitionData ? transitionData : sliderData[0],
      index: sliderData.findIndex(
        (ele) => ele.img === data[data.length - 1].img
      ),
    });
    setTransitionData(data[data.length - 1]);
  }, [data, transitionData, initData, sliderData]);

  const handleNext = useCallback(() => {
    setData((prev) => prev.slice(1));
    setCurrentSlideData({
      data: transitionData ? transitionData : initData,
      index: sliderData.findIndex((ele) => ele.img === data[0].img),
    });
    setTransitionData(data[0]);
    setTimeout(() => {
      setData((newData) => [
        ...newData,
        transitionData ? transitionData : initData,
      ]);
    }, 500);
  }, [data, transitionData, initData, sliderData]);

  // Autoplay functionality
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startAutoplay = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      handleNext();
    }, 5000); // 5 seconds interval
  }, [handleNext]);

  useEffect(() => {
    startAutoplay();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startAutoplay]);

  // Pause autoplay when user interacts
  const handleUserPrev = () => {
    startAutoplay();
    handlePrev();
  };

  const handleUserNext = () => {
    startAutoplay();
    handleNext();
  };

  return (
    <div className="relative h-[80vh] min-h-[600px] w-full select-none overflow-hidden text-white antialiased">
      <AnimatePresence>
        <BackgroundImage
          key="background-image"
          transitionData={transitionData}
          currentSlideData={currentSlideData}
        />
        <div key="slider-content" className="absolute z-20 h-full w-full pointer-events-none">
          <div className="flex h-full w-full grid-cols-10 flex-col md:grid">
            <div className="col-span-4 mb-3 flex h-full flex-1 flex-col justify-end px-5 md:mb-0 md:justify-center md:px-10">
              <SlideInfo
                transitionData={transitionData}
                currentSlideData={currentSlideData}
              />
            </div>
            <div className="col-span-6 flex h-full flex-1 flex-col justify-start p-4 md:justify-center md:p-10 overflow-hidden">
              <Slides data={data} />
              <Controls
                currentSlideData={currentSlideData}
                data={data}
                transitionData={transitionData}
                initData={initData}
                handleData={setData}
                handleTransitionData={setTransitionData}
                handleCurrentSlideData={setCurrentSlideData}
                sliderData={sliderData}
                handlePrev={handleUserPrev}
                handleNext={handleUserNext}
              />
            </div>
          </div>
        </div>
      </AnimatePresence>
    </div>
  );
}
