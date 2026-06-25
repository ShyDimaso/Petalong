import { useState, useRef, useEffect } from "react";

// ─── COLORS ───────────────────────────────────────────────────────────────────
const C = {
  bg: "#0d1117", card: "#161b22", card2: "#1c2128",
  border: "#30363d", border2: "#21262d",
  white: "#ffffff", muted: "#8b949e", muted2: "#6e7681",
  orange: "#f0a030", green: "#3fb950", red: "#f85149", blue: "#58a6ff",
  purple: "#bc8cff", yellow: "#e3b341",
};

// ─── INPUT STYLE ──────────────────────────────────────────────────────────────
const INP: React.CSSProperties = {
  width: "100%", background: "#f6f8fa", border: "2px solid #d0d7de",
  borderRadius: 10, padding: "13px 15px", color: "#1a1a1a",
  fontSize: 15, fontWeight: 500, outline: "none",
  WebkitAppearance: "none", boxSizing: "border-box",
  colorScheme: "light" as const,
};

// ─── COUNTRIES ────────────────────────────────────────────────────────────────
const COUNTRIES = ["USA","Canada","UK","Australia","Germany","France","Spain","Italy","Netherlands","Poland","Ukraine","Russia","Kazakhstan","Mexico","Brazil","India","China","Japan","South Korea","Israel","UAE","Argentina","Turkey","Sweden","Norway","Denmark","Finland","Switzerland","Austria","Belgium","Czech Republic","Hungary","Romania","Bulgaria","Greece","Portugal","New Zealand","Singapore","Malaysia","Thailand","Philippines","Vietnam","Indonesia","South Africa","Egypt","Morocco","Nigeria","Kenya","Other"];

// ─── PET TYPES ────────────────────────────────────────────────────────────────
const PET_TYPES = [
  {en:"Dog",ru:"Собака",icon:"🐕"},
  {en:"Cat",ru:"Кошка",icon:"🐈"},
  {en:"Rabbit",ru:"Кролик",icon:"🐇"},
  {en:"Bird",ru:"Птица",icon:"🦜"},
  {en:"Hamster",ru:"Хомяк",icon:"🐹"},
  {en:"Reptile",ru:"Рептилия",icon:"🦎"},
  {en:"Other",ru:"Другое",icon:"🐾"},
];

// ─── TRANSLATIONS ─────────────────────────────────────────────────────────────
const T = {
  en: {
    logo:"PetAlong", tagline:"Pets travel with people already going their way",
    signIn:"Sign in", signOut:"Sign out", myProfile:"My profile",
    iNeed:"I need transport", iNeedDesc:"Post your pet — drivers going your way will find you",
    iDrive:"I'm driving", iDriveDesc:"Post your route and earn by taking a pet along",
    browse:"Browse all listings →",
    howTitle:"How PetAlong works",
    how:[
      {icon:"📋",t:"Post your listing",d:"Owner posts pet details with photo. Driver posts route and detour radius. Takes 2 minutes."},
      {icon:"🔍",t:"Smart matching",d:"PetAlong automatically notifies you when a driver's route matches your pet's journey — or vice versa."},
      {icon:"💬",t:"Connect directly",d:"Chat in-app, call or SMS. You decide how to communicate. Agree on price and details between yourselves."},
      {icon:"🐾",t:"Pet travels safely",d:"Driver takes pet along their existing route. Owner gets peace of mind. Everyone saves money."},
    ],
    stats:[{n:"22,000+",l:"Community members"},{n:"50+",l:"Countries"},{n:"Free",l:"Forever for basics"},{n:"P2P",l:"Direct connections"}],
    whyTitle:"Why PetAlong?",
    why:[
      {icon:"💰",t:"Save up to 80%",d:"Professional pet couriers charge $500–2000+. With PetAlong, drivers are already going your way."},
      {icon:"🛡️",t:"Community trust",d:"Facebook-connected profiles, phone verification, ratings and reviews from real users."},
      {icon:"🌍",t:"Worldwide",d:"USA, Europe, Canada, Australia and 50+ countries. Your pet can go anywhere."},
      {icon:"⚡",t:"Fast & simple",d:"Post in 2 minutes. No complicated forms, no waiting for quotes, no middlemen."},
    ],
    ownerTitle:["I need to","transport my pet"],
    ownerSub:"Post your request — drivers going your route will find you",
    driverTitle:["I'm driving","this route"],
    driverSub:"Post your trip — owners with pets along your route will find you",
    pointA:"Pickup city / ZIP", pointB:"Delivery city / ZIP",
    country:"Country", searchCountry:"Search country...",
    petName:"Pet name", weight:"Weight (lbs)", petType:"Pet type",
    petPhoto:"Pet photo", addPhoto:"📷 Add pet photo (tap to upload)",
    readyFrom:"Ready from", deliverBy:"Deliver by",
    travelDate:"Travel date", maxWeight:"Max weight can carry (lbs)",
    pickupR:"Pickup detour radius", deliveryR:"Delivery detour radius",
    pickupRQ:"How far from departure will you go to pick up?",
    deliveryRQ:"How far from destination will you go to deliver?",
    contactPrefs:"Contact preferences",
    openChat:"Open for in-app chat messages",
    openCalls:"Open for direct phone calls",
    openSMS:"Open for SMS messages",
    phone:"Phone number", phonePh:"+1 (555) 000-0000",
    notes:"Additional notes (optional)", notesPh:"Any special requirements, pet behavior, preferred timing...",
    post:"Post my request →", postD:"Post my route →",
    back:"← Back", posted:"Posted!", postedSub:"Your listing is live on PetAlong!",
    seeAll:"Browse all listings →", backHome:"← Back to home",
    feedTitle:"Live listings", feedSub:(n:number)=>`${n} active listings`,
    filterCountry:"Filter by country", filterType:"Filter by pet type", filterAll:"All",
    needTransport:"🐾 Need transport", drivers:"🚐 Drivers",
    needsT:"Needs transport", driver:"Driver",
    addPost:"+ Post listing", viewMap:"🗺 Route", chatBtn:"💬 Chat",
    callBtn:"📞 Call", smsBtn:"💬 SMS", reportBtn:"🚩 Report",
    openForCalls:"📞 Open for calls", openForSMS:"💬 Open for SMS",
    verified:"✓ verified", fbConnected:"Facebook connected",
    phoneVerified:"Phone verified", memberSince:"Member since",
    chatTitle:"Chat", chatPh:"Type a message...", send:"Send",
    matchAlert:"🔔 Match found! A driver is heading your way →",
    matchAlertD:"🔔 Match found! A pet needs transport on your route →",
    loginTitle:"Join PetAlong", loginSub:"Sign in to post listings or contact others",
    fbBtn:"Continue with Facebook",
    phoneTitle:"Verify your phone",
    phoneSub:"We'll send a 6-digit code to confirm your number",
    sendCode:"Send verification code →", verify:"Verify & continue →",
    codeSent:"Code sent! Check your SMS.",
    codePh:"Enter 6-digit code",
    loginNote:"We only use your Facebook name and photo. We never post on your behalf.",
    reportTitle:"Report this listing",
    reportReasons:["Spam or fake listing","Suspicious or unsafe behavior","Wrong category","Scam attempt","Animal welfare concern","Other"],
    reportSubmit:"Submit report", reportCancel:"Cancel",
    reportThanks:"Thank you for your report. We'll review it shortly.",
    profileTitle:"Profile",
    myListings:"My listings", noListings:"You haven't posted any listings yet.",
    ratings:"Ratings & Reviews", noRatings:"No reviews yet.",
    aboutTitle:"About PetAlong",
    aboutSub:"The peer-to-peer pet transport community",
    aboutText:"PetAlong is a free community platform that connects pet owners who need transport with drivers who are already going that way. We believe in the power of community — neighbors helping neighbors, travelers helping travelers. PetAlong is the BlaBlaCar for pets.",
    aboutMission:"Our mission is simple: make pet transport accessible, affordable, and safe for everyone by connecting people who are already making the journey.",
    termsTitle:"Terms of Service",
    privacyTitle:"Privacy Policy",
    footer:{
      tagline:"Connecting pet owners with drivers going their way.",
      platform:"Platform",
      legal:"Legal",
      links:{about:"About",how:"How it works",browse:"Browse listings",post:"Post a listing",terms:"Terms of Service",privacy:"Privacy Policy",contact:"Contact"},
      disclaimer:"PetAlong is a neutral technology platform. We do not provide transportation services. We are not a transportation company. All arrangements are made directly between users. PetAlong is not responsible for any arrangements, transactions, disputes, or outcomes between users. Use of this platform constitutes acceptance of our Terms of Service.",
      copyright:"© 2025 PetAlong. Free community platform.",
    },
    terms:`TERMS OF SERVICE — PetAlong

Last updated: May 2025

1. PLATFORM NATURE
PetAlong ("we", "us", "platform") is a neutral technology platform, not a transportation company. We provide a bulletin board where users can post and find listings. We do not provide, arrange, or participate in any transportation services.

2. LIMITATION OF LIABILITY
TO THE FULLEST EXTENT PERMITTED BY LAW, PETALONG SHALL NOT BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES ARISING FROM YOUR USE OF THE PLATFORM. This includes but is not limited to: loss, injury, or death of animals; property damage; personal injury; financial loss; or disputes between users.

3. USER RESPONSIBILITY
You are solely responsible for: (a) verifying the identity and suitability of other users; (b) ensuring compliance with local laws regarding animal transport; (c) obtaining any required veterinary certificates, health certificates, or permits; (d) any arrangements, payments, or agreements made with other users.

4. RELEASE OF LIABILITY
By using PetAlong, you release PetAlong and its operators from any and all claims, demands, and damages arising from transactions or interactions with other users. This release covers all claims, known and unknown.

5. SECTION 230 NOTICE
PetAlong operates as an interactive computer service under Section 230 of the Communications Decency Act. We are not the publisher or speaker of any user-generated content and are not liable for content posted by users.

6. NO WARRANTIES
THE PLATFORM IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. We do not verify user identities beyond basic account creation, do not guarantee the accuracy of listings, and do not endorse any user.

7. PROHIBITED CONDUCT
Users may not: post false or misleading information; use the platform for commercial transportation without proper licensing; engage in fraud or scam activity; harass other users; post content that violates applicable law.

8. CONTACT
For questions: contact@petalonggo.com`,

    privacy:`PRIVACY POLICY — PetAlong

Last updated: May 2025

1. INFORMATION WE COLLECT
When you sign in with Facebook: your public name and profile photo. When you verify your phone: your phone number. When you post listings: the information you provide voluntarily.

2. HOW WE USE YOUR INFORMATION
To display your profile on listings you post. To facilitate contact between users. To verify your identity. We do not sell your personal information to third parties.

3. FACEBOOK LOGIN
We use Facebook Login for authentication. We only request access to your public profile (name and photo). We do not access your Facebook friends, posts, messages, or other data.

4. PHONE VERIFICATION
Your phone number is used solely for SMS verification. It is not displayed publicly unless you choose to share it in your listing.

5. USER CONTENT
Listings and messages you post may be visible to other users. You are responsible for the content you post.

6. DATA RETENTION
We retain your data for as long as your account is active. You may request deletion of your account and data at any time.

7. COOKIES
We use essential cookies for authentication and session management only.

8. CONTACT
privacy@petalonggo.com`,
  },
  ru: {
    logo:"PetAlong", tagline:"Питомцы едут с теми, кто и так едет в ту сторону",
    signIn:"Войти", signOut:"Выйти", myProfile:"Мой профиль",
    iNeed:"Нужна перевозка", iNeedDesc:"Разместите питомца — водители найдут вас по пути",
    iDrive:"Я еду", iDriveDesc:"Разместите маршрут и возьмите питомца попутно",
    browse:"Смотреть все объявления →",
    howTitle:"Как работает PetAlong",
    how:[
      {icon:"📋",t:"Размести объявление",d:"Хозяин добавляет питомца с фото. Водитель — маршрут и радиус отклонения. Занимает 2 минуты."},
      {icon:"🔍",t:"Умные совпадения",d:"PetAlong автоматически уведомляет когда маршрут водителя совпадает с маршрутом питомца — и наоборот."},
      {icon:"💬",t:"Связь напрямую",d:"Чат в приложении, звонок или SMS. Вы сами выбираете. Цену и детали договариваетесь между собой."},
      {icon:"🐾",t:"Питомец едет попутно",d:"Водитель берёт питомца по пути. Хозяин спокоен. Все экономят деньги."},
    ],
    stats:[{n:"22,000+",l:"Участников сообщества"},{n:"50+",l:"Стран"},{n:"Бесплатно",l:"Навсегда для основного"},{n:"P2P",l:"Прямые связи"}],
    whyTitle:"Почему PetAlong?",
    why:[
      {icon:"💰",t:"Экономия до 80%",d:"Профессиональные перевозчики берут $500–2000+. У нас водитель и так едет по маршруту."},
      {icon:"🛡️",t:"Доверие сообщества",d:"Профили через Facebook, верификация по телефону, рейтинги и отзывы реальных пользователей."},
      {icon:"🌍",t:"По всему миру",d:"США, Европа, Канада, Австралия и 50+ стран. Ваш питомец доедет куда угодно."},
      {icon:"⚡",t:"Быстро и просто",d:"Разместить объявление за 2 минуты. Без сложных форм, без ожидания, без посредников."},
    ],
    ownerTitle:["Мне нужно","перевезти питомца"],
    ownerSub:"Разместите запрос — водители по вашему маршруту найдут вас",
    driverTitle:["Я еду","по маршруту"],
    driverSub:"Разместите поездку — хозяева питомцев по пути найдут вас",
    pointA:"Откуда (город/ZIP)", pointB:"Куда (город/ZIP)",
    country:"Страна", searchCountry:"Поиск страны...",
    petName:"Имя питомца", weight:"Вес (фунты)", petType:"Вид питомца",
    petPhoto:"Фото питомца", addPhoto:"📷 Добавить фото питомца",
    readyFrom:"Готов с", deliverBy:"Доставить до",
    travelDate:"Дата поездки", maxWeight:"Макс. вес (фунты)",
    pickupR:"Радиус забора", deliveryR:"Радиус доставки",
    pickupRQ:"На сколько миль отъедете от точки А чтобы забрать?",
    deliveryRQ:"На сколько миль отклонитесь от точки Б чтобы доставить?",
    contactPrefs:"Способы связи",
    openChat:"Открыт для чата",
    openCalls:"Открыт для звонков",
    openSMS:"Открыт для SMS",
    phone:"Номер телефона", phonePh:"+1 (555) 000-0000",
    notes:"Дополнительно (необязательно)", notesPh:"Особые требования, характер питомца, удобное время...",
    post:"Разместить запрос →", postD:"Разместить маршрут →",
    back:"← Назад", posted:"Размещено!", postedSub:"Ваше объявление опубликовано на PetAlong!",
    seeAll:"Смотреть объявления →", backHome:"← На главную",
    feedTitle:"Объявления", feedSub:(n:number)=>`${n} активных объявлений`,
    filterCountry:"Фильтр по стране", filterType:"Фильтр по типу", filterAll:"Все",
    needTransport:"🐾 Нужна перевозка", drivers:"🚐 Водители",
    needsT:"Нужна перевозка", driver:"Водитель",
    addPost:"+ Разместить", viewMap:"🗺 Маршрут", chatBtn:"💬 Чат",
    callBtn:"📞 Звонок", smsBtn:"💬 SMS", reportBtn:"🚩 Жалоба",
    openForCalls:"📞 Открыт для звонков", openForSMS:"💬 Открыт для SMS",
    verified:"✓ проверен", fbConnected:"Facebook подключён",
    phoneVerified:"Телефон проверен", memberSince:"На платформе с",
    chatTitle:"Чат", chatPh:"Написать сообщение...", send:"Отправить",
    matchAlert:"🔔 Совпадение! Водитель едет по вашему маршруту →",
    matchAlertD:"🔔 Совпадение! Есть питомец на вашем маршруте →",
    loginTitle:"Войти в PetAlong", loginSub:"Войдите чтобы размещать объявления или писать другим",
    fbBtn:"Войти через Facebook",
    phoneTitle:"Подтвердите телефон",
    phoneSub:"Отправим 6-значный код для подтверждения номера",
    sendCode:"Отправить код →", verify:"Подтвердить →",
    codeSent:"Код отправлен! Проверьте SMS.",
    codePh:"Введите 6-значный код",
    loginNote:"Мы используем только ваше имя и фото с Facebook. Мы никогда не публикуем от вашего имени.",
    reportTitle:"Пожаловаться на объявление",
    reportReasons:["Спам или фейк","Подозрительное поведение","Неверная категория","Попытка мошенничества","Угроза животному","Другое"],
    reportSubmit:"Отправить жалобу", reportCancel:"Отмена",
    reportThanks:"Спасибо за жалобу. Мы рассмотрим её в ближайшее время.",
    profileTitle:"Профиль",
    myListings:"Мои объявления", noListings:"У вас ещё нет объявлений.",
    ratings:"Оценки и отзывы", noRatings:"Пока нет отзывов.",
    aboutTitle:"О PetAlong",
    aboutSub:"Платформа попутной перевозки питомцев",
    aboutText:"PetAlong — это бесплатная платформа сообщества, которая соединяет хозяев питомцев с водителями, которые едут по нужному маршруту. Мы верим в силу сообщества — соседи помогают соседям, путешественники помогают путешественникам. PetAlong — это BlaBlaCar для питомцев.",
    aboutMission:"Наша миссия проста: сделать перевозку питомцев доступной, недорогой и безопасной для всех, соединяя людей которые и так делают этот путь.",
    termsTitle:"Условия использования",
    privacyTitle:"Политика конфиденциальности",
    footer:{
      tagline:"Соединяем хозяев питомцев с водителями по пути.",
      platform:"Платформа",
      legal:"Правовая информация",
      links:{about:"О нас",how:"Как это работает",browse:"Объявления",post:"Разместить",terms:"Условия использования",privacy:"Конфиденциальность",contact:"Контакт"},
      disclaimer:"PetAlong — нейтральная технологическая платформа. Мы не оказываем транспортные услуги. Все договорённости заключаются напрямую между пользователями. PetAlong не несёт ответственности за договорённости, транзакции, споры или результаты между пользователями.",
      copyright:"© 2025 PetAlong. Бесплатная платформа сообщества.",
    },
    terms:`УСЛОВИЯ ИСПОЛЬЗОВАНИЯ — PetAlong\n\nСм. английскую версию / See English version`,
    privacy:`ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ — PetAlong\n\nСм. английскую версию / See English version`,
  }
};

// ─── MOCK DATA ─────────────────────────────────────────────────────────────────
const MOCK = [
  {id:1,type:"owner",from:"Lincoln, NE",to:"Dallas, TX",country:"USA",animal:"Buddy",petType:"Dog",weight:45,dateFrom:"Jun 1",dateTo:"Jun 3",avatar:"🐕",openChat:true,openCalls:true,openSMS:false,user:"Sarah M.",fbConnected:true,phoneVerified:true,memberSince:"2024",rating:4.9,reviews:12,notes:"Friendly golden retriever, loves car rides!"},
  {id:2,type:"owner",from:"Phoenix, AZ",to:"Houston, TX",country:"USA",animal:"Raven",petType:"Cat",weight:10,dateFrom:"Jun 5",dateTo:"Jun 6",avatar:"🐈",openChat:true,openCalls:false,openSMS:true,user:"Tom K.",fbConnected:true,phoneVerified:false,memberSince:"2024",rating:4.7,reviews:5,notes:"Indoor cat, needs quiet environment"},
  {id:3,type:"driver",from:"Chicago, IL",to:"Miami, FL",country:"USA",animal:null,petType:null,weight:80,dateFrom:"Jun 4",dateTo:"Jun 5",avatar:"🚐",radiusFrom:75,radiusTo:50,openChat:true,openCalls:true,openSMS:true,user:"Mike D.",fbConnected:true,phoneVerified:true,memberSince:"2023",rating:5.0,reviews:23,notes:"Experienced with pets, SUV, AC always on"},
  {id:4,type:"owner",from:"Atlanta, GA",to:"Stafford, VA",country:"USA",animal:"Max",petType:"Dog",weight:35,dateFrom:"Jun 10",dateTo:"Jun 12",avatar:"🐕",openChat:true,openCalls:false,openSMS:false,user:"Lisa R.",fbConnected:true,phoneVerified:true,memberSince:"2025",rating:4.8,reviews:3,notes:""},
  {id:5,type:"driver",from:"Denver, CO",to:"Los Angeles, CA",country:"USA",animal:null,petType:null,weight:60,dateFrom:"Jun 8",dateTo:"Jun 9",avatar:"🚐",radiusFrom:100,radiusTo:120,openChat:true,openCalls:true,openSMS:false,user:"Alex P.",fbConnected:true,phoneVerified:true,memberSince:"2024",rating:4.6,reviews:8,notes:"Comfortable minivan, happy to take small/medium pets"},
  {id:6,type:"owner",from:"Berlin",to:"Munich",country:"Germany",animal:"Luna",petType:"Cat",weight:8,dateFrom:"Jun 15",dateTo:"Jun 15",avatar:"🐈",openChat:true,openCalls:false,openSMS:true,user:"Anna S.",fbConnected:true,phoneVerified:true,memberSince:"2024",rating:5.0,reviews:2,notes:""},
];

const MOCK_MSGS = [
  {id:1,from:"them",text:"Hi! I saw your listing. I'm driving from Chicago to Miami on June 4. I can take Buddy along!",time:"10:32 AM"},
  {id:2,from:"me",text:"That's perfect! What's your rate?",time:"10:35 AM"},
  {id:3,from:"them",text:"I'd do $150 for the trip. Buddy would ride in the cabin with me the whole time 🐕",time:"10:37 AM"},
  {id:4,from:"me",text:"Sounds great. Are you verified on the platform?",time:"10:38 AM"},
  {id:5,from:"them",text:"Yes! Facebook connected and phone verified. 5-star rating with 23 reviews. Feel free to check my profile.",time:"10:39 AM"},
];

type Listing = typeof MOCK[0];

const openMaps = (a: string, b: string) => window.open(`https://www.google.com/maps/dir/${encodeURIComponent(a)}/${encodeURIComponent(b)}`,"_blank");

// ─── STAR RATING ──────────────────────────────────────────────────────────────
const Stars = ({rating}:{rating:number}) => (
  <span style={{color:C.yellow,fontSize:13}}>
    {"★".repeat(Math.floor(rating))}{"☆".repeat(5-Math.floor(rating))} {rating.toFixed(1)}
  </span>
);

// ─── TRUST BADGES ─────────────────────────────────────────────────────────────
const TrustBadges = ({l,t}:{l:Listing,t:typeof T.en}) => (
  <div style={{display:"flex",gap:6,flexWrap:"wrap" as const,marginTop:4}}>
    {l.fbConnected && <span style={{fontSize:10,background:"rgba(88,166,255,.15)",color:C.blue,padding:"2px 8px",borderRadius:100,fontWeight:600}}>f {t.fbConnected}</span>}
    {l.phoneVerified && <span style={{fontSize:10,background:"rgba(63,185,80,.15)",color:C.green,padding:"2px 8px",borderRadius:100,fontWeight:600}}>📱 {t.phoneVerified}</span>}
    <span style={{fontSize:10,background:"rgba(139,148,158,.1)",color:C.muted,padding:"2px 8px",borderRadius:100}}>{t.memberSince} {l.memberSince}</span>
  </div>
);

export default function App() {
  const [lang,setLang] = useState<"en"|"ru">("en");
  const [view,setView] = useState("home");
  const [filter,setFilter] = useState("all");
  const [filterCountry,setFilterCountry] = useState("all");
  const [filterPet,setFilterPet] = useState("all");
  const [loggedIn,setLoggedIn] = useState(false);
  const [showLogin,setShowLogin] = useState(false);
  const [loginStep,setLoginStep] = useState<"main"|"phone"|"code">("main");
  const [loginPhone,setLoginPhone] = useState("");
  const [loginCode,setLoginCode] = useState("");
  const [loginErr,setLoginErr] = useState("");
  const [loginLoading,setLoginLoading] = useState(false);
  const [userName,setUserName] = useState("");
  const [userPhoto,setUserPhoto] = useState("");

  // ─── FACEBOOK LOGIN (JS SDK) ───────────────────────────────────────────────
  const handleFacebookLogin = () => {
    setLoginErr("");
    const FB = (window as any).FB;
    if(!FB){ setLoginErr(lang==="ru"?"Facebook не загрузился, обновите страницу":"Facebook not loaded, please refresh"); return; }
    FB.login((response:any)=>{
      if(response.authResponse){
        FB.api('/me',{fields:'name,picture'},(user:any)=>{
          if(user && user.name) setUserName(user.name);
          if(user && user.picture && user.picture.data) setUserPhoto(user.picture.data.url);
          setLoggedIn(true); setShowLogin(false); setLoginStep("main");
        });
      } else {
        setLoginErr(lang==="ru"?"Вход через Facebook отменён":"Facebook login cancelled");
      }
    },{scope:'public_profile'});
  };

  // ─── SMS: SEND CODE (Twilio Verify) ────────────────────────────────────────
  const handleSendCode = async () => {
    setLoginErr("");
    let phone = loginPhone.replace(/[^\d+]/g,'');
    if(!phone.startsWith('+')) phone = '+'+phone;
    if(phone.length < 11){ setLoginErr(lang==="ru"?"Введите номер с кодом страны, напр. +15312201620":"Enter number with country code, e.g. +15312201620"); return; }
    setLoginLoading(true);
    try {
      const r = await fetch("/api/send-code",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({phone})
      });
      const data = await r.json();
      if(r.ok){ setLoginPhone(phone); setLoginStep("code"); }
      else { setLoginErr(data.error || (lang==="ru"?"Ошибка отправки кода":"Failed to send code")); }
    } catch(e){ setLoginErr(lang==="ru"?"Ошибка сети":"Network error"); }
    setLoginLoading(false);
  };

  // ─── SMS: VERIFY CODE (Twilio Verify) ──────────────────────────────────────
  const handleVerifyCode = async () => {
    setLoginErr("");
    setLoginLoading(true);
    try {
      const r = await fetch("/api/verify-code",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({phone:loginPhone,code:loginCode})
      });
      const data = await r.json();
      if(r.ok && data.success){ setLoggedIn(true); setShowLogin(false); setLoginStep("main"); }
      else { setLoginErr(data.error || (lang==="ru"?"Неверный код":"Invalid code")); }
    } catch(e){ setLoginErr(lang==="ru"?"Ошибка сети":"Network error"); }
    setLoginLoading(false);
  };

  const [chatWith,setChatWith] = useState<Listing|null>(null);
  const [messages,setMessages] = useState(MOCK_MSGS);
  const [newMsg,setNewMsg] = useState("");
  const [petPhoto,setPetPhoto] = useState<string|null>(null);
  const [showReport,setShowReport] = useState<Listing|null>(null);
  const [reportReason,setReportReason] = useState("");
  const [reportDone,setReportDone] = useState(false);
  const [showMatch,setShowMatch] = useState(true);
  const [profileUser,setProfileUser] = useState<Listing|null>(null);
  const [countrySearch,setCountrySearch] = useState("");
  const [showCountries,setShowCountries] = useState(false);
  const [selectedCountry,setSelectedCountry] = useState("USA");
  const [oF,setOF] = useState({from:"",to:"",name:"",weight:"",petType:"Dog",d1:"",d2:"",ph:"",openChat:true,openCalls:false,openSMS:false,notes:""});
  const [dF,setDF] = useState({from:"",to:"",date:"",cap:"",ph:"",rA:50,rB:50,openChat:true,openCalls:false,openSMS:false,notes:""});
  const photoRef = useRef<HTMLInputElement>(null);
  const t = T[lang];

  const filtered = MOCK.filter(l => {
    if(filter==="owner" && l.type!=="owner") return false;
    if(filter==="driver" && l.type!=="driver") return false;
    if(filterCountry!=="all" && l.country!==filterCountry) return false;
    if(filterPet!=="all" && l.petType!==filterPet) return false;
    return true;
  });

  const filteredCountries = COUNTRIES.filter(c=>c.toLowerCase().includes(countrySearch.toLowerCase()));

  const nav = (v:string) => { setView(v); window.scrollTo(0,0); };

  // SHARED COMPONENTS
  const NavBar = ({showPost=false}) => (
    <nav style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 24px",borderBottom:`1px solid ${C.border2}`,position:"sticky",top:0,background:"rgba(13,17,23,0.96)",backdropFilter:"blur(14px)",zIndex:200}}>
      <div onClick={()=>nav("home")} style={{fontFamily:"sans-serif",fontWeight:900,fontSize:20,cursor:"pointer",letterSpacing:-0.5,color:C.white}}>
        Pet<span style={{color:C.orange}}>Along</span>
      </div>
      <div style={{display:"flex",gap:8,alignItems:"center"}}>
        {showPost && <button onClick={()=>nav("owner")} style={{background:C.orange,border:"none",borderRadius:100,padding:"7px 16px",color:C.bg,fontWeight:700,fontSize:12,cursor:"pointer"}}>{t.addPost}</button>}
        {loggedIn
          ? <div style={{display:"flex",gap:8,alignItems:"center"}}>
              <div onClick={()=>nav("profile-me")} style={{width:32,height:32,borderRadius:"50%",background:userPhoto?`url(${userPhoto}) center/cover`:`linear-gradient(135deg,${C.orange},${C.red})`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:14,fontWeight:700,color:C.bg}}>{userPhoto?"":(userName?userName[0]:"V")}</div>
            </div>
          : <button onClick={()=>setShowLogin(true)} style={{background:"transparent",border:`1px solid ${C.border}`,borderRadius:100,padding:"6px 14px",color:C.muted,fontSize:12,cursor:"pointer",fontWeight:500}}>{t.signIn}</button>
        }
        <button onClick={()=>setLang("en")} style={{background:lang==="en"?C.card:"transparent",border:`1px solid ${lang==="en"?C.orange:C.border}`,color:lang==="en"?C.orange:C.muted,padding:"5px 10px",borderRadius:100,fontSize:11,cursor:"pointer",fontWeight:600}}>EN</button>
        <button onClick={()=>setLang("ru")} style={{background:lang==="ru"?C.card:"transparent",border:`1px solid ${lang==="ru"?C.orange:C.border}`,color:lang==="ru"?C.orange:C.muted,padding:"5px 10px",borderRadius:100,fontSize:11,cursor:"pointer",fontWeight:600}}>RU</button>
      </div>
    </nav>
  );

  const Footer = () => (
    <footer style={{borderTop:`1px solid ${C.border2}`,background:C.card,padding:"40px 24px 24px",marginTop:40}}>
      <div style={{maxWidth:900,margin:"0 auto"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:32,marginBottom:32}}>
          <div>
            <div style={{fontWeight:900,fontSize:18,color:C.white,marginBottom:8}}>Pet<span style={{color:C.orange}}>Along</span></div>
            <div style={{fontSize:13,color:C.muted,lineHeight:1.7}}>{t.footer.tagline}</div>
          </div>
          <div>
            <div style={{fontSize:11,letterSpacing:"1.5px",textTransform:"uppercase" as const,color:C.muted2,marginBottom:12,fontWeight:600}}>{t.footer.platform}</div>
            {[["about","About"],["how","How it works"],["feed","Browse listings"],["owner","Post a listing"]].map(([v,l])=>(
              <div key={v} onClick={()=>nav(v)} style={{fontSize:14,color:C.muted,marginBottom:8,cursor:"pointer"}}>{lang==="en"?l:Object.values(t.footer.links)[["about","how","browse","post"].indexOf(v)]||l}</div>
            ))}
          </div>
          <div>
            <div style={{fontSize:11,letterSpacing:"1.5px",textTransform:"uppercase" as const,color:C.muted2,marginBottom:12,fontWeight:600}}>{t.footer.legal}</div>
            {[["terms",t.footer.links.terms],["privacy",t.footer.links.privacy]].map(([v,l])=>(
              <div key={v} onClick={()=>nav(v)} style={{fontSize:14,color:C.muted,marginBottom:8,cursor:"pointer"}}>{l}</div>
            ))}
            <div style={{fontSize:14,color:C.muted,marginBottom:8}}>contact@petalonggo.com</div>
          </div>
        </div>
        <div style={{borderTop:`1px solid ${C.border2}`,paddingTop:20}}>
          <div style={{fontSize:11,color:C.muted2,lineHeight:1.7,marginBottom:12}}>{t.footer.disclaimer}</div>
          <div style={{fontSize:11,color:C.muted2}}>{t.footer.copyright}</div>
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
    <div onClick={onChange} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 14px",background:C.card,border:`1px solid ${checked?C.green:C.border}`,borderRadius:10,marginBottom:10,cursor:"pointer",transition:"border-color .2s"}}>
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
      <div style={{fontSize:10,letterSpacing:"1.5px",textTransform:"uppercase" as const,color:C.muted,marginBottom:7,fontWeight:600}}>🌍 {t.country}</div>
      <div onClick={()=>setShowCountries(!showCountries)} style={{...INP,display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer"}}>
        <span style={{color:"#1a1a1a",fontWeight:500}}>{selectedCountry}</span>
        <span style={{color:"#888",fontSize:12}}>▾</span>
      </div>
      {showCountries && (
        <div style={{position:"absolute",top:"100%",left:0,right:0,background:C.white,border:`2px solid ${C.orange}`,borderRadius:10,zIndex:50,maxHeight:220,overflowY:"auto" as const,boxShadow:"0 8px 30px rgba(0,0,0,.3)"}}>
          <input autoFocus placeholder={t.searchCountry} value={countrySearch} onChange={e=>setCountrySearch(e.target.value)} style={{...INP,borderRadius:"8px 8px 0 0",borderBottom:`1px solid #eee`}}/>
          {filteredCountries.map(c=>(
            <div key={c} onClick={()=>{setSelectedCountry(c);setShowCountries(false);setCountrySearch("");}} style={{padding:"10px 14px",cursor:"pointer",color:"#1a1a1a",fontSize:14,fontWeight:c===selectedCountry?700:400,background:c===selectedCountry?"#fff8ee":"#fff",borderBottom:"1px solid #f0f0f0"}}>
              {c===selectedCountry?"✓ ":""}{c}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const SubmitBtn = ({label,onClick}:{label:string,onClick:()=>void}) => (
    <button onClick={onClick} style={{width:"100%",background:C.orange,border:"none",borderRadius:14,padding:17,color:C.bg,fontWeight:700,fontSize:16,cursor:"pointer",marginTop:8,letterSpacing:.3}}>
      {label}
    </button>
  );

  const BackBtn = ({to}:{to:string}) => (
    <button onClick={()=>nav(to)} style={{background:"none",border:"none",color:C.muted,fontSize:14,cursor:"pointer",marginBottom:24,padding:0,fontWeight:500,display:"flex",alignItems:"center",gap:6}}>
      {t.back}
    </button>
  );

  // LOGIN MODAL
  const LoginModal = () => (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.8)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={()=>{setShowLogin(false);setLoginStep("main");setLoginErr("");}}>
      <div onClick={e=>e.stopPropagation()} style={{background:C.card2,border:`1px solid ${C.border}`,borderRadius:20,padding:32,width:"100%",maxWidth:380}}>
        {loginStep==="main" && <>
          <div style={{fontWeight:800,fontSize:22,marginBottom:6,color:C.white}}>{t.loginTitle}</div>
          <div style={{fontSize:14,color:C.muted,marginBottom:24}}>{t.loginSub}</div>
          <button onClick={handleFacebookLogin} style={{width:"100%",background:"#1877f2",border:"none",borderRadius:12,padding:"15px 20px",color:C.white,fontSize:15,fontWeight:700,cursor:"pointer",marginBottom:16,display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
            <span style={{fontSize:20,fontWeight:900}}>f</span> {t.fbBtn}
          </button>
          <div style={{fontSize:11,color:C.muted2,textAlign:"center" as const,lineHeight:1.6,marginBottom:20}}>{t.loginNote}</div>
          <Divider label={t.phoneTitle}/>
          <Field label={t.phone} ph={t.phonePh} val={loginPhone} onChange={e=>setLoginPhone(e.target.value)} type="tel"/>
          {loginErr && <div style={{fontSize:12,color:C.red,marginBottom:10,marginTop:-6}}>{loginErr}</div>}
          <SubmitBtn label={loginLoading?"...":t.sendCode} onClick={handleSendCode}/>
        </>}
        {loginStep==="code" && <>
          <div style={{fontWeight:800,fontSize:20,marginBottom:6,color:C.white}}>{t.phoneTitle}</div>
          <div style={{fontSize:13,color:C.green,marginBottom:16,padding:"10px 14px",background:"rgba(63,185,80,.1)",borderRadius:10,border:`1px solid rgba(63,185,80,.3)`}}>✓ {t.codeSent}</div>
          <Field label="" ph={t.codePh} val={loginCode} onChange={e=>setLoginCode(e.target.value)} type="number"/>
          {loginErr && <div style={{fontSize:12,color:C.red,marginBottom:10}}>{loginErr}</div>}
          <SubmitBtn label={loginLoading?"...":t.verify} onClick={handleVerifyCode}/>
          <button onClick={()=>{setLoginStep("main");setLoginErr("");}} style={{background:"none",border:"none",color:C.muted,fontSize:13,cursor:"pointer",marginTop:12,width:"100%",textAlign:"center" as const}}>{t.back}</button>
        </>}
      </div>
    </div>
  );

  // REPORT MODAL
  const ReportModal = () => (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.8)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:20}} onClick={()=>{setShowReport(null);setReportDone(false);}}>
      <div onClick={e=>e.stopPropagation()} style={{background:C.card2,border:`1px solid ${C.border}`,borderRadius:20,padding:28,width:"100%",maxWidth:360}}>
        {reportDone ? <>
          <div style={{textAlign:"center" as const,padding:"20px 0"}}>
            <div style={{fontSize:40,marginBottom:12}}>✅</div>
            <div style={{color:C.white,fontWeight:700,fontSize:16,marginBottom:8}}>{t.reportThanks}</div>
            <button onClick={()=>{setShowReport(null);setReportDone(false);}} style={{background:C.orange,border:"none",borderRadius:10,padding:"10px 24px",color:C.bg,fontWeight:700,cursor:"pointer",marginTop:12}}>OK</button>
          </div>
        </> : <>
          <div style={{fontWeight:800,fontSize:18,marginBottom:16,color:C.white}}>{t.reportTitle}</div>
          {t.reportReasons.map((r,i)=>(
            <div key={i} onClick={()=>setReportReason(r)} style={{padding:"10px 14px",borderRadius:10,border:`1px solid ${reportReason===r?C.red:C.border}`,marginBottom:8,cursor:"pointer",fontSize:14,color:reportReason===r?C.red:C.muted,background:reportReason===r?"rgba(248,81,73,.08)":"transparent"}}>
              {r}
            </div>
          ))}
          <div style={{display:"flex",gap:10,marginTop:16}}>
            <button onClick={()=>{setShowReport(null);}} style={{flex:1,background:"transparent",border:`1px solid ${C.border}`,borderRadius:10,padding:12,color:C.muted,cursor:"pointer",fontWeight:500}}>{t.reportCancel}</button>
            <button onClick={()=>setReportDone(true)} disabled={!reportReason} style={{flex:2,background:reportReason?C.red:"#333",border:"none",borderRadius:10,padding:12,color:C.white,cursor:reportReason?"pointer":"default",fontWeight:700}}>{t.reportSubmit}</button>
          </div>
        </>}
      </div>
    </div>
  );

  // LISTING CARD
  const ListingCard = ({l}:{l:Listing}) => (
    <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:18,padding:"18px 20px",marginBottom:12}}>
      <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
        <div style={{fontSize:26,marginTop:2,flexShrink:0}}>{l.avatar}</div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8,flexWrap:"wrap" as const}}>
            <span style={{fontWeight:800,fontSize:17,color:C.white}}>{l.from.split(",")[0]}</span>
            <span style={{color:C.muted2,fontSize:14}}>→</span>
            <span style={{fontWeight:800,fontSize:17,color:C.white}}>{l.to.split(",")[0]}</span>
            <span style={{fontSize:11,background:"rgba(139,148,158,.12)",color:C.muted,padding:"2px 8px",borderRadius:100}}>🌍 {l.country}</span>
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap" as const,alignItems:"center",marginBottom:8}}>
            <span style={{fontSize:10,letterSpacing:"1.5px",textTransform:"uppercase" as const,padding:"3px 9px",borderRadius:100,fontWeight:600,background:l.type==="owner"?"rgba(240,160,48,.18)":"rgba(63,185,80,.18)",color:l.type==="owner"?C.orange:C.green}}>{l.type==="owner"?t.needsT:t.driver}</span>
            <span style={{fontSize:12,color:C.muted}}>{l.dateFrom}{l.dateTo?` – ${l.dateTo}`:""}</span>
            <span style={{fontSize:12,color:C.muted}}>{l.type==="owner"?`${l.animal} (${l.petType}), ${l.weight} lbs`:`≤ ${l.weight} lbs`}</span>
          </div>
          {l.type==="driver" && (l as any).radiusFrom!=null && (
            <div style={{fontSize:12,color:C.green,marginBottom:8,fontWeight:500}}>📍 ±{(l as any).radiusFrom} mi pickup · 🏁 ±{(l as any).radiusTo} mi delivery</div>
          )}
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8,cursor:"pointer"}} onClick={()=>{setProfileUser(l);nav("profile-user");}}>
            <div style={{width:22,height:22,borderRadius:"50%",background:`linear-gradient(135deg,${C.blue},${C.purple})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:C.white,flexShrink:0}}>{l.user[0]}</div>
            <span style={{fontSize:13,color:C.muted,fontWeight:500}}>{l.user}</span>
            <Stars rating={l.rating}/>
            <span style={{fontSize:11,color:C.muted2}}>({l.reviews})</span>
          </div>
          <TrustBadges l={l} t={t}/>
          {l.notes && <div style={{fontSize:12,color:C.muted,marginTop:8,fontStyle:"italic" as const}}>"{l.notes}"</div>}
          <div style={{display:"flex",gap:6,flexWrap:"wrap" as const,marginTop:12}}>
            <button onClick={()=>openMaps(l.from,l.to)} style={{background:"transparent",border:`1px solid #238636`,color:C.green,padding:"7px 12px",borderRadius:10,fontSize:12,cursor:"pointer",fontWeight:600}}>{t.viewMap}</button>
            {l.openChat && <button onClick={()=>{if(!loggedIn){setShowLogin(true);return;}setChatWith(l);nav("chat");}} style={{background:C.orange,border:"none",color:C.bg,padding:"7px 12px",borderRadius:10,fontSize:12,cursor:"pointer",fontWeight:700}}>{t.chatBtn}</button>}
            {l.openCalls && <button onClick={()=>{if(!loggedIn){setShowLogin(true);return;}window.open("tel:+15550001234");}} style={{background:"transparent",border:`1px solid ${C.green}`,color:C.green,padding:"7px 12px",borderRadius:10,fontSize:12,cursor:"pointer",fontWeight:600}}>{t.callBtn}</button>}
            {l.openSMS && <button onClick={()=>{if(!loggedIn){setShowLogin(true);return;}window.open("sms:+15550001234");}} style={{background:"transparent",border:`1px solid ${C.blue}`,color:C.blue,padding:"7px 12px",borderRadius:10,fontSize:12,cursor:"pointer",fontWeight:600}}>{t.smsBtn}</button>}
            <button onClick={()=>{setShowReport(l);setReportReason("");}} style={{background:"transparent",border:`1px solid ${C.border}`,color:C.muted2,padding:"7px 12px",borderRadius:10,fontSize:12,cursor:"pointer"}}>{t.reportBtn}</button>
          </div>
        </div>
      </div>
    </div>
  );

  // ─── VIEWS ──────────────────────────────────────────────────────────────────

  // HOME
  if(view==="home") return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.white,fontFamily:"'DM Sans',system-ui,sans-serif"}}>
      {showLogin && <LoginModal/>}
      {showReport && <ReportModal/>}
      <NavBar/>
      {/* HERO */}
      <div style={{minHeight:"92vh",display:"flex",flexDirection:"column" as const,alignItems:"center",justifyContent:"center",padding:"60px 20px 40px",textAlign:"center" as const,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",width:600,height:600,background:`radial-gradient(circle,rgba(240,160,48,.12) 0%,transparent 70%)`,top:-100,left:-80,pointerEvents:"none"}}/>
        <div style={{position:"absolute",width:400,height:400,background:`radial-gradient(circle,rgba(63,185,80,.07) 0%,transparent 70%)`,bottom:-60,right:-60,pointerEvents:"none"}}/>
        <div style={{fontSize:11,letterSpacing:"3px",textTransform:"uppercase" as const,color:C.green,marginBottom:16,fontWeight:600,background:"rgba(63,185,80,.1)",padding:"6px 16px",borderRadius:100,border:`1px solid rgba(63,185,80,.2)`}}>🐾 Free Community Platform</div>
        <div style={{fontWeight:900,fontSize:"clamp(38px,9vw,72px)",letterSpacing:-2,lineHeight:1,marginBottom:16,color:C.white}}>
          Pet<span style={{color:C.orange}}>Along</span>
        </div>
        <div style={{fontSize:"clamp(15px,3vw,20px)",color:C.muted,maxWidth:500,lineHeight:1.6,marginBottom:48,fontWeight:400}}>{t.tagline}</div>
        {/* Stats */}
        <div style={{display:"flex",gap:32,marginBottom:52,flexWrap:"wrap" as const,justifyContent:"center"}}>
          {t.stats.map((s,i)=>(
            <div key={i} style={{textAlign:"center" as const}}>
              <div style={{fontWeight:900,fontSize:22,color:C.orange}}>{s.n}</div>
              <div style={{fontSize:11,color:C.muted,letterSpacing:"1px",textTransform:"uppercase" as const}}>{s.l}</div>
            </div>
          ))}
        </div>
        {/* Role cards */}
        <div style={{display:"flex",gap:16,marginBottom:40,flexWrap:"wrap" as const,justifyContent:"center"}}>
          {[[t.iNeed,"🐾",t.iNeedDesc,"owner"],[t.iDrive,"🚐",t.iDriveDesc,"driver"]].map(([title,icon,desc,v])=>(
            <div key={v} onClick={()=>nav(v as string)} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:20,padding:"28px 28px",width:220,cursor:"pointer",textAlign:"center" as const,transition:"all .2s"}}
              onMouseOver={e=>{(e.currentTarget as HTMLElement).style.borderColor=C.orange;(e.currentTarget as HTMLElement).style.transform="translateY(-4px)";}}
              onMouseOut={e=>{(e.currentTarget as HTMLElement).style.borderColor=C.border;(e.currentTarget as HTMLElement).style.transform="none";}}>
              <div style={{fontSize:36,marginBottom:12}}>{icon}</div>
              <div style={{fontWeight:700,fontSize:16,marginBottom:8,color:C.white}}>{title}</div>
              <div style={{fontSize:13,color:C.muted,lineHeight:1.6}}>{desc}</div>
            </div>
          ))}
        </div>
        <button onClick={()=>nav("feed")} style={{background:"transparent",border:`1px solid ${C.border}`,color:C.muted,padding:"11px 26px",borderRadius:100,fontSize:14,cursor:"pointer"}}>{t.browse}</button>
      </div>
      {/* HOW IT WORKS */}
      <div style={{borderTop:`1px solid ${C.border2}`,padding:"60px 20px",background:C.card}}>
        <div style={{maxWidth:860,margin:"0 auto"}}>
          <div style={{fontWeight:900,fontSize:"clamp(22px,5vw,32px)",letterSpacing:-1,marginBottom:36,textAlign:"center" as const,color:C.white}}>{t.howTitle}</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:16}}>
            {t.how.map((h,i)=>(
              <div key={i} style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:16,padding:22}}>
                <div style={{fontSize:28,marginBottom:12}}>{h.icon}</div>
                <div style={{fontWeight:700,fontSize:15,marginBottom:8,color:C.white}}>{h.t}</div>
                <div style={{fontSize:13,color:"#c9d1d9",lineHeight:1.65}}>{h.d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* WHY PETALONG */}
      <div style={{padding:"60px 20px"}}>
        <div style={{maxWidth:860,margin:"0 auto"}}>
          <div style={{fontWeight:900,fontSize:"clamp(22px,5vw,32px)",letterSpacing:-1,marginBottom:36,textAlign:"center" as const,color:C.white}}>{t.whyTitle}</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:16}}>
            {t.why.map((w,i)=>(
              <div key={i} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:22}}>
                <div style={{fontSize:28,marginBottom:12}}>{w.icon}</div>
                <div style={{fontWeight:700,fontSize:15,marginBottom:8,color:C.white}}>{w.t}</div>
                <div style={{fontSize:13,color:"#c9d1d9",lineHeight:1.65}}>{w.d}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* MATCH NOTIFICATION DEMO */}
      {showMatch && (
        <div style={{background:"rgba(63,185,80,.1)",border:`1px solid rgba(63,185,80,.3)`,padding:"14px 24px",textAlign:"center" as const,fontSize:14,color:C.green,position:"relative",cursor:"pointer"}} onClick={()=>nav("feed")}>
          {t.matchAlert}
          <button onClick={(e)=>{e.stopPropagation();setShowMatch(false);}} style={{position:"absolute",right:16,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:C.green,fontSize:18,cursor:"pointer"}}>×</button>
        </div>
      )}
      <Footer/>
    </div>
  );

  // FEED
  if(view==="feed") return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.white,fontFamily:"'DM Sans',system-ui,sans-serif"}}>
      {showLogin && <LoginModal/>}
      {showReport && <ReportModal/>}
      <NavBar showPost/>
      <div style={{maxWidth:680,margin:"0 auto",padding:"28px 20px 80px"}}>
        <BackBtn to="home"/>
        <div style={{fontWeight:900,fontSize:28,letterSpacing:-1,marginBottom:4,color:C.white}}>{t.feedTitle}</div>
        <div style={{color:C.muted,fontSize:13,marginBottom:20}}>{t.feedSub(filtered.length)}</div>
        {/* Filters */}
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:"16px 16px 12px",marginBottom:20}}>
          <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap" as const}}>
            {[["all",t.filterAll],["owner",t.needTransport],["driver",t.drivers]].map(([f,label])=>(
              <button key={f} onClick={()=>setFilter(f)} style={{padding:"7px 14px",borderRadius:100,fontSize:12,border:`1px solid ${filter===f?C.orange:C.border}`,background:filter===f?C.orange:"transparent",color:filter===f?C.bg:C.muted,cursor:"pointer",fontWeight:filter===f?600:400}}>{label}</button>
            ))}
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap" as const}}>
            <select value={filterCountry} onChange={e=>setFilterCountry(e.target.value)} style={{...INP,flex:1,minWidth:120,padding:"8px 12px",fontSize:13}}>
              <option value="all">🌍 {t.filterAll}</option>
              {["USA","Canada","UK","Germany","Ukraine","Russia"].map(c=><option key={c} value={c}>{c}</option>)}
            </select>
            <select value={filterPet} onChange={e=>setFilterPet(e.target.value)} style={{...INP,flex:1,minWidth:100,padding:"8px 12px",fontSize:13}}>
              <option value="all">🐾 {t.filterAll}</option>
              {PET_TYPES.map(p=><option key={p.en} value={p.en}>{p.icon} {lang==="en"?p.en:p.ru}</option>)}
            </select>
          </div>
        </div>
        {filtered.map(l=><ListingCard key={l.id} l={l}/>)}
        {filtered.length===0 && <div style={{textAlign:"center" as const,padding:"60px 20px",color:C.muted}}>No listings found. Try adjusting filters.</div>}
      </div>
      <Footer/>
    </div>
  );

  // OWNER FORM
  if(view==="owner") return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.white,fontFamily:"'DM Sans',system-ui,sans-serif"}}>
      {showLogin && <LoginModal/>}
      <NavBar/>
      <div style={{maxWidth:540,margin:"0 auto",padding:"28px 20px 80px"}}>
        <BackBtn to="home"/>
        <div style={{fontWeight:900,fontSize:"clamp(24px,6vw,32px)",letterSpacing:-1.5,marginBottom:6,lineHeight:1.1,color:C.white}}>{t.ownerTitle[0]}<br/>{t.ownerTitle[1]}</div>
        <div style={{fontSize:14,color:C.muted,marginBottom:24,lineHeight:1.6}}>{t.ownerSub}</div>
        {/* Pet Photo */}
        <div style={{marginBottom:20}}>
          <div style={{fontSize:10,letterSpacing:"1.5px",textTransform:"uppercase" as const,color:C.muted,marginBottom:7,fontWeight:600}}>{t.petPhoto}</div>
          <div onClick={()=>photoRef.current?.click()} style={{border:`2px dashed ${petPhoto?C.green:C.border}`,borderRadius:12,padding:24,textAlign:"center" as const,cursor:"pointer",background:C.card,transition:"border-color .2s"}}>
            {petPhoto ? <img src={petPhoto} alt="pet" style={{width:"100%",maxHeight:200,objectFit:"cover" as const,borderRadius:8}}/> : <div><div style={{fontSize:32,marginBottom:8}}>🐾</div><div style={{fontSize:14,color:C.muted}}>{t.addPhoto}</div></div>}
          </div>
          <input ref={photoRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>{const f=e.target.files?.[0];if(f){const r=new FileReader();r.onload=ev=>setPetPhoto(ev.target?.result as string);r.readAsDataURL(f);}}}/>
        </div>
        <CountryPicker/>
        <Field label={t.pointA} ph="City or ZIP code" val={oF.from} onChange={e=>setOF({...oF,from:e.target.value})}/>
        <Field label={t.pointB} ph="City or ZIP code" val={oF.to} onChange={e=>setOF({...oF,to:e.target.value})}/>
        {oF.from&&oF.to&&<button onClick={()=>openMaps(oF.from,oF.to)} style={{width:"100%",background:"transparent",border:`1px solid #238636`,color:C.green,borderRadius:10,padding:"10px",fontSize:13,cursor:"pointer",fontWeight:600,marginBottom:16}}>🗺 {t.viewMap}: {oF.from} → {oF.to}</button>}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:0}}>
          <Field label={t.petName} ph="Buddy" val={oF.name} onChange={e=>setOF({...oF,name:e.target.value})}/>
          <Field label={t.weight} ph="45" type="number" val={oF.weight} onChange={e=>setOF({...oF,weight:e.target.value})}/>
        </div>
        <div style={{marginBottom:16}}>
          <div style={{fontSize:10,letterSpacing:"1.5px",textTransform:"uppercase" as const,color:C.muted,marginBottom:8,fontWeight:600}}>{t.petType}</div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap" as const}}>
            {PET_TYPES.map(p=>(
              <button key={p.en} onClick={()=>setOF({...oF,petType:p.en})} style={{padding:"8px 14px",borderRadius:100,border:`1px solid ${oF.petType===p.en?C.orange:C.border}`,background:oF.petType===p.en?"rgba(240,160,48,.15)":"transparent",color:oF.petType===p.en?C.orange:C.muted,fontSize:13,cursor:"pointer"}}>
                {p.icon} {lang==="en"?p.en:p.ru}
              </button>
            ))}
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <Field label={t.readyFrom} ph="" type="date" val={oF.d1} onChange={e=>setOF({...oF,d1:e.target.value})}/>
          <Field label={t.deliverBy} ph="" type="date" val={oF.d2} onChange={e=>setOF({...oF,d2:e.target.value})}/>
        </div>
        <Field label={t.notes} ph={t.notesPh} val={oF.notes} onChange={e=>setOF({...oF,notes:e.target.value})} multiline/>
        <Divider label={t.contactPrefs}/>
        <Toggle label={t.openChat} sub="Free in-app messaging" checked={oF.openChat} onChange={()=>setOF({...oF,openChat:!oF.openChat})}/>
        <Toggle label={t.openCalls} checked={oF.openCalls} onChange={()=>setOF({...oF,openCalls:!oF.openCalls})}/>
        <Toggle label={t.openSMS} checked={oF.openSMS} onChange={()=>setOF({...oF,openSMS:!oF.openSMS})}/>
        {(oF.openCalls||oF.openSMS) && <Field label={t.phone} ph={t.phonePh} type="tel" val={oF.ph} onChange={e=>setOF({...oF,ph:e.target.value})}/>}
        <SubmitBtn label={t.post} onClick={()=>{if(!loggedIn){setShowLogin(true);return;}nav("posted");}}/>
      </div>
      <Footer/>
    </div>
  );

  // DRIVER FORM
  if(view==="driver") return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.white,fontFamily:"'DM Sans',system-ui,sans-serif"}}>
      {showLogin && <LoginModal/>}
      <NavBar/>
      <div style={{maxWidth:540,margin:"0 auto",padding:"28px 20px 80px"}}>
        <BackBtn to="home"/>
        <div style={{fontWeight:900,fontSize:"clamp(24px,6vw,32px)",letterSpacing:-1.5,marginBottom:6,lineHeight:1.1,color:C.white}}>{t.driverTitle[0]}<br/>{t.driverTitle[1]}</div>
        <div style={{fontSize:14,color:C.muted,marginBottom:24,lineHeight:1.6}}>{t.driverSub}</div>
        <CountryPicker/>
        <Field label={t.pointA} ph="City or ZIP code" val={dF.from} onChange={e=>setDF({...dF,from:e.target.value})}/>
        <Field label={t.pointB} ph="City or ZIP code" val={dF.to} onChange={e=>setDF({...dF,to:e.target.value})}/>
        {dF.from&&dF.to&&<button onClick={()=>openMaps(dF.from,dF.to)} style={{width:"100%",background:"transparent",border:`1px solid #238636`,color:C.green,borderRadius:10,padding:"10px",fontSize:13,cursor:"pointer",fontWeight:600,marginBottom:16}}>🗺 {t.viewMap}: {dF.from} → {dF.to}</button>}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <Field label={t.travelDate} ph="" type="date" val={dF.date} onChange={e=>setDF({...dF,date:e.target.value})}/>
          <Field label={t.maxWeight} ph="80" type="number" val={dF.cap} onChange={e=>setDF({...dF,cap:e.target.value})}/>
        </div>
        <Divider label={t.pickupR}/>
        <Slider label={t.pickupRQ} val={dF.rA} onChange={e=>setDF({...dF,rA:Number(e.target.value)})} color="orange"/>
        <Divider label={t.deliveryR}/>
        <Slider label={t.deliveryRQ} val={dF.rB} onChange={e=>setDF({...dF,rB:Number(e.target.value)})} color="green"/>
        {(dF.rA>0||dF.rB>0)&&<div style={{fontSize:13,color:"#c9d1d9",padding:"10px 14px",background:C.card2,borderRadius:10,border:`1px solid ${C.border}`,marginBottom:16}}>📍 Pickup ±{dF.rA} mi · 🏁 Delivery ±{dF.rB} mi</div>}
        <Field label={t.notes} ph={t.notesPh} val={dF.notes} onChange={e=>setDF({...dF,notes:e.target.value})} multiline/>
        <Divider label={t.contactPrefs}/>
        <Toggle label={t.openChat} sub="Free in-app messaging" checked={dF.openChat} onChange={()=>setDF({...dF,openChat:!dF.openChat})}/>
        <Toggle label={t.openCalls} checked={dF.openCalls} onChange={()=>setDF({...dF,openCalls:!dF.openCalls})}/>
        <Toggle label={t.openSMS} checked={dF.openSMS} onChange={()=>setDF({...dF,openSMS:!dF.openSMS})}/>
        {(dF.openCalls||dF.openSMS)&&<Field label={t.phone} ph={t.phonePh} type="tel" val={dF.ph} onChange={e=>setDF({...dF,ph:e.target.value})}/>}
        <SubmitBtn label={t.postD} onClick={()=>{if(!loggedIn){setShowLogin(true);return;}nav("posted");}}/>
      </div>
      <Footer/>
    </div>
  );

  // POSTED SUCCESS
  if(view==="posted") return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.white,fontFamily:"'DM Sans',system-ui,sans-serif"}}>
      <NavBar/>
      <div style={{display:"flex",flexDirection:"column" as const,alignItems:"center",justifyContent:"center",minHeight:"80vh",textAlign:"center" as const,padding:20}}>
        <div style={{fontSize:72,marginBottom:20}}>🐾</div>
        <div style={{fontWeight:900,fontSize:30,marginBottom:8,color:C.white}}>{t.posted}</div>
        <div style={{color:C.muted,marginBottom:32,maxWidth:300,lineHeight:1.6}}>{t.postedSub}</div>
        {loggedIn && <div style={{background:"rgba(63,185,80,.1)",border:`1px solid rgba(63,185,80,.3)`,borderRadius:12,padding:"14px 20px",marginBottom:24,fontSize:14,color:C.green,maxWidth:360}}>{t.matchAlert}</div>}
        <SubmitBtn label={t.seeAll} onClick={()=>nav("feed")}/>
        <button onClick={()=>nav("home")} style={{background:"none",border:"none",color:C.muted,fontSize:13,cursor:"pointer",marginTop:14}}>{t.backHome}</button>
      </div>
      <Footer/>
    </div>
  );

  // CHAT
  if(view==="chat"&&chatWith) return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.white,fontFamily:"'DM Sans',system-ui,sans-serif",display:"flex",flexDirection:"column" as const}}>
      <div style={{display:"flex",alignItems:"center",gap:12,padding:"14px 20px",borderBottom:`1px solid ${C.border2}`,background:"rgba(13,17,23,.97)",position:"sticky",top:0,zIndex:100}}>
        <button onClick={()=>nav("feed")} style={{background:"none",border:"none",color:C.muted,fontSize:20,cursor:"pointer",padding:0}}>←</button>
        <div style={{width:36,height:36,borderRadius:"50%",background:`linear-gradient(135deg,${C.orange},${C.red})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:700,color:C.bg,cursor:"pointer"}} onClick={()=>{setProfileUser(chatWith);nav("profile-user");}}>{chatWith.user[0]}</div>
        <div style={{flex:1}}>
          <div style={{fontWeight:700,fontSize:15,color:C.white,cursor:"pointer"}} onClick={()=>{setProfileUser(chatWith);nav("profile-user");}}>{chatWith.user}</div>
          <div style={{fontSize:11,color:C.green}}>● Online · {chatWith.from} → {chatWith.to}</div>
        </div>
        {chatWith.openCalls && <button onClick={()=>window.open("tel:+15550001234")} style={{background:"transparent",border:`1px solid ${C.green}`,color:C.green,borderRadius:100,padding:"6px 14px",fontSize:12,cursor:"pointer",fontWeight:600}}>{t.callBtn}</button>}
      </div>
      <div style={{flex:1,padding:"20px 16px",overflowY:"auto" as const,display:"flex",flexDirection:"column" as const,gap:10}}>
        <div style={{textAlign:"center" as const,fontSize:11,color:C.muted,padding:"6px 16px",background:C.card,borderRadius:100,alignSelf:"center",border:`1px solid ${C.border2}`}}>
          🔒 PetAlong connects people. All arrangements are your own responsibility.
        </div>
        {messages.map(m=>(
          <div key={m.id} style={{display:"flex",justifyContent:m.from==="me"?"flex-end":"flex-start"}}>
            <div style={{maxWidth:"78%",background:m.from==="me"?C.orange:C.card,color:m.from==="me"?"#0d1117":"#c9d1d9",borderRadius:m.from==="me"?"18px 18px 4px 18px":"18px 18px 18px 4px",padding:"10px 14px",fontSize:14,lineHeight:1.5}}>
              {m.text}
              <div style={{fontSize:10,opacity:.6,marginTop:4,textAlign:"right" as const}}>{m.time}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{padding:"12px 16px",borderTop:`1px solid ${C.border2}`,background:"rgba(13,17,23,.97)",display:"flex",gap:10}}>
        <input value={newMsg} onChange={e=>setNewMsg(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&newMsg.trim()){setMessages([...messages,{id:Date.now(),from:"me",text:newMsg,time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}]);setNewMsg("");}}} placeholder={t.chatPh} style={{...INP,flex:1,padding:"11px 14px",borderRadius:100}}/>
        <button onClick={()=>{if(newMsg.trim()){setMessages([...messages,{id:Date.now(),from:"me",text:newMsg,time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}]);setNewMsg("");}}} style={{background:C.orange,border:"none",borderRadius:"50%",width:44,height:44,cursor:"pointer",fontSize:18,flexShrink:0,color:C.bg,fontWeight:700}}>↑</button>
      </div>
    </div>
  );

  // USER PROFILE
  if(view==="profile-user"&&profileUser) return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.white,fontFamily:"'DM Sans',system-ui,sans-serif"}}>
      <NavBar/>
      <div style={{maxWidth:580,margin:"0 auto",padding:"28px 20px 80px"}}>
        <BackBtn to="feed"/>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:20,padding:28,marginBottom:20}}>
          <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:16}}>
            <div style={{width:64,height:64,borderRadius:"50%",background:`linear-gradient(135deg,${C.blue},${C.purple})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,fontWeight:900,color:C.white,flexShrink:0}}>{profileUser.user[0]}</div>
            <div>
              <div style={{fontWeight:800,fontSize:20,color:C.white,marginBottom:4}}>{profileUser.user}</div>
              <Stars rating={profileUser.rating}/>
              <span style={{fontSize:12,color:C.muted,marginLeft:8}}>({profileUser.reviews} reviews)</span>
            </div>
          </div>
          <TrustBadges l={profileUser} t={t}/>
          {profileUser.fbConnected && (
            <button onClick={()=>window.open("https://facebook.com","_blank")} style={{marginTop:14,width:"100%",background:"#1877f2",border:"none",borderRadius:10,padding:"10px 16px",color:C.white,fontSize:13,cursor:"pointer",fontWeight:600}}>
              f View Facebook Profile →
            </button>
          )}
        </div>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:20,marginBottom:16}}>
          <div style={{fontWeight:700,fontSize:15,marginBottom:14,color:C.muted,letterSpacing:"1px",textTransform:"uppercase" as const,fontSize:11}}>Active listing</div>
          <ListingCard l={profileUser}/>
        </div>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:20}}>
          <div style={{fontWeight:700,fontSize:11,marginBottom:14,color:C.muted,letterSpacing:"1px",textTransform:"uppercase" as const}}>{t.ratings}</div>
          {[{user:"Jennifer L.",text:"Mike was amazing! Took such good care of my dog.",rating:5},{user:"Carlos M.",text:"Great driver, very communicative.",rating:5},{user:"Anna K.",text:"Would definitely use again!",rating:4}].slice(0,Math.min(3,profileUser.reviews)).map((r,i)=>(
            <div key={i} style={{borderBottom:i<2?`1px solid ${C.border2}`:"none",paddingBottom:i<2?14:0,marginBottom:i<2?14:0}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                <span style={{fontWeight:600,fontSize:13,color:C.white}}>{r.user}</span>
                <Stars rating={r.rating}/>
              </div>
              <div style={{fontSize:13,color:C.muted,fontStyle:"italic" as const}}>"{r.text}"</div>
            </div>
          ))}
          {profileUser.reviews===0 && <div style={{color:C.muted,fontSize:13}}>{t.noRatings}</div>}
        </div>
      </div>
      <Footer/>
    </div>
  );

  // MY PROFILE
  if(view==="profile-me") return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.white,fontFamily:"'DM Sans',system-ui,sans-serif"}}>
      <NavBar/>
      <div style={{maxWidth:580,margin:"0 auto",padding:"28px 20px 80px"}}>
        <BackBtn to="home"/>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:20,padding:28,marginBottom:20}}>
          <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:16}}>
            <div style={{width:64,height:64,borderRadius:"50%",background:userPhoto?`url(${userPhoto}) center/cover`:`linear-gradient(135deg,${C.orange},${C.red})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,fontWeight:900,color:C.bg}}>{userPhoto?"":(userName?userName[0]:"V")}</div>
            <div>
              <div style={{fontWeight:800,fontSize:20,color:C.white,marginBottom:4}}>{userName||"Vova78"}</div>
              <div style={{fontSize:13,color:C.muted}}>kvnvn777@gmail.com</div>
            </div>
          </div>
          <div style={{display:"flex",gap:8,flexWrap:"wrap" as const}}>
            <span style={{fontSize:11,background:"rgba(88,166,255,.15)",color:C.blue,padding:"3px 10px",borderRadius:100,fontWeight:600}}>f {t.fbConnected}</span>
            <span style={{fontSize:11,background:"rgba(63,185,80,.15)",color:C.green,padding:"3px 10px",borderRadius:100,fontWeight:600}}>📱 {t.phoneVerified}</span>
            <span style={{fontSize:11,background:"rgba(139,148,158,.1)",color:C.muted,padding:"3px 10px",borderRadius:100}}>{t.memberSince} 2025</span>
          </div>
        </div>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:20,marginBottom:16}}>
          <div style={{fontWeight:700,fontSize:11,marginBottom:14,color:C.muted,letterSpacing:"1px",textTransform:"uppercase" as const}}>{t.myListings}</div>
          <div style={{color:C.muted,fontSize:13,textAlign:"center" as const,padding:"20px 0"}}>{t.noListings}</div>
          <SubmitBtn label={t.addPost} onClick={()=>nav("owner")}/>
        </div>
        <button onClick={()=>{setLoggedIn(false);setUserName("");setUserPhoto("");nav("home");}} style={{width:"100%",background:"transparent",border:`1px solid ${C.red}`,borderRadius:12,padding:14,color:C.red,fontWeight:600,cursor:"pointer",fontSize:14}}>{t.signOut}</button>
      </div>
      <Footer/>
    </div>
  );

  // ABOUT
  if(view==="about") return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.white,fontFamily:"'DM Sans',system-ui,sans-serif"}}>
      <NavBar/>
      <div style={{maxWidth:680,margin:"0 auto",padding:"48px 24px 80px"}}>
        <BackBtn to="home"/>
        <div style={{fontWeight:900,fontSize:"clamp(28px,6vw,42px)",letterSpacing:-1.5,marginBottom:8,color:C.white}}>{t.aboutTitle}</div>
        <div style={{fontSize:16,color:C.orange,marginBottom:32,fontWeight:500}}>{t.aboutSub}</div>
        <div style={{fontSize:16,color:"#c9d1d9",lineHeight:1.8,marginBottom:24}}>{t.aboutText}</div>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:24,marginBottom:24}}>
          <div style={{fontSize:16,color:"#c9d1d9",lineHeight:1.8}}>{t.aboutMission}</div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:14}}>
          {t.stats.map((s,i)=>(
            <div key={i} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:20,textAlign:"center" as const}}>
              <div style={{fontWeight:900,fontSize:24,color:C.orange}}>{s.n}</div>
              <div style={{fontSize:12,color:C.muted}}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
      <Footer/>
    </div>
  );

  // TERMS
  if(view==="terms") return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.white,fontFamily:"'DM Sans',system-ui,sans-serif"}}>
      <NavBar/>
      <div style={{maxWidth:720,margin:"0 auto",padding:"48px 24px 80px"}}>
        <BackBtn to="home"/>
        <div style={{fontWeight:900,fontSize:28,letterSpacing:-1,marginBottom:24,color:C.white}}>{t.termsTitle}</div>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:28}}>
          <pre style={{fontSize:14,color:"#c9d1d9",lineHeight:1.8,whiteSpace:"pre-wrap" as const,fontFamily:"inherit"}}>{t.terms}</pre>
        </div>
      </div>
      <Footer/>
    </div>
  );

  // PRIVACY
  if(view==="privacy") return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.white,fontFamily:"'DM Sans',system-ui,sans-serif"}}>
      <NavBar/>
      <div style={{maxWidth:720,margin:"0 auto",padding:"48px 24px 80px"}}>
        <BackBtn to="home"/>
        <div style={{fontWeight:900,fontSize:28,letterSpacing:-1,marginBottom:24,color:C.white}}>{t.privacyTitle}</div>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:28}}>
          <pre style={{fontSize:14,color:"#c9d1d9",lineHeight:1.8,whiteSpace:"pre-wrap" as const,fontFamily:"inherit"}}>{t.privacy}</pre>
        </div>
      </div>
      <Footer/>
    </div>
  );

  // HOW IT WORKS PAGE
  if(view==="how") return (
    <div style={{minHeight:"100vh",background:C.bg,color:C.white,fontFamily:"'DM Sans',system-ui,sans-serif"}}>
      <NavBar/>
      <div style={{maxWidth:720,margin:"0 auto",padding:"48px 24px 80px"}}>
        <BackBtn to="home"/>
        <div style={{fontWeight:900,fontSize:28,letterSpacing:-1,marginBottom:32,color:C.white}}>{t.howTitle}</div>
        <div style={{display:"flex",flexDirection:"column" as const,gap:16}}>
          {t.how.map((h,i)=>(
            <div key={i} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:24,display:"flex",gap:16,alignItems:"flex-start"}}>
              <div style={{fontSize:36,flexShrink:0}}>{h.icon}</div>
              <div>
                <div style={{fontWeight:700,fontSize:17,color:C.white,marginBottom:6}}>Step {i+1}: {h.t}</div>
                <div style={{fontSize:15,color:"#c9d1d9",lineHeight:1.7}}>{h.d}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{marginTop:32,textAlign:"center" as const}}>
          <SubmitBtn label={t.iNeed} onClick={()=>nav("owner")}/>
          <button onClick={()=>nav("driver")} style={{width:"100%",background:"transparent",border:`1px solid ${C.green}`,borderRadius:14,padding:17,color:C.green,fontWeight:700,fontSize:16,cursor:"pointer",marginTop:10}}>{t.iDrive}</button>
        </div>
      </div>
      <Footer/>
    </div>
  );

  // DEFAULT — HOME
  return <div/>;
}
