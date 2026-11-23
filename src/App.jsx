import { useState, useRef, useEffect } from "react";
import { BiMenu } from "react-icons/bi";
import {
  BsCart,
  BsStarFill,
  BsHeart,
  BsHeartFill,
  BsShieldCheck,
  BsTrash,
  BsPlus,
  BsDash,
  BsBagCheck,
  BsArrowRight,
  BsGithub,
} from "react-icons/bs";
import { CgCloseR } from "react-icons/cg";
import { FiSend } from "react-icons/fi";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay, Controller } from "swiper/modules";
import pears from "./assets/pears.png";
import apples from "./assets/apples.png";
import passion from "./assets/passion.png";
import can from "./assets/can.png";
import labels from "./assets/labels.png";
import ahmedImg from "./assets/people/ahmed.jpg";
import saraImg from "./assets/people/sara.jpg";
import { TypewriterText, SlideUpWords, SlideIn } from "./components/AnimatedText";
import CraftPurityShowcase from "./components/CraftPurityShowcase";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [backgroundPosition, setBackgroundPosition] = useState("0% center");
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isCartWiggling, setIsCartWiggling] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [likedItems, setLikedItems] = useState({});
  const [emailInput, setEmailInput] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Page Loader State
  const [loaderVisible, setLoaderVisible] = useState(true);
  const [loaderPhase, setLoaderPhase] = useState("spin"); // spin | burst | settle | exit

  // Scroll Entrance & Fruit Cut States
  const [isSectionVisible, setIsSectionVisible] = useState(false);
  const [activeCut, setActiveCut] = useState(true);
  const [isOrchardVisible, setIsOrchardVisible] = useState(false);
  const [isBenefitsVisible, setIsBenefitsVisible] = useState(false);
  const [isSocialVisible, setIsSocialVisible] = useState(false);
  const [mobileReviewIndex, setMobileReviewIndex] = useState(0); // 0: Ahmed, 1: Sara

  // Auto rotate mobile review cards gently every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setMobileReviewIndex((prev) => (prev === 0 ? 1 : 0));
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Packaging Box Animation States
  const [isPackingModalOpen, setIsPackingModalOpen] = useState(false);
  const [packingStep, setPackingStep] = useState("cans"); // "cans" | "wrapping" | "tape" | "stamp" | "complete"

  // 🧃 PAGE LOADER — Rotating Can + Sudden Red Juice Burst (3s)
  useEffect(() => {
    // 0s - 1.1s: Can spins label (green -> red Faisal Juice)
    // 1.1s: POP! Sudden rich red juice burst shoots out of can mouth
    // 2.1s: Splashes settle & brand glows
    // 2.65s: Smooth fade exit
    // 3.0s: Done, website revealed
    const t1 = setTimeout(() => setLoaderPhase("burst"), 1100);
    const t2 = setTimeout(() => setLoaderPhase("settle"), 2100);
    const t3 = setTimeout(() => setLoaderPhase("exit"), 2650);
    const t4 = setTimeout(() => setLoaderVisible(false), 3000);
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, []);

  const sidebarRef = useRef(null);
  const navItemsRef = useRef(null);
  const timeline = useRef(null);

  // References for Traveling Hero Can & Orchard Dock
  const heroExperienceRef = useRef(null);
  const scrollCanRef = useRef(null);
  const canTargetDockRef = useRef(null);
  const orchardSectionRef = useRef(null);

  // References for Swipers
  const mainSwiperRef = useRef(null);
  const secondSwiperRef = useRef(null);
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);

  // Can Products Data with Juice Colors & Slices
  const products = [
    {
      id: 1,
      name: "Wild Pear Sparkle",
      tagline: "Crisp & Cold Pressed",
      description:
        "Made with 100% natural orchard pear extract with light sparkling fizz. Zero artificial sugar.",
      price: 3.99,
      originalPrice: 4.99,
      bgPosition: "0% center",
      cardColor: "hsl(79, 66%, 90%)",
      badgeColor: "bg-[#719f35] text-white",
      juiceColor: "#8fcb39",
      fruitImg: pears,
      calories: "85 kcal",
      volume: "330 ml",
      rating: "4.9",
      reviews: 142,
    },
    {
      id: 2,
      name: "Crisp Orchard Apple",
      tagline: "Sweet & Tart Harmony",
      description:
        "Chilled fresh-cut red apples balanced to absolute perfection. 100% pure organic fruit crush.",
      price: 4.49,
      originalPrice: 5.49,
      bgPosition: "50% center",
      cardColor: "hsl(0, 100%, 93%)",
      badgeColor: "bg-[#e24c4c] text-white",
      juiceColor: "#ff4d4d",
      fruitImg: apples,
      calories: "92 kcal",
      volume: "330 ml",
      rating: "5.0",
      reviews: 218,
    },
    {
      id: 3,
      name: "Exotic Passion Splash",
      tagline: "Tropical Vitamin Blast",
      description:
        "Bold tropical passion fruit crush packed with natural Vitamin C, antioxidants and pure vibrant flavour.",
      price: 4.99,
      originalPrice: 5.99,
      bgPosition: "100% center",
      cardColor: "hsl(242, 66%, 93%)",
      badgeColor: "bg-[#6c5ce7] text-white",
      juiceColor: "#8e44ad",
      fruitImg: passion,
      calories: "88 kcal",
      volume: "330 ml",
      rating: "4.9",
      reviews: 189,
    },
  ];

  const activeProduct =
    products.find((p) => p.bgPosition === backgroundPosition) || products[0];

  // ✈️ FLY-TO-CART ANIMATION HANDLER
  const handleFlyToCart = (product, event) => {
    event.stopPropagation();

    // 1. Locate the source can element inside this card
    const card = event.currentTarget.closest(".can-product-card");
    const canEl = card ? card.querySelector(".can-mockup-target") : event.currentTarget;
    const targetCartBtn = document.getElementById("navbar-cart-btn");

    if (!canEl || !targetCartBtn) return;

    const sourceRect = canEl.getBoundingClientRect();
    const targetRect = targetCartBtn.getBoundingClientRect();

    // 2. Create the flying duplicate can
    const flyingClone = document.createElement("div");
    flyingClone.className = "fixed pointer-events-none z-[999999]";
    flyingClone.style.left = `${sourceRect.left}px`;
    flyingClone.style.top = `${sourceRect.top}px`;
    flyingClone.style.width = `${sourceRect.width}px`;
    flyingClone.style.height = `${sourceRect.height}px`;
    flyingClone.style.backgroundImage = `url(${labels}), url(${can})`;
    flyingClone.style.maskImage = `url(${can})`;
    flyingClone.style.WebkitMaskImage = `url(${can})`;
    flyingClone.style.backgroundPosition = `${product.bgPosition}, center`;
    flyingClone.style.backgroundSize = "300% 100%, 100% 100%";
    flyingClone.style.backgroundRepeat = "no-repeat, no-repeat";
    flyingClone.style.backgroundBlendMode = "multiply";
    flyingClone.style.maskSize = "100% 100%";
    flyingClone.style.WebkitMaskSize = "100% 100%";
    flyingClone.style.filter = "drop-shadow(0 15px 30px rgba(0,0,0,0.45))";

    document.body.appendChild(flyingClone);

    // Calculate curve destination
    const deltaX = targetRect.left + targetRect.width / 2 - (sourceRect.left + sourceRect.width / 2);
    const deltaY = targetRect.top + targetRect.height / 2 - (sourceRect.top + sourceRect.height / 2);
    const isMobile = window.innerWidth < 640;
    const hopY = isMobile ? -50 : -100;

    // 3. GSAP Flying Parabolic Arc Timeline
    const tl = gsap.timeline({
      onComplete: () => {
        flyingClone.remove();

        // Update cart counter & item list
        setCartCount((prev) => prev + 1);
        setCartItems((prev) => {
          const exists = prev.find((item) => item.id === product.id);
          if (exists) {
            return prev.map((item) =>
              item.id === product.id ? { ...item, qty: item.qty + 1 } : item
            );
          }
          return [...prev, { ...product, qty: 1 }];
        });

        // Trigger Navbar Cart Wiggle and Glow Ripple!
        setIsCartWiggling(true);
        setTimeout(() => setIsCartWiggling(false), 700);

        // Toast feedback
        setToastMessage(`🧃 ${product.name} flew into your cart!`);
        setTimeout(() => setToastMessage(""), 2500);
      },
    });

    // Step 1: Can lifts up energetically in the air
    tl.to(flyingClone, {
      y: hopY,
      scale: isMobile ? 1.15 : 1.25,
      rotate: -15,
      duration: 0.28,
      ease: "power2.out",
    })
      // Step 2: Can flies across screen directly into the navbar cart
      .to(flyingClone, {
        x: deltaX,
        y: deltaY,
        scale: 0.18,
        rotate: 450,
        opacity: 0.9,
        duration: 0.72,
        ease: "power2.inOut",
      })
      // Step 3: Absorbed into cart icon
      .to(flyingClone, {
        scale: 0,
        opacity: 0,
        duration: 0.08,
      });
  };

  const updateCartItemQty = (id, change) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.qty + change;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
    setCartCount((prev) => Math.max(0, prev + change));
  };

  const removeCartItem = (id) => {
    const item = cartItems.find((i) => i.id === id);
    if (item) {
      setCartCount((prev) => Math.max(0, prev - item.qty));
      setCartItems((prev) => prev.filter((i) => i.id !== id));
    }
  };

  const cartTotal = cartItems
    .reduce((sum, item) => sum + item.price * item.qty, 0)
    .toFixed(2);

  // 📦 START CHECKOUT PACKAGING, TAPE SEAL & TRUCK DELIVERY ANIMATION
  const handleStartCheckout = () => {
    if (cartItems.length === 0) return;
    setIsCartDrawerOpen(false);
    setIsPackingModalOpen(true);
    setPackingStep("cans");

    // Sequence of animations:
    // 1. Cans drop into large box in center (0 - 1.5s)
    setTimeout(() => {
      setPackingStep("wrapping"); // Box flaps fold in
    }, 1500);

    // 2. Heavy-duty tape seals across (1.5 - 2.6s)
    setTimeout(() => {
      setPackingStep("tape");
    }, 2600);

    // 3. Shipping label stamps down (2.6 - 3.7s)
    setTimeout(() => {
      setPackingStep("stamp");
    }, 3700);

    // 4. Delivery Truck drives in from full left edge of website to center (3.7 - 6.0s)
    setTimeout(() => {
      setPackingStep("truck-arrive");
    }, 4800);

    // 5. Sealed box lifts and loads into truck cargo bay (6.0 - 7.6s)
    setTimeout(() => {
      setPackingStep("box-loading");
    }, 7000);

    // 6. Truck engine revs, smoke puffs and truck departs to full right edge (7.6 - 9.8s)
    setTimeout(() => {
      setPackingStep("truck-exit");
    }, 8500);

    // 7. Order celebration card shown after truck is completely gone (9.8s onwards)
    setTimeout(() => {
      setPackingStep("complete");
    }, 10700);
  };

  const toggleLike = (id) => {
    setLikedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setIsSubscribed(true);
      setEmailInput("");
      setTimeout(() => setIsSubscribed(false), 4000);
    }
  };

  const triggerReSlice = () => {
    setActiveCut(false);
    setTimeout(() => {
      setActiveCut(true);
    }, 150);
  };

  useEffect(() => {
    if (!sidebarRef.current || !navItemsRef.current) return;

    // Set initial positions
    gsap.set(sidebarRef.current, { right: "-100%" });
    gsap.set(navItemsRef.current.children, { x: 50, opacity: 0 });

    timeline.current = gsap
      .timeline({ paused: true })
      .to(sidebarRef.current, {
        right: "0%",
        duration: 0.5,
        ease: "power2.inOut",
      })
      .to(
        navItemsRef.current.children,
        {
          x: 0,
          opacity: 1,
          duration: 0.3,
          stagger: 0.05,
          ease: "power2.inOut",
        },
        "-=0.2"
      );
  }, []);

  const handleOpen = () => {
    timeline.current?.play();
  };

  const handleClose = () => {
    timeline.current?.reverse();
  };

  const homeHeight = () => {
    const home = document.querySelector(".home");
    const mockup = document.querySelector(".home-mockup");

    if (home && mockup) {
      const isMobile = window.innerWidth < 640;
      home.style.height = `${mockup.offsetHeight + (isMobile ? 180 : 313)}px`;
      ScrollTrigger.refresh();
    }
  };

  const handleSlideChange = (swiper) => {
    const index = swiper.realIndex;
    const newPosition =
      index === 0 ? "0% center" : index === 1 ? "50% center" : "100% center";
    setBackgroundPosition(newPosition);
  };

  // 🧃 GSAP ScrollTrigger Can Docking Animation (Hero Center -> Orchard Fresh Dock)
  useEffect(() => {
    const canEl = scrollCanRef.current;
    const dockEl = canTargetDockRef.current;
    const containerEl = heroExperienceRef.current;

    if (!canEl || !dockEl || !containerEl) return;

    ScrollTrigger.config({ ignoreMobileResize: true });

    // Small delay to ensure styles and font sizes are computed
    const timer = setTimeout(() => {
      const getInitialCenter = () => {
        const homeEl = containerEl.querySelector(".home");
        const isMobile = window.innerWidth < 640;
        return {
          x: containerEl.offsetWidth / 2,
          y: homeEl ? homeEl.offsetTop + homeEl.offsetHeight / 2 + (isMobile ? 0 : 16) : window.innerHeight / 2,
        };
      };

      const getDockRelativeCenter = () => {
        const cRect = containerEl.getBoundingClientRect();
        const dRect = dockEl.getBoundingClientRect();
        return {
          x: dRect.left - cRect.left + dRect.width / 2,
          y: dRect.top - cRect.top + dRect.height / 2,
          width: dRect.width,
          height: dRect.height,
        };
      };

      const initial = getInitialCenter();

      // Set initial state
      gsap.set(canEl, {
        top: initial.y,
        left: initial.x,
        xPercent: -50,
        yPercent: -50,
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1,
      });

      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerEl,
            start: "top top",
            endTrigger: dockEl,
            end: "center center",
            scrub: 1.2,
            invalidateOnRefresh: true,
          },
        });

        tl.to(canEl, {
          x: () => {
            const dock = getDockRelativeCenter();
            const init = getInitialCenter();
            return dock.x - init.x;
          },
          y: () => {
            const dock = getDockRelativeCenter();
            const init = getInitialCenter();
            return dock.y - init.y;
          },
          scale: () => {
            const dock = getDockRelativeCenter();
            const unscaledH = canEl.offsetHeight || 340;
            return Math.min(Math.max(dock.height / unscaledH, 0.65), 1.05);
          },
          rotation: -5,
          duration: 0.75,
          ease: "power2.inOut",
        }).to(canEl, {
          rotation: 0,
          duration: 0.25,
          ease: "power1.out",
        });
      }, containerEl);

      ScrollTrigger.refresh();

      return () => {
        ctx.revert();
      };
    }, 150);

    const handleRefresh = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleRefresh);
    window.addEventListener("orientationchange", handleRefresh);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleRefresh);
      window.removeEventListener("orientationchange", handleRefresh);
    };
  }, []);

  // High-performance visibility observer (zero layout thrashing, 60-120 FPS scrolling)
  useEffect(() => {
    const handleScrollHeader = () => {
      setIsHeaderScrolled(window.scrollY >= 50);
    };
    window.addEventListener("scroll", handleScrollHeader, { passive: true });

    let observer = null;
    if (typeof window !== "undefined" && "IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const id = entry.target.id;
              if (id === "orchard-fresh") setIsOrchardVisible(true);
              else if (id === "shop") setIsSectionVisible(true);
              else if (id === "benefits") setIsBenefitsVisible(true);
              else if (id === "social-proof") setIsSocialVisible(true);
            }
          });
        },
        { threshold: 0.15 }
      );

      ["orchard-fresh", "shop", "benefits", "social-proof"].forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });
    } else {
      setIsOrchardVisible(true);
      setIsSectionVisible(true);
      setIsBenefitsVisible(true);
      setIsSocialVisible(true);
    }

    homeHeight();
    window.addEventListener("resize", homeHeight, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScrollHeader);
      window.removeEventListener("resize", homeHeight);
      if (observer) observer.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] text-neutral-900 selection:bg-black selection:text-white relative">
      {/* ════════════════════════════════════════════════════
          🧃 PAGE LOADER — Hero 3D Can (Rotating Label) + Sudden Red Juice Burst
          ════════════════════════════════════════════════════ */}
      {loaderVisible && (
        <div
          className={`fixed inset-0 z-[999999] flex flex-col items-center justify-center overflow-hidden transition-all duration-700 ${loaderPhase === "exit" ? "opacity-0 pointer-events-none scale-105" : "opacity-100 scale-100"
            }`}
          style={{ background: "radial-gradient(circle at center, #1b070c 0%, #0c0406 60%, #050203 100%)" }}
        >
          {/* Ambient red orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="ldr-orb ldr-orb-red-1" />
            <div className="ldr-orb ldr-orb-red-2" />
          </div>

          {/* Radial spotlight behind the can */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className={`ldr-spotlight-hero transition-all duration-700 ${loaderPhase === "burst" || loaderPhase === "settle" ? "opacity-90 scale-125" : "opacity-35 scale-100"
              }`} />
          </div>

          {/* Main Stage: Center 3D Can + Burst */}
          <div className="relative flex flex-col items-center select-none" style={{ zIndex: 10 }}>

            {/* Can Wrapper with Recoil Animation on burst */}
            <div className={`relative flex items-center justify-center ${loaderPhase === "burst" ? "ldr-can-recoil" : ""
              }`}>

              {/* 3D CAN MOCKUP — EXACT HERO SECTION TECHNIQUE */}
              <div
                className={`ldr-hero-can ${loaderPhase === "spin" ? "ldr-can-spin-label" : "ldr-can-locked-label"}`}
                style={{
                  backgroundImage: `url(${labels}), url(${can})`,
                  maskImage: `url(${can})`,
                  WebkitMaskImage: `url(${can})`,
                  backgroundSize: "300% 100%, 100% 100%",
                  backgroundRepeat: "repeat-x, no-repeat",
                  backgroundBlendMode: "multiply",
                  maskSize: "100% 100%",
                  maskRepeat: "no-repeat",
                  WebkitMaskSize: "100% 100%",
                  WebkitMaskRepeat: "no-repeat",
                  aspectRatio: "45 / 83",
                }}
              />

              {/* Floor Shadow beneath can */}
              <div className="ldr-floor-shadow" />

              {/* SUDDEN RED JUICE BURST — FROM CAN MOUTH (TOP RIM) */}
              {(loaderPhase === "burst" || loaderPhase === "settle") && (
                <div className="ldr-burst-anchor">
                  {/* Pop Muzzle Flash */}
                  <div className="ldr-pop-flash" />

                  {/* Central High-Pressure Red Stream */}
                  <div className="ldr-red-stream ldr-red-stream-main" />

                  {/* High-Pressure Left & Right Arcs */}
                  <div className="ldr-red-stream ldr-red-stream-left" />
                  <div className="ldr-red-stream ldr-red-stream-right" />
                  <div className="ldr-red-stream ldr-red-stream-far-l" />
                  <div className="ldr-red-stream ldr-red-stream-far-r" />

                  {/* 26 Fizzy Red Juice Droplets */}
                  {[...Array(26)].map((_, i) => {
                    const angle = (i / 26) * 240 - 120;
                    const dist = 75 + Math.random() * 150;
                    const rad = (angle * Math.PI) / 180;
                    return (
                      <div
                        key={i}
                        className="ldr-red-drop"
                        style={{
                          "--dx": `${Math.sin(rad) * dist}px`,
                          "--dy": `${-Math.abs(Math.cos(rad)) * dist}px`,
                          "--sz": `${4 + Math.random() * 8}px`,
                          "--col": ["#ff1744", "#ff4081", "#d50000", "#ff5252", "#ff7961", "#ffffff"][i % 6],
                          animationDelay: `${i * 32}ms`,
                        }}
                      />
                    );
                  })}
                </div>
              )}
            </div>

            {/* Splash puddle at base */}
            {(loaderPhase === "burst" || loaderPhase === "settle") && (
              <div className="ldr-base-splash">
                <div className="ldr-splash-puddle" />
                <div className="ldr-splash-ring ldr-splash-ring-1" />
                <div className="ldr-splash-ring ldr-splash-ring-2" />
              </div>
            )}
          </div>

          {/* Brand Identity */}
          <div
            className={`mt-8 sm:mt-12 text-center transition-all duration-700 ${loaderPhase === "spin" ? "opacity-0 translate-y-6" : "opacity-100 translate-y-0"
              }`}
            style={{ zIndex: 10 }}
          >
            <p className="text-red-400 text-[11px] font-black tracking-[0.4em] uppercase mb-1.5">
              100% Cold-Pressed Orchard Fruit
            </p>
            <h1 className="text-white font-black leading-none tracking-tight" style={{ fontSize: "clamp(2.2rem, 7vw, 3.8rem)" }}>
              Faisal{" "}
              <span style={{
                background: "linear-gradient(135deg, #ff6b6b 0%, #ff1744 50%, #ff8a80 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                Juice
              </span>
            </h1>
            <p className="text-neutral-400 text-xs mt-2 tracking-widest font-medium">
              Crimson Apple Burst · Chilled & Served Fresh
            </p>
          </div>

          {/* Progress bar */}
          <div className="mt-6 relative" style={{ zIndex: 10 }}>
            <div className="w-48 sm:w-60 h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all ease-linear"
                style={{
                  background: "linear-gradient(90deg, #d50000, #ff1744, #ff5252)",
                  width: loaderPhase === "spin" ? "35%" : loaderPhase === "burst" ? "75%" : loaderPhase === "settle" ? "95%" : "100%",
                  transitionDuration: loaderPhase === "spin" ? "1100ms" : "1000ms",
                  boxShadow: "0 0 16px rgba(255, 23, 68, 0.8)",
                }}
              />
            </div>
          </div>
        </div>
      )}
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[99999] bg-black text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
          <p className="text-sm font-medium">{toastMessage}</p>
        </div>
      )}

      {/* Slide-out Cart Drawer */}
      {isCartDrawerOpen && (
        <div className="fixed inset-0 z-[100000] flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsCartDrawerOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col p-6 z-10 animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between pb-5 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <BsCart className="text-xl" />
                <h3 className="font-bold text-xl">Your Juice Cart</h3>
                <span className="text-xs bg-black text-white px-2 py-0.5 rounded-full font-bold">
                  {cartCount}
                </span>
              </div>
              <button
                onClick={() => setIsCartDrawerOpen(false)}
                className="p-2 rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
              >
                <CgCloseR size={22} />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto py-5 space-y-4">
              {cartItems.length === 0 ? (
                <div className="text-center py-16 text-neutral-400">
                  <div className="text-5xl mb-3">🧃</div>
                  <p className="font-semibold text-neutral-700">Your cart is empty</p>
                  <p className="text-xs mt-1">
                    Click on any can or &quot;Add to Cart&quot; to watch it fly right in!
                  </p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-50 border border-neutral-100"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 aspect-[45/83] drop-shadow-md"
                        style={{
                          backgroundImage: `url(${labels}), url(${can})`,
                          maskImage: `url(${can})`,
                          WebkitMaskImage: `url(${can})`,
                          backgroundPosition: `${item.bgPosition}, center`,
                          backgroundSize: "300% 100%, 100% 100%",
                          backgroundBlendMode: "multiply",
                          maskSize: "100% 100%",
                          WebkitMaskSize: "100% 100%",
                        }}
                      />
                      <div>
                        <h4 className="font-bold text-sm text-neutral-900">{item.name}</h4>
                        <span className="text-xs font-semibold text-neutral-500">
                          ${item.price} each
                        </span>
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center bg-white rounded-lg border border-neutral-200">
                        <button
                          onClick={() => updateCartItemQty(item.id, -1)}
                          className="p-1.5 hover:bg-neutral-100 rounded-l-lg transition-colors cursor-pointer"
                        >
                          <BsDash size={14} />
                        </button>
                        <span className="px-2.5 text-xs font-bold">{item.qty}</span>
                        <button
                          onClick={() => updateCartItemQty(item.id, 1)}
                          className="p-1.5 hover:bg-neutral-100 rounded-r-lg transition-colors cursor-pointer"
                        >
                          <BsPlus size={14} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeCartItem(item.id)}
                        className="p-2 text-neutral-400 hover:text-red-500 transition-colors cursor-pointer"
                      >
                        <BsTrash size={15} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Checkout Footer */}
            {cartItems.length > 0 && (
              <div className="pt-4 border-t border-neutral-100">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-neutral-500 font-medium">Subtotal</span>
                  <span className="text-2xl font-black text-neutral-900">${cartTotal}</span>
                </div>
                <button
                  onClick={handleStartCheckout}
                  className="w-full bg-black hover:bg-neutral-800 text-white font-bold py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-xl cursor-pointer active:scale-95 transition-all"
                >
                  <BsBagCheck size={18} />
                  <span>Proceed to Checkout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 📦 FULLSCREEN BLURRED CINEMATIC PACKAGING & HIGHWAY TRUCK DELIVERY */}
      {isPackingModalOpen && (
        <div className="fixed inset-0 z-[1000000] flex flex-col justify-between backdrop-blur-2xl bg-black/60 select-none overflow-hidden animate-in fade-in duration-300">
          {/* Confetti Particles on Complete */}
          {packingStep === "complete" && (
            <div className="absolute inset-0 pointer-events-none z-50">
              {[...Array(24)].map((_, i) => (
                <span
                  key={i}
                  className="absolute text-xl animate-confetti"
                  style={{
                    left: `${(i * 4.5) % 96}%`,
                    top: `${(i * 7) % 40}%`,
                    animationDelay: `${i * 0.08}s`,
                  }}
                >
                  {["🎉", "✨", "🧃", "❄️", "🚚", "⭐", "💚"][i % 7]}
                </span>
              ))}
            </div>
          )}

          {/* Top Bar: Live Status & Controls */}
          <div className="relative z-50 w-full max-w-6xl mx-auto p-4 sm:p-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs sm:text-sm font-mono font-bold tracking-wider uppercase text-emerald-400 bg-white/10 px-3.5 py-1.5 rounded-full border border-white/15 backdrop-blur-md">
                {packingStep === "cans" && "Step 1/5 • Packing Fresh Cans into Box"}
                {packingStep === "wrapping" && "Step 2/5 • Folding Insulated Flaps"}
                {packingStep === "tape" && "Step 3/5 • Applying Heavy-Duty Security Tape"}
                {packingStep === "stamp" && "Step 4/5 • Priority Label Stamped"}
                {packingStep === "truck-arrive" && "Step 5/5 • Delivery Truck Arriving from Far Left 🚚"}
                {packingStep === "box-loading" && "Step 5/5 • Loading Sealed Box into Truck"}
                {packingStep === "truck-exit" && "Step 5/5 • Express Truck Departing to Right 🚀"}
                {packingStep === "complete" && "✨ Order Dispatched to Faisal Sikandar"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {packingStep !== "complete" && (
                <button
                  onClick={() => setPackingStep("complete")}
                  className="text-xs font-semibold text-neutral-300 hover:text-white bg-white/10 hover:bg-white/20 border border-white/15 px-3 py-1.5 rounded-full transition-all cursor-pointer"
                >
                  Skip ⏩
                </button>
              )}
              <button
                onClick={() => {
                  setIsPackingModalOpen(false);
                  if (packingStep === "complete") {
                    setCartCount(0);
                    setCartItems([]);
                  }
                }}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white border border-white/15 transition-colors cursor-pointer"
                title="Close"
              >
                <CgCloseR size={20} />
              </button>
            </div>
          </div>

          {/* Center Arena */}
          <div className="relative flex-1 w-full flex items-center justify-center p-4 overflow-hidden z-30">
            {/* STAGE 1: BARA CARDBOARD BOX IN CENTER (Cans drop in, flaps close, tape seals, stamp hits) */}
            {(packingStep === "cans" ||
              packingStep === "wrapping" ||
              packingStep === "tape" ||
              packingStep === "stamp") && (
              <div className="relative w-[320px] xs:w-[380px] sm:w-[520px] md:w-[580px] h-64 xs:h-72 sm:h-84 md:h-92 bg-[#c89666] border-2 border-[#8f5d30] rounded-3xl shadow-[0_35px_80px_rgba(0,0,0,0.6)] flex flex-col justify-between overflow-hidden animate-in zoom-in-95 duration-500">
                {/* Rich Kraft Cardboard Texture */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#e3ab7a] via-[#c89666] to-[#9c6a3b] opacity-95" />

                {/* Box Header Branding */}
                <div className="absolute top-3 sm:top-5 left-4 sm:left-6 z-10 flex items-center gap-2 opacity-90">
                  <span className="font-black tracking-tight text-base sm:text-2xl text-[#3d2411] drop-shadow-sm">
                    FAISAL JUICE
                  </span>
                  <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-[#3d2411]"></span>
                  <span className="text-[9px] sm:text-xs font-mono font-bold tracking-widest text-[#3d2411] border border-[#3d2411] px-2 py-0.5 rounded-md">
                    100% RAW • CHILLED 24H EXPRESS
                  </span>
                </div>

                {/* Inside: Cans Dropping In Side by Side */}
                <div className="absolute inset-x-0 bottom-4 sm:bottom-6 top-14 sm:top-18 z-20 flex items-end justify-center gap-2 sm:gap-6 px-3 sm:px-6 pb-2">
                  {cartItems
                    .flatMap((item) =>
                      Array.from({ length: Math.min(item.qty, 2) }).map((_, i) => ({
                        ...item,
                        uniqueKey: `${item.id}-${i}`,
                      }))
                    )
                    .slice(0, 4)
                    .map((item, idx) => (
                      <div
                        key={item.uniqueKey}
                        className={`flex flex-col items-center transition-all duration-500 ${
                          packingStep === "cans" ? "animate-can-box-drop" : "scale-100 opacity-95"
                        }`}
                        style={{
                          animationDelay: `${idx * 200}ms`,
                        }}
                      >
                        <div
                          className="w-12 xs:w-14 sm:w-20 md:w-22 aspect-[45/83] drop-shadow-2xl"
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
                            filter: "drop-shadow(0 12px 20px rgba(0,0,0,0.45))",
                          }}
                        />
                        <span className="text-[8px] sm:text-xs font-bold text-neutral-900 mt-1.5 bg-white/95 backdrop-blur-sm px-2 py-0.5 rounded-md shadow-sm whitespace-nowrap">
                          {item.name.split(" ")[1] || "Juice"}
                        </span>
                      </div>
                    ))}
                </div>

                {/* Left Flap Folding In */}
                <div
                  className={`absolute top-0 left-0 w-1/2 h-full bg-[#ba8858] border-r border-[#96673b] origin-top z-30 transition-all duration-700 shadow-xl ${
                    packingStep !== "cans" ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
                  }`}
                />

                {/* Right Flap Folding In */}
                <div
                  className={`absolute top-0 right-0 w-1/2 h-full bg-[#b07e4f] border-l border-[#96673b] origin-top z-30 transition-all duration-700 shadow-xl ${
                    packingStep !== "cans" ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
                  }`}
                />

                {/* PACKAGING TAPE (SEALS ACROSS MIDDLE) */}
                {(packingStep === "tape" || packingStep === "stamp") && (
                  <div className="absolute top-1/2 -translate-y-1/2 left-0 z-40 w-full overflow-hidden flex items-center">
                    <div className="h-8 sm:h-11 bg-[#784f29] border-y-2 border-[#472c14] text-amber-200 text-[9px] sm:text-xs font-mono font-bold tracking-widest flex items-center justify-around shadow-2xl animate-tape-roll select-none px-2 w-full">
                      <span>🔒 FAISAL JUICE SEALED</span>
                      <span className="hidden sm:inline">★ DO NOT TAMPER</span>
                      <span>🔒 PRIORITY CHILLED</span>
                    </div>
                  </div>
                )}

                {/* SHIPPING LABEL STAMP (SLAMS ON BOX) */}
                {packingStep === "stamp" && (
                  <div className="absolute bottom-3 sm:bottom-5 right-3 sm:right-6 z-40 bg-white text-neutral-900 p-2.5 sm:p-4 rounded-xl shadow-2xl border border-neutral-300 w-44 sm:w-56 animate-stamp-slam select-none">
                    <div className="flex justify-between items-center border-b border-neutral-200 pb-1 mb-1.5">
                      <span className="text-[9px] sm:text-[10px] font-black tracking-widest text-emerald-600 uppercase">
                        EXPRESS CHILLED
                      </span>
                      <span className="text-[8px] sm:text-[9px] font-mono text-neutral-500 font-bold">#FJ-8891</span>
                    </div>
                    <p className="text-[9px] sm:text-[10px] font-extrabold leading-tight text-neutral-800">
                      DELIVER TO:
                    </p>
                    <p className="text-xs sm:text-base font-black text-neutral-900 tracking-tight">
                      Faisal Sikandar
                    </p>
                    <p className="text-[8px] sm:text-[10px] text-neutral-600 leading-none mt-1">
                      Ali Bootcamp • Priority Route
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* STAGE 2: BIG EXPRESS TRUCK (Driving from far left of website -> center -> loading box -> speeding to far right) */}
            {(packingStep === "truck-arrive" ||
              packingStep === "box-loading" ||
              packingStep === "truck-exit") && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {/* Floating Sealed Box being loaded into truck */}
                {packingStep === "box-loading" && (
                  <div className="absolute z-40 animate-box-into-truck">
                    <div className="w-36 sm:w-48 h-24 sm:h-32 bg-[#c89666] border-2 border-[#7f5539] rounded-2xl shadow-2xl flex flex-col items-center justify-center text-white font-bold p-2">
                      <span className="text-xs sm:text-sm">📦 FAISAL JUICE</span>
                      <span className="text-[9px] sm:text-[11px] text-amber-200 font-mono mt-0.5">
                        To: Faisal Sikandar
                      </span>
                      <span className="text-[8px] font-mono bg-emerald-600 px-2 py-0.5 rounded-full mt-1">
                        -4°C CHILLED
                      </span>
                    </div>
                  </div>
                )}

                {/* Big Delivery Truck on the road */}
                <div
                  className={`absolute bottom-20 sm:bottom-24 left-1/2 -ml-48 sm:-ml-64 scale-[0.72] xs:scale-[0.82] sm:scale-95 md:scale-105 origin-bottom transition-all duration-700 ${
                    packingStep === "truck-arrive"
                      ? "animate-truck-fullscreen-arrive"
                      : packingStep === "truck-exit"
                      ? "animate-truck-fullscreen-depart"
                      : ""
                  }`}
                >
                  <div className="relative z-20 flex items-end">
                    {/* Headlight Glowing Beam shooting forward */}
                    <div className="absolute -right-48 bottom-6 w-56 h-32 headlight-beam pointer-events-none z-30" />

                    {/* Silencer Exhaust Pipe with Real Puffed Smoke */}
                    <div className="absolute -left-6 bottom-8 z-10 pointer-events-none">
                      <div className="w-4 h-11 bg-neutral-400 border border-neutral-200 rounded-t-sm -rotate-12 transform origin-bottom shadow-md" />
                      <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-neutral-300/85 blur-[2px] animate-smoke-puff-1" />
                      <div className="absolute -top-6 -left-7 w-10 h-10 rounded-full bg-neutral-400/75 blur-[3px] animate-smoke-puff-2" />
                      <div className="absolute -top-8 -left-10 w-14 h-14 rounded-full bg-neutral-500/65 blur-[4px] animate-smoke-puff-3" />
                    </div>

                    {/* Truck Body */}
                    <div className="flex items-end">
                      {/* Rear Cargo Refrigerated Box Container */}
                      <div className="relative w-72 sm:w-88 h-48 bg-gradient-to-b from-neutral-100 to-neutral-200 border-2 border-neutral-300 rounded-l-2xl shadow-2xl flex flex-col justify-between p-4 overflow-hidden">
                        <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_18px,rgba(0,0,0,0.03)_18px,rgba(0,0,0,0.03)_22px)] opacity-70" />

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
                              packingStep === "box-loading"
                                ? "bg-amber-100 text-amber-800 animate-pulse border border-amber-300"
                                : "bg-emerald-100 text-emerald-800 border border-emerald-300"
                            }`}
                          >
                            {packingStep === "truck-arrive" && "DOORS OPEN 🔓"}
                            {packingStep === "box-loading" && "LOADING BOX 📦"}
                            {packingStep === "truck-exit" && "LOCKED & DISPATCHED 🔒"}
                          </span>
                        </div>
                      </div>

                      {/* Front Cab */}
                      <div className="relative w-36 sm:w-44 h-40 bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 border-2 border-emerald-400 rounded-r-2xl shadow-2xl flex flex-col justify-between p-3.5 overflow-hidden">
                        <div className="w-20 h-18 bg-sky-200/40 border border-white/50 rounded-tr-xl self-end flex items-center justify-center shadow-inner">
                          <span className="text-lg opacity-85 select-none">👨‍✈️</span>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <div className="h-4 w-16 bg-neutral-900 rounded flex items-center justify-around px-1">
                            <span className="w-1.5 h-2.5 bg-neutral-500 rounded-full" />
                            <span className="w-1.5 h-2.5 bg-neutral-500 rounded-full" />
                            <span className="w-1.5 h-2.5 bg-neutral-500 rounded-full" />
                          </div>
                          <div className="w-6 h-6 rounded-full bg-yellow-300 border-2 border-yellow-100 shadow-[0_0_24px_#fde047]" />
                        </div>
                      </div>
                    </div>

                    {/* Alloy Wheels */}
                    <div className="absolute -bottom-5 inset-x-8 flex justify-between px-2 z-30">
                      <div className="w-12 h-12 rounded-full bg-neutral-900 border-2 border-neutral-700 flex items-center justify-center shadow-2xl animate-recycle-spin">
                        <div className="w-4 h-4 rounded-full bg-neutral-400 border border-neutral-200" />
                      </div>
                      <div className="w-12 h-12 rounded-full bg-neutral-900 border-2 border-neutral-700 flex items-center justify-center shadow-2xl animate-recycle-spin">
                        <div className="w-4 h-4 rounded-full bg-neutral-400 border border-neutral-200" />
                      </div>
                      <div className="w-12 h-12 rounded-full bg-neutral-900 border-2 border-neutral-700 flex items-center justify-center shadow-2xl animate-recycle-spin">
                        <div className="w-4 h-4 rounded-full bg-neutral-400 border border-neutral-200" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STAGE 3: ORDER SUCCESS CARD (User requested screen in center) */}
            {packingStep === "complete" && (
              <div className="relative z-50 bg-neutral-900/95 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center shadow-[0_30px_90px_rgba(0,0,0,0.6)] animate-in zoom-in-95 duration-500 mx-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500 text-black flex items-center justify-center text-3xl font-black shadow-xl mx-auto mb-4 animate-bounce">
                  ✓
                </div>
                <span className="text-xs font-mono font-bold tracking-widest uppercase text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3.5 py-1.5 rounded-full inline-block mb-2">
                  Order Dispatched to Faisal Sikandar
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
                  Out for Chilled Delivery! 🚀
                </h3>
                <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed mb-6">
                  The express truck has picked up your sealed juice box and departed for chilled delivery to{" "}
                  <strong className="text-emerald-400 font-semibold">Faisal Sikandar</strong> (Ali Bootcamp).
                </p>

                {/* Total Packed Info */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6 text-left">
                  <div className="text-xs text-neutral-400 mb-1">Total Packed:</div>
                  <div className="text-lg font-black text-white">
                    {cartCount} Fresh Cans • <span className="text-emerald-400 font-mono">${cartTotal}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={handleStartCheckout}
                    className="w-full sm:w-1/2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs py-3 px-4 rounded-xl border border-white/20 transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2"
                  >
                    <span>🔄 Replay</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsPackingModalOpen(false);
                      setCartCount(0);
                      setCartItems([]);
                      setToastMessage("🚚 Order successfully delivered to Faisal Sikandar!");
                      setTimeout(() => setToastMessage(""), 3500);
                    }}
                    className="w-full sm:w-1/2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs py-3 px-4 rounded-xl transition-all cursor-pointer shadow-lg active:scale-95 flex items-center justify-center gap-2"
                  >
                    <span>Finish & Close</span>
                    <BsArrowRight />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Fullscreen Edge-to-Edge Highway Road across the Bottom of Website */}
          <div className="relative w-full h-24 sm:h-32 bg-gradient-to-b from-[#252a35] via-[#1a1e27] to-[#101318] border-t-4 border-[#3b4252] shadow-[0_-15px_40px_rgba(0,0,0,0.6)] z-20 flex flex-col justify-between overflow-hidden">
            {/* Top Shoulder White Line */}
            <div className="w-full h-1 bg-white/35" />

            {/* Moving / Glowing Yellow Center Dashed Divider Line */}
            <div className="w-full h-2 bg-[repeating-linear-gradient(90deg,#f59e0b_0,#f59e0b_45px,transparent_45px,transparent_85px)] opacity-90 animate-road-line" />

            {/* Bottom Curb Line */}
            <div className="w-full h-1 bg-neutral-800" />
          </div>
        </div>
      )}

      {/* Header */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isHeaderScrolled ? "bg-header shadow-sm" : ""
          }`}
      >
        <nav className="nav h-[5.5rem] max-w-[1568px] mx-auto p-[1rem] px-6 sm:px-10 flex items-center justify-between">
          <a
            href="#"
            className="nav-logo font-bold text-3xl tracking-tight hover:opacity-80 transition-opacity"
          >
            Faisal Juice<span className="text-emerald-500">.</span>
          </a>

          {/* Large screens navbar */}
          <div className="hidden md:flex items-center gap-10">
            <ul className="nav-list flex gap-8">
              {[
                { name: "Flavours", href: "#flavours" },
                { name: "Why Us", href: "#benefits" },
                { name: "Shop Cans", href: "#shop" },
                { name: "Contact", href: "#contact" },
              ].map((link, index) => (
                <li key={index} className="nav-item">
                  <a
                    href={link.href}
                    className="nav-link font-medium text-neutral-700 hover:text-black transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Actions: Navbar Cart with Fly Target & Wiggle */}
          <div className="nav-actions text-xl flex items-center gap-5">
            <button
              id="navbar-cart-btn"
              onClick={() => setIsCartDrawerOpen(true)}
              className={`relative p-2.5 rounded-full hover:bg-black/5 transition-all cursor-pointer flex items-center justify-center ${isCartWiggling ? "animate-cart-wiggle" : ""
                }`}
              aria-label="Cart"
            >
              {/* Ripple Ring on can delivery */}
              {isCartWiggling && <div className="cart-ripple-ring" />}

              <BsCart size={22} className={isCartWiggling ? "text-emerald-500" : ""} />

              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            <div
              className="nav-toggle md:hidden cursor-pointer p-2 rounded-full hover:bg-black/5 transition-colors"
              onClick={handleOpen}
            >
              <BiMenu size={26} />
            </div>
          </div>
        </nav>

        {/* Mobile Sidebar */}
        <div
          ref={sidebarRef}
          className="md:hidden fixed top-0 h-screen w-[75vw] max-w-[320px] p-8 overflow-hidden bg-white/95 backdrop-blur-2xl shadow-2xl z-[9999]"
          style={{ right: "-100%" }}
        >
          <div className="flex justify-between items-center mb-8">
            <span className="text-2xl font-bold">Faisal Juice.</span>
            <CgCloseR
              size={24}
              className="cursor-pointer hover:opacity-70 transition-opacity"
              onClick={handleClose}
            />
          </div>
          <ul ref={navItemsRef} className="flex flex-col gap-6 text-lg font-semibold text-neutral-800">
            <li>
              <a href="#flavours" onClick={handleClose}>
                Flavours
              </a>
            </li>
            <li>
              <a href="#benefits" onClick={handleClose}>
                Why Us
              </a>
            </li>
            <li>
              <a href="#shop" onClick={handleClose}>
                Shop Cans
              </a>
            </li>
            <li>
              <a href="#contact" onClick={handleClose}>
                Contact
              </a>
            </li>
          </ul>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {/* Continuous Hero Experience Wrapper for Seamless Scroll-Driven Can Animation */}
        <div ref={heroExperienceRef} className="relative w-full overflow-visible">
          {/* Hero Section */}
          <section className="home relative min-h-[600px] overflow-hidden">
            {/* ⌨️ AI Live Typewriter Status Badge */}
            <div className="absolute top-20 sm:top-24 left-1/2 -translate-x-1/2 !z-[110] pointer-events-none text-center px-4 w-full max-w-xl">
              <div className="inline-flex items-center gap-2 bg-neutral-900/80 backdrop-blur-md border border-white/20 text-white px-4 py-1.5 rounded-full text-xs font-semibold shadow-2xl">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-emerald-300 font-bold uppercase text-[10px] tracking-wider font-mono">AI Live:</span>
                <TypewriterText
                  phrases={[
                    "100% Raw Cold-Pressed Orchard Fruit",
                    "Zero Added Sugar · Chilled at Crisp 4°C",
                    "Live Enzymes Preserved in Eco Aluminum",
                    "Faisal Juice · Pure Orchard Vitality Daily",
                  ]}
                  speed={38}
                  deleteSpeed={20}
                  pauseTime={2200}
                  className="text-white text-[11px] sm:text-xs font-semibold"
                  cursorColor="text-emerald-400"
                />
              </div>
            </div>
            {/* Main Swiper */}
            <Swiper
              loop={true}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              onSlideChange={handleSlideChange}
              speed={1800}
              modules={[Autoplay, Controller]}
              className="h-full"
              controller={{ control: secondSwiperRef.current }}
              onSwiper={(swiper) => {
                mainSwiperRef.current = swiper;
              }}
            >
              {[
                { title: "Pears", color: "hsl(79, 66%, 72%)" },
                { title: "Apple", color: "hsl(0, 100%, 85%)" },
                { title: "Exotic", color: "hsl(242, 66%, 85%)" },
              ].map((slide, index) => (
                <SwiperSlide
                  key={index}
                  className="home-data h-full"
                  style={{
                    backgroundColor: slide.color,
                    fontSize: "clamp(3.5rem, 14vw, 24rem)",
                  }}
                >
                  <h2 className="home-title font-semibold text-white absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 !z-[1000] select-none tracking-tight">
                    {slide.title}
                  </h2>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Second Swiper (Floating Fruit Splashes) */}
            <Swiper
              loop={true}
              direction="vertical"
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              speed={1800}
              modules={[Autoplay, Controller]}
              className="secondswiper !absolute !inset-0 pointer-events-none"
              controller={{ control: mainSwiperRef.current }}
              onSwiper={(swiper) => {
                secondSwiperRef.current = swiper;
              }}
            >
              {[
                { img: pears, color: "hsl(79, 66%, 72%)" },
                { img: apples, color: "hsl(0, 100%, 85%)" },
                { img: passion, color: "hsl(242, 66% 85%)" },
              ].map((slide, index) => (
                <SwiperSlide key={index} className="home-fruit">
                  <img
                    src={slide.img}
                    alt="Fresh Fruit"
                    className="home-fruit-img max-w-screen !absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Hero Scroll Button */}
            <a
              href="#orchard-fresh"
              className="absolute bottom-6 sm:bottom-10 left-[50%] -translate-x-[50%] z-[150]"
            >
              <button className="bg-white hover:bg-black hover:text-white transition-all duration-300 py-2.5 sm:py-3.5 px-6 sm:px-8 text-black font-semibold rounded-full shadow-2xl flex items-center gap-2 group cursor-pointer text-xs sm:text-base border border-black/5">
                <span>Scroll to Orchard Fresh</span>
                <span className="transform group-hover:translate-y-1 transition-transform">↓</span>
              </button>
            </a>
          </section>

          {/* Traveling 3D Can (GSAP Scroll-Triggered to Orchard Fresh Section) */}
          <div
            ref={scrollCanRef}
            onClick={(e) => handleFlyToCart(activeProduct, e)}
            title="Click can to fly into cart!"
            className="home-mockup can-mockup-target !z-20 cursor-pointer will-change-transform drop-shadow-[0_25px_45px_rgba(0,0,0,0.35)] hover:scale-105 transition-transform"
            style={{
              backgroundPosition: `${backgroundPosition}, center`,
              backgroundSize: "300% 100%, 100% 100%",
              backgroundRepeat: "no-repeat, no-repeat",
              backgroundBlendMode: "multiply",
              maskSize: "100% 100%",
              maskRepeat: "no-repeat",
              WebkitMaskSize: "100% 100%",
              WebkitMaskRepeat: "no-repeat",
            }}
          />

          {/* Orchard Fresh Showcase Section - Premium Animated Version */}
          <section
            id="orchard-fresh"
            ref={orchardSectionRef}
            className="relative py-16 sm:py-24 md:py-36 px-4 sm:px-12 overflow-hidden border-b border-neutral-100"
            style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #ffffff 40%, #f0fdf4 70%, #ecfdf5 100%)" }}
          >
            {/* === ANIMATED BACKGROUND LAYER === */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {/* Large ambient orb — juice color reactive */}
              <div
                className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full blur-[120px] pointer-events-none transition-colors duration-1000"
                style={{ backgroundColor: `${activeProduct.juiceColor}18` }}
              />
              {/* Secondary orb bottom right */}
              <div
                className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full blur-[90px] pointer-events-none transition-colors duration-1000"
                style={{ backgroundColor: `${activeProduct.juiceColor}10` }}
              />
              {/* Grid pattern overlay */}
              <div className="absolute inset-0 opacity-[0.03]"
                style={{ backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)", backgroundSize: "32px 32px" }}
              />
              {/* Floating fruit emojis */}
              <span className="absolute top-14 left-[8%] text-3xl opacity-25 animate-leaf-sway select-none">🍃</span>
              <span className="absolute top-24 right-[7%] text-2xl opacity-20 animate-float-slow select-none">🍏</span>
              <span className="absolute bottom-20 left-[5%] text-xl opacity-20 animate-float-delay select-none">🌿</span>
              <span className="absolute bottom-32 right-[9%] text-2xl opacity-25 animate-leaf-sway select-none">❄️</span>
              <span className="absolute top-1/2 right-[3%] text-lg opacity-15 animate-spark-jolt select-none">✨</span>
              <span className="absolute top-[30%] left-[2%] text-xl opacity-15 animate-float-slow select-none">💚</span>
              {/* Animated ring decorations */}
              <div className="absolute top-20 right-[15%] w-24 h-24 rounded-full border border-emerald-200/40 animate-ping-slow pointer-events-none" />
              <div className="absolute bottom-24 left-[12%] w-16 h-16 rounded-full border border-emerald-300/30 animate-ping-slow pointer-events-none" style={{ animationDelay: "1.5s" }} />
            </div>

            <div className="max-w-[1440px] mx-auto relative z-10">

              {/* ═══ SECTION HEADER — Animated Word Reveal ═══ */}
              <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
                {/* Live badge — Slides in from Left */}
                <SlideIn direction="left" isVisible={isOrchardVisible}>
                  <div className="inline-flex items-center gap-2.5 py-1.5 px-5 rounded-full bg-emerald-500/10 text-emerald-700 font-bold text-xs tracking-widest uppercase mb-5 shadow-sm border border-emerald-400/30 backdrop-blur-sm">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    Orchard Fresh — Cold Pressed
                  </div>
                </SlideIn>

                {/* Giant headline with slide-up animated words */}
                <h2 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-5 leading-[1.05]">
                  <SlideUpWords text="100% Organic" isVisible={isOrchardVisible} wordClassName="text-neutral-900" />
                  <br />
                  <span className="orchard-gradient-text inline-block">
                    <SlideUpWords text="Juice" isVisible={isOrchardVisible} delayOffset={180} />
                  </span>
                </h2>

                <SlideIn direction="bottom" delay={260} isVisible={isOrchardVisible}>
                  <p className="text-neutral-500 text-sm sm:text-lg lg:text-xl leading-relaxed max-w-xl mx-auto">
                    Zero artificial concentrates, zero fake flavours.{" "}
                    <span className="text-emerald-600 font-semibold">Just orchard-fresh</span> cold fruits.
                  </p>
                </SlideIn>

                {/* Animated divider */}
                <SlideIn direction="bottom" delay={380} isVisible={isOrchardVisible}>
                  <div className="mt-8 flex items-center justify-center gap-3">
                    <div className="h-px w-16 bg-gradient-to-r from-transparent to-emerald-400" />
                    <span className="text-emerald-500 text-sm font-bold tracking-widest uppercase">Nature&apos;s Best</span>
                    <div className="h-px w-16 bg-gradient-to-l from-transparent to-emerald-400" />
                  </div>
                </SlideIn>
              </div>

              {/* ═══ STAT COUNTERS ROW (Slide from Left, Bottom, Right) ═══ */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto mb-16 sm:mb-24">
                {[
                  { number: "0g", label: "Added Sugar", icon: "🌿", color: "emerald", dir: "left", delay: 100 },
                  { number: "4°C", label: "Cold-Pressed", icon: "❄️", color: "blue", dir: "bottom", delay: 200 },
                  { number: "100%", label: "Raw & Natural", icon: "🍏", color: "green", dir: "bottom", delay: 300 },
                  { number: "330ml", label: "Eco Aluminum", icon: "♻️", color: "teal", dir: "right", delay: 400 },
                ].map((stat, i) => (
                  <SlideIn key={i} direction={stat.dir} delay={stat.delay} isVisible={isOrchardVisible}>
                    <div className="orchard-stat-card group">
                      <span className="text-2xl mb-1 group-hover:scale-125 transition-transform duration-300 inline-block">{stat.icon}</span>
                      <div className="text-2xl sm:text-3xl font-black text-neutral-900 leading-none">{stat.number}</div>
                      <div className="text-[11px] text-neutral-500 font-semibold mt-1 uppercase tracking-wider">{stat.label}</div>
                    </div>
                  </SlideIn>
                ))}
              </div>

              {/* ═══ MAIN GRID: Feature Cards + Can Dock ═══ */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center max-w-6xl mx-auto">

                {/* DESKTOP ONLY: LEFT COLUMN — 2 premium feature cards */}
                <div className={`hidden lg:flex flex-col gap-5 order-2 lg:order-1 transition-all duration-700 ${isOrchardVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"}`} style={{ transitionDelay: "200ms" }}>
                  {/* Card: Pure Extraction */}
                  <div className="orchard-feature-card group">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-200 group-hover:scale-110 transition-transform duration-300">
                        <BsShieldCheck className="text-white text-lg" />
                      </div>
                      <div>
                        <h4 className="font-bold text-neutral-900 text-sm sm:text-base mb-1 flex items-center gap-2">
                          Pure Extraction
                          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">Certified</span>
                        </h4>
                        <p className="text-xs text-neutral-500 leading-relaxed">
                          Cold hydraulic pressed below <strong className="text-neutral-700">4°C</strong> — preserving live enzymes, antioxidants, and pure vibrant taste.
                        </p>
                      </div>
                    </div>
                    {/* Progress bar */}
                    <div className="mt-4 pt-3 border-t border-neutral-100">
                      <div className="flex justify-between text-[10px] text-neutral-400 font-semibold mb-1.5">
                        <span>Enzyme Preservation</span>
                        <span className="text-emerald-600">98%</span>
                      </div>
                      <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                        <div className={`h-full bg-gradient-to-r from-emerald-400 to-green-500 rounded-full transition-all duration-1000 ${isOrchardVisible ? "w-[98%]" : "w-0"}`} style={{ transitionDelay: "800ms" }} />
                      </div>
                    </div>
                  </div>

                  {/* Card: 0g Sugar */}
                  <div className="orchard-feature-card group">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-11 h-11 rounded-2xl bg-gradient-to-br from-lime-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-lime-200 group-hover:scale-110 transition-transform duration-300 text-lg">
                        🌿
                      </div>
                      <div>
                        <h4 className="font-bold text-neutral-900 text-sm sm:text-base mb-1 flex items-center gap-2">
                          0g Added Sugar
                          <span className="text-[10px] font-bold bg-lime-100 text-lime-700 px-2 py-0.5 rounded-full border border-lime-200">Guilt Free</span>
                        </h4>
                        <p className="text-xs text-neutral-500 leading-relaxed">
                          Naturally sweet from <strong className="text-neutral-700">vine-ripened orchard harvest</strong>. No syrups, no artificial sweetening.
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-neutral-100">
                      <div className="flex justify-between text-[10px] text-neutral-400 font-semibold mb-1.5">
                        <span>Natural Sweetness</span>
                        <span className="text-lime-600">100%</span>
                      </div>
                      <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                        <div className={`h-full bg-gradient-to-r from-lime-400 to-emerald-500 rounded-full transition-all duration-1000 ${isOrchardVisible ? "w-full" : "w-0"}`} style={{ transitionDelay: "1000ms" }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* CENTER — Can Dock Stage */}
                <div className="order-1 lg:order-2 flex flex-col items-center justify-center my-4 sm:my-6 lg:my-0 relative">
                  {/* Orbiting glow rings */}
                  <div
                    className="absolute inset-[-40px] sm:inset-[-60px] rounded-full pointer-events-none animate-orchard-aura"
                    style={{ background: `radial-gradient(circle, ${activeProduct.juiceColor}20 0%, transparent 70%)` }}
                  />
                  <div className="absolute inset-[-20px] sm:inset-[-30px] rounded-full border border-dashed border-emerald-300/40 animate-spin-very-slow pointer-events-none" />

                  {/* Can Dock */}
                  <div
                    ref={canTargetDockRef}
                    className="relative w-36 xs:w-44 sm:w-56 md:w-64 aspect-[45/83] flex items-center justify-center rounded-2xl sm:rounded-3xl"
                  >
                    <div className="absolute inset-0 rounded-2xl sm:rounded-3xl border-2 border-dashed border-emerald-400/40 animate-pulse pointer-events-none" />
                    <div
                      className="absolute -inset-4 sm:-inset-6 rounded-full blur-2xl pointer-events-none transition-colors duration-1000 animate-orchard-aura"
                      style={{ backgroundColor: `${activeProduct.juiceColor}25` }}
                    />
                    <div className="absolute -bottom-5 sm:-bottom-7 w-32 xs:w-40 sm:w-52 h-4 sm:h-5 bg-black/10 rounded-full blur-lg pointer-events-none" />

                    {/* Arrival guide cue */}
                    <div className="absolute -bottom-10 sm:-bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] sm:text-[11px] font-bold text-emerald-700 bg-white/95 backdrop-blur-sm px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full border border-emerald-300/70 shadow-lg flex items-center gap-2 pointer-events-none">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      <span>Docked & Ready to Sip</span>
                    </div>
                  </div>

                  {/* Flavor name pill below */}
                  <div className={`mt-14 sm:mt-16 px-5 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-500 ${isOrchardVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                    style={{ background: `${activeProduct.juiceColor}20`, color: activeProduct.juiceColor, border: `1px solid ${activeProduct.juiceColor}40` }}>
                    {activeProduct.name}
                  </div>
                </div>

                {/* DESKTOP ONLY: RIGHT COLUMN — 2 premium feature cards */}
                <div className={`hidden lg:flex flex-col gap-5 order-3 transition-all duration-700 ${isOrchardVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"}`} style={{ transitionDelay: "400ms" }}>
                  {/* Card: 100% Raw */}
                  <div className="orchard-feature-card group">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-11 h-11 rounded-2xl bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center shadow-lg shadow-green-200 group-hover:scale-110 transition-transform duration-300 text-lg">
                        🍏
                      </div>
                      <div>
                        <h4 className="font-bold text-neutral-900 text-sm sm:text-base mb-1 flex items-center gap-2">
                          100% Raw
                          <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full border border-green-200">Unpasteurized</span>
                        </h4>
                        <p className="text-xs text-neutral-500 leading-relaxed">
                          Never heat-treated or boiled. Bottled fresh into infinitely <strong className="text-neutral-700">recyclable chilled cans</strong>.
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-neutral-100">
                      <div className="flex justify-between text-[10px] text-neutral-400 font-semibold mb-1.5">
                        <span>Nutritional Integrity</span>
                        <span className="text-green-600">100%</span>
                      </div>
                      <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                        <div className={`h-full bg-gradient-to-r from-green-400 to-teal-500 rounded-full transition-all duration-1000 ${isOrchardVisible ? "w-full" : "w-0"}`} style={{ transitionDelay: "1200ms" }} />
                      </div>
                    </div>
                  </div>

                  {/* Card: Cold-Chain Chilled */}
                  <div className="orchard-feature-card group">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-11 h-11 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-200 group-hover:scale-110 transition-transform duration-300 text-lg">
                        ❄️
                      </div>
                      <div>
                        <h4 className="font-bold text-neutral-900 text-sm sm:text-base mb-1 flex items-center gap-2">
                          Cold-Chain Chilled
                          <span className="text-[10px] font-bold bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full border border-sky-200">-4°C</span>
                        </h4>
                        <p className="text-xs text-neutral-500 leading-relaxed">
                          Maintained at crisp <strong className="text-neutral-700">4°C all the way</strong> from tree harvest to your doorstep delivery.
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-neutral-100">
                      <div className="flex justify-between text-[10px] text-neutral-400 font-semibold mb-1.5">
                        <span>Cold Chain Reliability</span>
                        <span className="text-sky-600">99.6%</span>
                      </div>
                      <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                        <div className={`h-full bg-gradient-to-r from-sky-400 to-blue-500 rounded-full transition-all duration-1000 ${isOrchardVisible ? "w-[99.6%]" : "w-0"}`} style={{ transitionDelay: "1400ms" }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* ═══ MOBILE ONLY: SINGLE UNIFIED 4-IN-1 CARD (Zada Jagah Na Le) ═══ */}
                <div
                  className={`block lg:hidden order-2 w-full transition-all duration-700 ${isOrchardVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    }`}
                  style={{ transitionDelay: "200ms" }}
                >
                  <div className="bg-white/95 backdrop-blur-xl border border-emerald-200/70 shadow-xl rounded-2xl sm:rounded-3xl p-3.5 sm:p-5">
                    {/* Header bar of the single card */}
                    <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-neutral-100">
                      <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-xs sm:text-sm font-extrabold text-neutral-900 tracking-tight">
                          Orchard Purity Standards
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        4-in-1 Certified
                      </span>
                    </div>

                    {/* 4 Items fitted inside this 1 single card (2x2 Compact Grid) */}
                    <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5">
                      {/* 1. Pure Extraction */}
                      <div className="p-2.5 sm:p-3 rounded-xl bg-neutral-50/90 border border-neutral-100/90 flex flex-col justify-between hover:border-emerald-200 transition-colors">
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-white shadow-sm">
                              <BsShieldCheck className="text-sm" />
                            </div>
                            <span className="text-[8px] xs:text-[9px] font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full border border-emerald-200">
                              Certified
                            </span>
                          </div>
                          <h4 className="font-bold text-neutral-900 text-[11px] xs:text-xs leading-tight mb-1">
                            Pure Extraction
                          </h4>
                          <p className="text-[9px] xs:text-[10px] text-neutral-500 leading-snug line-clamp-2">
                            Cold hydraulic pressed below 4°C preserving live enzymes.
                          </p>
                        </div>
                        <div className="mt-2 pt-1.5 border-t border-neutral-200/60">
                          <div className="flex items-center justify-between text-[8px] xs:text-[9px] text-emerald-700 font-semibold mb-1">
                            <span>Enzymes</span>
                            <span>98%</span>
                          </div>
                          <div className="h-1 bg-neutral-200/80 rounded-full overflow-hidden">
                            <div className={`h-full bg-gradient-to-r from-emerald-400 to-green-500 rounded-full transition-all duration-1000 ${isOrchardVisible ? "w-[98%]" : "w-0"}`} />
                          </div>
                        </div>
                      </div>

                      {/* 2. 0g Added Sugar */}
                      <div className="p-2.5 sm:p-3 rounded-xl bg-neutral-50/90 border border-neutral-100/90 flex flex-col justify-between hover:border-lime-200 transition-colors">
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-lime-400 to-emerald-500 flex items-center justify-center text-sm shadow-sm">
                              🌿
                            </div>
                            <span className="text-[8px] xs:text-[9px] font-bold bg-lime-100 text-lime-700 px-1.5 py-0.5 rounded-full border border-lime-200">
                              Guilt Free
                            </span>
                          </div>
                          <h4 className="font-bold text-neutral-900 text-[11px] xs:text-xs leading-tight mb-1">
                            0g Added Sugar
                          </h4>
                          <p className="text-[9px] xs:text-[10px] text-neutral-500 leading-snug line-clamp-2">
                            Naturally sweet from vine-ripened orchard harvest.
                          </p>
                        </div>
                        <div className="mt-2 pt-1.5 border-t border-neutral-200/60">
                          <div className="flex items-center justify-between text-[8px] xs:text-[9px] text-lime-700 font-semibold mb-1">
                            <span>Sweetness</span>
                            <span>100%</span>
                          </div>
                          <div className="h-1 bg-neutral-200/80 rounded-full overflow-hidden">
                            <div className={`h-full bg-gradient-to-r from-lime-400 to-emerald-500 rounded-full transition-all duration-1000 ${isOrchardVisible ? "w-full" : "w-0"}`} />
                          </div>
                        </div>
                      </div>

                      {/* 3. 100% Raw */}
                      <div className="p-2.5 sm:p-3 rounded-xl bg-neutral-50/90 border border-neutral-100/90 flex flex-col justify-between hover:border-green-200 transition-colors">
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-sm shadow-sm">
                              🍏
                            </div>
                            <span className="text-[8px] xs:text-[9px] font-bold bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full border border-green-200">
                              Raw
                            </span>
                          </div>
                          <h4 className="font-bold text-neutral-900 text-[11px] xs:text-xs leading-tight mb-1">
                            100% Raw
                          </h4>
                          <p className="text-[9px] xs:text-[10px] text-neutral-500 leading-snug line-clamp-2">
                            Never heat-treated or boiled. Recyclable chilled cans.
                          </p>
                        </div>
                        <div className="mt-2 pt-1.5 border-t border-neutral-200/60">
                          <div className="flex items-center justify-between text-[8px] xs:text-[9px] text-green-700 font-semibold mb-1">
                            <span>Nutritional</span>
                            <span>100%</span>
                          </div>
                          <div className="h-1 bg-neutral-200/80 rounded-full overflow-hidden">
                            <div className={`h-full bg-gradient-to-r from-green-400 to-teal-500 rounded-full transition-all duration-1000 ${isOrchardVisible ? "w-full" : "w-0"}`} />
                          </div>
                        </div>
                      </div>

                      {/* 4. Cold-Chain Chilled */}
                      <div className="p-2.5 sm:p-3 rounded-xl bg-neutral-50/90 border border-neutral-100/90 flex flex-col justify-between hover:border-sky-200 transition-colors">
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-sm shadow-sm">
                              ❄️
                            </div>
                            <span className="text-[8px] xs:text-[9px] font-bold bg-sky-100 text-sky-700 px-1.5 py-0.5 rounded-full border border-sky-200">
                              -4°C
                            </span>
                          </div>
                          <h4 className="font-bold text-neutral-900 text-[11px] xs:text-xs leading-tight mb-1">
                            Cold-Chain Chilled
                          </h4>
                          <p className="text-[9px] xs:text-[10px] text-neutral-500 leading-snug line-clamp-2">
                            Maintained at crisp 4°C from tree to your doorstep.
                          </p>
                        </div>
                        <div className="mt-2 pt-1.5 border-t border-neutral-200/60">
                          <div className="flex items-center justify-between text-[8px] xs:text-[9px] text-sky-700 font-semibold mb-1">
                            <span>Cold Chain</span>
                            <span>99.6%</span>
                          </div>
                          <div className="h-1 bg-neutral-200/80 rounded-full overflow-hidden">
                            <div className={`h-full bg-gradient-to-r from-sky-400 to-blue-500 rounded-full transition-all duration-1000 ${isOrchardVisible ? "w-[99.6%]" : "w-0"}`} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ═══ BOTTOM MARQUEE TRUST STRIP ═══ */}
              <div className={`mt-16 sm:mt-24 pt-8 border-t border-neutral-200/60 transition-all duration-700 delay-500 ${isOrchardVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 max-w-5xl mx-auto">
                  {/* Animated tags */}
                  <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                    {["✓ Cold Hydraulic Pressed", "✓ 0g Added Sugar", "✓ 100% Raw Fruit", "✓ 330ml Eco Aluminum", "✓ Chilled 24/7"].map((tag, i) => (
                      <span
                        key={i}
                        className="orchard-tag-pill"
                        style={{ animationDelay: `${i * 80}ms` }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <a
                    href="#shop"
                    className="orchard-cta-btn group flex-shrink-0"
                  >
                    <span>Taste All 3 Cans</span>
                    <span className="group-hover:translate-x-1 transition-transform duration-200">
                      <BsArrowRight />
                    </span>
                  </a>
                </div>
              </div>

            </div>
          </section>
        </div>

        {/* 3 Cans Showcase Section with Fly-to-Cart Action */}
        <section id="shop" className="py-16 sm:py-24 md:py-28 px-4 sm:px-12 max-w-[1400px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
            <SlideIn direction="left" isVisible={isSectionVisible}>
              <span className="inline-block py-1 px-3.5 sm:px-4 rounded-full bg-emerald-100 text-emerald-800 font-medium text-[11px] sm:text-xs tracking-wider uppercase mb-3">
                100% Cold-Pressed Orchard Fruit
              </span>
            </SlideIn>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 mb-3 sm:mb-4">
              <SlideUpWords text="Click Any Can to Fly to Cart" isVisible={isSectionVisible} />
            </h2>
            <SlideIn direction="bottom" delay={200} isVisible={isSectionVisible}>
              <p className="text-neutral-600 text-sm sm:text-base md:text-lg mb-5 sm:mb-6">
                Click any can or &quot;Add to Cart&quot; button below — watch the can lift up in the air and fly straight into the navbar cart icon!
              </p>
            </SlideIn>

            {/* Interactive Cut Trigger */}
            <SlideIn direction="bottom" delay={300} isVisible={isSectionVisible}>
              <button
                onClick={triggerReSlice}
                className="inline-flex items-center gap-2 bg-black hover:bg-neutral-800 active:scale-95 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-semibold shadow-md transition-all cursor-pointer"
              >
                <span>⚡ Re-Slice Fruit Juices</span>
              </button>
            </SlideIn>
          </div>

          {/* 3 Can Cards */}
          <div id="flavours" className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {products.map((item, index) => (
              <div
                key={item.id}
                className={`can-product-card group relative rounded-2xl sm:rounded-3xl p-5 sm:p-7 transition-all duration-700 border border-black/5 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-2xl ${isSectionVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
                  } ${activeCut ? "is-cut" : ""}`}
                style={{
                  backgroundColor: item.cardColor,
                  transitionDelay: `${index * 180}ms`,
                }}
              >
                {/* Top Card Info */}
                <div className="relative z-20 flex justify-between items-start mb-2">
                  <span
                    className={`text-xs font-semibold px-3 sm:px-3.5 py-1 rounded-full shadow-sm ${item.badgeColor}`}
                  >
                    {item.tagline}
                  </span>
                  <button
                    onClick={() => toggleLike(item.id)}
                    className="p-2 rounded-full bg-white/80 hover:bg-white text-neutral-700 transition-colors cursor-pointer shadow-sm"
                    aria-label="Wishlist"
                  >
                    {likedItems[item.id] ? (
                      <BsHeartFill className="text-red-500" />
                    ) : (
                      <BsHeart />
                    )}
                  </button>
                </div>

                {/* Center Showcase: Sliced Fruit + Can Stage (Clickable for Fly-to-Cart) */}
                <div
                  onClick={(e) => handleFlyToCart(item, e)}
                  title="Click to fly into cart!"
                  className="relative z-10 py-8 sm:py-12 flex items-center justify-center my-2 cursor-pointer group/can"
                >
                  <div className="relative w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center">
                    {/* Laser Slash Beam */}
                    <div className="slash-beam" />

                    {/* Fruit Top Slice */}
                    <img
                      src={item.fruitImg}
                      alt={`${item.name} Cut Top`}
                      className="absolute inset-0 w-full h-full object-contain pointer-events-none fruit-slice-top drop-shadow-md select-none"
                    />

                    {/* Fruit Bottom Slice */}
                    <img
                      src={item.fruitImg}
                      alt={`${item.name} Cut Bottom`}
                      className="absolute inset-0 w-full h-full object-contain pointer-events-none fruit-slice-bottom drop-shadow-md select-none"
                    />

                    {/* Juice Burst Droplets */}
                    <div
                      className="absolute w-3.5 h-3.5 rounded-full droplet-1 shadow-md pointer-events-none"
                      style={{ backgroundColor: item.juiceColor }}
                    />
                    <div
                      className="absolute w-4 h-4 rounded-full droplet-2 shadow-md pointer-events-none"
                      style={{ backgroundColor: item.juiceColor }}
                    />
                    <div
                      className="absolute w-2.5 h-2.5 rounded-full droplet-3 shadow-md pointer-events-none"
                      style={{ backgroundColor: item.juiceColor }}
                    />
                    <div
                      className="absolute w-3 h-3 rounded-full droplet-4 shadow-md pointer-events-none"
                      style={{ backgroundColor: item.juiceColor }}
                    />

                    {/* Liquid Ripple Ring under Can */}
                    <div className="liquid-ripple" />

                    {/* Center 3D Can Mockup (Fly Target) */}
                    <div className="can-stage relative z-20">
                      <div
                        className="can-mockup-target w-20 sm:w-26 md:w-28 aspect-[45/83] drop-shadow-2xl transition-transform duration-300 group-hover/can:scale-115 group-hover/can:rotate-6"
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
                          maskRepeat: "no-repeat",
                          WebkitMaskRepeat: "no-repeat",
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Bottom Card Content */}
                <div className="relative z-20 bg-white/95 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-5 mt-2 shadow-sm border border-white/70">
                  <div className="flex items-center gap-1 text-amber-500 text-xs mb-1">
                    <BsStarFill />
                    <span className="font-bold text-neutral-800 ml-1">{item.rating}</span>
                    <span className="text-neutral-400">({item.reviews} reviews)</span>
                  </div>

                  <h3 className="font-bold text-lg sm:text-xl text-neutral-900 mb-1">{item.name}</h3>
                  <p className="text-xs text-neutral-600 mb-3 sm:mb-4 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Specs */}
                  <div className="flex gap-2 mb-3 sm:mb-4">
                    <span className="text-[10px] sm:text-[11px] font-medium bg-neutral-100 text-neutral-700 px-2 sm:px-2.5 py-1 rounded-md">
                      {item.volume}
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-medium bg-neutral-100 text-neutral-700 px-2 sm:px-2.5 py-1 rounded-md">
                      {item.calories}
                    </span>
                  </div>

                  {/* Price & Action Button (Triggers Fly-to-Cart) */}
                  <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                    <div>
                      <span className="text-xl sm:text-2xl font-black text-neutral-900">${item.price}</span>
                      <span className="text-xs text-neutral-400 line-through ml-1.5 sm:ml-2">
                        ${item.originalPrice}
                      </span>
                    </div>

                    <button
                      onClick={(e) => handleFlyToCart(item, e)}
                      className="bg-black hover:bg-neutral-800 active:scale-95 text-white font-medium text-xs px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl flex items-center gap-1.5 sm:gap-2 transition-all cursor-pointer shadow-md group/btn"
                    >
                      <BsCart size={14} className="group-hover/btn:scale-125 transition-transform" />
                      <span>Add to Cart</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits Section with Custom Animations & Driving Truck */}
        <section id="benefits" className="py-16 sm:py-24 bg-white border-y border-neutral-100 px-4 sm:px-12 overflow-hidden">
          <div className="max-w-[1400px] mx-auto">
            <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
              <SlideIn direction="left" isVisible={isBenefitsVisible}>
                <span className="inline-block py-1 px-3.5 sm:px-4 rounded-full bg-emerald-100 text-emerald-800 font-medium text-[11px] sm:text-xs tracking-wider uppercase mb-3">
                  Crafted For Good Health
                </span>
              </SlideIn>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-900 mb-3 sm:mb-4">
                <SlideUpWords text="Pure Goodness, Zero Compromise" isVisible={isBenefitsVisible} />
              </h2>
              <SlideIn direction="bottom" delay={200} isVisible={isBenefitsVisible}>
                <p className="text-neutral-600 text-sm sm:text-base md:text-lg">
                  Engineered with cold-pressed natural extraction, sustainable aluminum packaging, and express temperature-safe delivery.
                </p>
              </SlideIn>
            </div>

            {/* Interactive 3D Cold Extraction Showcase with 4 Responsive Health Pillars */}
            <CraftPurityShowcase isVisible={isBenefitsVisible} />
          </div>
        </section>

        {/* ════════════════════════════════════════════════════
            🧑‍🤝‍🧑 SOCIAL PROOF — Real Stories & Verified Reviews
            ════════════════════════════════════════════════════ */}
        <section id="social-proof" className="py-16 sm:py-24 px-4 sm:px-12 max-w-[1400px] mx-auto overflow-hidden">
          {/* Section header */}
          <div className="text-center mb-10 sm:mb-14">
            <SlideIn direction="left" isVisible={isSocialVisible}>
              <span className="inline-block py-1 px-4 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px] tracking-widest uppercase mb-3">
                Real Stories · 100% Raw Sips
              </span>
            </SlideIn>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-neutral-900 mb-3">
              <SlideUpWords text="They Can't Stop" isVisible={isSocialVisible} />{" "}
              <span className="text-emerald-500 inline-block">
                <SlideUpWords text="Sipping 🧃" isVisible={isSocialVisible} delayOffset={140} />
              </span>
            </h2>
            <SlideIn direction="bottom" delay={220} isVisible={isSocialVisible}>
              <p className="text-neutral-500 text-sm sm:text-base max-w-lg mx-auto">
                Real people, genuine daily energy. Cold-pressed directly from the orchard into your lifestyle.
              </p>
            </SlideIn>
          </div>

          {/* ═══ DESKTOP ONLY: Two Large Professional Lifestyle Customer Cards ═══ */}
          <div className="hidden lg:grid grid-cols-2 gap-8 sm:gap-10 max-w-5xl mx-auto">

            {/* ── CARD 1: AHMED R. (Wild Pear Sparkle) — Slides from Left ── */}
            <SlideIn direction="left" delay={150} isVisible={isSocialVisible}>
              <div className="relative bg-white/95 rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-[0_10px_40px_rgba(16,185,129,0.08)] hover:shadow-[0_20px_50px_rgba(16,185,129,0.15)] transition-all duration-700 flex flex-col justify-between overflow-hidden group h-full">
                {/* Top Accent Gradient Bar */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-300" />

                {/* Main Card Content */}
                <div>
                  {/* 5 Stars Rating */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-1 text-amber-400 text-base">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="drop-shadow-sm">★</span>
                      ))}
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-3 py-1 rounded-full">
                      5.0 / 5.0 Rating
                    </span>
                  </div>

                  {/* Customer Quote */}
                  <div className="relative mb-6">
                    <span className="text-4xl sm:text-5xl text-emerald-200/80 font-serif absolute -top-5 -left-2 select-none pointer-events-none">“</span>
                    <p className="relative z-10 text-neutral-700 text-base sm:text-lg font-medium leading-relaxed pl-4 border-l-2 border-emerald-400">
                      &ldquo;Yaar, is se better koi juice nahi! Wild Pear Sparkle pehli sip mein hi dil jeet leti hai. Ek baar try karo, hum kasam khate hain — <strong className="text-emerald-700 font-extrabold">addict ho jao ge!</strong>&rdquo;
                    </p>
                  </div>
                </div>

                {/* Customer Profile + Large Real Portrait */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 pt-6 border-t border-neutral-100">
                  {/* Large Human Portrait + Info */}
                  <div className="flex items-center gap-4">
                    <div className="relative flex-shrink-0">
                      <img
                        src={ahmedImg}
                        alt="Ahmed R."
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-emerald-400 shadow-lg group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* Live Online Dot */}
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
                    </div>
                    <div>
                      <h4 className="font-black text-lg text-neutral-900 leading-tight">Ahmed R.</h4>
                      <p className="text-xs font-semibold text-neutral-500 mt-0.5">Lahore, Pakistan</p>
                      <span className="inline-block mt-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-full">
                        ✓ Verified Buyer · 23 orders
                      </span>
                    </div>
                  </div>

                  {/* Product Badge with Mini 3D Can */}
                  <div className="flex items-center gap-2.5 bg-neutral-50 border border-neutral-200/70 px-3.5 py-2 rounded-2xl flex-shrink-0">
                    <div
                      className="w-5 aspect-[45/83] drop-shadow-md rounded-[2px]"
                      style={{
                        backgroundImage: `url(${labels}), url(${can})`,
                        maskImage: `url(${can})`,
                        WebkitMaskImage: `url(${can})`,
                        backgroundPosition: "0% center, center",
                        backgroundSize: "300% 100%, 100% 100%",
                        backgroundBlendMode: "multiply",
                        maskSize: "100% 100%",
                        WebkitMaskSize: "100% 100%",
                      }}
                    />
                    <div>
                      <p className="text-[10px] font-bold uppercase text-neutral-400 tracking-wider">Favorite</p>
                      <p className="text-xs font-black text-emerald-800">Wild Pear</p>
                    </div>
                  </div>
                </div>
              </div>
            </SlideIn>

            {/* ── CARD 2: SARA K. (Crimson Apple Burst) — Slides from Right ── */}
            <SlideIn direction="right" delay={250} isVisible={isSocialVisible}>
              <div className="relative bg-white/95 rounded-3xl p-6 sm:p-8 border border-red-100 shadow-[0_10px_40px_rgba(239,68,68,0.08)] hover:shadow-[0_20px_50px_rgba(239,68,68,0.15)] transition-all duration-700 flex flex-col justify-between overflow-hidden group h-full">
                {/* Top Accent Gradient Bar */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-400 via-rose-500 to-red-300" />

                {/* Main Card Content */}
                <div>
                  {/* 5 Stars Rating */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-1 text-amber-400 text-base">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="drop-shadow-sm">★</span>
                      ))}
                    </div>
                    <span className="text-xs font-bold text-red-700 bg-red-50 border border-red-200/60 px-3 py-1 rounded-full">
                      5.0 / 5.0 Rating
                    </span>
                  </div>

                  {/* Customer Quote */}
                  <div className="relative mb-6">
                    <span className="text-4xl sm:text-5xl text-red-200/80 font-serif absolute -top-5 -left-2 select-none pointer-events-none">“</span>
                    <p className="relative z-10 text-neutral-700 text-base sm:text-lg font-medium leading-relaxed pl-4 border-l-2 border-red-400">
                      &ldquo;Zindagi mein pehli baar koi juice aisa mila jo genuinely tasty hai bina sugar ke. Crimson Apple Burst mera daily must-have hai — <strong className="text-red-600 font-extrabold">bilkul try karo!</strong>&rdquo;
                    </p>
                  </div>
                </div>

                {/* Customer Profile + Large Real Portrait */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 pt-6 border-t border-neutral-100">
                  {/* Large Human Portrait + Info */}
                  <div className="flex items-center gap-4">
                    <div className="relative flex-shrink-0">
                      <img
                        src={saraImg}
                        alt="Sara K."
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-red-400 shadow-lg group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* Live Online Dot */}
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full" />
                    </div>
                    <div>
                      <h4 className="font-black text-lg text-neutral-900 leading-tight">Sara K.</h4>
                      <p className="text-xs font-semibold text-neutral-500 mt-0.5">Karachi, Pakistan</p>
                      <span className="inline-block mt-1 text-[11px] font-bold text-red-700 bg-red-100/70 px-2.5 py-0.5 rounded-full">
                        ✓ Verified Buyer · 41 orders
                      </span>
                    </div>
                  </div>

                  {/* Product Badge with Mini 3D Can */}
                  <div className="flex items-center gap-2.5 bg-neutral-50 border border-neutral-200/70 px-3.5 py-2 rounded-2xl flex-shrink-0">
                    <div
                      className="w-5 aspect-[45/83] drop-shadow-md rounded-[2px]"
                      style={{
                        backgroundImage: `url(${labels}), url(${can})`,
                        maskImage: `url(${can})`,
                        WebkitMaskImage: `url(${can})`,
                        backgroundPosition: "50% center, center",
                        backgroundSize: "300% 100%, 100% 100%",
                        backgroundBlendMode: "multiply",
                        maskSize: "100% 100%",
                        WebkitMaskSize: "100% 100%",
                      }}
                    />
                    <div>
                      <p className="text-[10px] font-bold uppercase text-neutral-400 tracking-wider">Favorite</p>
                      <p className="text-xs font-black text-red-700">Crimson Apple</p>
                    </div>
                  </div>
                </div>
              </div>
            </SlideIn>

          </div>

          {/* ═══ MOBILE ONLY: SINGLE UNIFIED REVIEW & STATS CARD (Ik Hi Jagah) ═══ */}
          <div className="block lg:hidden max-w-md mx-auto w-full">
            <div className="relative bg-white/95 rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-emerald-100 shadow-xl overflow-hidden">
              {/* Top Accent Gradient Bar */}
              <div
                className={`absolute top-0 left-0 right-0 h-1.5 transition-colors duration-500 ${
                  mobileReviewIndex === 0
                    ? "bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-300"
                    : "bg-gradient-to-r from-red-400 via-rose-500 to-red-300"
                }`}
              />

              {/* Mobile Switcher Tabs */}
              <div className="flex items-center gap-1.5 p-1 bg-neutral-100/90 rounded-xl mb-3.5 border border-neutral-200/60">
                <button
                  onClick={() => setMobileReviewIndex(0)}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    mobileReviewIndex === 0
                      ? "bg-white text-emerald-800 shadow-sm"
                      : "text-neutral-500 hover:text-neutral-800"
                  }`}
                >
                  <span>🍐</span>
                  <span>Ahmed R.</span>
                  <span className="text-[9px] opacity-70 hidden min-[360px]:inline">(Wild Pear)</span>
                </button>
                <button
                  onClick={() => setMobileReviewIndex(1)}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    mobileReviewIndex === 1
                      ? "bg-white text-red-800 shadow-sm"
                      : "text-neutral-500 hover:text-neutral-800"
                  }`}
                >
                  <span>🍎</span>
                  <span>Sara K.</span>
                  <span className="text-[9px] opacity-70 hidden min-[360px]:inline">(Crimson Apple)</span>
                </button>
              </div>

              {/* Active Review Content */}
              {mobileReviewIndex === 0 ? (
                <div className="animate-in fade-in duration-300">
                  {/* Rating Bar */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-0.5 text-amber-400 text-sm">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full">
                      5.0 / 5.0 Rating
                    </span>
                  </div>

                  {/* Quote */}
                  <p className="text-neutral-700 text-xs sm:text-sm font-medium leading-relaxed pl-3 border-l-2 border-emerald-400 mb-4">
                    &ldquo;Yaar, is se better koi juice nahi! Wild Pear Sparkle pehli sip mein hi dil jeet leti hai. Ek baar try karo, hum kasam khate hain — <strong className="text-emerald-700 font-extrabold">addict ho jao ge!</strong>&rdquo;
                  </p>

                  {/* Profile & Product Tag */}
                  <div className="flex items-center justify-between gap-3 pt-3 border-t border-neutral-100">
                    <div className="flex items-center gap-2.5">
                      <div className="relative flex-shrink-0">
                        <img
                          src={ahmedImg}
                          alt="Ahmed"
                          className="w-11 h-11 rounded-xl object-cover border-2 border-emerald-400 shadow-sm"
                        />
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                      </div>
                      <div>
                        <h4 className="font-black text-xs sm:text-sm text-neutral-900 leading-tight">Ahmed R.</h4>
                        <p className="text-[10px] font-semibold text-neutral-500">Lahore, Pakistan</p>
                        <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.2 rounded-full inline-block mt-0.5">
                          ✓ Verified · 23 orders
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 bg-neutral-50 border border-neutral-200/70 px-2 py-1 rounded-xl flex-shrink-0">
                      <div
                        className="w-3.5 aspect-[45/83] drop-shadow-sm rounded-[1px]"
                        style={{
                          backgroundImage: `url(${labels}), url(${can})`,
                          maskImage: `url(${can})`,
                          WebkitMaskImage: `url(${can})`,
                          backgroundPosition: "0% center, center",
                          backgroundSize: "300% 100%, 100% 100%",
                          backgroundBlendMode: "multiply",
                          maskSize: "100% 100%",
                          WebkitMaskSize: "100% 100%",
                        }}
                      />
                      <div className="text-left">
                        <p className="text-[8px] font-bold uppercase text-neutral-400 leading-none">Fav</p>
                        <p className="text-[10px] font-black text-emerald-800 leading-tight">Wild Pear</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="animate-in fade-in duration-300">
                  {/* Rating Bar */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-0.5 text-amber-400 text-sm">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-red-700 bg-red-50 border border-red-200/60 px-2 py-0.5 rounded-full">
                      5.0 / 5.0 Rating
                    </span>
                  </div>

                  {/* Quote */}
                  <p className="text-neutral-700 text-xs sm:text-sm font-medium leading-relaxed pl-3 border-l-2 border-red-400 mb-4">
                    &ldquo;Zindagi mein pehli baar koi juice aisa mila jo genuinely tasty hai bina sugar ke. Crimson Apple Burst mera daily must-have hai — <strong className="text-red-600 font-extrabold">bilkul try karo!</strong>&rdquo;
                  </p>

                  {/* Profile & Product Tag */}
                  <div className="flex items-center justify-between gap-3 pt-3 border-t border-neutral-100">
                    <div className="flex items-center gap-2.5">
                      <div className="relative flex-shrink-0">
                        <img
                          src={saraImg}
                          alt="Sara"
                          className="w-11 h-11 rounded-xl object-cover border-2 border-red-400 shadow-sm"
                        />
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-red-500 border-2 border-white rounded-full" />
                      </div>
                      <div>
                        <h4 className="font-black text-xs sm:text-sm text-neutral-900 leading-tight">Sara K.</h4>
                        <p className="text-[10px] font-semibold text-neutral-500">Karachi, Pakistan</p>
                        <span className="text-[9px] font-bold text-red-700 bg-red-100/70 px-1.5 py-0.2 rounded-full inline-block mt-0.5">
                          ✓ Verified · 41 orders
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 bg-neutral-50 border border-neutral-200/70 px-2 py-1 rounded-xl flex-shrink-0">
                      <div
                        className="w-3.5 aspect-[45/83] drop-shadow-sm rounded-[1px]"
                        style={{
                          backgroundImage: `url(${labels}), url(${can})`,
                          maskImage: `url(${can})`,
                          WebkitMaskImage: `url(${can})`,
                          backgroundPosition: "50% center, center",
                          backgroundSize: "300% 100%, 100% 100%",
                          backgroundBlendMode: "multiply",
                          maskSize: "100% 100%",
                          WebkitMaskSize: "100% 100%",
                        }}
                      />
                      <div className="text-left">
                        <p className="text-[8px] font-bold uppercase text-neutral-400 leading-none">Fav</p>
                        <p className="text-[10px] font-black text-red-700 leading-tight">Crimson Apple</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ═══ 3 PROOF NUMBERS EMBEDDED DIRECTLY IN THIS SINGLE MOBILE CARD ═══ */}
              <div className="mt-4 pt-3.5 border-t border-neutral-100 grid grid-cols-3 gap-2 text-center">
                <div className="bg-neutral-50/80 rounded-xl p-2 border border-neutral-100">
                  <div className="text-sm">😊</div>
                  <div className="font-black text-xs text-neutral-900 mt-0.5">12,400+</div>
                  <div className="text-[8px] text-neutral-500 font-medium">Happy Sippers</div>
                </div>
                <div className="bg-neutral-50/80 rounded-xl p-2 border border-neutral-100">
                  <div className="text-sm">⭐</div>
                  <div className="font-black text-xs text-neutral-900 mt-0.5">4.9★</div>
                  <div className="text-[8px] text-neutral-500 font-medium">Avg Rating</div>
                </div>
                <div className="bg-neutral-50/80 rounded-xl p-2 border border-neutral-100">
                  <div className="text-sm">🫶</div>
                  <div className="font-black text-xs text-neutral-900 mt-0.5">98%</div>
                  <div className="text-[8px] text-neutral-500 font-medium">Recommend</div>
                </div>
              </div>
            </div>
          </div>

          {/* ═══ DESKTOP ONLY: Bottom social proof numbers ═══ */}
          <div className={`hidden lg:grid mt-14 sm:mt-20 grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto text-center transition-all duration-700 delay-500 ${isSocialVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            {[
              { num: "12,400+", label: "Happy Sippers", icon: "😊" },
              { num: "4.9★", label: "Average Rating", icon: "⭐" },
              { num: "98%", label: "Would Recommend", icon: "🫶" },
            ].map((s, i) => (
              <div key={i} className="social-stat">
                <div className="text-2xl sm:text-3xl mb-1">{s.icon}</div>
                <div className="font-black text-xl sm:text-2xl text-neutral-900">{s.num}</div>
                <div className="text-neutral-500 text-xs font-medium mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Newsletter / Offer Banner */}
        <section className="py-12 sm:py-20 px-4 sm:px-12 max-w-[1400px] mx-auto">
          <div className="bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 text-white rounded-2xl sm:rounded-3xl p-6 sm:p-14 relative overflow-hidden shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
            <div className="max-w-xl relative z-10 text-center md:text-left">
              <span className="text-emerald-400 font-semibold text-xs uppercase tracking-widest">
                Exclusive Subscriber Offer
              </span>
              <h3 className="text-2xl sm:text-4xl font-bold mt-2 mb-3">
                Get 20% Off Your First Can Box
              </h3>
              <p className="text-neutral-400 text-xs sm:text-base">
                Join our newsletter to receive seasonal flavors, limited batch launches, and member-only discounts.
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="w-full md:w-auto relative z-10 flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Enter your email"
                required
                className="bg-white/10 border border-white/20 rounded-full px-5 py-3 text-sm text-white placeholder-neutral-400 outline-none focus:ring-2 focus:ring-emerald-400 w-full sm:min-w-[260px]"
              />
              <button
                type="submit"
                className="bg-white text-black font-semibold text-sm px-6 py-3 rounded-full hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg w-full sm:w-auto"
              >
                <span>{isSubscribed ? "Subscribed!" : "Subscribe"}</span>
                <FiSend size={15} />
              </button>
            </form>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="contact" className="bg-[#111317] text-white pt-0 pb-8 border-t border-white/10 relative overflow-hidden">
        {/* Kinetic Animated Marquee Ticker */}
        <div className="border-b border-white/10 bg-black/40 py-3 overflow-hidden select-none">
          <div className="animate-marquee-left flex items-center gap-8 whitespace-nowrap text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase">
            <span>⚡ 100% ORCHARD RAW</span>
            <span className="text-white/40">★</span>
            <span>0G ADDED SUGAR</span>
            <span className="text-white/40">★</span>
            <span>COLD PRESSED BELOW 4°C</span>
            <span className="text-white/40">★</span>
            <span>INFINITE RECYCLABLE ALUMINUM</span>
            <span className="text-white/40">★</span>
            <span>FAISAL JUICE COLD-CHAIN DISPATCH</span>
            <span className="text-white/40">★</span>
            <span>ZERO BOILING ZERO CHEMICALS</span>
            <span className="text-white/40">★</span>
            <span>⚡ 100% ORCHARD RAW</span>
            <span className="text-white/40">★</span>
            <span>0G ADDED SUGAR</span>
            <span className="text-white/40">★</span>
            <span>COLD PRESSED BELOW 4°C</span>
            <span className="text-white/40">★</span>
            <span>INFINITE RECYCLABLE ALUMINUM</span>
            <span className="text-white/40">★</span>
            <span>FAISAL JUICE COLD-CHAIN DISPATCH</span>
            <span className="text-white/40">★</span>
            <span>ZERO BOILING ZERO CHEMICALS</span>
            <span className="text-white/40">★</span>
          </div>
        </div>

        {/* Live Chilled Cold Chain Fleet Status Radar */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-12 pt-6 pb-6">
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block">
                  Cold-Chain Status Radar
                </span>
                <span className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                  Live Dispatch Facility Operational
                  <span className="text-emerald-400 text-xs font-mono">• Sub-Zero 4°C Active</span>
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono text-neutral-400">
              <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-xl border border-white/5">
                <span className="text-emerald-400">⚡</span>
                <span>Fleet Temp: <strong className="text-white">-4.2°C</strong></span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-xl border border-white/5">
                <span className="text-emerald-400">📦</span>
                <span>Live Orders: <strong className="text-white">Active Dispatch</strong></span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 sm:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 pb-10 sm:pb-12 border-b border-white/10">
            {/* Brand column */}
            <div className="md:col-span-1">
              <h2 className="text-3xl font-extrabold tracking-tight mb-3">
                Faisal Juice<span className="text-emerald-400">.</span>
              </h2>
              <p className="text-neutral-400 text-sm leading-relaxed mb-4">
                Redefining the beverage experience with 100% natural cold-pressed fruits, playful animations, and eco-conscious aluminum packaging.
              </p>
              <div className="flex gap-2">
                <span className="w-3 h-3 rounded-full bg-[#8fcb39]" title="Pear"></span>
                <span className="w-3 h-3 rounded-full bg-[#ff4d4d]" title="Apple"></span>
                <span className="w-3 h-3 rounded-full bg-[#8e44ad]" title="Passion Fruit"></span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-neutral-300 mb-4">
                Navigation
              </h4>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Home Slider
                  </a>
                </li>
                <li>
                  <a href="#flavours" className="hover:text-white transition-colors">
                    Fruit Flavours
                  </a>
                </li>
                <li>
                  <a href="#shop" className="hover:text-white transition-colors">
                    Can Pricing
                  </a>
                </li>
                <li>
                  <a href="#benefits" className="hover:text-white transition-colors">
                    Why Faisal Juice
                  </a>
                </li>
              </ul>
            </div>

            {/* Can Flavours */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-neutral-300 mb-4">
                Our Cans
              </h4>
              <ul className="space-y-2 text-sm text-neutral-400">
                <li>
                  <a href="#shop" className="hover:text-white transition-colors">
                    Wild Pear ($3.99)
                  </a>
                </li>
                <li>
                  <a href="#shop" className="hover:text-white transition-colors">
                    Crisp Apple ($4.49)
                  </a>
                </li>
                <li>
                  <a href="#shop" className="hover:text-white transition-colors">
                    Exotic Passion ($4.99)
                  </a>
                </li>
                <li>
                  <a href="#shop" className="hover:text-white transition-colors">
                    Custom Flavor Mix Pack
                  </a>
                </li>
              </ul>
            </div>

            {/* Location & Contact Info */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-neutral-300 mb-4">
                Store & Support
              </h4>
              <p className="text-sm text-neutral-400 leading-relaxed mb-2">
                📍 Orchard Boulevard, Suite 400
                <br />
                Mon - Sat: 9:00 AM - 8:00 PM
              </p>
              <p className="text-sm text-neutral-400">✉️ support@faisaljuice.local</p>
            </div>
          </div>

          {/* Bottom Bar with User Requested Credit & GitHub Collaborate */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
            <p>© {new Date().getFullYear()} Faisal Juice Inc. All rights reserved.</p>

            <div className="flex flex-wrap items-center gap-3">
              {/* GitHub Collaboration Link */}
              <a
                href="https://github.com/faisalsikandarali/faisal_juice"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold px-4 py-2 rounded-full shadow-lg shadow-emerald-950/40 hover:scale-105 active:scale-95 transition-all text-xs border border-emerald-400/30"
              >
                <BsGithub className="text-sm" />
                <span>Collaborate on GitHub</span>
              </a>

              {/* Requested Credit Section */}
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-neutral-300 hover:border-emerald-400/50 transition-colors">
                <span>Built by</span>
                <strong className="text-white font-semibold tracking-wide">Faisal Sikandar</strong>
                <span className="text-emerald-400 font-bold">•</span>
                <span className="text-neutral-300">Ali Bootcamp</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
