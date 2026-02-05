import { AbsoluteFill, Artifact, useCurrentFrame, interpolate, Sequence, Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";
import { FourColorGradient } from "../library/components/effects/FourColorGradient";
import { Glass } from "../library/components/effects/Glass";
import { TextAnimation } from "../library/components/text/TextAnimation";
import { BrowserMockup } from "../library/components/mockups/BrowserMockup";
import { Cursor } from "../library/components/ui/Cursor";
import { TransitionSeries, linearTiming, getPresentation } from "../library/components/layout/Transition";

const hmrKey = Date.now();

// ============================================
// Color Palette
// ============================================
const COLORS = {
  primary: "#8B5CF6", // Purple
  secondary: "#EC4899", // Pink
  accent: "#3B82F6", // Blue
  light: "#F8FAFC",
  dark: "#1E1B4B",
  gradients: {
    topLeft: "#F472B6",
    topRight: "#C4B5FD",
    bottomLeft: "#FBCFE8",
    bottomRight: "#A5B4FC",
  }
};

// ============================================
// Floating Glass Element
// ============================================
const FloatingGlass: React.FC<{
  children?: React.ReactNode;
  x: number;
  y: number;
  width: number;
  height: number;
  delay?: number;
  blur?: number;
}> = ({ children, x, y, width, height, delay = 0, blur = 20 }) => {
  const frame = useCurrentFrame();
  
  const floatY = Math.sin((frame + delay * 30) / 40) * 15;
  const floatX = Math.cos((frame + delay * 30) / 50) * 8;
  const rotate = Math.sin((frame + delay * 30) / 60) * 3;
  
  const opacity = interpolate(
    frame,
    [0, 20 + delay * 10, 30 + delay * 10],
    [0, 0, 0.6],
    { extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height,
        transform: `translate(${floatX}px, ${floatY}px) rotate(${rotate}deg)`,
        opacity,
      }}
    >
      <Glass blur={blur} opacity={0.15} borderRadius={24} borderOpacity={0.3} style={{ width: "100%", height: "100%" }}>
        {children}
      </Glass>
    </div>
  );
};

// ============================================
// Animated Background
// ============================================
const AnimatedBackground: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  
  return (
    <FourColorGradient
      topLeft={COLORS.gradients.topLeft}
      topRight={COLORS.gradients.topRight}
      bottomLeft={COLORS.gradients.bottomLeft}
      bottomRight={COLORS.gradients.bottomRight}
      animate
      animationType="shift"
      speed={0.15}
      blend={80}
    >
      {/* Floating glass elements */}
      <FloatingGlass x={-100} y={200} width={300} height={200} delay={0} blur={25} />
      <FloatingGlass x={1700} y={400} width={250} height={180} delay={1} blur={30} />
      <FloatingGlass x={100} y={700} width={200} height={150} delay={2} blur={20} />
      <FloatingGlass x={1500} y={100} width={280} height={200} delay={0.5} blur={28} />
      {children}
    </FourColorGradient>
  );
};

// ============================================
// Scene: Intro Text
// ============================================
const IntroScene: React.FC = () => {
  const { fontFamily } = loadFont();
  
  return (
    <AnimatedBackground>
      <AbsoluteFill className="flex items-center justify-center">
        <div className="text-center" style={{ fontFamily }}>
          {/* Line 1: Every browsing session has to */}
          <Sequence from={0} durationInFrames={90} layout="none">
            <TextAnimation
              key={`${hmrKey}-intro1`}
              className="text-6xl font-medium text-white mb-4"
              style={{ textShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
              createTimeline={({ textRef, tl, SplitText }) => {
                const split = new SplitText(textRef.current, { type: "words" });
                tl.from(split.words, {
                  opacity: 0,
                  y: 40,
                  filter: "blur(10px)",
                  duration: 0.6,
                  stagger: 0.08,
                  ease: "power3.out",
                });
                return tl;
              }}
            >
              Every browsing session has to
            </TextAnimation>
          </Sequence>

          {/* Line 2: start with focus */}
          <Sequence from={25} durationInFrames={90}>
            <TextAnimation
              key={`${hmrKey}-intro2`}
              className="text-7xl font-bold mb-6"
              style={{ 
                background: "linear-gradient(135deg, #fff 0%, #C4B5FD 50%, #3B82F6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textShadow: "0 4px 30px rgba(139, 92, 246, 0.3)",
              }}
              createTimeline={({ textRef, tl, SplitText }) => {
                const split = new SplitText(textRef.current, { type: "chars" });
                tl.from(split.chars, {
                  opacity: 0,
                  scale: 0.5,
                  rotationY: 90,
                  filter: "blur(15px)",
                  duration: 0.8,
                  stagger: 0.04,
                  ease: "back.out(1.7)",
                });
                return tl;
              }}
            >
              start with focus
            </TextAnimation>
          </Sequence>

          {/* Line 3: and not distractions */}
          <Sequence from={55} durationInFrames={60} layout="none">
            <TextAnimation
              key={`${hmrKey}-intro3`}
              className="text-5xl font-light text-white/80"
              createTimeline={({ textRef, tl, SplitText }) => {
                const split = new SplitText(textRef.current, { type: "words" });
                tl.from(split.words, {
                  opacity: 0,
                  y: 30,
                  duration: 0.5,
                  stagger: 0.1,
                  ease: "power2.out",
                });
                return tl;
              }}
            >
              and not distractions
            </TextAnimation>
          </Sequence>
        </div>
      </AbsoluteFill>
    </AnimatedBackground>
  );
};

// ============================================
// Scene: Logo Reveal
// ============================================
const LogoRevealScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fontFamily } = loadFont();
  
  const logoScale = interpolate(
    frame,
    [0, 15, 25],
    [0, 1.2, 1],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.back(1.7)) }
  );
  
  const logoOpacity = interpolate(
    frame,
    [0, 10],
    [0, 1],
    { extrapolateRight: "clamp" }
  );
  
  const logoRotate = interpolate(
    frame,
    [0, 20],
    [-180, 0],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );

  return (
    <AnimatedBackground>
      <AbsoluteFill className="flex items-center justify-center">
        <div 
          style={{ 
            transform: `scale(${logoScale}) rotate(${logoRotate}deg)`,
            opacity: logoOpacity,
          }}
        >
          {/* Logo Icon */}
          <div 
            style={{
              width: 140,
              height: 140,
              borderRadius: 32,
              background: "linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 20px 60px rgba(139, 92, 246, 0.4)",
            }}
          >
            <span style={{ fontFamily, fontSize: 80, fontWeight: 700, color: "white" }}>3</span>
          </div>
        </div>

        {/* Product description text */}
        <Sequence from={30}>
          <div className="absolute" style={{ top: "60%" }}>
            <TextAnimation
              key={`${hmrKey}-tagline`}
              className="text-4xl text-center"
              style={{ fontFamily }}
              createTimeline={({ textRef, tl, SplitText }) => {
                const split = new SplitText(textRef.current, { type: "words" });
                tl.from(split.words, {
                  opacity: 0,
                  y: 30,
                  duration: 0.6,
                  stagger: 0.08,
                  ease: "power2.out",
                });
                return tl;
              }}
            >
              <span className="text-white font-light">Clean, purpose built </span>
              <span style={{ 
                background: "linear-gradient(90deg, #8B5CF6, #3B82F6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: 600,
              }}>
                productivity dashboard
              </span>
            </TextAnimation>
          </div>
        </Sequence>
      </AbsoluteFill>
    </AnimatedBackground>
  );
};

// ============================================
// Task Card Component
// ============================================
const TaskCard: React.FC<{
  title: string;
  tasks: { text: string; completed?: boolean; time?: string }[];
  highlighted?: boolean;
}> = ({ title, tasks, highlighted }) => {
  const { fontFamily } = loadFont();
  
  return (
    <div 
      style={{
        background: "white",
        borderRadius: 16,
        padding: 20,
        width: 280,
        boxShadow: highlighted 
          ? "0 0 0 3px rgba(59, 130, 246, 0.5), 0 10px 40px rgba(0,0,0,0.1)"
          : "0 4px 20px rgba(0,0,0,0.08)",
        fontFamily,
        transition: "box-shadow 0.3s ease",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <span style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>{title}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
      {tasks.map((task, i) => (
        <div key={i} className="flex items-center gap-3 mb-3">
          <div 
            style={{
              width: 18,
              height: 18,
              borderRadius: 4,
              border: task.completed ? "none" : "2px solid #D1D5DB",
              background: task.completed ? "#3B82F6" : "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {task.completed && (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                <path d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          <span style={{ 
            fontSize: 14, 
            color: task.completed ? "#9CA3AF" : "#374151",
            textDecoration: task.completed ? "line-through" : "none",
            flex: 1,
          }}>
            {task.text}
          </span>
          {task.time && (
            <span style={{ fontSize: 12, color: "#9CA3AF" }}>{task.time}</span>
          )}
        </div>
      ))}
      <button 
        style={{
          fontSize: 13,
          color: "#9CA3AF",
          background: "none",
          border: "none",
          padding: "8px 0",
          cursor: "pointer",
        }}
      >
        + Add task...
      </button>
    </div>
  );
};

// ============================================
// Scene: Browser UI Demo
// ============================================
const BrowserDemoScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fontFamily } = loadFont();
  
  const browserScale = interpolate(
    frame,
    [0, 30],
    [0.9, 1],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }
  );
  
  const browserOpacity = interpolate(
    frame,
    [0, 20],
    [0, 1],
    { extrapolateRight: "clamp" }
  );

  return (
    <AnimatedBackground>
      <AbsoluteFill className="flex items-center justify-center">
        {/* Feature text */}
        <div 
          className="absolute"
          style={{ 
            left: 100, 
            top: "50%", 
            transform: "translateY(-50%)",
            zIndex: 10,
          }}
        >
          <Sequence from={20}>
            <TextAnimation
              key={`${hmrKey}-feature1`}
              className="text-5xl font-semibold text-white"
              style={{ fontFamily, textShadow: "0 4px 30px rgba(0,0,0,0.2)" }}
              createTimeline={({ textRef, tl, SplitText }) => {
                const split = new SplitText(textRef.current, { type: "words" });
                tl.from(split.words, {
                  opacity: 0,
                  x: -50,
                  duration: 0.6,
                  stagger: 0.1,
                  ease: "power3.out",
                });
                return tl;
              }}
            >
              Add tasks<br/>in seconds
            </TextAnimation>
          </Sequence>
        </div>

        {/* Browser mockup */}
        <div 
          style={{ 
            transform: `scale(${browserScale})`,
            opacity: browserOpacity,
            marginLeft: 200,
          }}
        >
          <BrowserMockup
            browser="chrome"
            theme="light"
            url="browsilla.com"
            tabTitle="Browsilla"
            width={1000}
            height={650}
            shadow
          >
            <div style={{ 
              background: "linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%)",
              height: "100%",
              padding: 40,
              fontFamily,
            }}>
              {/* Time and greeting */}
              <div className="text-center mb-8">
                <div style={{ fontSize: 64, fontWeight: 200, color: "#1F2937" }}>14:09</div>
                <div style={{ fontSize: 20, color: "#6B7280" }}>Good afternoon, John</div>
              </div>

              {/* Search bar */}
              <div 
                style={{
                  maxWidth: 600,
                  margin: "0 auto 40px",
                  background: "white",
                  borderRadius: 30,
                  padding: "14px 24px",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" fill="#9CA3AF"/>
                </svg>
                <span style={{ color: "#9CA3AF", fontSize: 15 }}>Search Google...</span>
              </div>

              {/* Task cards */}
              <div className="flex justify-center gap-6">
                <TaskCard
                  title="General"
                  tasks={[
                    { text: "Pickup Sarah from soccer", time: "2d" },
                    { text: "File Taxes" },
                  ]}
                  highlighted={frame > 40}
                />
                <TaskCard
                  title="Work"
                  tasks={[
                    { text: "Client Presentation" },
                    { text: "Monthly Management Reporting" },
                  ]}
                />
                <TaskCard
                  title="Shopping"
                  tasks={[
                    { text: "Milk", completed: true },
                    { text: "Bread" },
                    { text: "Eggs" },
                  ]}
                />
              </div>
            </div>
          </BrowserMockup>

          {/* Cursor */}
          <Cursor
            path={[
              { x: 500, y: 500, frame: 0 },
              { x: 350, y: 380, frame: 30, ease: "smooth" },
              { x: 350, y: 380, frame: 45, click: true },
            ]}
            size={28}
            color="#000"
            showClickRipple
            rippleColor="rgba(59, 130, 246, 0.4)"
          />
        </div>
      </AbsoluteFill>
    </AnimatedBackground>
  );
};

// ============================================
// Scene: Feature Highlight - What matters most
// ============================================
const WhatMattersScene: React.FC = () => {
  const { fontFamily } = loadFont();
  
  return (
    <AnimatedBackground>
      <AbsoluteFill className="flex items-center justify-center">
        <TextAnimation
          key={`${hmrKey}-matters`}
          className="text-7xl font-semibold text-center"
          style={{ fontFamily }}
          createTimeline={({ textRef, tl, SplitText }) => {
            const split = new SplitText(textRef.current, { type: "words" });
            tl.from(split.words, {
              opacity: 0,
              y: 60,
              rotationX: -45,
              filter: "blur(10px)",
              duration: 0.8,
              stagger: 0.12,
              ease: "power3.out",
            });
            return tl;
          }}
        >
          <span className="text-white">What matters </span>
          <span style={{ 
            background: "linear-gradient(90deg, #3B82F6, #8B5CF6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            most
          </span>
        </TextAnimation>
      </AbsoluteFill>
    </AnimatedBackground>
  );
};

// ============================================
// Scene: Weather Feature
// ============================================
const WeatherScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fontFamily } = loadFont();
  
  const iconScale = interpolate(
    frame,
    [20, 35, 45],
    [0, 1.2, 1],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.back(2)) }
  );
  
  const iconOpacity = interpolate(
    frame,
    [20, 30],
    [0, 1],
    { extrapolateRight: "clamp" }
  );

  return (
    <AnimatedBackground>
      <AbsoluteFill className="flex items-center justify-center">
        <div className="flex items-center gap-8" style={{ fontFamily }}>
          <Sequence from={0}>
            <TextAnimation
              key={`${hmrKey}-weather1`}
              className="text-6xl font-medium text-white"
              createTimeline={({ textRef, tl, SplitText }) => {
                const split = new SplitText(textRef.current, { type: "words" });
                tl.from(split.words, {
                  opacity: 0,
                  y: 40,
                  duration: 0.6,
                  stagger: 0.1,
                  ease: "power2.out",
                });
                return tl;
              }}
            >
              Check the
            </TextAnimation>
          </Sequence>
          
          {/* Weather Icon */}
          <div 
            style={{
              width: 80,
              height: 80,
              borderRadius: 20,
              background: "linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `scale(${iconScale})`,
              opacity: iconOpacity,
              boxShadow: "0 10px 30px rgba(59, 130, 246, 0.4)",
            }}
          >
            <svg width="48" height="48" viewBox="0 0 24 24" fill="white">
              <path d="M12.5 6.5a4 4 0 00-4 4 .5.5 0 01-1 0 5 5 0 015-5 .5.5 0 010 1zM6 10.5a6.5 6.5 0 0112.25 3H19a4 4 0 010 8H6a4 4 0 010-8h.75A6.5 6.5 0 016 10.5z"/>
            </svg>
          </div>
          
          <Sequence from={30}>
            <TextAnimation
              key={`${hmrKey}-weather2`}
              className="text-6xl font-semibold"
              style={{ 
                background: "linear-gradient(90deg, #3B82F6, #60A5FA)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
              createTimeline={({ textRef, tl, SplitText }) => {
                const split = new SplitText(textRef.current, { type: "chars" });
                tl.from(split.chars, {
                  opacity: 0,
                  scale: 0.5,
                  duration: 0.5,
                  stagger: 0.03,
                  ease: "back.out(1.7)",
                });
                return tl;
              }}
            >
              weather
            </TextAnimation>
          </Sequence>
        </div>
      </AbsoluteFill>
    </AnimatedBackground>
  );
};

// ============================================
// Scene: Daily Inspiration
// ============================================
const InspirationScene: React.FC = () => {
  const { fontFamily } = loadFont();
  
  return (
    <AnimatedBackground>
      <AbsoluteFill className="flex flex-col items-center justify-center gap-12">
        <Sequence from={0}>
          <TextAnimation
            key={`${hmrKey}-inspiration-title`}
            className="text-6xl font-semibold text-white"
            style={{ fontFamily }}
            createTimeline={({ textRef, tl, SplitText }) => {
              const split = new SplitText(textRef.current, { type: "words" });
              tl.from(split.words, {
                opacity: 0,
                y: 40,
                duration: 0.6,
                stagger: 0.1,
                ease: "power2.out",
              });
              return tl;
            }}
          >
            Get daily inspiration
          </TextAnimation>
        </Sequence>
        
        <Sequence from={25}>
          <div 
            style={{
              maxWidth: 800,
              padding: "40px 60px",
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(20px)",
              borderRadius: 24,
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <TextAnimation
              key={`${hmrKey}-quote`}
              className="text-3xl text-white/90 text-center italic"
              style={{ fontFamily, lineHeight: 1.6 }}
              createTimeline={({ textRef, tl, SplitText }) => {
                const split = new SplitText(textRef.current, { type: "words" });
                tl.from(split.words, {
                  opacity: 0,
                  filter: "blur(8px)",
                  duration: 0.5,
                  stagger: 0.04,
                  ease: "power2.out",
                });
                return tl;
              }}
            >
              "Be the change that you wish to see in the world."
            </TextAnimation>
            <div 
              className="text-xl text-white/60 text-center mt-4"
              style={{ fontFamily }}
            >
              — Mahatma Gandhi
            </div>
          </div>
        </Sequence>
      </AbsoluteFill>
    </AnimatedBackground>
  );
};

// ============================================
// Scene: All without leaving browser
// ============================================
const WithoutLeavingScene: React.FC = () => {
  const { fontFamily } = loadFont();
  
  return (
    <AnimatedBackground>
      <AbsoluteFill className="flex items-center justify-center">
        <TextAnimation
          key={`${hmrKey}-without`}
          className="text-6xl font-medium text-white text-center"
          style={{ fontFamily, maxWidth: 900, lineHeight: 1.3 }}
          createTimeline={({ textRef, tl, SplitText }) => {
            const split = new SplitText(textRef.current, { type: "words" });
            tl.from(split.words, {
              opacity: 0,
              y: 50,
              rotationX: -30,
              duration: 0.7,
              stagger: 0.08,
              ease: "power3.out",
            });
            return tl;
          }}
        >
          all without leaving your browser
        </TextAnimation>
      </AbsoluteFill>
    </AnimatedBackground>
  );
};

// ============================================
// Scene: Everything in one place
// ============================================
const OnePlaceScene: React.FC = () => {
  const { fontFamily } = loadFont();
  
  return (
    <AnimatedBackground>
      <AbsoluteFill className="flex flex-col items-center justify-center gap-6">
        <Sequence from={0}>
          <TextAnimation
            key={`${hmrKey}-everything`}
            className="text-5xl font-medium text-white"
            style={{ fontFamily }}
            createTimeline={({ textRef, tl, SplitText }) => {
              const split = new SplitText(textRef.current, { type: "words" });
              tl.from(split.words, {
                opacity: 0,
                y: 40,
                duration: 0.6,
                stagger: 0.1,
                ease: "power2.out",
              });
              return tl;
            }}
          >
            Everything you check daily
          </TextAnimation>
        </Sequence>
        
        <Sequence from={25}>
          <TextAnimation
            key={`${hmrKey}-oneplace`}
            className="text-7xl font-bold"
            style={{ 
              fontFamily,
              background: "linear-gradient(135deg, #fff 0%, #C4B5FD 50%, #EC4899 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
            createTimeline={({ textRef, tl, SplitText }) => {
              const split = new SplitText(textRef.current, { type: "chars" });
              tl.from(split.chars, {
                opacity: 0,
                scale: 0,
                rotationY: 90,
                duration: 0.6,
                stagger: 0.03,
                ease: "back.out(1.7)",
              });
              return tl;
            }}
          >
            Now in one place
          </TextAnimation>
        </Sequence>
      </AbsoluteFill>
    </AnimatedBackground>
  );
};

// ============================================
// Scene: Benefits Montage
// ============================================
const BenefitsMontageScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fontFamily } = loadFont();
  
  const benefits = ["Fewer tabs", "Less clutter", "More focus"];
  const benefitDuration = 25; // frames per benefit

  return (
    <AnimatedBackground>
      <AbsoluteFill className="flex items-center justify-center">
        {benefits.map((benefit, i) => {
          const startFrame = i * benefitDuration;
          const isActive = frame >= startFrame && (i === benefits.length - 1 || frame < (i + 1) * benefitDuration);
          
          if (!isActive) return null;
          
          const localFrame = frame - startFrame;
          const scale = interpolate(localFrame, [0, 10, benefitDuration - 5, benefitDuration], [0.8, 1, 1, 0.9], { extrapolateRight: "clamp" });
          const opacity = interpolate(localFrame, [0, 8, benefitDuration - 5, benefitDuration], [0, 1, 1, 0], { extrapolateRight: "clamp" });
          
          return (
            <div
              key={benefit}
              style={{
                transform: `scale(${scale})`,
                opacity,
              }}
            >
              <span 
                className="text-7xl font-bold"
                style={{ 
                  fontFamily,
                  background: i === 2 
                    ? "linear-gradient(90deg, #3B82F6, #8B5CF6)"
                    : "linear-gradient(90deg, #fff, #C4B5FD)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {benefit}
              </span>
            </div>
          );
        })}
      </AbsoluteFill>
    </AnimatedBackground>
  );
};

// ============================================
// Scene: Privacy
// ============================================
const PrivacyScene: React.FC = () => {
  const { fontFamily } = loadFont();
  
  return (
    <AnimatedBackground>
      <AbsoluteFill className="flex items-center justify-center">
        <TextAnimation
          key={`${hmrKey}-privacy`}
          className="text-6xl font-medium text-center"
          style={{ fontFamily }}
          createTimeline={({ textRef, tl, SplitText }) => {
            const split = new SplitText(textRef.current, { type: "words" });
            tl.from(split.words, {
              opacity: 0,
              y: 50,
              duration: 0.7,
              stagger: 0.1,
              ease: "power3.out",
            });
            return tl;
          }}
        >
          <span className="text-white">Built with </span>
          <span style={{ 
            background: "linear-gradient(90deg, #3B82F6, #8B5CF6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            privacy at its core
          </span>
        </TextAnimation>
      </AbsoluteFill>
    </AnimatedBackground>
  );
};

// ============================================
// Scene: CTA - Start focused with Browsilla
// ============================================
const CTAScene: React.FC = () => {
  const { fontFamily } = loadFont();
  
  return (
    <AnimatedBackground>
      <AbsoluteFill className="flex flex-col items-center justify-center gap-6">
        <Sequence from={0}>
          <TextAnimation
            key={`${hmrKey}-cta1`}
            className="text-5xl font-medium text-white"
            style={{ fontFamily }}
            createTimeline={({ textRef, tl, SplitText }) => {
              const split = new SplitText(textRef.current, { type: "words" });
              tl.from(split.words, {
                opacity: 0,
                y: 40,
                duration: 0.6,
                stagger: 0.1,
                ease: "power2.out",
              });
              return tl;
            }}
          >
            Start every session
          </TextAnimation>
        </Sequence>
        
        <Sequence from={20}>
          <TextAnimation
            key={`${hmrKey}-cta2`}
            className="text-5xl font-medium text-white"
            style={{ fontFamily }}
            createTimeline={({ textRef, tl, SplitText }) => {
              const split = new SplitText(textRef.current, { type: "words" });
              tl.from(split.words, {
                opacity: 0,
                y: 40,
                duration: 0.6,
                stagger: 0.1,
                ease: "power2.out",
              });
              return tl;
            }}
          >
            focused with
          </TextAnimation>
        </Sequence>
        
        <Sequence from={40}>
          <TextAnimation
            key={`${hmrKey}-cta3`}
            className="text-8xl font-bold"
            style={{ 
              fontFamily,
              background: "linear-gradient(90deg, #3B82F6 0%, #EC4899 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
            createTimeline={({ textRef, tl, SplitText }) => {
              const split = new SplitText(textRef.current, { type: "chars" });
              tl.from(split.chars, {
                opacity: 0,
                scale: 0,
                rotationY: 180,
                duration: 0.8,
                stagger: 0.04,
                ease: "back.out(1.7)",
              });
              return tl;
            }}
          >
            Browsilla
          </TextAnimation>
        </Sequence>
      </AbsoluteFill>
    </AnimatedBackground>
  );
};

// ============================================
// Scene: Final Logo
// ============================================
const FinalLogoScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fontFamily } = loadFont();
  
  const logoScale = interpolate(
    frame,
    [0, 20, 30],
    [0.8, 1.05, 1],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.back(1.5)) }
  );
  
  const logoOpacity = interpolate(
    frame,
    [0, 15],
    [0, 1],
    { extrapolateRight: "clamp" }
  );

  return (
    <AnimatedBackground>
      <AbsoluteFill className="flex items-center justify-center">
        <div 
          style={{ 
            transform: `scale(${logoScale})`,
            opacity: logoOpacity,
          }}
        >
          <span 
            className="text-9xl font-bold"
            style={{ 
              fontFamily,
              background: "linear-gradient(90deg, #3B82F6 0%, #EC4899 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 20px 60px rgba(139, 92, 246, 0.3)",
            }}
          >
            Browsilla
          </span>
        </div>
      </AbsoluteFill>
    </AnimatedBackground>
  );
};

// ============================================
// Main Component
// ============================================
export const Main: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <>
      {frame === 0 && (
        <Artifact content={Artifact.Thumbnail} filename="thumbnail.jpeg" />
      )}
      
      <TransitionSeries>
        {/* Scene 1: Intro - Every browsing session should start with focus */}
        <TransitionSeries.Sequence durationInFrames={120}>
          <IntroScene />
        </TransitionSeries.Sequence>
        
        <TransitionSeries.Transition
          presentation={getPresentation("blurDissolve")}
          timing={linearTiming({ durationInFrames: 15 })}
        />
        
        {/* Scene 2: Logo reveal */}
        <TransitionSeries.Sequence durationInFrames={90}>
          <LogoRevealScene />
        </TransitionSeries.Sequence>
        
        <TransitionSeries.Transition
          presentation={getPresentation("blurDissolve")}
          timing={linearTiming({ durationInFrames: 15 })}
        />
        
        {/* Scene 3: Browser Demo - Add tasks */}
        <TransitionSeries.Sequence durationInFrames={120}>
          <BrowserDemoScene />
        </TransitionSeries.Sequence>
        
        <TransitionSeries.Transition
          presentation={getPresentation("blurDissolve")}
          timing={linearTiming({ durationInFrames: 12 })}
        />
        
        {/* Scene 4: What matters most */}
        <TransitionSeries.Sequence durationInFrames={60}>
          <WhatMattersScene />
        </TransitionSeries.Sequence>
        
        <TransitionSeries.Transition
          presentation={getPresentation("blurDissolve")}
          timing={linearTiming({ durationInFrames: 12 })}
        />
        
        {/* Scene 5: Weather */}
        <TransitionSeries.Sequence durationInFrames={75}>
          <WeatherScene />
        </TransitionSeries.Sequence>
        
        <TransitionSeries.Transition
          presentation={getPresentation("blurDissolve")}
          timing={linearTiming({ durationInFrames: 12 })}
        />
        
        {/* Scene 6: Daily Inspiration */}
        <TransitionSeries.Sequence durationInFrames={90}>
          <InspirationScene />
        </TransitionSeries.Sequence>
        
        <TransitionSeries.Transition
          presentation={getPresentation("blurDissolve")}
          timing={linearTiming({ durationInFrames: 12 })}
        />
        
        {/* Scene 7: Without leaving browser */}
        <TransitionSeries.Sequence durationInFrames={60}>
          <WithoutLeavingScene />
        </TransitionSeries.Sequence>
        
        <TransitionSeries.Transition
          presentation={getPresentation("blurDissolve")}
          timing={linearTiming({ durationInFrames: 12 })}
        />
        
        {/* Scene 8: Everything in one place */}
        <TransitionSeries.Sequence durationInFrames={75}>
          <OnePlaceScene />
        </TransitionSeries.Sequence>
        
        <TransitionSeries.Transition
          presentation={getPresentation("blurDissolve")}
          timing={linearTiming({ durationInFrames: 10 })}
        />
        
        {/* Scene 9: Benefits montage */}
        <TransitionSeries.Sequence durationInFrames={80}>
          <BenefitsMontageScene />
        </TransitionSeries.Sequence>
        
        <TransitionSeries.Transition
          presentation={getPresentation("blurDissolve")}
          timing={linearTiming({ durationInFrames: 12 })}
        />
        
        {/* Scene 10: Privacy */}
        <TransitionSeries.Sequence durationInFrames={60}>
          <PrivacyScene />
        </TransitionSeries.Sequence>
        
        <TransitionSeries.Transition
          presentation={getPresentation("blurDissolve")}
          timing={linearTiming({ durationInFrames: 12 })}
        />
        
        {/* Scene 11: CTA */}
        <TransitionSeries.Sequence durationInFrames={90}>
          <CTAScene />
        </TransitionSeries.Sequence>
        
        <TransitionSeries.Transition
          presentation={getPresentation("blurDissolve")}
          timing={linearTiming({ durationInFrames: 15 })}
        />
        
        {/* Scene 12: Final Logo */}
        <TransitionSeries.Sequence durationInFrames={60}>
          <FinalLogoScene />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </>
  );
};
