import { useState, useRef, useEffect, useCallback } from "react";

// ─── SUPABASE ─────────────────────────────────────────────────────────────────
const SUPABASE_URL = "https://ufapgzdeupqjmzhlpmts.supabase.co";
const SUPABASE_KEY = "sb_publishable_Pd7_o9ORSkShf1D4-nZkgA_VeBKLiVj";

async function sbFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "Prefer": "return=representation",
      ...(options.headers || {}),
    },
  });
  const text = await res.text();
  return text ? JSON.parse(text) : [];
}

async function uploadPhoto(file: File): Promise<string | null> {
  const ext = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/pet-photos/${fileName}`, {
    method: "POST",
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "Content-Type": file.type,
    },
    body: file,
  });
  if (!res.ok) return null;
  return `${SUPABASE_URL}/storage/v1/object/public/pet-photos/${fileName}`;
}

// ─── COLORS ───────────────────────────────────────────────────────────────────
const C = {
  bg: "#0d1117", card: "#161b22", card2: "#1c2128",
  border: "#30363d", border2: "#21262d",
  white: "#ffffff", muted: "#8b949e", muted2: "#6e7681",
  orange: "#f0a030", green: "#3fb950", red: "#f85149", blue: "#58a6ff",
  purple: "#bc8cff", yellow: "#e3b341",
};

const INP: React.CSSProperties = {
  width: "100%", background: "#f6f8fa", border: "2px solid #d0d7de",
  borderRadius: 10, padding: "13px 15px", color: "#1a1a1a",
  fontSize: 15, fontWeight: 500, outline: "none",
  WebkitAppearance: "none", boxSizing: "border-box",
  colorScheme: "light" as const,
};

const COUNTRIES = ["USA","Canada","UK","Australia","Germany","France","Spain","Italy","Netherlands","Poland","Ukraine","Russia","Kazakhstan","Mexico","Brazil","India","China","Japan","South Korea","Israel","UAE","Argentina","Turkey","Sweden","Norway","Denmark","Finland","Switzerland","Austria","Belgium","Czech Republic","Hungary","Romania","Bulgaria","Greece","Portugal","New Zealand","Singapore","Malaysia","Thailand","Philippines","Vietnam","Indonesia","South Africa","Egypt","Morocco","Nigeria","Kenya","Other"];

const PET_TYPES = [
  {en:"Dog",icon:"🐕"},{en:"Cat",icon:"🐈"},{en:"Rabbit",icon:"🐇"},
  {en:"Bird",icon:"🦜"},{en:"Hamster",icon:"🐹"},{en:"Reptile",icon:"🦎"},{en:"Other",icon:"🐾"},
];
const PET_ICONS: Record<string,string> = {Dog:"🐕",Cat:"🐈",Rabbit:"🐇",Bird:"🦜",Hamster:"🐹",Reptile:"🦎",Other:"🐾"};

interface Listing {
  id: string; type: string; from_location: string; to_location: string;
  country: string; animal_name?: string; pet_type?: string; weight: number;
  date_from?: string; date_to?: string; avatar: string;
  open_chat: boolean; open_calls: boolean; open_sms: boolean;
  phone?: string; notes?: string; radius_from: number; radius_to: number;
  user_name: string; fb_connected: boolean; phone_verified: boolean;
  member_since: string; rating: number; reviews: number;
  pet_photo?: string; created_at: string;
}

// ─── ALL COMPONENTS DEFINED OUTSIDE APP (fixes focus loss bug) ───────────────

const Stars = ({rating}:{rating:number}) => (
  <span style={{color:C.yellow,fontSize:13}}>
    {"★".repeat(Math.floor(rating))}{"☆".repeat(5-Math.floor(rating))} {rating.toFixed(1)}
  </span>
);

const TrustBadges = ({l}:{l:Listing}) => (
  <div style={{display:"flex",gap:6,flexWrap:"wrap" as const,marginTop:4}}>
    {l.fb_connected && <span style={{fontSize:10,background:"rgba(88,166,255,.15)",color:C.blue,padding:"2px 8px",borderRadius:100,fontWeight:600}}>f Facebook connected</span>}
    {l.phone_verified && <span style={{fontSize:10,background:"rgba(63,185,80,.15)",color:C.green,padding:"2px 8px",borderRadius:100,fontWeight:600}}>📱 Phone verified</span>}
    <span style={{fontSize:10,background:"rgba(139,148,158,.1)",color:C.muted,padding:"2px 8px",borderRadius:100}}>Member since {l.member_since}</span>
  </div>
);

// ── Field — MUST be outside App to prevent focus loss ──
const Field = ({label,ph,val,onChange,type="text",multiline=false}:{label:string,ph:string,val:string,onChange:(v:string)=>void,type?:string,multiline?:boolean}) => (
  <div style={{marginBottom:16}}>
    {label && <div style={{fontSize:10,letterSpacing:"1.5px",textTransform:"uppercase" as const,color:C.muted,marginBottom:7,fontWeight:600}}>{label}</div>}
    {multiline
      ? <textarea placeholder={ph} value={val} onChange={e=>onChange(e.target.value)} rows={3} style={{...INP,resize:"none" as const}}/>
      : <input
          type={type} placeholder={ph} value={val}
          onChange={e=>onChange(e.target.value)}
          style={INP}
          onFocus={e=>{e.target.style.borderColor=C.orange;e.target.style.boxShadow=`0 0 0 3px rgba(240,160,48,.15)`;}}
          onBlur={e=>{e.target.style.borderColor="#d0d7de";e.target.style.boxShadow="none";}}
        />
    }
  </div>
);

const Toggle = ({label,sub,checked,onChange}:{label:string,sub?:string,checked:boolean,onChange:()=>void}) => (
  <div onClick={onChange} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 14px",background:C.card,border:`1px solid ${checked?C.green:C.border}`,borderRadius:10,marginBottom:10,cursor:"pointer"}}>
    <div>
      <div style={{fontSize:14,color:C.white,fontWeight:500}}>{label}</div>
      {sub && <div style={{fontSize:12,color:C.muted,marginTop:2}}>{sub}</div>}
    </div>
    <div style={{width:42,height:22,borderRadius:11,background:checked?C.green:C.border,position:"relative",flexShrink:0,transition:"background .2s"}}>
      <div style={{width:16,height:16,borderRadius:"50%",background:C.white,position:"absolute",top:3,left:checked?23:3,transition:"left .2s"}}/>
    </div>
  </div>
);

const Divider = ({label}:{label:string}) => (
  <div style={{display:"flex",alignItems:"center",gap:12,margin:"20px 0"}}>
    <div style={{flex:1,height:1,background:C.border}}/>
    <span style={{fontSize:10,letterSpacing:"2px",textTransform:"uppercase" as const,color:C.muted2,fontWeight:600,whiteSpace:"nowrap" as const}}>{label}</span>
    <div style={{flex:1,height:1,background:C.border}}/>
  </div>
);

const Slider = ({label,val,onChange,color="orange"}:{label:string,val:number,onChange:(v:number)=>void,color?:string}) => (
  <div style={{background:C.card,border:`2px solid ${C.border}`,borderRadius:12,padding:"16px 16px 10px",marginBottom:16}}>
    <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
      <span style={{fontSize:13,color:"#c9d1d9"}}>{label}</span>
      <span style={{fontWeight:800,fontSize:24,color:color==="green"?C.green:C.orange}}>{val}<span style={{fontSize:12,fontWeight:500,color:C.muted}}> mi</span></span>
    </div>
    <input type="range" min={0} max={300} step={5} value={val} onChange={e=>onChange(Number(e.target.value))} style={{width:"100%",cursor:"pointer",accentColor:color==="green"?C.green:C.orange}}/>
    <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
      <span style={{fontSize:10,color:C.muted2}}>0 mi</span>
      <span style={{fontSize:10,color:C.muted2}}>300 mi</span>
    </div>
  </div>
);

const SubmitBtn = ({label,onClick,disabled=false}:{label:string,onClick:()=>void,disabled?:boolean}) => (
  <button onClick={onClick} disabled={disabled} style={{width:"100%",background:disabled?"#555":C.orange,border:"none",borderRadius:14,padding:17,color:C.bg,fontWeight:700,fontSize:16,cursor:disabled?"default":"pointer",marginTop:8}}>
    {label}
  </button>
);

const TESTIMONIALS = [
  {name:"Sarah M.",location:"Lincoln, NE → Dallas, TX",pet:"Golden Retriever",text:"Found a driver going exactly our route within 2 days. Buddy arrived happy and safe. Saved us over $800!",avatar:"🐕",rating:5},
  {name:"Anna K.",location:"Berlin → Munich",pet:"Persian Cat",text:"Luna gets anxious in cargo. With PetAlong she rode in the cabin the whole way. The driver sent updates every hour.",avatar:"🐈",rating:5},
  {name:"Carlos M.",location:"Phoenix, AZ → Houston, TX",pet:"Parrot",text:"Didn't think anyone would take a parrot but found a bird lover driver in 3 days. Raven loved the trip!",avatar:"🦜",rating:5},
  {name:"Mike D.",location:"Chicago, IL → Miami, FL",pet:"Driver",text:"As a driver I've taken 6 pets so far. Great extra income on trips I was already making. Simple platform.",avatar:"🚐",rating:5},
  {name:"Jennifer L.",location:"Denver, CO → Los Angeles",pet:"Labrador",text:"Max is 80lbs so flying wasn't an option. PetAlong matched us with an SUV driver in 4 days. Best experience.",avatar:"🐕",rating:5},
];

const openMaps = (a: string, b: string) =>
  window.open(`https://www.google.com/maps/dir/${encodeURIComponent(a)}/${encodeURIComponent(b)}`, "_blank");

// ─── COUNTRY PICKER — outside App ────────────────────────────────────────────
const CountryPicker = ({selected,onSelect}:{selected:string,onSelect:(c:string)=>void}) => {
  const [open,setOpen] = useState(false);
  const [search,setSearch] = useState("");
  const filtered = COUNTRIES.filter(c=>c.toLowerCase().includes(search.toLowerCase()));
  return (
    <div style={{marginBottom:16,position:"relative"}}>
      <div style={{fontSize:10,letterSpacing:"1.5px",textTransform:"uppercase" as const,color:C.muted,marginBottom:7,fontWeight:600}}>🌍 Country</div>
      <div onClick={()=>setOpen(!open)} style={{...INP,display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer",userSelect:"none" as const}}>
        <span style={{color:"#1a1a1a",fontWeight:500}}>{selected}</span>
        <span style={{color:"#444",fontSize:20,lineHeight:1,fontWeight:400}}>⌄</span>
      </div>
      {open && (
        <div style={{position:"absolute",top:"100%",left:0,right:0,background:"#fff",border:`2px solid ${C.orange}`,borderRadius:10,zIndex:100,maxHeight:240,overflowY:"auto" as const,boxShadow:"0 8px 32px rgba(0,0,0,.4)"}}>
          <input autoFocus placeholder="Search country..." value={search} onChange={e=>setSearch(e.target.value)} style={{...INP,borderRadius:"8px 8px 0 0",borderLeft:"none",borderRight:"none",borderTop:"none"}}/>
          {filtered.map(c=>(
            <div key={c} onClick={()=>{onSelect(c);setOpen(false);setSearch("");}} style={{padding:"11px 14px",cursor:"pointer",color:"#1a1a1a",fontSize:14,fontWeight:c===selected?700:400,background:c===selected?"#fff8ee":"#fff",borderBottom:"1px solid #f0f0f0"}}>
              {c===selected?"✓ ":""}{c}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── LISTING CARD — outside App ───────────────────────────────────────────────
const ListingCard = ({l,onChat,onProfile,onReport,loggedIn,showLogin}:{l:Listing,onChat:(l:Listing)=>void,onProfile:(l:Listing)=>void,onReport:(l:Listing)=>void,loggedIn:boolean,showLogin:()=>void}) => (
  <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:18,padding:"18px 20px",marginBottom:12}}>
    <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
      {l.pet_photo
        ? <img src={l.pet_photo} alt="pet" style={{width:52,height:52,borderRadius:12,objectFit:"cover" as const,flexShrink:0}}/>
        : <div style={{fontSize:28,marginTop:2,flexShrink:0}}>{l.avatar}</div>
      }
      <div style={{flex:1,minWidth:0}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8,flexWrap:"wrap" as const}}>
          <span style={{fontWeight:800,fontSize:16,color:C.white}}>{l.from_location.split(",")[0]}</span>
          <span style={{color:C.muted2}}>→</span>
          <span style={{fontWeight:800,fontSize:16,color:C.white}}>{l.to_location.split(",")[0]}</span>
          <span style={{fontSize:11,background:"rgba(139,148,158,.12)",color:C.muted,padding:"2px 8px",borderRadius:100}}>🌍 {l.country}</span>
        </div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap" as const,alignItems:"center",marginBottom:8}}>
          <span style={{fontSize:10,letterSpacing:"1.5px",textTransform:"uppercase" as const,padding:"3px 9px",borderRadius:100,fontWeight:600,background:l.type==="owner"?"rgba(240,160,48,.18)":"rgba(63,185,80,.18)",color:l.type==="owner"?C.orange:C.green}}>{l.type==="owner"?"Needs transport":"Driver"}</span>
          {l.date_from&&<span style={{fontSize:12,color:C.muted}}>{l.date_from}{l.date_to?` – ${l.date_to}`:""}</span>}
          {l.type==="owner"&&l.animal_name&&<span style={{fontSize:12,color:C.muted}}>{l.animal_name} ({l.pet_type}), {l.weight} lbs</span>}
          {l.type==="driver"&&l.weight>0&&<span style={{fontSize:12,color:C.muted}}>≤ {l.weight} lbs</span>}
        </div>
        {l.type==="driver"&&l.radius_from>0&&<div style={{fontSize:12,color:C.green,marginBottom:8,fontWeight:500}}>📍 ±{l.radius_from} mi pickup · 🏁 ±{l.radius_to} mi delivery</div>}
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8,cursor:"pointer"}} onClick={()=>onProfile(l)}>
          <div style={{width:22,height:22,borderRadius:"50%",background:`linear-gradient(135deg,${C.blue},${C.purple})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:C.white,flexShrink:0}}>{l.user_name[0]}</div>
          <span style={{fontSize:13,color:C.muted,fontWeight:500}}>{l.user_name}</span>
          <Stars rating={l.rating}/>
          <span style={{fontSize:11,color:C.muted2}}>({l.reviews})</span>
        </div>
        <TrustBadges l={l}/>
        {l.notes&&<div style={{fontSize:12,color:C.muted,marginTop:8,fontStyle:"italic" as const}}>"{l.notes}"</div>}
        <div style={{display:"flex",gap:6,flexWrap:"wrap" as const,marginTop:12}}>
          <button onClick={()=>openMaps(l.from_location,l.to_location)} style={{background:"transparent",border:`1px solid #238636`,color:C.green,padding:"7px 12px",borderRadius:10,fontSize:12,cursor:"pointer",fontWeight:600}}>🗺 Route</button>
          {l.open_chat&&<button onClick={()=>{if(!loggedIn){showLogin();return;}onChat(l);}} style={{background:C.orange,border:"none",color:C.bg,padding:"7px 12px",borderRadius:10,fontSize:12,cursor:"pointer",fontWeight:700}}>💬 Chat</button>}
          {l.open_calls&&<button onClick={()=>{if(!loggedIn){showLogin();return;}l.phone&&window.open(`tel:${l.phone}`);}} style={{background:"transparent",border:`1px solid ${C.green}`,color:C.green,padding:"7px 12px",borderRadius:10,fontSize:12,cursor:"pointer",fontWeight:600}}>📞 Call</button>}
          {l.open_sms&&<button onClick={()=>{if(!loggedIn){showLogin();return;}l.phone&&window.open(`sms:${l.phone}`);}} style={{background:"transparent",border:`1px solid ${C.blue}`,color:C.blue,padding:"7px 12px",borderRadius:10,fontSize:12,cursor:"pointer",fontWeight:600}}>💬 SMS</button>}
          <button onClick={()=>onReport(l)} style={{background:"transparent",border:`1px solid ${C.border}`,color:C.muted2,padding:"7px 12px",borderRadius:10,fontSize:12,cursor:"pointer"}}>🚩</button>
        </div>
      </div>
    </div>
  </div>
);

// ─── NAV BAR — outside App ────────────────────────────────────────────────────
const NavBar = ({onHome,onPost,onProfile,loggedIn,showPost=false}:{onHome:()=>void,onPost:()=>void,onProfile:()=>void,loggedIn:boolean,showPost?:boolean}) => (
  <nav style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 20px",borderBottom:`1px solid ${C.border2}`,position:"sticky",top:0,background:"rgba(13,17,23,0.97)",backdropFilter:"blur(14px)",zIndex:200}}>
    <div onClick={onHome} style={{fontWeight:900,fontSize:20,cursor:"pointer",letterSpacing:-0.5,color:C.white}} translate="no">
      Pet<span style={{color:C.orange}}>Along</span>
    </div>
    <div style={{display:"flex",gap:8,alignItems:"center"}}>
      {showPost&&<button onClick={onPost} style={{background:C.orange,border:"none",borderRadius:100,padding:"7px 14px",color:C.bg,fontWeight:700,fontSize:12,cursor:"pointer"}}>+ Post</button>}
      {loggedIn
        ? <div onClick={onProfile} style={{width:32,height:32,borderRadius:"50%",background:`linear-gradient(135deg,${C.orange},${C.red})`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:13,fontWeight:700,color:C.bg}}>V</div>
        : null
      }
      <div id="google_translate_element" style={{fontSize:11,minWidth:50}}></div>
    </div>
  </nav>
);

// ─── FOOTER — outside App ─────────────────────────────────────────────────────
const Footer = ({onNav}:{onNav:(v:string)=>void}) => (
  <footer style={{borderTop:`1px solid ${C.border2}`,background:C.card,padding:"40px 24px 24px",marginTop:40}}>
    <div style={{maxWidth:900,margin:"0 auto"}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:32,marginBottom:32}}>
        <div>
          <div style={{fontWeight:900,fontSize:18,color:C.white,marginBottom:8}} translate="no">Pet<span style={{color:C.orange}}>Along</span></div>
          <div style={{fontSize:13,color:C.muted,lineHeight:1.7}}>Connecting pet owners with drivers going their way.</div>
        </div>
        <div>
          <div style={{fontSize:11,letterSpacing:"1.5px",textTransform:"uppercase" as const,color:C.muted2,marginBottom:12,fontWeight:600}}>Platform</div>
          {[["about","About"],["how","How it works"],["feed","Browse listings"],["owner","Post a listing"]].map(([v,l])=>(
            <div key={v} onClick={()=>onNav(v)} style={{fontSize:14,color:C.muted,marginBottom:8,cursor:"pointer"}}>{l}</div>
          ))}
        </div>
        <div>
          <div style={{fontSize:11,letterSpacing:"1.5px",textTransform:"uppercase" as const,color:C.muted2,marginBottom:12,fontWeight:600}}>Legal</div>
          {[["terms","Terms of Service"],["privacy","Privacy Policy"],["disclaimer","Disclaimer"]].map(([v,l])=>(
            <div key={v} onClick={()=>onNav(v)} style={{fontSize:14,color:C.muted,marginBottom:8,cursor:"pointer"}}>{l}</div>
          ))}
          <div style={{fontSize:14,color:C.muted}}>support@petalonggo.com</div>
        </div>
      </div>
      <div style={{borderTop:`1px solid ${C.border2}`,paddingTop:20}}>
        <div style={{fontSize:11,color:C.muted2,lineHeight:1.7,marginBottom:8}}>PetAlong is a neutral technology platform. We do not provide transportation services. All arrangements are made directly between users.</div>
        <div style={{fontSize:11,color:C.muted2}}>© 2026 PetAlong. Free community platform.</div>
      </div>
    </div>
  </footer>
);

// ─── LEGAL TEXT ───────────────────────────────────────────────────────────────
const TERMS=`TERMS OF SERVICE — PetAlong\nLast updated: May 2026\n\nIMPORTANT: PetAlong is a neutral online marketplace — NOT a transportation company. We do not transport animals, employ drivers, or provide transportation services.\n\n1. ABOUT PETALONG\nPetAlong is an online marketplace connecting pet owners with drivers for peer-to-peer transport. We act solely as a neutral technology platform. No employment, agency, or partnership exists between PetAlong and any user.\n\n2. ELIGIBILITY\nYou must be at least 18 years of age to use PetAlong.\n\n3. USER ACCOUNTS\nYou may sign in using Facebook Login or phone verification. You are responsible for all activity under your account.\n\n4. USER CONTENT & LISTINGS\nAll listings are created by users. PetAlong operates under 47 U.S.C. § 230 (Communications Decency Act) and is not liable for user-generated content.\n\n5. NO VERIFICATION OF USERS\nPetAlong does not conduct background checks or verify licenses, insurance, or credentials.\n\n6. INDEPENDENT ARRANGEMENTS\nAll arrangements are made directly between users. Users set their own prices. PetAlong does not process payments.\n\n7. PROHIBITED USES\nYou may not: transport animals illegally; post false listings; harass users; commit fraud; violate any law.\n\n8. DISCLAIMER OF WARRANTIES\nTHE PLATFORM IS PROVIDED "AS IS" WITHOUT ANY WARRANTIES.\n\n9. LIMITATION OF LIABILITY\nPETALONG SHALL NOT BE LIABLE FOR injury or death of animals, property damage, acts of any user, or financial loss. TOTAL LIABILITY SHALL NOT EXCEED $100 USD.\n\n10. GOVERNING LAW\nGoverned by the laws of the State of Nebraska, USA.\n\n11. CONTACT\nsupport@petalonggo.com`;

const PRIVACY=`PRIVACY POLICY — PetAlong\nLast updated: May 2026\n\nWe do not sell your personal information.\n\n1. INFORMATION WE COLLECT\n• Facebook Login: your public name and profile photo\n• Phone verification: your phone number (optional)\n• Listings: information you voluntarily provide\n• Usage data: IP address, browser type (automatic)\n\n2. HOW WE USE YOUR INFORMATION\nTo display your profile and listings. To facilitate contact between users. To verify identity. To enforce our Terms.\n\n3. FACEBOOK LOGIN\nAuthentication only. We access your public name and photo only.\n\n4. DATA SHARING\nWe do not sell data. We share only with service providers or if legally required.\n\n5. DATA RETENTION\nRequest deletion: support@petalonggo.com\n\n6. YOUR RIGHTS\nAccess, correct, or delete your data. Contact: support@petalonggo.com\n\n7. CONTACT\nsupport@petalonggo.com`;

const DISCLAIMER=`DISCLAIMER & RELEASE OF LIABILITY — PetAlong\nLast updated: May 2026\n\nREAD CAREFULLY. By using PetAlong you accept all risks.\n\n1. PLATFORM ONLY\nPetAlong is a technology platform. We do not transport animals or employ drivers.\n\n2. NO WARRANTY FOR USER CONDUCT\nWe do not screen or verify users. "Verified" badges confirm identity only — not qualifications.\n\n3. ASSUMPTION OF RISK\nYOU ASSUME ALL RISKS INCLUDING:\n• Injury, illness, or death of any animal\n• Loss or damage to any property\n• Negligence of any user\n• Vehicle accidents or delays\n\n4. RELEASE OF LIABILITY\nYOU RELEASE PETALONG FROM ALL CLAIMS ARISING FROM ANY ARRANGEMENT BETWEEN USERS.\n\n5. INSURANCE\nPetAlong provides no insurance. Obtain your own coverage.\n\n6. CONTACT\nsupport@petalonggo.com`;

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("home");
  const scrollPos = useRef<Record<string,number>>({});
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [filterCountry, setFilterCountry] = useState("all");
  const [filterPet, setFilterPet] = useState("all");
  const [loggedIn, setLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loginStep, setLoginStep] = useState<"main"|"phone"|"code">("main");
  const [loginPhone, setLoginPhone] = useState("");
  const [loginCode, setLoginCode] = useState("");
  const [chatWith, setChatWith] = useState<Listing|null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const [petPhotoFile, setPetPhotoFile] = useState<File|null>(null);
  const [petPhotoPreview, setPetPhotoPreview] = useState<string|null>(null);
  const [showReport, setShowReport] = useState<Listing|null>(null);
  const [reportReason, setReportReason] = useState("");
  const [reportDone, setReportDone] = useState(false);
  const [profileUser, setProfileUser] = useState<Listing|null>(null);
  const [country, setCountry] = useState("USA");
  const [posting, setPosting] = useState(false);
  const [oFrom, setOFrom] = useState("");
  const [oTo, setOTo] = useState("");
  const [oName, setOName] = useState("");
  const [oWeight, setOWeight] = useState("");
  const [oPetType, setOPetType] = useState("Dog");
  const [oD1, setOD1] = useState("");
  const [oD2, setOD2] = useState("");
  const [oPh, setOPh] = useState("");
  const [oChat, setOChat] = useState(true);
  const [oCalls, setOCalls] = useState(false);
  const [oSMS, setOSMS] = useState(false);
  const [oNotes, setONotes] = useState("");
  const [dFrom, setDFrom] = useState("");
  const [dTo, setDTo] = useState("");
  const [dDate, setDDate] = useState("");
  const [dCap, setDCap] = useState("");
  const [dPh, setDPh] = useState("");
  const [dRA, setDRA] = useState(50);
  const [dRB, setDRB] = useState(50);
  const [dChat, setDChat] = useState(true);
  const [dCalls, setDCalls] = useState(false);
  const [dSMS, setDSMS] = useState(false);
  const [dNotes, setDNotes] = useState("");
  const photoRef = useRef<HTMLInputElement>(null);

  // Google Translate
  useEffect(() => {
    const id = "google-translate-script";
    if (!document.getElementById(id)) {
      (window as any).googleTranslateElementInit = () => {
        new (window as any).google.translate.TranslateElement({pageLanguage:"en",layout:0},"google_translate_element");
      };
      const s = document.createElement("script");
      s.id = id; s.async = true;
      s.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      document.body.appendChild(s);
    }
  }, []);

  // Browser back/forward support
  useEffect(() => {
    window.history.replaceState({view:"home"},"","");
    const onPop = (e: PopStateEvent) => {
      const v = e.state?.view || "home";
      setView(v);
      setTimeout(()=>window.scrollTo(0, scrollPos.current[v]||0),50);
    };
    window.addEventListener("popstate", onPop);
    return ()=>window.removeEventListener("popstate", onPop);
  }, []);

  const nav = useCallback((v: string) => {
    scrollPos.current[view] = window.scrollY;
    window.history.pushState({view:v},"","");
    setView(v);
    setTimeout(()=>window.scrollTo(0, scrollPos.current[v]||0),50);
  }, [view]);

  const loadListings = async () => {
    setLoading(true);
    try {
      const data = await sbFetch("/listings?select=*&order=created_at.desc&limit=100");
      setListings(Array.isArray(data)?data:[]);
    } catch(e){console.error(e);}
    setLoading(false);
  };

  useEffect(()=>{loadListings();},[]);

  const postOwner = async () => {
    if(!oFrom||!oTo){alert("Please enter pickup and delivery locations");return;}
    setPosting(true);
    try {
      let photoUrl = null;
      if(petPhotoFile) photoUrl = await uploadPhoto(petPhotoFile);
      await sbFetch("/listings",{method:"POST",body:JSON.stringify({
        type:"owner",from_location:oFrom,to_location:oTo,country,
        animal_name:oName,pet_type:oPetType,weight:Number(oWeight)||0,
        date_from:oD1,date_to:oD2,avatar:PET_ICONS[oPetType]||"🐾",
        open_chat:oChat,open_calls:oCalls,open_sms:oSMS,
        phone:oPh,notes:oNotes,pet_photo:photoUrl,
        user_name:"Guest",fb_connected:false,phone_verified:false,
        member_since:"2026",rating:5.0,reviews:0,
      })});
      nav("posted");
    } catch(e){alert("Error posting. Try again.");}
    setPosting(false);
  };

  const postDriver = async () => {
    if(!dFrom||!dTo){alert("Please enter your route");return;}
    setPosting(true);
    try {
      await sbFetch("/listings",{method:"POST",body:JSON.stringify({
        type:"driver",from_location:dFrom,to_location:dTo,country,
        weight:Number(dCap)||0,date_from:dDate,avatar:"🚐",
        open_chat:dChat,open_calls:dCalls,open_sms:dSMS,
        phone:dPh,notes:dNotes,radius_from:dRA,radius_to:dRB,
        user_name:"Guest",fb_connected:false,phone_verified:false,
        member_since:"2026",rating:5.0,reviews:0,
      })});
      nav("posted");
    } catch(e){alert("Error posting. Try again.");}
    setPosting(false);
  };

  const filtered = listings.filter(l=>{
    if(filter==="owner"&&l.type!=="owner")return false;
    if(filter==="driver"&&l.type!=="driver")return false;
    if(filterCountry!=="all"&&l.country!==filterCountry)return false;
    if(filterPet!=="all"&&l.pet_type!==filterPet)return false;
    return true;
  });

  const BackBtn = ({to}:{to:string}) => (
    <button onClick={()=>nav(to)} style={{background:"none",border:"none",color:C.muted,fontSize:14,cursor:"pointer",marginBottom:24,padding:0,fontWeight:500}}>← Back</button>
  );

  const LoginModal = () => (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.85)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={()=>{setShowLogin(false);setLoginStep("main");}}>
      <div onClick={e=>e.stopPropagation()} style={{background:C.card2,border:`1px solid ${C.border}`,borderRadius:20,padding:32,width:"100%",maxWidth:380}}>
        {loginStep==="main"&&<>
          <div style={{fontWeight:800,fontSize:22,marginBottom:6,color:C.white}}>Join PetAlong</div>
          <div style={{fontSize:14,color:C.muted,marginBottom:24}}>Sign in to post listings or contact others</div>
          <button onClick={()=>{setLoggedIn(true);setShowLogin(false);}} style={{width:"100%",background:"#1877f2",border:"none",borderRadius:12,padding:"15px 20px",color:C.white,fontSize:15,fontWeight:700,cursor:"pointer",marginBottom:16,display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
            <span style={{fontSize:20,fontWeight:900}}>f</span> Continue with Facebook
          </button>
          <div style={{fontSize:11,color:C.muted2,textAlign:"center" as const,lineHeight:1.6,marginBottom:20}}>We only use your name and photo. We never post on your behalf.</div>
          <Divider label="Or verify phone"/>
          <Field label="Phone number" ph="+1 (555) 000-0000" val={loginPhone} onChange={setLoginPhone} type="tel"/>
          <SubmitBtn label="Send code →" onClick={()=>setLoginStep("code")}/>
        </>}
        {loginStep==="code"&&<>
          <div style={{fontWeight:800,fontSize:20,marginBottom:12,color:C.white}}>Enter verification code</div>
          <div style={{fontSize:13,color:C.green,marginBottom:16,padding:"10px 14px",background:"rgba(63,185,80,.1)",borderRadius:10,border:`1px solid rgba(63,185,80,.3)`}}>✓ Code sent to {loginPhone}</div>
          <Field label="" ph="6-digit code" val={loginCode} onChange={setLoginCode} type="tel"/>
          <SubmitBtn label="Verify →" onClick={()=>{setLoggedIn(true);setShowLogin(false);setLoginStep("main");}}/>
          <button onClick={()=>setLoginStep("main")} style={{background:"none",border:"none",color:C.muted,fontSize:13,cursor:"pointer",marginTop:12,width:"100%",textAlign:"center" as const}}>← Back</button>
        </>}
      </div>
    </div>
  );

  const ReportModal = () => (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.85)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={()=>{setShowReport(null);setReportDone(false);}}>
      <div onClick={e=>e.stopPropagation()} style={{background:C.card2,border:`1px solid ${C.border}`,borderRadius:20,padding:28,width:"100%",maxWidth:360}}>
        {reportDone?<div style={{textAlign:"center" as const,padding:"20px 0"}}>
          <div style={{fontSize:40,marginBottom:12}}>✅</div>
          <div style={{color:C.white,fontWeight:700,fontSize:16,marginBottom:8}}>Thank you! We'll review it.</div>
          <button onClick={()=>{setShowReport(null);setReportDone(false);}} style={{background:C.orange,border:"none",borderRadius:10,padding:"10px 24px",color:C.bg,fontWeight:700,cursor:"pointer",marginTop:12}}>OK</button>
        </div>:<>
          <div style={{fontWeight:800,fontSize:18,marginBottom:16,color:C.white}}>Report this listing</div>
          {["Spam or fake listing","Suspicious or unsafe behavior","Wrong category","Scam attempt","Animal welfare concern","Other"].map((r,i)=>(
            <div key={i} onClick={()=>setReportReason(r)} style={{padding:"10px 14px",borderRadius:10,border:`1px solid ${reportReason===r?C.red:C.border}`,marginBottom:8,cursor:"pointer",fontSize:14,color:reportReason===r?C.red:C.muted,background:reportReason===r?"rgba(248,81,73,.08)":"transparent"}}>{r}</div>
          ))}
          <div style={{display:"flex",gap:10,marginTop:16}}>
            <button onClick={()=>setShowReport(null)} style={{flex:1,background:"transparent",border:`1px solid ${C.border}`,borderRadius:10,padding:12,color:C.muted,cursor:"pointer",fontWeight:500}}>Cancel</button>
            <button onClick={()=>setReportDone(true)} disabled={!reportReason} style={{flex:2,background:reportReason?C.red:"#333",border:"none",borderRadius:10,padding:12,color:C.white,cursor:reportReason?"pointer":"default",fontWeight:700}}>Submit</button>
          </div>
        </>}
      </div>
    </div>
  );

  const nb = (sp=false) => <NavBar onHome={()=>nav("home")} onPost={()=>nav("owner")} onProfile={()=>nav("profile-me")} loggedIn={loggedIn} showPost={sp}/>;
  const ft = () => <Footer onNav={nav}/>;

  // ─── VIEWS ──────────────────────────────────────────────────────────────────

  if(view==="home") return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.white,fontFamily:"system-ui,sans-serif"}}>
      {showLogin&&<LoginModal/>}
      {showReport&&<ReportModal/>}
      {nb()}
      <div style={{minHeight:"90vh",display:"flex",flexDirection:"column" as const,alignItems:"center",justifyContent:"center",padding:"60px 20px 40px",textAlign:"center" as const,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",width:500,height:500,background:`radial-gradient(circle,rgba(240,160,48,.12) 0%,transparent 70%)`,top:-80,left:-60,pointerEvents:"none"}}/>
        <div style={{position:"absolute",width:350,height:350,background:`radial-gradient(circle,rgba(63,185,80,.07) 0%,transparent 70%)`,bottom:-40,right:-40,pointerEvents:"none"}}/>
        <div style={{fontSize:11,letterSpacing:"3px",textTransform:"uppercase" as const,color:C.green,marginBottom:16,fontWeight:600,background:"rgba(63,185,80,.1)",padding:"6px 16px",borderRadius:100,border:`1px solid rgba(63,185,80,.2)`}}>🐾 Free Community Platform</div>
        <div style={{fontWeight:900,fontSize:"clamp(40px,10vw,80px)",letterSpacing:-2,lineHeight:1,marginBottom:16}} translate="no">
          Pet<span style={{color:C.orange}}>Along</span>
        </div>
        <div style={{fontSize:"clamp(15px,3vw,20px)",color:C.muted,maxWidth:480,lineHeight:1.6,marginBottom:48}}>Pets travel with people already going their way</div>
        <div style={{display:"flex",gap:28,marginBottom:52,flexWrap:"wrap" as const,justifyContent:"center"}}>
          {[{n:"50+",l:"Countries"},{n:"Free",l:"Forever"},{n:"P2P",l:"Direct connections"},{n:"0%",l:"Commission"}].map((s,i)=>(
            <div key={i} style={{textAlign:"center" as const}}>
              <div style={{fontWeight:900,fontSize:22,color:C.orange}}>{s.n}</div>
              <div style={{fontSize:11,color:C.muted,letterSpacing:"1px",textTransform:"uppercase" as const}}>{s.l}</div>
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:14,marginBottom:36,flexWrap:"wrap" as const,justifyContent:"center"}}>
          {[["I need transport","🐾","Post your pet — drivers going your way will find you","owner"],["I'm driving","🚐","Post your route and earn by taking a pet along","driver"]].map(([title,icon,desc,v])=>(
            <div key={v} onClick={()=>nav(v as string)} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:20,padding:"24px",width:200,cursor:"pointer",textAlign:"center" as const,transition:"border-color .2s"}}
              onMouseOver={e=>{(e.currentTarget as HTMLElement).style.borderColor=C.orange;}}
              onMouseOut={e=>{(e.currentTarget as HTMLElement).style.borderColor=C.border;}}>
              <div style={{fontSize:34,marginBottom:10}}>{icon}</div>
              <div style={{fontWeight:700,fontSize:15,marginBottom:6,color:C.white}}>{title}</div>
              <div style={{fontSize:12,color:C.muted,lineHeight:1.6}}>{desc}</div>
            </div>
          ))}
        </div>
        <button onClick={()=>nav("feed")} style={{background:"transparent",border:`1px solid ${C.border}`,color:C.muted,padding:"11px 24px",borderRadius:100,fontSize:14,cursor:"pointer"}}>Browse all listings →</button>
      </div>
      {/* HOW IT WORKS */}
      <div style={{borderTop:`1px solid ${C.border2}`,padding:"60px 20px",background:C.card}}>
        <div style={{maxWidth:860,margin:"0 auto"}}>
          <div style={{fontWeight:900,fontSize:"clamp(22px,5vw,32px)",letterSpacing:-1,marginBottom:36,textAlign:"center" as const}}>How PetAlong works</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:14}}>
            {[{icon:"📋",t:"Post your listing",d:"2 minutes. Pet details + photo, or your driving route."},{icon:"🔍",t:"Get matched",d:"Platform shows your listing to drivers/owners going the same way."},{icon:"💬",t:"Connect directly",d:"Chat, call or SMS. Agree on price between yourselves."},{icon:"🐾",t:"Pet travels safely",d:"Driver takes pet along their existing route. Everyone saves."}].map((h,i)=>(
              <div key={i} style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:16,padding:20}}>
                <div style={{fontSize:28,marginBottom:10}}>{h.icon}</div>
                <div style={{fontWeight:700,fontSize:14,marginBottom:6,color:C.white}}>{h.t}</div>
                <div style={{fontSize:13,color:"#c9d1d9",lineHeight:1.6}}>{h.d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* WHY */}
      <div style={{padding:"60px 20px"}}>
        <div style={{maxWidth:860,margin:"0 auto"}}>
          <div style={{fontWeight:900,fontSize:"clamp(22px,5vw,32px)",letterSpacing:-1,marginBottom:36,textAlign:"center" as const}}>Why PetAlong?</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:14}}>
            {[{icon:"💰",t:"Save up to 80%",d:"Pro couriers charge $500–2000+. With PetAlong drivers are already going your way."},{icon:"🛡️",t:"Community trust",d:"Facebook profiles, phone verification, ratings and reviews."},{icon:"🌍",t:"Worldwide",d:"USA, Europe, Canada, Australia and 50+ countries."},{icon:"⚡",t:"Fast & simple",d:"Post in 2 minutes. No forms, no quotes, no middlemen."}].map((w,i)=>(
              <div key={i} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:20}}>
                <div style={{fontSize:28,marginBottom:10}}>{w.icon}</div>
                <div style={{fontWeight:700,fontSize:14,marginBottom:6,color:C.white}}>{w.t}</div>
                <div style={{fontSize:13,color:"#c9d1d9",lineHeight:1.6}}>{w.d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* TESTIMONIALS */}
      <div style={{borderTop:`1px solid ${C.border2}`,padding:"60px 20px",background:C.card}}>
        <div style={{maxWidth:900,margin:"0 auto"}}>
          <div style={{fontWeight:900,fontSize:"clamp(22px,5vw,32px)",letterSpacing:-1,marginBottom:8,textAlign:"center" as const}}>What our community says</div>
          <div style={{fontSize:14,color:C.muted,textAlign:"center" as const,marginBottom:36}}>Real stories from pet owners and drivers</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",gap:16}}>
            {TESTIMONIALS.map((t,i)=>(
              <div key={i} style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:16,padding:22}}>
                <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:12}}>
                  <div style={{fontSize:32}}>{t.avatar}</div>
                  <div>
                    <div style={{fontWeight:700,fontSize:14,color:C.white}}>{t.name}</div>
                    <div style={{fontSize:11,color:C.muted}}>{t.location}</div>
                    <div style={{color:C.yellow,fontSize:12}}>{"★".repeat(t.rating)}</div>
                  </div>
                </div>
                <div style={{fontSize:13,color:"#c9d1d9",lineHeight:1.65,fontStyle:"italic" as const}}>"{t.text}"</div>
                <div style={{fontSize:11,color:C.orange,marginTop:10,fontWeight:600}}>🐾 {t.pet}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {ft()}
    </div>
  );

  if(view==="feed") return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.white,fontFamily:"system-ui,sans-serif"}}>
      {showLogin&&<LoginModal/>}
      {showReport&&<ReportModal/>}
      {nb(true)}
      <div style={{maxWidth:680,margin:"0 auto",padding:"28px 20px 80px"}}>
        <BackBtn to="home"/>
        <div style={{fontWeight:900,fontSize:28,letterSpacing:-1,marginBottom:4}}>Live listings</div>
        <div style={{color:C.muted,fontSize:13,marginBottom:20}}>{loading?"Loading...":`${filtered.length} active listings`}</div>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:14,marginBottom:20}}>
          <div style={{display:"flex",gap:8,marginBottom:10,flexWrap:"wrap" as const}}>
            {[["all","All"],["owner","🐾 Need transport"],["driver","🚐 Drivers"]].map(([f,label])=>(
              <button key={f} onClick={()=>setFilter(f)} style={{padding:"7px 14px",borderRadius:100,fontSize:12,border:`1px solid ${filter===f?C.orange:C.border}`,background:filter===f?C.orange:"transparent",color:filter===f?C.bg:C.muted,cursor:"pointer",fontWeight:filter===f?600:400}}>{label}</button>
            ))}
          </div>
          <div style={{display:"flex",gap:8}}>
            <select value={filterCountry} onChange={e=>setFilterCountry(e.target.value)} style={{...INP,flex:1,padding:"8px 10px",fontSize:13}}>
              <option value="all">🌍 All countries</option>
              {COUNTRIES.map(c=><option key={c} value={c}>{c}</option>)}
            </select>
            <select value={filterPet} onChange={e=>setFilterPet(e.target.value)} style={{...INP,flex:1,padding:"8px 10px",fontSize:13}}>
              <option value="all">🐾 All pets</option>
              {PET_TYPES.map(p=><option key={p.en} value={p.en}>{p.icon} {p.en}</option>)}
            </select>
          </div>
        </div>
        {loading&&<div style={{textAlign:"center" as const,padding:"40px",color:C.muted}}>Loading...</div>}
        {!loading&&filtered.length===0&&(
          <div style={{textAlign:"center" as const,padding:"60px 20px",color:C.muted}}>
            <div style={{fontSize:48,marginBottom:16}}>🐾</div>
            <div style={{fontSize:18,fontWeight:700,color:C.white,marginBottom:8}}>No listings yet</div>
            <div style={{marginBottom:24}}>Be the first to post!</div>
            <button onClick={()=>nav("owner")} style={{background:C.orange,border:"none",borderRadius:12,padding:"12px 28px",color:C.bg,fontWeight:700,cursor:"pointer",fontSize:15}}>+ Post a listing</button>
          </div>
        )}
        {filtered.map(l=>(
          <ListingCard key={l.id} l={l}
            onChat={l=>{setChatWith(l);nav("chat");}}
            onProfile={l=>{setProfileUser(l);nav("profile-user");}}
            onReport={l=>{setShowReport(l);setReportReason("");}}
            loggedIn={loggedIn}
            showLogin={()=>setShowLogin(true)}
          />
        ))}
      </div>
      {ft()}
    </div>
  );

  if(view==="owner") return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.white,fontFamily:"system-ui,sans-serif"}}>
      {showLogin&&<LoginModal/>}
      {nb()}
      <div style={{maxWidth:540,margin:"0 auto",padding:"28px 20px 80px"}}>
        <BackBtn to="home"/>
        <div style={{fontWeight:900,fontSize:"clamp(24px,6vw,32px)",letterSpacing:-1.5,marginBottom:6,lineHeight:1.1}}>I need to<br/>transport my pet</div>
        <div style={{fontSize:14,color:C.muted,marginBottom:24}}>Post your request — drivers going your route will find you</div>
        <div style={{marginBottom:20}}>
          <div style={{fontSize:10,letterSpacing:"1.5px",textTransform:"uppercase" as const,color:C.muted,marginBottom:7,fontWeight:600}}>Pet photo</div>
          <div onClick={()=>photoRef.current?.click()} style={{border:`2px dashed ${petPhotoPreview?C.green:C.border}`,borderRadius:12,padding:20,textAlign:"center" as const,cursor:"pointer",background:C.card}}>
            {petPhotoPreview?<img src={petPhotoPreview} alt="pet" style={{width:"100%",maxHeight:180,objectFit:"cover" as const,borderRadius:8}}/>:<div><div style={{fontSize:32,marginBottom:6}}>🐾</div><div style={{fontSize:14,color:C.muted}}>📷 Tap to add pet photo</div></div>}
          </div>
          <input ref={photoRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>{const f=e.target.files?.[0];if(f){setPetPhotoFile(f);const r=new FileReader();r.onload=ev=>setPetPhotoPreview(ev.target?.result as string);r.readAsDataURL(f);}}}/>
        </div>
        <CountryPicker selected={country} onSelect={setCountry}/>
        <Field label="Pickup location" ph="City, State or ZIP code" val={oFrom} onChange={setOFrom}/>
        <Field label="Delivery location" ph="City, State or ZIP code" val={oTo} onChange={setOTo}/>
        {oFrom&&oTo&&<button onClick={()=>openMaps(oFrom,oTo)} style={{width:"100%",background:"transparent",border:`1px solid #238636`,color:C.green,borderRadius:10,padding:"10px",fontSize:13,cursor:"pointer",fontWeight:600,marginBottom:16}}>🗺 View route on Google Maps</button>}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <Field label="Pet name" ph="Buddy" val={oName} onChange={setOName}/>
          <Field label="Weight (lbs)" ph="45" type="number" val={oWeight} onChange={setOWeight}/>
        </div>
        <div style={{marginBottom:16}}>
          <div style={{fontSize:10,letterSpacing:"1.5px",textTransform:"uppercase" as const,color:C.muted,marginBottom:8,fontWeight:600}}>Pet type</div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap" as const}}>
            {PET_TYPES.map(p=>(
              <button key={p.en} onClick={()=>setOPetType(p.en)} style={{padding:"8px 14px",borderRadius:100,border:`1px solid ${oPetType===p.en?C.orange:C.border}`,background:oPetType===p.en?"rgba(240,160,48,.15)":"transparent",color:oPetType===p.en?C.orange:C.muted,fontSize:13,cursor:"pointer"}}>
                {p.icon} {p.en}
              </button>
            ))}
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <Field label="Ready from" ph="" type="date" val={oD1} onChange={setOD1}/>
          <Field label="Deliver by" ph="" type="date" val={oD2} onChange={setOD2}/>
        </div>
        <Field label="Notes (optional)" ph="Pet behavior, special requirements..." val={oNotes} onChange={setONotes} multiline/>
        <Divider label="How to contact you"/>
        <Toggle label="Open for in-app chat" sub="Free messaging" checked={oChat} onChange={()=>setOChat(p=>!p)}/>
        <Toggle label="Open for phone calls" checked={oCalls} onChange={()=>setOCalls(p=>!p)}/>
        <Toggle label="Open for SMS" checked={oSMS} onChange={()=>setOSMS(p=>!p)}/>
        {(oCalls||oSMS)&&<Field label="Your phone number" ph="+1 (555) 000-0000" type="tel" val={oPh} onChange={setOPh}/>}
        <SubmitBtn label={posting?"Posting...":"Post my request →"} onClick={postOwner} disabled={posting}/>
        <div style={{fontSize:11,color:C.muted2,textAlign:"center" as const,marginTop:12,lineHeight:1.6}}>
          By posting you agree to our <span onClick={()=>nav("terms")} style={{color:C.orange,cursor:"pointer"}}>Terms of Service</span>
        </div>
      </div>
      {ft()}
    </div>
  );

  if(view==="driver") return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.white,fontFamily:"system-ui,sans-serif"}}>
      {showLogin&&<LoginModal/>}
      {nb()}
      <div style={{maxWidth:540,margin:"0 auto",padding:"28px 20px 80px"}}>
        <BackBtn to="home"/>
        <div style={{fontWeight:900,fontSize:"clamp(24px,6vw,32px)",letterSpacing:-1.5,marginBottom:6,lineHeight:1.1}}>I'm driving<br/>this route</div>
        <div style={{fontSize:14,color:C.muted,marginBottom:24}}>Post your trip — owners with pets along your route will find you</div>
        <CountryPicker selected={country} onSelect={setCountry}/>
        <Field label="Departing from" ph="City, State or ZIP code" val={dFrom} onChange={setDFrom}/>
        <Field label="Heading to" ph="City, State or ZIP code" val={dTo} onChange={setDTo}/>
        {dFrom&&dTo&&<button onClick={()=>openMaps(dFrom,dTo)} style={{width:"100%",background:"transparent",border:`1px solid #238636`,color:C.green,borderRadius:10,padding:"10px",fontSize:13,cursor:"pointer",fontWeight:600,marginBottom:16}}>🗺 View route on Google Maps</button>}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <Field label="Travel date" ph="" type="date" val={dDate} onChange={setDDate}/>
          <Field label="Max weight (lbs)" ph="80" type="number" val={dCap} onChange={setDCap}/>
        </div>
        <Divider label="Pickup detour"/>
        <Slider label="How far will you detour to pick up?" val={dRA} onChange={setDRA} color="orange"/>
        <Divider label="Delivery detour"/>
        <Slider label="How far will you detour to deliver?" val={dRB} onChange={setDRB} color="green"/>
        {(dRA>0||dRB>0)&&<div style={{fontSize:13,color:"#c9d1d9",padding:"10px 14px",background:C.card2,borderRadius:10,border:`1px solid ${C.border}`,marginBottom:16}}>📍 Pickup ±{dRA} mi · 🏁 Delivery ±{dRB} mi</div>}
        <Field label="Notes (optional)" ph="Vehicle type, pet experience..." val={dNotes} onChange={setDNotes} multiline/>
        <Divider label="How to contact you"/>
        <Toggle label="Open for in-app chat" sub="Free messaging" checked={dChat} onChange={()=>setDChat(p=>!p)}/>
        <Toggle label="Open for phone calls" checked={dCalls} onChange={()=>setDCalls(p=>!p)}/>
        <Toggle label="Open for SMS" checked={dSMS} onChange={()=>setDSMS(p=>!p)}/>
        {(dCalls||dSMS)&&<Field label="Your phone number" ph="+1 (555) 000-0000" type="tel" val={dPh} onChange={setDPh}/>}
        <SubmitBtn label={posting?"Posting...":"Post my route →"} onClick={postDriver} disabled={posting}/>
        <div style={{fontSize:11,color:C.muted2,textAlign:"center" as const,marginTop:12,lineHeight:1.6}}>
          By posting you agree to our <span onClick={()=>nav("terms")} style={{color:C.orange,cursor:"pointer"}}>Terms of Service</span>
        </div>
      </div>
      {ft()}
    </div>
  );

  if(view==="posted") return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.white,fontFamily:"system-ui,sans-serif"}}>
      {nb()}
      <div style={{display:"flex",flexDirection:"column" as const,alignItems:"center",justifyContent:"center",minHeight:"80vh",textAlign:"center" as const,padding:20}}>
        <div style={{fontSize:72,marginBottom:20}}>🐾</div>
        <div style={{fontWeight:900,fontSize:30,marginBottom:8}}>Posted!</div>
        <div style={{color:C.muted,marginBottom:32,maxWidth:300,lineHeight:1.6}}>Your listing is live. Drivers and owners can now find you!</div>
        <button onClick={()=>{loadListings();nav("feed");}} style={{width:"100%",maxWidth:300,background:C.orange,border:"none",borderRadius:14,padding:16,color:C.bg,fontWeight:700,fontSize:15,cursor:"pointer",marginBottom:10}}>See all listings →</button>
        <button onClick={()=>nav("home")} style={{background:"none",border:"none",color:C.muted,fontSize:13,cursor:"pointer"}}>← Back to home</button>
      </div>
      {ft()}
    </div>
  );

  if(view==="chat"&&chatWith) return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.white,fontFamily:"system-ui,sans-serif",display:"flex",flexDirection:"column" as const}}>
      <div style={{display:"flex",alignItems:"center",gap:12,padding:"14px 20px",borderBottom:`1px solid ${C.border2}`,background:"rgba(13,17,23,.97)",position:"sticky",top:0,zIndex:100}}>
        <button onClick={()=>nav("feed")} style={{background:"none",border:"none",color:C.muted,fontSize:20,cursor:"pointer",padding:0}}>←</button>
        <div style={{width:36,height:36,borderRadius:"50%",background:`linear-gradient(135deg,${C.orange},${C.red})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:700,color:C.bg}}>{chatWith.user_name[0]}</div>
        <div style={{flex:1}}>
          <div style={{fontWeight:700,fontSize:15}}>{chatWith.user_name}</div>
          <div style={{fontSize:11,color:C.green}}>● {chatWith.from_location} → {chatWith.to_location}</div>
        </div>
      </div>
      <div style={{flex:1,padding:"20px 16px",display:"flex",flexDirection:"column" as const,gap:10}}>
        <div style={{textAlign:"center" as const,fontSize:11,color:C.muted,padding:"6px 16px",background:C.card,borderRadius:100,alignSelf:"center",border:`1px solid ${C.border2}`}}>🔒 All arrangements are your own responsibility.</div>
        {messages.map((m,i)=>(
          <div key={i} style={{display:"flex",justifyContent:m.from==="me"?"flex-end":"flex-start"}}>
            <div style={{maxWidth:"78%",background:m.from==="me"?C.orange:C.card,color:m.from==="me"?"#0d1117":"#c9d1d9",borderRadius:m.from==="me"?"18px 18px 4px 18px":"18px 18px 18px 4px",padding:"10px 14px",fontSize:14,lineHeight:1.5}}>
              {m.text}<div style={{fontSize:10,opacity:.6,marginTop:4,textAlign:"right" as const}}>{m.time}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{padding:"12px 16px",borderTop:`1px solid ${C.border2}`,background:"rgba(13,17,23,.97)",display:"flex",gap:10}}>
        <input value={newMsg} onChange={e=>setNewMsg(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&newMsg.trim()){setMessages(p=>[...p,{from:"me",text:newMsg,time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}]);setNewMsg("");}}} placeholder="Type a message..." style={{...INP,flex:1,padding:"11px 14px",borderRadius:100}}/>
        <button onClick={()=>{if(newMsg.trim()){setMessages(p=>[...p,{from:"me",text:newMsg,time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}]);setNewMsg("");}}} style={{background:C.orange,border:"none",borderRadius:"50%",width:44,height:44,cursor:"pointer",fontSize:18,color:C.bg,fontWeight:700,flexShrink:0}}>↑</button>
      </div>
    </div>
  );

  if(view==="profile-user"&&profileUser) return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.white,fontFamily:"system-ui,sans-serif"}}>
      {nb()}
      <div style={{maxWidth:580,margin:"0 auto",padding:"28px 20px 80px"}}>
        <BackBtn to="feed"/>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:20,padding:28,marginBottom:16}}>
          <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:16}}>
            <div style={{width:64,height:64,borderRadius:"50%",background:`linear-gradient(135deg,${C.blue},${C.purple})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,fontWeight:900,flexShrink:0}}>{profileUser.user_name[0]}</div>
            <div>
              <div style={{fontWeight:800,fontSize:20,marginBottom:4}}>{profileUser.user_name}</div>
              <Stars rating={profileUser.rating}/>
              <span style={{fontSize:12,color:C.muted,marginLeft:8}}>({profileUser.reviews} reviews)</span>
            </div>
          </div>
          <TrustBadges l={profileUser}/>
        </div>
        <ListingCard l={profileUser}
          onChat={l=>{setChatWith(l);nav("chat");}}
          onProfile={()=>{}}
          onReport={l=>{setShowReport(l);setReportReason("");}}
          loggedIn={loggedIn}
          showLogin={()=>setShowLogin(true)}
        />
      </div>
      {ft()}
    </div>
  );

  if(view==="profile-me") return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.white,fontFamily:"system-ui,sans-serif"}}>
      {nb()}
      <div style={{maxWidth:580,margin:"0 auto",padding:"28px 20px 80px"}}>
        <BackBtn to="home"/>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:20,padding:28,marginBottom:16}}>
          <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:16}}>
            <div style={{width:64,height:64,borderRadius:"50%",background:`linear-gradient(135deg,${C.orange},${C.red})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,fontWeight:900,color:C.bg}}>V</div>
            <div>
              <div style={{fontWeight:800,fontSize:20,marginBottom:4}}>Vova78</div>
              <div style={{fontSize:13,color:C.muted}}>kvnvn777@gmail.com</div>
            </div>
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap" as const}}>
            <span style={{fontSize:11,background:"rgba(88,166,255,.15)",color:C.blue,padding:"3px 10px",borderRadius:100,fontWeight:600}}>f Facebook connected</span>
            <span style={{fontSize:11,background:"rgba(63,185,80,.15)",color:C.green,padding:"3px 10px",borderRadius:100,fontWeight:600}}>📱 Phone verified</span>
          </div>
        </div>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:20,marginBottom:16}}>
          <div style={{fontSize:11,color:C.muted,letterSpacing:"1px",textTransform:"uppercase" as const,marginBottom:14,fontWeight:600}}>My listings</div>
          <div style={{color:C.muted,fontSize:13,textAlign:"center" as const,padding:"20px 0"}}>No listings yet.</div>
          <SubmitBtn label="+ Post a listing" onClick={()=>nav("owner")}/>
        </div>
        <button onClick={()=>{setLoggedIn(false);nav("home");}} style={{width:"100%",background:"transparent",border:`1px solid ${C.red}`,borderRadius:12,padding:14,color:C.red,fontWeight:600,cursor:"pointer",fontSize:14}}>Sign out</button>
      </div>
      {ft()}
    </div>
  );

  const Legal = ({title,content,warn=false}:{title:string,content:string,warn?:boolean}) => (
    <div style={{minHeight:"100vh",background:C.bg,color:C.white,fontFamily:"system-ui,sans-serif"}}>
      {nb()}
      <div style={{maxWidth:720,margin:"0 auto",padding:"48px 24px 80px"}}>
        <BackBtn to="home"/>
        <div style={{fontWeight:900,fontSize:28,letterSpacing:-1,marginBottom:24}}>{title}</div>
        {warn&&<div style={{background:"rgba(248,81,73,.06)",border:`1px solid rgba(248,81,73,.3)`,borderRadius:12,padding:"14px 20px",marginBottom:20,fontSize:13,color:C.red,fontWeight:600}}>⚠️ Read carefully before using PetAlong.</div>}
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:28}}>
          <pre style={{fontSize:14,color:"#c9d1d9",lineHeight:1.8,whiteSpace:"pre-wrap" as const,fontFamily:"inherit"}}>{content}</pre>
        </div>
      </div>
      {ft()}
    </div>
  );

  if(view==="terms") return <Legal title="Terms of Service" content={TERMS}/>;
  if(view==="privacy") return <Legal title="Privacy Policy" content={PRIVACY}/>;
  if(view==="disclaimer") return <Legal title="Disclaimer" content={DISCLAIMER} warn/>;

  if(view==="about") return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.white,fontFamily:"system-ui,sans-serif"}}>
      {nb()}
      <div style={{maxWidth:680,margin:"0 auto",padding:"48px 24px 80px"}}>
        <BackBtn to="home"/>
        <div style={{fontWeight:900,fontSize:"clamp(28px,6vw,42px)",letterSpacing:-1.5,marginBottom:8}}>About PetAlong</div>
        <div style={{fontSize:16,color:C.orange,marginBottom:32,fontWeight:500}}>The peer-to-peer pet transport community</div>
        <div style={{fontSize:16,color:"#c9d1d9",lineHeight:1.8,marginBottom:24}}>PetAlong is a free community platform connecting pet owners with drivers who are already going that way. Like BlaBlaCar — but for pets.</div>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:24}}>
          <div style={{fontSize:15,color:"#c9d1d9",lineHeight:1.8}}>Our mission: make pet transport accessible, affordable, and safe for everyone by connecting people who are already making the journey.</div>
        </div>
      </div>
      {ft()}
    </div>
  );

  if(view==="how") return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.white,fontFamily:"system-ui,sans-serif"}}>
      {nb()}
      <div style={{maxWidth:720,margin:"0 auto",padding:"48px 24px 80px"}}>
        <BackBtn to="home"/>
        <div style={{fontWeight:900,fontSize:28,letterSpacing:-1,marginBottom:32}}>How PetAlong works</div>
        <div style={{display:"flex",flexDirection:"column" as const,gap:14}}>
          {[{icon:"📋",t:"Post your listing",d:"Owner posts pet details with photo. Driver posts route and detour radius. Takes 2 minutes."},{icon:"🔍",t:"Get matched",d:"Your listing is shown to drivers or owners going the same way."},{icon:"💬",t:"Connect directly",d:"Chat, call or SMS. Agree on price between yourselves."},{icon:"🐾",t:"Pet travels safely",d:"Driver takes pet along their existing route. Everyone saves money."}].map((h,i)=>(
            <div key={i} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:22,display:"flex",gap:16}}>
              <div style={{fontSize:36,flexShrink:0}}>{h.icon}</div>
              <div>
                <div style={{fontWeight:700,fontSize:16,marginBottom:6}}>Step {i+1}: {h.t}</div>
                <div style={{fontSize:14,color:"#c9d1d9",lineHeight:1.7}}>{h.d}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{marginTop:28}}>
          <SubmitBtn label="I need transport" onClick={()=>nav("owner")}/>
          <button onClick={()=>nav("driver")} style={{width:"100%",background:"transparent",border:`1px solid ${C.green}`,borderRadius:14,padding:16,color:C.green,fontWeight:700,fontSize:15,cursor:"pointer",marginTop:10}}>I'm driving</button>
        </div>
      </div>
      {ft()}
    </div>
  );

  return <div/>;
}
