export const pageVariants = {
  initial: { opacity: 0, y: 8, filter: "blur(2px)" },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: 6,
    filter: "blur(2px)",
    transition: { duration: 0.16, ease: [0.4, 0, 1, 1] },
  },
} as const;

export const hoverTap = {
  whileHover: { y: -1, transition: { duration: 0.12 } },
  whileTap: { scale: 0.98, transition: { duration: 0.08 } },
} as const;

