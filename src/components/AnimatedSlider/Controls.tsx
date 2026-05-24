"use client";

import React from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import Progress from "./Progress";
import { CurrentSlideData, SliderData } from "./types";

type Props = {
  currentSlideData: CurrentSlideData;
  sliderData: SliderData[];
  data: SliderData[];
  transitionData: SliderData;
  handleData: React.Dispatch<React.SetStateAction<SliderData[]>>;
  handleTransitionData: React.Dispatch<React.SetStateAction<SliderData>>;
  handleCurrentSlideData: React.Dispatch<
    React.SetStateAction<CurrentSlideData>
  >;
  initData: SliderData;
  handlePrev: () => void;
  handleNext: () => void;
};

function Controls({
  sliderData,
  data,
  transitionData,
  currentSlideData,
  handleData,
  handleTransitionData,
  handleCurrentSlideData,
  initData,
  handlePrev,
  handleNext,
}: Props) {
  return (
    <div className="flex items-center gap-3 px-0 py-3 md:px-1 md:py-5">
      <SliderButton handleClick={handlePrev}>
        <IoIosArrowBack className="text-xl" />
      </SliderButton>
      <SliderButton handleClick={handleNext}>
        <IoIosArrowForward className="text-xl" />
      </SliderButton>
      <Progress curIndex={currentSlideData.index} length={sliderData.length} />
    </div>
  );
}

export default Controls;

const SliderButton = ({
  children,
  handleClick,
}: {
  children: React.ReactNode;
  handleClick: () => void;
}) => {
  return (
    <button
      className="flex h-14 w-14 items-center justify-center rounded-full border-[1px] border-[#fdfdfd5f] transition duration-300 ease-in-out hover:bg-white hover:text-black z-20 pointer-events-auto"
      onClick={handleClick}
    >
      {children}
    </button>
  );
};
