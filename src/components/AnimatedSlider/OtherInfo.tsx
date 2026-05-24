"use client";

import React from "react";
import { motion } from "framer-motion";
import { SliderData } from "./types";

type Props = {
  data: SliderData;
};

const item = {
  hidden: {
    y: "100%",
    transition: { ease: [0.455, 0.03, 0.515, 0.955] as [number, number, number, number], duration: 0.85 },
  },
  visible: {
    y: 0,
    transition: { ease: [0.455, 0.03, 0.515, 0.955] as [number, number, number, number], duration: 0.75 },
  },
};

function OtherInfo({ data }: Props) {
  return (
    <motion.div initial="hidden" animate={"visible"} className="flex flex-col">
      <AnimatedText
        className="spacing overflow-hidden text-[#D5D5D6] uppercase"
        data={data?.location}
      />
      <AnimatedText
        className="my-1 text-4xl font-semibold md:my-3 md:text-7xl md:leading-[80px]"
        data={data?.title}
      />
      <AnimatedText
        className="text-sm text-[#D5D5D6] max-w-xl"
        data={data?.description}
      />
    </motion.div>
  );
}

export default OtherInfo;

const AnimatedText = ({
  data,
  className,
}: {
  data?: string;
  className?: string;
}) => {
  return (
    <span
      style={{
        overflow: "hidden",
        display: "inline-block",
      }}
    >
      <motion.p className={` ${className}`} variants={item} key={data}>
        {data}
      </motion.p>
    </span>
  );
};
