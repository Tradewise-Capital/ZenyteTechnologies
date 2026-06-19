import type { Transition, Variants } from "motion/react";

export const easeOut: Transition = {
  duration: 0.9,
  ease: [0.16, 1, 0.3, 1],
};

export const easeOutFast: Transition = {
  duration: 0.55,
  ease: [0.16, 1, 0.3, 1],
};

export const springSoft: Transition = {
  type: "spring",
  stiffness: 180,
  damping: 32,
  mass: 0.9,
};

export const viewport = {
  once: true,
  margin: "-48px" as const,
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: { opacity: 1, scale: 1 },
};

export const slideDown: Variants = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: "auto" },
  exit: { opacity: 0, height: 0 },
};

export const pageEnter: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.08 },
  },
};

export const noMotion: Variants = {
  hidden: {},
  visible: {},
};
