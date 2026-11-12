import React, { useEffect, useLayoutEffect, useRef, useState, lazy, Suspense } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { useProgress } from '@react-three/drei'
gsap.registerPlugin(ScrollTrigger)
const Kitchen3D = lazy(() => import('./Kitchen3D.jsx'))
const A = (p) => `/assets/${p}.webp`
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

function Words({ text, as: Tag = 'h2', className = '' }) {
  return (
    <Tag className={`words ${className}`} aria-label={text}>
      {text.split(' ').map((w, i) => (
        <span className="w" aria-hidden key={i}><span className="wi">{w}&nbsp;</span></span>
      ))}
    </Tag>
  )
}
const Img = ({ src, alt, className = '', ratio }) => (
  <figure className={`mask ${className}`} style={ratio ? { aspectRatio: ratio } : null} data-cursor>
    <img src={A(src)} alt={alt} loading="lazy" decoding="async" />
  </figure>
)

/* ---------------- Loader ---------------- */
function Loader({ done }) {
  const ref = useRef()
  useEffect(() => {
    const tl = gsap.timeline({ onComplete: done })
    tl.from('.ld-l', { yPercent: 110, stagger: 0.035, duration: 0.8, ease: 'power4.out' })
      .from('.ld-arch', { scaleY: 0, transformOrigin: 'bottom', duration: 0.9, ease: 'power3.inOut' }, 0)
      .to(ref.current, { yPercent: -100, duration: 0.9, ease: 'power4.inOut' }, '+=0.35')
    return () => tl.kill()
  }, [])
  return (
    <div className="loader" ref={ref} aria-hidden>
      <div className="ld-arch" />
      <p className="ld-name">{'Nirali Kataria'.split('').map((c, i) => <span className="ld-m" key={i}><span className="ld-l">{c === ' ' ? '\u00a0' : c}</span></span>)}</p>
    </div>
  )
}

/* ---------------- Nav ---------------- */
function Nav() {
  const [open, setOpen] = useState(false)
  const links = [['about', 'About'], ['projects', 'Projects'], ['kitchen', 'Kitchen'], ['living', 'Living Room'], ['office', 'Paul and Mike'], ['library', 'Swaying Library'], ['branding', 'Branding'], ['journey', 'Journey'], ['contact', 'Contact']]
  const go = (e, id) => { e.preventDefault(); setOpen(false); window.__lenis?.scrollTo('#' + id, { offset: -10, duration: 1.6 }) }
  return (
    <header className="nav">
      <a href="#top" className="nav-mark" onClick={(e) => go(e, 'top')}>Nirali Kataria</a>
      <button className="nav-btn" aria-expanded={open} aria-controls="menu" onClick={() => setOpen(!open)}>{open ? 'Close' : 'Menu'}</button>
      <nav id="menu" className={open ? 'open' : ''} aria-label="Primary">
        {links.map(([id, l]) => <a key={id} href={'#' + id} onClick={(e) => go(e, id)}>{l}</a>)}
      </nav>
    </header>
  )
}

/* ---------------- Hero ---------------- */
function Hero() {
  return (
    <section id="top" className="hero">
      <svg className="float f1" viewBox="0 0 120 120" aria-hidden><circle cx="60" cy="60" r="46" /><path d="M14 60h92M60 14v92" /></svg>
      <svg className="float f2" viewBox="0 0 160 100" aria-hidden><path d="M4 96V30l40-26h112v92z" /><path d="M44 4v92M4 62h40" /></svg>
      <div className="hero-copy">
        <Words as="h1" className="display" text="Spaces that tell stories." />
        <p className="hero-sub">Exploring the relationship between space, material, form and the people who experience them.</p>
        <p className="hero-id"><strong>Nirali Kataria</strong><br />Interior &amp; Furniture Design Student<br />Karnavati University</p>
      </div>
      <div className="hero-art">
        <figure className="arch" data-speed="0.12"><img src={A('kitchen/render')} alt="Rendered kitchen in warm taupe and walnut" /></figure>
        <figure className="hero-s s1" data-speed="-0.2"><img src={A('library/hero')} alt="The Swaying Library bookshelf in a living room" /></figure>
        <figure className="hero-s s2" data-speed="0.25"><img src={A('office/plan')} alt="Rendered office floor plan" /></figure>
      </div>
      <div className="scroll-ind" aria-hidden><span>Scroll</span><i /></div>
    </section>
  )
}

/* ---------------- About ---------------- */
const traits = ['Creative', 'Curious', 'Experimental', 'Playful', 'Expressive', 'Observant', 'Detail oriented', 'Authentic', 'Multifaceted']
function About() {
  return (
    <section id="about" className="about">
      <div className="about-photo">
        <Img src="profile/nirali" alt="Portrait of Nirali Kataria" ratio="1/1" className="round" />
        <p className="caption"></p>
      </div>
      <div className="about-text">
        <Words text="Design as observation, experiment and discovery." className="h2" />
        <p className="lead">I am an interior and furniture design student interested in creating meaningful, user-centric spaces. I enjoy exploring materials, experimenting with forms, and understanding how thoughtfully designed environments influence the way people feel and interact.</p>
        <p>I see design as a continuous process of observation, experimentation, and discovery, where functionality meets expression.</p>
        <ul className="traits" aria-label="Personality traits from my personal branding project">{traits.map((t, i) => <li key={t} style={{ '--r': `${(i % 3 - 1) * 1.6}deg` }}>{t}</li>)}</ul>
        <dl className="facts">
          <div><dt>Studying</dt><dd>Bachelor’s in Interior and Furniture Design, Karnavati University, 2024–2028</dd></div>
          <div><dt>Hands-on with</dt><dd>Wood, glass, metal and ceramic</dd></div>
          <div><dt>Experience</dt><dd>Interior design intern, Divine Architects, Ratlam (2026): 2D AutoCAD drafting and rendering</dd></div>
        </dl>
      </div>
    </section>
  )
}

/* ---------------- Kitchen (signature) ---------------- */
const stages = [
  { t: 'A kitchen in warm taupe', d: 'An L-shaped kitchen with a breakfast counter, planned around calm colour, honest wood and concealed light. Scroll to move through the model.', c: ['Taupe cabinetry', 'Walnut', 'Beige surfaces'] },
  { t: 'Materials and colour', d: 'Taupe shutters sit against walnut open shelves and a beige textured backsplash. Quartz countertops are finished with a 45 degree chamfered edge.', c: ['Quartz countertop', 'Tinted glass shutters', 'Brass tap'] },
  { t: 'Storage that works hard', d: 'Drawers, a pull-out, bi-fold cabinets, a Leeman’s corner and a rotating cabinet keep every corner usable. Open shelves and a rolling shutter handle display and appliances.', c: ['Rotating cabinets', 'Organised drawers', 'Bi-fold units'] },
  { t: 'The breakfast counter', d: 'The counter extends from the run as a social edge, with bar stools in walnut and a soft, upholstered seat.', c: ['Breakfast counter', 'Integrated lighting', 'Bar seating'] },
  { t: 'Seen from above', d: 'From the plan, the sink, hob and refrigerator form a working triangle along the run, with the counter holding the open side.', c: ['Plan', 'Sections A, B, C'] },
]
function Kitchen() {
  const sec = useRef(), pin = useRef(), canvasWrap = useRef(), prog = useRef(0)
  const [stage, setStage] = useState(0)
  const [free, setFree] = useState(false)
  const [mount, setMount] = useState(false)
  const [live, setLive] = useState(false)
  const [lite] = useState(() => window.innerWidth < 760 || (navigator.hardwareConcurrency || 8) <= 3)
  const [forced, setForced] = useState(false)
  const { progress: loaded, active } = useProgress()
  const use3D = !lite || forced
  const motionOff = reduced()

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({ trigger: sec.current, start: 'top 150%', once: true, onEnter: () => setMount(true) })
      ScrollTrigger.create({ trigger: pin.current, start: 'top bottom', end: () => '+=' + window.innerHeight * 5.9, onToggle: (s) => setLive(s.isActive) })
      ScrollTrigger.create({
        trigger: pin.current, start: 'top top', end: '+=480%', pin: true, scrub: true, anticipatePin: 1,
        onUpdate: (s) => {
          prog.current = s.progress
          const st = Math.min(stages.length - 1, Math.floor(s.progress * stages.length * 0.999))
          setStage((c) => (c === st ? c : st))
          const out = gsap.utils.clamp(0, 1, (s.progress - 0.94) / 0.06)
          gsap.set(canvasWrap.current, { opacity: 1 - out * 0.6 })
        },
      })
    }, sec)
    return () => ctx.revert()
  }, [])

  const gallery = [
    ['kitchen/plans', 'Floor plan and ceiling plan with dimensions', '1/0.7'],
    ['kitchen/elevations', 'Sectional elevations AA, BB and CC', '1/0.7'],
    ['kitchen/details', 'Construction details at 1:5', '1/0.7'],
  ]
  return (
    <section id="kitchen" ref={sec} className="kitchen">
      <div className="k-head">
        <Words as="h2" className="mega" text="Mocha Musings" />
        <p className="project-cat">Residential interior, kitchen design</p>
        <div className="k-mood">
          <Img src="kitchen/moodboard" alt="Kitchen concept moodboard in taupe, walnut and beige" className="k-mb" />
          <div className="k-copy">
            <p className="lead">The concept starts from a restrained palette: taupe, walnut and sand. Material changes do the work that decoration usually does, so the room stays quiet and the details can be felt.</p>
            <ul className="swatches" aria-label="Palette"><li style={{ background: '#79604F' }} /><li style={{ background: '#97806F' }} /><li style={{ background: '#B9A596' }} /><li style={{ background: '#D6C9B0' }} /></ul>
          </div>
        </div>
      </div>

      <div className="k-pin" ref={pin}>
        <div className="k-canvas" ref={canvasWrap}>
          {use3D && mount ? <Suspense fallback={null}><Kitchen3D progress={prog} free={free || motionOff} active={live} /></Suspense> : <img className="k-fallback" src={A('kitchen/render')} alt="Rendered view of the kitchen" />}
        </div>
        {use3D && mount && active && <div className="k-load" role="status">Loading the model {Math.round(loaded)}%<i style={{ transform: `scaleX(${loaded / 100})` }} /></div>}
        {lite && !forced && <button className="btn k-force" onClick={() => setForced(true)}>Load interactive 3D model (12 MB)</button>}
        <div className="k-stage" aria-live="polite">
          {stages.map((s, i) => (
            <article key={s.t} className={i === stage ? 'on' : ''} aria-hidden={i !== stage}>
              <h3>{s.t}</h3><p>{s.d}</p>
              <ul>{s.c.map((c) => <li key={c}>{c}</li>)}</ul>
            </article>
          ))}
        </div>
        <div className="k-rail" aria-hidden>{stages.map((_, i) => <i key={i} className={i <= stage ? 'on' : ''} />)}</div>
        {use3D && <button className="btn k-free" onClick={() => setFree(!free)} aria-pressed={free}>{free ? 'Return to guided tour' : 'Explore freely'}</button>}
      </div>

      <div className="k-draw">
        <Words as="h3" className="h3" text="Drawn and detailed" />
        <p className="lead narrow">Plans, sections and 1:5 details define every shutter, groove and edge: a 20 × 10 mm profile light groove, 45 degree chamfered quartz and tinted glass shutters.</p>
        <div className="k-gal">{gallery.map(([s, a]) => <Img key={s} src={s} alt={a} className="paper" />)}</div>
        <Img src="kitchen/render" alt="Final rendered kitchen visualisation" className="k-final" />
        <p className="caption">Final visualisation: walnut open shelves, light under the wall units, a breakfast counter and a window over the sink.</p>
      </div>
    </section>
  )
}


/* ---------------- Explore heading ---------------- */
// const projectIndex = [['kitchen', 'Mocha Musings', 'Kitchen design'], ['living', 'Living Room', 'Residential interior'], ['office', 'Paul and Mike', 'Workspace design'], ['library', 'The Swaying Library', 'Furniture design'], ['branding', 'More Projects', 'Identity design']]
// function Explore() {
//   const go = (e, id) => { e.preventDefault(); window.__lenis?.scrollTo('#' + id, { offset: -10, duration: 1.8 }) }
//   return (
//     <section id="projects" className="explore-sec">
//       <h2 className="words mega explore" aria-label="Explore my projects">
//         <span className="w" aria-hidden><span className="wi">Explore&nbsp;my</span></span><br />
//         <span className="w" aria-hidden><span className="wi"><em>projects</em></span></span>
//       </h2>
//       <p className="lead narrow">Five explorations across interiors, furniture and identity. Each one begins with a question about how a space or an object should feel.</p>
//       <ul className="p-index">
//         {projectIndex.map(([id, t, c], i) => (
//           <li key={id}><a href={'#' + id} onClick={(e) => go(e, id)}><span className="pi-n">{i + 1}</span><span className="pi-t">{t}</span><span className="pi-c">{c}</span><span className="pi-a" aria-hidden>→</span></a></li>
//         ))}
//       </ul>
//     </section>
//   )
// }

const projectIndex = [
  ['kitchen', 'Mocha Musings', 'Kitchen', 'kitchen/render'],
  ['living', 'Living Room', 'Residential', 'living/render'],
  ['office', 'Paul and Mike', 'Office', 'office/brand'],
  ['library', 'The Swaying Library', 'Furniture', 'library/hero'],
  ['branding', 'Personal Branding', 'Identity', 'branding/card'],
]
function Explore() {
  const go = (e, id) => { e.preventDefault(); window.__lenis?.scrollTo('#' + id, { offset: -10, duration: 1.8 }) }
  return (
    <section id="projects" className="explore-sec">
      <div className="ex-head">
        <h2 className="words ex-title" aria-label="Explore my projects">
          <span className="w" aria-hidden><span className="wi">Explore&nbsp;my&nbsp;<em>projects</em></span></span>
        </h2>
        <span className="ex-rule" aria-hidden />
      </div>
      <ul className="pc-row">
        {projectIndex.map(([id, t, c, img], i) => (
          <li key={id}>
            <a href={'#' + id} onClick={(e) => go(e, id)} className="pc">
              <span className="pc-n">{String(i + 1).padStart(2, '0')}</span>
              <span className="pc-img"><img src={A(img)} alt="" loading="lazy" /></span>
              <span className="pc-t">{t}</span>
              <span className="pc-c">({c})</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}

/* ---------------- Living Room ---------------- */
const lwalls = [
  ['plan', 'Plan', 'An L-shaped sofa and two patterned armchairs gather around a central table, with planters in two corners. Walls are labelled A to D, with a sliding door and a hinged door.'],
  ['wallA', 'Wall A', 'The television wall: a slatted vertical panel, fine linear panelling with a curved corner, and a long floating unit with rounded ends.'],
  ['wallB', 'Wall B', 'The door and a wide sliding window sit beside the sofa, keeping the daylight side open.'],
  ['wallC', 'Wall C', 'A grid panel, arched niches for display and round lights make a layered backdrop behind the seating.'],
  ['wallD', 'Wall D', 'A run of four arched panels forms a curved partition, finished with a soft undulating edge toward the floor.'],
]
function Living() {
  const [w, setW] = useState('plan')
  const cur = lwalls.find((x) => x[0] === w)
  return (
    <section id="living" className="living">
      <Words as="h2" className="mega" text="Living Room" />
      <p className="project-cat">Residential interior, living room design</p>
      <Img src="living/render" alt="Rendered living room with arched glass partition, slatted wall panel and floating TV unit" className="lv-hero" />
      <div className="lv-intro">
        <p className="lead">A calm, layered living room where warm walls, dark wood and a soft tray ceiling frame the seating. Arches repeat in the partition, the niches and the panelling, so curves lead the eye around the room.</p>
        <ul className="lv-notes"><li>Tray ceiling with a glowing cove edge and recessed lights</li><li>Slatted wood panel beside the television</li><li>Arched partition with patterned lower panels</li><li>Patterned armchairs and a sculpted centre table</li></ul>
      </div>
      <div className="lv-viewer">
        <div className="lv-tabs" role="tablist" aria-label="Drawings">
          {lwalls.map(([id, l]) => <button key={id} role="tab" aria-selected={w === id} className={w === id ? 'on' : ''} onClick={() => setW(id)}>{l}</button>)}
        </div>
        <figure className="lv-frame" key={w}><img src={A('living/' + w)} alt={`${cur[1]} drawing of the living room`} /></figure>
        <p className="lv-desc">{cur[2]}</p>
      </div>
    </section>
  )
}

/* ---------------- Office ---------------- */
const matrix = [['Workstations', 40, 45], ['Collaboration and step seating', 20, 25], ['Manager cabin and meeting rooms', 15, 20], ['Pantry and washrooms', 10, 12], ['Circulation', 10, 15]]
function Office() {
  return (
    <section id="office" className="office">
      <div className="o-top">
        <Words as="h2" className="mega" text="Paul and Mike" />
        <p className="project-cat">Workspace design, artisanal chocolate brand</p>
        <div className="o-intro">
          <Img src="office/brand" alt="Paul and Mike chocolate bar and brand pattern" className="o-brand" />
          <div>
            <p className="lead">A brand-aligned workspace that reflects an artisanal chocolate identity, ethical values and a storytelling ethos: functional, yet experiential, supporting marketing, collaboration and growth.</p>
            <dl className="stats"><div><dt>Area</dt><dd>2763 sq. ft.</dd></div><div><dt>Location</dt><dd>Ahmedabad</dd></div><div><dt>Capacity</dt><dd>20–22 people</dd></div></dl>
            <p>The brand stands for craftsmanship and ethical sourcing: bold global flavours with an Indian touch, and a sensory, design-led experience.</p>
          </div>
        </div>
      </div>
      <div className="o-mid">
        <div className="o-mood"><Img src="office/moodboard" alt="Moodboard of terrazzo, cacao, copper and rust tones" className="stack a" /><Img src="office/concept" alt="Concept map: the chocolate treasure map" className="stack b" /></div>
        <div className="o-text">
          <Words as="h3" className="h3" text="A treasure map as a floor plan" />
          <p>The concept borrows the logic of a chocolate treasure map: storytelling, a linear process, structure, fragments and a grid. Moodboard references run from terrazzo and cacao pods to copper tones and curved, arched passages.</p>
          <ul className="matrix" aria-label="Area matrix">
            {matrix.map(([l, a, b]) => <li key={l} style={{ '--a': a + '%', '--b': b + '%' }}><span>{l}</span><b>{a}–{b}%</b><i /></li>)}
          </ul>
        </div>
      </div>
      <div className="o-plan">
        <Words as="h3" className="h3" text="Rendered plan" />
        <figure className="wipe" data-cursor><img src={A('office/plan')} alt="Rendered floor plan of the Paul and Mike office" loading="lazy" /></figure>
      </div>
      <div className="o-sections">
        <Words as="h3" className="h3" text="Rendered sections" />
        <p className="lead narrow">Three sections show meeting rooms, workstations, a breakout area with arched seating and the stepped collaboration zone.</p>
        <figure className="wipe" data-cursor><img src={A('office/sections')} alt="Rendered sections of the office" loading="lazy" /></figure>
      </div>
    </section>
  )
}

/* ---------------- Library ---------------- */
const steps = [['6 mm plywood', 'Lightweight yet sturdy core material.'], ['Mortise and tenon', 'Components slot together for strength and refined craft.'], ['SH glue', 'A stronger, more durable bond.'], ['Sanding', 'Thorough sanding before finishing.'], ['Three coats of primer', 'A stable base for the colour.'], ['Three layers of spray paint', 'Protection and a smooth finish.']]
// function Library() {
//   return (
//     <section id="library" className="library">
//       <div className="l-top">
//         <Words as="h2" className="mega" text="The Swaying Library" />
//         <p className="project-cat">Furniture design, furniture and ergonomics studio</p>
//       </div>
//       <div className="l-hero">
//         <Img src="library/hero" alt="The Swaying Library in an interior, a man walking past" className="l-main sway" />
//         <div className="l-copy">
//           <p className="lead">A rocking bookshelf crafted from plywood using mortise-and-tenon joinery.</p>
//           <p>The design explores movement in furniture. A gentle rocking feature makes book access more ergonomic and interactive than a static shelf, and the curved form softens the room while holding books and small everyday objects.</p>
//         </div>
//       </div>
//       <div className="l-proto">
//         <Img src="library/prototype" alt="Final prototype photographed on grass, painted blue" className="p" />
//         <Img src="library/ortho" alt="Orthographic views: front 650, side 550, top 260" className="p ortho" />
//       </div>
//       <div className="l-make">
//         <Words as="h3" className="h3" text="How it was made" />
//         <ol className="steps">{steps.map(([t, d]) => <li key={t}><h4>{t}</h4><p>{d}</p></li>)}</ol>
//         <div className="l-strip">
//           <Img src="library/mockups" alt="1:5 scale white mock-ups" className="strip" />
//           <Img src="library/joinery" alt="Joinery details" className="strip" />
//           <Img src="library/process" alt="Process documentation in the workshop" className="strip wide" />
//         </div>
//       </div>
//     </section>
//   )
// }


function Library() {
  return (
    <section id="library" className="library lib-poster">
      <div className="lp-head">
        <p className="lp-kicker">Furniture and ergonomics studio</p>
        <Words as="h2" className="lp-title" text="The Swaying Library" />
        <p className="lp-tag">a bookshelf that rocks</p>
      </div>

      {/* <div className="lp-hero l-hero">
        <div className="lp-arch" aria-hidden />
        <Img src="library/hero" alt="The Swaying Library in an interior, a man walking past" className="l-main lp-photo" />
        <Img src="library/prototype" alt="Final prototype photographed on grass, painted blue" className="lp-proto lp-round" />
      </div> */}


        <div className="lp-hero l-hero">
        <figure className="lp-arch-frame" data-cursor>
          <span className="lp-arch-img"><img src={A('library/hero')} alt="The Swaying Library in an interior, a man walking past" /></span>
        </figure>
        {/* <div className="lp-grid">
          <Img src="library/p1" alt="Prototype on grass, front angle" className="lp-round" ratio="1/1" />
          <Img src="library/p2" alt="Prototype, close view of the shelf" className="lp-round" ratio="1/1" />
          <Img src="library/p3" alt="Prototype on grass, three-quarter view" className="lp-round" ratio="1/1" />
          <Img src="library/p4" alt="Prototype on grass, side view with books" className="lp-round" ratio="1/1" />
        </div> */}

        <Img src="library/collage" alt="Four views of the Swaying Library prototype on grass" className="lp-collage" ratio="1/1" />
      </div>

      <div className="lp-body">
        <div className="lp-text">
          <h4>Concept</h4>
          <p>A rocking bookshelf crafted from plywood using mortise-and-tenon joinery for strength, durability and refined craftsmanship. A gentle rocking feature makes book access more ergonomic and interactive than a static shelf.</p>
          <h4>Form and use</h4>
          <p>Designed to hold books as well as small everyday objects, its curved, dynamic form softens interior spaces visually and reinterprets everyday storage in a playful yet purposeful way.</p>
          <h4>Making</h4>
          <p>Built from 6 mm plywood, joined with mortise and tenon and SH glue. After thorough sanding, three coats of primer and three layers of spray paint give protection and a smooth finish.</p>
        </div>
        <div className="lp-side">
          <Img src="library/joinery" alt="Joinery details" className="lp-round" />
          <Img src="library/process" alt="Process documentation in the workshop" className="lp-round" />
        </div>
      </div>

      <div className="lp-draw">
        <Img src="library/ortho" alt="Orthographic views: front 650, side 550, top 260" className="lp-ortho" />
        <div className="lp-spec">
          <h4>Orthographic views</h4>
          <ul>
            <li><span>Front view</span><b>650 × 450 mm</b></li>
            <li><span>Side view</span><b>550 × 450 mm</b></li>
            <li><span>Top view</span><b>260 mm</b></li>
          </ul>
          <h4>Scale 1:5 mock-ups</h4>
          <Img src="library/mockups" alt="1:5 scale white mock-ups" className="lp-round" />
        </div>
      </div>

      <ol className="lp-steps">
        {steps.map(([t, d], i) => <li key={t}><b>{i + 1}</b><h5>{t}</h5><p>{d}</p></li>)}
      </ol>
    </section>
  )
}

/* ---------------- Branding ---------------- */
const bslides = [['branding/self', 'Self exploration'], ['branding/mission', 'Mission and vision'], ['branding/moodboard', 'Moodboard'], ['branding/explorations', 'Logo explorations'], ['branding/logos', 'Logo colourways'], ['branding/palette', 'Palette'], ['branding/icons', 'Brand icons and patterns']]
function Branding() {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const k = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', k); document.documentElement.classList.toggle('lock', open)
    open ? window.__lenis?.stop() : window.__lenis?.start()
    return () => window.removeEventListener('keydown', k)
  }, [open])
  return (
    <section id="branding" className="brand">
      <div className="b-head">
        <h2 className="b-title">more projects:<br />personal branding</h2>
        <p>A playful, expressive identity for a future interior studio. It breaks from the quiet palette of the other work on purpose.</p>
      </div>
      <div className="b-collage">
        <img className="c1" src={A('branding/cover')} alt="Personal branding cover" loading="lazy" />
        <img className="c2" src={A('branding/card')} alt="Business card mock-up" loading="lazy" />
        <img className="c3" src={A('branding/tote')} alt="Tote bag mock-up" loading="lazy" />
        <img className="c4" src={A('branding/thanks')} alt="Thank-you card mock-up" loading="lazy" />
      </div>
      <button className="btn pink" onClick={() => setOpen(true)}>Open the full project</button>
      {open && (
        <div className="b-modal" role="dialog" aria-modal="true" aria-label="Personal branding project">
          <button className="btn close" onClick={() => setOpen(false)}>Close</button>
          <div className="b-scroll" data-lenis-prevent>
            {bslides.map(([s, a]) => <figure key={s}><img src={A(s)} alt={a} loading="lazy" /><figcaption>{a}</figcaption></figure>)}
          </div>
        </div>
      )}
    </section>
  )
}

/* ---------------- Journey ---------------- */
const tools = [['AutoCAD', 'Advanced', 90], ['SketchUp', 'Intermediate', 62], ['Adobe Illustrator', 'Intermediate', 62], ['Enscape', 'Beginner', 35], ['Adobe Photoshop', 'Beginner', 35], ['Adobe InDesign', 'Beginner', 35]]
function Journey() {
  return (
    <section id="journey" className="journey">
      <Words as="h2" className="mega sm" text="Design journey" />
      <div className="j-grid">
        <ol className="timeline">
          <li><time>2024–2028</time><h3>Karnavati University</h3><p>Bachelor’s in Interior and Furniture Design</p></li>
          <li><time>2026</time><h3>Divine Architects, Ratlam</h3><p>Interior design intern: 2D AutoCAD drafting and 2D AutoCAD rendering</p></li>
          <li><time>2026</time><h3>Praxis 7.0</h3><p>Exhibition team member, department event UID. Also attended speaker sessions and panel discussions.</p></li>
          <li><time>Participation</time><h3>Cord 3.0</h3><p>Industry exposure symposium</p></li>
        </ol>
        <div>
          <ul className="tools">{tools.map(([n, l, v]) => <li key={n} style={{ '--v': v + '%' }}><span>{n}</span><em>{l}</em><i /></li>)}</ul>
          <ul className="chips">{['Space planning', 'Furniture layout', 'Technical execution', 'Wood, glass, metal and ceramic', 'Teamwork', 'Adaptability', 'Reliability', 'Openness to learning', 'Problem solving'].map((s) => <li key={s}>{s}</li>)}</ul>
          <p className="caption">Languages: Hindi, English</p>
        </div>
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section id="contact" className="contact">
      <Words as="h2" className="mega" text="Have a space in mind?" />
      <p className="lead">Let’s create something meaningful.</p>
      <a className="mail" href="mailto:niralikataria9@gmail.com">niralikataria9@gmail.com</a>
      <p className="caption"></p>
      <footer><span>Nirali Kataria, Interior &amp; Furniture Design</span><span>Karnavati University, 2024–2028</span></footer>
    </section>
  )
}

/* ---------------- App ---------------- */
export default function App() {
  const [ready, setReady] = useState(false)
  const cur = useRef()
  useEffect(() => {
    const rm = reduced()
    const lenis = new Lenis({ lerp: rm ? 1 : 0.09, smoothWheel: !rm })
    window.__lenis = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (t) => lenis.raf(t * 1000)
    gsap.ticker.add(tick); gsap.ticker.lagSmoothing(0)
    return () => { gsap.ticker.remove(tick); lenis.destroy() }
  }, [])

  useLayoutEffect(() => {
    if (!ready) return
    const rm = reduced()
    const ctx = gsap.context(() => {
      gsap.from('.hero .wi', { yPercent: 115, duration: 1.2, stagger: 0.09, ease: 'power4.out' })
      gsap.from('.hero-sub,.hero-id,.scroll-ind', { opacity: 0, y: 18, duration: 1, delay: 0.6, stagger: 0.12, ease: 'power2.out' })
      gsap.from('.hero .arch', { clipPath: 'inset(100% 0 0 0)', duration: 1.5, ease: 'power4.inOut', delay: 0.1 })
      gsap.from('.hero-s', { opacity: 0, scale: 0.9, duration: 1.1, delay: 0.8, stagger: 0.15, ease: 'power3.out' })
      if (rm) return
      gsap.from('.pc', { y: 70, opacity: 0, duration: 1, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: '.pc-row', start: 'top 85%' } })
      gsap.utils.toArray('[data-speed]').forEach((el) => gsap.to(el, { yPercent: parseFloat(el.dataset.speed) * 100, ease: 'none', scrollTrigger: { trigger: el, scrub: true, start: 'top bottom', end: 'bottom top' } }))
      gsap.utils.toArray('.words:not(.display) .wi').forEach((el) => gsap.from(el, { yPercent: 115, duration: 1, ease: 'power4.out', scrollTrigger: { trigger: el, start: 'top 92%' } }))
      gsap.utils.toArray('.mask').forEach((el) => {
        gsap.from(el, { clipPath: 'inset(0 0 100% 0)', duration: 1.3, ease: 'power4.inOut', scrollTrigger: { trigger: el, start: 'top 88%' } })
        gsap.from(el.querySelector('img'), { scale: 1.25, duration: 1.8, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' } })
      })
      gsap.utils.toArray('.wipe').forEach((el) => gsap.fromTo(el, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', ease: 'none', scrollTrigger: { trigger: el, start: 'top 85%', end: 'top 25%', scrub: true } }))
      gsap.utils.toArray('.matrix li, .tools li').forEach((el) => gsap.from(el.querySelector('i'), { scaleX: 0, transformOrigin: 'left', duration: 1.3, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%' } }))
      gsap.utils.toArray('.timeline li').forEach((el) => gsap.from(el, { opacity: 0, x: -24, duration: 0.9, scrollTrigger: { trigger: el, start: 'top 88%' } }))
      gsap.utils.toArray('.stack').forEach((el, i) => gsap.from(el, { y: 120, rotate: i ? 5 : -4, duration: 1.4, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%' } }))
      // gsap.to('.l-main img', { rotate: 3, transformOrigin: '50% 100%', ease: 'none', scrollTrigger: { trigger: '.l-hero', scrub: 1, start: 'top 80%', end: 'bottom 20%' } })
      gsap.fromTo('.lp-arch-frame', { rotate: -2.5 }, { rotate: 2.5, transformOrigin: '50% 100%', ease: 'none', scrollTrigger: { trigger: '.l-hero', scrub: 1, start: 'top 85%', end: 'bottom 15%' } })
      gsap.utils.toArray('.b-collage img').forEach((el, i) => gsap.from(el, { y: 160, rotate: (i % 2 ? 1 : -1) * 8, opacity: 0, duration: 1.2, ease: 'back.out(1.4)', scrollTrigger: { trigger: '.b-collage', start: 'top 80%' }, delay: i * 0.12 }))
      // section background shifts: warm ivory -> beige -> deeper brown while in the kitchen
      ScrollTrigger.create({ trigger: '#kitchen', start: 'top 60%', end: 'bottom 40%', toggleClass: { targets: 'body', className: 'tone-k' } })
      ScrollTrigger.create({ trigger: '#office', start: 'top 60%', end: 'bottom 40%', toggleClass: { targets: 'body', className: 'tone-o' } })
      ScrollTrigger.create({ trigger: '#branding', start: 'top 60%', end: 'bottom 40%', toggleClass: { targets: 'body', className: 'tone-b' } })
    })
    ScrollTrigger.refresh()
    return () => ctx.revert()
  }, [ready])

  useEffect(() => {
    if (!window.matchMedia('(pointer:fine)').matches) return
    const mv = (e) => gsap.to(cur.current, { x: e.clientX, y: e.clientY, duration: 0.35, ease: 'power3.out' })
    const over = (e) => cur.current?.classList.toggle('big', !!e.target.closest?.('[data-cursor],a,button'))
    window.addEventListener('mousemove', mv); window.addEventListener('mouseover', over)
    return () => { window.removeEventListener('mousemove', mv); window.removeEventListener('mouseover', over) }
  }, [])

  return (
    <>
      {!ready && <Loader done={() => setReady(true)} />}
      <a className="skip" href="#about">Skip to content</a>
      <Nav />
      <main>
        <Hero /><About /><Explore /><Kitchen /><Living /><Office /><Library /><Branding /><Journey /><Contact />
      </main>
      <div className="cursor" ref={cur} aria-hidden />
    </>
  )
}
