import { useState, useEffect, useRef, useCallback } from "react";

/* ─── DESIGN TOKENS ─────────────────────────────────────── */
const C = {
  night:   "#0A1628",
  nightM:  "#111E33",
  nightL:  "#1A2B45",
  gold:    "#C9A84C",
  goldL:   "#E2C97E",
  goldD:   "#A07830",
  white:   "#FFFFFF",
  ivory:   "#F7F4EE",
  ivoryD:  "#EDE8DE",
  slate:   "#5A6B82",
  slateL:  "#8A9BB5",
  slateXL: "#B8C5D6",
  glass:   "rgba(10,22,40,0.82)",
};

/* ─── GLOBAL STYLES ─────────────────────────────────────── */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Montserrat:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: ${C.night}; color: ${C.white}; font-family: 'Montserrat', sans-serif; overflow-x: hidden; }
  input, textarea, select { font-family: 'Montserrat', sans-serif; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: ${C.night}; }
  ::-webkit-scrollbar-thumb { background: ${C.gold}; border-radius: 2px; }

  @keyframes fadeUp   { from { opacity:0; transform:translateY(48px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
  @keyframes shimmer  { 0%,100% { opacity:0.5; } 50% { opacity:1; } }
  @keyframes pulse    { 0%,100% { transform:scale(1); } 50% { transform:scale(1.04); } }
  @keyframes slideDown{ from { opacity:0; transform:translateY(-12px); } to { opacity:1; transform:translateY(0); } }
  @keyframes spin     { to { transform:rotate(360deg); } }

  /* NAV */
  .nav-desktop { display: flex; }
  .burger { display: none !important; }
  @media (max-width: 900px) {
    .nav-desktop { display: none !important; }
    .burger { display: flex !important; }
  }

  /* GRIDS */
  .rooms-grid    { grid-template-columns: repeat(2,1fr) !important; }
  .menu-grid     { grid-template-columns: repeat(3,1fr) !important; }
  .services-grid { grid-template-columns: repeat(3,1fr) !important; }
  .gallery-grid  { grid-template-columns: repeat(3,1fr) !important; }
  .contact-grid  { grid-template-columns: 1fr 1fr !important; }
  .about-grid    { grid-template-columns: 1fr 1fr !important; }
  .footer-grid   { grid-template-columns: 1.4fr 1fr 1fr 1fr !important; }
  .test-grid     { grid-template-columns: repeat(2,1fr) !important; }
  .hero-h1       { font-size: 90px !important; }
  .booking-grid  { grid-template-columns: repeat(4,1fr) 1fr !important; }

  @media (max-width: 1100px) {
    .footer-grid   { grid-template-columns: 1fr 1fr !important; }
    .booking-grid  { grid-template-columns: repeat(2,1fr) !important; }
  }
  @media (max-width: 900px) {
    .rooms-grid    { grid-template-columns: 1fr !important; }
    .services-grid { grid-template-columns: repeat(2,1fr) !important; }
    .gallery-grid  { grid-template-columns: repeat(2,1fr) !important; }
    .contact-grid  { grid-template-columns: 1fr !important; }
    .about-grid    { grid-template-columns: 1fr !important; }
    .test-grid     { grid-template-columns: 1fr !important; }
    .hero-h1       { font-size: 56px !important; }
    .booking-grid  { grid-template-columns: 1fr 1fr !important; }
  }
  @media (max-width: 600px) {
    .menu-grid     { grid-template-columns: 1fr !important; }
    .services-grid { grid-template-columns: 1fr !important; }
    .gallery-grid  { grid-template-columns: 1fr !important; }
    .footer-grid   { grid-template-columns: 1fr !important; }
    .hero-h1       { font-size: 40px !important; }
    .booking-grid  { grid-template-columns: 1fr !important; }
  }

  /* Inputs */
  input::placeholder, textarea::placeholder { color: ${C.slateL}; }
  button:focus-visible { outline: 2px solid ${C.gold}; outline-offset: 3px; }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
  }
`;

/* ─── CONTENT DATA ──────────────────────────────────────── */
const NAV_LINKS = [
  { label: "Accueil",      id: "accueil" },
  { label: "À Propos",     id: "apropos" },
  { label: "Hébergement",  id: "hebergement" },
  { label: "Restaurant",   id: "restaurant" },
  { label: "Services",     id: "services" },
  { label: "Galerie",      id: "galerie" },
  { label: "Contact",      id: "contact" },
];

const ROOMS = [
  { id:1, name:"Chambre Classique", tag:"Standard", price:"180", sqm:"28", guests:2,
    desc:"Élégance intemporelle avec vue sur les jardins. Literie grand luxe, marbre italien et lumière naturelle généreuse.",
    amenities:["Wi-Fi Haut Débit","Minibar Premium","Coffre-Fort","Room Service 24h","Smart TV 4K"],
    img:"https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=520&fit=crop&auto=format",
    badge:"Populaire" },
  { id:2, name:"Chambre Deluxe", tag:"Deluxe", price:"290", sqm:"40", guests:2,
    desc:"Panorama côtier depuis votre lit. Baignoire îlot en marbre, terrasse privée et accès prioritaire au spa.",
    amenities:["Terrasse Privée","Baignoire Îlot","Peignoirs Hermès","Butler Service","Vue Mer Garantie"],
    img:"https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=520&fit=crop&auto=format",
    badge:null },
  { id:3, name:"Suite Junior", tag:"Suite", price:"450", sqm:"65", guests:2,
    desc:"Espace de vie distinct, dressing sur mesure et salle de bain double vasque. L'expérience suites sans compromis.",
    amenities:["Salon Séparé","Double Vasque","Dressing Walk-in","Accès Spa Gratuit","Champagne à l'arrivée"],
    img:"https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=520&fit=crop&auto=format",
    badge:"Coup de cœur" },
  { id:4, name:"Suite Familiale", tag:"Famille", price:"520", sqm:"85", guests:4,
    desc:"Deux chambres communicantes, espace ludique pour enfants et conciergerie dédiée pour des vacances sans stress.",
    amenities:["2 Chambres","Espace Enfants","Conciergerie Dédiée","Lit Bébé Inclus","Coffret Bienvenue"],
    img:"https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=520&fit=crop&auto=format",
    badge:null },
];

const MENU = {
  entrees: [
    { name:"Tartare de Saint-Jacques", desc:"Agrumes, caviar osciètre, émulsion iodée", price:"38", img:"https://images.unsplash.com/photo-1535400255456-984b5f901b62?w=400&h=280&fit=crop&auto=format", veg:false },
    { name:"Velouté de Truffes Noires", desc:"Crème légère, copeaux de truffe fraîche du Périgord", price:"45", img:"https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=280&fit=crop&auto=format", veg:true },
    { name:"Foie Gras Poêlé", desc:"Brioche maison, chutney de figues, réduction balsamique", price:"42", img:"https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&h=280&fit=crop&auto=format", veg:false },
  ],
  plats: [
    { name:"Homard Bleu Rôti", desc:"Beurre noisette, risotto de safran, bisque corsée", price:"89", img:"https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=280&fit=crop&auto=format", veg:false },
    { name:"Filet de Bœuf Wagyu", desc:"Sauce périgueux, gratin dauphinois, légumes du moment", price:"95", img:"https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=280&fit=crop&auto=format", veg:false },
    { name:"Loup de Méditerranée", desc:"Fenouil confit, vierge d'herbes, huile d'olive première pression", price:"72", img:"https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=280&fit=crop&auto=format", veg:false },
  ],
  desserts: [
    { name:"Soufflé au Grand Marnier", desc:"Crème anglaise vanille Bourbon, zestes confits", price:"24", img:"https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400&h=280&fit=crop&auto=format", veg:true },
    { name:"Tarte Citron Meringuée", desc:"Crémeux yuzu, meringue italienne, sablé breton", price:"22", img:"https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=280&fit=crop&auto=format", veg:true },
    { name:"Chariot des Fromages", desc:"Sélection affinée, noix, miel de lavande AOP", price:"28", img:"https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=280&fit=crop&auto=format", veg:true },
  ],
};

const SERVICES = [
  { icon:"🌊", name:"Piscine Infinity", desc:"Bassin chauffé à débordement face à la mer, bar aquatique et transats privatisables." },
  { icon:"🧖", name:"Spa Aurore", desc:"2 000 m² de bien-être : hammam, sauna finlandais, soins Sisley et massages signatures." },
  { icon:"🏋️", name:"Fitness & Yoga", desc:"Salle d'équipements Technogym, cours de yoga au lever du soleil sur la terrasse panoramique." },
  { icon:"🚘", name:"Navette & Parking", desc:"Transferts privés aéroport, voiturier inclus, parking sécurisé sur site." },
  { icon:"🍾", name:"Événements Privés", desc:"Salons modulables jusqu'à 300 personnes, cocktails dînatoires, séminaires et mariages." },
  { icon:"👨‍🍳", name:"Service Traiteur", desc:"Notre chef étoilé se déplace à domicile ou en entreprise pour des prestations sur mesure." },
];

const TESTIMONIALS = [
  { name:"Isabelle Moreau", country:"🇫🇷 Paris", rating:5, text:"Une expérience sensorielle exceptionnelle. La suite Deluxe avec vue sur la baie, le service silencieux et la cuisine étoilée ont rendu ce séjour inoubliable." },
  { name:"James & Sarah Whitfield", country:"🇬🇧 London", rating:5, text:"Undoubtedly the finest hotel on the Mediterranean coast. The staff anticipated our every need before we even knew we had one." },
  { name:"Dr. Marco Ferretti", country:"🇮🇹 Milano", rating:5, text:"Il ristorante dell'Hôtel Aurore merita tre stelle. La qualità del servizio e dell'ambiente è paragonabile ai grandi palace parigini." },
  { name:"Nadia Al-Rashid", country:"🇦🇪 Dubai", rating:5, text:"Après avoir séjourné dans les meilleurs palaces du monde, l'Hôtel Aurore se distingue par son authenticité méditerranéenne et son raffinement absolu." },
];

const GALLERY = [
  { img:"https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=560&fit=crop&auto=format", span:2, label:"Vue Panoramique" },
  { img:"https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=560&fit=crop&auto=format", span:1, label:"Suite Prestige" },
  { img:"https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=380&fit=crop&auto=format", span:1, label:"Gastronomie" },
  { img:"https://images.unsplash.com/photo-1540541338537-1220059d7d6b?w=400&h=380&fit=crop&auto=format", span:1, label:"Piscine" },
  { img:"https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&h=380&fit=crop&auto=format", span:2, label:"Spa & Bien-être" },
];

/* ─── HOOKS ─────────────────────────────────────────────── */
function useScrollReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function useActiveSection() {
  const [active, setActive] = useState("accueil");
  useEffect(() => {
    const handler = () => {
      const ids = NAV_LINKS.map(l => l.id);
      for (let i = ids.length - 1; i >= 0; i--) {
        const el = document.getElementById(ids[i]);
        if (el && el.getBoundingClientRect().top <= 100) {
          setActive(ids[i]);
          return;
        }
      }
      setActive("accueil");
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);
  return active;
}

/* ─── SMALL ATOMS ───────────────────────────────────────── */
function GoldLine({ width = 48 }) {
  return (
    <div style={{
      width: `${width}px`, height: "1px",
      background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`,
      margin: "0 auto 28px",
    }} />
  );
}

function SectionEyebrow({ children }) {
  return (
    <p style={{
      fontFamily: "Montserrat,sans-serif", fontSize: "10px",
      letterSpacing: "5px", textTransform: "uppercase",
      color: C.gold, margin: "0 0 16px", textAlign: "center",
    }}>{children}</p>
  );
}

function Stars({ n = 5 }) {
  return <span style={{ color: C.gold, fontSize: "13px", letterSpacing: "3px" }}>{"★".repeat(n)}</span>;
}

function RevealSection({ children, style = {}, delay = 0 }) {
  const [ref, visible] = useScrollReveal();
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(36px)",
      transition: `opacity 0.9s ease ${delay}s, transform 0.9s ease ${delay}s`,
      ...style,
    }}>{children}</div>
  );
}

function GoldButton({ children, onClick, outline = false, style = {} }) {
  const [hover, setHover] = useState(false);
  const base = {
    padding: "14px 36px", cursor: "pointer",
    fontFamily: "Montserrat,sans-serif", fontSize: "10px",
    fontWeight: "600", letterSpacing: "3px", textTransform: "uppercase",
    transition: "all 0.3s ease", border: "none", display: "inline-block",
    ...style,
  };
  const filled = {
    ...base,
    background: hover ? C.goldL : C.gold,
    color: C.night,
  };
  const outlined = {
    ...base,
    background: hover ? C.gold : "transparent",
    border: `1px solid ${C.gold}`,
    color: hover ? C.night : C.gold,
  };
  return (
    <button
      style={outline ? outlined : filled}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >{children}</button>
  );
}

/* ─── LOGO ──────────────────────────────────────────────── */
function AuroreLogo({ size = 34 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" aria-hidden="true">
      <circle cx="18" cy="18" r="16.5" fill="none" stroke={C.gold} strokeWidth="1"/>
      <circle cx="18" cy="18" r="13" fill="none" stroke={C.gold} strokeWidth="0.4" strokeDasharray="2 3"/>
      <path d="M18 5 L20.4 13.2 L29 13.2 L22.3 18.2 L24.7 26.4 L18 21.4 L11.3 26.4 L13.7 18.2 L7 13.2 L15.6 13.2 Z" fill={C.gold}/>
    </svg>
  );
}

/* ─── NAV ───────────────────────────────────────────────── */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const activeSection = useActiveSection();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Close menu on resize to desktop
  useEffect(() => {
    const fn = () => { if (window.innerWidth > 900) setMenuOpen(false); };
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  function scrollTo(id) {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled ? C.glass : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? `1px solid rgba(201,168,76,0.18)` : "none",
      transition: "all 0.5s ease",
    }}>
      <style>{GLOBAL_CSS}</style>

      <div style={{
        maxWidth: "1400px", margin: "0 auto",
        padding: "0 clamp(16px,4vw,40px)",
        height: scrolled ? "70px" : "82px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        transition: "height 0.4s ease",
      }}>
        {/* LOGO */}
        <button
          onClick={() => scrollTo("accueil")}
          style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px", padding: 0 }}
          aria-label="Retour à l'accueil"
        >
          <AuroreLogo size={scrolled ? 30 : 34} />
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: scrolled ? "19px" : "22px", color: C.white, fontWeight: "600", letterSpacing: "3px", lineHeight: 1, transition: "font-size 0.4s" }}>AURORE</div>
            <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: "7px", color: C.gold, letterSpacing: "5px", textTransform: "uppercase", marginTop: "2px" }}>HÔTEL & SPA</div>
          </div>
        </button>

        {/* DESKTOP LINKS */}
        <div className="nav-desktop" style={{ gap: "32px", alignItems: "center" }}>
          {NAV_LINKS.slice(0, -1).map(({ label, id }) => (
            <button key={id} onClick={() => scrollTo(id)} style={{
              background: "none", border: "none", cursor: "pointer",
              fontFamily: "Montserrat,sans-serif", fontSize: "10px", letterSpacing: "2px",
              color: activeSection === id ? C.gold : C.slateXL,
              textTransform: "uppercase", padding: "4px 0",
              borderBottom: activeSection === id ? `1px solid ${C.gold}` : "1px solid transparent",
              transition: "color 0.2s, border-color 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.color = C.gold}
              onMouseLeave={e => e.currentTarget.style.color = activeSection === id ? C.gold : C.slateXL}
            >{label}</button>
          ))}
          <GoldButton onClick={() => scrollTo("contact")} style={{ padding: "10px 24px" }}>Réserver</GoldButton>
        </div>

        {/* BURGER */}
        <button
          className="burger"
          onClick={() => setMenuOpen(o => !o)}
          aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={menuOpen}
          style={{ background: "none", border: "none", cursor: "pointer", flexDirection: "column", gap: "5px", padding: "8px" }}
        >
          {[0, 1, 2].map(i => (
            <span key={i} style={{
              width: "22px", height: "1.5px", background: C.gold, display: "block", transition: "all 0.3s",
              transform: menuOpen && i === 0 ? "rotate(45deg) translate(4.5px,4.5px)"
                : menuOpen && i === 2 ? "rotate(-45deg) translate(4.5px,-4.5px)" : "none",
              opacity: menuOpen && i === 1 ? 0 : 1,
            }} />
          ))}
        </button>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div style={{
          background: C.glass, backdropFilter: "blur(20px)",
          padding: "16px clamp(16px,6vw,40px) 32px",
          borderTop: `1px solid rgba(201,168,76,0.15)`,
          animation: "slideDown 0.3s ease",
        }}>
          {NAV_LINKS.map(({ label, id }) => (
            <button key={id} onClick={() => scrollTo(id)} style={{
              display: "block", width: "100%", textAlign: "left",
              background: "none", border: "none",
              padding: "15px 0", borderBottom: `1px solid rgba(255,255,255,0.05)`,
              fontFamily: "Montserrat,sans-serif", fontSize: "11px", letterSpacing: "3px",
              color: activeSection === id ? C.gold : C.slateXL,
              textTransform: "uppercase", cursor: "pointer",
            }}>{label}</button>
          ))}
          <div style={{ marginTop: "24px" }}>
            <GoldButton onClick={() => scrollTo("contact")} style={{ width: "100%", padding: "14px" }}>
              Réserver
            </GoldButton>
          </div>
        </div>
      )}
    </nav>
  );
}

/* ─── HERO ──────────────────────────────────────────────── */
function Hero() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { const t = setTimeout(() => setLoaded(true), 150); return () => clearTimeout(t); }, []);

  return (
    <section id="accueil" style={{
      position: "relative", height: "100vh", minHeight: "640px",
      overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <img
        src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1800&h=1100&fit=crop&auto=format"
        alt="Hôtel Aurore vue panoramique"
        style={{
          position: "absolute", inset: 0, width: "100%", height: "100%",
          objectFit: "cover", objectPosition: "center",
          transform: loaded ? "scale(1.03)" : "scale(1.1)",
          transition: "transform 10s ease",
        }}
      />
      {/* Gradient overlay */}
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to bottom, rgba(10,22,40,0.6) 0%, rgba(10,22,40,0.15) 45%, rgba(10,22,40,0.72) 100%)` }} />

      {/* Vertical gold thread */}
      <div style={{
        position: "absolute", left: "50%", top: 0,
        width: "1px", height: loaded ? "90px" : "0",
        background: `linear-gradient(to bottom, transparent, ${C.gold})`,
        transition: "height 1.6s ease 0.4s",
      }} />

      <div style={{ position: "relative", textAlign: "center", padding: "0 clamp(16px,6vw,60px)", maxWidth: "860px" }}>
        <p style={{
          fontFamily: "Montserrat,sans-serif", fontSize: "10px", letterSpacing: "6px",
          textTransform: "uppercase", color: C.gold, marginBottom: "24px",
          opacity: loaded ? 1 : 0, transition: "opacity 0.8s ease 1s",
        }}>
          ✦ Côte Méditerranéenne · Depuis 1924 ✦
        </p>

        <h1 className="hero-h1" style={{
          fontFamily: "'Cormorant Garamond',serif", fontWeight: "300",
          color: C.white, lineHeight: 1.05, letterSpacing: "8px", textTransform: "uppercase",
          opacity: loaded ? 1 : 0,
          transform: loaded ? "translateY(0)" : "translateY(40px)",
          transition: "opacity 1s ease 1.1s, transform 1s ease 1.1s",
        }}>
          Hôtel<br />
          <em style={{ color: C.gold, fontStyle: "italic", fontWeight: "300" }}>Aurore</em>
        </h1>

        <div style={{
          width: loaded ? "100px" : "0", height: "1px",
          background: `linear-gradient(90deg, transparent, ${C.gold}, transparent)`,
          margin: "32px auto",
          transition: "width 1.4s ease 2s",
        }} />

        <p style={{
          fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", fontSize: "clamp(15px,2vw,20px)",
          color: "rgba(255,255,255,0.82)", letterSpacing: "2px", marginBottom: "48px",
          opacity: loaded ? 1 : 0, transition: "opacity 0.8s ease 2.2s",
        }}>
          L'Art de Vivre à la Française
        </p>

        <div style={{
          display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap",
          opacity: loaded ? 1 : 0, transition: "opacity 0.8s ease 2.5s",
        }}>
          <GoldButton onClick={() => document.getElementById("hebergement").scrollIntoView({ behavior: "smooth" })}>
            Réserver une chambre
          </GoldButton>
          <GoldButton
            outline
            onClick={() => document.getElementById("restaurant").scrollIntoView({ behavior: "smooth" })}
            style={{ borderColor: "rgba(255,255,255,0.45)", color: C.white }}
          >
            Découvrir le menu
          </GoldButton>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: "absolute", bottom: "32px", left: "50%", transform: "translateX(-50%)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
        opacity: loaded ? 0.55 : 0, transition: "opacity 0.8s ease 3s",
      }}>
        <span style={{ fontFamily: "Montserrat,sans-serif", fontSize: "8px", letterSpacing: "3px", textTransform: "uppercase", color: C.slateXL }}>Découvrir</span>
        <div style={{ width: "1px", height: "44px", background: `linear-gradient(to bottom, ${C.gold}, transparent)`, animation: "shimmer 2s ease infinite" }} />
      </div>
    </section>
  );
}

/* ─── BOOKING BAR ───────────────────────────────────────── */
function BookingBar() {
  const [form, setForm] = useState({ arrive: "", depart: "", guests: "2", type: "" });
  const [submitted, setSubmitted] = useState(false);

  function handleCheck() {
    if (form.arrive && form.depart) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    }
  }

  const inputS = {
    width: "100%", background: "transparent", border: "none",
    borderBottom: `1px solid rgba(201,168,76,0.35)`, color: C.white,
    fontFamily: "Montserrat,sans-serif", fontSize: "12px", padding: "8px 0",
    outline: "none", cursor: "pointer",
  };
  const labelS = { fontFamily: "Montserrat,sans-serif", fontSize: "9px", letterSpacing: "2px", color: C.gold, textTransform: "uppercase", display: "block", marginBottom: "6px" };

  return (
    <div style={{ background: C.nightM, borderTop: `1px solid rgba(201,168,76,0.2)`, padding: "28px clamp(16px,4vw,40px)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div className="booking-grid" style={{ display: "grid", gap: "24px", alignItems: "end" }}>
          <div>
            <label style={labelS}>Arrivée</label>
            <input type="date" value={form.arrive} onChange={e => setForm({ ...form, arrive: e.target.value })} style={inputS} />
          </div>
          <div>
            <label style={labelS}>Départ</label>
            <input type="date" value={form.depart} onChange={e => setForm({ ...form, depart: e.target.value })} style={inputS} />
          </div>
          <div>
            <label style={labelS}>Personnes</label>
            <select value={form.guests} onChange={e => setForm({ ...form, guests: e.target.value })} style={{ ...inputS, appearance: "none" }}>
              {[1,2,3,4].map(n => <option key={n} value={n} style={{ background: C.nightM }}>{n} personne{n > 1 ? "s" : ""}</option>)}
            </select>
          </div>
          <div>
            <label style={labelS}>Type</label>
            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={{ ...inputS, appearance: "none" }}>
              <option value="" style={{ background: C.nightM }}>Tous types</option>
              {ROOMS.map(r => <option key={r.id} value={r.tag} style={{ background: C.nightM }}>{r.tag}</option>)}
            </select>
          </div>
          <div>
            <GoldButton onClick={handleCheck} style={{ width: "100%", padding: "14px 20px" }}>
              {submitted ? "✓ Disponible !" : "Vérifier"}
            </GoldButton>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── ABOUT ─────────────────────────────────────────────── */
function About() {
  return (
    <section id="apropos" style={{ background: C.ivory, padding: "clamp(64px,10vw,120px) clamp(16px,4vw,40px)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <RevealSection>
          <SectionEyebrow>Notre Histoire</SectionEyebrow>
          <GoldLine />
          <h2 style={{
            fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(32px,5vw,52px)",
            fontWeight: "300", color: C.night, textAlign: "center", marginBottom: "64px", lineHeight: 1.2,
          }}>
            Un siècle d'excellence<br /><em>méditerranéenne</em>
          </h2>
        </RevealSection>

        <div className="about-grid" style={{ display: "grid", gap: "clamp(40px,8vw,80px)", alignItems: "center" }}>
          <RevealSection>
            <div style={{ position: "relative" }}>
              <img
                src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=700&h=500&fit=crop&auto=format"
                alt="Hôtel Aurore histoire"
                style={{ width: "100%", height: "clamp(280px,40vw,420px)", objectFit: "cover", display: "block" }}
              />
              <div style={{
                position: "absolute", bottom: "-24px", right: "-24px",
                background: C.gold, padding: "28px 36px", minWidth: "160px",
              }}>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "48px", color: C.night, fontWeight: "600", lineHeight: 1 }}>1924</div>
                <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: "9px", letterSpacing: "2px", color: C.nightM, textTransform: "uppercase", marginTop: "4px" }}>Fondation</div>
              </div>
            </div>
          </RevealSection>

          <RevealSection delay={0.15}>
            <p style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", fontSize: "clamp(17px,2.2vw,22px)", color: C.nightM, lineHeight: 1.7, marginBottom: "24px" }}>
              "Fondé par la famille Aurore en 1924, notre palace incarne l'art de recevoir à la française sur les rives de la Méditerranée."
            </p>
            <p style={{ fontFamily: "Montserrat,sans-serif", fontSize: "13px", color: C.slate, lineHeight: 1.9, marginBottom: "20px" }}>
              Cent ans après son inauguration, l'Hôtel Aurore demeure fidèle à ses valeurs fondatrices : l'excellence du service, l'authenticité des matériaux et la sincérité de l'hospitalité. Chaque pierre, chaque boiserie, chaque geste de nos équipes perpétue l'héritage d'une famille passionnée.
            </p>
            <p style={{ fontFamily: "Montserrat,sans-serif", fontSize: "13px", color: C.slate, lineHeight: 1.9, marginBottom: "40px" }}>
              Labellisé Palace par Atout France, distingué par le guide Michelin pour notre restaurant, et reconnu par Condé Nast Traveller parmi les cinquante meilleurs hôtels d'Europe.
            </p>
            <div style={{ display: "flex", gap: "clamp(20px,4vw,40px)", flexWrap: "wrap" }}>
              {[["100","Ans d'histoire"],["5★","Palace certifié"],["2","Étoiles Michelin"],["48","Suites & chambres"]].map(([n, l]) => (
                <div key={l}>
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "36px", color: C.gold, fontWeight: "600" }}>{n}</div>
                  <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: "9px", letterSpacing: "2px", color: C.slate, textTransform: "uppercase", marginTop: "4px" }}>{l}</div>
                </div>
              ))}
            </div>
          </RevealSection>
        </div>

        {/* Values */}
        <RevealSection style={{ marginTop: "clamp(60px,10vw,100px)" }}>
          <div className="services-grid" style={{ display: "grid", gap: "2px", background: C.night }}>
            {[
              { icon: "🤍", title: "Excellence", text: "Chaque détail est pensé pour dépasser vos attentes. Notre équipe de 120 collaborateurs se forme continuellement aux standards des palaces internationaux." },
              { icon: "🌿", title: "Authenticité", text: "Produits locaux, artisans régionaux, architecture préservée. Nous célébrons le terroir méditerranéen dans chaque aspect de l'expérience Aurore." },
              { icon: "♻️", title: "Responsabilité", text: "Certifié Green Key, nous œuvrons chaque jour pour un luxe respectueux : énergies renouvelables, zéro déchet alimentaire, potager biologique." },
            ].map(v => (
              <div key={v.title} style={{ background: C.ivory, padding: "clamp(32px,5vw,48px) clamp(24px,4vw,40px)", textAlign: "center" }}>
                <div style={{ fontSize: "32px", marginBottom: "20px" }}>{v.icon}</div>
                <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "26px", color: C.night, marginBottom: "12px", fontWeight: "500" }}>{v.title}</h3>
                <div style={{ width: "28px", height: "1px", background: C.gold, margin: "0 auto 16px" }} />
                <p style={{ fontFamily: "Montserrat,sans-serif", fontSize: "12px", color: C.slate, lineHeight: 1.9 }}>{v.text}</p>
              </div>
            ))}
          </div>
        </RevealSection>
      </div>
    </section>
  );
}

/* ─── ROOM CARD ─────────────────────────────────────────── */
function RoomCard({ room }) {
  const [hover, setHover] = useState(false);
  const [ref, visible] = useScrollReveal(0.08);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div ref={ref} style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(48px)",
        transition: "opacity 0.8s ease, transform 0.8s ease",
      }}>
        <div
          style={{ position: "relative", overflow: "hidden", cursor: "pointer" }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={() => setModalOpen(true)}
        >
          <img
            src={room.img} alt={room.name}
            style={{ width: "100%", height: "300px", objectFit: "cover", display: "block", transform: hover ? "scale(1.06)" : "scale(1)", transition: "transform 0.7s ease" }}
          />
          <div style={{ position: "absolute", inset: 0, background: hover ? "rgba(10,22,40,0.45)" : "rgba(10,22,40,0.1)", transition: "background 0.4s" }} />

          {/* Tag */}
          <div style={{ position: "absolute", top: "18px", left: "18px", background: C.gold, padding: "4px 14px" }}>
            <span style={{ fontFamily: "Montserrat,sans-serif", fontSize: "8px", letterSpacing: "2px", fontWeight: "700", color: C.night, textTransform: "uppercase" }}>{room.tag}</span>
          </div>

          {/* Badge */}
          {room.badge && (
            <div style={{ position: "absolute", top: "18px", right: "18px", background: C.nightM, border: `1px solid ${C.gold}`, padding: "4px 12px" }}>
              <span style={{ fontFamily: "Montserrat,sans-serif", fontSize: "8px", letterSpacing: "1px", color: C.gold }}>{room.badge}</span>
            </div>
          )}

          {/* Hover CTA */}
          <div style={{ position: "absolute", bottom: "18px", right: "18px", background: `rgba(10,22,40,0.9)`, padding: "8px 16px", opacity: hover ? 1 : 0, transition: "opacity 0.3s", transform: hover ? "translateY(0)" : "translateY(8px)", transitionProperty: "opacity, transform" }}>
            <span style={{ fontFamily: "Montserrat,sans-serif", fontSize: "9px", color: C.gold, letterSpacing: "2px" }}>Voir les détails →</span>
          </div>
        </div>

        <div style={{ background: C.nightL, padding: "clamp(20px,3vw,32px)", borderBottom: `2px solid ${C.gold}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "14px", flexWrap: "wrap", gap: "8px" }}>
            <div>
              <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "26px", color: C.white, fontWeight: "400", marginBottom: "4px" }}>{room.name}</h3>
              <p style={{ fontFamily: "Montserrat,sans-serif", fontSize: "10px", color: C.slateL, letterSpacing: "1px" }}>{room.sqm} m² · {room.guests} pers. max.</p>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "30px", color: C.gold, fontWeight: "600" }}>{room.price}€</div>
              <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: "8px", color: C.slateL, letterSpacing: "1px" }}>/ nuit</div>
            </div>
          </div>

          <p style={{ fontFamily: "Montserrat,sans-serif", fontSize: "12px", color: C.slateL, lineHeight: 1.8, marginBottom: "20px" }}>{room.desc}</p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "24px" }}>
            {room.amenities.map(a => (
              <span key={a} style={{ fontFamily: "Montserrat,sans-serif", fontSize: "9px", color: C.slateL, border: `1px solid rgba(90,107,130,0.4)`, padding: "4px 10px", letterSpacing: "0.5px" }}>✓ {a}</span>
            ))}
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <GoldButton onClick={() => setModalOpen(true)} outline style={{ flex: 1, padding: "12px", textAlign: "center" }}>
              Détails
            </GoldButton>
            <GoldButton
              onClick={() => { setModalOpen(false); document.getElementById("contact").scrollIntoView({ behavior: "smooth" }); }}
              style={{ flex: 2, padding: "12px", textAlign: "center" }}
            >
              Réserver
            </GoldButton>
          </div>
        </div>
      </div>

      {/* Room Detail Modal */}
      {modalOpen && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: "clamp(16px,4vw,40px)", overflowY: "auto" }}
          onClick={e => { if (e.target === e.currentTarget) setModalOpen(false); }}
        >
          <div style={{ background: C.nightL, maxWidth: "700px", width: "100%", maxHeight: "90vh", overflowY: "auto", position: "relative", animation: "fadeUp 0.4s ease" }}>
            <button
              onClick={() => setModalOpen(false)}
              style={{ position: "absolute", top: "16px", right: "16px", background: C.gold, border: "none", color: C.night, width: "36px", height: "36px", cursor: "pointer", fontWeight: "700", fontSize: "18px", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}
              aria-label="Fermer"
            >×</button>
            <img src={room.img} alt={room.name} style={{ width: "100%", height: "280px", objectFit: "cover", display: "block" }} />
            <div style={{ padding: "clamp(24px,4vw,40px)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
                <div>
                  <p style={{ fontFamily: "Montserrat,sans-serif", fontSize: "9px", letterSpacing: "3px", color: C.gold, textTransform: "uppercase", marginBottom: "6px" }}>{room.tag}</p>
                  <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "32px", color: C.white, fontWeight: "400" }}>{room.name}</h2>
                  <p style={{ fontFamily: "Montserrat,sans-serif", fontSize: "11px", color: C.slateL, marginTop: "4px" }}>{room.sqm} m² · Jusqu'à {room.guests} personnes</p>
                </div>
                <div>
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "38px", color: C.gold, fontWeight: "600" }}>{room.price}€</div>
                  <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: "9px", color: C.slateL }}>par nuit, taxes incluses</div>
                </div>
              </div>
              <GoldLine width={32} />
              <p style={{ fontFamily: "Montserrat,sans-serif", fontSize: "13px", color: C.slateL, lineHeight: 1.9, marginBottom: "24px" }}>{room.desc}</p>
              <h4 style={{ fontFamily: "Montserrat,sans-serif", fontSize: "9px", letterSpacing: "2px", color: C.gold, textTransform: "uppercase", marginBottom: "12px" }}>Équipements inclus</h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "28px" }}>
                {room.amenities.map(a => (
                  <span key={a} style={{ fontFamily: "Montserrat,sans-serif", fontSize: "10px", color: C.slateL, border: `1px solid rgba(90,107,130,0.4)`, padding: "6px 14px" }}>✓ {a}</span>
                ))}
              </div>
              <GoldButton
                onClick={() => { setModalOpen(false); document.getElementById("contact").scrollIntoView({ behavior: "smooth" }); }}
                style={{ width: "100%", padding: "16px" }}
              >
                Réserver cette chambre
              </GoldButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Rooms() {
  return (
    <section id="hebergement" style={{ background: C.night, padding: "clamp(64px,10vw,120px) clamp(16px,4vw,40px)" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <RevealSection>
          <SectionEyebrow>Nos Hébergements</SectionEyebrow>
          <GoldLine />
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(32px,5vw,52px)", fontWeight: "300", color: C.white, textAlign: "center", marginBottom: "64px", lineHeight: 1.2 }}>
            Chambres & <em style={{ color: C.gold }}>Suites</em>
          </h2>
        </RevealSection>
        <div className="rooms-grid" style={{ display: "grid", gap: "2px" }}>
          {ROOMS.map(r => <RoomCard key={r.id} room={r} />)}
        </div>
      </div>
    </section>
  );
}

/* ─── RESTAURANT ────────────────────────────────────────── */
function MenuItem({ item }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      style={{ background: C.nightL, border: `1px solid rgba(201,168,76,${hover ? 0.35 : 0.08})`, transition: "border-color 0.3s, transform 0.3s", cursor: "default", transform: hover ? "translateY(-3px)" : "none" }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div style={{ overflow: "hidden", height: "175px", position: "relative" }}>
        <img
          src={item.img} alt={item.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", transform: hover ? "scale(1.08)" : "scale(1)", transition: "transform 0.6s", display: "block" }}
        />
        {item.veg && (
          <div style={{ position: "absolute", top: "10px", right: "10px", background: "#2D5A27", padding: "3px 8px" }}>
            <span style={{ fontFamily: "Montserrat,sans-serif", fontSize: "7px", color: "#7FCF6A", letterSpacing: "1px" }}>🌿 VEG</span>
          </div>
        )}
      </div>
      <div style={{ padding: "clamp(16px,2.5vw,24px)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px", gap: "8px" }}>
          <h4 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "19px", color: C.white, fontWeight: "400", flex: 1 }}>{item.name}</h4>
          <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "22px", color: C.gold, fontWeight: "600", whiteSpace: "nowrap" }}>{item.price}€</span>
        </div>
        <p style={{ fontFamily: "Montserrat,sans-serif", fontSize: "11px", color: C.slateL, lineHeight: 1.7, fontStyle: "italic" }}>{item.desc}</p>
      </div>
    </div>
  );
}

function Restaurant() {
  const [tab, setTab] = useState("entrees");
  const tabs = [["entrees", "Entrées"], ["plats", "Plats"], ["desserts", "Desserts"]];

  return (
    <section id="restaurant" style={{ background: `linear-gradient(180deg,${C.nightM} 0%,${C.night} 100%)`, padding: "clamp(64px,10vw,120px) clamp(16px,4vw,40px)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <RevealSection>
          <SectionEyebrow>Le Grand Restaurant</SectionEyebrow>
          <GoldLine />
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(32px,5vw,52px)", fontWeight: "300", color: C.white, textAlign: "center", marginBottom: "12px", lineHeight: 1.2 }}>
            La Table <em style={{ color: C.gold }}>Dorée</em>
          </h2>
          <p style={{ fontFamily: "Montserrat,sans-serif", fontSize: "13px", color: C.slateL, textAlign: "center", maxWidth: "500px", margin: "0 auto 48px", lineHeight: 1.9 }}>
            Deux étoiles Michelin. Notre Chef Julien Marceau sublime les produits de la Méditerranée avec une créativité sans compromis.
          </p>

          {/* Tabs */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "48px", flexWrap: "wrap", gap: "2px" }}>
            {tabs.map(([k, l]) => (
              <button key={k} onClick={() => setTab(k)} style={{
                padding: "13px clamp(20px,3vw,36px)",
                background: tab === k ? C.gold : "transparent",
                color: tab === k ? C.night : C.slateL,
                border: `1px solid ${tab === k ? C.gold : "rgba(201,168,76,0.25)"}`,
                fontFamily: "Montserrat,sans-serif", fontSize: "9px", letterSpacing: "3px",
                textTransform: "uppercase", cursor: "pointer", transition: "all 0.3s",
                fontWeight: tab === k ? "700" : "400",
              }}>{l}</button>
            ))}
          </div>
        </RevealSection>

        <div className="menu-grid" style={{ display: "grid", gap: "2px" }}>
          {MENU[tab].map(item => <MenuItem key={item.name} item={item} />)}
        </div>

        <RevealSection style={{ marginTop: "72px" }}>
          <div style={{ position: "relative", overflow: "hidden" }}>
            <img
              src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1400&h=480&fit=crop&auto=format"
              alt="Restaurant La Table Dorée"
              style={{ width: "100%", height: "clamp(220px,35vw,380px)", objectFit: "cover", display: "block" }}
            />
            <div style={{
              position: "absolute", inset: 0, background: "rgba(10,22,40,0.72)",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              textAlign: "center", padding: "clamp(24px,5vw,40px)",
            }}>
              <p style={{ fontFamily: "Montserrat,sans-serif", fontSize: "9px", letterSpacing: "4px", color: C.gold, textTransform: "uppercase", marginBottom: "14px" }}>Réservation recommandée</p>
              <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(22px,4vw,40px)", color: C.white, fontWeight: "300", marginBottom: "24px" }}>Ouvert chaque soir de 19h à 23h</h3>
              <GoldButton onClick={() => document.getElementById("contact").scrollIntoView({ behavior: "smooth" })}>
                Réserver une table
              </GoldButton>
            </div>
          </div>
        </RevealSection>
      </div>
    </section>
  );
}

/* ─── SERVICES ──────────────────────────────────────────── */
function Services() {
  return (
    <section id="services" style={{ background: C.ivory, padding: "clamp(64px,10vw,120px) clamp(16px,4vw,40px)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <RevealSection>
          <SectionEyebrow>Nos Prestations</SectionEyebrow>
          <GoldLine />
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(32px,5vw,52px)", fontWeight: "300", color: C.night, textAlign: "center", marginBottom: "64px", lineHeight: 1.2 }}>
            Tout pour votre <em>confort</em>
          </h2>
        </RevealSection>

        <div className="services-grid" style={{ display: "grid", gap: "2px", background: C.nightL }}>
          {SERVICES.map((s, i) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const [ref, vis] = useScrollReveal(0.08);
            return (
              <div ref={ref} key={s.name} style={{
                background: C.ivory, padding: "clamp(32px,4vw,48px) clamp(24px,3vw,36px)",
                textAlign: "center",
                opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(28px)",
                transition: `opacity 0.7s ease ${i * 0.1}s, transform 0.7s ease ${i * 0.1}s`,
              }}>
                <div style={{ fontSize: "36px", marginBottom: "20px" }}>{s.icon}</div>
                <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "22px", color: C.night, marginBottom: "10px", fontWeight: "500" }}>{s.name}</h3>
                <div style={{ width: "28px", height: "1px", background: C.gold, margin: "0 auto 16px" }} />
                <p style={{ fontFamily: "Montserrat,sans-serif", fontSize: "12px", color: C.slate, lineHeight: 1.9 }}>{s.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Spa feature */}
        <RevealSection style={{ marginTop: "clamp(48px,8vw,80px)" }}>
          <div className="about-grid" style={{ display: "grid", gap: 0, background: C.night, overflow: "hidden" }}>
            <img
              src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=700&h=400&fit=crop&auto=format"
              alt="Spa Aurore"
              style={{ width: "100%", height: "clamp(240px,30vw,360px)", objectFit: "cover", display: "block" }}
            />
            <div style={{ padding: "clamp(32px,5vw,56px) clamp(24px,4vw,48px)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <p style={{ fontFamily: "Montserrat,sans-serif", fontSize: "9px", letterSpacing: "3px", color: C.gold, textTransform: "uppercase", marginBottom: "14px" }}>Spa Aurore</p>
              <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(24px,3.5vw,38px)", color: C.white, fontWeight: "300", lineHeight: 1.3, marginBottom: "18px" }}>Un sanctuaire de sérénité face à la mer</h3>
              <p style={{ fontFamily: "Montserrat,sans-serif", fontSize: "13px", color: C.slateL, lineHeight: 1.9, marginBottom: "28px" }}>
                Notre spa de 2 000 m² propose des soins exclusifs Sisley Paris, des rituels méditerranéens et une thalassothérapie intégrée. Réservé aux résidents de 8h à 22h.
              </p>
              <div>
                <GoldButton outline onClick={() => document.getElementById("contact").scrollIntoView({ behavior: "smooth" })}>
                  Découvrir le spa
                </GoldButton>
              </div>
            </div>
          </div>
        </RevealSection>
      </div>
    </section>
  );
}

/* ─── GALLERY ───────────────────────────────────────────── */
function Gallery() {
  const [active, setActive] = useState(null);
  const [activeIdx, setActiveIdx] = useState(null);

  function openLight(g, i) { setActive(g); setActiveIdx(i); }
  function closeLight() { setActive(null); setActiveIdx(null); }
  function prev() { const i = (activeIdx - 1 + GALLERY.length) % GALLERY.length; setActive(GALLERY[i]); setActiveIdx(i); }
  function next() { const i = (activeIdx + 1) % GALLERY.length; setActive(GALLERY[i]); setActiveIdx(i); }

  useEffect(() => {
    const handler = e => {
      if (!active) return;
      if (e.key === "Escape") closeLight();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [active, activeIdx]);

  return (
    <section id="galerie" style={{ background: C.night, padding: "clamp(64px,10vw,120px) clamp(16px,4vw,40px)" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <RevealSection>
          <SectionEyebrow>Galerie</SectionEyebrow>
          <GoldLine />
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(32px,5vw,52px)", fontWeight: "300", color: C.white, textAlign: "center", marginBottom: "64px", lineHeight: 1.2 }}>
            L'Aurore en <em style={{ color: C.gold }}>images</em>
          </h2>
        </RevealSection>

        <div className="gallery-grid" style={{ display: "grid", gap: "4px" }}>
          {GALLERY.map((g, i) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const [ref, vis] = useScrollReveal(0.05);
            return (
              <div key={i} ref={ref} style={{
                gridColumn: `span ${g.span}`,
                position: "relative", overflow: "hidden", cursor: "pointer",
                opacity: vis ? 1 : 0, transition: `opacity 0.7s ease ${i * 0.1}s`,
              }}
                onClick={() => openLight(g, i)}
                role="button" tabIndex={0}
                aria-label={`Voir ${g.label}`}
                onKeyDown={e => e.key === "Enter" && openLight(g, i)}
              >
                <img
                  src={g.img} alt={g.label}
                  style={{ width: "100%", height: g.span === 2 ? "clamp(200px,28vw,340px)" : "clamp(150px,18vw,240px)", objectFit: "cover", display: "block", transition: "transform 0.6s" }}
                  onMouseEnter={e => e.target.style.transform = "scale(1.06)"}
                  onMouseLeave={e => e.target.style.transform = "scale(1)"}
                />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 22px", background: "linear-gradient(transparent, rgba(10,22,40,0.8))" }}>
                  <span style={{ fontFamily: "Montserrat,sans-serif", fontSize: "9px", color: C.gold, letterSpacing: "3px", textTransform: "uppercase" }}>{g.label}</span>
                </div>
                <div style={{ position: "absolute", inset: 0, background: "rgba(201,168,76,0)", transition: "background 0.3s" }}
                  onMouseEnter={e => e.target.style.background = "rgba(201,168,76,0.06)"}
                  onMouseLeave={e => e.target.style.background = "rgba(201,168,76,0)"}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox */}
      {active && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.94)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}
          onClick={e => { if (e.target === e.currentTarget) closeLight(); }}
        >
          <button onClick={prev} aria-label="Précédent" style={{ position: "fixed", left: "16px", top: "50%", transform: "translateY(-50%)", background: C.nightL, border: `1px solid ${C.gold}`, color: C.gold, fontSize: "22px", width: "48px", height: "48px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>‹</button>
          <img src={active.img} alt={active.label} style={{ maxWidth: "88vw", maxHeight: "84vh", objectFit: "contain", animation: "fadeIn 0.25s ease" }} />
          <button onClick={next} aria-label="Suivant" style={{ position: "fixed", right: "16px", top: "50%", transform: "translateY(-50%)", background: C.nightL, border: `1px solid ${C.gold}`, color: C.gold, fontSize: "22px", width: "48px", height: "48px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>›</button>
          <button onClick={closeLight} aria-label="Fermer" style={{ position: "fixed", top: "20px", right: "20px", background: C.gold, border: "none", color: C.night, fontSize: "18px", width: "40px", height: "40px", cursor: "pointer", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
          <div style={{ position: "fixed", bottom: "24px", left: "50%", transform: "translateX(-50%)", fontFamily: "Montserrat,sans-serif", fontSize: "10px", color: C.gold, letterSpacing: "2px" }}>
            {active.label} · {activeIdx + 1}/{GALLERY.length}
          </div>
        </div>
      )}
    </section>
  );
}

/* ─── TESTIMONIALS ──────────────────────────────────────── */
function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (!auto) return;
    const t = setInterval(() => setCurrent(c => (c + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(t);
  }, [auto]);

  return (
    <section style={{ background: C.nightM, padding: "clamp(64px,10vw,120px) clamp(16px,4vw,40px)", borderTop: `1px solid rgba(201,168,76,0.12)`, borderBottom: `1px solid rgba(201,168,76,0.12)` }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <RevealSection>
          <SectionEyebrow>Témoignages</SectionEyebrow>
          <GoldLine />
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(32px,5vw,52px)", fontWeight: "300", color: C.white, textAlign: "center", marginBottom: "64px", lineHeight: 1.2 }}>
            Ce que disent<br />nos <em style={{ color: C.gold }}>hôtes</em>
          </h2>
        </RevealSection>

        {/* Desktop grid */}
        <div className="test-grid" style={{ display: "grid", gap: "2px" }}>
          {TESTIMONIALS.map((t, i) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const [ref, vis] = useScrollReveal(0.08);
            return (
              <div ref={ref} key={t.name} style={{
                background: C.night, padding: "clamp(28px,4vw,48px) clamp(24px,3.5vw,40px)",
                borderLeft: i % 2 === 0 ? `2px solid ${C.gold}` : "none",
                borderRight: i % 2 !== 0 ? `2px solid ${C.gold}` : "none",
                opacity: vis ? 1 : 0, transform: vis ? "translateY(0)" : "translateY(28px)",
                transition: `opacity 0.8s ease ${i * 0.15}s, transform 0.8s ease ${i * 0.15}s`,
              }}>
                <Stars />
                <p style={{ fontFamily: "'Cormorant Garamond',serif", fontStyle: "italic", fontSize: "clamp(15px,1.8vw,19px)", color: C.slateXL, lineHeight: 1.8, margin: "18px 0 24px" }}>"{t.text}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: `linear-gradient(135deg, ${C.gold}, ${C.goldD})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Cormorant Garamond',serif", fontSize: "14px", color: C.night, fontWeight: "600", flexShrink: 0 }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <p style={{ fontFamily: "Montserrat,sans-serif", fontSize: "11px", color: C.white, fontWeight: "600", letterSpacing: "1px" }}>{t.name}</p>
                    <p style={{ fontFamily: "Montserrat,sans-serif", fontSize: "10px", color: C.slateL, marginTop: "2px" }}>{t.country}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─── CONTACT ───────────────────────────────────────────── */
function Contact() {
  const [form, setForm] = useState({ nom: "", tel: "", email: "", type: "", message: "" });
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function validate() {
    const e = {};
    if (!form.nom.trim()) e.nom = "Requis";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Email invalide";
    if (!form.message.trim()) e.message = "Requis";
    return e;
  }

  function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      setForm({ nom: "", tel: "", email: "", type: "", message: "" });
      setTimeout(() => setSent(false), 5000);
    }, 1200);
  }

  const inputStyle = (field) => ({
    width: "100%", padding: "14px 18px",
    background: "rgba(255,255,255,0.04)",
    border: `1px solid ${errors[field] ? "#E05252" : "rgba(201,168,76,0.22)"}`,
    color: C.white, fontFamily: "Montserrat,sans-serif", fontSize: "13px",
    outline: "none", transition: "border-color 0.3s", borderRadius: 0,
  });

  return (
    <section id="contact" style={{ background: C.night, padding: "clamp(64px,10vw,120px) clamp(16px,4vw,40px)" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <RevealSection>
          <SectionEyebrow>Contact & Réservation</SectionEyebrow>
          <GoldLine />
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(32px,5vw,52px)", fontWeight: "300", color: C.white, textAlign: "center", marginBottom: "64px", lineHeight: 1.2 }}>
            Nous sommes à<br /><em style={{ color: C.gold }}>votre disposition</em>
          </h2>
        </RevealSection>

        <div className="contact-grid" style={{ display: "grid", gap: "clamp(40px,6vw,80px)" }}>
          {/* Info */}
          <RevealSection>
            <div>
              {[
                { icon: "📍", label: "Adresse", value: "1 Promenade des Palmiers\n06400 Cannes, France" },
                { icon: "📞", label: "Téléphone", value: "+33 (0)4 93 00 00 00" },
                { icon: "✉️", label: "Email", value: "concierge@hotel-aurore.fr" },
                { icon: "🕐", label: "Réception", value: "Ouverte 24h/24 · 7j/7" },
              ].map(info => (
                <div key={info.label} style={{ display: "flex", gap: "18px", marginBottom: "32px", paddingBottom: "32px", borderBottom: `1px solid rgba(201,168,76,0.08)` }}>
                  <div style={{ fontSize: "20px", flexShrink: 0, marginTop: "2px" }}>{info.icon}</div>
                  <div>
                    <p style={{ fontFamily: "Montserrat,sans-serif", fontSize: "9px", letterSpacing: "2px", color: C.gold, textTransform: "uppercase", marginBottom: "8px" }}>{info.label}</p>
                    <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "18px", color: C.white, lineHeight: 1.6, whiteSpace: "pre-line" }}>{info.value}</p>
                  </div>
                </div>
              ))}

              <div>
                <p style={{ fontFamily: "Montserrat,sans-serif", fontSize: "9px", letterSpacing: "2px", color: C.gold, textTransform: "uppercase", marginBottom: "14px" }}>Suivez-nous</p>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {["Instagram", "Facebook", "TripAdvisor"].map(sn => (
                    <GoldButton key={sn} outline style={{ padding: "8px 16px", fontSize: "9px" }}>{sn}</GoldButton>
                  ))}
                </div>
              </div>
            </div>
          </RevealSection>

          {/* Form */}
          <RevealSection delay={0.15}>
            {sent ? (
              <div style={{ textAlign: "center", padding: "48px 24px", background: "rgba(201,168,76,0.06)", border: `1px solid rgba(201,168,76,0.2)`, animation: "fadeIn 0.5s ease" }}>
                <div style={{ fontSize: "40px", marginBottom: "20px" }}>✨</div>
                <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "28px", color: C.gold, marginBottom: "12px" }}>Message envoyé</h3>
                <p style={{ fontFamily: "Montserrat,sans-serif", fontSize: "12px", color: C.slateL, lineHeight: 1.8 }}>Notre équipe vous répondra dans les 24 heures.<br />Merci pour votre confiance.</p>
              </div>
            ) : (
              <div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                  <div>
                    <input value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} placeholder="Votre nom *" style={inputStyle("nom")}
                      onFocus={e => e.target.style.borderColor = C.gold} onBlur={e => e.target.style.borderColor = errors.nom ? "#E05252" : "rgba(201,168,76,0.22)"} />
                    {errors.nom && <p style={{ fontFamily: "Montserrat,sans-serif", fontSize: "9px", color: "#E05252", marginTop: "4px" }}>{errors.nom}</p>}
                  </div>
                  <input value={form.tel} onChange={e => setForm({ ...form, tel: e.target.value })} placeholder="Téléphone" style={inputStyle("tel")}
                    onFocus={e => e.target.style.borderColor = C.gold} onBlur={e => e.target.style.borderColor = "rgba(201,168,76,0.22)"} />
                </div>

                <div style={{ marginBottom: "12px" }}>
                  <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Adresse email *" style={inputStyle("email")}
                    onFocus={e => e.target.style.borderColor = C.gold} onBlur={e => e.target.style.borderColor = errors.email ? "#E05252" : "rgba(201,168,76,0.22)"} />
                  {errors.email && <p style={{ fontFamily: "Montserrat,sans-serif", fontSize: "9px", color: "#E05252", marginTop: "4px" }}>{errors.email}</p>}
                </div>

                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={{ ...inputStyle("type"), marginBottom: "12px", appearance: "none" }}>
                  <option value="" style={{ background: C.nightL }}>Type de demande</option>
                  {["Réservation chambre", "Réservation restaurant", "Évènement privé", "Spa & bien-être", "Autre"].map(o => (
                    <option key={o} value={o} style={{ background: C.nightL }}>{o}</option>
                  ))}
                </select>

                <div style={{ marginBottom: "20px" }}>
                  <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Votre message ou demande de réservation... *" rows={5} style={{ ...inputStyle("message"), resize: "vertical" }}
                    onFocus={e => e.target.style.borderColor = C.gold} onBlur={e => e.target.style.borderColor = errors.message ? "#E05252" : "rgba(201,168,76,0.22)"} />
                  {errors.message && <p style={{ fontFamily: "Montserrat,sans-serif", fontSize: "9px", color: "#E05252", marginTop: "4px" }}>{errors.message}</p>}
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  style={{
                    width: "100%", padding: "16px", background: C.gold,
                    color: C.night, border: "none",
                    fontFamily: "Montserrat,sans-serif", fontSize: "10px", fontWeight: "700",
                    letterSpacing: "3px", textTransform: "uppercase", cursor: loading ? "wait" : "pointer",
                    transition: "background 0.3s", opacity: loading ? 0.7 : 1,
                  }}
                  onMouseEnter={e => { if (!loading) e.target.style.background = C.goldL; }}
                  onMouseLeave={e => e.target.style.background = C.gold}
                >
                  {loading ? "Envoi en cours…" : "Envoyer le message"}
                </button>
              </div>
            )}

            {/* Map */}
            <div style={{ marginTop: "24px", overflow: "hidden", height: "190px" }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2888.0!2d7.015!3d43.552!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDPCsDMzJzA3LjIiTiA3wrAwMCc1NC4wIkU!5e0!3m2!1sfr!2sfr!4v1"
                width="100%" height="190"
                style={{ border: 0, filter: "grayscale(0.75) contrast(1.1) brightness(0.85)", display: "block" }}
                loading="lazy"
                title="Carte Hôtel Aurore — Cannes"
              />
            </div>
          </RevealSection>
        </div>
      </div>
    </section>
  );
}

/* ─── FOOTER ────────────────────────────────────────────── */
function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer style={{ background: "#060B14", borderTop: `1px solid rgba(201,168,76,0.15)`, padding: "clamp(48px,8vw,72px) clamp(16px,4vw,40px) 32px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div className="footer-grid" style={{ display: "grid", gap: "clamp(32px,5vw,56px)", marginBottom: "48px" }}>
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <AuroreLogo size={30} />
              <div>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "19px", color: C.white, fontWeight: "600", letterSpacing: "3px" }}>AURORE</div>
                <div style={{ fontFamily: "Montserrat,sans-serif", fontSize: "7px", color: C.gold, letterSpacing: "4px", textTransform: "uppercase" }}>HÔTEL & SPA</div>
              </div>
            </div>
            <p style={{ fontFamily: "Montserrat,sans-serif", fontSize: "12px", color: C.slate, lineHeight: 1.9, maxWidth: "240px" }}>
              Palace 5 étoiles sur la Côte d'Azur.<br />Membre des Relais & Châteaux.
            </p>
            <div style={{ marginTop: "24px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {["IG", "FB", "TA"].map(s => (
                <div key={s} style={{ width: "32px", height: "32px", border: `1px solid rgba(201,168,76,0.25)`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontFamily: "Montserrat,sans-serif", fontSize: "9px", color: C.slateL, transition: "all 0.3s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = C.gold; e.currentTarget.style.color = C.gold; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(201,168,76,0.25)"; e.currentTarget.style.color = C.slateL; }}
                >{s}</div>
              ))}
            </div>
          </div>

          {[
            { title: "Navigation", links: ["Accueil", "À Propos", "Hébergement", "Restaurant", "Services", "Galerie", "Contact"] },
            { title: "Informations", links: ["Arrivée & Départ", "Politique d'annulation", "Accessibilité", "Presse", "Offres exclusives"] },
            { title: "Labels", links: ["Palace Atout France", "2 Étoiles Michelin", "Relais & Châteaux", "Green Key", "Forbes 5 Stars"] },
          ].map(col => (
            <div key={col.title}>
              <h4 style={{ fontFamily: "Montserrat,sans-serif", fontSize: "9px", letterSpacing: "3px", color: C.gold, textTransform: "uppercase", marginBottom: "18px" }}>{col.title}</h4>
              {col.links.map(l => (
                <p key={l} style={{ fontFamily: "Montserrat,sans-serif", fontSize: "12px", color: C.slate, marginBottom: "9px", cursor: "pointer", transition: "color 0.2s" }}
                  onMouseEnter={e => e.target.style.color = C.slateXL}
                  onMouseLeave={e => e.target.style.color = C.slate}
                >{l}</p>
              ))}
            </div>
          ))}
        </div>

        <div style={{ borderTop: `1px solid rgba(255,255,255,0.05)`, paddingTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <p style={{ fontFamily: "Montserrat,sans-serif", fontSize: "11px", color: C.slate }}>© {year} Hôtel Aurore. Tous droits réservés.</p>
          <p style={{ fontFamily: "Montserrat,sans-serif", fontSize: "11px", color: C.slate }}>Cannes · Côte d'Azur · France 🇫🇷</p>
        </div>
      </div>
    </footer>
  );
}

/* ─── APP ───────────────────────────────────────────────── */
export default function HotelAurore() {
  return (
    <div style={{ background: C.night, minHeight: "100vh" }}>
      <Nav />
      <Hero />
      <BookingBar />
      <About />
      <Rooms />
      <Restaurant />
      <Services />
      <Gallery />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
}