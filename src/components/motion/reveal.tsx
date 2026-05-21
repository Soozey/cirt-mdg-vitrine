"use client";

import { motion, type HTMLMotionProps, type Variants } from "framer-motion";
import { forwardRef } from "react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

const container = (stagger = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren },
  },
});

type RevealProps = HTMLMotionProps<"div"> & {
  delay?: number;
  amount?: number;
};

export const Reveal = forwardRef<HTMLDivElement, RevealProps>(
  ({ delay = 0, amount = 0.2, transition, ...rest }, ref) => (
    <motion.div
      ref={ref}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={fadeUp}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay, ...transition }}
      {...rest}
    />
  ),
);
Reveal.displayName = "Reveal";

type RevealGroupProps = HTMLMotionProps<"div"> & {
  stagger?: number;
  delayChildren?: number;
  amount?: number;
};

export const RevealGroup = forwardRef<HTMLDivElement, RevealGroupProps>(
  ({ stagger = 0.08, delayChildren = 0, amount = 0.15, ...rest }, ref) => (
    <motion.div
      ref={ref}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={container(stagger, delayChildren)}
      {...rest}
    />
  ),
);
RevealGroup.displayName = "RevealGroup";

export const RevealItem = forwardRef<HTMLDivElement, HTMLMotionProps<"div">>(
  (props, ref) => <motion.div ref={ref} variants={fadeUp} {...props} />,
);
RevealItem.displayName = "RevealItem";
