import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type HTMLMotionProps,
  type Variants,
} from "motion/react";

import {
  easeOut,
  fadeIn,
  fadeInUp,
  noMotion,
  pageEnter,
  slideDown,
  springSoft,
  staggerContainer,
  viewport,
} from "@/lib/motion";

function useMotionVariants(variants: Variants) {
  const reduceMotion = useReducedMotion();
  return reduceMotion ? noMotion : variants;
}

type FadeInProps = HTMLMotionProps<"div"> & {
  delay?: number;
  variant?: "fadeIn" | "fadeInUp";
};

export function FadeIn({ children, className, delay = 0, variant = "fadeInUp", ...props }: FadeInProps) {
  const variants = useMotionVariants(variant === "fadeIn" ? fadeIn : fadeInUp);

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={variants}
      transition={{ ...easeOut, delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function FadeInOnMount({ children, className, delay = 0, ...props }: FadeInProps) {
  const variants = useMotionVariants(fadeInUp);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants}
      transition={{ ...easeOut, delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({ children, className, onMount = false, ...props }: HTMLMotionProps<"div"> & { onMount?: boolean }) {
  const variants = useMotionVariants(staggerContainer);

  return (
    <motion.div
      initial="hidden"
      {...(onMount ? { animate: "visible" } : { whileInView: "visible", viewport })}
      variants={variants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className, ...props }: HTMLMotionProps<"div">) {
  const variants = useMotionVariants(fadeInUp);

  return (
    <motion.div variants={variants} transition={easeOut} className={className} {...props}>
      {children}
    </motion.div>
  );
}

export function PageTransition({ children, className }: { children: React.ReactNode; className?: string }) {
  const variants = useMotionVariants(pageEnter);
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants}
      transition={reduceMotion ? { duration: 0 } : easeOut}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Collapse({ open, children, className }: { open: boolean; children: React.ReactNode; className?: string }) {
  const variants = useMotionVariants(slideDown);
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={variants}
          transition={reduceMotion ? { duration: 0 } : springSoft}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function PresenceFade({ show, children, className }: { show: boolean; children: React.ReactNode; className?: string }) {
  const variants = useMotionVariants(fadeIn);
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence mode="wait">
      {show && (
        <motion.div
          key="visible"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={variants}
          transition={reduceMotion ? { duration: 0 } : easeOut}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export { AnimatePresence, motion };
