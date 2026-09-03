import React,{useEffect,useMemo} from "react";
import {motion} from "framer-motion";
import {ArrowLeft,ArrowRight,BrainCircuit,Code2,Lightbulb,CheckCircle2,Users,Target,Sparkles,ShieldCheck,Clock3,Trophy} from "lucide-react";
import "./challenge-detail.css";

const DATA={
 aptiq:{
  title:"APTIQ",eyebrow:"01 / COGNITION ARENA",subtitle:"AI Quiz + Logical Reasoning",
  desc:"A focused arena for AI awareness, analytical thinking, pattern recognition, deduction and disciplined decision-making.",
  team:"Individual",format:"AI quiz + logical reasoning",theme:"Intelligence · Logic · Decision Making",
  icon:BrainCircuit,image:"https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=85",
  problemId:"ARV-APTIQ-01",
  problem:"Modern technology rewards people who can reason clearly, evaluate information and make decisions under uncertainty. APTIQ turns those abilities into a focused competitive experience.",
  tasks:["AI awareness and conceptual understanding","Logical reasoning, patterns and deduction","Aptitude-style decision making and analytical thinking","Clear, consistent problem solving"],
  rules:["Individual participation only.","Answer independently and follow the competition instructions.","Do not share answers or use prohibited assistance.","Evaluation is based on accuracy and the published competition rules."],
  judging:["Conceptual accuracy","Logical consistency","Analytical reasoning","Overall performance"],
  deliverable:"Complete the assigned AI and logical-reasoning assessment through the official competition interface."
 },
 webphobia:{
  title:"WebPhobia",eyebrow:"02 / CRAFT ARENA",subtitle:"Website Designing Challenge",
  desc:"Transform a creative brief into a polished, usable and technically convincing digital experience.",
  team:"1–2 members",format:"Website design + implementation",theme:"Interface · Creativity · Usability",
  icon:Code2,image:"https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=1600&q=85",
  problemId:"ARV-WEB-02",
  problem:"The web is crowded with interfaces that work but do not communicate. WebPhobia asks teams to create a purposeful experience where hierarchy, interaction, accessibility and visual craft work together.",
  tasks:["Interpret the announced design brief","Create a coherent visual system","Build a functional responsive experience","Explain design decisions and implementation choices"],
  rules:["Teams may contain one or two members.","Use original work or clearly permitted assets.","The final submission must be usable and demonstrable.","Respect the announced submission format and evaluation instructions."],
  judging:["Visual hierarchy and craft","Usability and responsiveness","Creativity and originality","Implementation quality","Presentation"],
  deliverable:"A working website and the supporting presentation/evidence requested in the official brief."
 },
 problem:{
  title:"Problem to Solution",eyebrow:"03 / SOLVER ARENA",subtitle:"Innovation & Prototype Challenge",
  desc:"Turn a real-world problem into a defensible idea, prototype, architecture and solution story.",
  team:"Up to 4 members",format:"Idea presentation + prototype",theme:"Impact · Innovation · Feasibility",
  icon:Lightbulb,image:"https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=85",
  problemId:"ARV-PTS-03",
  problem:"Important problems rarely arrive with clean specifications. This arena rewards teams that can understand a real need, define the problem precisely and translate an idea into something people can evaluate.",
  tasks:["Choose exactly one announced theme","Define users, pain points and measurable impact","Prepare the Round 1 idea presentation","Shortlisted teams develop prototype, architecture and solution evidence"],
  rules:["Teams may contain up to four members.","Select exactly one theme for Round 1.","Only shortlisted teams proceed to the final round.","Your solution should be practical, explainable and supported by evidence."],
  judging:["Problem clarity","Originality and insight","Feasibility","Technical architecture","Prototype quality","Impact and communication"],
  deliverable:"Round 1 presentation followed, for shortlisted teams, by a prototype, architecture and complete solution explanation."
 }
};

function Reveal({children,delay=0,className=""}){return <motion.div className={className} initial={{opacity:0,y:28}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.12}} transition={{duration:.75,delay,ease:[.16,1,.3,1]}}>{children}</motion.div>}

export default function ChallengeDetail({challengeId,onRoute}){
 const c=DATA[challengeId]||DATA.aptiq; const Icon=c.icon;
 useEffect(()=>window.scrollTo({top:0,behavior:"auto"}),[challengeId]);
 const navItems=useMemo(()=>["About","Format","Rules","Evaluation","Submission"],[]);
 return <main className="cd-page">
  <div className="cd-noise"/><div className="cd-progress"/>
  <section className="cd-hero">
   <img className="cd-hero-image" src={c.image} alt=""/>
   <div className="cd-hero-overlay"/>
   <div className="cd-hero-grid"/>
   <div className="cd-hero-content">
    <button className="cd-back" onClick={()=>onRoute("challenges")}><ArrowLeft size={16}/> All challenges</button>
    <span className="cd-eyebrow">{c.eyebrow}</span>
    <div className="cd-icon"><Icon size={34}/></div>
    <h1>{c.title}</h1><h2>{c.subtitle}</h2><p>{c.desc}</p>
    <div className="cd-meta"><span><Users/> {c.team}</span><span><Target/> {c.theme}</span><span><Clock3/> Online arena</span></div>
    <button className="cd-primary" onClick={()=>onRoute("register",challengeId)}>Register for {c.title} <ArrowRight/></button>
   </div>
  </section>
  <nav className="cd-anchor">{navItems.map((x,i)=><a key={x} href={"#cd-"+i}>{String(i+1).padStart(2,"0")} {x}</a>)}</nav>
  <section className="cd-intro cd-wrap" id="cd-0">
   <Reveal><span className="cd-label">PROBLEM STATEMENT · {c.problemId}</span><h2>What this arena is <em>really testing.</em></h2><p>{c.problem}</p></Reveal>
   <div className="cd-stat-grid"><Reveal delay={.05}><b>{c.team}</b><span>TEAM SIZE</span></Reveal><Reveal delay={.1}><b>100%</b><span>ONLINE</span></Reveal><Reveal delay={.15}><b>01</b><span>ARENA</span></Reveal><Reveal delay={.2}><b>∞</b><span>CREATIVE SCOPE</span></Reveal></div>
  </section>
  <section className="cd-section cd-wrap" id="cd-1"><div className="cd-section-head"><span className="cd-label">01 · FORMAT</span><h2>From brief to <em>proof.</em></h2><p>{c.deliverable}</p></div><div className="cd-task-grid">{c.tasks.map((t,i)=><Reveal key={t} delay={i*.05}><article><span>0{i+1}</span><CheckCircle2/><h3>{t}</h3><p>Build this into your approach rather than treating it as an isolated checklist item.</p></article></Reveal>)}</div></section>
  <section className="cd-split cd-wrap"><div className="cd-image-card"><img src={c.image} alt="Challenge atmosphere"/><div><Sparkles/> ARVEXA · SEASON 01</div></div><div><span className="cd-label">THE CREATIVE BRIEF</span><h2>Make the <em>thinking visible.</em></h2><p>Strong entries do more than reach an answer. They make the path understandable: what was observed, what was chosen, what was rejected and why the final solution deserves attention.</p><div className="cd-callout"><ShieldCheck/><span>Professional standard<br/><b>Clarity · originality · evidence</b></span></div></div></section>
  <section className="cd-section cd-dark cd-wrap" id="cd-2"><div className="cd-section-head"><span className="cd-label">02 · RULES & REGULATIONS</span><h2>Fair play. <em>Clear rules.</em></h2></div><div className="cd-rule-grid">{c.rules.map((r,i)=><Reveal key={r}><div><span>{String(i+1).padStart(2,"0")}</span><p>{r}</p></div></Reveal>)}</div></section>
  <section className="cd-section cd-wrap" id="cd-3"><div className="cd-section-head"><span className="cd-label">03 · EVALUATION</span><h2>What makes an entry <em>stand out.</em></h2></div><div className="cd-judging">{c.judging.map((j,i)=><motion.div key={j} whileHover={{y:-8}}><span>0{i+1}</span><b>{j}</b><i style={{"--p":`${92-i*9}%`}}/></motion.div>)}</div></section>
  <section className="cd-section cd-wrap" id="cd-4"><div className="cd-submit-card"><div><span className="cd-label">04 · SUBMISSION</span><h2>Ready when your <em>proof is ready.</em></h2><p>{c.deliverable}</p></div><div className="cd-submit-side"><Trophy/><b>{c.format}</b><span>{c.team}</span><button className="cd-primary" onClick={()=>onRoute("register",challengeId)}>Enter this arena <ArrowRight/></button></div></div></section>
  <section className="cd-bottom"><span>ARVEXA 2026 · {c.title}</span><h2>Think sharper.<br/><em>Build better.</em></h2><button className="cd-back" onClick={()=>onRoute("challenges")}><ArrowLeft/> Explore all arenas</button></section>
 </main>
}
