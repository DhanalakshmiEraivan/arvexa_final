import React, {useEffect, useRef, useState} from "react";
import "./landing.css";
import {motion, AnimatePresence} from "framer-motion";
import {
  ArrowRight, BrainCircuit, Code2, Lightbulb
} from "lucide-react";

const ARENAS = [
  {
    id:"aptiq", number:"01", kicker:"01 / COGNITION", title:"AI + Logic",
    subtitle:"AI Quiz + Logical Reasoning",
    description:"Patterns, deduction and AI awareness. Clear reasoning beats memorised answers.",
    tags:["AI","Logic","Patterns","Critical thinking"], icon:BrainCircuit, image:"https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1000&q=85"
  },
  {
    id:"webphobia", number:"02", kicker:"02 / CRAFT", title:"Web Design",
    subtitle:"Website Designing Challenge",
    description:"Build an interface with hierarchy, spacing, typography and motion that feels intentional.",
    tags:["UI","Layout","Type","Interaction"], icon:Code2, image:"https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1000&q=85"
  },
  {
    id:"problem", number:"03", kicker:"03 / SOLVER", title:"Problem Solver",
    subtitle:"Innovation & Prototype Challenge",
    description:"Break difficult problems into smaller ones and find the cleanest route to a solution.",
    tags:["Algorithms","Decomposition","Efficiency","Reasoning"], icon:Lightbulb, image:"https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&w=1000&q=85"
  }
];

const THEMES = [
  "Education & Employability","Public Services & Civic Life",
  "Health & Wellbeing","Environment & Sustainability","Small Business & Local Commerce"
];

const FAQ = [
  ["Who can participate?","Students, freshers, self-taught builders, working professionals and curious problem solvers."],
  ["What does ₹50 include?","Access to the Season 01 challenge structure, three arenas, leaderboard participation and the applicable digital credential."],
  ["How does verification work?","The credential concept uses a unique ID and QR route connected to a public verification experience."],
  ["Is everything online?","Yes. Season 01 is designed as a 100% online digital challenge."],
  ["Do I need to enter every season?","No. Each season can stand on its own."]
];

function useReducedMotion(){
  const [reduced,setReduced]=useState(false);
  useEffect(()=>{
    const mq=window.matchMedia("(prefers-reduced-motion: reduce)");
    const update=()=>setReduced(mq.matches); update();
    mq.addEventListener?.("change",update);
    return()=>mq.removeEventListener?.("change",update);
  },[]);
  return reduced;
}

function useScrollProgress(){
  const [progress,setProgress]=useState(0);
  useEffect(()=>{
    const onScroll=()=>{
      const max=document.documentElement.scrollHeight-window.innerHeight;
      setProgress(max>0 ? Math.min(100,window.scrollY/max*100) : 0);
    };
    onScroll(); window.addEventListener("scroll",onScroll,{passive:true});
    return()=>window.removeEventListener("scroll",onScroll);
  },[]);
  return progress;
}

function Stars(){
  const canvas=useRef(null);
  const reduced=useReducedMotion();
  useEffect(()=>{
    const el=canvas.current, ctx=el?.getContext("2d");
    if(!el||!ctx) return;
    let raf, w=0,h=0,pts=[];
    const resize=()=>{
      w=window.innerWidth; h=window.innerHeight;
      const d=Math.min(window.devicePixelRatio||1,2);
      el.width=w*d; el.height=h*d; el.style.width=w+"px"; el.style.height=h+"px";
      ctx.setTransform(d,0,0,d,0,0);
      pts=Array.from({length:Math.min(120,Math.floor(w/10))},()=>({
        x:Math.random()*w,y:Math.random()*h,r:Math.random()*1.4+.25,
        v:Math.random()*.2+.03,a:Math.random()*.45+.08
      }));
    };
    const draw=()=>{
      ctx.clearRect(0,0,w,h);
      for(const p of pts){
        p.y+=p.v;if(p.y>h+4)p.y=-4;
        ctx.fillStyle=`rgba(192,164,255,${p.a})`;
        ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill();
      }
      if(!reduced) raf=requestAnimationFrame(draw);
    };
    resize(); draw();
    window.addEventListener("resize",resize);
    return()=>{cancelAnimationFrame(raf);window.removeEventListener("resize",resize)};
  },[reduced]);
  return <canvas className="lh-stars" ref={canvas} aria-hidden="true"/>;
}

function Reveal({children,delay=0,className=""}){
  return <motion.div className={className}
    initial={{opacity:0,y:34}} whileInView={{opacity:1,y:0}}
    viewport={{once:true,amount:.1}} transition={{duration:.85,delay,ease:[.16,1,.3,1]}}>
    {children}
  </motion.div>;
}

function Counter({to,label}){
  const [value,setValue]=useState(0);
  const ref=useRef(null);
  useEffect(()=>{
    const node=ref.current;if(!node)return;
    let started=false, frame;
    const run=()=>{
      if(started)return;started=true;
      const start=performance.now(), duration=1100;
      const tick=now=>{
        const p=Math.min(1,(now-start)/duration);
        setValue(Math.round(to*(1-Math.pow(1-p,3))));
        if(p<1) frame=requestAnimationFrame(tick);
      };
      frame=requestAnimationFrame(tick);
    };
    const io=new IntersectionObserver(e=>{if(e[0].isIntersecting){run();io.disconnect()}},{threshold:.4});
    io.observe(node);return()=>{io.disconnect();cancelAnimationFrame(frame)};
  },[to]);
  return <div className="lh-metric" ref={ref}><strong>{value}</strong><span>{label}</span></div>;
}

function MagneticButton({children,onClick,className=""}){
  const [offset,setOffset]=useState({x:0,y:0});
  const reduced=useReducedMotion();
  return <motion.button className={className} onClick={onClick}
    animate={reduced?{}:{x:offset.x,y:offset.y}} whileTap={{scale:.97}}
    onPointerMove={e=>{
      if(reduced)return;
      const r=e.currentTarget.getBoundingClientRect();
      setOffset({x:(e.clientX-r.left-r.width/2)*.12,y:(e.clientY-r.top-r.height/2)*.12});
    }}
    onPointerLeave={()=>setOffset({x:0,y:0})}>{children}</motion.button>;
}

function ArenaVisual({index}){
  const Icon=ARENAS[index].icon;
  return <div className="lh-arena-visual">
    <img src={ARENAS[index].image} alt="" loading="lazy"/>
    <div className="lh-arena-photo-overlay"/>
    <span className="lh-arena-number">0{index+1}</span>
    <div className="lh-arena-grid"/>
    <div className="lh-orbit o1"/><div className="lh-orbit o2"/><div className="lh-orbit o3"/>
    <div className="lh-arena-core"><Icon size={38}/></div>
    <span className="lh-arena-signal">{ARENAS[index].id.toUpperCase()} / SIGNAL</span>
  </div>;
}

function CursorNetwork(){
  const canvas=useRef(null);
  const pointer=useRef({x:-9999,y:-9999});
  const reduced=useReducedMotion();
  useEffect(()=>{
    const el=canvas.current,ctx=el?.getContext("2d");
    if(!el||!ctx)return;
    let raf=0,w=0,h=0,nodes=[];
    const resize=()=>{
      w=window.innerWidth;h=window.innerHeight;
      const d=Math.min(window.devicePixelRatio||1,2);
      el.width=w*d;el.height=h*d;el.style.width=w+"px";el.style.height=h+"px";
      ctx.setTransform(d,0,0,d,0,0);
      const count=Math.min(52,Math.max(26,Math.floor(w/30)));
      nodes=Array.from({length:count},()=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.2,vy:(Math.random()-.5)*.2}));
    };
    const move=e=>{pointer.current={x:e.clientX,y:e.clientY}};
    const draw=()=>{
      ctx.clearRect(0,0,w,h);
      if(pointer.current.x>-9000){
        const g=ctx.createRadialGradient(pointer.current.x,pointer.current.y,0,pointer.current.x,pointer.current.y,230);
        g.addColorStop(0,"rgba(190,160,255,.14)");g.addColorStop(.35,"rgba(139,92,246,.055)");g.addColorStop(1,"rgba(139,92,246,0)");
        ctx.fillStyle=g;ctx.fillRect(pointer.current.x-230,pointer.current.y-230,460,460);
      }
      for(const p of nodes){p.x+=p.vx;p.y+=p.vy;if(p.x<-20)p.x=w+20;if(p.x>w+20)p.x=-20;if(p.y<-20)p.y=h+20;if(p.y>h+20)p.y=-20;}
      for(let i=0;i<nodes.length;i++){
        const a=nodes[i];
        for(let j=i+1;j<nodes.length;j++){
          const b=nodes[j],dx=a.x-b.x,dy=a.y-b.y,d=Math.hypot(dx,dy);
          if(d<155){ctx.strokeStyle=`rgba(167,139,250,${Math.max(0,.12*(1-d/155))})`;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}
        }
        const pd=Math.hypot(a.x-pointer.current.x,a.y-pointer.current.y);
        if(pd<200){ctx.strokeStyle=`rgba(226,214,255,${Math.max(0,.38*(1-pd/200))})`;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(pointer.current.x,pointer.current.y);ctx.stroke();}
        ctx.fillStyle="rgba(210,194,255,.55)";ctx.beginPath();ctx.arc(a.x,a.y,1.35,0,Math.PI*2);ctx.fill();
      }
      if(!reduced)raf=requestAnimationFrame(draw);
    };
    resize();draw();window.addEventListener("resize",resize);window.addEventListener("pointermove",move,{passive:true});
    return()=>{cancelAnimationFrame(raf);window.removeEventListener("resize",resize);window.removeEventListener("pointermove",move)};
  },[reduced]);
  return <canvas ref={canvas} className="lh-cursor-network" aria-hidden="true"/>;
}

export default function Home({onRoute}){
  const reduced=useReducedMotion();
  const progress=useScrollProgress();
  const [mobile,setMobile]=useState(false);
  const [arena,setArena]=useState(0);
  const [faqOpen,setFaqOpen]=useState(0);
  const [toast,setToast]=useState("");
  const [modal,setModal]=useState(false);
  const [email,setEmail]=useState("");
  const [header,setHeader]=useState(false);

  useEffect(()=>{
    const root=document.querySelector(".hero-clock");
    if(!root)return;
    const target=new Date(root.dataset.event).getTime();
    const els={
      d:root.querySelector(".hc-days"),h:root.querySelector(".hc-hours"),
      m:root.querySelector(".hc-minutes"),s:root.querySelector(".hc-seconds")
    };
    const tick=()=>{
      let diff=Math.max(0,target-Date.now());
      const d=Math.floor(diff/86400000); diff%=86400000;
      const h=Math.floor(diff/3600000); diff%=3600000;
      const m=Math.floor(diff/60000); diff%=60000;
      const s=Math.floor(diff/1000);
      els.d.textContent=String(d).padStart(2,"0"); els.h.textContent=String(h).padStart(2,"0");
      els.m.textContent=String(m).padStart(2,"0"); els.s.textContent=String(s).padStart(2,"0");
    };
    tick(); const id=setInterval(tick,1000); return()=>clearInterval(id);
  },[]);

  useEffect(()=>{
    const onScroll=()=>setHeader(window.scrollY>20);
    onScroll();window.addEventListener("scroll",onScroll,{passive:true});
    return()=>window.removeEventListener("scroll",onScroll);
  },[]);

  const scrollTo=id=>{
    document.getElementById(id)?.scrollIntoView({behavior:reduced?"auto":"smooth"});
    setMobile(false);
  };
  const register=()=>onRoute("register");

  return <main className="lh-home">
    <div className="lh-progress" style={{width:`${progress}%`}}/>
    <div className="lh-noise" aria-hidden="true"/>



    <section className="lh-hero" id="lh-top">
      <Stars/><CursorNetwork/><div className="lh-grid"/><div className="lh-glow"/>
      <div className="lh-smoke lh-smoke-left"/><div className="lh-smoke lh-smoke-right"/>
      <div className="lh-hero-inner">
        <Reveal><div className="lh-pill"><span className="lh-dot"/> Season 01 · September 2026 · 100% Online</div></Reveal>
        <Reveal delay={.08}><h1>ARVE<em>X</em>A</h1></Reveal>
        <Reveal delay={.15}><div className="lh-tagline">Think sharper. <span>Build better.</span></div></Reveal>
        <Reveal delay={.22}><p>A focused national digital challenge for people who enjoy difficult problems, clean ideas and work worth showing.</p></Reveal>
        <Reveal delay={.23}><div className="lh-hero-countdown">
          <div className="countdown-caption"><span className="lh-dot"/> COMPETITION STARTS · 13 SEPTEMBER 2026 </div>
          <div className="hero-clock" data-event="2026-09-13T15:15:00+05:30">
            <div><strong className="hc-days">00</strong><span>DAYS</span></div>
            <i>:</i><div><strong className="hc-hours">00</strong><span>HOURS</span></div>
            <i>:</i><div><strong className="hc-minutes">00</strong><span>MINUTES</span></div>
            <i>:</i><div><strong className="hc-seconds">00</strong><span>SECONDS</span></div>
          </div>
        </div></Reveal>
        <Reveal delay={.29}><div className="lh-actions">
          <MagneticButton className="lh-btn lh-violet" onClick={register}>Secure your spot · ₹50 ↗</MagneticButton>
          <MagneticButton className="lh-btn lh-ghost" onClick={()=>scrollTo("lh-arenas")}>Explore the arenas ↓</MagneticButton>
        </div></Reveal>
        <Reveal delay={.36}><div className="lh-meta">
          <span><b>03</b> arenas</span><span><b>01</b> leaderboard</span>
          <span><b>QR</b> credential</span><span><b>01</b> season</span>
        </div></Reveal>
      </div>
      <div className="lh-scroll">Scroll to enter <i/></div>
    </section>

    <div className="lh-ticker"><div>{Array.from({length:2},(_,j)=><div className="lh-ticker-track" key={j}>
      {["ARVEXA 2026","AI + Logic","Web Design","Problem Solving","QR Credential","National Leaderboard","₹50 Entry"].map((x,i)=>
        <span key={i}><b>{x}</b><i/></span>)}
    </div>)}</div></div>

    <div className="lh-ticker" aria-label="ARVEXA highlights"><div className="lh-ticker-track">{Array.from({length:2}).flatMap((_,r)=>["13 SEP · 3:15 PM IST","₹50 ENTRY","03 ARENAS","AI + LOGIC","WEB DESIGN","INNOVATION + PROTOTYPE","4 BRONZE → 1 SILVER","3 SILVER → 1 GOLD","10 GOLD → DIRECT INTERVIEW"].map((x,i)=><span key={r+"-"+i}><b>✦</b>{x}</span>))}</div></div>

    <section className="lh-section" id="lh-arenas">
      <div className="lh-wrap">
        <div className="lh-head"><div><div className="lh-kicker">01 · The arenas</div><h2>Three ways to <em>think.</em></h2></div>
          <p>One entry opens the complete challenge. Your performance across every arena builds your final standing.</p></div>
        <div className="lh-arena-cards">
          {ARENAS.map((a,i)=><Reveal key={a.id} delay={i*.08} className="lh-arena-card">
            <ArenaVisual index={i}/><div className="lh-arena-body"><span className="lh-arena-no">{a.kicker}</span>
              <h3>{a.title}</h3><b className="lh-arena-subtitle">{a.subtitle}</b><p>{a.description}</p><div className="lh-tags">{a.tags.map(t=><span key={t}>{t}</span>)}</div>
              <button className="lh-text-button" onClick={()=>onRoute("challenges",a.id)}>Open arena <ArrowRight size={15}/></button>
            </div>
          </Reveal>)}
        </div>
      </div>
    </section>


    <section className="lh-section lh-credential" id="lh-credential">
      <div className="lh-wrap"><div className="lh-head"><div><div className="lh-kicker dark">02 · The credential</div><h2>Proof that can be <em>checked.</em></h2></div>
        <p>A polished digital credential with a unique ID and QR verification path. Show the result, not just participation.</p></div>
        <div className="lh-credential-grid">
          <Reveal><div className="lh-cert-stage"><div className="lh-cert"><div className="lh-cert-inner">
            <div className="lh-seal">QF</div><small>QuadraFroyn Solutions</small><h3>Certificate of Achievement</h3>
            <small>National Digital Challenge · Season 01 · 2026</small><div className="lh-name">Your Name</div><p>Achievement tier · National Digital Challenge</p>
            <div className="lh-cert-bottom"><div><b>ISSUED</b><span>September 2026</span></div><div><b>ID</b><span>QFS-DC26-000001</span></div><div><div className="lh-qr"/></div></div>
          </div></div></div></Reveal>
          <Reveal delay={.12}><div className="lh-features">{[
            ["Unique ID","One credential ID per result. Easy to share and reference."],
            ["QR verification","A scan can lead to a public verification experience."],
            ["Tiered result","Your achievement level is visible and easy to understand."],
            ["Portfolio ready","Made for resumes, portfolios and professional profiles."]
          ].map(([a,b])=><div className="lh-feature" key={a}><b>{a}</b><p>{b}</p></div>)}</div>
            <button className="lh-btn lh-violet lh-verify" onClick={()=>setModal(true)}>Preview verification →</button>
          </Reveal>
        </div>
      </div>
    </section>

    <section className="lh-section lh-rewards" id="lh-rewards">
      <div className="lh-wrap"><div className="lh-head"><div><div className="lh-kicker">03 · Rewards</div><h2>Recognition that <em>stays.</em></h2></div>
        <p>The strongest reward is a result worth showing — with recognition that continues after the challenge.</p></div>
        <div className="lh-reward-grid">{[
          ["01","Champion","Trophy, champion credential, Hall of Fame and winner spotlight.","https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=900&q=80"],
          ["02","Runner-Up","Excellence credential, badge, Hall of Fame listing and spotlight.","https://images.unsplash.com/photo-1518544801976-3e159e50e5bb?auto=format&fit=crop&w=900&q=80"],
          ["03","Top 10","Certificate of Excellence, digital badge and permanent listing.","https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=80"],
          ["04","Top 25%","Certificate of Achievement with a permanent credential ID.","https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=900&q=80"],
          ["05","Every finisher","Certificate of Participation and a recorded competition finish.","https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80"]
        ].map(([n,t,d,img],i)=><Reveal key={n} delay={i*.07} className="lh-reward"><div className="lh-reward-image"><img src={img} alt="ARVEXA recognition"/></div><span>{n}</span><h3>{t}</h3><p>{d}</p><div className="lh-reward-glint"/></Reveal>)}</div>
        <Reveal className="lh-spotlight"><div><h3>The Champion's Challenge</h3><p>The next champion can help shape a future signature problem.</p></div><span>Legacy mode ↗</span></Reveal>
      </div>
    </section>

    <section className="lh-section" id="lh-seasons">
      <div className="lh-wrap"><div className="lh-head"><div><div className="lh-kicker">04 · Road ahead</div><h2>One season now. <em>More ahead.</em></h2></div>
        <p>Each season stands alone while strong performers can progress toward the annual championship.</p></div>
        <div className="lh-timeline">{[
          ["S1","AI & Technology","September 2026 · all three arenas.","Opening"],
          ["S2","Coding & Web","October 2026 · sharper build briefs.","Queued"],
          ["S3","AI & Innovation","November 2026 · applied thinking.","Queued"],
          ["S4","Cyber & Technology","December 2026 · digital awareness.","Queued"],
          ["GC","Grand Championship","2027 · top performers return.","Final"]
        ].map(([n,t,d,s],i)=><Reveal key={n} delay={i*.05} className="lh-season"><span>{n}</span><div><h3>{t}</h3><p>{d}</p></div><b className={i===0?"open":""}>{s}</b></Reveal>)}</div>
      </div>
    </section>

    <section className="lh-section lh-register" id="register">
      <div className="lh-wrap lh-register-box"><div className="lh-kicker centered">05 · Entry</div>
        <div className="lh-price"><small>₹</small>50</div><h3>Small entry. Serious challenge.</h3><p>One fee. Three arenas. One leaderboard. One credential path.</p>
        <form onSubmit={e=>{e.preventDefault();if(!e.currentTarget.checkValidity()){e.currentTarget.reportValidity();return}setEmail("");setToast("You're on the ARVEXA launch list · Season 01");}} className="lh-form">
          <input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="Your email address" required/>
          <button className="lh-btn lh-violet" type="submit">Get launch access →</button>
        </form><div className="lh-note">No spam · launch updates only · Season 01</div>
      </div>
    </section>

    <section className="lh-section lh-faq" id="lh-faq">
      <div className="lh-wrap"><div className="lh-head"><div><div className="lh-kicker">06 · FAQ</div><h2>Keep it <em>simple.</em></h2></div><p>The essentials, without a wall of text.</p></div>
        <div className="lh-faq-list">{FAQ.map(([q,a],i)=><div key={q} className="lh-faq-item">
          <button onClick={()=>setFaqOpen(faqOpen===i?-1:i)}><span>{q}</span><b className={faqOpen===i?"rot":""}>+</b></button>
          <AnimatePresence initial={false}>{faqOpen===i&&<motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}}><p>{a}</p></motion.div>}</AnimatePresence>
        </div>)}</div>
      </div>
    </section>

    <section className="lh-final-cta"><div className="lh-final-grid"/><div className="lh-final-glow"/>
      <Reveal><div className="lh-pill"><span className="lh-dot"/> ARVEXA 2026 · QuadraFroyn Solutions</div>
        <h2>Ready to put your <em>skills</em> on the line?</h2>
        <MagneticButton className="lh-btn lh-violet" onClick={register}>Enter Season 01 — ₹50 ↗</MagneticButton>
      </Reveal>
    </section>


    {toast&&<div className="lh-toast show" role="status">{toast}<button onClick={()=>setToast("")}>×</button></div>}
    {modal&&<div className="lh-modal" onMouseDown={e=>e.target===e.currentTarget&&setModal(false)}>
      <div className="lh-modal-card"><div className="lh-verify-head"><div>✓</div><section><h3>Credential verified</h3><p>Demo registry match completed.</p></section></div>
        <div className="lh-verify-rows">{[
          ["Participant","Your Name"],["Competition","ARVEXA 2026"],["Achievement","National Digital Challenge"],["Credential ID","QFS-DC26-000001"],["Issued","September 2026"]
        ].map(([a,b])=><div key={a}><span>{a}</span><b>{b}</b></div>)}</div>
        <div className="lh-modal-actions"><button className="lh-btn lh-ghost" onClick={()=>setModal(false)}>Close</button><button className="lh-btn lh-violet" onClick={()=>setToast("Credential checked successfully.")}>Verify again</button></div>
      </div>
    </div>}
  </main>;
}
