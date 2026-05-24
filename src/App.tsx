import { useState, useRef } from "react";

// ─── COLORS ───────────────────────────────────────────────────
const C = {
  bg: "#0d1117",
  card: "#161b22",
  border: "#30363d",
  white: "#ffffff",
  muted: "#8b949e",
  orange: "#f0a030",
  green: "#3fb950",
  red: "#f85149",
  blue: "#58a6ff",
};

// ─── FIELD STYLE (forced white bg, black text) ────────────────
const FIELD = {
  width: "100%",
  background: "#ffffff",
  border: "2px solid #d0d7de",
  borderRadius: 10,
  padding: "13px 15px",
  color: "#1a1a1a",
  fontSize: 15,
  fontWeight: 500,
  outline: "none",
  WebkitAppearance: "none",
  boxSizing: "border-box",
  colorScheme: "light",
  WebkitTextFillColor: "#1a1a1a",
};

// ─── TRANSLATIONS ─────────────────────────────────────────────
const T = {
  en: {
    tagline: "Pets travel with people already going their way",
    iNeed: "I need transport",
    iNeedDesc: "Post your pet's route — drivers going your way will see it",
    iDrive: "I'm driving",
    iDriveDesc: "Post your route and earn by taking a pet along",
    browse: "Browse all listings →",
    howTitle: "How it works",
    how: [
      {
        icon: "📋",
        t: "Post your listing",
        d: "Owner posts pet details with photo. Driver posts their route and detour radius.",
      },
      {
        icon: "🔍",
        t: "Get matched",
        d: "PetAlong shows drivers whose routes overlap with the owner's request.",
      },
      {
        icon: "💬",
        t: "Chat or call directly",
        d: "Message in-app or call/SMS directly. You choose how to connect.",
      },
      {
        icon: "🐾",
        t: "Pet travels safely",
        d: "Driver takes the pet along. Owner gets photo updates. Everyone wins.",
      },
    ],
    loginTitle: "Join PetAlong",
    loginSub: "Sign in to post or contact others",
    fbBtn: "Continue with Facebook",
    orEmail: "or use email",
    emailPh: "your@email.com",
    codePh: "Enter 6-digit code",
    sendCode: "Send code →",
    verify: "Verify & continue →",
    codeSent: "Code sent to your email",
    ownerTitle: ["I need to", "transport my pet"],
    ownerSub: "Post your request — drivers will find you",
    driverTitle: ["I'm driving", "this route"],
    driverSub: "Post your trip — pet owners along your route will find you",
    pointA: "Pickup — Point A",
    pointB: "Delivery — Point B",
    cityZip: "City or ZIP code",
    petName: "Pet name",
    weight: "Weight (lbs)",
    petType: "Pet type",
    petTypes: ["Dog", "Cat", "Rabbit", "Bird", "Other"],
    petPhoto: "Pet photo",
    addPhoto: "📷 Add pet photo",
    readyFrom: "Ready from",
    deliverBy: "Deliver by",
    travelDate: "Travel date",
    maxWeight: "Max weight (lbs)",
    pickupR: "Pickup radius",
    deliveryR: "Delivery radius",
    pickupRQ: "How far from Point A will you pick up?",
    deliveryRQ: "How far from Point B will you deliver?",
    contactPrefs: "Contact preferences",
    openChat: "Open for chat messages",
    openCalls: "Open for direct calls",
    openSMS: "Open for SMS",
    phone: "Phone number",
    phonePh: "+1 (555) 000-0000",
    post: "Post my request →",
    postD: "Post my route →",
    back: "← Back",
    posted: "Posted!",
    postedSub: "Your listing is live!",
    seeAll: "See all listings →",
    backHome: "← Back to home",
    feedTitle: "Live listings",
    all: "All",
    needTransport: "🐾 Need transport",
    drivers: "🚐 Drivers",
    needsT: "Needs transport",
    driver: "Driver",
    addPost: "+ Post",
    viewMap: "🗺 Route",
    chatBtn: "💬 Chat",
    callBtn: "📞 Call",
    smsBtn: "💬 SMS",
    openForCalls: "📞 Open for calls",
    openForSMS: "💬 Open for SMS",
    chatTitle: "Chat",
    chatPh: "Type a message...",
    send: "Send",
    disclaimer:
      "⚠️ PetAlong connects people. We are not responsible for arrangements made between users. All transactions are between parties directly.",
    loginRequired: "Sign in to contact",
    loginRequiredSub: "You need an account to message or call",
    signIn: "Sign in",
  },
  ru: {
    tagline: "Питомцы едут с теми, кто и так едет в ту сторону",
    iNeed: "Мне нужна перевозка",
    iNeedDesc: "Разместите запрос — водители найдут вас",
    iDrive: "Я еду",
    iDriveDesc: "Разместите маршрут и возьмите питомца попутно",
    browse: "Смотреть объявления →",
    howTitle: "Как это работает",
    how: [
      {
        icon: "📋",
        t: "Размести объявление",
        d: "Хозяин добавляет питомца с фото. Водитель — маршрут и радиус отклонения.",
      },
      {
        icon: "🔍",
        t: "Находим совпадения",
        d: "PetAlong показывает водителей чьи маршруты пересекаются с запросом.",
      },
      {
        icon: "💬",
        t: "Чат или звонок",
        d: "Пишите в чате или звоните напрямую. Вы выбираете как связаться.",
      },
      {
        icon: "🐾",
        t: "Питомец едет попутно",
        d: "Водитель берёт питомца по пути. Хозяин получает фото. Все довольны.",
      },
    ],
    loginTitle: "Войти в PetAlong",
    loginSub: "Войдите чтобы размещать или отвечать",
    fbBtn: "Войти через Facebook",
    orEmail: "или через почту",
    emailPh: "ваш@email.com",
    codePh: "Введите 6-значный код",
    sendCode: "Отправить код →",
    verify: "Подтвердить →",
    codeSent: "Код отправлен на вашу почту",
    ownerTitle: ["Мне нужно", "перевезти питомца"],
    ownerSub: "Разместите запрос — водители найдут вас",
    driverTitle: ["Я еду", "по маршруту"],
    driverSub: "Разместите поездку — хозяева питомцев найдут вас",
    pointA: "Откуда — Точка А",
    pointB: "Куда — Точка Б",
    cityZip: "Город или ZIP код",
    petName: "Имя питомца",
    weight: "Вес (фунты)",
    petType: "Вид питомца",
    petTypes: ["Собака", "Кошка", "Кролик", "Птица", "Другое"],
    petPhoto: "Фото питомца",
    addPhoto: "📷 Добавить фото",
    readyFrom: "Готов с",
    deliverBy: "Доставить до",
    travelDate: "Дата поездки",
    maxWeight: "Макс. вес (фунты)",
    pickupR: "Радиус забора",
    deliveryR: "Радиус доставки",
    pickupRQ: "На сколько миль отъедете от точки А чтобы забрать?",
    deliveryRQ: "На сколько миль отклонитесь от точки Б чтобы доставить?",
    contactPrefs: "Способы связи",
    openChat: "Открыт для чата",
    openCalls: "Открыт для звонков",
    openSMS: "Открыт для SMS",
    phone: "Номер телефона",
    phonePh: "+1 (555) 000-0000",
    post: "Разместить запрос →",
    postD: "Разместить маршрут →",
    back: "← Назад",
    posted: "Размещено!",
    postedSub: "Ваше объявление опубликовано!",
    seeAll: "Смотреть объявления →",
    backHome: "← На главную",
    feedTitle: "Объявления",
    all: "Все",
    needTransport: "🐾 Нужна перевозка",
    drivers: "🚐 Водители",
    needsT: "Нужна перевозка",
    driver: "Водитель",
    addPost: "+ Разместить",
    viewMap: "🗺 Маршрут",
    chatBtn: "💬 Чат",
    callBtn: "📞 Звонок",
    smsBtn: "💬 SMS",
    openForCalls: "📞 Открыт для звонков",
    openForSMS: "💬 Открыт для SMS",
    chatTitle: "Чат",
    chatPh: "Написать сообщение...",
    send: "Отправить",
    disclaimer:
      "⚠️ PetAlong только соединяет людей. Мы не несём ответственности за договорённости между пользователями.",
    loginRequired: "Войдите чтобы написать",
    loginRequiredSub: "Нужен аккаунт чтобы отправить сообщение или позвонить",
    signIn: "Войти",
  },
};

const mockListings = [
  {
    id: 1,
    type: "owner",
    from: "Lincoln, NE",
    to: "Dallas, TX",
    animal: "Buddy",
    petType: "Dog",
    weight: 45,
    dateFrom: "May 20",
    dateTo: "May 22",
    avatar: "🐕",
    openChat: true,
    openCalls: true,
    openSMS: false,
    photo: null,
    user: "Sarah M.",
    verified: true,
  },
  {
    id: 2,
    type: "owner",
    from: "Phoenix, AZ",
    to: "Houston, TX",
    animal: "Raven",
    petType: "Cat",
    weight: 10,
    dateFrom: "May 15",
    dateTo: "May 16",
    avatar: "🐈",
    openChat: true,
    openCalls: false,
    openSMS: true,
    photo: null,
    user: "Tom K.",
    verified: true,
  },
  {
    id: 3,
    type: "driver",
    from: "Chicago, IL",
    to: "Miami, FL",
    animal: null,
    weight: 80,
    dateFrom: "May 18",
    dateTo: "May 19",
    avatar: "🚐",
    radiusFrom: 75,
    radiusTo: 50,
    openChat: true,
    openCalls: true,
    openSMS: true,
    user: "Mike D.",
    verified: true,
  },
  {
    id: 4,
    type: "owner",
    from: "Atlanta, GA",
    to: "Stafford, VA",
    animal: "Max",
    petType: "Dog",
    weight: 35,
    dateFrom: "May 25",
    dateTo: "May 27",
    avatar: "🐕",
    openChat: true,
    openCalls: false,
    openSMS: false,
    photo: null,
    user: "Lisa R.",
    verified: false,
  },
  {
    id: 5,
    type: "driver",
    from: "Denver, CO",
    to: "Los Angeles, CA",
    animal: null,
    weight: 60,
    dateFrom: "May 21",
    dateTo: "May 22",
    avatar: "🚐",
    radiusFrom: 100,
    radiusTo: 120,
    openChat: true,
    openCalls: true,
    openSMS: false,
    user: "Alex P.",
    verified: true,
  },
];

const mockMessages = [
  {
    id: 1,
    from: "them",
    text: "Hi! I saw your listing. I'm driving from Chicago to Miami on May 18. Can I take Buddy along?",
    time: "10:32 AM",
  },
  {
    id: 2,
    from: "me",
    text: "That's perfect timing! What's your rate?",
    time: "10:35 AM",
  },
  {
    id: 3,
    from: "them",
    text: "I'd do $180 for the trip. Buddy would ride in the cabin with me, AC on the whole time 🐕",
    time: "10:37 AM",
  },
];

const openMaps = (a, b) =>
  window.open(
    `https://www.google.com/maps/dir/${encodeURIComponent(
      a
    )}/${encodeURIComponent(b)}`,
    "_blank"
  );

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0d1117; font-family: 'DM Sans', sans-serif; color: #fff; }
  input[type=range] { accent-color: #f0a030; cursor: pointer; width: 100%; }
  input[type=range].green { accent-color: #3fb950; }
  textarea { resize: none; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes pop { 0% { transform: scale(.5); opacity: 0; } 60% { transform: scale(1.1); } 100% { transform: scale(1); opacity: 1; } }
  .fade { animation: fadeIn .3s ease; }
  .pop { animation: pop .4s ease; }
`;

export default function App() {
  const [lang, setLang] = useState("en");
  const [view, setView] = useState("home");
  const [filter, setFilter] = useState("all");
  const [submitted, setSubmitted] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loginStep, setLoginStep] = useState("main"); // main | email | code
  const [loginEmail, setLoginEmail] = useState("");
  const [loginCode, setLoginCode] = useState("");
  const [chatWith, setChatWith] = useState(null);
  const [messages, setMessages] = useState(mockMessages);
  const [newMsg, setNewMsg] = useState("");
  const [petPhoto, setPetPhoto] = useState(null);
  const photoRef = useRef();
  const t = T[lang];

  const [oF, setOF] = useState({
    from: "",
    to: "",
    name: "",
    weight: "",
    petType: "Dog",
    d1: "",
    d2: "",
    ph: "",
    openChat: true,
    openCalls: false,
    openSMS: false,
  });
  const [dF, setDF] = useState({
    from: "",
    to: "",
    date: "",
    cap: "",
    ph: "",
    rA: 50,
    rB: 50,
    openChat: true,
    openCalls: false,
    openSMS: false,
  });

  const COUNTRIES = [
    "USA",
    "Canada",
    "UK",
    "Australia",
    "Germany",
    "France",
    "Spain",
    "Italy",
    "Netherlands",
    "Poland",
    "Ukraine",
    "Russia",
    "Mexico",
    "Brazil",
    "India",
    "China",
    "Japan",
    "South Korea",
    "Israel",
    "UAE",
    "Other",
  ];

  const [countrySearch, setCountrySearch] = useState("");
  const [showCountries, setShowCountries] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("USA");

  const filteredCountries = COUNTRIES.filter((c) =>
    c.toLowerCase().includes(countrySearch.toLowerCase())
  );
  const filtered =
    filter === "all"
      ? mockListings
      : mockListings.filter((l) => l.type === filter);

  const CountryPicker = () => (
    <div style={{ marginBottom: 16, position: "relative" }}>
      <Label>🌍 Country</Label>
      <div
        style={{
          ...FIELD,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          background: "#ffffff",
        }}
        onClick={() => setShowCountries(!showCountries)}
      >
        <span style={{ color: "#1a1a1a", fontWeight: 500 }}>
          {selectedCountry}
        </span>
        <span style={{ color: "#888" }}>▾</span>
      </div>
      {showCountries && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "#ffffff",
            border: "2px solid #f0a030",
            borderRadius: 10,
            zIndex: 50,
            maxHeight: 220,
            overflowY: "auto",
            boxShadow: "0 8px 30px rgba(0,0,0,.3)",
          }}
        >
          <input
            autoFocus
            placeholder="Search country..."
            value={countrySearch}
            onChange={(e) => setCountrySearch(e.target.value)}
            style={{
              ...FIELD,
              borderRadius: "8px 8px 0 0",
              borderBottom: "1px solid #eee",
            }}
          />
          {filteredCountries.map((c) => (
            <div
              key={c}
              onClick={() => {
                setSelectedCountry(c);
                setShowCountries(false);
                setCountrySearch("");
              }}
              style={{
                padding: "11px 15px",
                cursor: "pointer",
                color: "#1a1a1a",
                fontSize: 14,
                fontWeight: c === selectedCountry ? 700 : 400,
                background: c === selectedCountry ? "#fff8ee" : "#fff",
                borderBottom: "1px solid #f0f0f0",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.background = "#fff8ee")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.background =
                  c === selectedCountry ? "#fff8ee" : "#fff")
              }
            >
              {c === selectedCountry ? "✓ " : ""}
              {c}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const handleContact = (listing, type) => {
    if (!loggedIn) {
      setShowLogin(true);
      return;
    }
    if (type === "chat") {
      setChatWith(listing);
      setView("chat");
    }
    if (type === "call") window.open(`tel:+15550001234`);
    if (type === "sms") window.open(`sms:+15550001234`);
  };

  const sendMsg = () => {
    if (!newMsg.trim()) return;
    setMessages([
      ...messages,
      {
        id: Date.now(),
        from: "me",
        text: newMsg,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
    setNewMsg("");
  };

  // ─── SHARED COMPONENTS ─────────────────────────────────────

  const Nav = ({ showPost = false }) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 20px",
        borderBottom: `1px solid ${C.border}`,
        position: "sticky",
        top: 0,
        background: "rgba(13,17,23,0.97)",
        backdropFilter: "blur(12px)",
        zIndex: 100,
      }}
    >
      <div
        onClick={() => {
          setView("home");
          setSubmitted(false);
        }}
        style={{
          fontFamily: "Syne,sans-serif",
          fontWeight: 800,
          fontSize: 20,
          cursor: "pointer",
          letterSpacing: -1,
        }}
      >
        Pet<span style={{ color: C.orange }}>Along</span>
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        {showPost && (
          <Btn small onClick={() => setView("owner")}>
            {t.addPost}
          </Btn>
        )}
        {loggedIn ? (
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: C.orange,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              color: C.bg,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            V
          </div>
        ) : (
          <Btn small ghost onClick={() => setShowLogin(true)}>
            {t.signIn}
          </Btn>
        )}
        <button
          onClick={() => setLang("en")}
          style={{
            background: lang === "en" ? C.card : "transparent",
            border: `1px solid ${lang === "en" ? C.orange : C.border}`,
            color: lang === "en" ? C.orange : C.muted,
            padding: "5px 11px",
            borderRadius: 100,
            fontSize: 11,
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          EN
        </button>
        <button
          onClick={() => setLang("ru")}
          style={{
            background: lang === "ru" ? C.card : "transparent",
            border: `1px solid ${lang === "ru" ? C.orange : C.border}`,
            color: lang === "ru" ? C.orange : C.muted,
            padding: "5px 11px",
            borderRadius: 100,
            fontSize: 11,
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          RU
        </button>
      </div>
    </div>
  );

  const Btn = ({ children, onClick, small, ghost, danger, full, disabled }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: danger ? C.red : ghost ? "transparent" : C.orange,
        border: ghost ? `1px solid ${C.border}` : "none",
        borderRadius: small ? 100 : 12,
        padding: small ? "6px 14px" : full ? "16px" : "12px 20px",
        width: full ? "100%" : "auto",
        color: ghost ? C.muted : danger ? "#fff" : "#0d1117",
        fontFamily: "'DM Sans',sans-serif",
        fontSize: small ? 12 : 15,
        fontWeight: 600,
        cursor: "pointer",
        transition: "all .15s",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {children}
    </button>
  );

  const Label = ({ children }) => (
    <div
      style={{
        fontSize: 10,
        letterSpacing: "1.5px",
        textTransform: "uppercase",
        color: C.muted,
        marginBottom: 7,
        fontWeight: 600,
      }}
    >
      {children}
    </div>
  );

  const Field = ({ label, ph, val, onChange, type = "text" }) => (
    <div style={{ marginBottom: 16 }}>
      {label && <Label>{label}</Label>}
      <input
        type={type}
        placeholder={ph}
        value={val}
        onChange={onChange}
        style={FIELD}
        onFocus={(e) => {
          e.target.style.borderColor = C.orange;
          e.target.style.boxShadow = "0 0 0 3px rgba(240,160,48,.2)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "#d0d7de";
          e.target.style.boxShadow = "none";
        }}
      />
    </div>
  );

  const Toggle = ({ label, checked, onChange }) => (
    <div
      onClick={onChange}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 16px",
        background: C.card,
        border: `1px solid ${C.border}`,
        borderRadius: 10,
        marginBottom: 10,
        cursor: "pointer",
      }}
    >
      <span style={{ fontSize: 14, color: "#c9d1d9", fontWeight: 500 }}>
        {label}
      </span>
      <div
        style={{
          width: 44,
          height: 24,
          borderRadius: 12,
          background: checked ? C.green : C.border,
          position: "relative",
          transition: "background .2s",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: "#fff",
            position: "absolute",
            top: 3,
            left: checked ? 23 : 3,
            transition: "left .2s",
          }}
        />
      </div>
    </div>
  );

  const Divider = ({ label }) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        margin: "20px 0",
      }}
    >
      <div style={{ flex: 1, height: 1, background: C.border }} />
      <span
        style={{
          fontSize: 10,
          letterSpacing: "2px",
          textTransform: "uppercase",
          color: "#484f58",
          fontWeight: 600,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
      <div style={{ flex: 1, height: 1, background: C.border }} />
    </div>
  );

  const Slider = ({ label, val, onChange, color = "orange" }) => (
    <div
      style={{
        background: C.card,
        border: `2px solid ${C.border}`,
        borderRadius: 12,
        padding: "16px 16px 12px",
        marginBottom: 16,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <span style={{ fontSize: 13, color: "#c9d1d9" }}>{label}</span>
        <span
          style={{
            fontFamily: "Syne,sans-serif",
            fontWeight: 800,
            fontSize: 24,
            color: color === "green" ? C.green : C.orange,
          }}
        >
          {val}{" "}
          <span style={{ fontSize: 12, fontWeight: 500, color: C.muted }}>
            mi
          </span>
        </span>
      </div>
      <input
        type="range"
        className={color}
        min={0}
        max={300}
        step={1}
        value={val}
        onChange={onChange}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 4,
        }}
      >
        <span style={{ fontSize: 10, color: "#484f58" }}>0</span>
        <span style={{ fontSize: 10, color: "#484f58" }}>300 mi</span>
      </div>
    </div>
  );

  const Page = ({ children }) => (
    <div style={{ maxWidth: 520, margin: "0 auto", padding: "24px 20px 80px" }}>
      {children}
    </div>
  );
  const PageTitle = ({ lines }) => (
    <div
      style={{
        fontFamily: "Syne,sans-serif",
        fontWeight: 800,
        fontSize: "clamp(24px,6vw,32px)",
        letterSpacing: -1.5,
        marginBottom: 6,
        lineHeight: 1.1,
      }}
    >
      {lines[0]}
      <br />
      {lines[1]}
    </div>
  );
  const PageSub = ({ text }) => (
    <div
      style={{
        fontSize: 14,
        color: C.muted,
        marginBottom: 24,
        lineHeight: 1.6,
      }}
    >
      {text}
    </div>
  );
  const BackBtn = ({ to }) => (
    <button
      onClick={() => setView(to)}
      style={{
        background: "none",
        border: "none",
        color: C.muted,
        fontSize: 14,
        cursor: "pointer",
        marginBottom: 24,
        padding: 0,
        fontWeight: 500,
      }}
    >
      {t.back}
    </button>
  );

  // ─── LOGIN MODAL ────────────────────────────────────────────
  const LoginModal = () => (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.8)",
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
      onClick={() => setShowLogin(false)}
    >
      <div
        className="fade"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#1c2128",
          border: `1px solid ${C.border}`,
          borderRadius: 20,
          padding: 32,
          width: "100%",
          maxWidth: 380,
        }}
      >
        <div
          style={{
            fontFamily: "Syne,sans-serif",
            fontWeight: 800,
            fontSize: 22,
            marginBottom: 6,
          }}
        >
          {t.loginTitle}
        </div>
        <div style={{ fontSize: 14, color: C.muted, marginBottom: 24 }}>
          {t.loginSub}
        </div>

        {loginStep === "main" && (
          <>
            <button
              onClick={() => {
                setLoggedIn(true);
                setShowLogin(false);
              }}
              style={{
                width: "100%",
                background: "#1877f2",
                border: "none",
                borderRadius: 12,
                padding: "16px 20px",
                color: "#fff",
                fontSize: 16,
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
              }}
            >
              <span style={{ fontSize: 22, fontWeight: 900 }}>f</span> {t.fbBtn}
            </button>
            <div
              style={{
                fontSize: 12,
                color: C.muted,
                textAlign: "center",
                marginTop: 16,
                lineHeight: 1.6,
              }}
            >
              We only use your name and profile photo. No posting on your
              behalf.
            </div>
          </>
        )}
      </div>
    </div>
  );

  // ─── CHAT VIEW ──────────────────────────────────────────────
  if (view === "chat" && chatWith)
    return (
      <div
        style={{
          minHeight: "100vh",
          background: C.bg,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <style>{css}</style>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "14px 20px",
            borderBottom: `1px solid ${C.border}`,
            background: "rgba(13,17,23,.97)",
          }}
        >
          <button
            onClick={() => setView("feed")}
            style={{
              background: "none",
              border: "none",
              color: C.muted,
              fontSize: 20,
              cursor: "pointer",
              padding: 0,
            }}
          >
            ←
          </button>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: C.orange,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
            }}
          >
            {chatWith.avatar}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{chatWith.user}</div>
            <div style={{ fontSize: 12, color: C.green }}>● Online</div>
          </div>
          {chatWith.openCalls && (
            <button
              onClick={() => window.open("tel:+15550001234")}
              style={{
                marginLeft: "auto",
                background: "transparent",
                border: `1px solid ${C.green}`,
                color: C.green,
                borderRadius: 100,
                padding: "6px 14px",
                fontSize: 12,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              📞 Call
            </button>
          )}
        </div>

        <div
          style={{
            flex: 1,
            padding: "20px 16px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <div
            style={{
              textAlign: "center",
              fontSize: 12,
              color: C.muted,
              padding: "8px 16px",
              background: C.card,
              borderRadius: 100,
              alignSelf: "center",
            }}
          >
            {chatWith.from} → {chatWith.to}
          </div>
          {messages.map((m) => (
            <div
              key={m.id}
              className="fade"
              style={{
                display: "flex",
                justifyContent: m.from === "me" ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  maxWidth: "78%",
                  background: m.from === "me" ? C.orange : C.card,
                  color: m.from === "me" ? "#0d1117" : "#c9d1d9",
                  borderRadius:
                    m.from === "me"
                      ? "18px 18px 4px 18px"
                      : "18px 18px 18px 4px",
                  padding: "10px 14px",
                  fontSize: 14,
                  lineHeight: 1.5,
                }}
              >
                {m.text}
                <div
                  style={{
                    fontSize: 10,
                    opacity: 0.6,
                    marginTop: 4,
                    textAlign: "right",
                  }}
                >
                  {m.time}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            padding: "12px 16px",
            borderTop: `1px solid ${C.border}`,
            background: "rgba(13,17,23,.97)",
            display: "flex",
            gap: 10,
          }}
        >
          <input
            value={newMsg}
            onChange={(e) => setNewMsg(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMsg()}
            placeholder={t.chatPh}
            style={{
              ...FIELD,
              flex: 1,
              padding: "12px 14px",
              borderRadius: 100,
            }}
          />
          <button
            onClick={sendMsg}
            style={{
              background: C.orange,
              border: "none",
              borderRadius: "50%",
              width: 44,
              height: 44,
              cursor: "pointer",
              fontSize: 18,
              flexShrink: 0,
            }}
          >
            ↑
          </button>
        </div>
      </div>
    );

  // ─── SUBMITTED ──────────────────────────────────────────────
  if (submitted)
    return (
      <div style={{ minHeight: "100vh", background: C.bg }}>
        <style>{css}</style>
        <Nav />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "80vh",
            textAlign: "center",
            padding: 20,
          }}
        >
          <div className="pop" style={{ fontSize: 72, marginBottom: 20 }}>
            🐾
          </div>
          <div
            style={{
              fontFamily: "Syne,sans-serif",
              fontWeight: 800,
              fontSize: 30,
              marginBottom: 8,
            }}
          >
            {t.posted}
          </div>
          <div style={{ color: C.muted, marginBottom: 32 }}>{t.postedSub}</div>
          <Btn
            full
            onClick={() => {
              setSubmitted(false);
              setView("feed");
            }}
          >
            {t.seeAll}
          </Btn>
          <button
            onClick={() => {
              setSubmitted(false);
              setView("home");
            }}
            style={{
              background: "none",
              border: "none",
              color: C.muted,
              fontSize: 13,
              cursor: "pointer",
              marginTop: 14,
            }}
          >
            {t.backHome}
          </button>
        </div>
      </div>
    );

  // ─── OWNER FORM ─────────────────────────────────────────────
  if (view === "owner")
    return (
      <div style={{ minHeight: "100vh", background: C.bg }}>
        <style>{css}</style>
        {showLogin && <LoginModal />}
        <Nav />
        <Page>
          <BackBtn to="home" />
          <PageTitle lines={t.ownerTitle} />
          <PageSub text={t.ownerSub} />

          {/* Pet Photo Upload */}
          <div style={{ marginBottom: 20 }}>
            <Label>{t.petPhoto}</Label>
            <div
              onClick={() => photoRef.current.click()}
              style={{
                border: `2px dashed ${petPhoto ? C.green : C.border}`,
                borderRadius: 12,
                padding: 24,
                textAlign: "center",
                cursor: "pointer",
                background: C.card,
                transition: "all .2s",
              }}
            >
              {petPhoto ? (
                <img
                  src={petPhoto}
                  alt="pet"
                  style={{
                    width: "100%",
                    maxHeight: 200,
                    objectFit: "cover",
                    borderRadius: 8,
                  }}
                />
              ) : (
                <div>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>🐾</div>
                  <div style={{ fontSize: 14, color: C.muted }}>
                    {t.addPhoto}
                  </div>
                </div>
              )}
            </div>
            <input
              ref={photoRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const f = e.target.files[0];
                if (f) {
                  const r = new FileReader();
                  r.onload = (ev) => setPetPhoto(ev.target.result);
                  r.readAsDataURL(f);
                }
              }}
            />
          </div>

          <CountryPicker />
          <Field
            label={t.pointA}
            ph={t.cityZip}
            val={oF.from}
            onChange={(e) => setOF({ ...oF, from: e.target.value })}
          />
          <Field
            label={t.pointB}
            ph={t.cityZip}
            val={oF.to}
            onChange={(e) => setOF({ ...oF, to: e.target.value })}
          />

          {oF.from && oF.to && (
            <button
              onClick={() => openMaps(oF.from, oF.to)}
              style={{
                width: "100%",
                background: "transparent",
                border: `1px solid #238636`,
                color: C.green,
                borderRadius: 10,
                padding: "10px",
                fontSize: 13,
                cursor: "pointer",
                fontWeight: 600,
                marginBottom: 16,
              }}
            >
              🗺 {t.viewMap}: {oF.from} → {oF.to}
            </button>
          )}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginBottom: 0,
            }}
          >
            <Field
              label={t.petName}
              ph="Buddy"
              val={oF.name}
              onChange={(e) => setOF({ ...oF, name: e.target.value })}
            />
            <Field
              label={t.weight}
              ph="45"
              type="number"
              val={oF.weight}
              onChange={(e) => setOF({ ...oF, weight: e.target.value })}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <Label>{t.petType}</Label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {t.petTypes.map((pt) => (
                <button
                  key={pt}
                  onClick={() => setOF({ ...oF, petType: pt })}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 100,
                    border: `1px solid ${
                      oF.petType === pt ? C.orange : C.border
                    }`,
                    background:
                      oF.petType === pt
                        ? "rgba(240,160,48,.15)"
                        : "transparent",
                    color: oF.petType === pt ? C.orange : C.muted,
                    fontSize: 13,
                    cursor: "pointer",
                    fontWeight: 500,
                  }}
                >
                  {pt}
                </button>
              ))}
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginBottom: 0,
            }}
          >
            <Field
              label={t.readyFrom}
              ph=""
              type="date"
              val={oF.d1}
              onChange={(e) => setOF({ ...oF, d1: e.target.value })}
            />
            <Field
              label={t.deliverBy}
              ph=""
              type="date"
              val={oF.d2}
              onChange={(e) => setOF({ ...oF, d2: e.target.value })}
            />
          </div>

          <Divider label={t.contactPrefs} />
          <Toggle
            label={t.openChat}
            checked={oF.openChat}
            onChange={() => setOF({ ...oF, openChat: !oF.openChat })}
          />
          <Toggle
            label={t.openCalls}
            checked={oF.openCalls}
            onChange={() => setOF({ ...oF, openCalls: !oF.openCalls })}
          />
          <Toggle
            label={t.openSMS}
            checked={oF.openSMS}
            onChange={() => setOF({ ...oF, openSMS: !oF.openSMS })}
          />

          {(oF.openCalls || oF.openSMS) && (
            <Field
              label={t.phone}
              ph={t.phonePh}
              type="tel"
              val={oF.ph}
              onChange={(e) => setOF({ ...oF, ph: e.target.value })}
            />
          )}

          <button
            onClick={() => {
              if (!loggedIn) {
                setShowLogin(true);
                return;
              }
              setSubmitted(true);
            }}
            style={{
              width: "100%",
              background: C.orange,
              border: "none",
              borderRadius: 14,
              padding: 17,
              color: C.bg,
              fontFamily: "Syne,sans-serif",
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer",
              marginTop: 8,
            }}
          >
            {t.post}
          </button>
        </Page>
      </div>
    );

  // ─── DRIVER FORM ─────────────────────────────────────────────
  if (view === "driver")
    return (
      <div style={{ minHeight: "100vh", background: C.bg }}>
        <style>{css}</style>
        {showLogin && <LoginModal />}
        <Nav />
        <Page>
          <BackBtn to="home" />
          <PageTitle lines={t.driverTitle} />
          <PageSub text={t.driverSub} />

          <CountryPicker />
          <Field
            label={t.pointA}
            ph={t.cityZip}
            val={dF.from}
            onChange={(e) => setDF({ ...dF, from: e.target.value })}
          />
          <Field
            label={t.pointB}
            ph={t.cityZip}
            val={dF.to}
            onChange={(e) => setDF({ ...dF, to: e.target.value })}
          />

          {dF.from && dF.to && (
            <button
              onClick={() => openMaps(dF.from, dF.to)}
              style={{
                width: "100%",
                background: "transparent",
                border: `1px solid #238636`,
                color: C.green,
                borderRadius: 10,
                padding: "10px",
                fontSize: 13,
                cursor: "pointer",
                fontWeight: 600,
                marginBottom: 16,
              }}
            >
              🗺 {t.viewMap}: {dF.from} → {dF.to}
            </button>
          )}

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <Field
              label={t.travelDate}
              ph=""
              type="date"
              val={dF.date}
              onChange={(e) => setDF({ ...dF, date: e.target.value })}
            />
            <Field
              label={t.maxWeight}
              ph="80"
              type="number"
              val={dF.cap}
              onChange={(e) => setDF({ ...dF, cap: e.target.value })}
            />
          </div>

          <Divider label={t.pickupR} />
          <Slider
            label={t.pickupRQ}
            val={dF.rA}
            onChange={(e) => setDF({ ...dF, rA: Number(e.target.value) })}
            color="orange"
          />

          <Divider label={t.deliveryR} />
          <Slider
            label={t.deliveryRQ}
            val={dF.rB}
            onChange={(e) => setDF({ ...dF, rB: Number(e.target.value) })}
            color="green"
          />

          <Divider label={t.contactPrefs} />
          <Toggle
            label={t.openChat}
            checked={dF.openChat}
            onChange={() => setDF({ ...dF, openChat: !dF.openChat })}
          />
          <Toggle
            label={t.openCalls}
            checked={dF.openCalls}
            onChange={() => setDF({ ...dF, openCalls: !dF.openCalls })}
          />
          <Toggle
            label={t.openSMS}
            checked={dF.openSMS}
            onChange={() => setDF({ ...dF, openSMS: !dF.openSMS })}
          />

          {(dF.openCalls || dF.openSMS) && (
            <Field
              label={t.phone}
              ph={t.phonePh}
              type="tel"
              val={dF.ph}
              onChange={(e) => setDF({ ...dF, ph: e.target.value })}
            />
          )}

          <button
            onClick={() => {
              if (!loggedIn) {
                setShowLogin(true);
                return;
              }
              setSubmitted(true);
            }}
            style={{
              width: "100%",
              background: C.orange,
              border: "none",
              borderRadius: 14,
              padding: 17,
              color: C.bg,
              fontFamily: "Syne,sans-serif",
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer",
              marginTop: 8,
            }}
          >
            {t.postD}
          </button>
        </Page>
      </div>
    );

  // ─── FEED ────────────────────────────────────────────────────
  if (view === "feed")
    return (
      <div style={{ minHeight: "100vh", background: C.bg }}>
        <style>{css}</style>
        {showLogin && <LoginModal />}
        <Nav showPost />
        <div
          style={{ maxWidth: 600, margin: "0 auto", padding: "24px 20px 80px" }}
        >
          <BackBtn to="home" />
          <div
            style={{
              fontFamily: "Syne,sans-serif",
              fontWeight: 800,
              fontSize: 26,
              marginBottom: 4,
            }}
          >
            {t.feedTitle}
          </div>
          <div style={{ color: C.muted, fontSize: 13, marginBottom: 18 }}>
            {filtered.length} active
          </div>

          <div
            style={{
              display: "flex",
              gap: 8,
              marginBottom: 20,
              flexWrap: "wrap",
            }}
          >
            {[
              ["all", t.all],
              ["owner", t.needTransport],
              ["driver", t.drivers],
            ].map(([f, label]) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: "7px 16px",
                  borderRadius: 100,
                  fontSize: 12,
                  border: `1px solid ${filter === f ? C.orange : C.border}`,
                  background: filter === f ? C.orange : "transparent",
                  color: filter === f ? C.bg : C.muted,
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {filtered.map((l) => (
            <div
              key={l.id}
              className="fade"
              style={{
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: 18,
                padding: "18px 20px",
                marginBottom: 12,
              }}
            >
              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ fontSize: 28, marginTop: 2 }}>{l.avatar}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  {/* Route */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 8,
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "Syne,sans-serif",
                        fontWeight: 700,
                        fontSize: 16,
                      }}
                    >
                      {l.from.split(",")[0]}
                    </span>
                    <span style={{ color: "#484f58" }}>→</span>
                    <span
                      style={{
                        fontFamily: "Syne,sans-serif",
                        fontWeight: 700,
                        fontSize: 16,
                      }}
                    >
                      {l.to.split(",")[0]}
                    </span>
                    {l.verified && (
                      <span
                        style={{
                          fontSize: 10,
                          background: "rgba(88,166,255,.15)",
                          color: C.blue,
                          padding: "2px 8px",
                          borderRadius: 100,
                          fontWeight: 600,
                        }}
                      >
                        ✓ verified
                      </span>
                    )}
                  </div>

                  {/* Meta */}
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      flexWrap: "wrap",
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 10,
                        letterSpacing: "1.5px",
                        textTransform: "uppercase",
                        padding: "3px 9px",
                        borderRadius: 100,
                        fontWeight: 600,
                        background:
                          l.type === "owner"
                            ? "rgba(240,160,48,.18)"
                            : "rgba(63,185,80,.18)",
                        color: l.type === "owner" ? C.orange : C.green,
                      }}
                    >
                      {l.type === "owner" ? t.needsT : t.driver}
                    </span>
                    <span style={{ fontSize: 12, color: C.muted }}>
                      {l.dateFrom}
                      {l.dateTo ? ` – ${l.dateTo}` : ""}
                    </span>
                    <span style={{ fontSize: 12, color: C.muted }}>
                      {l.type === "owner"
                        ? `${l.animal} (${l.petType}), ${l.weight} lbs`
                        : `≤ ${l.weight} lbs`}
                    </span>
                    <span style={{ fontSize: 12, color: C.muted }}>
                      by {l.user}
                    </span>
                  </div>

                  {/* Driver radius */}
                  {l.type === "driver" && l.radiusFrom != null && (
                    <div
                      style={{
                        fontSize: 12,
                        color: C.green,
                        marginBottom: 8,
                        fontWeight: 500,
                      }}
                    >
                      📍 ±{l.radiusFrom} mi pickup · 🏁 ±{l.radiusTo} mi
                      delivery
                    </div>
                  )}

                  {/* Contact badges */}
                  <div
                    style={{
                      display: "flex",
                      gap: 6,
                      marginBottom: 10,
                      flexWrap: "wrap",
                    }}
                  >
                    {l.openCalls && (
                      <span
                        style={{
                          fontSize: 11,
                          color: C.green,
                          background: "rgba(63,185,80,.12)",
                          padding: "3px 8px",
                          borderRadius: 100,
                          fontWeight: 500,
                        }}
                      >
                        {t.openForCalls}
                      </span>
                    )}
                    {l.openSMS && (
                      <span
                        style={{
                          fontSize: 11,
                          color: C.blue,
                          background: "rgba(88,166,255,.12)",
                          padding: "3px 8px",
                          borderRadius: 100,
                          fontWeight: 500,
                        }}
                      >
                        {t.openForSMS}
                      </span>
                    )}
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button
                      onClick={() => openMaps(l.from, l.to)}
                      style={{
                        background: "transparent",
                        border: `1px solid #238636`,
                        color: C.green,
                        padding: "7px 12px",
                        borderRadius: 10,
                        fontSize: 12,
                        cursor: "pointer",
                        fontWeight: 600,
                      }}
                    >
                      {t.viewMap}
                    </button>
                    {l.openChat && (
                      <button
                        onClick={() => handleContact(l, "chat")}
                        style={{
                          background: C.orange,
                          border: "none",
                          color: C.bg,
                          padding: "7px 12px",
                          borderRadius: 10,
                          fontSize: 12,
                          cursor: "pointer",
                          fontWeight: 700,
                        }}
                      >
                        {t.chatBtn}
                      </button>
                    )}
                    {l.openCalls && (
                      <button
                        onClick={() => handleContact(l, "call")}
                        style={{
                          background: "transparent",
                          border: `1px solid ${C.green}`,
                          color: C.green,
                          padding: "7px 12px",
                          borderRadius: 10,
                          fontSize: 12,
                          cursor: "pointer",
                          fontWeight: 600,
                        }}
                      >
                        {t.callBtn}
                      </button>
                    )}
                    {l.openSMS && (
                      <button
                        onClick={() => handleContact(l, "sms")}
                        style={{
                          background: "transparent",
                          border: `1px solid ${C.blue}`,
                          color: C.blue,
                          padding: "7px 12px",
                          borderRadius: 10,
                          fontSize: 12,
                          cursor: "pointer",
                          fontWeight: 600,
                        }}
                      >
                        {t.smsBtn}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );

  // ─── HOME ────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: C.bg }}>
      <style>{css}</style>
      {showLogin && <LoginModal />}
      <Nav />
      <div
        style={{
          minHeight: "92vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 500,
            height: 500,
            background:
              "radial-gradient(circle,rgba(240,160,48,.1) 0%,transparent 70%)",
            top: -100,
            left: -80,
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 400,
            height: 400,
            background:
              "radial-gradient(circle,rgba(63,185,80,.06) 0%,transparent 70%)",
            bottom: -60,
            right: -60,
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            fontFamily: "Syne,sans-serif",
            fontWeight: 800,
            fontSize: "clamp(42px,10vw,68px)",
            letterSpacing: -3,
            lineHeight: 1,
            marginBottom: 14,
          }}
        >
          Pet<span style={{ color: C.orange }}>Along</span>
        </div>
        <div
          style={{
            fontSize: 13,
            color: C.muted,
            letterSpacing: "2.5px",
            textTransform: "uppercase",
            marginBottom: 48,
            fontWeight: 500,
            maxWidth: 320,
            lineHeight: 1.7,
          }}
        >
          {t.tagline}
        </div>

        <div
          style={{
            display: "flex",
            gap: 16,
            marginBottom: 40,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {[
            [t.iNeed, "🐾", t.iNeedDesc, "owner"],
            [t.iDrive, "🚐", t.iDriveDesc, "driver"],
          ].map(([title, icon, desc, v]) => (
            <div
              key={v}
              onClick={() => setView(v)}
              style={{
                background: C.card,
                border: `1px solid ${C.border}`,
                borderRadius: 20,
                padding: "28px 28px",
                width: 200,
                cursor: "pointer",
                transition: "all .2s",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = C.orange;
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = C.border;
                e.currentTarget.style.transform = "none";
              }}
            >
              <div style={{ fontSize: 36, marginBottom: 12 }}>{icon}</div>
              <div
                style={{
                  fontFamily: "Syne,sans-serif",
                  fontWeight: 700,
                  fontSize: 16,
                  marginBottom: 8,
                }}
              >
                {title}
              </div>
              <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
                {desc}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => setView("feed")}
          style={{
            background: "transparent",
            border: `1px solid ${C.border}`,
            color: C.muted,
            padding: "11px 26px",
            borderRadius: 100,
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          {t.browse}
        </button>
      </div>

      {/* How it works */}
      <div style={{ borderTop: `1px solid ${C.border}`, padding: "50px 20px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div
            style={{
              fontFamily: "Syne,sans-serif",
              fontWeight: 800,
              fontSize: 24,
              letterSpacing: -1,
              marginBottom: 28,
              textAlign: "center",
            }}
          >
            {t.howTitle}
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
              gap: 14,
            }}
          >
            {t.how.map((h, i) => (
              <div
                key={i}
                style={{
                  background: C.card,
                  border: `1px solid ${C.border}`,
                  borderRadius: 16,
                  padding: 22,
                }}
              >
                <div style={{ fontSize: 26, marginBottom: 10 }}>{h.icon}</div>
                <div
                  style={{
                    fontFamily: "Syne,sans-serif",
                    fontWeight: 700,
                    fontSize: 15,
                    marginBottom: 8,
                  }}
                >
                  {h.t}
                </div>
                <div
                  style={{ fontSize: 14, color: "#c9d1d9", lineHeight: 1.65 }}
                >
                  {h.d}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          borderTop: `1px solid ${C.border}`,
          padding: "16px 24px",
          fontSize: 12,
          color: "#6e7681",
          textAlign: "center",
        }}
      >
        {t.disclaimer}
      </div>
    </div>
  );
}
