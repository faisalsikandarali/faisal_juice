import { useState } from "react";
import { BsShieldCheck, BsLightningCharge, BsSnow, BsRecycle, BsCheck2Circle } from "react-icons/bs";
import pears from "../assets/pears.png";
import apples from "../assets/apples.png";
import passion from "../assets/passion.png";

const FLAVORS = [
  {
    id: 1,
    name: "Wild Pear Sparkle",
    tagline: "Crisp & Cold Pressed Fizz",
    bgPosition: "0% center",
    fruitImg: pears,
    themeColor: "#8fcb39",
    accentBg: "from-lime-500/20 via-emerald-500/10 to-transparent",
    badge: "Most Refreshing",
    nutrients: { vitC: "95%", enzymes: "98%", sugar: "0g Added", cals: "85 kcal" },
    desc: "100% natural orchard pear extract cold-pressed below 4°C with light natural sparkling bubbles.",
  },
  {
    id: 2,
    name: "Crisp Orchard Apple",
    tagline: "Sweet & Tart Purity",
    bgPosition: "50% center",
    fruitImg: apples,
    themeColor: "#ff4d4d",
    accentBg: "from-rose-500/20 via-red-500/10 to-transparent",
    badge: "Fan Favorite ★ 5.0",
    nutrients: { vitC: "120%", enzymes: "99%", sugar: "0g Added", cals: "92 kcal" },
    desc: "Fresh-cut red and green orchard apples balanced to crisp perfection. Zero pasteurization, zero boiling.",
  },
  {
    id: 3,
    name: "Exotic Passion Splash",
    tagline: "Tropical Vitamin Blast",
    bgPosition: "100% center",
    fruitImg: passion,
    themeColor: "#8e44ad",
    accentBg: "from-purple-500/20 via-fuchsia-500/10 to-transparent",
    badge: "Immunity Booster",
    nutrients: { vitC: "140%", enzymes: "97%", sugar: "0g Added", cals: "88 kcal" },
    desc: "Sun-drenched passion fruit crush loaded with bioactive antioxidants, clean potassium and tropical aroma.",
  },
];

export default function CraftPurityShowcase({
  isVisible = true,
  activeIdx = 1,
  onFlavorChange,
  chamberCanDockRef,
}) {
  const [sipped, setSipped] = useState(false);

  const flavor = FLAVORS[activeIdx] || FLAVORS[1];

  const handleSip = () => {
    setSipped(true);
    setTimeout(() => setSipped(false), 2400);
  };

  return (
    <div
      className={`w-full transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      {/* ═══ 1. INTERACTIVE 3D FLAVOR EXTRACTION ARENA ═══ */}
      <div className="relative w-full rounded-3xl bg-gradient-to-b from-neutral-50 via-white to-neutral-50/80 border border-neutral-200/80 shadow-[0_20px_50px_rgba(0,0,0,0.06)] overflow-hidden p-4 sm:p-8 md:p-10 mb-8 sm:mb-12">
        {/* Soft Radial Ambient Color Glow */}
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-[500px] h-[350px] rounded-full blur-3xl pointer-events-none transition-all duration-700 opacity-60"
          style={{ backgroundColor: `${flavor.themeColor}35` }}
        />

        {/* Top Header Pill with Switcher */}
        <div className="relative z-20 flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-neutral-200/60 mb-6 sm:mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full animate-ping" style={{ backgroundColor: flavor.themeColor }} />
              <span className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-neutral-500">
                Cold Extraction Chamber • Active Flavour
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
              {flavor.name} <span className="text-sm font-bold text-neutral-400">({flavor.tagline})</span>
            </h3>
          </div>

          {/* 3 Flavor Selector Pills */}
          <div className="flex items-center gap-1.5 p-1.5 bg-neutral-100 rounded-2xl border border-neutral-200/70 shadow-inner">
            {FLAVORS.map((f, i) => {
              const isSelected = i === activeIdx;
              return (
                <button
                  key={f.id}
                  onClick={() => onFlavorChange && onFlavorChange(i)}
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? "bg-white text-neutral-950 shadow-md scale-105"
                      : "text-neutral-500 hover:text-neutral-900 hover:bg-white/50"
                  }`}
                  style={isSelected ? { color: f.themeColor } : {}}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: f.themeColor }} />
                  <span>{f.name.split(" ")[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Center Arena: 3D Metallic Can + Floating Fruit + Nutritional Live Metrics */}
        <div className="relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Flavor Story & Live Metrics */}
          <div className="lg:col-span-4 order-2 lg:order-1 flex flex-col justify-center space-y-4">
            <span
              className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider w-max border shadow-sm"
              style={{
                backgroundColor: `${flavor.themeColor}18`,
                color: flavor.themeColor,
                borderColor: `${flavor.themeColor}40`,
              }}
            >
              {flavor.badge}
            </span>

            <p className="text-sm text-neutral-600 leading-relaxed">
              {flavor.desc}
            </p>

            {/* 4 Live Bio-Nutrient Metrics */}
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <div className="p-3 rounded-2xl bg-white border border-neutral-200/80 shadow-sm flex flex-col justify-between">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Live Enzymes</span>
                <span className="text-lg font-black text-emerald-600">{flavor.nutrients.enzymes}</span>
                <div className="w-full h-1 bg-neutral-100 rounded-full mt-1.5 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full transition-all duration-700" style={{ width: flavor.nutrients.enzymes }} />
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white border border-neutral-200/80 shadow-sm flex flex-col justify-between">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Vitamin C</span>
                <span className="text-lg font-black text-amber-500">{flavor.nutrients.vitC}</span>
                <div className="w-full h-1 bg-neutral-100 rounded-full mt-1.5 overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full transition-all duration-700" style={{ width: "95%" }} />
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-white border border-neutral-200/80 shadow-sm flex flex-col justify-between">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Added Sugar</span>
                <span className="text-lg font-black text-neutral-800">{flavor.nutrients.sugar}</span>
                <span className="text-[9px] text-emerald-600 font-bold">100% Guilt Free</span>
              </div>

              <div className="p-3 rounded-2xl bg-white border border-neutral-200/80 shadow-sm flex flex-col justify-between">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Calories</span>
                <span className="text-lg font-black text-neutral-800">{flavor.nutrients.cals}</span>
                <span className="text-[9px] text-neutral-400 font-medium">Per 330ml Can</span>
              </div>
            </div>

            {/* Interactive Taste Virtual Sip Button */}
            <div className="pt-2">
              <button
                onClick={handleSip}
                className="w-full py-3 px-5 rounded-2xl font-bold text-xs uppercase tracking-wider text-white transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                style={{
                  background: `linear-gradient(135deg, ${flavor.themeColor}, #10b981)`,
                  boxShadow: `0 8px 24px ${flavor.themeColor}40`,
                }}
              >
                {sipped ? (
                  <>
                    <BsCheck2Circle className="text-lg animate-bounce" />
                    <span>Crisp & Refreshing Taste! 😋</span>
                  </>
                ) : (
                  <>
                    <span>🧃 Taste Virtual Sip</span>
                    <span className="opacity-80 text-[10px]">• 4°C Fresh</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Center Column: 3D Cylinder Can Showcase with Orbiting Fruit */}
          <div className="lg:col-span-5 order-1 lg:order-2 flex items-center justify-center relative py-6 lg:py-0">
            {/* Spinning Orbit Rings */}
            <div
              className="absolute w-64 h-64 sm:w-80 sm:h-80 rounded-full border border-dashed transition-colors duration-700 animate-spin-very-slow pointer-events-none opacity-60"
              style={{ borderColor: flavor.themeColor }}
            />
            <div
              className="absolute w-48 h-48 sm:w-60 sm:h-60 rounded-full border border-dotted transition-colors duration-700 pointer-events-none opacity-30 animate-pulse"
              style={{ borderColor: flavor.themeColor }}
            />

            {/* Orbiting Real Cut Fruit Slice */}
            <div className="absolute top-2 -right-2 sm:-right-4 w-28 sm:w-36 pointer-events-none animate-float-slow z-20 drop-shadow-2xl">
              <img
                src={flavor.fruitImg}
                alt="Fruit"
                className="w-full h-auto object-contain transition-all duration-700 hover:rotate-12"
              />
            </div>

            {/* The Chamber Dock Anchor for 3D Traveling Can */}
            <div
              ref={chamberCanDockRef}
              className="relative w-32 xs:w-36 sm:w-44 aspect-[45/83] flex items-center justify-center pointer-events-none"
            >
              {/* Can Bottom Reflection Shadow */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-28 sm:w-36 h-4 bg-neutral-900/15 rounded-full blur-md" />
            </div>
          </div>

          {/* Right Column: Purity Process Step Badges */}
          <div className="lg:col-span-3 order-3 flex flex-col justify-center space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400 mb-1">
              3-Stage Cold Purity
            </h4>

            {/* Step 1 */}
            <div className="p-3 rounded-2xl bg-white border border-neutral-200/70 shadow-sm hover:border-emerald-300 transition-colors">
              <div className="flex items-center gap-2.5 mb-1">
                <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-black">
                  1
                </span>
                <span className="text-xs font-bold text-neutral-800">Orchard Harvest</span>
              </div>
              <p className="text-[11px] text-neutral-500 leading-snug pl-8">
                Tree-ripened fruit picked at peak aroma and cold-washed in 4°C water.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-3 rounded-2xl bg-white border border-neutral-200/70 shadow-sm hover:border-emerald-300 transition-colors">
              <div className="flex items-center gap-2.5 mb-1">
                <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-black">
                  2
                </span>
                <span className="text-xs font-bold text-neutral-800">Hydraulic Pressing</span>
              </div>
              <p className="text-[11px] text-neutral-500 leading-snug pl-8">
                Crushed gently under 14,000 lbs slow hydraulic pressure without heat.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-3 rounded-2xl bg-white border border-neutral-200/70 shadow-sm hover:border-emerald-300 transition-colors">
              <div className="flex items-center gap-2.5 mb-1">
                <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-black">
                  3
                </span>
                <span className="text-xs font-bold text-neutral-800">Sub-Zero Sealing</span>
              </div>
              <p className="text-[11px] text-neutral-500 leading-snug pl-8">
                Canned fresh into infinitely recyclable aluminum at -4°C chilled.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ 2. FOUR CORE HEALTH PROMISES (Responsive Modern Grid) ═══ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {/* Card 1 */}
        <div className="group relative p-4 sm:p-6 rounded-2xl bg-neutral-50 hover:bg-emerald-50/60 transition-all duration-500 border border-neutral-200/70 hover:border-emerald-300 hover:shadow-lg flex flex-col justify-between">
          <span className="absolute top-3 right-3 text-xl opacity-20 group-hover:opacity-80 transition-opacity">
            🍃🍏
          </span>
          <div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3 sm:mb-4 shadow-sm group-hover:scale-110 transition-transform">
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

        {/* Card 2 */}
        <div className="group relative p-4 sm:p-6 rounded-2xl bg-neutral-50 hover:bg-amber-50/60 transition-all duration-500 border border-neutral-200/70 hover:border-amber-300 hover:shadow-lg flex flex-col justify-between">
          <span className="absolute top-3 right-3 text-xl opacity-20 group-hover:opacity-80 transition-opacity">
            ⚡
          </span>
          <div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mb-3 sm:mb-4 shadow-sm group-hover:scale-110 transition-transform">
              <BsLightningCharge className="text-xl sm:text-2xl" />
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

        {/* Card 3 */}
        <div className="group relative p-4 sm:p-6 rounded-2xl bg-neutral-50 hover:bg-sky-50/60 transition-all duration-500 border border-neutral-200/70 hover:border-sky-300 hover:shadow-lg flex flex-col justify-between">
          <span className="absolute top-3 right-3 text-xl opacity-20 group-hover:opacity-80 transition-opacity">
            ❄️
          </span>
          <div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center mb-3 sm:mb-4 shadow-sm group-hover:scale-110 transition-transform">
              <BsSnow className="text-xl sm:text-2xl animate-spin-very-slow" />
            </div>
            <span className="text-[9px] sm:text-[10px] font-bold tracking-wider uppercase text-sky-700 bg-sky-100/70 px-2 py-0.5 rounded-full inline-block mb-1.5">
              Cold-Chain Sealed
            </span>
            <h4 className="font-bold text-sm sm:text-base text-neutral-900 mb-1 leading-snug">
              Maintained at -4°C
            </h4>
            <p className="text-[11px] sm:text-xs text-neutral-500 leading-relaxed line-clamp-2 sm:line-clamp-none">
              Sub-zero thermal packaging guarantees chilled freshness from tree harvest to your doorstep.
            </p>
          </div>
          <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-neutral-200/60 flex items-center justify-between text-[10px] sm:text-xs text-sky-700 font-semibold">
            <span>Thermal Integrity</span>
            <span>Express Chilled</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="group relative p-4 sm:p-6 rounded-2xl bg-neutral-50 hover:bg-emerald-50/60 transition-all duration-500 border border-neutral-200/70 hover:border-emerald-300 hover:shadow-lg flex flex-col justify-between">
          <span className="absolute top-3 right-3 text-xl opacity-20 group-hover:opacity-80 transition-opacity">
            ♻️
          </span>
          <div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3 sm:mb-4 shadow-sm group-hover:scale-110 transition-transform">
              <BsRecycle className="text-xl sm:text-2xl animate-recycle-spin" />
            </div>
            <span className="text-[9px] sm:text-[10px] font-bold tracking-wider uppercase text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full inline-block mb-1.5">
              Zero Waste
            </span>
            <h4 className="font-bold text-sm sm:text-base text-neutral-900 mb-1 leading-snug">
              100% Recyclable Cans
            </h4>
            <p className="text-[11px] sm:text-xs text-neutral-500 leading-relaxed line-clamp-2 sm:line-clamp-none">
              Sleek aluminum cans that keep drinks cooler longer and reduce carbon footprints to near zero.
            </p>
          </div>
          <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-neutral-200/60 flex items-center justify-between text-[10px] sm:text-xs text-emerald-700 font-semibold">
            <span>Infinite Cycle</span>
            <span>Eco Aluminum</span>
          </div>
        </div>
      </div>
    </div>
  );
}
