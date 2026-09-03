import React,{useEffect,useMemo,useState} from "react";
import {createRoot} from "react-dom/client";
import {motion,AnimatePresence,useMotionValue,useSpring,useTransform} from "framer-motion";
import {ArrowRight,ArrowLeft,Award,BadgeCheck,BrainCircuit,CalendarDays,Check,ChevronDown,Clock3,Code2,ExternalLink,FileUp,Globe2,Layers3,Lightbulb,LogIn,LogOut,Mail,Menu,ShieldCheck,Sparkles,Star,Trophy,Upload,Users,X,Zap,LockKeyhole,ClipboardCheck,Timer,BarChart3,CircleAlert,RefreshCw,Send,FileText,Target,Medal,MousePointer2,Workflow,Infinity,ScanLine,Quote,CheckCircle2} from "lucide-react";
import {QRCodeSVG} from "qrcode.react";
import {supabase} from "./supabase";
import "./styles.css";
import Home from "./Home.jsx";
import ChallengeDetail from "./ChallengeDetail.jsx";

const EVENT_DATE=new Date("2026-09-13T15:15:00+05:30");
const FEE=Number(import.meta.env.VITE_REGISTRATION_FEE||50);
const UPI_ID=import.meta.env.VITE_UPI_ID||"dhalak65@okicici";
const COMPANY_URL="https://quadrafroynsolutions.in";
const WHATSAPP_URL="https://chat.whatsapp.com/B5APGpHRCRiBg7W5PAbgRg";
const BADGE_IMAGES={
  gold:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Zlatna_medalja.png",
  silver:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Srebrna_medalja.png",
  bronze:"https://commons.wikimedia.org/wiki/Special:Redirect/file/Bronze_medal_wikiproject.png"
};

const THEME_DATA=[
  {id:"ARV-PTS-T01",name:"Education & Employability",image:"https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=85",
   problem:"How might we help students discover skills, opportunities and career pathways earlier and act on them with confidence?",
   about:"Design a practical digital or technology-enabled solution for students, institutions, mentors or employers. Focus on a measurable gap between learning and employability.",
   rules:["Choose one clearly defined user group.","Show the current pain point before presenting the solution.","Avoid generic job-board clones; add a differentiated mechanism.","Support key claims with reasonable evidence or assumptions."],
   format:"Round 1 · 6–8 slide PPT · problem → users → insight → solution → impact → implementation"},
  {id:"ARV-PTS-T02",name:"Public Services & Civic Life",image:"https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=85",
   problem:"How might we make a public-service journey simpler, more transparent and easier for citizens to complete?",
   about:"Solve a concrete civic workflow such as awareness, access, reporting, documentation, grievance handling or local participation.",
   rules:["Define the citizen journey and service bottleneck.","Keep the concept inclusive and accessible.","Do not propose solutions that require unrealistic policy changes without explaining dependencies.","Explain privacy, trust and accountability considerations."],
   format:"Round 1 · 6–8 slide PPT · citizen problem → workflow → solution → feasibility → impact"},
  {id:"ARV-PTS-T03",name:"Health & Wellbeing",image:"https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=85",
   problem:"How might technology help people make healthier everyday decisions while keeping the experience simple, safe and human-centred?",
   about:"Explore prevention, awareness, access, habit formation, wellbeing, coordination or non-clinical support. The emphasis is on responsible design.",
   rules:["Clearly state the intended users and boundaries.","Do not present a prototype as medical diagnosis or treatment.","Explain safety, privacy and escalation considerations.","Prioritise measurable user benefit over feature quantity."],
   format:"Round 1 · 6–8 slide PPT · need → responsible concept → user flow → safeguards → impact"},
  {id:"ARV-PTS-T04",name:"Environment & Sustainability",image:"https://images.unsplash.com/photo-1472141521881-95d0e87e2e39?auto=format&fit=crop&w=1200&q=85",
   problem:"How might we turn an environmental challenge into a solution that people can actually adopt, measure and sustain?",
   about:"Address waste, water, energy, mobility, consumption, biodiversity or climate resilience with a focused and measurable intervention.",
   rules:["Define the environmental outcome you want to change.","Use measurable indicators where possible.","Consider behaviour, incentives and adoption—not technology alone.","Explain feasibility, lifecycle effects and unintended consequences."],
   format:"Round 1 · 6–8 slide PPT · challenge → baseline → intervention → measurement → scale"},
  {id:"ARV-PTS-T05",name:"Small Business & Local Commerce",image:"https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=85",
   problem:"How might we help small local businesses compete, operate or serve customers better without adding unnecessary complexity?",
   about:"Build for shops, boutiques, service providers, home businesses, artisans or local marketplaces. Strong entries understand real operational constraints.",
   rules:["Pick one business workflow and make it specific.","Design for affordability and low learning effort.","Explain how the solution creates or protects business value.","Consider local-language, trust and connectivity constraints where relevant."],
   format:"Round 1 · 6–8 slide PPT · business pain → workflow → solution → value → implementation"}
];

const challenges=[
 {id:"aptiq",number:"01",title:"APTIQ",subtitle:"AI Quiz + Logical Reasoning",description:"A sharp test of artificial intelligence awareness, analytical thinking, patterns, logic and decision-making.",tags:["AI","Logic","Reasoning"],team:1,format:"Individual",rounds:["AI Awareness Quiz","Logical Reasoning & Aptitude MCQs"],duration:"Timed assessment",accent:"violet"},
 {id:"webphobia",number:"02",title:"WebPhobia",subtitle:"Website Designing Challenge",description:"Turn a creative brief into a polished, usable and technically convincing website within the announced time window.",tags:["UI/UX","Web","Creativity"],team:2,format:"1–2 members",rounds:["Challenge brief & design direction","Timed website build","Final showcase / evaluation"],duration:"Fixed design window",accent:"rose"},
 {id:"problem",number:"03",title:"Problem to Solution",subtitle:"Innovation & Prototype Challenge",description:"Choose one real-world theme, pitch a meaningful idea and, if shortlisted, turn it into a defensible prototype, architecture and solution.",tags:["Innovation","Prototype","Architecture"],team:4,format:"Up to 4 members",rounds:["Round 1 — Idea presentation PPT","Shortlisting & finalist announcement","Final Round — Prototype + Architecture + Solution"],duration:"Two-stage challenge",accent:"gold"}
];
const themes=["Education & Employability","Public Services & Civic Life","Health & Wellbeing","Environment & Sustainability","Small Business & Local Commerce"];
const faq=[
 ["Who can register?","Students create an ARVEXA account first and then complete registration from the participant dashboard."],
 ["Can I select more than one challenge?","Yes. A participant can select one or more arenas. Team limits are enforced independently for every selected challenge."],
 ["What happens after I pay?","Upload a clear payment screenshot. Your registration remains Pending until an authorized admin verifies it."],
 ["When does the dashboard unlock?","Your dashboard is available after login, but the verified competition flow and final registration status unlock only after payment approval."],
 ["How does Problem to Solution work?","Select exactly one of the five themes for Round 1, prepare the requested PPT, and shortlisted teams move to the final prototype and architecture round."],
 ["What is the 10 Gold benefit?","4 Bronze convert to 1 Silver and 3 Silver convert to 1 Gold. Reaching 10 Gold badges unlocks the ARVEXA Direct Interview privilege, subject to hiring availability and published role terms."]
];

function useCountdown(){
 const [now,setNow]=useState(new Date());
 useEffect(()=>{const t=setInterval(()=>setNow(new Date()),1000);return()=>clearInterval(t)},[]);
 const diff=Math.max(0,EVENT_DATE-now),s=Math.floor(diff/1000);
 return {days:Math.floor(s/86400),hours:Math.floor(s%86400/3600),minutes:Math.floor(s%3600/60),seconds:s%60,started:diff===0};
}
function Loader({done}){return <AnimatePresence>{!done&&<motion.div className="loader" initial={{opacity:1}} exit={{opacity:0,scale:1.04}} transition={{duration:1.1}}><div className="loader-rings"><i/><i/><i/></div><motion.div className="loader-word" initial={{opacity:0,scale:.72,y:24,letterSpacing:".7em"}} animate={{opacity:1,scale:1,y:0,letterSpacing:".14em"}} transition={{delay:.18,duration:1.05,ease:[.16,1,.3,1]}}><b>ARVEXA</b><span>2026</span></motion.div><motion.div className="loader-line" initial={{scaleX:0}} animate={{scaleX:1}} transition={{delay:.6,duration:1.1}}><i/></motion.div><small>QUADRAFROYN SOLUTIONS · ENTER THE ARENA</small></motion.div>}</AnimatePresence>}
function Reveal({children,className="",delay=0}){return <motion.div className={className} initial={{opacity:0,y:34}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.12}} transition={{duration:.75,delay,ease:[.22,1,.36,1]}}>{children}</motion.div>}
function Magnetic({children,className="",onClick}){return <motion.button className={className} onClick={onClick} whileHover={{y:-3}} whileTap={{scale:.97}}>{children}</motion.button>}
function Nav({user,profile,onRoute}){
  const [open,setOpen]=useState(false);
  const links=[["Challenges","challenges"],["Recognition","recognition"],["Journey","journey"],["FAQ","faq"]];
  const go=(route,focus=null)=>{setOpen(false);onRoute(route,focus)};
  return <header className="nav">
    <button className="brand" onClick={()=>go("home")} aria-label="ARVEXA home">
      <span className="brand-logo"><img src="/assets/arvexa-logo.svg" alt="ARVEXA"/></span>
      <span><b>ARVEXA</b><small>2026</small></span>
    </button>
    <nav className={open?"open":""}>
      {links.map(([label,route])=><button key={route} onClick={()=>go(route)}>{label}</button>)}
      <button className="nav-announce" onClick={()=>go("recognition")}>10 GOLD → DIRECT INTERVIEW</button>
    </nav>
    <div className="nav-actions">
      {user
        ? <button className="nav-user" onClick={()=>go(profile?.role==="admin"?"admin":"dashboard")}>{profile?.role==="admin"?"ADMIN DESK":"DASHBOARD"}</button>
        : <button className="nav-login" onClick={()=>go("login")}><LogIn size={15}/> Login</button>}
      <button className="nav-signup" onClick={()=>go("signup")}>Sign up <ArrowRight size={15}/></button>
      <button className="menu" onClick={()=>setOpen(!open)} aria-label="Toggle menu">{open?<X/>:<Menu/>}</button>
    </div>
  </header>
}
function Countdown({hero=false}){const c=useCountdown();const units=[["days","DAYS"],["hours","HOURS"],["minutes","MINUTES"],["seconds","SECONDS"]];return <div className={"countdown-wrap "+(hero?"hero-countdown":"")}><div className="countdown-label"><span className="pulse-dot"/> <Timer size={15}/> COUNTDOWN TO ARVEXA 2026</div><div className="countdown">{units.map(([k,l])=><motion.div key={k} animate={k==="seconds"?{scale:[1,1.018,1]}:{}} transition={{duration:.9,repeat:Infinity}}><strong>{String(c[k]).padStart(2,"0")}</strong><span>{l}</span></motion.div>)}</div></div>}
function SectionHeader({number,title,children,light=false}){return <Reveal><span className={"index "+(light?"light":"")}>{number}</span><h2>{title}</h2>{children&&<p className="section-lead">{children}</p>}</Reveal>}
function MiniBadge({type="gold",label}){return <div className={"mini-badge "+type}><div className="mini-medal"><span>{type==="gold"?<Trophy/>:type==="silver"?<BadgeCheck/>:<Award/>}</span></div><b>{label||type.toUpperCase()}</b></div>}
function AwardBadge({type="gold",large=false}){return <div className={"award-badge-wrap remote-badge "+type+(large?" large":"")}><div className="badge-glow"/><img src={BADGE_IMAGES[type]} alt={`${type} ARVEXA recognition badge`} loading="lazy"/><span className="badge-label">{type.toUpperCase()}</span></div>}

function CursorAura(){
  const x=useMotionValue(-300),y=useMotionValue(-300);
  const sx=useSpring(x,{stiffness:80,damping:20}),sy=useSpring(y,{stiffness:80,damping:20});
  useEffect(()=>{
    const move=e=>{x.set(e.clientX);y.set(e.clientY)};
    window.addEventListener("pointermove",move,{passive:true});
    return()=>window.removeEventListener("pointermove",move);
  },[x,y]);
  return <motion.div className="cursor-aura" style={{left:sx,top:sy}}/>;
}

function AmbientParticles(){
  const particles=useMemo(()=>Array.from({length:34},(_,i)=>({
    id:i,left:`${(i*29)%101}%`,top:`${(i*47)%101}%`,size:2+(i%4),delay:(i%9)*.7,duration:7+(i%8)
  })),[]);
  return <div className="ambient-particles" aria-hidden="true">{particles.map(p=><i key={p.id} style={{left:p.left,top:p.top,width:p.size,height:p.size,animationDelay:`-${p.delay}s`,animationDuration:`${p.duration}s`}}/>)}</div>;
}

function WordReveal({children,className=""}){
  return <motion.span className={`word-reveal ${className}`} initial={{opacity:0,y:28}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.4}} transition={{duration:.7,ease:[.16,1,.3,1]}}>{children}</motion.span>;
}

function Counter({value,label,prefix="",suffix=""}){
  const [shown,setShown]=useState(0);
  useEffect(()=>{
    let frame=0; const target=Number(value)||0; const start=performance.now(); const duration=1200;
    const tick=now=>{const p=Math.min(1,(now-start)/duration);setShown(Math.round((1-Math.pow(1-p,4))*target));if(p<1)frame=requestAnimationFrame(tick)};
    frame=requestAnimationFrame(tick); return()=>cancelAnimationFrame(frame);
  },[value]);
  return <div className="metric-counter"><strong>{prefix}{shown}{suffix}</strong><span>{label}</span></div>;
}

function SpotlightCard({children,className="",delay=0}){
  const [spot,setSpot]=useState({x:50,y:50});
  return <motion.article className={`spotlight-card ${className}`} initial={{opacity:0,y:28}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.15}} transition={{duration:.7,delay}} onMouseMove={e=>{const r=e.currentTarget.getBoundingClientRect();setSpot({x:((e.clientX-r.left)/r.width)*100,y:((e.clientY-r.top)/r.height)*100})}} style={{"--spot-x":`${spot.x}%`,"--spot-y":`${spot.y}%`}}>{children}</motion.article>;
}

function SignalLine(){
  return <div className="signal-line" aria-hidden="true"><span/><span/><span/><span/><span/><span/><span/></div>;
}


function Challenges({onRoute,focus}){
  const [active,setActive]=useState(focus||"aptiq");
  const [themeOpen,setThemeOpen]=useState(null);
  useEffect(()=>{
    if(focus){
      setActive(focus);
      setTimeout(()=>document.getElementById(focus)?.scrollIntoView({behavior:"smooth",block:"center"}),120);
    }
  },[focus]);
  return <main className="page">
    <section className="page-hero challenge-hero">
      <span className="index">02 — CHALLENGE COMMAND</span>
      <h1>Three arenas.<br/><strong>Three kinds of brilliance.</strong></h1>
      <p>Explore the complete challenge architecture before you register: problem statement, ID, team format, rules, evaluation and submission expectations.</p>
      <div className="hero-metrics"><div><b>03</b><span>ARENAS</span></div><div><b>01–04</b><span>TEAM SIZE</span></div><div><b>05</b><span>PROBLEM THEMES</span></div><div><b>02</b><span>ROUNDS</span></div></div>
    </section>
    <div className="challenge-nav">{challenges.map(c=><button className={active===c.id?"active":""} key={c.id} onClick={()=>{setActive(c.id);document.getElementById(c.id)?.scrollIntoView({behavior:"smooth",block:"center"})}}><span>{c.number}</span>{c.title}</button>)}</div>
    <div className="challenge-detail-grid">
      {challenges.map((c,idx)=><motion.article id={c.id} className={"detail-card "+c.accent+" "+(active===c.id?"selected":"")} key={c.id} onViewportEnter={()=>setActive(c.id)}>
        <div className="detail-emblem"><span>{c.number}</span><div>{c.id==="aptiq"?<BrainCircuit/>:c.id==="webphobia"?<Code2/>:<Lightbulb/>}</div><small>{c.format}</small></div>
        <div className="detail-body">
          <div className="detail-top"><span>{c.duration}</span><b>{c.title}</b></div>
          <h2>{c.subtitle}</h2><p>{c.description}</p>
          <div className="tags">{c.tags.map(t=><span key={t}>{t}</span>)}</div>
          <div className="challenge-spec-grid">
            <div><span>TEAM FORMAT</span><b>{c.format}</b></div>
            <div><span>ARENA TYPE</span><b>{c.theme}</b></div>
            <div><span>ROUNDS</span><b>{c.rounds.length}</b></div>
            <div><span>ONLINE</span><b>100%</b></div>
          </div>
          <h3>Step-by-step format</h3>
          <ol>{c.rounds.map((r,i)=><li key={i}><i>{i+1}</i><span>{r}</span></li>)}</ol>
          <div className="rule-box"><b><Users/> Team size: {c.format}</b><span>{c.id==="problem"?"Round 1 requires exactly one theme. Shortlisted teams proceed to the final prototype, architecture and solution round.":"Team-member fields appear only where the published arena format permits them."}</span></div>
          <div className="card-actions"><button className="outline" onClick={()=>onRoute("challenge-"+c.id)}>View full challenge <ArrowRight/></button><button className="primary" onClick={()=>onRoute("register",c.id)}>Register for {c.title} <ArrowRight/></button></div>
        </div>
      </motion.article>)}
    </div>

    <section className="themes">
      <div className="themes-heading"><div><span className="index">PROBLEM TO SOLUTION · ROUND 1</span><h2>Five themes. <strong>Five real-world directions.</strong></h2></div><p>Choose exactly one theme for Problem to Solution. Each theme below gives your team a concrete starting point without prescribing the final idea.</p></div>
      <div className="theme-command-grid">
        {THEME_DATA.map((t,i)=><motion.article className={"theme-card "+(themeOpen===t.id?"open":"")} key={t.id} whileHover={{y:-7}} onClick={()=>setThemeOpen(themeOpen===t.id?null:t.id)}>
          <div className="theme-image"><img src={t.image} alt={t.name}/><span>{String(i+1).padStart(2,"0")}</span><b>{t.id}</b></div>
          <div className="theme-content">
            <div className="theme-title-row"><h3>{t.name}</h3><span>{themeOpen===t.id?"−":"+"}</span></div>
            <div className="theme-field"><label>THEME</label><b>{t.name}</b></div>
            <div className="theme-field"><label>PROBLEM STATEMENT</label><p>{t.problem}</p></div>
            <div className="theme-field"><label>PROBLEM STATEMENT ID</label><b>{t.id}</b></div>
            <div className="theme-expand">
              <div className="theme-field"><label>ABOUT THIS</label><p>{t.about}</p></div>
              <div className="theme-field"><label>RULES & REGULATIONS</label><ul>{t.rules.map(rule=><li key={rule}>{rule}</li>)}</ul></div>
              <div className="theme-field"><label>FORMAT</label><p>{t.format}</p></div>
            </div>
            <button className="theme-open" onClick={(e)=>{e.stopPropagation();setThemeOpen(themeOpen===t.id?null:t.id)}}>{themeOpen===t.id?"Close details":"Explore theme details"} <ArrowRight size={15}/></button>
          </div>
        </motion.article>)}
      </div>
      <div className="final-round"><Target/><div><b>FINAL ROUND / SHORTLISTED TEAMS</b><p>Develop the selected idea into a convincing prototype and architecture. Communicate workflow, technology choices, feasibility, impact and implementation evidence.</p></div></div>
    </section>
  </main>
}

function Auth({mode="login",onAuth,onRoute}){
  const [form,setForm]=useState({email:"",password:"",name:""});
  const [msg,setMsg]=useState("");
  const [busy,setBusy]=useState(false);
  const [showPassword,setShowPassword]=useState(false);
  const isSignup=mode==="signup", isForgot=mode==="forgot";
  async function submit(e){
    e.preventDefault();setBusy(true);setMsg("");
    try{
      if(isForgot){
        const {error}=await supabase.auth.resetPasswordForEmail(form.email,{redirectTo:window.location.origin+"/login"});
        if(error)throw error; setMsg("Password reset email sent. Check your inbox.");
      }else if(isSignup){
        const {data,error}=await supabase.auth.signUp({email:form.email,password:form.password,options:{data:{full_name:form.name}}});
        if(error)throw error;
        if(data?.session)onAuth(); else setMsg("Account created. Check your email if confirmation is enabled, then sign in.");
      }else{
        const {error}=await supabase.auth.signInWithPassword({email:form.email,password:form.password});
        if(error)throw error; onAuth();
      }
    }catch(e){setMsg(e.message||"Something went wrong. Please try again.");}
    finally{setBusy(false);}
  }
  return <main className="auth-page-clean">
    <div className="auth-brand-top"><button onClick={()=>onRoute("home")}><span className="auth-brand-icon"><img src="/assets/arvexa-logo.svg" alt="ARVEXA"/></span><span><b>ARVEXA</b><small>2026 · QUADRAFROYN SOLUTIONS</small></span></button></div>
    <div className="auth-layout">
      <section className="auth-side-card">
        <div className="auth-side-glow"/><div className="auth-side-grid"/>
        <div className="auth-shield"><img src="/assets/arvexa-logo.svg" alt=""/></div>
        <div className="auth-side-copy"><span>ARVEXA 2026</span><h2>YOUR SKILL.<br/><em>YOUR PROOF.</em></h2><p>A focused national digital challenge built around reasoning, design, innovation and visible achievement.</p></div>
        <div className="auth-side-stats"><span><b>03</b>Arenas</span><span><b>₹50</b>Entry</span><span><b>QR</b>Credential</span></div>
      </section>
      <form className="auth-clean-card" onSubmit={submit}>
        <div className="auth-avatar"><img src="/assets/arvexa-logo.svg" alt=""/></div>
        <span className="auth-kicker">{isSignup?"CREATE ACCOUNT":isForgot?"RESET ACCESS":"WELCOME BACK"}</span>
        <h1>{isSignup?"Create your account":isForgot?"Reset your access":"Welcome back"}</h1>
        <p>{isSignup?"Sign up to continue with your ARVEXA participant journey.":isForgot?"Enter your email and we will send a secure reset link.":"Sign in to access your participant dashboard and registration."}</p>
        {isSignup&&<label>FULL NAME<input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Enter your name" required/></label>}
        <label>EMAIL ADDRESS<input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="Enter your email" required/></label>
        {!isForgot&&<label>PASSWORD<div className="password-wrap"><input type={showPassword?"text":"password"} minLength="6" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="Enter your password" required/><button type="button" onClick={()=>setShowPassword(!showPassword)}>{showPassword?"Hide":"Show"}</button></div></label>}
        <button className="auth-main-btn" disabled={busy}>{busy?"Please wait…":isSignup?"Create account":isForgot?"Send reset link":"Sign in"} <ArrowRight size={16}/></button>
        {msg&&<div className={"auth-message "+(msg.toLowerCase().includes("error")?"error":"")}>{msg}</div>}
        
        </div>}
        <div className="auth-switches">
          {mode==="login"&&<button type="button" onClick={()=>onRoute("forgot")}>Forgot password?</button>}
          <button type="button" onClick={()=>onRoute(isSignup?"login":"signup")}>{isSignup?"Already have an account? Sign in":"New participant? Create an account"}</button>
        </div>
        <div className="auth-secure"><LockKeyhole size={17}/><span><b>Secure participant access</b><small>Authentication and session state are handled by Supabase.</small></span></div>
      </form>
    </div>
  </main>
}

function Register({user,initialChallenge,onRoute,onSaved}){
  const blankForm={name:"",team_name:"",branch:"",department:"",year:"",college:"",email:user?.email||"",phone:""};
  const [step,setStep]=useState(1),[form,setForm]=useState(blankForm),[selected,setSelected]=useState(initialChallenge?[initialChallenge]:[]),[members,setMembers]=useState({}),[file,setFile]=useState(null),[busy,setBusy]=useState(false),[msg,setMsg]=useState(""),[submitted,setSubmitted]=useState(false),[whatsappJoined,setWhatsappJoined]=useState(false),[problemTheme,setProblemTheme]=useState("");
  useEffect(()=>{if(user?.email)setForm(f=>({...f,email:user.email}))},[user?.email]);
  const steps=["IDENTITY","ARENA","PAYMENT","REVIEW"];
  function toggle(id){setSelected(s=>s.includes(id)?s.filter(x=>x!==id):[...s,id])}
  function setMember(id,i,field,value){setMembers(m=>({...m,[id]:{...(m[id]||{}),[i]:{...((m[id]||{})[i]||{}),[field]:value}}}))}
  function maxMembers(id){return Math.max(0,(challenges.find(c=>c.id===id)?.team||1)-1)}
  function validateStep(n){
    setMsg("");
    if(n===1){
      for(const [k,l] of Object.entries({name:"Name on certificate",team_name:"Team name",branch:"Branch",department:"Department",year:"Year of study",college:"College name",phone:"Phone no."})){
        if(!form[k]?.trim()){setMsg(`Please complete ${l}.`);return false}
      }
      return true;
    }
    if(n===2){
      if(!selected.length){setMsg("Select at least one challenge.");return false}
      for(const id of selected){for(let i=0;i<maxMembers(id);i++){const m=members[id]?.[i];if(!m?.name?.trim()||!m?.email?.trim()){setMsg(`Complete Member ${i+1} details for ${challenges.find(c=>c.id===id).title}.`);return false}}}
      if(selected.includes("problem")&&!problemTheme){setMsg("Select exactly one Problem to Solution theme.");return false}
      if(!whatsappJoined){setMsg("Join the ARVEXA WhatsApp community and confirm it before continuing.");return false}
      return true;
    }
    return true;
  }
  async function submit(){
    setMsg("");
    if(!file){setMsg("Upload your payment screenshot.");return}
    if(file.size>5*1024*1024){setMsg("Payment screenshot must be 5 MB or smaller.");return}
    setBusy(true);
    try{
      const regId=crypto.randomUUID();
      const path=`${user.id}/${regId}-${Date.now()}-${file.name.replace(/[^a-z0-9._-]/gi,"_")}`;
      const {error:uerr}=await supabase.storage.from("payment-screenshots").upload(path,file);
      if(uerr)throw uerr;
      const registrationPayload={
        id:regId,user_id:user.id,name:form.name,team_name:form.team_name,branch:form.branch,department:form.department,year:form.year,college_name:form.college,email:form.email,phone:form.phone,selected_challenges:selected,problem_theme:problemTheme||null,payment_amount:FEE,payment_status:"pending",payment_screenshot_path:path
      };
      let {data:reg,error:rerr}=await supabase.from("registrations").insert(registrationPayload).select().single();
      // Older production schemas may still have the column missing from the live table.
      // Retry once without it so the registration flow remains usable; the supplied SQL migration
      // adds the column permanently for future submissions.
      if(rerr && /problem_theme|schema cache/i.test(rerr.message||"")){
        const legacyPayload={...registrationPayload};
        delete legacyPayload.problem_theme;
        ({data:reg,error:rerr}=await supabase.from("registrations").insert(legacyPayload).select().single());
      }
      if(rerr)throw rerr;
      const rows=[];
      selected.forEach(cid=>{for(let i=0;i<maxMembers(cid);i++){const m=members[cid]?.[i];if(m)rows.push({registration_id:reg.id,challenge_id:cid,member_index:i+1,name:m.name,email:m.email,phone:m.phone||"",college_name:m.college||""})}});
      if(rows.length){const {error:terr}=await supabase.from("team_members").insert(rows);if(terr)throw terr}
      setSubmitted(true);
    }catch(e){setMsg(e.message||"Unable to submit registration.");}
    finally{setBusy(false)}
  }
  if(submitted)return <main className="registration-clean"><div className="success-card"><div className="success-icon"><Check/></div><span className="index">REGISTRATION SUBMITTED</span><h1>You are in the <strong>verification queue.</strong></h1><p>Your registration and payment proof are safely stored. An authorized admin will review the payment and your participant dashboard will update after approval.</p><div className="success-steps"><span><b>01</b> Submitted</span><span><b>02</b> Admin review</span><span><b>03</b> Verified</span></div><button className="auth-main-btn" onClick={onSaved}>Open participant dashboard <ArrowRight/></button></div></main>;
  return <main className="registration-clean">
    <section className="register-top">
      <button className="register-brand" onClick={()=>onRoute("home")}><span><img src="/assets/arvexa-logo.svg" alt="ARVEXA"/></span><b>ARVEXA <small>2026</small></b></button>
      <div><span>COMPETITION REGISTRATION</span><b>₹{FEE} · SEASON 01</b></div>
    </section>
    <section className="register-intro"><span className="auth-kicker">ARVEXA 2026 · PARTICIPANT REGISTRATION</span><h1>Register in <strong>four clean steps.</strong></h1><p>Everything required for your competition entry is organised below. Your progress is saved in this page while you complete the form.</p></section>
    <div className="register-progress-bar"><div>{steps.map((s,i)=><div key={s} className={step===i+1?"active":step>i+1?"done":""}><span>{step>i+1?<Check size={14}/>:String(i+1).padStart(2,"0")}</span><b>{s}</b></div>)}</div><i style={{width:`${((step-1)/3)*100}%`}}/></div>
    <section className="register-shell">
      <aside className="register-sidecard">
        <div className="register-sidecard-top"><span>YOUR JOURNEY</span><b>{String(step).padStart(2,"0")} / 04</b></div>
        <h3>{step===1?"Start with your identity.":step===2?"Choose your arena.":step===3?"Secure your entry.":"Make one final check."}</h3>
        <p>{step===1?"Use the exact details you want associated with your competition record and certificate.":step===2?"Select the challenge areas that match your strengths. Team fields appear only where required.":step===3?"Complete the ₹"+FEE+" UPI payment and attach the transaction proof for the verification desk.":"Review every important field before sending your registration into the verification queue."}</p>
        <div className="register-side-steps">{steps.map((s,i)=><div key={s} className={step===i+1?"active":step>i+1?"done":""}><span>{step>i+1?<Check size={13}/>:String(i+1).padStart(2,"0")}</span><div><b>{s}</b><small>{["Identity details","Challenge selection","Payment proof","Final confirmation"][i]}</small></div></div>)}</div>
        <div className="register-side-trust"><ShieldCheck size={17}/><div><b>Protected registration</b><span>Your authenticated account controls this record.</span></div></div>
      </aside>
      <div className="register-main">
        {step===1&&<div className="register-panel"><div className="register-panel-head"><span>01</span><div><h2>Participant identity</h2><p>These details appear on your registration and certificate record.</p></div></div><div className="fields">{Object.entries({name:"Name on certificate",team_name:"Team name",branch:"Branch",department:"Department",year:"Year of study",college:"College name",email:"Email id",phone:"Phone no."}).map(([k,l])=><label key={k}>{l}<input value={form[k]} onChange={e=>setForm({...form,[k]:e.target.value})} required readOnly={k==="email"}/></label>)}</div></div>}
        {step===2&&<div className="register-panel"><div className="register-panel-head"><span>02</span><div><h2>Select challenges & team</h2><p>Choose one or more arenas. Team fields appear only for team-based arenas.</p></div></div><div className="select-cards">{challenges.map(c=><button type="button" className={selected.includes(c.id)?"selected":""} key={c.id} onClick={()=>toggle(c.id)}><div className="select-emblem"><span>{c.number}</span>{c.id==="aptiq"?<BrainCircuit/>:c.id==="webphobia"?<Code2/>:<Lightbulb/>}</div><b>{c.title}</b><span>{c.format}</span><small>{c.subtitle}</small>{selected.includes(c.id)&&<Check/>}</button>)}</div>
          {selected.includes("problem")&&<div className="theme-picker"><div><span>REQUIRED FOR PROBLEM TO SOLUTION</span><h3>Choose exactly one theme</h3><p>This selection is saved with your registration and is visible to the admin verification desk.</p></div><div className="theme-picker-grid">{THEME_DATA.map(t=><button type="button" className={problemTheme===t.id?"selected":""} key={t.id} onClick={()=>setProblemTheme(t.id)}><img src={t.image} alt=""/><span>{t.id}</span><b>{t.name}</b>{problemTheme===t.id&&<Check/>}</button>)}</div></div>}
          {selected.map(id=>{const c=challenges.find(x=>x.id===id),n=maxMembers(id);if(!n)return <div className="no-team" key={id}><Check/> {c.title}: Individual registration — no additional members required.</div>;return <div className="team-box" key={id}><div><h3>{c.title} · Team details</h3><p>Maximum additional members: {n}. All required fields must be complete.</p></div>{Array.from({length:n},(_,i)=><div className="member-row" key={i}><b>MEMBER {i+1}</b><input placeholder="Full name" onChange={e=>setMember(id,i,"name",e.target.value)} required/><input placeholder="Email" type="email" onChange={e=>setMember(id,i,"email",e.target.value)} required/><input placeholder="Phone" onChange={e=>setMember(id,i,"phone",e.target.value)}/><input placeholder="College" onChange={e=>setMember(id,i,"college",e.target.value)}/></div>)}</div>})}
          <div className="whatsapp-gate"><div><span className="whatsapp-kicker">MANDATORY COMMUNITY STEP</span><h3>Join the ARVEXA WhatsApp community.</h3><p>Official announcements, challenge updates and event-day communication will be shared there.</p><a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="whatsapp-button">Join on WhatsApp ↗</a><label className="whatsapp-check"><input type="checkbox" checked={whatsappJoined} onChange={e=>setWhatsappJoined(e.target.checked)}/><span className="check-ui">✓</span><b>I’ve joined the ARVEXA WhatsApp community.</b></label></div><div className="whatsapp-orbit"><img src="/assets/arvexa-logo.svg" alt=""/></div></div>
        </div>}
        {step===3&&<div className="register-panel"><div className="register-panel-head"><span>03</span><div><h2>Payment & proof</h2><p>Pay ₹{FEE} via UPI and upload the original transaction screenshot for manual verification.</p></div></div><div className="payment-grid"><div className="upi-box"><div className="qr-frame"><QRCodeSVG value={`upi://pay?pa=${UPI_ID}&pn=ARVEXA%202026&am=${FEE}&cu=INR`} size={205} level="H"/></div><span className="scan-label">SCAN TO PAY</span><strong>₹{FEE}</strong><b>{UPI_ID}</b><small>GPay · PhonePe · any UPI app</small></div><div className="upload-box"><label className="file-drop"><Upload/><b>{file?file.name:"Upload payment screenshot"}</b><span>PNG, JPG or WEBP · maximum 5 MB</span><input type="file" accept="image/png,image/jpeg,image/webp" onChange={e=>setFile(e.target.files?.[0]||null)}/></label><div className="payment-note"><ShieldCheck/><div><b>Admin verification</b><span>Payment starts as Pending and can only be approved, rejected or revoked by an authorized admin.</span></div></div><div className="payment-note"><LockKeyhole/><div><b>Protected evidence</b><span>The screenshot is stored in the private payment-screenshots bucket under your user ID.</span></div></div></div></div></div>}
        {step===4&&<div className="register-panel review-panel"><div className="review-icon"><ClipboardCheck/></div><span className="auth-kicker">04 · FINAL REVIEW</span><h2>Everything looks ready.</h2><p>Review the summary before sending the registration to the verification desk.</p><div className="review-grid"><div><span>PARTICIPANT</span><b>{form.name}</b><small>{form.email}</small></div><div><span>TEAM</span><b>{form.team_name}</b><small>Team identity captured</small></div><div><span>ARENAS</span><b>{selected.map(id=>challenges.find(c=>c.id===id)?.title).join(" · ")}</b><small>{selected.length} selected</small></div><div><span>PROBLEM THEME</span><b>{THEME_DATA.find(t=>t.id===problemTheme)?.name||"Not applicable"}</b><small>{problemTheme||"Individual / non-PTS entry"}</small></div><div><span>PAYMENT</span><b>₹{FEE}</b><small>{file?.name||"Screenshot attached"}</small></div></div><div className="review-checks"><span><CheckCircle2/> Certificate name captured</span><span><CheckCircle2/> Challenge/team details captured</span><span><CheckCircle2/> Payment evidence attached</span></div></div>}
        {msg&&<div className="form-msg error"><CircleAlert/>{msg}</div>}
        <div className="register-actions">{step>1&&<button type="button" className="outline" onClick={()=>{setMsg("");setStep(step-1)}}><ArrowLeft/> Back</button>}<span>STEP {String(step).padStart(2,"0")} / 04</span>{step<4?<button type="button" className="auth-main-btn" onClick={()=>validateStep(step)&&setStep(step+1)}>Continue <ArrowRight/></button>:<button type="button" className="auth-main-btn" disabled={busy} onClick={submit}>{busy?"Submitting…":"Submit registration"} <Send/></button>}</div>
      </div>
    </section>
  </main>
}

function Dashboard({user,profile,onRoute}){
  const [regs,setRegs]=useState([]),[loading,setLoading]=useState(true);
  async function load(){
    setLoading(true);
    const {data,error}=await supabase.from("registrations").select("*").eq("user_id",user.id).order("created_at",{ascending:false});
    if(error)console.error(error);
    setRegs(data||[]);setLoading(false);
  }
  useEffect(()=>{load()},[user.id]);
  const latest=regs[0],status=latest?.payment_status||"new";
  const selectedCount=latest?.selected_challenges?.length||0;
  const progress=status==="approved"?100:status==="pending"?72:status==="rejected"?42:12;
  const selectedNames=(latest?.selected_challenges||[]).map(id=>challenges.find(c=>c.id===id)?.title).filter(Boolean);
  return <main className="dashboard dashboard-v2">
    <section className="dashboard-v2-hero"><div><span className="index">PARTICIPANT COMMAND CENTRE</span><h1>Welcome back,<br/><strong>{profile?.full_name||user.email?.split("@")[0]}</strong>.</h1><p>Your ARVEXA identity, registration, team and verification state live in one place.</p></div><div className="dashboard-hero-actions"><button className="outline" onClick={()=>onRoute("challenges")}>Explore arenas <ArrowRight/></button><button className="outline" onClick={async()=>{await supabase.auth.signOut();onRoute("home")}}><LogOut/> Sign out</button></div></section>
    <section className={"dashboard-status-card "+status}><div className="status-icon">{status==="approved"?<Check/>:status==="pending"?<Clock3/>:status==="rejected"?<CircleAlert/>:<Sparkles/>}</div><div><span>REGISTRATION STATUS</span><h3>{latest?status.toUpperCase():"NOT STARTED"}</h3><p>{latest?status==="approved"?"Payment approved. Your verified competition journey is unlocked.":status==="rejected"?"Payment was rejected. Review the admin note and submit a fresh registration.":"Payment proof received. Waiting for admin verification.":"Start your competition registration to activate your participant record."}</p></div><button className="auth-main-btn" onClick={()=>onRoute("register")}>{latest?"View registration":"Start registration"} <ArrowRight/></button></section>
    <div className="dashboard-v2-grid">
      <section className="dash-v2-card readiness"><div className="card-top"><span>REGISTRATION READINESS</span><b>{progress}%</b></div><div className="progress-track"><i style={{width:`${progress}%`}}/></div><div className="progress-labels"><span>Identity</span><span>Arena</span><span>Payment</span><span>Verified</span></div><div className="readiness-copy"><CheckCircle2/><div><b>{status==="approved"?"Verified participant":status==="pending"?"Verification in progress":"Registration setup"}</b><p>{latest?"Your latest registration is synced with the verification desk.":"Complete the four-step registration to create your competition entry."}</p></div></div></section>
      <section className="dash-v2-card metric"><span>ARENAS SELECTED</span><strong>{selectedCount||"—"}</strong><p>{selectedNames.length?selectedNames.join(" · "):"No challenge selected yet."}</p></section>
      <section className="dash-v2-card metric"><span>TEAM IDENTITY</span><strong>{latest?.team_name||"—"}</strong><p>{latest?"Team name saved to your registration.":"A team name is required for every entry."}</p></section>
      <section className="dash-v2-card metric"><span>EVENT CLOCK</span><strong>13 SEP</strong><p>3:15 PM · IST · ARVEXA 2026</p></section>
      <section className="dash-v2-card metric"><span>RECOGNITION</span><strong>{profile?.gold_badges||0}G · {profile?.silver_badges||0}S · {profile?.bronze_badges||0}B</strong><p>10 Gold unlocks the Direct Interview privilege for eligible opportunities.</p></section>
      <section className="dash-v2-card wide history"><div className="card-top"><span>REGISTRATION HISTORY</span><button className="mini" onClick={load}><RefreshCw size={13}/> Refresh</button></div>{loading?<p>Loading your records…</p>:regs.length?regs.map(r=><div className="history-row" key={r.id}><div><b>{new Date(r.created_at).toLocaleDateString("en-IN")}</b><span>{r.team_name||"No team name"} · {(r.selected_challenges||[]).map(id=>challenges.find(c=>c.id===id)?.title).join(" · ")}</span></div><em className={r.payment_status}>{r.payment_status}</em></div>):<div className="empty-inline"><ClipboardCheck/><div><b>No registration submitted yet.</b><p>Your competition journey starts with your participant identity.</p></div></div>}</section>
    </div>
    <section className="dashboard-next"><div><span className="index">YOUR NEXT MOVES</span><h2>Turn your dashboard into<br/><strong>your competition cockpit.</strong></h2></div><div className="dashboard-action-grid"><button onClick={()=>onRoute("challenges")}><Target/><b>Review arena rules</b><span>Understand formats, themes and evaluation.</span><ArrowRight/></button><button onClick={()=>onRoute("recognition")}><Medal/><b>Track recognition</b><span>See the Bronze → Silver → Gold ladder.</span><ArrowRight/></button><button onClick={()=>onRoute("journey")}><Workflow/><b>Follow the journey</b><span>Know what happens from registration to verification.</span><ArrowRight/></button><button onClick={()=>onRoute("faq")}><Quote/><b>Read the essentials</b><span>Quick answers before competition day.</span><ArrowRight/></button></div></section>
  </main>
}

function Admin({onRoute}){const[regs,setRegs]=useState([]),[loading,setLoading]=useState(true),[filter,setFilter]=useState("all");async function load(){setLoading(true);const{data,error}=await supabase.from("registrations").select("*,team_members(*)").order("created_at",{ascending:false});if(error)alert(error.message);setRegs(data||[]);setLoading(false)}useEffect(()=>{load()},[]);const counts=useMemo(()=>({all:regs.length,pending:regs.filter(r=>r.payment_status==="pending").length,approved:regs.filter(r=>r.payment_status==="approved").length,rejected:regs.filter(r=>r.payment_status==="rejected").length}),[regs]);const visible=regs.filter(r=>filter==="all"||r.payment_status===filter);return <main className="page admin"><section className="dashboard-head"><div><span className="index">ADMIN CONTROL CENTRE</span><h1>Verification <strong>desk.</strong></h1><p>Review participant details, team data and payment evidence. This is the only approval gate.</p></div><div className="dash-head-actions"><button className="outline" onClick={load}><RefreshCw size={14}/> Refresh</button><button className="outline" onClick={async()=>{await supabase.auth.signOut();onRoute("home")}}><LogOut size={15}/> Sign out</button></div></section><div className="admin-stats">{[["all","TOTAL","All registrations"],["pending","PENDING","Need review"],["approved","APPROVED","Verified"],["rejected","REJECTED","Rejected / revoked"]].map(([k,a,b])=><button key={k} className={filter===k?"active":""} onClick={()=>setFilter(k)}><span>{a}</span><strong>{counts[k]}</strong><small>{b}</small></button>)}</div>{loading?<div className="empty">Loading registrations…</div>:!visible.length?<div className="empty"><ClipboardCheck/><b>No records in this filter.</b></div>:<div className="admin-list">{visible.map(r=><AdminRow key={r.id} r={r} reload={load}/>)}</div>}</main>}
function AdminRow({r,reload}){const[note,setNote]=useState(r.admin_note||""),[url,setUrl]=useState(""),[busy,setBusy]=useState(false);async function openShot(){if(!r.payment_screenshot_path)return;const{data,error}=await supabase.storage.from("payment-screenshots").createSignedUrl(r.payment_screenshot_path,600);if(error)alert(error.message);else setUrl(data.signedUrl)}async function decide(status){setBusy(true);const{error}=await supabase.from("registrations").update({payment_status:status,admin_note:note||null,verified_at:status==="approved"?new Date().toISOString():null}).eq("id",r.id);if(error)alert(error.message);else reload();setBusy(false)}return <article className="admin-row"><div className="admin-main"><div className="admin-person"><span className="index">{r.register_no||"NO REG NO."} · {new Date(r.created_at).toLocaleString("en-IN")}</span><h2>{r.name}</h2><p><strong>Team:</strong> {r.team_name||"—"}</p>{r.problem_theme&&<p><strong>Problem theme:</strong> {THEME_DATA.find(t=>t.id===r.problem_theme)?.name||r.problem_theme}</p>}<p>{r.college_name} · {r.department} · {r.branch} · {r.section} · {r.year}</p><p><Mail size={13}/> {r.email} · {r.phone}</p><div className="admin-tags">{r.selected_challenges.map(id=><span key={id}>{challenges.find(c=>c.id===id)?.title}</span>)}</div></div><div className="admin-status"><span>PAYMENT</span><em className={r.payment_status}>{r.payment_status}</em><b>₹{r.payment_amount}</b></div></div><div className="admin-team">{(r.team_members||[]).length?(r.team_members.map(m=><span key={m.id}><Users size={13}/> {m.name} · {m.email} · {m.challenge_id}</span>)):<span>Individual / no additional team members</span>}</div><div className="admin-actions"><button className="outline" onClick={openShot}><FileUp/> View payment screenshot</button><input placeholder="Admin note (optional)" value={note} onChange={e=>setNote(e.target.value)}/><button className="approve" disabled={busy||r.payment_status==="approved"} onClick={()=>decide("approved")}>Approve</button><button className="reject" disabled={busy} onClick={()=>decide("rejected")}>{r.payment_status==="approved"?"Revoke":"Reject"}</button></div>{url&&<div className="shot"><img src={url}/><button onClick={()=>setUrl("")}><X/></button></div>}</article>}

function Recognition({onRoute}){
  const milestones=[["BRONZE","4 Bronze badges → 1 Silver","First layer of visible merit."],["SILVER","3 Silver badges → 1 Gold","A stronger signal of repeated performance."],["GOLD","10 Gold badges → Direct Interview","Unlock the ARVEXA hiring advantage."]];
  return <main className="page recognition-page">
    <section className="recognition-hero-v2">
      <div className="recognition-hero-copy"><span className="index">04 — RECOGNITION SYSTEM</span><h1>Performance<br/><strong>made visible.</strong></h1><p>Your ARVEXA record turns repeated performance into a professional signal — from your first badge to the 10 Gold Direct Interview milestone.</p><div className="recognition-mini-row"><span><b>4</b> Bronze → Silver</span><span><b>3</b> Silver → Gold</span><span><b>10</b> Gold → Interview</span></div></div>
      <div className="recognition-medal-stage"><div className="medal-orbit orbit-a"/><div className="medal-orbit orbit-b"/>{["bronze","silver","gold"].map((x,i)=><motion.div key={x} className={"rh-badge-v2 "+x} animate={{y:[0,-9,0],rotate:[0,i===1?2:-2,0]}} transition={{duration:4+i,repeat:Infinity,ease:"easeInOut"}}><img src={BADGE_IMAGES[x]} alt={`${x} ARVEXA recognition medal`}/><span>{x.toUpperCase()}</span></motion.div>)}</div>
    </section>
    <section className="recognition-flow"><div className="flow-intro"><span className="index">THE CONVERSION ENGINE</span><h2>Every result moves<br/><strong>the system forward.</strong></h2><p>Simple conversion rules make the progression easy to understand and rewarding to follow.</p></div><div className="flow-cards">{milestones.map(([a,b,d],i)=><motion.article key={a} whileHover={{y:-10,scale:1.015}}><span>0{i+1}</span><div className={"flow-badge "+a.toLowerCase()}>{a[0]}</div><h3>{a}</h3><b>{b}</b><p>{d}</p></motion.article>)}</div></section>
    <section className="recognition-big-announcement"><div className="announcement-rays"/><span className="index light">OFFICIAL ARVEXA ANNOUNCEMENT</span><div className="announcement-layout"><div><h2>10 <em>GOLD</em><br/>changes the hiring path.</h2><p>Anyone who reaches a total of <strong>10 Gold badges</strong> earns the ARVEXA Direct Interview privilege for eligible hiring opportunities, subject to role availability and published hiring terms.</p><button className="primary" onClick={()=>onRoute("signup")}>Create your participant account <ArrowRight/></button></div><div className="ten-gold-visual"><div className="gold-ring">{Array.from({length:10},(_,i)=><i key={i} style={{"--i":i}}><Trophy size={15}/></i>)}<strong>10×<small>GOLD</small></strong></div><span>DIRECT<br/>INTERVIEW</span></div></div></section>
    <section className="recognition-gallery"><div><span className="index">RECOGNITION, VISUALISED</span><h2>A system designed<br/><strong>to be remembered.</strong></h2><p>Badges, milestones and verification sit together in one polished participant record.</p></div><div className="recognition-gallery-images"><img src={BADGE_IMAGES.gold} alt="Gold recognition medal"/><img src={BADGE_IMAGES.silver} alt="Silver recognition medal"/><img src={BADGE_IMAGES.bronze} alt="Bronze recognition medal"/></div></section>
  </main>
}

function InfoPage({type,onRoute}){const data={journey:{ey:"05 — JOURNEY",title:"From curiosity to a record.",lead:"A simple path from first visit to verified achievement, designed to keep the participant focused.",blocks:[["01","Discover","Explore the three arenas, read the rules and choose where your strongest work belongs."],["02","Register","Create your participant identity, select arenas, add team members where required and complete payment proof."],["03","Compete","Show your thinking through the challenge format. Every arena rewards a different kind of ability."],["04","Verify","Your submission and payment move through the controlled verification flow before the final participant record is confirmed."]]},faq:{ey:"07 — FAQ",title:"Questions, without the wall.",lead:"The essentials around ARVEXA 2026, registration, badges and the competition flow.",blocks:[["01","Who can participate?","Students, freshers, self-taught builders, working professionals and curious problem solvers can participate subject to the published event rules."],["02","How many challenges can I select?","Registration supports one or more arenas. Team limits are enforced independently for each selected arena."],["03","What is the event time?","The competition is scheduled for 13 September 2026 at 3:15 PM IST."],["04","How does the badge system work?","4 Bronze badges convert to 1 Silver; 3 Silver convert to 1 Gold. Reaching 10 Gold unlocks the Direct Interview privilege for eligible hiring opportunities."],["05","Is the event online?","Yes. ARVEXA Season 01 is designed as an online digital challenge."]]},about:{ey:"08 — ABOUT ARVEXA",title:"A competition built around proof.",lead:"ARVEXA is a national digital challenge concept by QuadraFroyn Solutions, created to make useful ability easier to demonstrate.",blocks:[["Purpose","Why it exists","Not every capable person has the same path to prove what they can do. ARVEXA creates structured arenas where reasoning, design, innovation and communication can become visible evidence."],["Philosophy","What we value","Clarity over noise. Originality over imitation. Evidence over empty claims. We want the work and the thinking behind it to be easy to understand."],["Platform","What participants get","A focused competition journey, participant dashboard, verification flow, recognition ladder and a credential path designed around professional presentation."]]},security:{ey:"09 — SECURITY & DATA",title:"Trust is part of the product.",lead:"The platform is structured around authenticated participant access, controlled verification and deliberate handling of competition evidence.",blocks:[["Authentication","Protected participant sessions","Account access is handled through Supabase Auth. Participant and administrative experiences are separated by authenticated role checks."],["Verification","Controlled approval","Payment evidence enters a pending state and can only be approved, rejected or revoked by an authorized admin workflow."],["Data","Purposeful collection","Registration fields are collected to operate the competition, teams, certificates and verification workflow."] ]}}[type]||null;return <main className="page info-page"><section className="page-hero info-hero"><span className="index">{data.ey}</span><h1>{data.title}</h1><p>{data.lead}</p></section><section className="info-grid">{data.blocks.map((b,i)=><motion.article key={i} initial={{opacity:0,y:25}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.06}}><span>{b[0]}</span><h2>{b[1]}</h2><p>{b[2]}</p><ArrowRight/></motion.article>)}</section><section className="info-end"><span className="index">ARVEXA 2026</span><h2>Make your ability<br/><strong>easy to see.</strong></h2><button className="primary" onClick={()=>onRoute("register")}>Enter the competition <ArrowRight/></button></section></main>}

function Footer({onRoute}){return <footer className="site-footer"><div className="footer-glow"/><div className="footer-wrap"><div className="footer-top"><div className="footer-brand"><span className="footer-logo"><img src="/assets/arvexa-logo.svg" alt="ARVEXA logo"/></span><b>ARVEXA 2026</b><p>National digital challenge by <a href={COMPANY_URL} target="_blank" rel="noreferrer">QuadraFroyn Solutions</a>.</p><span className="footer-tag">SOLVE · COMPETE · PROVE</span></div><div><b>EVENT</b><span>13 September 2026</span><span>3:15 PM onwards</span><span>IST · Online challenge</span></div><div><b>EXPLORE</b><button onClick={()=>onRoute("challenges")}>Challenges</button><button onClick={()=>onRoute("recognition")}>Recognition</button><button onClick={()=>onRoute("home")}>Home</button><button onClick={()=>onRoute("journey")}>Journey</button><button onClick={()=>onRoute("faq")}>FAQ</button></div><div><b>PARTICIPANT</b><button onClick={()=>onRoute("dashboard")}>Dashboard</button><button onClick={()=>onRoute("login")}>Login</button><button onClick={()=>onRoute("signup")}>Sign up</button><button onClick={()=>onRoute("about")}>About ARVEXA</button><button onClick={()=>onRoute("security")}>Security</button></div></div><div className="footer-marquee" aria-label="ARVEXA"><span> A  R  V  E  X  A  </span></div><div className="footer-bottom"><span>© 2026 QuadraFroyn Solutions</span><span>ARVEXA / 26</span><span>13 SEP · 3:15 PM · IST</span></div></div></footer>}

const PATH_TO_ROUTE={
  "/":"home","/home":"home","/challenges":"challenges","/recognition":"recognition","/journey":"journey","/faq":"faq","/about":"about","/security":"security",
  "/login":"login","/signup":"signup","/forgot":"forgot","/register":"register","/dashboard":"dashboard","/admin":"admin",
  "/challenge/aptiq":"challenge-aptiq","/challenge/webphobia":"challenge-webphobia","/challenge/problem":"challenge-problem"
};
const ROUTE_TO_PATH=Object.fromEntries(Object.entries(PATH_TO_ROUTE).map(([p,r])=>[r,p]));
function routeFromLocation(){
  const p=window.location.pathname.replace(/\/+$/,"")||"/";
  return PATH_TO_ROUTE[p]||"home";
}
function App(){
  const [route,setRoute]=useState(routeFromLocation());
  const [focus,setFocus]=useState(null);
  const [session,setSession]=useState(null);
  const [afterAuth,setAfterAuth]=useState(null);
  const [profile,setProfile]=useState(null);
  const [boot,setBoot]=useState(false);

  const go=(nextRoute,nextFocus=null)=>{
    let target=nextRoute;
    if(nextRoute==="auth")target=session?"dashboard":"login";
    if(nextRoute==="register"&&!session){setAfterAuth({route:"register",focus:nextFocus});target="login";}
    const path=ROUTE_TO_PATH[target]||"/";
    const shouldReplace=window.location.pathname!==path;
    if(shouldReplace)window.history.pushState({route:target,focus:nextFocus}, "", path);
    setRoute(target);setFocus(nextFocus);
    window.scrollTo({top:0,behavior:"smooth"});
  };

  useEffect(()=>{
    const onPop=()=>{setRoute(routeFromLocation());setFocus(null);window.scrollTo(0,0)};
    window.addEventListener("popstate",onPop);
    return()=>window.removeEventListener("popstate",onPop);
  },[]);

  useEffect(()=>{
    let alive=true;
    const init=async()=>{
      const {data}=await supabase.auth.getSession();
      if(!alive)return;
      setSession(data.session);
      if(data.session){
        const {data:p}=await supabase.from("profiles").select("*").eq("id",data.session.user.id).single();
        if(alive)setProfile(p);
      }
      setTimeout(()=>alive&&setBoot(true),500);
    };
    init();
    const {data:l}=supabase.auth.onAuthStateChange(async(_event,sess)=>{
      setSession(sess);
      if(sess){
        const {data:p}=await supabase.from("profiles").select("*").eq("id",sess.user.id).single();
        if(alive)setProfile(p);
      }else setProfile(null);
    });
    return()=>{alive=false;l?.subscription?.unsubscribe?.()};
  },[]);

  useEffect(()=>{
    if(!boot)return;
    if(route==="register"&&!session){go("login");return}
    if((route==="dashboard"||route==="admin")&&!session){go("login");return}
    if(route==="admin"&&session&&profile&&profile.role!=="admin"){
      window.history.replaceState({}, "", "/dashboard");setRoute("dashboard");
    }
  },[route,session,profile,boot]);

  const authRoute=["login","signup","forgot"].includes(route);
  const noNav=["login","signup","forgot","register"].includes(route);
  return <><Loader done={boot}/>{boot&&<>
    {!noNav&&<Nav user={session?.user} profile={profile} onRoute={go}/>}
    {route==="home"&&<Home onRoute={go}/>}
    {route==="challenges"&&<Challenges onRoute={go} focus={focus}/>}
    {route==="challenge-aptiq"&&<ChallengeDetail challengeId="aptiq" onRoute={go}/>}
    {route==="challenge-webphobia"&&<ChallengeDetail challengeId="webphobia" onRoute={go}/>}
    {route==="challenge-problem"&&<ChallengeDetail challengeId="problem" onRoute={go}/>}
    {route==="recognition"&&<Recognition onRoute={go}/>}
    {route==="journey"&&<InfoPage type="journey" onRoute={go}/>}
    {route==="faq"&&<InfoPage type="faq" onRoute={go}/>}
    {route==="about"&&<InfoPage type="about" onRoute={go}/>}
    {route==="security"&&<InfoPage type="security" onRoute={go}/>}
    {authRoute&&<Auth mode={route} onAuth={()=>{const next=afterAuth;setAfterAuth(null);go(next?.route||"dashboard",next?.focus||null)}} onRoute={go}/>}
    {route==="register"&&session&&<Register user={session.user} initialChallenge={focus} onRoute={go} onSaved={()=>go("dashboard")}/>}
    {route==="dashboard"&&session&&<Dashboard user={session.user} profile={profile} onRoute={go}/>}
    {route==="admin"&&session&&profile?.role==="admin"&&<Admin onRoute={go}/>}
    {!noNav&&<Footer onRoute={go}/>}
  </>}</>;
}
createRoot(document.getElementById("root")).render(<App/>);
