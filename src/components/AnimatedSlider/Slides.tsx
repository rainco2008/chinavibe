"use client";

import React from "react";
import SliderCard from "./SliderCard";
import { SliderData } from "./types";

type Props = {
  data: SliderData[];
};

function Slides({ data }: Props) {
  return (
    <div className="flex w-full gap-6">
      {data.map((item) => {
        return <SliderCard key={item.img} data={item} />;
      })}
    </div>
  );
}

export default Slides;
