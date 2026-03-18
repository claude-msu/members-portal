import { Button } from "@/components/ui/button";
import { Instagram, Linkedin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import NetworkMap from "@/components/NetworkMap";

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

const Index = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const heroRef = useRef<HTMLDivElement>(null);
  const mouseGlowRef = useRef<HTMLDivElement>(null);
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
    hidden: { opacity: 0, x: 28 },
    visible: {
      opacity: 1,
      x: 0,
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

  const updateHeroGlow = (clientX: number, clientY: number) => {
    if (!heroRef.current || !mouseGlowRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    mouseGlowRef.current.style.opacity = "1";
    mouseGlowRef.current.style.background = `radial-gradient(circle 500px at ${x}px ${y}px, rgba(209, 116, 87, 0.15), transparent 80%)`;
  };

  const handleHeroMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    updateHeroGlow(event.clientX, event.clientY);
  };

  const handleHeroMouseLeave = () => {
    if (!mouseGlowRef.current) return;
    mouseGlowRef.current.style.opacity = "0";
  };

  return (
    <div className="min-h-screen relative bg-[hsl(33,100%,97%)]" style={lightModeTokenOverrides}>
      <motion.aside
        initial="hidden"
        animate="visible"
        variants={sideRailReveal}
        className="fixed right-4 top-1/2 z-50 hidden -translate-y-1/2 md:flex md:flex-col md:gap-3"
      >
        <motion.a
          href="https://www.instagram.com/claudemsu"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Claude Builder Club Instagram"
          whileHover={{
            scale: 1.12,
            backgroundColor: "hsl(var(--primary))",
            color: "hsl(var(--on-primary))",
            y: -3,
          }}
          whileTap={{ scale: 1.04 }}
          transition={{
            duration: 0.22,
            ease: "easeOut",
            backgroundColor: { duration: 0.44 },
            color: { duration: 0.44 },
          }}
          className="flex h-12 w-12 items-center justify-center rounded-full border-0 bg-white/70 text-lg font-black lowercase text-gray-500 backdrop-blur-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          style={{
            boxShadow:
              "0 2px 8px 0 rgba(31, 41, 55, 0.20)", // reduced shadow
          }}
        >
          ig
        </motion.a>
        <motion.a
          href="https://www.linkedin.com/company/claude-msu/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Claude Builder Club LinkedIn"
          whileHover={{
            scale: 1.12,
            backgroundColor: "hsl(var(--primary))",
            color: "hsl(var(--on-primary))",
            y: -3,
          }}
          whileTap={{ scale: 1.04 }}
          transition={{
            duration: 0.22,
            ease: "easeOut",
            backgroundColor: { duration: 0.44 },
            color: { duration: 0.44 },
          }}
          className="flex h-12 w-12 items-center justify-center rounded-full border-0 bg-white/70 text-lg font-black lowercase text-gray-500 backdrop-blur-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          style={{
            boxShadow:
              "0 2px 8px 0 rgba(31, 41, 55, 0.20)", // reduced shadow
          }}
        >
          in
        </motion.a>
        <motion.button
          type="button"
          aria-label="Open signup"
          onClick={() => navigate("/auth#signup")}
          whileHover={{
            scale: 1.12,
            backgroundColor: "hsl(var(--primary))",
            color: "hsl(var(--on-primary))",
            y: -3,
          }}
          whileTap={{ scale: 1.04 }}
          transition={{
            duration: 0.22,
            ease: "easeOut",
            backgroundColor: { duration: 0.44 },
            color: { duration: 0.44 },
          }}
          className="flex h-12 w-12 items-center justify-center rounded-full border-0 bg-white/70 text-lg font-black text-gray-500 backdrop-blur-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          style={{
            boxShadow:
              "0 2px 8px 0 rgba(31, 41, 55, 0.20)", // reduced shadow
          }}
        >
          ..
        </motion.button>
      </motion.aside>

      {/* Content */}
      <div className="relative z-30">
        {/* Hero Section - light */}
        <section
          ref={heroRef}
          onMouseMove={handleHeroMouseMove}
          onMouseLeave={handleHeroMouseLeave}
          className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[hsl(33,100%,97%)] via-[hsl(30,100%,95%)] to-[hsl(33,100%,97%)]"
        >
          {/* Soft blurred background field */}
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden
            style={{
              background:
                "radial-gradient(60% 55% at 50% 48%, hsl(var(--primary) / 0.12) 0%, hsl(var(--primary) / 0.05) 35%, transparent 72%)",
              filter: "blur(18px)",
            }}
          />
          <div
            ref={mouseGlowRef}
            className="absolute inset-0 pointer-events-none z-[1] opacity-0 transition-opacity duration-200 mix-blend-multiply"
            aria-hidden
          />
          <div className={`relative z-10 container mx-auto px-4 ${isMobile ? 'py-6' : 'py-20'}`}>
            <div className={`max-w-5xl mx-auto text-center ${isMobile ? 'space-y-6' : 'space-y-14'}`}>
              <motion.div
                initial="hidden"
                animate={revealStarted ? "visible" : "hidden"}
                variants={supportReveal}
              >
                <motion.div variants={supportRevealItem}>
                  <div className="flex justify-center mb-8 py-10">
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
                          className="relative object-contain transition-all duration-200 group-hover:drop-shadow-[0_0_22px_rgba(255,122,14,0.45)] drop-shadow-2xl w-[4.5rem] h-[4.5rem] md:w-28 md:h-28 lg:w-32 lg:h-32 xl:w-[9.25rem] xl:h-[9.25rem]"
                        />
                        <span className="text-center font-medium whitespace-nowrap mt-3 text-xs md:text-xs lg:text-sm">
                          Click to login
                        </span>
                      </motion.div>
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>

              <div className={isMobile ? "space-y-6" : "space-y-8"}>
                <h1 className="lg:text-7xl xl:text-8xl text-5xl font-black text-primary leading-tight">
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
                className={`${isMobile ? 'pt-6' : 'pt-12'}`}
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

        {/* Our network ranges far - Map section */}
        <section className="relative py-32 bg-gradient-to-br from-orange-50/30 via-cream to-orange-50/30">
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

        {/* Big/Little - foundation */}
        <section className="relative py-24 md:py-32 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
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

        {/* Internships & research - arrow diagram */}
        <section className="relative py-24 md:py-32 bg-cream overflow-hidden">
          <div className="container mx-auto px-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={staggerContainer}
              className="max-w-4xl mx-auto"
            >
              <motion.h2 variants={fadeInUp} className={`${isMobile ? 'text-3xl' : 'text-4xl md:text-5xl'} font-black text-gray-900 text-center mb-16 md:mb-20`}>
                We get you there
              </motion.h2>
              {/* Diagram: You → Classes → Projects → Research → Internships */}
              <motion.div variants={fadeInUp} className="relative flex flex-col md:flex-row items-center justify-center gap-4 md:gap-2 flex-wrap md:flex-nowrap w-full">
                <div className="rounded-full bg-gray-200 px-5 py-2.5 text-sm font-bold text-gray-800 shrink-0 shadow-sm">You</div>
                <svg className="hidden md:block w-8 h-5 shrink-0 text-primary" fill="none" viewBox="0 0 40 20" aria-hidden><path d="M0 10h22M22 6l6 4-6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <div className="md:hidden text-primary" aria-hidden>↓</div>
                <div className="rounded-full bg-primary/15 border-2 border-primary/40 px-4 py-2.5 text-sm font-bold text-gray-900 shrink-0">Classes</div>
                <svg className="hidden md:block w-8 h-5 shrink-0 text-primary" fill="none" viewBox="0 0 40 20" aria-hidden><path d="M0 10h22M22 6l6 4-6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <div className="md:hidden text-primary" aria-hidden>↓</div>
                <div className="rounded-full bg-primary/15 border-2 border-primary/40 px-4 py-2.5 text-sm font-bold text-gray-900 shrink-0">Projects</div>
                <svg className="hidden md:block w-8 h-5 shrink-0 text-primary" fill="none" viewBox="0 0 40 20" aria-hidden><path d="M0 10h22M22 6l6 4-6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <div className="md:hidden text-primary" aria-hidden>↓</div>
                <div className="rounded-full bg-primary/15 border-2 border-primary/40 px-4 py-2.5 text-sm font-bold text-gray-900 shrink-0">Research</div>
                <svg className="hidden md:block w-8 h-5 shrink-0 text-primary" fill="none" viewBox="0 0 40 20" aria-hidden><path d="M0 10h22M22 6l6 4-6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <div className="md:hidden text-primary" aria-hidden>↓</div>
                <div className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white shrink-0 shadow-lg ring-2 ring-primary/30">Internships</div>
              </motion.div>
              <motion.p variants={fadeInUp} className="text-center text-lg md:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto mt-14">
                We built the pipeline; you go through it. Resume workshops. Mock interviews. LeetCode prep. We don't just pass you the ball—we give you an alley-oop.
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className={`relative ${isMobile ? 'py-20' : 'py-32'} bg-gradient-to-br from-primary via-primary/80 to-primary text-white overflow-hidden`}>
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="container mx-auto px-4 relative z-10"
          >
            <div className="max-w-4xl mx-auto text-center space-y-12">
              <h2 className={`${isMobile ? 'text-4xl' : 'text-5xl md:text-7xl'} font-black leading-tight`}>
                Spread the Joy of CS
              </h2>
              <p className={`${isMobile ? 'text-lg' : 'text-xl md:text-2xl'} opacity-95 max-w-2xl mx-auto leading-relaxed`}>
                Join the club that goes all in. Three families, real prep, and a network like no other.
              </p>

              <div className={`flex items-center justify-center gap-6 pt-8 ${isMobile ? 'flex-col' : 'flex-row'}`}>
                <Button
                  size="lg"
                  onClick={() => window.open('https://www.instagram.com/claudemsu', '_blank')}
                  className={`bg-white text-primary hover:bg-cream font-bold shadow-2xl hover:scale-105 transition-transform ${isMobile ? 'text-base px-8 py-6 w-full max-w-xs' : 'text-lg px-10 py-7'}`}
                >
                  <Instagram className={`${isMobile ? 'h-5 w-5 mr-2' : 'h-6 w-6 mr-3'}`} />
                  Instagram
                </Button>

                <Button
                  size="lg"
                  onClick={() => navigate('/auth#signup')}
                  className={`bg-white text-primary hover:bg-cream font-bold shadow-2xl hover:scale-110 transition-transform border-4 border-white/50 ${isMobile ? 'text-lg px-12 py-7 w-full max-w-xs' : 'text-xl px-16 py-8'}`}
                >
                  Apply Now
                </Button>

                <Button
                  size="lg"
                  onClick={() => window.open('https://www.linkedin.com/company/claude-msu/', '_blank')}
                  className={`bg-white text-primary hover:bg-cream font-bold shadow-2xl hover:scale-105 transition-transform ${isMobile ? 'text-base px-8 py-6 w-full max-w-xs' : 'text-lg px-10 py-7'}`}
                >
                  <Linkedin className={`${isMobile ? 'h-5 w-5 mr-2' : 'h-6 w-6 mr-3'}`} />
                  LinkedIn
                </Button>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="relative bg-cream py-12">
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