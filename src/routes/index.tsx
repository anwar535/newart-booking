import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Calendar as CalendarIcon, Clock, Camera, Aperture, Lightbulb, Wrench, Monitor,
  Wifi, Sparkles, Palette, Mic2, Volume2, ShieldCheck, ChevronLeft, ChevronRight,
  Check, CreditCard, Smartphone, Banknote, Upload, PartyPopper, X, ArrowDown,
  PlayCircle, MapPin, Star,
} from "lucide-react";
import logoAsset from "@/assets/newart-logo.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NewArt Studio — Book Your Creative Space" },
      { name: "description", content: "Premium studio booking for creators. Reserve your space, gear, and crew — هندسة الإبداع." },
      { property: "og:title", content: "NewArt Studio — Book Your Creative Space" },
      { property: "og:description", content: "Premium studio booking for creators in Saudi Arabia." },
    ],
  }),
  component: Index,
});

const HOURLY_RATE = 150;

type AddOn = { id: string; name: string; arName: string; price: number; perHour: boolean; icon: any };
const ADDONS: AddOn[] = [
  { id: "photographer", name: "Photographer (Camera + Pro Operator)", arName: "مصور محترف + كاميرا", price: 200, perHour: true, icon: Camera },
  { id: "lens", name: "Premium Lens", arName: "عدسة احترافية", price: 150, perHour: false, icon: Aperture },
  { id: "lighting", name: "Professional Lighting Set", arName: "طقم إضاءة احترافي", price: 100, perHour: false, icon: Lightbulb },
  { id: "cstand", name: "Heavy Duty C-Stand", arName: "حامل C-Stand", price: 50, perHour: false, icon: Wrench },
  { id: "autocue", name: "Autocue (Teleprompter)", arName: "تلقين إلكتروني", price: 100, perHour: false, icon: Monitor },
];

const INCLUDED = [
  { icon: Wifi, en: "High-speed Wi-Fi", ar: "إنترنت عالي السرعة" },
  { icon: Sparkles, en: "Makeup room", ar: "غرفة مكياج" },
  { icon: Palette, en: "Styling area", ar: "منطقة تنسيق" },
  { icon: Mic2, en: "Triggers", ar: "مشغّلات إضاءة" },
  { icon: Volume2, en: "Basic sound system", ar: "نظام صوتي أساسي" },
];

const POLICIES = [
  {
    title: "Cancellation Policy",
    arTitle: "سياسة الإلغاء",
    body: "Free cancellation up to 48 hours before the booking start time. Cancellations within 48 hours forfeit 50% of the space fee. No-show forfeits 100%.",
    arBody: "إلغاء مجاني قبل 48 ساعة من بداية الحجز. الإلغاء خلال 48 ساعة يخصم 50% من قيمة المساحة، وعدم الحضور يخصم 100%.",
  },
  {
    title: "Damage & Property",
    arTitle: "الأضرار والممتلكات",
    body: "The client is liable for any damage to studio property or equipment. Damages are deducted from the refundable security deposit; if damages exceed the deposit, the client agrees to settle the balance.",
    arBody: "يتحمل العميل أي أضرار للأستوديو أو المعدات. تُخصم من مبلغ التأمين، وإن تجاوزت قيمته يلتزم العميل بتسوية الفرق.",
  },
  {
    title: "Timing & Conduct",
    arTitle: "الالتزام والوقت",
    body: "Sessions start and end strictly within the booked slot. Overtime is charged at the hourly rate. No smoking, food, or unauthorized guests inside the shooting area.",
    arBody: "تبدأ الجلسات وتنتهي ضمن الوقت المحجوز فقط. يحتسب الوقت الإضافي بالسعر الساعي. ممنوع التدخين أو الطعام أو الضيوف غير المصرح بهم داخل منطقة التصوير.",
  },
];

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Hero />
      <Booking />
      <Footer />
    </div>
  );
}

/* -------------------- HERO -------------------- */
function Hero() {
  return (
    <header className="relative overflow-hidden bg-ink text-ink-foreground">
      <div className="absolute inset-0 bg-mesh opacity-60" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_0%,var(--ink)_75%)]" />
      <div className="relative mx-auto max-w-7xl px-6 pt-6 pb-24 sm:pb-32">
        {/* Nav */}
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-white/10 px-3 py-2 backdrop-blur ring-1 ring-white/15">
              <img src={logoAsset.url} alt="NewArt Studio" className="h-8 w-auto" />
            </div>
          </div>
          <div className="hidden items-center gap-8 text-sm text-white/70 md:flex">
            <a href="#showreel" className="hover:text-white transition">Showreel</a>
            <a href="#booking" className="hover:text-white transition">Book</a>
            <a href="#booking" className="hover:text-white transition">العربية</a>
          </div>
          <a
            href="#booking"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-bold text-accent-foreground shadow-glow transition hover:scale-105"
          >
            Reserve <ChevronRight className="h-4 w-4" />
          </a>
        </nav>

        {/* Headline */}
        <div className="mt-20 grid items-end gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/70 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Riyadh · Jeddah · Online
            </div>
            <h1 className="mt-6 text-5xl font-bold leading-[1.05] sm:text-6xl lg:text-7xl">
              Where every <span className="text-grad-brand">frame</span><br />
              becomes a <span className="text-grad-brand">story</span>.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/70">
              Premium studios, pro gear, and a booking flow as polished as a first-class lounge.
              <span className="block mt-2 text-white/55 text-base">احجز مساحتك الإبداعية في دقائق — بأسلوب يليق بإنتاجك.</span>
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href="#booking"
                className="group inline-flex items-center gap-3 rounded-full bg-accent px-7 py-4 text-base font-bold text-accent-foreground shadow-glow transition hover:shadow-elegant"
              >
                Book Your Space Now
                <ArrowDown className="h-5 w-5 transition group-hover:translate-y-0.5" />
              </a>
              <a href="#showreel" className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white">
                <PlayCircle className="h-5 w-5" /> Watch the Showreel
              </a>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-6 max-w-md">
              {[
                { k: "1,200+", v: "Productions" },
                { k: "24/7", v: "Concierge" },
                { k: "4.9★", v: "Creator score" },
              ].map((s) => (
                <div key={s.v}>
                  <div className="text-2xl font-bold text-white">{s.k}</div>
                  <div className="text-xs uppercase tracking-wider text-white/55">{s.v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Showreel */}
          <div id="showreel" className="lg:col-span-5">
            <div className="group relative aspect-[4/5] overflow-hidden rounded-3xl ring-1 ring-white/15 shadow-elegant">
              <div className="absolute inset-0 bg-grad-brand opacity-90" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_55%)]" />
              <div className="absolute inset-0 flex flex-col justify-between p-6">
                <div className="flex items-center justify-between text-white/90 text-xs uppercase tracking-widest">
                  <span className="rounded-full bg-black/30 px-3 py-1 backdrop-blur">LIVE TOUR</span>
                  <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> Studio A · Riyadh</span>
                </div>
                <button className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-white/15 backdrop-blur ring-1 ring-white/40 transition group-hover:scale-110">
                  <div className="grid h-16 w-16 place-items-center rounded-full bg-white text-primary">
                    <PlayCircle className="h-10 w-10" strokeWidth={1.5} />
                  </div>
                </button>
                <div>
                  <div className="text-white text-2xl font-bold">Showreel · 2026</div>
                  <div className="mt-1 text-white/80 text-sm">A glimpse of recent productions, sets & locations.</div>
                  <div className="mt-4 flex items-center gap-2">
                    {[0,1,2,3].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded-full ${i===1?"bg-white":"bg-white/30"}`} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

/* -------------------- BOOKING WIZARD -------------------- */
function Booking() {
  const [step, setStep] = useState(1);
  const [date, setDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [hours, setHours] = useState(2);
  const [addons, setAddons] = useState<Record<string, boolean>>({});
  const [policies, setPolicies] = useState<Record<number, boolean>>({});
  const [payment, setPayment] = useState<"apple" | "tabby" | "tamara" | "bank">("apple");
  const [confirmed, setConfirmed] = useState<null | { ref: string }>(null);

  const spacePrice = hours * HOURLY_RATE;
  const addonItems = ADDONS.filter(a => addons[a.id]);
  const addonsTotal = addonItems.reduce((sum, a) => sum + (a.perHour ? a.price * hours : a.price), 0);
  const insurance = addonItems.length > 0 ? 500 : 200;
  const total = spacePrice + addonsTotal + insurance;

  const canNext = useMemo(() => {
    if (step === 1) return !!date && !!startTime && hours > 0;
    if (step === 3) return POLICIES.every((_, i) => policies[i]);
    return true;
  }, [step, date, startTime, hours, policies]);

  function confirm() {
    const ref = "NA-" + Math.random().toString(36).slice(2, 8).toUpperCase();
    setConfirmed({ ref });
  }

  return (
    <section id="booking" className="relative mx-auto max-w-7xl px-6 py-20 sm:py-28">
      <div className="mb-12 max-w-2xl">
        <div className="text-xs uppercase tracking-[0.25em] text-accent font-bold">Booking · الحجز</div>
        <h2 className="mt-3 text-4xl sm:text-5xl font-bold text-primary">Reserve your studio in four steps.</h2>
        <p className="mt-4 text-muted-foreground">A frictionless flow inspired by first-class check-in. Live pricing, transparent terms, instant confirmation.</p>
      </div>

      {/* Stepper */}
      <Stepper step={step} setStep={setStep} />

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">
        {/* Main panel */}
        <div className="rounded-3xl bg-card shadow-soft ring-1 ring-border overflow-hidden">
          <div className="p-6 sm:p-10">
            {step === 1 && (
              <Step1
                date={date} setDate={setDate}
                startTime={startTime} setStartTime={setStartTime}
                hours={hours} setHours={setHours}
              />
            )}
            {step === 2 && <Step2 addons={addons} setAddons={setAddons} hours={hours} />}
            {step === 3 && <Step3 policies={policies} setPolicies={setPolicies} />}
            {step === 4 && <Step4 payment={payment} setPayment={setPayment} total={total} />}
          </div>

          {/* Nav buttons */}
          <div className="flex items-center justify-between border-t border-border bg-muted/30 px-6 sm:px-10 py-5">
            <button
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-foreground/70 disabled:opacity-40 hover:text-foreground transition"
            >
              <ChevronLeft className="h-4 w-4" /> Back
            </button>
            {step < 4 ? (
              <button
                onClick={() => canNext && setStep(step + 1)}
                disabled={!canNext}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-elegant disabled:opacity-40 transition hover:bg-primary/90"
              >
                Continue <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={confirm}
                className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3 text-sm font-bold text-accent-foreground shadow-glow transition hover:scale-[1.02]"
              >
                Confirm & Pay · {total} SAR
              </button>
            )}
          </div>
        </div>

        {/* Sticky Summary */}
        <Summary
          date={date} startTime={startTime} hours={hours}
          spacePrice={spacePrice} addonItems={addonItems} addonsTotal={addonsTotal}
          insurance={insurance} total={total}
        />
      </div>

      {confirmed && (
        <SuccessModal
          info={confirmed}
          date={date} startTime={startTime} hours={hours} total={total}
          onClose={() => { setConfirmed(null); setStep(1); }}
        />
      )}
    </section>
  );
}

/* -------------------- Stepper -------------------- */
function Stepper({ step, setStep }: { step: number; setStep: (n: number) => void }) {
  const steps = [
    { n: 1, label: "Date & Time", icon: CalendarIcon },
    { n: 2, label: "Equipment", icon: Camera },
    { n: 3, label: "Policies", icon: ShieldCheck },
    { n: 4, label: "Checkout", icon: CreditCard },
  ];
  return (
    <div className="relative">
      <div className="absolute left-0 right-0 top-6 h-px bg-border" />
      <div className="absolute left-0 top-6 h-px bg-accent transition-all duration-500"
        style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }} />
      <ol className="relative grid grid-cols-4 gap-2">
        {steps.map((s) => {
          const active = step === s.n;
          const done = step > s.n;
          return (
            <li key={s.n} className="flex flex-col items-center text-center">
              <button
                onClick={() => done && setStep(s.n)}
                className={`grid h-12 w-12 place-items-center rounded-full ring-4 ring-background transition
                  ${done ? "bg-accent text-accent-foreground" : active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
              >
                {done ? <Check className="h-5 w-5" /> : <s.icon className="h-5 w-5" />}
              </button>
              <span className={`mt-3 text-xs sm:text-sm font-medium ${active || done ? "text-foreground" : "text-muted-foreground"}`}>
                {s.label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* -------------------- STEP 1 -------------------- */
function Step1({
  date, setDate, startTime, setStartTime, hours, setHours,
}: any) {
  const [cursor, setCursor] = useState(() => { const d = new Date(); d.setDate(1); return d; });

  const slots = useMemo(() => {
    if (!date) return [];
    const day = date.getDay(); // 0 Sun ... 5 Fri ... 6 Sat
    // Sat (6) to Thu (4): 9-22. Friday (5): 16-22. Only full hour slots.
    const isFri = day === 5;
    const startH = isFri ? 16 : 9;
    const endH = 22;
    const arr: string[] = [];
    for (let h = startH; h < endH; h++) arr.push(`${String(h).padStart(2, "0")}:00`);
    return arr;
  }, [date]);

  const maxHours = useMemo(() => {
    if (!date || !startTime) return 12;
    const sh = parseInt(startTime.split(":")[0], 10);
    return 22 - sh;
  }, [date, startTime]);

  return (
    <div className="space-y-8">
      <Header eyebrow="Step 01" title="Pick your date & time" sub="اختر التاريخ والوقت المناسبين." />

      <div className="grid gap-8 lg:grid-cols-2">
        <CalendarGrid cursor={cursor} setCursor={setCursor} selected={date} onSelect={(d: Date) => { setDate(d); setStartTime(null); }} />

        <div className="space-y-6">
          <div>
            <Label icon={Clock}>Start time · وقت البدء</Label>
            {!date ? (
              <div className="mt-3 rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground">
                Select a date first to see available hourly slots.
              </div>
            ) : (
              <div className="mt-3 grid grid-cols-4 gap-2">
                {slots.map((t) => (
                  <button
                    key={t}
                    onClick={() => setStartTime(t)}
                    className={`rounded-xl py-2.5 text-sm font-medium ring-1 transition
                      ${startTime === t ? "bg-primary text-primary-foreground ring-primary shadow-elegant" : "bg-background ring-border hover:ring-primary/50"}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
            {date && (
              <p className="mt-3 text-xs text-muted-foreground">
                Working hours: Sat–Thu 9:00–22:00 · Fri 16:00–22:00
              </p>
            )}
          </div>

          <div>
            <Label icon={Clock}>Number of hours · عدد الساعات</Label>
            <div className="mt-3 flex items-center gap-3">
              <button
                onClick={() => setHours(Math.max(1, hours - 1))}
                className="grid h-12 w-12 place-items-center rounded-full bg-muted text-foreground hover:bg-accent hover:text-accent-foreground transition"
              >−</button>
              <div className="flex-1 rounded-2xl bg-muted/60 text-center py-3">
                <div className="text-3xl font-bold text-primary">{hours}</div>
                <div className="text-xs text-muted-foreground">hour{hours > 1 ? "s" : ""}</div>
              </div>
              <button
                onClick={() => setHours(Math.min(maxHours, hours + 1))}
                className="grid h-12 w-12 place-items-center rounded-full bg-muted text-foreground hover:bg-accent hover:text-accent-foreground transition"
              >+</button>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Base space rate: <span className="font-bold text-foreground">{HOURLY_RATE} SAR/hr</span> · Total space: <span className="font-bold text-primary">{hours * HOURLY_RATE} SAR</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CalendarGrid({ cursor, setCursor, selected, onSelect }: any) {
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date(); today.setHours(0,0,0,0);

  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  const monthName = cursor.toLocaleString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="rounded-2xl bg-muted/40 p-5 ring-1 ring-border">
      <div className="flex items-center justify-between">
        <button onClick={() => setCursor(new Date(year, month - 1, 1))} className="grid h-9 w-9 place-items-center rounded-full hover:bg-background transition">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="font-bold text-primary">{monthName}</div>
        <button onClick={() => setCursor(new Date(year, month + 1, 1))} className="grid h-9 w-9 place-items-center rounded-full hover:bg-background transition">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[10px] uppercase tracking-wider text-muted-foreground">
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => <div key={d}>{d}</div>)}
      </div>
      <div className="mt-2 grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (!d) return <div key={i} />;
          const past = d < today;
          const isSel = selected && d.toDateString() === selected.toDateString();
          const isToday = d.toDateString() === today.toDateString();
          return (
            <button
              key={i}
              disabled={past}
              onClick={() => onSelect(d)}
              className={`aspect-square rounded-xl text-sm font-medium transition relative
                ${past ? "text-muted-foreground/40 cursor-not-allowed" : "hover:bg-background"}
                ${isSel ? "bg-primary text-primary-foreground shadow-elegant" : ""}
                ${isToday && !isSel ? "ring-1 ring-accent text-accent" : ""}
              `}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* -------------------- STEP 2 -------------------- */
function Step2({ addons, setAddons, hours }: any) {
  const anyAddon = Object.values(addons).some(Boolean);
  return (
    <div className="space-y-8">
      <Header eyebrow="Step 02" title="Equipment & inclusions" sub="ما يُشمل مع المساحة وإضافاتك المميزة." />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Included */}
        <div className="rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 p-6 ring-1 ring-primary/20">
          <div className="flex items-center gap-2 text-primary">
            <Check className="h-5 w-5" />
            <h3 className="font-bold">Included with Space</h3>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">مشمول مجاناً مع كل حجز</p>
          <ul className="mt-5 space-y-3">
            {INCLUDED.map((it) => (
              <li key={it.en} className="flex items-center gap-3 rounded-xl bg-background/60 px-4 py-3 ring-1 ring-border">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
                  <it.icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium">{it.en}</div>
                  <div className="text-xs text-muted-foreground">{it.ar}</div>
                </div>
                <span className="text-xs font-bold text-primary">FREE</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Premium add-ons */}
        <div>
          <div className="flex items-center gap-2 text-accent">
            <Sparkles className="h-5 w-5" />
            <h3 className="font-bold">Premium Add-ons</h3>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">إضافات احترافية بأسعار شفافة</p>
          <ul className="mt-5 space-y-3">
            {ADDONS.map((a) => {
              const checked = !!addons[a.id];
              const lineTotal = a.perHour ? a.price * hours : a.price;
              return (
                <li key={a.id}>
                  <label className={`flex cursor-pointer items-center gap-4 rounded-xl px-4 py-3 ring-1 transition
                    ${checked ? "bg-accent/10 ring-accent" : "bg-background ring-border hover:ring-primary/40"}`}>
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={checked}
                      onChange={(e) => setAddons({ ...addons, [a.id]: e.target.checked })}
                    />
                    <div className={`grid h-6 w-6 place-items-center rounded-md ring-1 transition
                      ${checked ? "bg-accent text-accent-foreground ring-accent" : "bg-background ring-border"}`}>
                      {checked && <Check className="h-4 w-4" />}
                    </div>
                    <div className="grid h-9 w-9 place-items-center rounded-lg bg-muted text-primary">
                      <a.icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium truncate">{a.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{a.arName}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-sm font-bold text-primary">+{a.price} SAR</div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        {a.perHour ? `× ${hours}h = ${lineTotal}` : "flat"}
                      </div>
                    </div>
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Insurance card */}
      <div className={`relative overflow-hidden rounded-2xl p-6 ring-1 transition
        ${anyAddon ? "bg-accent/10 ring-accent" : "bg-primary/5 ring-primary/20"}`}>
        <div className="flex items-center gap-4">
          <div className={`grid h-12 w-12 place-items-center rounded-xl ${anyAddon ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground"}`}>
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold">Refundable Security Insurance · تأمين قابل للاسترداد</div>
            <div className="text-xs text-muted-foreground mt-1">
              {anyAddon
                ? "Premium gear detected — insurance raised to 500 SAR. Fully refundable after inspection."
                : "Base insurance of 200 SAR applies. Fully refundable after the session."}
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-2xl font-bold text-primary">{anyAddon ? 500 : 200} SAR</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">refundable</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------- STEP 3 -------------------- */
function Step3({ policies, setPolicies }: any) {
  return (
    <div className="space-y-8">
      <Header eyebrow="Step 03" title="Policies & Security Deposit" sub="اطّلع على الشروط ووافق للمتابعة." />

      <div className="rounded-2xl border-l-4 border-accent bg-accent/10 p-5">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 text-accent shrink-0" />
          <div>
            <div className="font-bold text-foreground">Refundable Security Deposit</div>
            <p className="mt-1 text-sm text-muted-foreground">
              A refundable deposit is collected to cover potential damages. It is returned in full within 3 business days following a clean post-session inspection.
              <span className="block mt-1">يُسترد مبلغ التأمين بالكامل خلال 3 أيام عمل بعد التحقق من سلامة الأستوديو والمعدات.</span>
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {POLICIES.map((p, i) => {
          const checked = !!policies[i];
          return (
            <label key={i} className={`block cursor-pointer rounded-2xl p-5 ring-1 transition
              ${checked ? "bg-primary/5 ring-primary" : "bg-background ring-border hover:ring-primary/40"}`}>
              <div className="flex items-start gap-4">
                <input type="checkbox" className="sr-only" checked={checked}
                  onChange={(e) => setPolicies({ ...policies, [i]: e.target.checked })} />
                <div className={`mt-1 grid h-6 w-6 place-items-center rounded-md ring-1 shrink-0 transition
                  ${checked ? "bg-primary text-primary-foreground ring-primary" : "bg-background ring-border"}`}>
                  {checked && <Check className="h-4 w-4" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-3">
                    <h4 className="font-bold text-foreground">{p.title}</h4>
                    <span className="text-xs text-muted-foreground">{p.arTitle}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>
                  <p className="mt-1 text-sm text-muted-foreground/80">{p.arBody}</p>
                </div>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}

/* -------------------- STEP 4 -------------------- */
function Step4({ payment, setPayment, total }: any) {
  const tabs = [
    { id: "apple", label: "Apple Pay", icon: Smartphone },
    { id: "tabby", label: "Tabby · 4 splits", icon: CreditCard },
    { id: "tamara", label: "Tamara · 4 splits", icon: CreditCard },
    { id: "bank", label: "Bank Transfer", icon: Banknote },
  ] as const;
  return (
    <div className="space-y-8">
      <Header eyebrow="Step 04" title="Checkout & Payment" sub="اختر طريقة الدفع المفضلة." />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {tabs.map((t) => {
          const active = payment === t.id;
          return (
            <button key={t.id} onClick={() => setPayment(t.id)}
              className={`flex flex-col items-center gap-2 rounded-2xl px-4 py-5 ring-1 transition
                ${active ? "bg-primary text-primary-foreground ring-primary shadow-elegant" : "bg-background ring-border hover:ring-primary/40"}`}>
              <t.icon className="h-6 w-6" />
              <span className="text-xs font-bold text-center">{t.label}</span>
            </button>
          );
        })}
      </div>

      <div className="rounded-2xl bg-muted/40 p-6 ring-1 ring-border">
        {payment === "apple" && <ApplePayMock total={total} />}
        {payment === "tabby" && <SplitMock total={total} brand="Tabby" color="oklch(0.85 0.18 145)" />}
        {payment === "tamara" && <SplitMock total={total} brand="Tamara" color="oklch(0.72 0.17 25)" />}
        {payment === "bank" && <BankTransfer total={total} />}
      </div>
    </div>
  );
}

function ApplePayMock({ total }: { total: number }) {
  return (
    <div className="mx-auto max-w-md text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-foreground text-background">
        <Smartphone className="h-8 w-8" />
      </div>
      <p className="mt-4 text-sm text-muted-foreground">Authorize {total} SAR using Face ID on your device.</p>
      <button className="mt-5 w-full rounded-xl bg-foreground text-background py-3 font-bold">
        Pay with  Pay
      </button>
    </div>
  );
}

function SplitMock({ total, brand, color }: { total: number; brand: string; color: string }) {
  const split = Math.ceil(total / 4);
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">{brand} · split in 4</div>
          <div className="text-2xl font-bold text-primary">{split} SAR <span className="text-sm font-medium text-muted-foreground">× 4 payments</span></div>
        </div>
        <div className="rounded-full px-3 py-1 text-xs font-bold text-white" style={{ background: color }}>0% interest</div>
      </div>
      <div className="mt-5 grid grid-cols-4 gap-2">
        {[0,1,2,3].map(i => (
          <div key={i} className="rounded-xl bg-background p-3 ring-1 ring-border text-center">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Payment {i+1}</div>
            <div className="mt-1 font-bold text-primary">{split} SAR</div>
            <div className="text-[10px] text-muted-foreground">{i === 0 ? "Today" : `+${i*30}d`}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BankTransfer({ total }: { total: number }) {
  const [file, setFile] = useState<string | null>(null);
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Info label="Bank Name" value="Al Rajhi Bank" />
        <Info label="Account Name" value="NewArt Studio LLC" />
        <Info label="IBAN" value="SA03 8000 0000 6080 1016 7519" mono />
        <Info label="Amount Due" value={`${total} SAR`} highlight />
      </div>
      <label className="flex cursor-pointer items-center gap-4 rounded-2xl border-2 border-dashed border-border bg-background p-5 hover:border-primary transition">
        <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
          <Upload className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold">{file ? file : "Upload Receipt Image"}</div>
          <div className="text-xs text-muted-foreground">PNG, JPG or PDF · up to 10MB</div>
        </div>
        <input type="file" className="sr-only" onChange={(e) => setFile(e.target.files?.[0]?.name ?? null)} />
        <span className="rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground">Choose file</span>
      </label>
    </div>
  );
}

function Info({ label, value, mono, highlight }: { label: string; value: string; mono?: boolean; highlight?: boolean }) {
  return (
    <div className={`rounded-xl p-4 ring-1 ${highlight ? "bg-accent/10 ring-accent" : "bg-background ring-border"}`}>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`mt-1 font-bold ${highlight ? "text-accent text-lg" : "text-foreground"} ${mono ? "font-mono text-sm" : ""}`}>{value}</div>
    </div>
  );
}

/* -------------------- SUMMARY -------------------- */
function Summary({ date, startTime, hours, spacePrice, addonItems, addonsTotal, insurance, total }: any) {
  return (
    <aside className="lg:sticky lg:top-6 h-fit rounded-3xl bg-ink text-ink-foreground shadow-elegant overflow-hidden">
      <div className="relative p-6 bg-grad-brand">
        <div className="text-[10px] uppercase tracking-[0.25em] text-white/80">Live Estimate</div>
        <div className="mt-1 text-3xl font-bold text-white">{total} <span className="text-base font-medium text-white/80">SAR</span></div>
        <div className="mt-1 text-xs text-white/70">VAT inclusive · updated live</div>
      </div>

      <div className="p-6 space-y-5 text-sm">
        <Row label="Date" value={date ? date.toLocaleDateString("en-GB", { weekday:"short", day:"numeric", month:"short", year:"numeric" }) : "—"} />
        <Row label="Start" value={startTime ?? "—"} />
        <Row label="Hours" value={`${hours} hr`} />

        <Divider />

        <Row label={`Studio space (${hours}h × ${HOURLY_RATE})`} value={`${spacePrice} SAR`} bold />

        {addonItems.length > 0 && (
          <>
            <Divider />
            <div>
              <div className="text-[10px] uppercase tracking-wider text-white/50 mb-2">Add-ons</div>
              <ul className="space-y-2">
                {addonItems.map((a: AddOn) => (
                  <li key={a.id} className="flex items-center justify-between gap-2">
                    <span className="text-white/80 truncate">{a.name}</span>
                    <span className="font-bold shrink-0">{a.perHour ? a.price * hours : a.price} SAR</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
                <span className="text-white/80">Add-ons total</span>
                <span className="font-bold">{addonsTotal} SAR</span>
              </div>
            </div>
          </>
        )}

        <Divider />
        <Row label="Refundable insurance" value={`${insurance} SAR`} sub={insurance === 500 ? "Premium gear tier" : "Standard"} />

        <Divider />
        <div className="flex items-end justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-white/50">Final total</div>
            <div className="text-2xl font-bold text-white">{total} SAR</div>
          </div>
          <div className="flex items-center gap-1 text-accent">
            <Star className="h-4 w-4 fill-accent" />
            <Star className="h-4 w-4 fill-accent" />
            <Star className="h-4 w-4 fill-accent" />
            <Star className="h-4 w-4 fill-accent" />
            <Star className="h-4 w-4 fill-accent" />
          </div>
        </div>
      </div>
    </aside>
  );
}

function Row({ label, value, bold, sub }: { label: string; value: string; bold?: boolean; sub?: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <div className={`${bold ? "text-white" : "text-white/70"} truncate`}>{label}</div>
        {sub && <div className="text-[10px] text-white/40 mt-0.5">{sub}</div>}
      </div>
      <div className={`shrink-0 ${bold ? "font-bold text-white" : "text-white"}`}>{value}</div>
    </div>
  );
}

function Divider() { return <div className="h-px bg-white/10" />; }

/* -------------------- Helpers -------------------- */
function Header({ eyebrow, title, sub }: { eyebrow: string; title: string; sub: string }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-[0.25em] font-bold text-accent">{eyebrow}</div>
      <h3 className="mt-2 text-2xl sm:text-3xl font-bold text-primary">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{sub}</p>
    </div>
  );
}

function Label({ icon: Icon, children }: { icon: any; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-sm font-bold text-foreground">
      <Icon className="h-4 w-4 text-accent" />
      {children}
    </div>
  );
}

/* -------------------- Success Modal -------------------- */
function SuccessModal({ info, date, startTime, hours, total, onClose }: any) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/60 backdrop-blur p-4 animate-in fade-in">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-card shadow-elegant ring-1 ring-border animate-in zoom-in-95">
        <button onClick={onClose} className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-muted text-foreground hover:bg-accent hover:text-accent-foreground transition">
          <X className="h-4 w-4" />
        </button>
        <div className="bg-grad-brand p-8 text-center text-white">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-white/20 backdrop-blur ring-4 ring-white/30">
            <PartyPopper className="h-10 w-10" />
          </div>
          <h3 className="mt-5 text-3xl font-bold">Booking Confirmed!</h3>
          <p className="mt-1 text-white/85 text-sm">تم تأكيد حجزك. نراك قريباً في الأستوديو.</p>
        </div>
        <div className="p-8 space-y-4">
          <div className="rounded-2xl bg-muted/40 p-5 text-center">
            <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Reference Number</div>
            <div className="mt-1 text-2xl font-bold text-primary font-mono">{info.ref}</div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Box label="Date" value={date ? date.toLocaleDateString("en-GB", { day:"numeric", month:"short" }) : "—"} />
            <Box label="Start" value={startTime ?? "—"} />
            <Box label="Duration" value={`${hours} hours`} />
            <Box label="Total" value={`${total} SAR`} accent />
          </div>
          <p className="text-center text-xs text-muted-foreground pt-2">
            A confirmation has been sent to your email. Our concierge will contact you 24 hours before your session.
          </p>
          <button onClick={onClose} className="w-full rounded-full bg-primary py-3 font-bold text-primary-foreground hover:bg-primary/90 transition">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

function Box({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`rounded-xl p-3 ring-1 ${accent ? "bg-accent/10 ring-accent" : "bg-background ring-border"}`}>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`mt-1 font-bold ${accent ? "text-accent" : "text-foreground"}`}>{value}</div>
    </div>
  );
}

/* -------------------- Footer -------------------- */
function Footer() {
  return (
    <footer className="bg-ink text-ink-foreground">
      <div className="mx-auto max-w-7xl px-6 py-12 grid gap-8 md:grid-cols-3">
        <div>
          <div className="inline-block rounded-xl bg-white/10 px-3 py-2 ring-1 ring-white/15">
            <img src={logoAsset.url} alt="NewArt Studio" className="h-8 w-auto" />
          </div>
          <p className="mt-4 text-sm text-white/60 max-w-xs">
            Where productions feel premium and bookings feel effortless.
          </p>
        </div>
        <div className="text-sm text-white/70 space-y-2">
          <div className="text-white font-bold">Studios</div>
          <div>Riyadh — Studio A</div>
          <div>Jeddah — Studio B</div>
          <div>Online consultations</div>
        </div>
        <div className="text-sm text-white/70 space-y-2">
          <div className="text-white font-bold">Concierge</div>
          <div>hello@newart.studio</div>
          <div>+966 11 000 0000</div>
          <div>24 / 7 support</div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/50">
        © 2026 NewArt Studio · جميع الحقوق محفوظة
      </div>
    </footer>
  );
}
