import { useState, useRef, useEffect } from "react";

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
  if (!res.ok) throw new Error(await res.text());
  const text = await res.text();
  return text ? JSON.parse(text) : [];
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

// ─── TYPES ────────────────────────────────────────────────────────────────────
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

const openMaps = (a: string, b: string) =>
  window.open(`https://www.google.com/maps/dir/${encodeURIComponent(a)}/${encodeURIComponent(b)}`, "_blank");

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

export default function App() {
  const [view, setView] = useState("home");
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
  const [petPhoto, setPetPhoto] = useState<string|null>(null);
  const [showReport, setShowReport] = useState<Listing|null>(null);
  const [reportReason, setReportReason] = useState("");
  const [reportDone, setReportDone] = useState(false);
  const [showMatch, setShowMatch] = useState(true);
  const [profileUser, setProfileUser] = useState<Listing|null>(null);
  const [countrySearch, setCountrySearch] = useState("");
  const [showCountries, setShowCountries] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("USA");
  const [posting, setPosting] = useState(false);
  const [oF, setOF] = useState({from:"",to:"",name:"",weight:"",petType:"Dog",d1:"",d2:"",ph:"",openChat:true,openCalls:false,openSMS:false,notes:""});
  const [dF, setDF] = useState({from:"",to:"",date:"",cap:"",ph:"",rA:50,rB:50,openChat:true,openCalls:false,openSMS:false,notes:""});
  const photoRef = useRef<HTMLInputElement>(null);

  // ─── GOOGLE TRANSLATE ──────────────────────────────────────────────────────
  useEffect(() => {
    const scriptId = "google-translate-script";
    if (!document.getElementById(scriptId)) {
      (window as any).googleTranslateElementInit = () => {
        new (window as any).google.translate.TranslateElement(
          { pageLanguage: "en", layout: 0 }, "google_translate_element"
        );
      };
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // ─── LOAD LISTINGS ────────────────────────────────────────────────────────
  const loadListings = async () => {
    setLoading(true);
    try {
      const data = await sbFetch("/listings?select=*&order=created_at.desc&limit=100");
      setListings(data);
    } catch (e) {
      console.error("Failed to load listings:", e);
    }
    setLoading(false);
  };

  useEffect(() => { loadListings(); }, []);

  // ─── POST LISTING ─────────────────────────────────────────────────────────
  const postOwnerListing = async () => {
    if (!oF.from || !oF.to) return alert("Please fill in pickup and delivery locations");
    setPosting(true);
    try {
      await sbFetch("/listings", {
        method: "POST",
        body: JSON.stringify({
          type: "owner",
          from_location: oF.from,
          to_location: oF.to,
          country: selectedCountry,
          animal_name: oF.name,
          pet_type: oF.petType,
          weight: Number(oF.weight) || 0,
          date_from: oF.d1,
          date_to: oF.d2,
          avatar: PET_ICONS[oF.petType] || "🐾",
          open_chat: oF.openChat,
          open_calls: oF.openCalls,
          open_sms: oF.openSMS,
          phone: oF.ph,
          notes: oF.notes,
          pet_photo: petPhoto,
          user_name: "You",
          fb_connected: loggedIn,
          phone_verified: false,
          member_since: "2026",
          rating: 5.0,
          reviews: 0,
        }),
      });
      nav("posted");
    } catch (e) {
      alert("Error posting listing. Please try again.");
    }
    setPosting(false);
  };

  const postDriverListing = async () => {
    if (!dF.from || !dF.to) return alert("Please fill in your route");
    setPosting(true);
    try {
      await sbFetch("/listings", {
        method: "POST",
        body: JSON.stringify({
          type: "driver",
          from_location: dF.from,
          to_location: dF.to,
          country: selectedCountry,
          weight: Number(dF.cap) || 0,
          date_from: dF.date,
          avatar: "🚐",
          open_chat: dF.openChat,
          open_calls: dF.openCalls,
          open_sms: dF.openSMS,
          phone: dF.ph,
          notes: dF.notes,
          radius_from: dF.rA,
          radius_to: dF.rB,
          user_name: "You",
          fb_connected: loggedIn,
          phone_verified: false,
          member_since: "2026",
          rating: 5.0,
          reviews: 0,
        }),
      });
      nav("posted");
    } catch (e) {
      alert("Error posting listing. Please try again.");
    }
    setPosting(false);
  };

  const filtered = listings.filter(l => {
    if (filter === "owner" && l.type !== "owner") return false;
    if (filter === "driver" && l.type !== "driver") return false;
    if (filterCountry !== "all" && l.country !== filterCountry) return false;
    if (filterPet !== "all" && l.pet_type !== filterPet) return false;
    return true;
  });

  const filteredCountries = COUNTRIES.filter(c => c.toLowerCase().includes(countrySearch.toLowerCase()));

  const nav = (v: string) => { setView(v); window.scrollTo(0, 0); };

  // ─── SHARED COMPONENTS ────────────────────────────────────────────────────

  const NavBar = ({showPost=false}) => (
    <nav style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 24px",borderBottom:`1px solid ${C.border2}`,position:"sticky",top:0,background:"rgba(13,17,23,0.96)",backdropFilter:"blur(14px)",zIndex:200}}>
      <div onClick={()=>nav("home")} style={{fontFamily:"sans-serif",fontWeight:900,fontSize:20,cursor:"pointer",letterSpacing:-0.5,color:C.white}} translate="no">
        Pet<span style={{color:C.orange}}>Along</span>
      </div>
      <div style={{display:"flex",gap:8,alignItems:"center"}}>
        {showPost && <button onClick={()=>nav("owner")} style={{background:C.orange,border:"none",borderRadius:100,padding:"7px 16px",color:C.bg,fontWeight:700,fontSize:12,cursor:"pointer"}}>+ Post listing</button>}
        {loggedIn
          ? <div onClick={()=>nav("profile-me")} style={{width:32,height:32,borderRadius:"50%",background:`linear-gradient(135deg,${C.orange},${C.red})`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:14,fontWeight:700,color:C.bg}}>V</div>
          : <button onClick={()=>setShowLogin(true)} style={{background:"transparent",border:`1px solid ${C.border}`,borderRadius:100,padding:"6px 14px",color:C.muted,fontSize:12,cursor:"pointer",fontWeight:500}}>Sign in</button>
        }
        <div id="google_translate_element" style={{fontSize:11,lineHeight:1,minWidth:50}}></div>
      </div>
    </nav>
  );

  const Footer = () => (
    <footer style={{borderTop:`1px solid ${C.border2}`,background:C.card,padding:"40px 24px 24px",marginTop:40}}>
      <div style={{maxWidth:900,margin:"0 auto"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:32,marginBottom:32}}>
          <div>
            <div style={{fontWeight:900,fontSize:18,color:C.white,marginBottom:8}} translate="no">Pet<span style={{color:C.orange}}>Along</span></div>
            <div style={{fontSize:13,color:C.muted,lineHeight:1.7}}>Connecting pet owners with drivers going their way.</div>
          </div>
          <div>
            <div style={{fontSize:11,letterSpacing:"1.5px",textTransform:"uppercase" as const,color:C.muted2,marginBottom:12,fontWeight:600}}>Platform</div>
            {[["about","About"],["how","How it works"],["feed","Browse listings"],["owner","Post a listing"]].map(([v,l])=>(
              <div key={v} onClick={()=>nav(v)} style={{fontSize:14,color:C.muted,marginBottom:8,cursor:"pointer"}}>{l}</div>
            ))}
          </div>
          <div>
            <div style={{fontSize:11,letterSpacing:"1.5px",textTransform:"uppercase" as const,color:C.muted2,marginBottom:12,fontWeight:600}}>Legal</div>
            {[["terms","Terms of Service"],["privacy","Privacy Policy"],["disclaimer","Disclaimer"]].map(([v,l])=>(
              <div key={v} onClick={()=>nav(v)} style={{fontSize:14,color:C.muted,marginBottom:8,cursor:"pointer"}}>{l}</div>
            ))}
            <div style={{fontSize:14,color:C.muted,marginBottom:8}}>support@petalonggo.com</div>
          </div>
        </div>
        <div style={{borderTop:`1px solid ${C.border2}`,paddingTop:20}}>
          <div style={{fontSize:11,color:C.muted2,lineHeight:1.7,marginBottom:12}}>PetAlong is a neutral technology platform. We do not provide transportation services. We are not a transportation company. All arrangements are made directly between users. PetAlong is not responsible for any arrangements, transactions, disputes, or outcomes between users.</div>
          <div style={{fontSize:11,color:C.muted2}}>© 2026 PetAlong. Free community platform.</div>
        </div>
      </div>
    </footer>
  );

  const Field = ({label,ph,val,onChange,type="text",multiline=false}:{label:string,ph:string,val:string,onChange:(e:any)=>void,type?:string,multiline?:boolean}) => (
    <div style={{marginBottom:16}}>
      <div style={{fontSize:10,letterSpacing:"1.5px",textTransform:"uppercase" as const,color:C.muted,marginBottom:7,fontWeight:600}}>{label}</div>
      {multiline
        ? <textarea placeholder={ph} value={val} onChange={onChange} rows={3} style={{...INP,resize:"none" as const}}/>
        : <input type={type} placeholder={ph} value={val} onChange={onChange} style={INP}
            onFocus={(e)=>{e.target.style.borderColor=C.orange;e.target.style.boxShadow=`0 0 0 3px rgba(240,160,48,.15)`;}}
            onBlur={(e)=>{e.target.style.borderColor="#d0d7de";e.target.style.boxShadow="none";}}/>
      }
    </div>
  );

  const Toggle = ({label,sub,checked,onChange}:{label:string,sub?:string,checked:boolean,onChange:()=>void}) => (
    <div onClick={onChange} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 14px",background:C.card,border:`1px solid ${checked?C.green:C.border}`,borderRadius:10,marginBottom:10,cursor:"pointer"}}>
      <div>
        <div style={{fontSize:14,color:C.white,fontWeight:500}}>{label}</div>
        {sub && <div style={{fontSize:12,color:C.muted,marginTop:2}}>{sub}</div>}
      </div>
      <div style={{width:42,height:22,borderRadius:11,background:checked?C.green:C.border,position:"relative",transition:"background .2s",flexShrink:0}}>
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

  const Slider = ({label,val,onChange,color="orange"}:{label:string,val:number,onChange:(e:any)=>void,color?:string}) => (
    <div style={{background:C.card,border:`2px solid ${C.border}`,borderRadius:12,padding:"16px 16px 10px",marginBottom:16}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
        <span style={{fontSize:13,color:"#c9d1d9"}}>{label}</span>
        <span style={{fontWeight:800,fontSize:24,color:color==="green"?C.green:C.orange}}>{val} <span style={{fontSize:12,fontWeight:500,color:C.muted}}>mi</span></span>
      </div>
      <input type="range" min={0} max={300} step={1} value={val} onChange={onChange} style={{width:"100%",cursor:"pointer",accentColor:color==="green"?C.green:C.orange}}/>
      <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
        <span style={{fontSize:10,color:C.muted2}}>0 mi</span>
        <span style={{fontSize:10,color:C.muted2}}>300 mi</span>
      </div>
    </div>
  );

  const CountryPicker = () => (
    <div style={{marginBottom:16,position:"relative"}}>
      <div style={{fontSize:10,letterSpacing:"1.5px",textTransform:"uppercase" as const,color:C.muted,marginBottom:7,fontWeight:600}}>🌍 Country</div>
      <div onClick={()=>setShowCountries(!showCountries)} style={{...INP,display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer"}}>
        <span style={{color:"#1a1a1a",fontWeight:500}}>{selectedCountry}</span>
        <span style={{color:"#888",fontSize:12}}>▾</span>
      </div>
      {showCountries && (
        <div style={{position:"absolute",top:"100%",left:0,right:0,background:C.white,border:`2px solid ${C.orange}`,borderRadius:10,zIndex:50,maxHeight:220,overflowY:"auto" as const,boxShadow:"0 8px 30px rgba(0,0,0,.3)"}}>
          <input autoFocus placeholder="Search country..." value={countrySearch} onChange={e=>setCountrySearch(e.target.value)} style={{...INP,borderRadius:"8px 8px 0 0",borderBottom:`1px solid #eee`}}/>
          {filteredCountries.map(c=>(
            <div key={c} onClick={()=>{setSelectedCountry(c);setShowCountries(false);setCountrySearch("");}} style={{padding:"10px 14px",cursor:"pointer",color:"#1a1a1a",fontSize:14,fontWeight:c===selectedCountry?700:400,background:c===selectedCountry?"#fff8ee":"#fff",borderBottom:"1px solid #f0f0f0"}}>
              {c===selectedCountry?"✓ ":""}{c}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const SubmitBtn = ({label,onClick,disabled=false}:{label:string,onClick:()=>void,disabled?:boolean}) => (
    <button onClick={onClick} disabled={disabled} style={{width:"100%",background:disabled?"#444":C.orange,border:"none",borderRadius:14,padding:17,color:C.bg,fontWeight:700,fontSize:16,cursor:disabled?"default":"pointer",marginTop:8,letterSpacing:.3}}>
      {label}
    </button>
  );

  const BackBtn = ({to}:{to:string}) => (
    <button onClick={()=>nav(to)} style={{background:"none",border:"none",color:C.muted,fontSize:14,cursor:"pointer",marginBottom:24,padding:0,fontWeight:500}}>
      ← Back
    </button>
  );

  const LoginModal = () => (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.8)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={()=>{setShowLogin(false);setLoginStep("main");}}>
      <div onClick={e=>e.stopPropagation()} style={{background:C.card2,border:`1px solid ${C.border}`,borderRadius:20,padding:32,width:"100%",maxWidth:380}}>
        {loginStep==="main" && <>
          <div style={{fontWeight:800,fontSize:22,marginBottom:6,color:C.white}}>Join PetAlong</div>
          <div style={{fontSize:14,color:C.muted,marginBottom:24}}>Sign in to post listings or contact others</div>
          <button onClick={()=>{setLoggedIn(true);setShowLogin(false);setLoginStep("main");}} style={{width:"100%",background:"#1877f2",border:"none",borderRadius:12,padding:"15px 20px",color:C.white,fontSize:15,fontWeight:700,cursor:"pointer",marginBottom:16,display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
            <span style={{fontSize:20,fontWeight:900}}>f</span> Continue with Facebook
          </button>
          <div style={{fontSize:11,color:C.muted2,textAlign:"center" as const,lineHeight:1.6,marginBottom:20}}>We only use your Facebook name and photo. We never post on your behalf.</div>
          <Divider label="Or verify phone"/>
          <Field label="Phone number" ph="+1 (555) 000-0000" val={loginPhone} onChange={e=>setLoginPhone(e.target.value)} type="tel"/>
          <SubmitBtn label="Send verification code →" onClick={()=>setLoginStep("code")}/>
        </>}
        {loginStep==="code" && <>
          <div style={{fontWeight:800,fontSize:20,marginBottom:6,color:C.white}}>Verify your phone</div>
          <div style={{fontSize:13,color:C.green,marginBottom:16,padding:"10px 14px",background:"rgba(63,185,80,.1)",borderRadius:10,border:`1px solid rgba(63,185,80,.3)`}}>✓ Code sent! Check your SMS.</div>
          <Field label="" ph="Enter 6-digit code" val={loginCode} onChange={e=>setLoginCode(e.target.value)} type="number"/>
          <SubmitBtn label="Verify & continue →" onClick={()=>{setLoggedIn(true);setShowLogin(false);setLoginStep("main");}}/>
          <button onClick={()=>setLoginStep("main")} style={{background:"none",border:"none",color:C.muted,fontSize:13,cursor:"pointer",marginTop:12,width:"100%",textAlign:"center" as const}}>← Back</button>
        </>}
      </div>
    </div>
  );

  const ReportModal = () => (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.8)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={()=>{setShowReport(null);setReportDone(false);}}>
      <div onClick={e=>e.stopPropagation()} style={{background:C.card2,border:`1px solid ${C.border}`,borderRadius:20,padding:28,width:"100%",maxWidth:360}}>
        {reportDone ? <>
          <div style={{textAlign:"center" as const,padding:"20px 0"}}>
            <div style={{fontSize:40,marginBottom:12}}>✅</div>
            <div style={{color:C.white,fontWeight:700,fontSize:16,marginBottom:8}}>Thank you for your report. We'll review it shortly.</div>
            <button onClick={()=>{setShowReport(null);setReportDone(false);}} style={{background:C.orange,border:"none",borderRadius:10,padding:"10px 24px",color:C.bg,fontWeight:700,cursor:"pointer",marginTop:12}}>OK</button>
          </div>
        </> : <>
          <div style={{fontWeight:800,fontSize:18,marginBottom:16,color:C.white}}>Report this listing</div>
          {["Spam or fake listing","Suspicious or unsafe behavior","Wrong category","Scam attempt","Animal welfare concern","Other"].map((r,i)=>(
            <div key={i} onClick={()=>setReportReason(r)} style={{padding:"10px 14px",borderRadius:10,border:`1px solid ${reportReason===r?C.red:C.border}`,marginBottom:8,cursor:"pointer",fontSize:14,color:reportReason===r?C.red:C.muted,background:reportReason===r?"rgba(248,81,73,.08)":"transparent"}}>
              {r}
            </div>
          ))}
          <div style={{display:"flex",gap:10,marginTop:16}}>
            <button onClick={()=>setShowReport(null)} style={{flex:1,background:"transparent",border:`1px solid ${C.border}`,borderRadius:10,padding:12,color:C.muted,cursor:"pointer",fontWeight:500}}>Cancel</button>
            <button onClick={()=>setReportDone(true)} disabled={!reportReason} style={{flex:2,background:reportReason?C.red:"#333",border:"none",borderRadius:10,padding:12,color:C.white,cursor:reportReason?"pointer":"default",fontWeight:700}}>Submit report</button>
          </div>
        </>}
      </div>
    </div>
  );

  const ListingCard = ({l}:{l:Listing}) => (
    <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:18,padding:"18px 20px",marginBottom:12}}>
      <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
        <div style={{fontSize:26,marginTop:2,flexShrink:0}}>{l.avatar}</div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8,flexWrap:"wrap" as const}}>
            <span style={{fontWeight:800,fontSize:17,color:C.white}}>{l.from_location.split(",")[0]}</span>
            <span style={{color:C.muted2,fontSize:14}}>→</span>
            <span style={{fontWeight:800,fontSize:17,color:C.white}}>{l.to_location.split(",")[0]}</span>
            <span style={{fontSize:11,background:"rgba(139,148,158,.12)",color:C.muted,padding:"2px 8px",borderRadius:100}}>🌍 {l.country}</span>
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap" as const,alignItems:"center",marginBottom:8}}>
            <span style={{fontSize:10,letterSpacing:"1.5px",textTransform:"uppercase" as const,padding:"3px 9px",borderRadius:100,fontWeight:600,background:l.type==="owner"?"rgba(240,160,48,.18)":"rgba(63,185,80,.18)",color:l.type==="owner"?C.orange:C.green}}>{l.type==="owner"?"Needs transport":"Driver"}</span>
            <span style={{fontSize:12,color:C.muted}}>{l.date_from}{l.date_to?` – ${l.date_to}`:""}</span>
            {l.type==="owner" && <span style={{fontSize:12,color:C.muted}}>{l.animal_name} ({l.pet_type}), {l.weight} lbs</span>}
            {l.type==="driver" && <span style={{fontSize:12,color:C.muted}}>≤ {l.weight} lbs</span>}
          </div>
          {l.type==="driver" && l.radius_from!=null && (
            <div style={{fontSize:12,color:C.green,marginBottom:8,fontWeight:500}}>📍 ±{l.radius_from} mi pickup · 🏁 ±{l.radius_to} mi delivery</div>
          )}
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8,cursor:"pointer"}} onClick={()=>{setProfileUser(l);nav("profile-user");}}>
            <div style={{width:22,height:22,borderRadius:"50%",background:`linear-gradient(135deg,${C.blue},${C.purple})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:C.white,flexShrink:0}}>{l.user_name[0]}</div>
            <span style={{fontSize:13,color:C.muted,fontWeight:500}}>{l.user_name}</span>
            <Stars rating={l.rating}/>
            <span style={{fontSize:11,color:C.muted2}}>({l.reviews})</span>
          </div>
          <TrustBadges l={l}/>
          {l.notes && <div style={{fontSize:12,color:C.muted,marginTop:8,fontStyle:"italic" as const}}>"{l.notes}"</div>}
          <div style={{display:"flex",gap:6,flexWrap:"wrap" as const,marginTop:12}}>
            <button onClick={()=>openMaps(l.from_location,l.to_location)} style={{background:"transparent",border:`1px solid #238636`,color:C.green,padding:"7px 12px",borderRadius:10,fontSize:12,cursor:"pointer",fontWeight:600}}>🗺 Route</button>
            {l.open_chat && <button onClick={()=>{if(!loggedIn){setShowLogin(true);return;}setChatWith(l);nav("chat");}} style={{background:C.orange,border:"none",color:C.bg,padding:"7px 12px",borderRadius:10,fontSize:12,cursor:"pointer",fontWeight:700}}>💬 Chat</button>}
            {l.open_calls && <button onClick={()=>{if(!loggedIn){setShowLogin(true);return;}l.phone&&window.open(`tel:${l.phone}`);}} style={{background:"transparent",border:`1px solid ${C.green}`,color:C.green,padding:"7px 12px",borderRadius:10,fontSize:12,cursor:"pointer",fontWeight:600}}>📞 Call</button>}
            {l.open_sms && <button onClick={()=>{if(!loggedIn){setShowLogin(true);return;}l.phone&&window.open(`sms:${l.phone}`);}} style={{background:"transparent",border:`1px solid ${C.blue}`,color:C.blue,padding:"7px 12px",borderRadius:10,fontSize:12,cursor:"pointer",fontWeight:600}}>💬 SMS</button>}
            <button onClick={()=>{setShowReport(l);setReportReason("");}} style={{background:"transparent",border:`1px solid ${C.border}`,color:C.muted2,padding:"7px 12px",borderRadius:10,fontSize:12,cursor:"pointer"}}>🚩 Report</button>
          </div>
        </div>
      </div>
    </div>
  );

  const TERMS = `TERMS OF SERVICE — PetAlong
Last updated: May 2026

IMPORTANT: PetAlong is a neutral online marketplace — NOT a transportation company. We do not transport animals, employ drivers, or provide transportation services. By using this platform, you agree to these Terms in full.

1. ABOUT PETALONG
PetAlong ("Platform") is an online marketplace connecting pet owners with drivers for peer-to-peer transport arrangements. PetAlong acts solely as a neutral technology platform and does not participate in any transaction between users. PetAlong is not a transportation company, broker, carrier, or pet service provider. No employment, agency, or partnership exists between PetAlong and any user.

2. ELIGIBILITY
You must be at least 18 years of age to use PetAlong. By using the Platform, you confirm that you are 18 or older and have the legal capacity to enter into these Terms.

3. USER ACCOUNTS
You may sign in using Facebook Login or phone verification. You are responsible for all activity under your account and for keeping your credentials secure. PetAlong may suspend or terminate accounts that violate these Terms.

4. USER CONTENT & LISTINGS
All listings, messages, and content on PetAlong are created by users, not by PetAlong. PetAlong does not verify, endorse, or guarantee any user-generated content. PetAlong operates as an interactive computer service under 47 U.S.C. § 230 (Communications Decency Act) and is not liable for user-generated content. By posting content, you grant PetAlong a non-exclusive license to display it on the Platform.

5. NO VERIFICATION OF USERS
PetAlong does not conduct background checks or verify driver's licenses, vehicle insurance, professional certifications, or any other credentials. Community reviews are user-generated and not verified by PetAlong.

6. INDEPENDENT ARRANGEMENTS
All arrangements are made directly between users. PetAlong is not a party to any arrangement. Users set their own prices. PetAlong does not process payments and is not responsible for financial disputes.

7. PROHIBITED USES
You may not: transport animals illegally or in violation of any animal welfare law; post false or misleading listings; harass or threaten other users; commit fraud; violate any applicable federal, state, or local law; or use automated bots or scrapers on the Platform.

8. DISCLAIMER OF WARRANTIES
THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED.

9. LIMITATION OF LIABILITY
TO THE MAXIMUM EXTENT PERMITTED BY LAW, PETALONG SHALL NOT BE LIABLE FOR: injury, illness, or death of any animal; property damage; personal injury; financial loss; acts of any user; or any transaction between users. PETALONG'S TOTAL LIABILITY SHALL NOT EXCEED $100 USD.

10. INDEMNIFICATION
You agree to defend and hold harmless PetAlong and its owners, officers, agents, and employees from any claims arising from your use of the Platform, your violation of these Terms, or any arrangement you make with another user.

11. MODIFICATIONS
PetAlong may update these Terms at any time. Continued use constitutes acceptance.

12. GOVERNING LAW
These Terms are governed by the laws of the State of Nebraska, USA. Disputes shall be resolved in Lancaster County, Nebraska.

13. CONTACT
support@petalonggo.com | petalonggo.com`;

  const PRIVACY = `PRIVACY POLICY — PetAlong
Last updated: May 2026

We do not sell your personal information to third parties.

1. INFORMATION WE COLLECT
• Facebook Login: your public name and profile photo
• Phone verification: your phone number (optional)
• Listings: information you voluntarily provide
• Messages: content of in-app messages
• Usage data: IP address, browser type, device info (automatic)

2. HOW WE USE YOUR INFORMATION
To display your profile and listings. To facilitate communication between users. To verify identity and reduce fraud. To maintain and improve the Platform. To enforce our Terms of Service.

3. FACEBOOK LOGIN
We use Facebook for authentication only — your public name and photo. We do not access friends, messages, or other Facebook data. Subject also to Facebook's Privacy Policy at facebook.com/policy.

4. PHONE VERIFICATION
Optional. Stored securely, shown as "Phone Verified" badge. Not shared with other users.

5. DATA SHARING
We share data only with: service providers under confidentiality agreements; law enforcement if legally required; new owners in a business acquisition.

6. PUBLIC INFORMATION
Your listing content is publicly visible. Do not include sensitive personal information in listings.

7. DATA RETENTION
Data retained while account is active. Request deletion: support@petalonggo.com (30 days).

8. COOKIES
Used for session management and analytics.

9. CHILDREN'S PRIVACY
Not for users under 18. We do not knowingly collect data from minors.

10. YOUR RIGHTS
Access, correct, delete, or restrict your data. Contact: support@petalonggo.com

11. SECURITY
Reasonable technical measures protect your data. No internet transmission is 100% secure.

12. CONTACT
support@petalonggo.com | petalonggo.com`;

  const DISCLAIMER = `DISCLAIMER & RELEASE OF LIABILITY — PetAlong
Last updated: May 2026

READ CAREFULLY. By using PetAlong, you accept all risks of peer-to-peer pet transport.

1. PLATFORM ONLY — NOT A TRANSPORT SERVICE
PetAlong is a technology platform only. We do not transport animals, employ drivers, or hold any transport license.

2. NO WARRANTY FOR USER CONDUCT
PetAlong does not screen, verify, or approve users. "Verified" badges confirm phone/Facebook identity only — not professional qualifications.

3. ASSUMPTION OF RISK
BY USING PETALONG, YOU ASSUME ALL RISKS INCLUDING:
• Injury, illness, or death of any animal
• Loss, theft, or damage to any property
• Negligence or misconduct of any user
• Vehicle accidents, breakdowns, or delays

4. RELEASE OF LIABILITY
TO THE FULLEST EXTENT PERMITTED BY LAW, YOU RELEASE PETALONG FROM ALL CLAIMS ARISING FROM ANY ARRANGEMENT BETWEEN USERS OR ANY ACT OF ANY USER.

5. NO PROFESSIONAL ADVICE
Nothing on PetAlong is veterinary, legal, or insurance advice.

6. INSURANCE
PetAlong provides no insurance. Obtain your own coverage.

7. DISPUTES
PetAlong will not mediate user disputes.

8. CONTACT
support@petalonggo.com | petalonggo.com`;

  // ─── VIEWS ────────────────────────────────────────────────────────────────

  if (view === "home") return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.white,fontFamily:"'DM Sans',system-ui,sans-serif"}}>
      {showLogin && <LoginModal/>}
      {showReport && <ReportModal/>}
      <NavBar/>
      <div style={{minHeight:"92vh",display:"flex",flexDirection:"column" as const,alignItems:"center",justifyContent:"center",padding:"60px 20px 40px",textAlign:"center" as const,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",width:600,height:600,background:`radial-gradient(circle,rgba(240,160,48,.12) 0%,transparent 70%)`,top:-100,left:-80,pointerEvents:"none"}}/>
        <div style={{position:"absolute",width:400,height:400,background:`radial-gradient(circle,rgba(63,185,80,.07) 0%,transparent 70%)`,bottom:-60,right:-60,pointerEvents:"none"}}/>
        <div style={{fontSize:11,letterSpacing:"3px",textTransform:"uppercase" as const,color:C.green,marginBottom:16,fontWeight:600,background:"rgba(63,185,80,.1)",padding:"6px 16px",borderRadius:100,border:`1px solid rgba(63,185,80,.2)`}}>🐾 Free Community Platform</div>
        <div style={{fontWeight:900,fontSize:"clamp(38px,9vw,72px)",letterSpacing:-2,lineHeight:1,marginBottom:16,color:C.white}} translate="no">
          Pet<span style={{color:C.orange}}>Along</span>
        </div>
        <div style={{fontSize:"clamp(15px,3vw,20px)",color:C.muted,maxWidth:500,lineHeight:1.6,marginBottom:48}}>Pets travel with people already going their way</div>
        <div style={{display:"flex",gap:32,marginBottom:52,flexWrap:"wrap" as const,justifyContent:"center"}}>
          {[{n:"22,000+",l:"Community members"},{n:"50+",l:"Countries"},{n:"Free",l:"Forever for basics"},{n:"P2P",l:"Direct connections"}].map((s,i)=>(
            <div key={i} style={{textAlign:"center" as const}}>
              <div style={{fontWeight:900,fontSize:22,color:C.orange}}>{s.n}</div>
              <div style={{fontSize:11,color:C.muted,letterSpacing:"1px",textTransform:"uppercase" as const}}>{s.l}</div>
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:16,marginBottom:40,flexWrap:"wrap" as const,justifyContent:"center"}}>
          {[["I need transport","🐾","Post your pet — drivers going your way will find you","owner"],["I'm driving","🚐","Post your route and earn by taking a pet along","driver"]].map(([title,icon,desc,v])=>(
            <div key={v} onClick={()=>nav(v as string)} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:20,padding:"28px",width:220,cursor:"pointer",textAlign:"center" as const}}
              onMouseOver={e=>{(e.currentTarget as HTMLElement).style.borderColor=C.orange;}}
              onMouseOut={e=>{(e.currentTarget as HTMLElement).style.borderColor=C.border;}}>
              <div style={{fontSize:36,marginBottom:12}}>{icon}</div>
              <div style={{fontWeight:700,fontSize:16,marginBottom:8,color:C.white}}>{title}</div>
              <div style={{fontSize:13,color:C.muted,lineHeight:1.6}}>{desc}</div>
            </div>
          ))}
        </div>
        <button onClick={()=>nav("feed")} style={{background:"transparent",border:`1px solid ${C.border}`,color:C.muted,padding:"11px 26px",borderRadius:100,fontSize:14,cursor:"pointer"}}>Browse all listings →</button>
      </div>
      <div style={{borderTop:`1px solid ${C.border2}`,padding:"60px 20px",background:C.card}}>
        <div style={{maxWidth:860,margin:"0 auto"}}>
          <div style={{fontWeight:900,fontSize:"clamp(22px,5vw,32px)",letterSpacing:-1,marginBottom:36,textAlign:"center" as const,color:C.white}}>How PetAlong works</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:16}}>
            {[{icon:"📋",t:"Post your listing",d:"Owner posts pet details with photo. Driver posts route and detour radius. Takes 2 minutes."},{icon:"🔍",t:"Smart matching",d:"PetAlong notifies you when a driver's route matches your pet's journey."},{icon:"💬",t:"Connect directly",d:"Chat in-app, call or SMS. Agree on price and details between yourselves."},{icon:"🐾",t:"Pet travels safely",d:"Driver takes pet along their existing route. Everyone saves money."}].map((h,i)=>(
              <div key={i} style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:16,padding:22}}>
                <div style={{fontSize:28,marginBottom:12}}>{h.icon}</div>
                <div style={{fontWeight:700,fontSize:15,marginBottom:8,color:C.white}}>{h.t}</div>
                <div style={{fontSize:13,color:"#c9d1d9",lineHeight:1.65}}>{h.d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{padding:"60px 20px"}}>
        <div style={{maxWidth:860,margin:"0 auto"}}>
          <div style={{fontWeight:900,fontSize:"clamp(22px,5vw,32px)",letterSpacing:-1,marginBottom:36,textAlign:"center" as const,color:C.white}}>Why PetAlong?</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:16}}>
            {[{icon:"💰",t:"Save up to 80%",d:"Professional couriers charge $500–2000+. With PetAlong, drivers are already going your way."},{icon:"🛡️",t:"Community trust",d:"Facebook-connected profiles, phone verification, ratings and reviews."},{icon:"🌍",t:"Worldwide",d:"USA, Europe, Canada, Australia and 50+ countries."},{icon:"⚡",t:"Fast & simple",d:"Post in 2 minutes. No complicated forms, no middlemen."}].map((w,i)=>(
              <div key={i} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:22}}>
                <div style={{fontSize:28,marginBottom:12}}>{w.icon}</div>
                <div style={{fontWeight:700,fontSize:15,marginBottom:8,color:C.white}}>{w.t}</div>
                <div style={{fontSize:13,color:"#c9d1d9",lineHeight:1.65}}>{w.d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {showMatch && (
        <div style={{background:"rgba(63,185,80,.1)",border:`1px solid rgba(63,185,80,.3)`,padding:"14px 24px",textAlign:"center" as const,fontSize:14,color:C.green,position:"relative",cursor:"pointer"}} onClick={()=>nav("feed")}>
          🔔 Match found! A driver is heading your way →
          <button onClick={(e)=>{e.stopPropagation();setShowMatch(false);}} style={{position:"absolute",right:16,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:C.green,fontSize:18,cursor:"pointer"}}>×</button>
        </div>
      )}
      <Footer/>
    </div>
  );

  if (view === "feed") return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.white,fontFamily:"'DM Sans',system-ui,sans-serif"}}>
      {showLogin && <LoginModal/>}
      {showReport && <ReportModal/>}
      <NavBar showPost/>
      <div style={{maxWidth:680,margin:"0 auto",padding:"28px 20px 80px"}}>
        <BackBtn to="home"/>
        <div style={{fontWeight:900,fontSize:28,letterSpacing:-1,marginBottom:4,color:C.white}}>Live listings</div>
        <div style={{color:C.muted,fontSize:13,marginBottom:20}}>{loading ? "Loading..." : `${filtered.length} active listings`}</div>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:"16px 16px 12px",marginBottom:20}}>
          <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap" as const}}>
            {[["all","All"],["owner","🐾 Need transport"],["driver","🚐 Drivers"]].map(([f,label])=>(
              <button key={f} onClick={()=>setFilter(f)} style={{padding:"7px 14px",borderRadius:100,fontSize:12,border:`1px solid ${filter===f?C.orange:C.border}`,background:filter===f?C.orange:"transparent",color:filter===f?C.bg:C.muted,cursor:"pointer",fontWeight:filter===f?600:400}}>{label}</button>
            ))}
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap" as const}}>
            <select value={filterCountry} onChange={e=>setFilterCountry(e.target.value)} style={{...INP,flex:1,minWidth:120,padding:"8px 12px",fontSize:13}}>
              <option value="all">🌍 All countries</option>
              {COUNTRIES.map(c=><option key={c} value={c}>{c}</option>)}
            </select>
            <select value={filterPet} onChange={e=>setFilterPet(e.target.value)} style={{...INP,flex:1,minWidth:100,padding:"8px 12px",fontSize:13}}>
              <option value="all">🐾 All pets</option>
              {PET_TYPES.map(p=><option key={p.en} value={p.en}>{p.icon} {p.en}</option>)}
            </select>
          </div>
        </div>
        {loading && <div style={{textAlign:"center" as const,padding:"40px",color:C.muted}}>Loading listings...</div>}
        {!loading && filtered.length === 0 && (
          <div style={{textAlign:"center" as const,padding:"60px 20px",color:C.muted}}>
            <div style={{fontSize:40,marginBottom:16}}>🐾</div>
            <div style={{fontSize:18,fontWeight:700,color:C.white,marginBottom:8}}>No listings yet</div>
            <div style={{marginBottom:24}}>Be the first to post!</div>
            <button onClick={()=>nav("owner")} style={{background:C.orange,border:"none",borderRadius:12,padding:"12px 24px",color:C.bg,fontWeight:700,cursor:"pointer"}}>+ Post a listing</button>
          </div>
        )}
        {filtered.map(l=><ListingCard key={l.id} l={l}/>)}
      </div>
      <Footer/>
    </div>
  );

  if (view === "owner") return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.white,fontFamily:"'DM Sans',system-ui,sans-serif"}}>
      {showLogin && <LoginModal/>}
      <NavBar/>
      <div style={{maxWidth:540,margin:"0 auto",padding:"28px 20px 80px"}}>
        <BackBtn to="home"/>
        <div style={{fontWeight:900,fontSize:"clamp(24px,6vw,32px)",letterSpacing:-1.5,marginBottom:6,lineHeight:1.1,color:C.white}}>I need to<br/>transport my pet</div>
        <div style={{fontSize:14,color:C.muted,marginBottom:24}}>Post your request — drivers going your route will find you</div>
        <div style={{marginBottom:20}}>
          <div style={{fontSize:10,letterSpacing:"1.5px",textTransform:"uppercase" as const,color:C.muted,marginBottom:7,fontWeight:600}}>Pet photo</div>
          <div onClick={()=>photoRef.current?.click()} style={{border:`2px dashed ${petPhoto?C.green:C.border}`,borderRadius:12,padding:24,textAlign:"center" as const,cursor:"pointer",background:C.card}}>
            {petPhoto ? <img src={petPhoto} alt="pet" style={{width:"100%",maxHeight:200,objectFit:"cover" as const,borderRadius:8}}/> : <div><div style={{fontSize:32,marginBottom:8}}>🐾</div><div style={{fontSize:14,color:C.muted}}>📷 Add pet photo (tap to upload)</div></div>}
          </div>
          <input ref={photoRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>{const f=e.target.files?.[0];if(f){const r=new FileReader();r.onload=ev=>setPetPhoto(ev.target?.result as string);r.readAsDataURL(f);}}}/>
        </div>
        <CountryPicker/>
        <Field label="Pickup location" ph="City, State or ZIP code" val={oF.from} onChange={e=>setOF({...oF,from:e.target.value})}/>
        <Field label="Delivery location" ph="City, State or ZIP code" val={oF.to} onChange={e=>setOF({...oF,to:e.target.value})}/>
        {oF.from&&oF.to&&<button onClick={()=>openMaps(oF.from,oF.to)} style={{width:"100%",background:"transparent",border:`1px solid #238636`,color:C.green,borderRadius:10,padding:"10px",fontSize:13,cursor:"pointer",fontWeight:600,marginBottom:16}}>🗺 Preview route: {oF.from} → {oF.to}</button>}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <Field label="Pet name" ph="Buddy" val={oF.name} onChange={e=>setOF({...oF,name:e.target.value})}/>
          <Field label="Weight (lbs)" ph="45" type="number" val={oF.weight} onChange={e=>setOF({...oF,weight:e.target.value})}/>
        </div>
        <div style={{marginBottom:16}}>
          <div style={{fontSize:10,letterSpacing:"1.5px",textTransform:"uppercase" as const,color:C.muted,marginBottom:8,fontWeight:600}}>Pet type</div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap" as const}}>
            {PET_TYPES.map(p=>(
              <button key={p.en} onClick={()=>setOF({...oF,petType:p.en})} style={{padding:"8px 14px",borderRadius:100,border:`1px solid ${oF.petType===p.en?C.orange:C.border}`,background:oF.petType===p.en?"rgba(240,160,48,.15)":"transparent",color:oF.petType===p.en?C.orange:C.muted,fontSize:13,cursor:"pointer"}}>
                {p.icon} {p.en}
              </button>
            ))}
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <Field label="Ready from" ph="" type="date" val={oF.d1} onChange={e=>setOF({...oF,d1:e.target.value})}/>
          <Field label="Deliver by" ph="" type="date" val={oF.d2} onChange={e=>setOF({...oF,d2:e.target.value})}/>
        </div>
        <Field label="Additional notes (optional)" ph="Any special requirements, pet behavior, preferred timing..." val={oF.notes} onChange={e=>setOF({...oF,notes:e.target.value})} multiline/>
        <Divider label="Contact preferences"/>
        <Toggle label="Open for in-app chat" sub="Free in-app messaging" checked={oF.openChat} onChange={()=>setOF({...oF,openChat:!oF.openChat})}/>
        <Toggle label="Open for phone calls" checked={oF.openCalls} onChange={()=>setOF({...oF,openCalls:!oF.openCalls})}/>
        <Toggle label="Open for SMS" checked={oF.openSMS} onChange={()=>setOF({...oF,openSMS:!oF.openSMS})}/>
        {(oF.openCalls||oF.openSMS) && <Field label="Phone number" ph="+1 (555) 000-0000" type="tel" val={oF.ph} onChange={e=>setOF({...oF,ph:e.target.value})}/>}
        <SubmitBtn label={posting?"Posting...":"Post my request →"} onClick={()=>{if(!loggedIn){setShowLogin(true);return;}postOwnerListing();}} disabled={posting}/>
      </div>
      <Footer/>
    </div>
  );

  if (view === "driver") return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.white,fontFamily:"'DM Sans',system-ui,sans-serif"}}>
      {showLogin && <LoginModal/>}
      <NavBar/>
      <div style={{maxWidth:540,margin:"0 auto",padding:"28px 20px 80px"}}>
        <BackBtn to="home"/>
        <div style={{fontWeight:900,fontSize:"clamp(24px,6vw,32px)",letterSpacing:-1.5,marginBottom:6,lineHeight:1.1,color:C.white}}>I'm driving<br/>this route</div>
        <div style={{fontSize:14,color:C.muted,marginBottom:24}}>Post your trip — owners with pets along your route will find you</div>
        <CountryPicker/>
        <Field label="Departing from" ph="City, State or ZIP code" val={dF.from} onChange={e=>setDF({...dF,from:e.target.value})}/>
        <Field label="Heading to" ph="City, State or ZIP code" val={dF.to} onChange={e=>setDF({...dF,to:e.target.value})}/>
        {dF.from&&dF.to&&<button onClick={()=>openMaps(dF.from,dF.to)} style={{width:"100%",background:"transparent",border:`1px solid #238636`,color:C.green,borderRadius:10,padding:"10px",fontSize:13,cursor:"pointer",fontWeight:600,marginBottom:16}}>🗺 Preview route: {dF.from} → {dF.to}</button>}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <Field label="Travel date" ph="" type="date" val={dF.date} onChange={e=>setDF({...dF,date:e.target.value})}/>
          <Field label="Max weight (lbs)" ph="80" type="number" val={dF.cap} onChange={e=>setDF({...dF,cap:e.target.value})}/>
        </div>
        <Divider label="Pickup detour radius"/>
        <Slider label="How far will you go to pick up?" val={dF.rA} onChange={e=>setDF({...dF,rA:Number(e.target.value)})} color="orange"/>
        <Divider label="Delivery detour radius"/>
        <Slider label="How far will you go to deliver?" val={dF.rB} onChange={e=>setDF({...dF,rB:Number(e.target.value)})} color="green"/>
        {(dF.rA>0||dF.rB>0)&&<div style={{fontSize:13,color:"#c9d1d9",padding:"10px 14px",background:C.card2,borderRadius:10,border:`1px solid ${C.border}`,marginBottom:16}}>📍 Pickup ±{dF.rA} mi · 🏁 Delivery ±{dF.rB} mi</div>}
        <Field label="Additional notes (optional)" ph="Vehicle type, pet experience, preferences..." val={dF.notes} onChange={e=>setDF({...dF,notes:e.target.value})} multiline/>
        <Divider label="Contact preferences"/>
        <Toggle label="Open for in-app chat" sub="Free in-app messaging" checked={dF.openChat} onChange={()=>setDF({...dF,openChat:!dF.openChat})}/>
        <Toggle label="Open for phone calls" checked={dF.openCalls} onChange={()=>setDF({...dF,openCalls:!dF.openCalls})}/>
        <Toggle label="Open for SMS" checked={dF.openSMS} onChange={()=>setDF({...dF,openSMS:!dF.openSMS})}/>
        {(dF.openCalls||dF.openSMS)&&<Field label="Phone number" ph="+1 (555) 000-0000" type="tel" val={dF.ph} onChange={e=>setDF({...dF,ph:e.target.value})}/>}
        <SubmitBtn label={posting?"Posting...":"Post my route →"} onClick={()=>{if(!loggedIn){setShowLogin(true);return;}postDriverListing();}} disabled={posting}/>
      </div>
      <Footer/>
    </div>
  );

  if (view === "posted") return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.white,fontFamily:"'DM Sans',system-ui,sans-serif"}}>
      <NavBar/>
      <div style={{display:"flex",flexDirection:"column" as const,alignItems:"center",justifyContent:"center",minHeight:"80vh",textAlign:"center" as const,padding:20}}>
        <div style={{fontSize:72,marginBottom:20}}>🐾</div>
        <div style={{fontWeight:900,fontSize:30,marginBottom:8,color:C.white}}>Posted!</div>
        <div style={{color:C.muted,marginBottom:32,maxWidth:300,lineHeight:1.6}}>Your listing is live on PetAlong!</div>
        <button onClick={()=>{loadListings();nav("feed");}} style={{width:"100%",maxWidth:300,background:C.orange,border:"none",borderRadius:14,padding:17,color:C.bg,fontWeight:700,fontSize:16,cursor:"pointer",marginBottom:12}}>Browse all listings →</button>
        <button onClick={()=>nav("home")} style={{background:"none",border:"none",color:C.muted,fontSize:13,cursor:"pointer"}}>← Back to home</button>
      </div>
      <Footer/>
    </div>
  );

  if (view === "chat" && chatWith) return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.white,fontFamily:"'DM Sans',system-ui,sans-serif",display:"flex",flexDirection:"column" as const}}>
      <div style={{display:"flex",alignItems:"center",gap:12,padding:"14px 20px",borderBottom:`1px solid ${C.border2}`,background:"rgba(13,17,23,.97)",position:"sticky",top:0,zIndex:100}}>
        <button onClick={()=>nav("feed")} style={{background:"none",border:"none",color:C.muted,fontSize:20,cursor:"pointer",padding:0}}>←</button>
        <div style={{width:36,height:36,borderRadius:"50%",background:`linear-gradient(135deg,${C.orange},${C.red})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:700,color:C.bg}}>{chatWith.user_name[0]}</div>
        <div style={{flex:1}}>
          <div style={{fontWeight:700,fontSize:15,color:C.white}}>{chatWith.user_name}</div>
          <div style={{fontSize:11,color:C.green}}>● {chatWith.from_location} → {chatWith.to_location}</div>
        </div>
      </div>
      <div style={{flex:1,padding:"20px 16px",overflowY:"auto" as const,display:"flex",flexDirection:"column" as const,gap:10}}>
        <div style={{textAlign:"center" as const,fontSize:11,color:C.muted,padding:"6px 16px",background:C.card,borderRadius:100,alignSelf:"center",border:`1px solid ${C.border2}`}}>
          🔒 All arrangements are your own responsibility.
        </div>
        {messages.map((m,i)=>(
          <div key={i} style={{display:"flex",justifyContent:m.from==="me"?"flex-end":"flex-start"}}>
            <div style={{maxWidth:"78%",background:m.from==="me"?C.orange:C.card,color:m.from==="me"?"#0d1117":"#c9d1d9",borderRadius:m.from==="me"?"18px 18px 4px 18px":"18px 18px 18px 4px",padding:"10px 14px",fontSize:14,lineHeight:1.5}}>
              {m.text}
              <div style={{fontSize:10,opacity:.6,marginTop:4,textAlign:"right" as const}}>{m.time}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{padding:"12px 16px",borderTop:`1px solid ${C.border2}`,background:"rgba(13,17,23,.97)",display:"flex",gap:10}}>
        <input value={newMsg} onChange={e=>setNewMsg(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&newMsg.trim()){setMessages([...messages,{from:"me",text:newMsg,time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}]);setNewMsg("");}}} placeholder="Type a message..." style={{...INP,flex:1,padding:"11px 14px",borderRadius:100}}/>
        <button onClick={()=>{if(newMsg.trim()){setMessages([...messages,{from:"me",text:newMsg,time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}]);setNewMsg("");}}} style={{background:C.orange,border:"none",borderRadius:"50%",width:44,height:44,cursor:"pointer",fontSize:18,flexShrink:0,color:C.bg,fontWeight:700}}>↑</button>
      </div>
    </div>
  );

  if (view === "profile-user" && profileUser) return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.white,fontFamily:"'DM Sans',system-ui,sans-serif"}}>
      <NavBar/>
      <div style={{maxWidth:580,margin:"0 auto",padding:"28px 20px 80px"}}>
        <BackBtn to="feed"/>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:20,padding:28,marginBottom:20}}>
          <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:16}}>
            <div style={{width:64,height:64,borderRadius:"50%",background:`linear-gradient(135deg,${C.blue},${C.purple})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,fontWeight:900,color:C.white,flexShrink:0}}>{profileUser.user_name[0]}</div>
            <div>
              <div style={{fontWeight:800,fontSize:20,color:C.white,marginBottom:4}}>{profileUser.user_name}</div>
              <Stars rating={profileUser.rating}/>
              <span style={{fontSize:12,color:C.muted,marginLeft:8}}>({profileUser.reviews} reviews)</span>
            </div>
          </div>
          <TrustBadges l={profileUser}/>
        </div>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:20}}>
          <div style={{fontWeight:700,fontSize:11,marginBottom:14,color:C.muted,letterSpacing:"1px",textTransform:"uppercase" as const}}>Listing</div>
          <ListingCard l={profileUser}/>
        </div>
      </div>
      <Footer/>
    </div>
  );

  if (view === "profile-me") return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.white,fontFamily:"'DM Sans',system-ui,sans-serif"}}>
      <NavBar/>
      <div style={{maxWidth:580,margin:"0 auto",padding:"28px 20px 80px"}}>
        <BackBtn to="home"/>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:20,padding:28,marginBottom:20}}>
          <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:16}}>
            <div style={{width:64,height:64,borderRadius:"50%",background:`linear-gradient(135deg,${C.orange},${C.red})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,fontWeight:900,color:C.bg}}>V</div>
            <div>
              <div style={{fontWeight:800,fontSize:20,color:C.white,marginBottom:4}}>Vova78</div>
              <div style={{fontSize:13,color:C.muted}}>kvnvn777@gmail.com</div>
            </div>
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap" as const}}>
            <span style={{fontSize:11,background:"rgba(88,166,255,.15)",color:C.blue,padding:"3px 10px",borderRadius:100,fontWeight:600}}>f Facebook connected</span>
            <span style={{fontSize:11,background:"rgba(63,185,80,.15)",color:C.green,padding:"3px 10px",borderRadius:100,fontWeight:600}}>📱 Phone verified</span>
            <span style={{fontSize:11,background:"rgba(139,148,158,.1)",color:C.muted,padding:"3px 10px",borderRadius:100}}>Member since 2026</span>
          </div>
        </div>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:20,marginBottom:16}}>
          <div style={{fontWeight:700,fontSize:11,marginBottom:14,color:C.muted,letterSpacing:"1px",textTransform:"uppercase" as const}}>My listings</div>
          <div style={{color:C.muted,fontSize:13,textAlign:"center" as const,padding:"20px 0"}}>You haven't posted any listings yet.</div>
          <SubmitBtn label="+ Post listing" onClick={()=>nav("owner")}/>
        </div>
        <button onClick={()=>{setLoggedIn(false);nav("home");}} style={{width:"100%",background:"transparent",border:`1px solid ${C.red}`,borderRadius:12,padding:14,color:C.red,fontWeight:600,cursor:"pointer",fontSize:14}}>Sign out</button>
      </div>
      <Footer/>
    </div>
  );

  if (view === "about") return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.white,fontFamily:"'DM Sans',system-ui,sans-serif"}}>
      <NavBar/>
      <div style={{maxWidth:680,margin:"0 auto",padding:"48px 24px 80px"}}>
        <BackBtn to="home"/>
        <div style={{fontWeight:900,fontSize:"clamp(28px,6vw,42px)",letterSpacing:-1.5,marginBottom:8,color:C.white}}>About PetAlong</div>
        <div style={{fontSize:16,color:C.orange,marginBottom:32,fontWeight:500}}>The peer-to-peer pet transport community</div>
        <div style={{fontSize:16,color:"#c9d1d9",lineHeight:1.8,marginBottom:24}}>PetAlong is a free community platform that connects pet owners who need transport with drivers who are already going that way. We believe in the power of community — neighbors helping neighbors, travelers helping travelers. PetAlong is the BlaBlaCar for pets.</div>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:24}}>
          <div style={{fontSize:16,color:"#c9d1d9",lineHeight:1.8}}>Our mission: make pet transport accessible, affordable, and safe for everyone by connecting people who are already making the journey.</div>
        </div>
      </div>
      <Footer/>
    </div>
  );

  if (view === "terms") return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.white,fontFamily:"'DM Sans',system-ui,sans-serif"}}>
      <NavBar/>
      <div style={{maxWidth:720,margin:"0 auto",padding:"48px 24px 80px"}}>
        <BackBtn to="home"/>
        <div style={{fontWeight:900,fontSize:28,letterSpacing:-1,marginBottom:24,color:C.white}}>Terms of Service</div>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:28}}>
          <pre style={{fontSize:14,color:"#c9d1d9",lineHeight:1.8,whiteSpace:"pre-wrap" as const,fontFamily:"inherit"}}>{TERMS}</pre>
        </div>
      </div>
      <Footer/>
    </div>
  );

  if (view === "privacy") return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.white,fontFamily:"'DM Sans',system-ui,sans-serif"}}>
      <NavBar/>
      <div style={{maxWidth:720,margin:"0 auto",padding:"48px 24px 80px"}}>
        <BackBtn to="home"/>
        <div style={{fontWeight:900,fontSize:28,letterSpacing:-1,marginBottom:24,color:C.white}}>Privacy Policy</div>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:28}}>
          <pre style={{fontSize:14,color:"#c9d1d9",lineHeight:1.8,whiteSpace:"pre-wrap" as const,fontFamily:"inherit"}}>{PRIVACY}</pre>
        </div>
      </div>
      <Footer/>
    </div>
  );

  if (view === "disclaimer") return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.white,fontFamily:"'DM Sans',system-ui,sans-serif"}}>
      <NavBar/>
      <div style={{maxWidth:720,margin:"0 auto",padding:"48px 24px 80px"}}>
        <BackBtn to="home"/>
        <div style={{fontWeight:900,fontSize:28,letterSpacing:-1,marginBottom:24,color:C.white}}>Disclaimer</div>
        <div style={{background:"rgba(248,81,73,.06)",border:`1px solid rgba(248,81,73,.3)`,borderRadius:12,padding:"14px 20px",marginBottom:20,fontSize:13,color:"#f85149",fontWeight:600,lineHeight:1.6}}>
          ⚠️ Read carefully before using PetAlong.
        </div>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:28}}>
          <pre style={{fontSize:14,color:"#c9d1d9",lineHeight:1.8,whiteSpace:"pre-wrap" as const,fontFamily:"inherit"}}>{DISCLAIMER}</pre>
        </div>
      </div>
      <Footer/>
    </div>
  );

  if (view === "how") return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.white,fontFamily:"'DM Sans',system-ui,sans-serif"}}>
      <NavBar/>
      <div style={{maxWidth:720,margin:"0 auto",padding:"48px 24px 80px"}}>
        <BackBtn to="home"/>
        <div style={{fontWeight:900,fontSize:28,letterSpacing:-1,marginBottom:32,color:C.white}}>How PetAlong works</div>
        <div style={{display:"flex",flexDirection:"column" as const,gap:16}}>
          {[{icon:"📋",t:"Post your listing",d:"Owner posts pet details with photo. Driver posts route and detour radius. Takes 2 minutes."},{icon:"🔍",t:"Smart matching",d:"PetAlong notifies you when a driver's route matches your pet's journey."},{icon:"💬",t:"Connect directly",d:"Chat in-app, call or SMS. Agree on price and details between yourselves."},{icon:"🐾",t:"Pet travels safely",d:"Driver takes pet along their existing route. Everyone saves money."}].map((h,i)=>(
            <div key={i} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:24,display:"flex",gap:16,alignItems:"flex-start"}}>
              <div style={{fontSize:36,flexShrink:0}}>{h.icon}</div>
              <div>
                <div style={{fontWeight:700,fontSize:17,color:C.white,marginBottom:6}}>Step {i+1}: {h.t}</div>
                <div style={{fontSize:15,color:"#c9d1d9",lineHeight:1.7}}>{h.d}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{marginTop:32}}>
          <SubmitBtn label="I need transport" onClick={()=>nav("owner")}/>
          <button onClick={()=>nav("driver")} style={{width:"100%",background:"transparent",border:`1px solid ${C.green}`,borderRadius:14,padding:17,color:C.green,fontWeight:700,fontSize:16,cursor:"pointer",marginTop:10}}>I'm driving</button>
        </div>
      </div>
      <Footer/>
    </div>
  );

  return <div/>;
}
