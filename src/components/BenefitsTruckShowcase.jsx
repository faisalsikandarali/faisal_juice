import React, { useState, useEffect, useRef } from "react";
import { BsTruck, BsShieldCheck, BsLightningCharge, BsArrowRepeat } from "react-icons/bs";
import can from "../assets/can.png";
import labels from "../assets/labels.png";

const CANS_DATA = [
  { id: 1, name: "Wild Pear", bgPosition: "0% center", tag: "🍐 Pear Sparkle" },
  { id: 2, name: "Crisp Apple", bgPosition: "50% center", tag: "🍎 Apple Burst" },
  { id: 3, name: "Passion Fruit", bgPosition: "100% center", tag: "🥭 Tropical Splash" },
];

export default function BenefitsTruckShowcase({ isVisible = true }) {
  // Stages: "cans" -> "sealing" -> "stamp" -> "truck-arrive" -> "box-loading" -> "truck-exit" -> "complete"
  const [stage, setStage] = useState("cans");
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const timerRef = useRef(null);

  const startAnimationLoop = () => {
    if (timerRef.current) clearTimeout(timerRef.current);

    setStage("cans");

    timerRef.current = setTimeout(() => {
      setStage("sealing");
      timerRef.current = setTimeout(() => {
        setStage("stamp");
        timerRef.current = setTimeout(() => {
          setStage("truck-arrive");
          timerRef.current = setTimeout(() => {
            setStage("box-loading");
            timerRef.current = setTimeout(() => {
              setStage("truck-exit");
              timerRef.current = setTimeout(() => {
                setStage("complete");
                timerRef.current = setTimeout(() => {
                  startAnimationLoop();
                }, 3200);
              }, 2200);
            }, 1800);
          }, 1600);
        }, 1300);
      }, 1500);
    }, 2400);
  };

  useEffect(() => {
    if (isVisible && isAutoPlaying) {
      startAnimationLoop();
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isVisible, isAutoPlaying]);

  const handleStepJump = (newStage) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsAutoPlaying(false);
    setStage(newStage);
  };

  const handleReplay = () => {
    setIsAutoPlaying(true);
    startAnimationLoop();
  };

  return (
    <div className="w-full select-none">
      {/* ═══ CLEAN WEBSITE BACKGROUND ARENA (NO DARK BOX BACKGROUND!) ═══ */}
      <div className="relative w-full overflow-hidden pt-2 pb-4 sm:pb-6 bg-transparent">
        
        {/* Clean Light-Themed Status Header & Controls */}
        <div className="relative z-30 flex flex-wrap items-center justify-between gap-3 pb-3 sm:pb-4 border-b border-neutral-200/80 mb-4 sm:mb-6">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
            </span>
            <span className="text-[11px] sm:text-xs font-bold text-neutral-800 uppercase tracking-wider">
              Cold-Chain Express Delivery • -4°C
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] sm:text-xs font-bold px-2.5 sm:px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-sm">
              {stage === "cans" && "Step 1/5: Packing Faisal Cans 🥫"}
              {stage === "sealing" && "Step 2/5: Sealing Box Flaps 🔒"}
              {stage === "stamp" && "Step 3/5: Shipping Label Slam 🏷️"}
              {stage === "truck-arrive" && "Step 4/5: Truck Arriving From Left 🚚"}
              {stage === "box-loading" && "Step 4/5: Box Loading Into Cargo Bay 📦"}
              {stage === "truck-exit" && "Step 5/5: Speeding Away To Right 💨"}
              {stage === "complete" && "✓ Out for Chilled Delivery 🚀"}
            </span>

            <button
              onClick={handleReplay}
              className="flex items-center gap-1 text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full bg-neutral-900 hover:bg-emerald-600 text-white transition-all cursor-pointer shadow-md active:scale-95"
              title="Restart 3D Truck Simulation"
            >
              <BsArrowRepeat className="text-xs sm:text-sm animate-spin-very-slow" />
              <span>Replay</span>
            </button>
          </div>
        </div>

        {/* Clean Step Pills */}
        <div className="relative z-30 flex items-center justify-center gap-1.5 sm:gap-2 mb-6 overflow-x-auto py-1 no-scrollbar">
          {[
            { key: "cans", label: "1. Pack Cans", icon: "🥫" },
            { key: "sealing", label: "2. Seal Box", icon: "📦" },
            { key: "truck-arrive", label: "3. Truck Arrive", icon: "🚚" },
            { key: "box-loading", label: "4. Load Bay", icon: "📥" },
            { key: "truck-exit", label: "5. Dispatch", icon: "🚀" },
          ].map((s) => {
            const isActive = stage === s.key;
            return (
              <button
                key={s.key}
                onClick={() => handleStepJump(s.key)}
                className={`flex items-center gap-1 text-[10px] sm:text-xs px-2.5 sm:px-3.5 py-1 rounded-full transition-all cursor-pointer whitespace-nowrap font-bold border ${
                  isActive
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/30 scale-105"
                    : "bg-white text-neutral-600 border-neutral-200 hover:border-emerald-300 hover:text-emerald-700 shadow-sm"
                }`}
              >
                <span>{s.icon}</span>
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>

        {/* ═══ THE LIVE SCENE (Website Background, Road at Bottom, Truck Left to Right) ═══ */}
        <div className="relative w-full h-[290px] xs:h-[330px] sm:h-[390px] md:h-[420px] flex items-center justify-center overflow-hidden bg-transparent">
          
          {/* Asphalt Road across the entire website width (Left to Right) */}
          <div className="absolute bottom-2 sm:bottom-5 inset-x-0 h-10 sm:h-12 bg-neutral-900 border-y-2 border-neutral-700/80 flex items-center px-4 shadow-xl rounded-xl sm:rounded-2xl">
            {/* Speed Road Lines */}
            <div className="w-full h-1 sm:h-1.5 animate-road-line opacity-90" />
            <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />
          </div>

          {/* ─── SCENARIO 1: 3D KRAFT BOX WITH CANS (Stages: cans, sealing, stamp) ─── */}
          {(stage === "cans" || stage === "sealing" || stage === "stamp") && (
            <div className="relative z-20 scale-[0.68] min-[360px]:scale-[0.78] xs:scale-[0.88] sm:scale-100 transition-transform duration-300">
              <div className="relative w-[340px] xs:w-[380px] sm:w-[460px] h-56 xs:h-60 sm:h-68 bg-[#c89666] border-2 border-[#96673b] rounded-2xl sm:rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.25)] flex flex-col justify-between overflow-hidden">
                {/* Rich Kraft Cardboard Texture */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#e2ab7a] via-[#c89666] to-[#a06f41] opacity-95" />

                {/* Box Brand Header */}
                <div className="absolute top-3 left-4 sm:left-5 z-10 flex items-center gap-2 opacity-95">
                  <span className="font-black tracking-tight text-base sm:text-lg text-[#4a2e18] drop-shadow-sm">
                    FAISAL JUICE
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4a2e18]"></span>
                  <span className="text-[9px] sm:text-[10px] font-mono font-bold tracking-wider text-[#4a2e18] border border-[#4a2e18] px-1.5 py-0.5 rounded-md">
                    -4°C CHILLED
                  </span>
                </div>

                {/* 3D Cans Dropping into Box Side-by-Side */}
                <div className="absolute inset-x-0 bottom-4 top-12 z-20 flex items-end justify-center gap-3 sm:gap-6 px-3 pb-2">
                  {CANS_DATA.map((item, idx) => (
                    <div
                      key={item.id}
                      className={`flex flex-col items-center transition-all duration-500 ${
                        stage === "cans" ? "animate-can-box-drop" : "scale-100 opacity-95"
                      }`}
                      style={{ animationDelay: `${idx * 220}ms` }}
                    >
                      {/* Real 3D Can Mockup */}
                      <div
                        className="w-12 xs:w-14 sm:w-16 aspect-[45/83] drop-shadow-2xl"
                        style={{
                          backgroundImage: `url(${labels}), url(${can})`,
                          maskImage: `url(${can})`,
                          WebkitMaskImage: `url(${can})`,
                          backgroundPosition: `${item.bgPosition}, center`,
                          backgroundSize: "300% 100%, 100% 100%",
                          backgroundRepeat: "no-repeat, no-repeat",
                          backgroundBlendMode: "multiply",
                          maskSize: "100% 100%",
                          WebkitMaskSize: "100% 100%",
                          filter: "drop-shadow(0 10px 18px rgba(0,0,0,0.45))",
                        }}
                      />
                      <span className="text-[8px] sm:text-[9px] font-bold text-neutral-900 mt-1 bg-white/95 backdrop-blur-sm px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap">
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Left Flap Folding In */}
                <div
                  className={`absolute top-0 left-0 w-1/2 h-full bg-[#ba8858] border-r border-[#96673b] origin-top z-30 transition-all duration-700 shadow-xl ${
                    stage !== "cans"
                      ? "translate-y-0 opacity-100"
                      : "-translate-y-full opacity-0 pointer-events-none"
                  }`}
                />

                {/* Right Flap Folding In */}
                <div
                  className={`absolute top-0 right-0 w-1/2 h-full bg-[#b07e4f] border-l border-[#96673b] origin-top z-30 transition-all duration-700 shadow-xl ${
                    stage !== "cans"
                      ? "translate-y-0 opacity-100"
                      : "-translate-y-full opacity-0 pointer-events-none"
                  }`}
                />

                {/* Packaging Security Tape */}
                {(stage === "sealing" || stage === "stamp") && (
                  <div className="absolute top-1/2 -translate-y-1/2 left-0 z-40 w-full overflow-hidden flex items-center">
                    <div className="h-8 sm:h-9 bg-[#855a32] border-y-2 border-[#5c3c1e] text-amber-200 text-[9px] sm:text-[10px] font-mono font-bold tracking-widest flex items-center justify-around shadow-xl animate-tape-roll select-none px-2">
                      <span>🔒 FAISAL JUICE SEALED</span>
                      <span className="hidden xs:inline">★ 100% RAW</span>
                      <span>🔒 PRIORITY CHILLED</span>
                    </div>
                  </div>
                )}

                {/* Shipping Label Stamp */}
                {stage === "stamp" && (
                  <div className="absolute bottom-3 right-3 sm:right-4 z-40 bg-white text-neutral-900 p-2.5 sm:p-3 rounded-xl shadow-2xl border border-neutral-300 w-44 sm:w-52 animate-stamp-slam select-none">
                    <div className="flex justify-between items-center border-b border-neutral-200 pb-1 mb-1">
                      <span className="text-[9px] font-black tracking-widest text-emerald-600 uppercase">
                        EXPRESS CHILLED
                      </span>
                      <span className="text-[8px] font-mono text-neutral-500 font-bold">#FJ-8891</span>
                    </div>
                    <p className="text-[8px] sm:text-[9px] font-extrabold text-neutral-700">DELIVER TO:</p>
                    <p className="text-xs sm:text-sm font-black text-neutral-900 tracking-tight">Faisal Sikandar</p>
                    <p className="text-[8px] text-neutral-600 leading-tight">Ali Bootcamp • Priority Route</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ─── SCENARIO 2: TRUCK ENTERS FROM LEFT (START) AND DRIVES TO RIGHT (END) ─── */}
          {(stage === "truck-arrive" || stage === "box-loading" || stage === "truck-exit") && (
            <div className="relative z-20 w-full h-full flex flex-col justify-end items-center pb-2 sm:pb-4 overflow-hidden">
              
              {/* Responsive Scaling Wrapper */}
              <div className="scale-[0.52] min-[360px]:scale-[0.62] xs:scale-[0.74] sm:scale-[0.88] md:scale-100 origin-bottom transition-transform duration-300">
                <div
                  className={`relative z-20 flex items-end mb-4 transition-all duration-700 ${
                    stage === "truck-arrive"
                      ? "animate-truck-arrive"
                      : stage === "truck-exit"
                      ? "animate-truck-speed-away"
                      : ""
                  }`}
                >
                  {/* Glowing Headlight Beam shooting forward */}
                  <div className="absolute -right-36 bottom-6 w-44 h-28 headlight-beam pointer-events-none z-30" />

                  {/* Silencer Exhaust Pipe with Real Puffed Smoke */}
                  <div className="absolute -left-6 bottom-8 z-10 pointer-events-none">
                    <div className="w-4 h-10 bg-neutral-400 border border-neutral-200 rounded-t-sm -rotate-12 transform origin-bottom shadow-md" />
                    <div className="absolute -top-3 -left-3 w-7 h-7 rounded-full bg-neutral-400/85 blur-[2px] animate-smoke-puff-1" />
                    <div className="absolute -top-6 -left-7 w-9 h-9 rounded-full bg-neutral-400/75 blur-[3px] animate-smoke-puff-2" />
                    <div className="absolute -top-8 -left-10 w-12 h-12 rounded-full bg-neutral-500/65 blur-[4px] animate-smoke-puff-3" />
                  </div>

                  {/* Truck Body */}
                  <div className="flex items-end">
                    {/* Rear Refrigerated Cargo Container */}
                    <div className="relative w-64 sm:w-80 h-44 bg-gradient-to-b from-neutral-50 to-neutral-200 border-2 border-neutral-300 rounded-l-2xl shadow-2xl flex flex-col justify-between p-4 overflow-hidden">
                      <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_18px,rgba(0,0,0,0.04)_18px,rgba(0,0,0,0.04)_22px)] opacity-70" />

                      <div className="relative z-10 flex justify-between items-center">
                        <span className="font-black text-sm sm:text-base tracking-tighter text-neutral-900">
                          FAISAL JUICE<span className="text-emerald-500">.</span>EXPRESS
                        </span>
                        <span className="text-[10px] font-mono font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200 flex items-center gap-1">
                          <span>❄️</span> -4°C CHILLED
                        </span>
                      </div>

                      <div className="relative z-10 flex items-center justify-between mt-auto">
                        <span className="text-[10px] text-neutral-700 font-mono font-bold">
                          TO: FAISAL SIKANDAR
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                            stage === "box-loading"
                              ? "bg-amber-100 text-amber-800 animate-pulse border border-amber-300"
                              : "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          }`}
                        >
                          {stage === "truck-arrive" && "BAY DOORS OPEN 🔓"}
                          {stage === "box-loading" && "LOADING SEALED BOX 📦"}
                          {stage === "truck-exit" && "LOCKED & DISPATCHED 🔒"}
                        </span>
                      </div>

                      {/* Box Sliding into the Cargo Bay */}
                      {stage === "box-loading" && (
                        <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
                          <div className="w-28 h-18 bg-[#c89666] border-2 border-[#7f5539] rounded-xl shadow-2xl flex flex-col items-center justify-center text-[10px] font-bold text-white animate-box-into-truck">
                            <span>📦 3 CANS PACKED</span>
                            <span className="text-[8px] text-amber-200 font-mono">FAISAL SIKANDAR</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Front Cab */}
                    <div className="relative w-32 sm:w-40 h-36 bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 border-2 border-emerald-400 rounded-r-2xl shadow-2xl flex flex-col justify-between p-3.5 overflow-hidden">
                      <div className="w-18 h-16 bg-sky-200/50 border border-white/60 rounded-tr-xl self-end flex items-center justify-center shadow-inner">
                        <span className="text-base opacity-90 select-none">👨‍✈️</span>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <div className="h-4 w-14 bg-neutral-900 rounded flex items-center justify-around px-1">
                          <span className="w-1.5 h-2.5 bg-neutral-500 rounded-full" />
                          <span className="w-1.5 h-2.5 bg-neutral-500 rounded-full" />
                          <span className="w-1.5 h-2.5 bg-neutral-500 rounded-full" />
                        </div>
                        <div className="w-5 h-5 rounded-full bg-yellow-300 border-2 border-yellow-100 shadow-[0_0_20px_#fde047]" />
                      </div>
                    </div>
                  </div>

                  {/* Spinning Alloy Wheels */}
                  <div className="absolute -bottom-4 inset-x-8 flex justify-between px-2 z-30">
                    <div className="w-11 h-11 rounded-full bg-neutral-900 border-2 border-neutral-700 flex items-center justify-center shadow-2xl animate-recycle-spin">
                      <div className="w-4 h-4 rounded-full bg-neutral-400 border border-neutral-200" />
                    </div>
                    <div className="w-11 h-11 rounded-full bg-neutral-900 border-2 border-neutral-700 flex items-center justify-center shadow-2xl animate-recycle-spin">
                      <div className="w-4 h-4 rounded-full bg-neutral-400 border border-neutral-200" />
                    </div>
                    <div className="w-11 h-11 rounded-full bg-neutral-900 border-2 border-neutral-700 flex items-center justify-center shadow-2xl animate-recycle-spin">
                      <div className="w-4 h-4 rounded-full bg-neutral-400 border border-neutral-200" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── SCENARIO 3: ORDER CELEBRATION (Stage: complete) ─── */}
          {stage === "complete" && (
            <div className="relative z-30 flex flex-col items-center text-center p-4 max-w-md animate-in zoom-in-95 duration-500 bg-white/90 backdrop-blur-md rounded-2xl border border-emerald-200 shadow-xl">
              <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center text-2xl font-black shadow-lg mb-2.5 animate-bounce">
                ✓
              </div>
              <h4 className="text-lg sm:text-xl font-black text-neutral-900 mb-1">
                Truck Dispatched Successfully! 🚚💨
              </h4>
              <p className="text-xs sm:text-sm text-neutral-600 mb-3 leading-relaxed">
                Refrigerated express truck is en route at crisp{" "}
                <strong className="text-emerald-600">-4°C</strong> delivering fresh cans to{" "}
                <strong className="text-neutral-900">Faisal Sikandar</strong> (Ali Bootcamp).
              </p>
              <button
                onClick={handleReplay}
                className="px-4 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                Watch Replay 🔄
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ═══ 4 CORE VALUE PROMISES (Clean Grid below the Truck) ═══ */}
      <div className="mt-6 sm:mt-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {/* Card 1: 100% Organic Juice */}
          <div className="group relative p-3.5 sm:p-6 rounded-2xl bg-neutral-50 hover:bg-emerald-50/50 transition-all duration-500 border border-neutral-100 hover:border-emerald-200 hover:shadow-lg flex flex-col justify-between">
            <span className="absolute top-2.5 right-3 text-lg sm:text-xl opacity-30 group-hover:opacity-80 transition-opacity">
              🍃🍏
            </span>
            <div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3 sm:mb-4 shadow-sm group-hover:scale-110 transition-transform">
                <BsShieldCheck className="text-xl sm:text-2xl" />
              </div>
              <span className="text-[9px] sm:text-[10px] font-bold tracking-wider uppercase text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full inline-block mb-1.5">
                Orchard Fresh
              </span>
              <h4 className="font-bold text-sm sm:text-base text-neutral-900 mb-1 leading-snug">
                100% Organic Juice
              </h4>
              <p className="text-[11px] sm:text-xs text-neutral-500 leading-relaxed line-clamp-2 sm:line-clamp-none">
                Zero artificial concentrates, zero fake flavours. Just orchard-fresh cold fruits.
              </p>
            </div>
            <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-neutral-200/60 flex items-center justify-between text-[10px] sm:text-xs text-emerald-700 font-semibold">
              <span>Pure Extraction</span>
              <span>100% Raw</span>
            </div>
          </div>

          {/* Card 2: Natural Energy Boost */}
          <div className="group relative p-3.5 sm:p-6 rounded-2xl bg-neutral-50 hover:bg-amber-50/50 transition-all duration-500 border border-neutral-100 hover:border-amber-200 hover:shadow-lg flex flex-col justify-between">
            <span className="absolute top-2.5 right-3 text-lg sm:text-xl opacity-30 group-hover:opacity-80 transition-opacity">
              ⚡
            </span>
            <div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-100 text-amber-500 flex items-center justify-center mb-3 sm:mb-4 shadow-sm group-hover:scale-110 transition-transform">
                <BsLightningCharge className="text-xl sm:text-2xl animate-spark-jolt" />
              </div>
              <span className="text-[9px] sm:text-[10px] font-bold tracking-wider uppercase text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-full inline-block mb-1.5">
                Clean Energy
              </span>
              <h4 className="font-bold text-sm sm:text-base text-neutral-900 mb-1 leading-snug">
                Natural Energy Boost
              </h4>
              <p className="text-[11px] sm:text-xs text-neutral-500 leading-relaxed line-clamp-2 sm:line-clamp-none">
                Packed with clean Vitamin C, electrolytes, and antioxidants for your daily vibe.
              </p>
            </div>
            <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-neutral-200/60 flex items-center justify-between text-[10px] sm:text-xs text-amber-700 font-semibold">
              <span>Natural Electrolytes</span>
              <span>No Crash</span>
            </div>
          </div>

          {/* Card 3: Chilled Fast Delivery */}
          <div
            onClick={() => handleStepJump("truck-exit")}
            className="group relative p-3.5 sm:p-6 rounded-2xl bg-neutral-50 hover:bg-blue-50/50 transition-all duration-500 border border-neutral-100 hover:border-blue-200 hover:shadow-lg flex flex-col justify-between cursor-pointer"
            title="Click to dispatch truck!"
          >
            <span className="absolute top-2.5 right-3 text-lg sm:text-xl opacity-30 group-hover:opacity-80 transition-opacity">
              ❄️❄️
            </span>
            <div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-3 sm:mb-4 shadow-sm group-hover:scale-110 transition-transform">
                <BsTruck className="text-xl sm:text-2xl" />
              </div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[9px] sm:text-[10px] font-bold tracking-wider uppercase text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-full inline-block">
                  Chilled Express
                </span>
                <span className="text-[9px] sm:text-[10px] font-bold text-blue-500 group-hover:underline">
                  Tap to Drive 🚀
                </span>
              </div>
              <h4 className="font-bold text-sm sm:text-base text-neutral-900 mb-1 leading-snug">
                Chilled Fast Delivery
              </h4>
              <p className="text-[11px] sm:text-xs text-neutral-500 leading-relaxed line-clamp-2 sm:line-clamp-none">
                Delivered chilled straight to your door in eco-safe insulated packaging.
              </p>
            </div>
            <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-neutral-200/60 flex items-center justify-between text-[10px] sm:text-xs text-blue-700 font-semibold">
              <span>Temperature Safe</span>
              <span>Free &gt;$25</span>
            </div>
          </div>

          {/* Card 4: 100% Recyclable Cans */}
          <div className="group relative p-3.5 sm:p-6 rounded-2xl bg-neutral-50 hover:bg-emerald-50/50 transition-all duration-500 border border-neutral-100 hover:border-emerald-200 hover:shadow-lg flex flex-col justify-between">
            <span className="absolute top-2.5 right-3 text-lg sm:text-xl opacity-30 group-hover:opacity-80 transition-opacity">
              🌱
            </span>
            <div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3 sm:mb-4 shadow-sm group-hover:scale-110 transition-transform">
                <span className="text-xl sm:text-2xl select-none animate-recycle-spin inline-block">
                  ♻️
                </span>
              </div>
              <span className="text-[9px] sm:text-[10px] font-bold tracking-wider uppercase text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full inline-block mb-1.5">
                Zero Waste
              </span>
              <h4 className="font-bold text-sm sm:text-base text-neutral-900 mb-1 leading-snug">
                100% Recyclable Cans
              </h4>
              <p className="text-[11px] sm:text-xs text-neutral-500 leading-relaxed line-clamp-2 sm:line-clamp-none">
                Sleek aluminum cans that keep carbon emissions low and drinks cooler longer.
              </p>
            </div>
            <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-neutral-200/60 flex items-center justify-between text-[10px] sm:text-xs text-emerald-700 font-semibold">
              <span>Infinite Cycle</span>
              <span>Eco Aluminum</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
