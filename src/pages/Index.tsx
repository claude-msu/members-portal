import { Button } from "@/components/ui/button";
import { Instagram, Linkedin, Map, Users, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import NetworkMap from "@/components/NetworkMap";
import PipelineDiagram from "@/components/PipelineDiagram";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const lightModeTokenOverrides = {
  "--cream": "33 100% 97%",
  "--page": "33 100% 97%",
  "--foreground": "24 10% 15%",
  "--card": "0 0% 100%",
  "--card-foreground": "24 10% 15%",
  "--popover": "0 0% 100%",
  "--popover-foreground": "24 10% 15%",
  "--primary": "14 69% 60%",
  "--on-primary": "33 100% 97%",
  "--secondary": "30 100% 95%",
  "--secondary-foreground": "24 10% 15%",
  "--muted": "30 40% 93%",
  "--muted-foreground": "24 8% 45%",
  "--border": "30 30% 88%",
  "--input": "30 30% 88%",
  "--ring": "25 95% 53%",
  "--msu-green": "166 42% 22%",
} as CSSProperties;

type GlowTone = "cream" | "warm" | "dark" | "primary";

const glowToneMap: Record<GlowTone, { rgb: [number, number, number]; inner: number; mid: number; outer: number }> = {
  // Cream sections intentionally glow with primary tone
  cream: { rgb: [209, 116, 87], inner: 0.26, mid: 0.16, outer: 0.08 },
  warm: { rgb: [200, 140, 102], inner: 0.22, mid: 0.14, outer: 0.07 },
  dark: { rgb: [70, 84, 112], inner: 0.34, mid: 0.22, outer: 0.12 },
  primary: { rgb: [170, 86, 63], inner: 0.3, mid: 0.2, outer: 0.1 },
};

const Index = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const mouseGlowRef = useRef<HTMLDivElement>(null);
  const glowSectionsRef = useRef<HTMLElement[]>([]);
  const networkSectionRef = useRef<HTMLElement | null>(null);
  const foundationsSectionRef = useRef<HTMLElement | null>(null);
  const pipelineSectionRef = useRef<HTMLElement | null>(null);
  const titleText = "Claude Builder Club";
  const [typedTitle, setTypedTitle] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [revealStarted, setRevealStarted] = useState(false);

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const supportReveal = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.08,
      },
    },
  };

  const supportRevealItem = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  const logoFloatVariants = {
    floating: {
      y: [0, -15, 0],
    },
  };

  const sideRailReveal = {
    hidden: { opacity: 0, x: 28, y: "-50%" },
    visible: {
      opacity: 1,
      x: 0,
      y: "-50%",
      transition: { duration: 0.45, delay: 0.12 },
    },
  };

  useEffect(() => {
    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setTypedTitle(titleText.slice(0, index));

      if (index >= titleText.length) {
        window.clearInterval(timer);
        setIsTypingComplete(true);
      }
    }, 90);

    return () => window.clearInterval(timer);
  }, [titleText]);

  useEffect(() => {
    if (!isTypingComplete) return;
    const t = setTimeout(() => setRevealStarted(true), 300);
    return () => clearTimeout(t);
  }, [isTypingComplete]);

  const getBlendedTone = (clientY: number) => {
    const sections = glowSectionsRef.current;
    if (!sections.length) return glowToneMap.cream;

    const sigma = 240; // Higher = smoother color transition across section boundaries
    const toneWeights: Record<GlowTone, number> = {
      cream: 0.0001,
      warm: 0.0001,
      dark: 0.0001,
      primary: 0.0001,
    };

    for (const section of sections) {
      const toneAttr = section.dataset.glowTone as GlowTone | undefined;
      if (!toneAttr || !glowToneMap[toneAttr]) continue;
      const rect = section.getBoundingClientRect();
      const inside = clientY >= rect.top && clientY <= rect.bottom;
      const edgeDistance = inside
        ? 0
        : Math.min(Math.abs(clientY - rect.top), Math.abs(clientY - rect.bottom));

      const proximityWeight = Math.exp(-(edgeDistance * edgeDistance) / (2 * sigma * sigma));
      toneWeights[toneAttr] += proximityWeight + (inside ? 0.9 : 0);
    }

    const totalWeight = toneWeights.cream + toneWeights.warm + toneWeights.dark + toneWeights.primary;
    const normalized = {
      cream: toneWeights.cream / totalWeight,
      warm: toneWeights.warm / totalWeight,
      dark: toneWeights.dark / totalWeight,
      primary: toneWeights.primary / totalWeight,
    };

    const mixChannel = (index: 0 | 1 | 2) =>
      Math.round(
        glowToneMap.cream.rgb[index] * normalized.cream +
        glowToneMap.warm.rgb[index] * normalized.warm +
        glowToneMap.dark.rgb[index] * normalized.dark +
        glowToneMap.primary.rgb[index] * normalized.primary
      );

    const mixAlpha = (key: "inner" | "mid" | "outer") =>
      glowToneMap.cream[key] * normalized.cream +
      glowToneMap.warm[key] * normalized.warm +
      glowToneMap.dark[key] * normalized.dark +
      glowToneMap.primary[key] * normalized.primary;

    return {
      rgb: [mixChannel(0), mixChannel(1), mixChannel(2)] as [number, number, number],
      inner: mixAlpha("inner"),
      mid: mixAlpha("mid"),
      outer: mixAlpha("outer"),
    };
  };

  const updatePageGlow = (clientX: number, clientY: number) => {
    if (!mouseGlowRef.current) return;
    const { rgb, inner, mid, outer } = getBlendedTone(clientY);
    mouseGlowRef.current.style.background = `
      radial-gradient(circle 360px at ${clientX}px ${clientY}px, rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${inner}) 0%, rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${mid}) 34%, rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0) 76%),
      radial-gradient(circle 760px at ${clientX}px ${clientY}px, rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${outer}) 0%, rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0) 88%)
    `;
  };

  useEffect(() => {
    glowSectionsRef.current = Array.from(
      document.querySelectorAll<HTMLElement>("[data-glow-tone]")
    );
    // Set a default glow at the center before pointer movement.
    updatePageGlow(window.innerWidth / 2, window.innerHeight / 2);
  }, []);

  const handlePageMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    updatePageGlow(event.clientX, event.clientY);
  };

  const scrollToSection = (targetRef: React.RefObject<HTMLElement | null>) => {
    targetRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      className="min-h-screen relative bg-[hsl(33,100%,97%)]"
      style={lightModeTokenOverrides}
      onMouseMove={handlePageMouseMove}
    >
      {/* Continuous blurred canvas behind entire page */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden>
        <motion.div
          className="absolute -inset-[20%] opacity-60 blur-[95px]"
          style={{
            background: `
              linear-gradient(120deg, hsl(var(--primary) / 0.18) 0%, transparent 36%, hsl(var(--msu-green) / 0.12) 66%, transparent 100%),
              linear-gradient(250deg, hsl(28 85% 72% / 0.14) 0%, transparent 42%, hsl(var(--primary) / 0.12) 100%),
              linear-gradient(180deg, hsl(33 100% 97% / 0.84), hsl(33 100% 97% / 0.76))
            `,
          }}
          animate={{
            x: ["-3%", "2%", "-1%", "0%"],
            y: ["-1%", "1.5%", "-2%", "0%"],
            scale: [1, 1.03, 1.01, 1],
          }}
          transition={{
            duration: 24,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
      <div
        ref={mouseGlowRef}
        className="fixed top-0 left-0 w-screen h-screen pointer-events-none z-20 mix-blend-multiply transition-[background] duration-150"
        aria-hidden
      />
      <motion.aside
        initial="hidden"
        animate="visible"
        variants={sideRailReveal}
        className="fixed right-4 top-1/2 z-50 hidden md:flex md:flex-col md:gap-3"
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.button
              type="button"
              aria-label="Go to pipeline section"
              onClick={() => scrollToSection(pipelineSectionRef)}
              whileHover={{ scale: 1.12, backgroundColor: "hsl(var(--primary))", color: "hsl(var(--on-primary))", y: -3 }}
              whileTap={{ scale: 1.04 }}
              transition={{ duration: 0.22, ease: "easeOut", backgroundColor: { duration: 0.44 }, color: { duration: 0.44 } }}
              className="flex h-12 w-12 items-center justify-center rounded-full border-0 bg-white/70 text-gray-500 backdrop-blur-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              style={{ boxShadow: "0 2px 8px 0 rgba(31, 41, 55, 0.20)" }}
            >
              <RefreshCw className="h-5 w-5" />
            </motion.button>
          </TooltipTrigger>
          <TooltipContent side="left">The Pipeline</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <motion.button
              type="button"
              aria-label="Go to foundations section"
              onClick={() => scrollToSection(foundationsSectionRef)}
              whileHover={{ scale: 1.12, backgroundColor: "hsl(var(--primary))", color: "hsl(var(--on-primary))", y: -3 }}
              whileTap={{ scale: 1.04 }}
              transition={{ duration: 0.22, ease: "easeOut", backgroundColor: { duration: 0.44 }, color: { duration: 0.44 } }}
              className="flex h-12 w-12 items-center justify-center rounded-full border-0 bg-white/70 text-gray-500 backdrop-blur-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              style={{ boxShadow: "0 2px 8px 0 rgba(31, 41, 55, 0.20)" }}
            >
              <Users className="h-5 w-5" />
            </motion.button>
          </TooltipTrigger>
          <TooltipContent side="left">Our Family</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <motion.button
              type="button"
              aria-label="Go to network map section"
              onClick={() => scrollToSection(networkSectionRef)}
              whileHover={{ scale: 1.12, backgroundColor: "hsl(var(--primary))", color: "hsl(var(--on-primary))", y: -3 }}
              whileTap={{ scale: 1.04 }}
              transition={{ duration: 0.22, ease: "easeOut", backgroundColor: { duration: 0.44 }, color: { duration: 0.44 } }}
              className="flex h-12 w-12 items-center justify-center rounded-full border-0 bg-white/70 text-gray-500 backdrop-blur-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              style={{ boxShadow: "0 2px 8px 0 rgba(31, 41, 55, 0.20)" }}
            >
              <Map className="h-5 w-5" />
            </motion.button>
          </TooltipTrigger>
          <TooltipContent side="left">The Network</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <motion.a
              href="https://www.instagram.com/claudemsu"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Claude Builder Club Instagram"
              whileHover={{ scale: 1.12, backgroundColor: "hsl(var(--primary))", color: "hsl(var(--on-primary))", y: -3 }}
              whileTap={{ scale: 1.04 }}
              transition={{ duration: 0.22, ease: "easeOut", backgroundColor: { duration: 0.44 }, color: { duration: 0.44 } }}
              className="flex h-12 w-12 items-center justify-center rounded-full border-0 bg-white/70 text-gray-500 backdrop-blur-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              style={{ boxShadow: "0 2px 8px 0 rgba(31, 41, 55, 0.20)" }}
            >
              <Instagram className="h-5 w-5" />
            </motion.a>
          </TooltipTrigger>
          <TooltipContent side="left">@claudemsu</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <motion.a
              href="https://www.linkedin.com/company/claude-msu/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Claude Builder Club LinkedIn"
              whileHover={{ scale: 1.12, backgroundColor: "hsl(var(--primary))", color: "hsl(var(--on-primary))", y: -3 }}
              whileTap={{ scale: 1.04 }}
              transition={{ duration: 0.22, ease: "easeOut", backgroundColor: { duration: 0.44 }, color: { duration: 0.44 } }}
              className="flex h-12 w-12 items-center justify-center rounded-full border-0 bg-white/70 text-gray-500 backdrop-blur-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              style={{ boxShadow: "0 2px 8px 0 rgba(31, 41, 55, 0.20)" }}
            >
              <Linkedin className="h-5 w-5" />
            </motion.a>
          </TooltipTrigger>
          <TooltipContent side="left">@claude-msu</TooltipContent>
        </Tooltip>
      </motion.aside>

      {/* Content */}
      <div className="relative z-30">
        {/* Hero Section - light */}
        <section
          data-glow-tone="cream"
          className="relative min-h-screen flex items-center justify-center overflow-hidden bg-transparent"
        >
          <div className={`relative z-10 container mx-auto px-4 ${isMobile ? 'py-6' : 'py-20'}`}>
            <div className="max-w-5xl mx-auto text-center space-y-14">
              <motion.div
                initial="hidden"
                animate={revealStarted ? "visible" : "hidden"}
                variants={supportReveal}
              >
                <motion.div variants={supportRevealItem}>
                  <div className="flex justify-center">
                    <motion.button
                      type="button"
                      className="relative group rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                      aria-label="Go to login"
                      onClick={() => navigate("/auth#login")}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.8, type: "spring", delay: 0.2 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <motion.div
                        className="relative flex flex-col items-center text-gray-600/60 hover:text-primary"
                        variants={logoFloatVariants}
                        animate="floating"
                        transition={{
                          duration: 5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <div className="absolute inset-0 rounded-full blur-2xl bg-gradient-to-r from-orange-400 to-orange-600 opacity-30" />
                        <img
                          src="/claude-logo.png"
                          alt="Claude Logo"
                          className="relative object-contain transition-all duration-200 group-hover:drop-shadow-[0_0_22px_rgba(255,122,14,0.45)] drop-shadow-2xl w-[7rem] h-[7rem] md:w-28 md:h-28 lg:w-32 lg:h-32 xl:w-[9.25rem] xl:h-[9.25rem]"
                        />
                        <span className="text-center font-medium whitespace-nowrap mt-3 text-xs md:text-xs lg:text-sm">
                          click to login
                        </span>
                      </motion.div>
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>

              <div className={isMobile ? "space-y-6" : "space-y-8"}>
                <h1 className="lg:text-7xl xl:text-8xl text-4xl font-black text-primary leading-tight">
                  <span className="relative inline-block">
                    <span className="invisible">{titleText}</span>
                    <span className="absolute inset-0">
                      {typedTitle}
                      {!isTypingComplete && (
                        <span
                          aria-hidden="true"
                          className="ml-1 inline-block h-[0.95em] w-[8px] translate-y-[-0.16em] bg-primary align-middle animate-cursor-blink"
                        />
                      )}
                    </span>
                  </span>
                </h1>
                <motion.div
                  initial="hidden"
                  animate={revealStarted ? "visible" : "hidden"}
                  variants={supportReveal}
                >
                  <motion.div variants={supportRevealItem} className="flex items-center justify-center gap-3">
                    <img src="/msu-logo.png" alt="MSU" className={`${isMobile ? 'h-8 w-8' : 'h-10 w-10'}`} />
                    <p className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-green-600">
                      Michigan State University
                    </p>
                  </motion.div>
                </motion.div>

                <motion.div
                  initial="hidden"
                  animate={revealStarted ? "visible" : "hidden"}
                  variants={supportReveal}
                >
                  <motion.p
                    variants={supportRevealItem}
                    className={`${isMobile ? 'text-base' : 'text-xl md:text-2xl'} text-gray-600 max-w-3xl mx-auto leading-relaxed`}
                  >
                    A club like no other. Internships, research, mentorship—we don't just talk. We get you there.
                  </motion.p>
                </motion.div>
              </div>


              <motion.div
                initial="hidden"
                animate={revealStarted ? "visible" : "hidden"}
                variants={supportReveal}
              >
                <motion.div variants={supportRevealItem} className="inline-flex flex-col items-center gap-2 text-gray-600">
                  <span className="text-sm font-medium">Scroll to explore</span>
                  <motion.div
                    animate={{ y: [0, 6, 0] }}
                    transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                  >
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Pipeline - abstract circular flow diagram */}
        <section
          ref={pipelineSectionRef}
          data-glow-tone="cream"
          className="relative py-32 bg-transparent"
        >
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="max-w-6xl mx-auto"
            >
              <motion.div variants={fadeInUp} className={`text-center ${isMobile ? 'mb-10' : 'mb-14'}`}>
                <h2 className={`${isMobile ? 'text-4xl' : 'text-5xl md:text-6xl'} font-black text-gray-900`}>
                  The Pipeline.
                </h2>
              </motion.div>
              <motion.div variants={fadeInUp} className="w-full flex flex-col items-center">
                <div className={`relative w-full aspect-square mx-auto overflow-hidden ${isMobile ? "w-full" : "max-w-[min(94vw,820px)] md:max-w-[880px]"}`}>
                  <PipelineDiagram />
                  {!isMobile && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <motion.p
                        className="text-sm md:text-base text-gray-600 leading-snug max-w-[280px] font-medium text-center px-4"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                      >
                        Intro to Fundamentals, project-based classes, resume workshops, mock interviews, and LeetCode prep. We connect you to internships and research.
                      </motion.p>
                    </div>
                  )}
                </div>
                {isMobile && (
                  <motion.p
                    className="mt-6 text-base text-gray-600 leading-snug max-w-[340px] font-medium text-center px-4"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    We set you up—workshops, prep, and real support.
                  </motion.p>
                )}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Big/Little - foundation */}
        <section
          ref={foundationsSectionRef}
          data-glow-tone="dark"
          className="relative py-24 md:py-32 bg-black/45 overflow-hidden"
        >
          {/* Large decorative "3" - centered, bigger on mobile */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden>
            <span className="block text-[90vw] md:text-[min(40vw,32rem)] font-black text-white select-none leading-[0.85] translate-y-[-3%]" style={{ opacity: 0.08 }} aria-hidden>
              3
            </span>
          </div>
          {/* Diagonal stripes */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "repeating-linear-gradient(-45deg, transparent, transparent 12px, white 12px, white 14px)" }} />
          <div className="container mx-auto px-4 relative">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={staggerContainer}
              className="max-w-4xl mx-auto"
            >
              <motion.div
                variants={fadeInUp}
                className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm py-12 md:py-16 px-8 md:px-12 shadow-2xl"
              >
                <div className="absolute left-0 top-8 bottom-8 w-0.5 bg-gradient-to-b from-transparent via-primary/60 to-transparent rounded-full" />
                <div className="pl-8 md:pl-10">
                  <motion.p variants={fadeInUp} className="text-xs font-semibold uppercase tracking-widest text-primary/90 mb-4">
                    Big / Little
                  </motion.p>
                  <motion.h2 variants={fadeInUp} className={`${isMobile ? 'text-3xl' : 'text-4xl md:text-5xl'} font-black text-white mb-6 leading-tight`}>
                    Three families.<br /><span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">One foundation.</span>
                  </motion.h2>
                  <motion.p variants={fadeInUp} className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl">
                    Our big/little system isn't a side perk—it's the foundation of the club. Three families, each with mentors who actually care. You're not a number here. We're the club that goes all in for our members. We call it commitment.
                  </motion.p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Our network ranges far - Map section */}
        <section
          ref={networkSectionRef}
          data-glow-tone="warm"
          className="relative py-32 bg-transparent"
        >
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="max-w-6xl mx-auto"
            >
              <motion.div variants={fadeInUp} className={`text-center ${isMobile ? 'mb-10' : 'mb-14'}`}>
                <h2 className={`${isMobile ? 'text-4xl' : 'text-5xl md:text-6xl'} font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent`}>
                  A network like no other.
                </h2>
              </motion.div>
              <motion.div variants={fadeInUp} className="w-full">
                <NetworkMap />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer data-glow-tone="cream" className="relative bg-transparent py-12">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <img src="/claude-logo-transparent.png" alt="Claude Logo" className="h-8 w-8" />
              <span className="text-lg text-black font-bold">Claude Builder Club @ MSU</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-1 text-sm text-gray-600 mb-2">
              <span>
                Claude Builder Club. Spreading the joy of CS, one project at a time.
              </span>
              <span className="mx-2">|</span>
              <a
                href="mailto:RSO.claudemsu@msu.edu"
                className="underline text-primary hover:text-primary/70 transition-colors font-medium"
              >
                Email us
              </a>
              <span className="mx-2">|</span>
              <a
                href="https://github.com/claude-msu/members-portal/issues/new/choose"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-primary hover:text-primary/70 transition-colors font-medium"
              >
                Report an Issue
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;