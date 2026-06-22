import { useState, useEffect, useRef } from "react";

/* ─── DESIGN TOKENS ─────────────────────────────────────── */
const C = {
  night:  "#0F172A",
  nightM: "#1E293B",
  gold:   "#D4AF37",
  goldL:  "#E8CC6A",
  white:  "#FFFFFF",
  ivory:  "#F8F5EE",
  slate:  "#64748B",
  slateL: "#94A3B8",
};

/* ─── CONTENT DATA ──────────────────────────────────────── */
const NAV_LINKS = ["Accueil","À Propos","Hébergement","Restaurant","Services","Galerie","Contact"];

const ROOMS = [
  { id:1, name:"Chambre Classique", tag:"Standard", price:"180", sqm:"28", guests:2,
    desc:"Élégance intemporelle avec vue sur les jardins. Literie grand luxe, marbre italien et lumière naturelle généreuse.",
    amenities:["Wi-Fi Haut Débit","Minibar Premium","Coffre-Fort","Room Service 24h","Smart TV 4K"],
    img:"https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=520&fit=crop&auto=format",
    color:"#1E3A5F" },
  { id:2, name:"Chambre Deluxe", tag:"Deluxe", price:"290", sqm:"40", guests:2,
    desc:"Panorama côtier depuis votre lit. Baignoire îlot en marbre, terrasse privée et accès prioritaire au spa.",
    amenities:["Terrasse Privée","Baignoire Îlot","Peignoirs Hermès","Butler Service","Vue Mer Garantie"],
    img:"https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=520&fit=crop&auto=format",
    color:"#1A3348" },
  { id:3, name:"Suite Junior", tag:"Suite", price:"450", sqm:"65", guests:2,
    desc:"Espace de vie distinct, dressing sur mesure et salle de bain double vasque. L'expérience suites sans compromis.",
    amenities:["Salon Séparé","Double Vasque","Dressing Walk-in","Accès Spa Gratuit","Champagne à l'arrivée"],
    img:"https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=520&fit=crop&auto=format",
    color:"#2C1A3E" },
  { id:4, name:"Suite Familiale", tag:"Famille", price:"520", sqm:"85", guests:4,
    desc:"Deux chambres communicantes, espace ludique pour enfants et conciergerie dédiée pour des vacances sans stress.",
    amenities:["2 Chambres","Espace Enfants","Conciergerie Dédiée","Lit Bébé Inclus","Coffret Bienvenue"],
    img:"https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=520&fit=crop&auto=format",
    color:"#1E3A2F" },
];

const MENU = {
  entrees: [
    { name:"Tartare de Saint-Jacques", desc:"Agrumes, caviar osciètre, émulsion iodée", price:"38", img:"https://images.unsplash.com/photo-1535400255456-984b5f901b62?w=400&h=280&fit=crop&auto=format" },
    { name:"Velouté de Truffes Noires", desc:"Crème légère, copeaux de truffe fraîche du Périgord", price:"45", img:"https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=280&fit=crop&auto=format" },
    { name:"Foie Gras Poêlé", desc:"Brioche maison, chutney de figues, réduction balsamique", price:"42", img:"https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&h=280&fit=crop&auto=format" },
  ],
  plats: [
    { name:"Homard Bleu Rôti", desc:"Beurre noisette, risotto de safran, bisque corsée", price:"89", img:"https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=280&fit=crop&auto=format" },
    { name:"Filet de Bœuf Wagyu", desc:"Sauce périgueux, gratin dauphinois, légumes du moment", price:"95", img:"https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=280&fit=crop&auto=format" },
    { name:"Loup de Méditerranée", desc:"Fenouil confit, vierge d'herbes, huile d'olive première pression", price:"72", img:"https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=280&fit=crop&auto=format" },
  ],
  desserts: [
    { name:"Soufflé au Grand Marnier", desc:"Crème anglaise vanille Bourbon, zestes confits", price:"24", img:"https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400&h=280&fit=crop&auto=format" },
    { name:"Tarte Citron Meringuée", desc:"Crémeux yuzu, meringue italienne, sablé breton", price:"22", img:"https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=280&fit=crop&auto=format" },
    { name:"Chariot des Fromages", desc:"Sélection affinée, noix, miel de lavande AOP", price:"28", img:"https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400&h=280&fit=crop&auto=format" },
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
  { img:"https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=700&h=500&fit=crop&auto=format", span:2, label:"Vue Panoramique" },
  { img:"https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=500&fit=crop&auto=format", span:1, label:"Suite Prestige" },
  { img:"https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=350&fit=crop&auto=format", span:1, label:"Gastronomie" },
  { img:"https://images.unsplash.com/photo-1540541338537-1220059d7d6b?w=400&h=350&fit=crop&auto=format", span:1, label:"Piscine" },
  { img:"https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=700&h=350&fit=crop&auto=format", span:2, label:"Spa & Bien-être" },
];

/* ─── UTILITY HOOKS ─────────────────────────────────────── */
function useScrollReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

/* ─── SMALL COMPONENTS ──────────────────────────────────── */
function GoldLine() {
  return <div style={{ width:"60px", height:"2px", background:`linear-gradient(90deg,${C.gold},${C.goldL})`, margin:"0 auto 24px" }} />;
}

function SectionEyebrow({ children }) {
  return <p style={{ fontFamily:"Montserrat,sans-serif", fontSize:"11px", letterSpacing:"4px", textTransform:"uppercase", color:C.gold, margin:"0 0 12px", textAlign:"center" }}>{children}</p>;
}

function Stars({ n=5 }) {
  return <span style={{ color:C.gold, fontSize:"14px", letterSpacing:"2px" }}>{"★".repeat(n)}</span>;
}

function RevealSection({ children, style={} }) {
  const [ref, visible] = useScrollReveal();
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(40px)",
      transition: "opacity 0.8s ease, transform 0.8s ease",
      ...style
    }}>{children}</div>
  );
}

/* ─── NAV ───────────────────────────────────────────────── */
function Nav({ active }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  function scrollTo(id) {
    setMenuOpen(false);
    const el = document.getElementById(id.toLowerCase().replace(" ","").replace("à","a"));
    if (el) el.scrollIntoView({ behavior:"smooth" });
  }

  return (
    <nav style={{
      position:"fixed", top:0, left:0, right:0, zIndex:1000,
      background: scrolled ? `rgba(15,23,42,0.97)` : "transparent",
      backdropFilter: scrolled ? "blur(16px)" : "none",
      borderBottom: scrolled ? `1px solid rgba(212,175,55,0.2)` : "none",
      transition:"all 0.4s ease",
    }}>
      <div style={{ maxWidth:"1400px", margin:"0 auto", padding:"0 32px", height:"80px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        {/* LOGO */}
        <div style={{ cursor:"pointer" }} onClick={() => scrollTo("accueil")}>
          <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
            <svg width="36" height="36" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="17" fill="none" stroke={C.gold} strokeWidth="1.5"/>
              <path d="M18 6 L22 14 L31 15.5 L24.5 22 L26 31 L18 27 L10 31 L11.5 22 L5 15.5 L14 14 Z" fill={C.gold} opacity="0.9"/>
            </svg>
            <div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"22px", color:C.white, fontWeight:"600", letterSpacing:"3px", lineHeight:1 }}>AURORE</div>
              <div style={{ fontFamily:"Montserrat,sans-serif", fontSize:"8px", color:C.gold, letterSpacing:"5px", textTransform:"uppercase" }}>HÔTEL & SPA</div>
            </div>
          </div>
        </div>

        {/* DESKTOP LINKS */}
        <div style={{ display:"flex", gap:"36px", alignItems:"center" }} className="nav-desktop">
          {NAV_LINKS.slice(0,-1).map(l => (
            <button key={l} onClick={() => scrollTo(l)} style={{
              background:"none", border:"none", cursor:"pointer",
              fontFamily:"Montserrat,sans-serif", fontSize:"11px", letterSpacing:"2px",
              color:C.slateL, textTransform:"uppercase", transition:"color 0.2s",
              padding:0,
            }}
              onMouseEnter={e => e.target.style.color=C.gold}
              onMouseLeave={e => e.target.style.color=C.slateL}
            >{l}</button>
          ))}
          <button onClick={() => scrollTo("Contact")} style={{
            padding:"10px 24px", background:"transparent", border:`1px solid ${C.gold}`,
            color:C.gold, fontFamily:"Montserrat,sans-serif", fontSize:"10px", letterSpacing:"2px",
            textTransform:"uppercase", cursor:"pointer", transition:"all 0.3s",
          }}
            onMouseEnter={e => { e.target.style.background=C.gold; e.target.style.color=C.night; }}
            onMouseLeave={e => { e.target.style.background="transparent"; e.target.style.color=C.gold; }}
          >Réserver</button>
        </div>

        {/* BURGER */}
        <button onClick={() => setMenuOpen(!menuOpen)} style={{ background:"none", border:"none", cursor:"pointer", display:"none", flexDirection:"column", gap:"5px" }} className="burger">
          {[0,1,2].map(i => <span key={i} style={{ width:"24px", height:"1.5px", background:C.gold, display:"block", transition:"all 0.3s", transform: menuOpen && i===0 ? "rotate(45deg) translate(5px,5px)" : menuOpen && i===2 ? "rotate(-45deg) translate(5px,-5px)" : "none", opacity: menuOpen && i===1 ? 0 : 1 }} />)}
        </button>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div style={{ background:`rgba(15,23,42,0.99)`, padding:"24px 32px 32px", borderTop:`1px solid rgba(212,175,55,0.2)` }}>
          {NAV_LINKS.map(l => (
            <button key={l} onClick={() => scrollTo(l)} style={{
              display:"block", width:"100%", textAlign:"left", background:"none", border:"none",
              padding:"14px 0", borderBottom:`1px solid rgba(255,255,255,0.06)`,
              fontFamily:"Montserrat,sans-serif", fontSize:"12px", letterSpacing:"3px",
              color:C.slateL, textTransform:"uppercase", cursor:"pointer",
            }}>{l}</button>
          ))}
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Montserrat:wght@300;400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{background:${C.night};color:${C.white};font-family:'Montserrat',sans-serif}
        @media(max-width:900px){.nav-desktop{display:none!important}.burger{display:flex!important}}
        @media(max-width:768px){.rooms-grid{grid-template-columns:1fr!important}.menu-grid{grid-template-columns:1fr!important}.services-grid{grid-template-columns:1fr 1fr!important}.gallery-grid{grid-template-columns:1fr 1fr!important}.hero-h1{font-size:52px!important}.contact-grid{grid-template-columns:1fr!important}.testimonials-grid{grid-template-columns:1fr!important}}
        @media(max-width:480px){.services-grid{grid-template-columns:1fr!important}.gallery-grid{grid-template-columns:1fr!important}.hero-h1{font-size:38px!important}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(50px)}to{opacity:1;transform:translateY(0)}}
        @keyframes shimmer{0%,100%{opacity:0.6}50%{opacity:1}}
        @keyframes revealLine{from{width:0}to{width:60px}}
        input,textarea,select{font-family:'Montserrat',sans-serif}
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:#0F172A}::-webkit-scrollbar-thumb{background:${C.gold}}
      `}</style>
    </nav>
  );
}

/* ─── HERO ──────────────────────────────────────────────── */
function Hero() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 200); }, []);

  return (
    <section id="accueil" style={{ position:"relative", height:"100vh", minHeight:"680px", overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1800&h=1100&fit=crop&auto=format"
        alt="Hôtel Aurore" style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", objectPosition:"center", transform:loaded?"scale(1.04)":"scale(1.1)", transition:"transform 8s ease" }} />
      <div style={{ position:"absolute", inset:0, background:`linear-gradient(to bottom, rgba(15,23,42,0.55) 0%, rgba(15,23,42,0.2) 40%, rgba(15,23,42,0.7) 100%)` }} />

      {/* Decorative vertical gold line */}
      <div style={{ position:"absolute", left:"50%", top:0, width:"1px", height: loaded?"100px":"0", background:`linear-gradient(to bottom, transparent, ${C.gold})`, transition:"height 1.5s ease 0.5s" }} />

      <div style={{ position:"relative", textAlign:"center", padding:"0 24px" }}>
        <p style={{ fontFamily:"Montserrat,sans-serif", fontSize:"11px", letterSpacing:"6px", textTransform:"uppercase", color:C.gold, marginBottom:"20px", opacity: loaded?1:0, transition:"opacity 0.8s ease 0.8s", animation: loaded ? "none" : "none" }}>
          ✦ Côte Méditerranéenne · Depuis 1924 ✦
        </p>
        <h1 className="hero-h1" style={{
          fontFamily:"'Cormorant Garamond',serif", fontSize:"88px", fontWeight:"300",
          color:C.white, lineHeight:1.05, letterSpacing:"8px", textTransform:"uppercase",
          opacity: loaded?1:0, transform: loaded?"translateY(0)":"translateY(40px)",
          transition:"opacity 1s ease 1s, transform 1s ease 1s",
        }}>
          Hôtel<br /><em style={{ color:C.gold, fontStyle:"italic", fontWeight:"300" }}>Aurore</em>
        </h1>

        <div style={{ width: loaded?"120px":"0", height:"1px", background:C.gold, margin:"28px auto", transition:"width 1.2s ease 1.8s" }} />

        <p style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontSize:"20px", color:"rgba(255,255,255,0.85)", letterSpacing:"2px", marginBottom:"48px", opacity: loaded?1:0, transition:"opacity 0.8s ease 2s" }}>
          L'Art de Vivre à la Française
        </p>

        <div style={{ display:"flex", gap:"16px", justifyContent:"center", flexWrap:"wrap", opacity: loaded?1:0, transition:"opacity 0.8s ease 2.2s" }}>
          <button onClick={() => document.getElementById("hebergement").scrollIntoView({behavior:"smooth"})} style={{
            padding:"16px 40px", background:C.gold, color:C.night, border:"none",
            fontFamily:"Montserrat,sans-serif", fontSize:"11px", fontWeight:"600", letterSpacing:"3px",
            textTransform:"uppercase", cursor:"pointer", transition:"all 0.3s",
          }}
            onMouseEnter={e => e.target.style.background=C.goldL}
            onMouseLeave={e => e.target.style.background=C.gold}
          >Réserver une chambre</button>
          <button onClick={() => document.getElementById("restaurant").scrollIntoView({behavior:"smooth"})} style={{
            padding:"16px 40px", background:"transparent", color:C.white,
            border:`1px solid rgba(255,255,255,0.5)`,
            fontFamily:"Montserrat,sans-serif", fontSize:"11px", fontWeight:"500", letterSpacing:"3px",
            textTransform:"uppercase", cursor:"pointer", transition:"all 0.3s",
          }}
            onMouseEnter={e => { e.target.style.borderColor=C.gold; e.target.style.color=C.gold; }}
            onMouseLeave={e => { e.target.style.borderColor="rgba(255,255,255,0.5)"; e.target.style.color=C.white; }}
          >Découvrir le menu</button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{ position:"absolute", bottom:"32px", left:"50%", transform:"translateX(-50%)", display:"flex", flexDirection:"column", alignItems:"center", gap:"8px", opacity:0.6 }}>
        <span style={{ fontFamily:"Montserrat,sans-serif", fontSize:"9px", letterSpacing:"3px", textTransform:"uppercase", color:C.slateL }}>Découvrir</span>
        <div style={{ width:"1px", height:"40px", background:`linear-gradient(to bottom, ${C.gold}, transparent)`, animation:"shimmer 2s ease infinite" }} />
      </div>
    </section>
  );
}

/* ─── ABOUT ─────────────────────────────────────────────── */
function About() {
  return (
    <section id="apropos" style={{ background:C.ivory, padding:"120px 24px" }}>
      <div style={{ maxWidth:"1200px", margin:"0 auto" }}>
        <RevealSection>
          <SectionEyebrow>Notre Histoire</SectionEyebrow>
          <GoldLine />
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"52px", fontWeight:"300", color:C.night, textAlign:"center", marginBottom:"64px", lineHeight:1.2 }}>
            Un siècle d'excellence<br /><em>méditerranéenne</em>
          </h2>
        </RevealSection>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"80px", alignItems:"center" }}>
          <RevealSection>
            <div style={{ position:"relative" }}>
              <img src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=700&h=500&fit=crop&auto=format"
                alt="Hôtel Aurore histoire" style={{ width:"100%", height:"420px", objectFit:"cover" }} />
              <div style={{ position:"absolute", bottom:"-24px", right:"-24px", background:C.gold, padding:"28px 36px", minWidth:"180px" }}>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"48px", color:C.night, fontWeight:"600", lineHeight:1 }}>1924</div>
                <div style={{ fontFamily:"Montserrat,sans-serif", fontSize:"10px", letterSpacing:"2px", color:C.nightM, textTransform:"uppercase", marginTop:"4px" }}>Fondation</div>
              </div>
            </div>
          </RevealSection>

          <RevealSection>
            <div>
              <p style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontSize:"22px", color:C.nightM, lineHeight:1.7, marginBottom:"28px" }}>
                "Fondé par la famille Aurore en 1924, notre palace incarne l'art de recevoir à la française sur les rives de la Méditerranée."
              </p>
              <p style={{ fontFamily:"Montserrat,sans-serif", fontSize:"14px", color:C.slate, lineHeight:1.9, marginBottom:"24px" }}>
                Cent ans après son inauguration, l'Hôtel Aurore demeure fidèle à ses valeurs fondatrices : l'excellence du service, l'authenticité des matériaux et la sincérité de l'hospitalité. Chaque pierre, chaque boiserie, chaque geste de nos équipes perpétue l'héritage d'une famille passionnée.
              </p>
              <p style={{ fontFamily:"Montserrat,sans-serif", fontSize:"14px", color:C.slate, lineHeight:1.9, marginBottom:"40px" }}>
                Labellisé Palace par Atout France, distingué par le guide Michelin pour notre restaurant, et reconnu par Condé Nast Traveller parmi les cinquante meilleurs hôtels d'Europe, notre établissement conjugue tradition et modernité dans un ballet quotidien d'attentions infinies.
              </p>
              <div style={{ display:"flex", gap:"40px", flexWrap:"wrap" }}>
                {[["100","Ans d'histoire"],["5★","Palace certifié"],["2","Étoiles Michelin"],["48","Suites & chambres"]].map(([n,l]) => (
                  <div key={l}>
                    <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"36px", color:C.gold, fontWeight:"600" }}>{n}</div>
                    <div style={{ fontFamily:"Montserrat,sans-serif", fontSize:"10px", letterSpacing:"2px", color:C.slate, textTransform:"uppercase" }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </RevealSection>
        </div>

        {/* Values */}
        <RevealSection style={{ marginTop:"100px" }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"2px", background:C.night }} className="services-grid">
            {[
              { icon:"🤍", title:"Excellence", text:"Chaque détail est pensé pour dépasser vos attentes. Notre équipe de 120 collaborateurs se forme continuellement aux standards des palaces internationaux." },
              { icon:"🌿", title:"Authenticité", text:"Produits locaux, artisans régionaux, architecture préservée. Nous célébrons le terroir méditerranéen dans chaque aspect de l'expérience Aurore." },
              { icon:"♻️", title:"Responsabilité", text:"Certifié Green Key, nous œuvrons chaque jour pour un luxe respectueux : énergies renouvelables, zéro déchet alimentaire, potager biologique." },
            ].map(v => (
              <div key={v.title} style={{ background:C.ivory, padding:"48px 40px", textAlign:"center" }}>
                <div style={{ fontSize:"32px", marginBottom:"20px" }}>{v.icon}</div>
                <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"26px", color:C.night, marginBottom:"16px", fontWeight:"500" }}>{v.title}</h3>
                <p style={{ fontFamily:"Montserrat,sans-serif", fontSize:"13px", color:C.slate, lineHeight:1.9 }}>{v.text}</p>
              </div>
            ))}
          </div>
        </RevealSection>
      </div>
    </section>
  );
}

/* ─── ROOMS ─────────────────────────────────────────────── */
function RoomCard({ room }) {
  const [hover, setHover] = useState(false);
  const [ref, visible] = useScrollReveal(0.1);

  return (
    <div ref={ref} style={{ opacity:visible?1:0, transform:visible?"translateY(0)":"translateY(50px)", transition:"opacity 0.7s ease, transform 0.7s ease" }}>
      <div style={{ position:"relative", overflow:"hidden", cursor:"pointer" }}
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
        <img src={room.img} alt={room.name} style={{ width:"100%", height:"320px", objectFit:"cover", transform:hover?"scale(1.06)":"scale(1)", transition:"transform 0.6s ease", display:"block" }} />
        <div style={{ position:"absolute", inset:0, background: hover?"rgba(15,23,42,0.5)":"rgba(15,23,42,0.15)", transition:"background 0.4s" }} />
        <div style={{ position:"absolute", top:"20px", left:"20px", background:C.gold, padding:"4px 14px" }}>
          <span style={{ fontFamily:"Montserrat,sans-serif", fontSize:"9px", letterSpacing:"2px", fontWeight:"600", color:C.night, textTransform:"uppercase" }}>{room.tag}</span>
        </div>
        <div style={{ position:"absolute", bottom:"20px", right:"20px", background:`rgba(15,23,42,0.9)`, padding:"8px 16px", opacity:hover?1:0, transition:"opacity 0.3s" }}>
          <span style={{ fontFamily:"Montserrat,sans-serif", fontSize:"10px", color:C.gold, letterSpacing:"2px" }}>Voir les détails →</span>
        </div>
      </div>
      <div style={{ background:C.night, padding:"32px", borderBottom:`2px solid ${C.gold}` }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"16px" }}>
          <div>
            <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"28px", color:C.white, fontWeight:"400", marginBottom:"6px" }}>{room.name}</h3>
            <p style={{ fontFamily:"Montserrat,sans-serif", fontSize:"11px", color:C.slateL, letterSpacing:"1px" }}>{room.sqm} m² · {room.guests} personnes max.</p>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"32px", color:C.gold, fontWeight:"600" }}>{room.price}€</div>
            <div style={{ fontFamily:"Montserrat,sans-serif", fontSize:"9px", color:C.slateL, letterSpacing:"1px" }}>/ nuit</div>
          </div>
        </div>
        <p style={{ fontFamily:"Montserrat,sans-serif", fontSize:"13px", color:C.slateL, lineHeight:1.8, marginBottom:"24px" }}>{room.desc}</p>
        <div style={{ display:"flex", flexWrap:"wrap", gap:"8px", marginBottom:"28px" }}>
          {room.amenities.map(a => (
            <span key={a} style={{ fontFamily:"Montserrat,sans-serif", fontSize:"10px", color:C.slateL, border:`1px solid rgba(100,116,139,0.4)`, padding:"4px 12px", letterSpacing:"0.5px" }}>✓ {a}</span>
          ))}
        </div>
        <button style={{
          width:"100%", padding:"14px", background:"transparent", border:`1px solid ${C.gold}`,
          color:C.gold, fontFamily:"Montserrat,sans-serif", fontSize:"10px", letterSpacing:"3px",
          textTransform:"uppercase", cursor:"pointer", transition:"all 0.3s",
        }}
          onMouseEnter={e => { e.target.style.background=C.gold; e.target.style.color=C.night; }}
          onMouseLeave={e => { e.target.style.background="transparent"; e.target.style.color=C.gold; }}
        >Réserver cette chambre</button>
      </div>
    </div>
  );
}

function Rooms() {
  return (
    <section id="hebergement" style={{ background:C.night, padding:"120px 24px" }}>
      <div style={{ maxWidth:"1400px", margin:"0 auto" }}>
        <RevealSection>
          <SectionEyebrow>Nos Hébergements</SectionEyebrow>
          <GoldLine />
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"52px", fontWeight:"300", color:C.white, textAlign:"center", marginBottom:"72px", lineHeight:1.2 }}>
            Chambres & <em style={{ color:C.gold }}>Suites</em>
          </h2>
        </RevealSection>
        <div className="rooms-grid" style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"2px" }}>
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
    <div style={{ background:C.night, border:`1px solid rgba(212,175,55,${hover?0.4:0.1})`, transition:"border-color 0.3s", cursor:"pointer" }}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <div style={{ overflow:"hidden", height:"180px" }}>
        <img src={item.img} alt={item.name} style={{ width:"100%", height:"100%", objectFit:"cover", transform:hover?"scale(1.07)":"scale(1)", transition:"transform 0.5s" }} />
      </div>
      <div style={{ padding:"24px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"10px" }}>
          <h4 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"20px", color:C.white, fontWeight:"400", flex:1, marginRight:"12px" }}>{item.name}</h4>
          <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"22px", color:C.gold, fontWeight:"600", whiteSpace:"nowrap" }}>{item.price}€</span>
        </div>
        <p style={{ fontFamily:"Montserrat,sans-serif", fontSize:"12px", color:C.slateL, lineHeight:1.7, fontStyle:"italic" }}>{item.desc}</p>
      </div>
    </div>
  );
}

function Restaurant() {
  const [tab, setTab] = useState("entrees");
  const tabs = [["entrees","Entrées"],["plats","Plats"],["desserts","Desserts"]];
  return (
    <section id="restaurant" style={{ background:`linear-gradient(180deg,${C.nightM} 0%,${C.night} 100%)`, padding:"120px 24px" }}>
      <div style={{ maxWidth:"1200px", margin:"0 auto" }}>
        <RevealSection>
          <SectionEyebrow>Le Grand Restaurant</SectionEyebrow>
          <GoldLine />
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"52px", fontWeight:"300", color:C.white, textAlign:"center", marginBottom:"16px", lineHeight:1.2 }}>
            La Table <em style={{ color:C.gold }}>Dorée</em>
          </h2>
          <p style={{ fontFamily:"Montserrat,sans-serif", fontSize:"13px", color:C.slateL, textAlign:"center", maxWidth:"520px", margin:"0 auto 56px", lineHeight:1.9 }}>
            Deux étoiles Michelin. Notre Chef Exécutif Julien Marceau sublime les produits de la Méditerranée avec une créativité sans compromis.
          </p>
          {/* Tab Nav */}
          <div style={{ display:"flex", justifyContent:"center", gap:"0", marginBottom:"56px" }}>
            {tabs.map(([k,l]) => (
              <button key={k} onClick={() => setTab(k)} style={{
                padding:"14px 36px", background: tab===k ? C.gold : "transparent",
                color: tab===k ? C.night : C.slateL,
                border:`1px solid ${tab===k?C.gold:"rgba(212,175,55,0.3)"}`,
                fontFamily:"Montserrat,sans-serif", fontSize:"10px", letterSpacing:"3px",
                textTransform:"uppercase", cursor:"pointer", transition:"all 0.3s", fontWeight: tab===k?"700":"400",
              }}>{l}</button>
            ))}
          </div>
        </RevealSection>

        <div className="menu-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"2px" }}>
          {MENU[tab].map(item => <MenuItem key={item.name} item={item} />)}
        </div>

        {/* Hero dish */}
        <RevealSection style={{ marginTop:"80px" }}>
          <div style={{ position:"relative", overflow:"hidden" }}>
            <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1400&h=480&fit=crop&auto=format" alt="Restaurant" style={{ width:"100%", height:"380px", objectFit:"cover", display:"block" }} />
            <div style={{ position:"absolute", inset:0, background:"rgba(15,23,42,0.7)", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", padding:"40px" }}>
              <p style={{ fontFamily:"Montserrat,sans-serif", fontSize:"10px", letterSpacing:"4px", color:C.gold, textTransform:"uppercase", marginBottom:"16px" }}>Réservation recommandée</p>
              <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"40px", color:C.white, fontWeight:"300", marginBottom:"28px" }}>Ouvert chaque soir de 19h à 23h</h3>
              <button style={{ padding:"14px 40px", background:C.gold, color:C.night, border:"none", fontFamily:"Montserrat,sans-serif", fontSize:"10px", letterSpacing:"3px", textTransform:"uppercase", fontWeight:"700", cursor:"pointer" }}>
                Réserver une table
              </button>
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
    <section id="services" style={{ background:C.ivory, padding:"120px 24px" }}>
      <div style={{ maxWidth:"1200px", margin:"0 auto" }}>
        <RevealSection>
          <SectionEyebrow>Nos Prestations</SectionEyebrow>
          <GoldLine />
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"52px", fontWeight:"300", color:C.night, textAlign:"center", marginBottom:"72px", lineHeight:1.2 }}>
            Tout pour votre <em>confort</em>
          </h2>
        </RevealSection>

        <div className="services-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"2px", background:C.night }}>
          {SERVICES.map((s,i) => {
            const [ref,vis] = useScrollReveal(0.1);
            return (
              <div ref={ref} key={s.name} style={{
                background:C.ivory, padding:"48px 36px", textAlign:"center",
                opacity:vis?1:0, transform:vis?"translateY(0)":"translateY(30px)",
                transition:`opacity 0.6s ease ${i*0.1}s, transform 0.6s ease ${i*0.1}s`,
                cursor:"default",
              }}>
                <div style={{ fontSize:"40px", marginBottom:"20px", filter:"grayscale(0.2)" }}>{s.icon}</div>
                <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"22px", color:C.night, marginBottom:"14px", fontWeight:"500" }}>{s.name}</h3>
                <div style={{ width:"32px", height:"1px", background:C.gold, margin:"0 auto 20px" }} />
                <p style={{ fontFamily:"Montserrat,sans-serif", fontSize:"12px", color:C.slate, lineHeight:1.9 }}>{s.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Spa banner */}
        <RevealSection style={{ marginTop:"80px" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:0, background:C.night, overflow:"hidden" }} className="rooms-grid">
            <img src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=700&h=400&fit=crop&auto=format" alt="Spa" style={{ width:"100%", height:"360px", objectFit:"cover", display:"block" }} />
            <div style={{ padding:"56px 48px", display:"flex", flexDirection:"column", justifyContent:"center" }}>
              <p style={{ fontFamily:"Montserrat,sans-serif", fontSize:"10px", letterSpacing:"3px", color:C.gold, textTransform:"uppercase", marginBottom:"16px" }}>Spa Aurore</p>
              <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"38px", color:C.white, fontWeight:"300", lineHeight:1.3, marginBottom:"20px" }}>Un sanctuaire de sérénité face à la mer</h3>
              <p style={{ fontFamily:"Montserrat,sans-serif", fontSize:"13px", color:C.slateL, lineHeight:1.9, marginBottom:"32px" }}>
                Notre spa de 2 000 m² propose des soins exclusifs Sisley Paris, des rituels méditerranéens et une thalassothérapie intégrée. Réservé aux résidents de 8h à 22h.
              </p>
              <button style={{ alignSelf:"flex-start", padding:"14px 32px", background:"transparent", border:`1px solid ${C.gold}`, color:C.gold, fontFamily:"Montserrat,sans-serif", fontSize:"10px", letterSpacing:"3px", textTransform:"uppercase", cursor:"pointer" }}>
                Découvrir le spa
              </button>
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
  return (
    <section id="galerie" style={{ background:C.night, padding:"120px 24px" }}>
      <div style={{ maxWidth:"1400px", margin:"0 auto" }}>
        <RevealSection>
          <SectionEyebrow>Galerie</SectionEyebrow>
          <GoldLine />
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"52px", fontWeight:"300", color:C.white, textAlign:"center", marginBottom:"72px", lineHeight:1.2 }}>
            L'Aurore en <em style={{ color:C.gold }}>images</em>
          </h2>
        </RevealSection>

        <div className="gallery-grid" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"4px" }}>
          {GALLERY.map((g,i) => {
            const [ref,vis] = useScrollReveal(0.05);
            return (
              <div key={i} ref={ref} style={{
                gridColumn:`span ${g.span}`, position:"relative", overflow:"hidden", cursor:"pointer",
                opacity:vis?1:0, transition:`opacity 0.6s ease ${i*0.12}s`,
              }} onClick={() => setActive(g)}>
                <img src={g.img} alt={g.label} style={{ width:"100%", height: g.span===2?"340px":"240px", objectFit:"cover", display:"block", transition:"transform 0.5s" }}
                  onMouseEnter={e => e.target.style.transform="scale(1.05)"}
                  onMouseLeave={e => e.target.style.transform="scale(1)"}
                />
                <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"20px 24px", background:"linear-gradient(transparent,rgba(15,23,42,0.8))" }}>
                  <span style={{ fontFamily:"Montserrat,sans-serif", fontSize:"10px", color:C.gold, letterSpacing:"3px", textTransform:"uppercase" }}>{g.label}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Lightbox */}
        {active && (
          <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.92)", zIndex:2000, display:"flex", alignItems:"center", justifyContent:"center", padding:"24px" }}
            onClick={() => setActive(null)}>
            <img src={active.img} alt={active.label} style={{ maxWidth:"90vw", maxHeight:"85vh", objectFit:"contain" }} />
            <button onClick={() => setActive(null)} style={{ position:"fixed", top:"24px", right:"24px", background:C.gold, border:"none", color:C.night, fontSize:"20px", width:"44px", height:"44px", cursor:"pointer", fontWeight:"700" }}>×</button>
          </div>
        )}
      </div>
    </section>
  );
}

/* ─── TESTIMONIALS ──────────────────────────────────────── */
function Testimonials() {
  return (
    <section style={{ background:C.nightM, padding:"120px 24px", borderTop:`1px solid rgba(212,175,55,0.15)`, borderBottom:`1px solid rgba(212,175,55,0.15)` }}>
      <div style={{ maxWidth:"1200px", margin:"0 auto" }}>
        <RevealSection>
          <SectionEyebrow>Témoignages</SectionEyebrow>
          <GoldLine />
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"52px", fontWeight:"300", color:C.white, textAlign:"center", marginBottom:"72px", lineHeight:1.2 }}>
            Ce que disent<br />nos <em style={{ color:C.gold }}>hôtes</em>
          </h2>
        </RevealSection>
        <div className="testimonials-grid" style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"2px" }}>
          {TESTIMONIALS.map((t,i) => {
            const [ref,vis] = useScrollReveal(0.1);
            return (
              <div ref={ref} key={t.name} style={{
                background:C.night, padding:"48px 40px",
                borderLeft: i%2===0?`3px solid ${C.gold}`:"none",
                borderRight: i%2!==0?`3px solid ${C.gold}`:"none",
                opacity:vis?1:0, transform:vis?"translateY(0)":"translateY(30px)",
                transition:`opacity 0.7s ease ${i*0.15}s, transform 0.7s ease ${i*0.15}s`,
              }}>
                <Stars />
                <p style={{ fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontSize:"19px", color:C.slateL, lineHeight:1.8, margin:"20px 0 28px" }}>"{t.text}"</p>
                <div>
                  <p style={{ fontFamily:"Montserrat,sans-serif", fontSize:"12px", color:C.white, fontWeight:"600", letterSpacing:"1px" }}>{t.name}</p>
                  <p style={{ fontFamily:"Montserrat,sans-serif", fontSize:"11px", color:C.slateL, marginTop:"4px" }}>{t.country}</p>
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
  const [form, setForm] = useState({ nom:"", tel:"", email:"", message:"" });
  const [sent, setSent] = useState(false);
  function handleSubmit() { if(form.nom&&form.email) { setSent(true); setTimeout(()=>setSent(false),3000); setForm({nom:"",tel:"",email:"",message:""}); } }

  const inputStyle = {
    width:"100%", padding:"14px 18px", background:"rgba(255,255,255,0.05)",
    border:`1px solid rgba(212,175,55,0.25)`, color:C.white,
    fontFamily:"Montserrat,sans-serif", fontSize:"13px", outline:"none",
    transition:"border-color 0.3s",
  };

  return (
    <section id="contact" style={{ background:C.night, padding:"120px 24px" }}>
      <div style={{ maxWidth:"1200px", margin:"0 auto" }}>
        <RevealSection>
          <SectionEyebrow>Contact & Réservation</SectionEyebrow>
          <GoldLine />
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"52px", fontWeight:"300", color:C.white, textAlign:"center", marginBottom:"72px", lineHeight:1.2 }}>
            Nous sommes à<br /><em style={{ color:C.gold }}>votre disposition</em>
          </h2>
        </RevealSection>

        <div className="contact-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"80px" }}>
          {/* Info */}
          <RevealSection>
            <div>
              {[
                { icon:"📍", label:"Adresse", value:"1 Promenade des Palmiers\n06400 Cannes, France" },
                { icon:"📞", label:"Téléphone", value:"+33 (0)4 93 00 00 00" },
                { icon:"✉️", label:"Email", value:"concierge@hotel-aurore.fr" },
                { icon:"🕐", label:"Réception", value:"Ouverte 24h/24 · 7j/7" },
              ].map(i => (
                <div key={i.label} style={{ display:"flex", gap:"20px", marginBottom:"36px", paddingBottom:"36px", borderBottom:`1px solid rgba(212,175,55,0.1)` }}>
                  <div style={{ fontSize:"22px", flexShrink:0, marginTop:"2px" }}>{i.icon}</div>
                  <div>
                    <p style={{ fontFamily:"Montserrat,sans-serif", fontSize:"10px", letterSpacing:"2px", color:C.gold, textTransform:"uppercase", marginBottom:"8px" }}>{i.label}</p>
                    <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"18px", color:C.white, lineHeight:1.6, whiteSpace:"pre-line" }}>{i.value}</p>
                  </div>
                </div>
              ))}

              <div>
                <p style={{ fontFamily:"Montserrat,sans-serif", fontSize:"10px", letterSpacing:"2px", color:C.gold, textTransform:"uppercase", marginBottom:"16px" }}>Suivez-nous</p>
                <div style={{ display:"flex", gap:"12px" }}>
                  {["Instagram","Facebook","TripAdvisor"].map(sn => (
                    <button key={sn} style={{ padding:"10px 18px", background:"transparent", border:`1px solid rgba(212,175,55,0.3)`, color:C.slateL, fontFamily:"Montserrat,sans-serif", fontSize:"10px", letterSpacing:"1px", cursor:"pointer", transition:"all 0.3s" }}
                      onMouseEnter={e => { e.target.style.borderColor=C.gold; e.target.style.color=C.gold; }}
                      onMouseLeave={e => { e.target.style.borderColor="rgba(212,175,55,0.3)"; e.target.style.color=C.slateL; }}
                    >{sn}</button>
                  ))}
                </div>
              </div>
            </div>
          </RevealSection>

          {/* Form */}
          <RevealSection>
            <div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px", marginBottom:"16px" }}>
                <input value={form.nom} onChange={e=>setForm({...form,nom:e.target.value})} placeholder="Votre nom *" style={inputStyle}
                  onFocus={e=>e.target.style.borderColor=C.gold} onBlur={e=>e.target.style.borderColor="rgba(212,175,55,0.25)"} />
                <input value={form.tel} onChange={e=>setForm({...form,tel:e.target.value})} placeholder="Téléphone" style={inputStyle}
                  onFocus={e=>e.target.style.borderColor=C.gold} onBlur={e=>e.target.style.borderColor="rgba(212,175,55,0.25)"} />
              </div>
              <input value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="Adresse email *" style={{...inputStyle, marginBottom:"16px"}}
                onFocus={e=>e.target.style.borderColor=C.gold} onBlur={e=>e.target.style.borderColor="rgba(212,175,55,0.25)"} />
              <textarea value={form.message} onChange={e=>setForm({...form,message:e.target.value})} placeholder="Votre message ou demande de réservation..." rows={6} style={{...inputStyle, resize:"vertical", marginBottom:"24px"}}
                onFocus={e=>e.target.style.borderColor=C.gold} onBlur={e=>e.target.style.borderColor="rgba(212,175,55,0.25)"} />
              <button onClick={handleSubmit} style={{
                width:"100%", padding:"16px", background:sent?C.goldL:C.gold, color:C.night,
                border:"none", fontFamily:"Montserrat,sans-serif", fontSize:"11px", fontWeight:"700",
                letterSpacing:"3px", textTransform:"uppercase", cursor:"pointer", transition:"all 0.3s",
              }}>
                {sent ? "✓ Message envoyé" : "Envoyer le message"}
              </button>

              {/* Map placeholder */}
              <div style={{ marginTop:"28px", position:"relative", overflow:"hidden", height:"200px" }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2888.0!2d7.015!3d43.552!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDPCsDMzJzA3LjIiTiA3wrAwMCc1NC4wIkU!5e0!3m2!1sfr!2sfr!4v1"
                  width="100%" height="200" style={{ border:0, filter:"grayscale(0.8) contrast(1.1)", display:"block" }}
                  loading="lazy" title="Carte Hôtel Aurore"
                />
              </div>
            </div>
          </RevealSection>
        </div>
      </div>
    </section>
  );
}

/* ─── FOOTER ────────────────────────────────────────────── */
function Footer() {
  return (
    <footer style={{ background:"#06090F", borderTop:`1px solid rgba(212,175,55,0.2)`, padding:"64px 24px 32px" }}>
      <div style={{ maxWidth:"1200px", margin:"0 auto" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:"48px", marginBottom:"56px" }}>
          {/* Brand */}
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"20px" }}>
              <svg width="32" height="32" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="17" fill="none" stroke={C.gold} strokeWidth="1.5"/>
                <path d="M18 6 L22 14 L31 15.5 L24.5 22 L26 31 L18 27 L10 31 L11.5 22 L5 15.5 L14 14 Z" fill={C.gold} opacity="0.9"/>
              </svg>
              <div>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"20px", color:C.white, fontWeight:"600", letterSpacing:"3px" }}>AURORE</div>
                <div style={{ fontFamily:"Montserrat,sans-serif", fontSize:"8px", color:C.gold, letterSpacing:"4px", textTransform:"uppercase" }}>HÔTEL & SPA</div>
              </div>
            </div>
            <p style={{ fontFamily:"Montserrat,sans-serif", fontSize:"12px", color:C.slate, lineHeight:1.9, maxWidth:"260px" }}>
              Palace 5 étoiles sur la Côte d'Azur.<br />Membre des Relais & Châteaux.
            </p>
          </div>

          {/* Links */}
          {[
            { title:"Navigation", links:["Accueil","À Propos","Hébergement","Restaurant","Services","Galerie","Contact"] },
            { title:"Informations", links:["Arrivée & Départ","Politique d'annulation","Accessibilité","Presse","Offres exclusives"] },
            { title:"Labels", links:["Palace Atout France","2 Étoiles Michelin","Relais & Châteaux","Green Key","Forbes 5 Stars"] },
          ].map(col => (
            <div key={col.title}>
              <h4 style={{ fontFamily:"Montserrat,sans-serif", fontSize:"10px", letterSpacing:"3px", color:C.gold, textTransform:"uppercase", marginBottom:"20px" }}>{col.title}</h4>
              {col.links.map(l => <p key={l} style={{ fontFamily:"Montserrat,sans-serif", fontSize:"12px", color:C.slate, marginBottom:"10px", cursor:"pointer", transition:"color 0.2s" }}
                onMouseEnter={e=>e.target.style.color=C.slateL} onMouseLeave={e=>e.target.style.color=C.slate}>{l}</p>)}
            </div>
          ))}
        </div>

        <div style={{ borderTop:`1px solid rgba(255,255,255,0.06)`, paddingTop:"28px", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"16px" }}>
          <p style={{ fontFamily:"Montserrat,sans-serif", fontSize:"11px", color:C.slate }}>© 2024 Hôtel Aurore. Tous droits réservés.</p>
          <p style={{ fontFamily:"Montserrat,sans-serif", fontSize:"11px", color:C.slate }}>Cannes · Côte d'Azur · France 🇫🇷</p>
        </div>
      </div>
    </footer>
  );
}

/* ─── APP ───────────────────────────────────────────────── */
export default function HotelAurore() {
  return (
    <div style={{ background:C.night, minHeight:"100vh" }}>
      <Nav />
      <Hero />
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
