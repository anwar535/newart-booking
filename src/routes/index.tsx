import { createFileRoute } from "@tanstack/react-router";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  Calendar as CalendarIcon, Clock, Camera, Aperture, Lightbulb, Wrench, Monitor,
  Wifi, Sparkles, Palette, Mic2, Volume2, ShieldCheck, ChevronLeft, ChevronRight,
  Check, CreditCard, Smartphone, Banknote, Upload, PartyPopper, X, ArrowDown,
  PlayCircle, MapPin, Star, Sun, Moon, Languages, Mail, Phone, MessageCircle, Instagram,
} from "lucide-react";
import logoAsset from "@/assets/newart-logo.png.asset.json";
import img001 from "@/assets/001.png.asset.json";
import img002 from "@/assets/002.png.asset.json";
import img003 from "@/assets/003.png.asset.json";
import img004 from "@/assets/004.png.asset.json";
import img005 from "@/assets/005.png.asset.json";
import img006 from "@/assets/006.png.asset.json";
import img007 from "@/assets/007.jpg.asset.json";
import img008 from "@/assets/008.jpg.asset.json";
import { useServerFn } from "@tanstack/react-start";
import { validatePromo } from "@/lib/promo.functions";

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

/* -------------------- Pricing matrix -------------------- */
const HOUR_PRICING: Record<number, number> = {
  1: 200, 2: 350, 3: 500, 4: 650, 5: 750, 6: 850, 7: 900, 8: 1000,
};
const ORIGINAL_1H_PRICE = 290;
const MAX_HOURS = 8;
function getSpacePrice(hours: number) {
  const clamped = Math.max(1, Math.min(MAX_HOURS, hours));
  return HOUR_PRICING[clamped] ?? HOUR_PRICING[MAX_HOURS];
}

/* Mock reserved slots — keyed by YYYY-MM-DD → array of "HH:00" */
function mockReservedSlots(date: Date): string[] {
  // Deterministic pseudo-random based on date
  const seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
  const pool = ["10:00","12:00","14:00","16:00","18:00","20:00","09:00","11:00","15:00","19:00"];
  const taken: string[] = [];
  for (let i = 0; i < 3; i++) {
    taken.push(pool[(seed + i * 7) % pool.length]);
  }
  return Array.from(new Set(taken));
}

// Promo code is validated server-side via validatePromo() — never trust client totals.

/* -------------------- i18n -------------------- */
type Lang = "en" | "ar";
type Dict = Record<string, { en: string; ar: string }>;

const T: Dict = {
  // Nav
  nav_showreel: { en: "Showreel", ar: "العرض" },
  nav_book: { en: "Book", ar: "احجز" },
  nav_reserve: { en: "Reserve", ar: "احجز الآن" },
  // Hero
  hero_location: { en: "Riyadh · Jeddah · Online", ar: "الرياض · جدة · أونلاين" },
  hero_h1_a: { en: "Where every", ar: "حيث يتحوّل كل" },
  hero_h1_b: { en: "frame", ar: "إطار" },
  hero_h1_c: { en: "becomes a", ar: "إلى" },
  hero_h1_d: { en: "story", ar: "قصة" },
  hero_sub: { en: "Premium studios, pro gear, and a booking flow as polished as a first-class lounge.", ar: "استوديوهات فاخرة، معدات احترافية، وتجربة حجز بأناقة الدرجة الأولى." },
  hero_sub2: { en: "Book your creative space in minutes — تجربة تليق بإنتاجك.", ar: "احجز مساحتك الإبداعية في دقائق — بأسلوب يليق بإنتاجك." },
  hero_cta: { en: "Book Your Space Now", ar: "احجز مساحتك الآن" },
  hero_watch: { en: "Watch the Showreel", ar: "شاهد العرض" },
  stat_prod: { en: "Productions", ar: "إنتاج" },
  stat_conc: { en: "Concierge", ar: "خدمة" },
  stat_score: { en: "Creator score", ar: "تقييم المبدعين" },
  live_tour: { en: "LIVE TOUR", ar: "جولة مباشرة" },
  studio_a: { en: "Studio A · Riyadh", ar: "استوديو A · الرياض" },
  showreel_title: { en: "Showreel · 2026", ar: "العرض · 2026" },
  showreel_sub: { en: "A glimpse of recent productions, sets & locations.", ar: "لمحة من أحدث الإنتاجات والمواقع." },

  // Booking section header
  section_eyebrow: { en: "Booking · الحجز", ar: "الحجز · Booking" },
  section_title: { en: "Reserve your studio in four steps.", ar: "احجز استوديوك في أربع خطوات." },
  section_sub: { en: "A frictionless flow inspired by first-class check-in. Live pricing, transparent terms, instant confirmation.", ar: "تجربة حجز سلسة بأسلوب الدرجة الأولى. تسعير مباشر، شروط واضحة، تأكيد فوري." },

  // Stepper
  step_date: { en: "Date & Time", ar: "التاريخ والوقت" },
  step_equip: { en: "Equipment", ar: "المعدات" },
  step_policies: { en: "Policies", ar: "السياسات" },
  step_checkout: { en: "Checkout", ar: "الدفع" },

  back: { en: "Back", ar: "رجوع" },
  continue: { en: "Continue", ar: "متابعة" },
  confirm_pay: { en: "Confirm & Pay", ar: "تأكيد ودفع" },

  // Step 1
  s1_eyebrow: { en: "Step 01", ar: "الخطوة 01" },
  s1_title: { en: "Pick your date & time", ar: "اختر التاريخ والوقت" },
  s1_sub: { en: "Select the date and start time that suit you.", ar: "اختر التاريخ والوقت المناسبين." },
  start_time: { en: "Start time", ar: "وقت البدء" },
  hours_label: { en: "Number of hours", ar: "عدد الساعات" },
  pick_date_first: { en: "Select a date first to see available hourly slots.", ar: "اختر التاريخ أولاً لعرض الفترات المتاحة." },
  hours_unit: { en: "hours", ar: "ساعات" },
  hour_unit: { en: "hour", ar: "ساعة" },
  working_hours: { en: "Working hours: Sat–Thu 9:00–22:00 · Fri 16:00–22:00", ar: "ساعات العمل: السبت–الخميس 9:00–22:00 · الجمعة 16:00–22:00" },
  base_rate: { en: "Base space rate", ar: "سعر المساحة الأساسي" },
  total_space: { en: "Total space", ar: "إجمالي المساحة" },

  // Step 2
  s2_eyebrow: { en: "Step 02", ar: "الخطوة 02" },
  s2_title: { en: "Equipment & inclusions", ar: "المعدات والمشمولات" },
  s2_sub: { en: "What's included and your premium add-ons.", ar: "ما يُشمل مع المساحة وإضافاتك المميزة." },
  included_title: { en: "Included with Space", ar: "مشمول مع المساحة" },
  included_sub: { en: "Complimentary with every booking", ar: "مشمول مجاناً مع كل حجز" },
  free: { en: "FREE", ar: "مجاناً" },
  addons_title: { en: "Premium Add-ons", ar: "إضافات احترافية" },
  addons_sub: { en: "Professional gear at transparent prices", ar: "معدات احترافية بأسعار شفافة" },
  flat: { en: "flat", ar: "ثابت" },
  insurance_title: { en: "Refundable Security Insurance", ar: "تأمين قابل للاسترداد" },
  insurance_low: { en: "Base insurance of 200 SAR applies. Fully refundable after the session.", ar: "تأمين أساسي 200 ريال، يُسترد بالكامل بعد الجلسة." },
  insurance_high: { en: "Premium gear detected — insurance raised to 500 SAR. Fully refundable after inspection.", ar: "تم اختيار معدات احترافية — التأمين 500 ريال، يُسترد بالكامل بعد المعاينة." },
  refundable: { en: "refundable", ar: "قابل للاسترداد" },

  // Included items
  inc_wifi: { en: "High-speed Wi-Fi", ar: "إنترنت عالي السرعة" },
  inc_makeup: { en: "Makeup room", ar: "غرفة مكياج" },
  inc_styling: { en: "Styling area", ar: "منطقة تنسيق" },
  inc_triggers: { en: "Triggers", ar: "مشغّلات إضاءة" },
  inc_sound: { en: "Basic sound system", ar: "نظام صوتي أساسي" },

  // Add-ons
  ao_photographer: { en: "Photographer (Camera + Pro Operator)", ar: "مصور محترف + كاميرا" },
  ao_lens: { en: "Premium Lens", ar: "عدسة احترافية" },
  ao_lighting: { en: "Studio Lighting", ar: "إضاءة احترافية" },
  ao_stand: { en: "Studio Stand (C-Stand)", ar: "استاند تصوير" },
  ao_autocue: { en: "Teleprompter (Autocue)", ar: "اوتوكيو" },

  // Step 3
  s3_eyebrow: { en: "Step 03", ar: "الخطوة 03" },
  s3_title: { en: "Policies & Security Deposit", ar: "السياسات ومبلغ التأمين" },
  s3_sub: { en: "Review terms and accept to continue.", ar: "اطّلع على الشروط ووافق للمتابعة." },
  deposit_title: { en: "Refundable Security Deposit", ar: "مبلغ تأمين قابل للاسترداد" },
  deposit_body: { en: "A refundable deposit is collected to cover potential damages. It is returned in full within 3 business days following a clean post-session inspection.", ar: "يُسترد مبلغ التأمين بالكامل خلال 3 أيام عمل بعد التحقق من سلامة الأستوديو والمعدات." },

  pol1_t: { en: "Cancellation Policy", ar: "سياسة الإلغاء" },
  pol1_b: { en: "Free cancellation up to 48 hours before the booking start time. Cancellations within 48 hours forfeit 50% of the space fee. No-show forfeits 100%.", ar: "إلغاء مجاني قبل 48 ساعة من بداية الحجز. الإلغاء خلال 48 ساعة يخصم 50% من قيمة المساحة، وعدم الحضور يخصم 100%." },
  pol2_t: { en: "Damage & Property", ar: "الأضرار والممتلكات" },
  pol2_b: { en: "The client is liable for any damage to studio property or equipment. Damages are deducted from the refundable security deposit.", ar: "يتحمل العميل أي أضرار للأستوديو أو المعدات. تُخصم من مبلغ التأمين القابل للاسترداد." },
  pol3_t: { en: "Timing & Conduct", ar: "الالتزام والوقت" },
  pol3_b: { en: "Sessions start and end strictly within the booked slot. Overtime is charged at the hourly rate. No smoking, food, or unauthorized guests inside the shooting area.", ar: "تبدأ الجلسات وتنتهي ضمن الوقت المحجوز فقط. يُحتسب الوقت الإضافي بالسعر الساعي. ممنوع التدخين أو الطعام أو الضيوف غير المصرح بهم." },

  // Step 4
  s4_eyebrow: { en: "Step 04", ar: "الخطوة 04" },
  s4_title: { en: "Checkout & Payment", ar: "الدفع وإتمام الحجز" },
  s4_sub: { en: "Choose your preferred payment method.", ar: "اختر طريقة الدفع المفضلة." },
  pay_apple: { en: "Apple Pay", ar: "آبل باي" },
  pay_tabby: { en: "Tabby · 4 splits", ar: "تابي · 4 دفعات" },
  pay_tamara: { en: "Tamara · 4 splits", ar: "تمارا · 4 دفعات" },
  pay_bank: { en: "Bank Transfer", ar: "تحويل بنكي" },
  apple_hint: { en: "Authorize {n} SAR using Face ID on your device.", ar: "أكّد دفع {n} ريال باستخدام Face ID على جهازك." },
  apple_btn: { en: "Pay with  Pay", ar: "ادفع بـ Apple Pay" },
  split_label: { en: "split in 4", ar: "مقسّمة على 4" },
  split_payments: { en: "× 4 payments", ar: "× 4 دفعات" },
  no_interest: { en: "0% interest", ar: "0% فوائد" },
  payment_n: { en: "Payment", ar: "دفعة" },
  today: { en: "Today", ar: "اليوم" },
  bank_name: { en: "Bank Name", ar: "اسم البنك" },
  account_name: { en: "Account Name", ar: "اسم الحساب" },
  iban: { en: "IBAN", ar: "رقم الآيبان" },
  amount_due: { en: "Amount Due", ar: "المبلغ المستحق" },
  upload_receipt: { en: "Upload Receipt Image", ar: "ارفع صورة الإيصال" },
  upload_hint: { en: "PNG, JPG or PDF · up to 10MB", ar: "PNG أو JPG أو PDF · حتى 10MB" },
  choose_file: { en: "Choose file", ar: "اختر ملف" },

  // Summary
  live_estimate: { en: "Live Estimate", ar: "التقدير الحي" },
  vat_inclusive: { en: "VAT inclusive · updated live", ar: "شامل الضريبة · يُحدّث مباشرة" },
  date: { en: "Date", ar: "التاريخ" },
  start: { en: "Start", ar: "البداية" },
  hours_short: { en: "Hours", ar: "الساعات" },
  hr: { en: "hr", ar: "س" },
  studio_space: { en: "Studio space", ar: "مساحة الاستوديو" },
  addons_word: { en: "Add-ons", ar: "الإضافات" },
  addons_total: { en: "Add-ons total", ar: "إجمالي الإضافات" },
  refundable_insurance: { en: "Refundable insurance", ar: "تأمين قابل للاسترداد" },
  premium_tier: { en: "Premium gear tier", ar: "فئة المعدات الاحترافية" },
  standard_tier: { en: "Standard", ar: "أساسي" },
  final_total: { en: "Final total", ar: "الإجمالي النهائي" },

  // Success
  booking_confirmed: { en: "Booking Confirmed!", ar: "تم تأكيد الحجز!" },
  see_you: { en: "We'll see you at the studio soon.", ar: "نراك قريباً في الأستوديو." },
  ref_no: { en: "Reference Number", ar: "رقم المرجع" },
  duration: { en: "Duration", ar: "المدة" },
  total: { en: "Total", ar: "الإجمالي" },
  confirmation_sent: { en: "A confirmation has been sent to your email. Our concierge will contact you 24 hours before your session.", ar: "تم إرسال التأكيد إلى بريدك الإلكتروني. سيتواصل معك فريقنا قبل 24 ساعة من الجلسة." },
  done: { en: "Done", ar: "تم" },

  // New: pricing / compensation / availability
  prayer_badge: { en: "Prayer time allowance: 10 minutes free of charge added to your session.", ar: "وقت صلاة: 10 دقائق مجاناً مضافة لجلستك." },
  compensation_badge: { en: "30 minutes free extension included with long sessions.", ar: "30 دقيقة تعويض مجاني مع الجلسات الطويلة." },
  reserved: { en: "Reserved", ar: "محجوز" },
  unavailable: { en: "Unavailable", ar: "غير متاح" },
  lead_time_note: { en: "Same-day bookings require at least 2 hours lead time.", ar: "الحجز في نفس اليوم يتطلب ساعتين كحد أدنى قبل البدء." },
  no_slots_today: { en: "No more slots available today. Please pick another date.", ar: "لا توجد فترات متاحة اليوم. اختر تاريخاً آخر." },
  space_total_label: { en: "Studio space", ar: "مساحة الاستوديو" },
  saved: { en: "You save", ar: "وفّرت" },
  discount: { en: "Promo discount", ar: "خصم الكوبون" },

  // Coupon
  coupon_title: { en: "Promo code", ar: "كود الخصم" },
  coupon_placeholder: { en: "Enter promo code", ar: "أدخل كود الخصم" },
  coupon_apply: { en: "Apply", ar: "تطبيق" },
  coupon_applied: { en: "Promo NEWART10 applied — 10% off.", ar: "تم تطبيق كود NEWART10 — خصم 10%." },
  coupon_invalid: { en: "Invalid promo code.", ar: "كود الخصم غير صالح." },
  coupon_remove: { en: "Remove", ar: "إزالة" },

  // Portfolio
  pf_eyebrow: { en: "Portfolio", ar: "أعمالنا" },
  pf_title: { en: "Recent productions & sets", ar: "نماذج صور للعرض" },
  pf_sub: { en: "A curated selection of recent shoots, sets and locations.", ar: "مجموعة مختارة من أحدث جلساتنا ومواقعنا." },

  // Store
  store_eyebrow: { en: "Studio Services", ar: "خدمات الاستوديو" },
  store_title: { en: "Ready-made session packages", ar: "باقات جلسات جاهزة" },
  store_sub: { en: "Purchase complete sessions tailored to your project.", ar: "اشترِ جلسات متكاملة مصممة لمشروعك." },
  store_personal_t: { en: "Personal Sessions", ar: "جلسات شخصية" },
  store_personal_d: { en: "Polished personal portraits with styling guidance.", ar: "جلسات بورتريه شخصية احترافية مع توجيه التنسيق." },
  store_product_t: { en: "Product Sessions", ar: "جلسات منتجات" },
  store_product_d: { en: "E-commerce-ready product photography with controlled lighting.", ar: "تصوير منتجات جاهز للتجارة الإلكترونية بإضاءة مضبوطة." },
  store_podcast_t: { en: "Podcast Sessions", ar: "بودكاست" },
  store_podcast_d: { en: "Full podcast set-up with multi-cam and audio engineering.", ar: "تجهيز بودكاست متكامل بكاميرات متعددة وهندسة صوت." },
  store_f_pers_1: { en: "2-hour styled portrait session", ar: "جلسة بورتريه منسقة لساعتين" },
  store_f_pers_2: { en: "Pro photographer & lighting", ar: "مصور محترف وإضاءة" },
  store_f_pers_3: { en: "20 retouched final images", ar: "20 صورة نهائية معدّلة" },
  store_f_prod_1: { en: "Tabletop & cyclorama options", ar: "خيارات تصوير منتجات وسايكلوراما" },
  store_f_prod_2: { en: "Background & prop styling", ar: "تنسيق الخلفيات والإكسسوارات" },
  store_f_prod_3: { en: "30 edited product shots", ar: "30 صورة منتج معدّلة" },
  store_f_pod_1: { en: "3-cam podcast recording", ar: "تسجيل بودكاست بثلاث كاميرات" },
  store_f_pod_2: { en: "Lapel mics & mixer", ar: "ميكروفونات لاسلكية ومكسر صوت" },
  store_f_pod_3: { en: "Edited episode delivery", ar: "تسليم حلقة معدّلة" },
  store_from: { en: "From", ar: "ابتداءً من" },
  store_add: { en: "Add to Booking", ar: "أضف إلى الحجز" },
  store_added: { en: "Added ✓", ar: "تمت الإضافة ✓" },

  // FAB
  fab_label: { en: "Book Now", ar: "احجز الآن" },

  // Footer
  ft_tag: { en: "Where productions feel premium and bookings feel effortless.", ar: "حيث يكون الإنتاج فاخراً والحجز سهلاً." },
  ft_contact: { en: "Contact", ar: "تواصل" },
  ft_email: { en: "Email", ar: "البريد الإلكتروني" },
  ft_phone: { en: "Phone", ar: "الهاتف" },
  ft_whatsapp: { en: "WhatsApp", ar: "واتساب" },
  ft_address: { en: "Address", ar: "العنوان" },
  ft_address_value: { en: "Islamabad, Al Mansoura, Riyadh", ar: "إسلام أباد، المنصورة، الرياض" },
  ft_follow: { en: "Follow", ar: "تابعنا" },
  ft_rights: { en: "© 2026 NewArt Studio · All rights reserved", ar: "© 2026 استوديو نيو آرت · جميع الحقوق محفوظة" },

  sar: { en: "SAR", ar: "ريال" },
};

type I18n = { lang: Lang; setLang: (l: Lang) => void; t: (k: keyof typeof T) => string; dir: "ltr" | "rtl" };
const I18nCtx = createContext<I18n>({ lang: "en", setLang: () => {}, t: (k) => T[k]?.en ?? String(k), dir: "ltr" });
const useI18n = () => useContext(I18nCtx);

/* -------------------- Add-ons / Inclusions data -------------------- */
type AddOn = { id: string; key: keyof typeof T; price: number; perHour: boolean; icon: any };
const ADDONS: AddOn[] = [
  { id: "photographer", key: "ao_photographer", price: 200, perHour: true, icon: Camera },
  { id: "lens", key: "ao_lens", price: 150, perHour: false, icon: Aperture },
  { id: "lighting", key: "ao_lighting", price: 100, perHour: false, icon: Lightbulb },
  { id: "cstand", key: "ao_stand", price: 50, perHour: false, icon: Wrench },
  { id: "autocue", key: "ao_autocue", price: 100, perHour: false, icon: Monitor },
];

const INCLUDED: { icon: any; key: keyof typeof T }[] = [
  { icon: Wifi, key: "inc_wifi" },
  { icon: Sparkles, key: "inc_makeup" },
  { icon: Palette, key: "inc_styling" },
  { icon: Mic2, key: "inc_triggers" },
  { icon: Volume2, key: "inc_sound" },
];

const POLICY_KEYS: { t: keyof typeof T; b: keyof typeof T }[] = [
  { t: "pol1_t", b: "pol1_b" },
  { t: "pol2_t", b: "pol2_b" },
  { t: "pol3_t", b: "pol3_b" },
];

/* -------------------- Root -------------------- */
function Index() {
  const [lang, setLangState] = useState<Lang>("ar");
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const sl = (typeof window !== "undefined" && localStorage.getItem("na_lang")) as Lang | null;
    const st = (typeof window !== "undefined" && localStorage.getItem("na_theme")) as "dark" | "light" | null;
    if (sl) setLangState(sl);
    if (st) setTheme(st);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    localStorage.setItem("na_lang", lang);
  }, [lang]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("na_theme", theme);
  }, [theme]);

  const i18n: I18n = useMemo(() => ({
    lang,
    setLang: setLangState,
    dir: lang === "ar" ? "rtl" : "ltr",
    t: (k) => (T[k] ? T[k][lang] : String(k)),
  }), [lang]);

  return (
    <I18nCtx.Provider value={i18n}>
      <div className="min-h-screen bg-background text-foreground isolate" dir={i18n.dir}>
        <FloatingControls theme={theme} setTheme={setTheme} />
        <Hero />
        <main className="relative z-10 bg-background">
          <Portfolio />
          <Booking />
          <StoreServices />
          <Footer />
        </main>
        <BookingFAB />
      </div>
    </I18nCtx.Provider>
  );
}


/* -------------------- Floating Controls -------------------- */
function FloatingControls({ theme, setTheme }: { theme: "dark" | "light"; setTheme: (t: "dark" | "light") => void }) {
  const { lang, setLang } = useI18n();
  return (
    <div className="fixed top-4 end-4 z-50 flex items-center gap-2 rounded-full bg-card/80 backdrop-blur-xl ring-1 ring-border shadow-soft px-2 py-2">
      <button
        onClick={() => setLang(lang === "en" ? "ar" : "en")}
        className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold text-foreground hover:bg-muted transition"
        aria-label="Toggle language"
      >
        <Languages className="h-4 w-4 text-accent" />
        {lang === "en" ? "العربية" : "English"}
      </button>
      <div className="h-5 w-px bg-border" />
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="grid h-8 w-8 place-items-center rounded-full hover:bg-muted text-foreground transition"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? <Sun className="h-4 w-4 text-accent" /> : <Moon className="h-4 w-4 text-primary" />}
      </button>
    </div>
  );
}

/* -------------------- HERO -------------------- */
function Hero() {
  const { t, lang } = useI18n();
  return (
    <header className="relative isolate overflow-hidden bg-ink text-ink-foreground">
      {/* Background Video */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <iframe
          src="https://drive.google.com/file/d/1fY2GBHtYfVoPSuOTIQnOP-QxCcQLKG0V/preview?autoplay=1&mute=1&muted=1"
          allow="autoplay; encrypted-media"
          className="absolute left-1/2 top-1/2 h-[140%] w-[180%] -translate-x-1/2 -translate-y-1/2 border-0 pointer-events-none"
          title="NewArt Studio background"
          tabIndex={-1}
        />
      </div>
      <div className="absolute inset-0 bg-ink/55" />
      <div className="absolute inset-0 bg-mesh opacity-40" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_0%,var(--ink)_85%)]" />

      <div className="relative mx-auto max-w-7xl px-6 pt-6 pb-24 sm:pb-32">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-white/10 px-3 py-2 backdrop-blur ring-1 ring-white/15">
              <img src={logoAsset.url} alt="NewArt Studio" className="h-8 w-auto" />
            </div>
          </div>
          <div className="hidden items-center gap-8 text-sm text-white/70 md:flex">
            <a href="#showreel" className="hover:text-white transition">{t("nav_showreel")}</a>
            <a href="#booking" className="hover:text-white transition">{t("nav_book")}</a>
          </div>
          <div aria-hidden className="h-8" />

        </nav>

        <div className="mt-20 grid items-end gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/70 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              {t("hero_location")}
            </div>
            <h1 className="mt-6 text-5xl font-bold leading-[1.05] sm:text-6xl lg:text-7xl">
              {lang === "en" ? (
                <>
                  {t("hero_h1_a")} <span className="text-grad-brand">{t("hero_h1_b")}</span><br />
                  {t("hero_h1_c")} <span className="text-grad-brand">{t("hero_h1_d")}</span>.
                </>
              ) : (
                <>
                  {t("hero_h1_a")} <span className="text-grad-brand">{t("hero_h1_b")}</span><br />
                  {t("hero_h1_c")} <span className="text-grad-brand">{t("hero_h1_d")}</span>.
                </>
              )}
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/70">
              {t("hero_sub")}
              <span className="block mt-2 text-white/55 text-base">{t("hero_sub2")}</span>
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href="#booking"
                className="group inline-flex items-center gap-3 rounded-full bg-accent px-7 py-4 text-base font-bold text-accent-foreground shadow-glow transition hover:shadow-elegant"
              >
                {t("hero_cta")}
                <ArrowDown className="h-5 w-5 transition group-hover:translate-y-0.5" />
              </a>
              <a href="#showreel" className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white">
                <PlayCircle className="h-5 w-5" /> {t("hero_watch")}
              </a>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-6 max-w-md">
              {[
                { k: "1,200+", v: t("stat_prod") },
                { k: "24/7", v: t("stat_conc") },
                { k: "4.9★", v: t("stat_score") },
              ].map((s) => (
                <div key={s.v}>
                  <div className="text-2xl font-bold text-white">{s.k}</div>
                  <div className="text-xs uppercase tracking-wider text-white/55">{s.v}</div>
                </div>
              ))}
            </div>
          </div>

          <div id="showreel" className="lg:col-span-5">
            <div className="group relative aspect-[4/5] overflow-hidden rounded-3xl ring-1 ring-white/15 shadow-elegant">
              {/* Live video */}
              <iframe
                src="https://drive.google.com/file/d/1fY2GBHtYfVoPSuOTIQnOP-QxCcQLKG0V/preview?autoplay=1&mute=1&muted=1"
                allow="autoplay; encrypted-media"
                className="absolute inset-0 h-full w-full border-0"
                title="NewArt Studio showreel"
                tabIndex={-1}
              />
              {/* Soft gradient overlay for legibility (non-blocking) */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/60 to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/75 to-transparent" />

              <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-6">
                <div className="flex items-center justify-between text-white/90 text-xs uppercase tracking-widest">
                  <span className="rounded-full bg-black/40 px-3 py-1 backdrop-blur ring-1 ring-white/20 inline-flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                    {t("live_tour")}
                  </span>
                  <span className="flex items-center gap-1 rounded-full bg-black/40 px-3 py-1 backdrop-blur ring-1 ring-white/20">
                    <MapPin className="h-3.5 w-3.5" /> {t("studio_a")}
                  </span>
                </div>
                <div>
                  <div className="text-white text-2xl font-bold drop-shadow-lg">{t("showreel_title")}</div>
                  <div className="mt-1 text-white/85 text-sm drop-shadow">{t("showreel_sub")}</div>
                  <div className="mt-4 flex items-center gap-2">
                    {[0,1,2,3].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded-full ${i===1?"bg-accent":"bg-white/30"}`} />
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
  const { t } = useI18n();
  const [step, setStep] = useState(1);
  const [date, setDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [hours, setHours] = useState(2);
  const [addons, setAddons] = useState<Record<string, boolean>>({});
  const [policies, setPolicies] = useState<Record<number, boolean>>({});
  const [payment, setPayment] = useState<"apple" | "tabby" | "tamara" | "bank">("apple");
  const [confirmed, setConfirmed] = useState<null | { ref: string }>(null);
  const [storeItems, setStoreItems] = useState<{ id: string; name: string; price: number }[]>([]);
  const [promoInput, setPromoInput] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoPending, setPromoPending] = useState(false);
  const validatePromoFn = useServerFn(validatePromo);

  // Listen for store add events
  useEffect(() => {
    function onAdd(e: Event) {
      const det = (e as CustomEvent).detail as { id: string; name: string; price: number };
      setStoreItems((prev) => prev.find((p) => p.id === det.id) ? prev : [...prev, det]);
      document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
    }
    window.addEventListener("na:add-store", onAdd as EventListener);
    return () => window.removeEventListener("na:add-store", onAdd as EventListener);
  }, []);

  const spacePrice = getSpacePrice(hours);
  const addonItems = ADDONS.filter(a => addons[a.id]);
  const addonsTotal = addonItems.reduce((sum, a) => sum + (a.perHour ? a.price * hours : a.price), 0);
  const insurance = addonItems.length > 0 ? 500 : 200;
  const storeTotal = storeItems.reduce((s, x) => s + x.price, 0);
  const subtotal = spacePrice + addonsTotal + insurance + storeTotal;
  // Discount is server-validated; if subtotal changes after applying, re-validate.
  const discount = promoApplied ? Math.min(promoDiscount, subtotal) : 0;
  const total = subtotal - discount;
  const longSession = hours >= 7;

  // Re-validate server-side if subtotal changes while a promo is applied.
  useEffect(() => {
    if (!promoApplied) return;
    let cancelled = false;
    validatePromoFn({ data: { code: promoInput, subtotal } })
      .then((res) => {
        if (cancelled) return;
        if (res.valid) setPromoDiscount(res.discount);
        else { setPromoApplied(false); setPromoDiscount(0); }
      })
      .catch(() => {});
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subtotal, promoApplied]);

  async function applyPromo() {
    setPromoPending(true);
    setPromoError(false);
    try {
      const res = await validatePromoFn({ data: { code: promoInput, subtotal } });
      if (res.valid) {
        setPromoApplied(true);
        setPromoDiscount(res.discount);
        setPromoError(false);
      } else {
        setPromoApplied(false);
        setPromoDiscount(0);
        setPromoError(true);
      }
    } catch {
      setPromoApplied(false);
      setPromoDiscount(0);
      setPromoError(true);
    } finally {
      setPromoPending(false);
    }
  }
  function removePromo() {
    setPromoApplied(false); setPromoError(false); setPromoInput(""); setPromoDiscount(0);
  }

  const canNext = useMemo(() => {
    if (step === 1) return !!date && !!startTime && hours > 0;
    if (step === 3) return POLICY_KEYS.every((_, i) => policies[i]);
    return true;
  }, [step, date, startTime, hours, policies]);

  function confirm() {
    const ref = "NA-" + Math.random().toString(36).slice(2, 8).toUpperCase();
    setConfirmed({ ref });
  }

  return (
    <section id="booking" className="relative mx-auto max-w-7xl px-6 py-20 sm:py-28">
      <div className="mb-12 max-w-2xl">
        <div className="text-xs uppercase tracking-[0.25em] text-accent font-bold">{t("section_eyebrow")}</div>
        <h2 className="mt-3 text-4xl sm:text-5xl font-bold text-primary">{t("section_title")}</h2>
        <p className="mt-4 text-muted-foreground">{t("section_sub")}</p>
      </div>

      <Stepper step={step} setStep={setStep} />

      {/* Compensation badges */}
      <div className="mt-6 flex flex-wrap gap-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-4 py-2 text-xs sm:text-sm font-bold ring-1 ring-primary/20">
          <Clock className="h-4 w-4" /> {t("prayer_badge")}
        </div>
        {longSession && (
          <div className="inline-flex items-center gap-2 rounded-full bg-accent/15 text-accent px-4 py-2 text-xs sm:text-sm font-bold ring-1 ring-accent/30">
            <Sparkles className="h-4 w-4" /> {t("compensation_badge")}
          </div>
        )}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_380px]">
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
            {step === 4 && (
              <Step4
                payment={payment} setPayment={setPayment} total={total}
                promoInput={promoInput} setPromoInput={setPromoInput}
                promoApplied={promoApplied} promoError={promoError}
                applyPromo={applyPromo} removePromo={removePromo}
              />
            )}
          </div>

          <div className="flex items-center justify-between border-t border-border bg-muted/30 px-6 sm:px-10 py-5">
            <button
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-foreground/70 disabled:opacity-40 hover:text-foreground transition"
            >
              <ChevronLeft className="h-4 w-4 rtl:rotate-180" /> {t("back")}
            </button>
            {step < 4 ? (
              <button
                onClick={() => canNext && setStep(step + 1)}
                disabled={!canNext}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-elegant disabled:opacity-40 transition hover:bg-primary/90"
              >
                {t("continue")} <ChevronRight className="h-4 w-4 rtl:rotate-180" />
              </button>
            ) : (
              <button
                onClick={confirm}
                className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3 text-sm font-bold text-accent-foreground shadow-glow transition hover:scale-[1.02]"
              >
                {t("confirm_pay")} · {total} {t("sar")}
              </button>
            )}
          </div>
        </div>

        <Summary
          date={date} startTime={startTime} hours={hours}
          spacePrice={spacePrice} addonItems={addonItems} addonsTotal={addonsTotal}
          insurance={insurance} total={total}
          storeItems={storeItems} removeStoreItem={(id: string) => setStoreItems((p) => p.filter(x => x.id !== id))}
          discount={discount} promoApplied={promoApplied}
          longSession={longSession}
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
  const { t } = useI18n();
  const steps = [
    { n: 1, key: "step_date" as const, icon: CalendarIcon },
    { n: 2, key: "step_equip" as const, icon: Camera },
    { n: 3, key: "step_policies" as const, icon: ShieldCheck },
    { n: 4, key: "step_checkout" as const, icon: CreditCard },
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
                {t(s.key)}
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
  const { t } = useI18n();
  const [cursor, setCursor] = useState(() => { const d = new Date(); d.setDate(1); return d; });

  const now = new Date();
  const isToday = !!date && date.toDateString() === now.toDateString();
  const minStartHourToday = now.getHours() + 2 + (now.getMinutes() > 0 ? 1 : 0);

  const reserved = useMemo(() => date ? mockReservedSlots(date) : [], [date]);

  const slots = useMemo(() => {
    if (!date) return [];
    const day = date.getDay();
    const isFri = day === 5;
    const startH = isFri ? 16 : 9;
    const endH = 22;
    const arr: { time: string; reserved: boolean; tooLate: boolean }[] = [];
    for (let h = startH; h < endH; h++) {
      const time = `${String(h).padStart(2, "0")}:00`;
      const isReserved = reserved.includes(time);
      const tooLate = isToday && h < minStartHourToday;
      arr.push({ time, reserved: isReserved, tooLate });
    }
    return arr;
  }, [date, reserved, isToday, minStartHourToday]);

  const allBlocked = slots.length > 0 && slots.every(s => s.reserved || s.tooLate);

  const maxHours = useMemo(() => {
    if (!date || !startTime) return MAX_HOURS;
    const sh = parseInt(startTime.split(":")[0], 10);
    return Math.min(MAX_HOURS, 22 - sh);
  }, [date, startTime]);

  useEffect(() => {
    if (hours > maxHours) setHours(maxHours);
  }, [maxHours, hours, setHours]);

  const currentSpace = getSpacePrice(hours);
  const showStrike = hours === 1;

  return (
    <div className="space-y-8">
      <SectionHead eyebrowKey="s1_eyebrow" titleKey="s1_title" subKey="s1_sub" />

      <div className="grid gap-8 lg:grid-cols-2">
        <CalendarGrid cursor={cursor} setCursor={setCursor} selected={date} onSelect={(d: Date) => { setDate(d); setStartTime(null); }} />

        <div className="space-y-6">
          <div>
            <Label icon={Clock}>{t("start_time")}</Label>
            {!date ? (
              <div className="mt-3 rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground">
                {t("pick_date_first")}
              </div>
            ) : (
              <>
                <div className="mt-3 grid grid-cols-4 gap-2">
                  {slots.map((s) => {
                    const disabled = s.reserved || s.tooLate;
                    const isSel = startTime === s.time;
                    return (
                      <button
                        key={s.time}
                        onClick={() => !disabled && setStartTime(s.time)}
                        disabled={disabled}
                        title={s.reserved ? t("reserved") : s.tooLate ? t("lead_time_note") : ""}
                        className={`relative rounded-xl py-2.5 text-sm font-medium ring-1 transition overflow-hidden
                          ${isSel ? "bg-primary text-primary-foreground ring-primary shadow-elegant"
                            : s.reserved ? "cursor-not-allowed bg-destructive/10 text-destructive/70 ring-destructive/30"
                            : s.tooLate ? "cursor-not-allowed bg-muted text-muted-foreground/50 ring-border line-through"
                            : "bg-background ring-border hover:ring-primary/50"}`}
                      >
                        {s.reserved && (
                          <span aria-hidden className="pointer-events-none absolute inset-0 opacity-40"
                            style={{ backgroundImage: "repeating-linear-gradient(45deg, currentColor 0 2px, transparent 2px 8px)" }} />
                        )}
                        <span className="relative">{s.time}</span>
                        {s.reserved && (
                          <span className="relative block text-[9px] uppercase tracking-wider mt-0.5">{t("reserved")}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
                {isToday && (
                  <p className="mt-3 text-xs text-accent font-bold">⏱ {t("lead_time_note")}</p>
                )}
                {allBlocked && (
                  <p className="mt-2 text-xs text-destructive font-bold">{t("no_slots_today")}</p>
                )}
              </>
            )}
            {date && (
              <p className="mt-3 text-xs text-muted-foreground">{t("working_hours")}</p>
            )}
          </div>

          <div>
            <Label icon={Clock}>{t("hours_label")}</Label>
            <div className="mt-3 flex items-center gap-3">
              <button
                onClick={() => setHours(Math.max(1, hours - 1))}
                className="grid h-12 w-12 place-items-center rounded-full bg-muted text-foreground hover:bg-accent hover:text-accent-foreground transition"
              >−</button>
              <div className="flex-1 rounded-2xl bg-muted/60 text-center py-3">
                <div className="text-3xl font-bold text-primary">{hours}</div>
                <div className="text-xs text-muted-foreground">{hours > 1 ? t("hours_unit") : t("hour_unit")}</div>
              </div>
              <button
                onClick={() => setHours(Math.min(maxHours, hours + 1))}
                className="grid h-12 w-12 place-items-center rounded-full bg-muted text-foreground hover:bg-accent hover:text-accent-foreground transition"
              >+</button>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{t("total_space")}</span>
              <span className="flex items-center gap-2">
                {showStrike && (
                  <span className="text-muted-foreground line-through">{ORIGINAL_1H_PRICE} {t("sar")}</span>
                )}
                <span className="font-bold text-primary text-base">{currentSpace} {t("sar")}</span>
                {showStrike && (
                  <span className="rounded-full bg-accent/15 text-accent px-2 py-0.5 font-bold">-{ORIGINAL_1H_PRICE - currentSpace} {t("sar")}</span>
                )}
              </span>
            </div>

            {/* Pricing matrix preview */}
            <div className="mt-4 grid grid-cols-4 gap-1.5">
              {Object.entries(HOUR_PRICING).map(([h, p]) => {
                const hv = parseInt(h);
                const active = hv === hours;
                const disabled = hv > maxHours;
                return (
                  <button
                    key={h}
                    onClick={() => !disabled && setHours(hv)}
                    disabled={disabled}
                    title={disabled ? t("working_hours") : ""}
                    className={`rounded-lg px-2 py-2 text-center ring-1 transition ${
                      active ? "bg-primary text-primary-foreground ring-primary shadow-elegant"
                        : disabled ? "cursor-not-allowed bg-muted text-muted-foreground/50 ring-border line-through opacity-60"
                        : "bg-background ring-border hover:ring-primary/50"
                    }`}
                  >
                    <div className="text-[10px] font-bold opacity-80">{h}h</div>
                    <div className="text-xs font-bold">{p}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


function CalendarGrid({ cursor, setCursor, selected, onSelect }: any) {
  const { lang } = useI18n();
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date(); today.setHours(0,0,0,0);

  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  const monthName = cursor.toLocaleString(lang === "ar" ? "ar" : "en-US", { month: "long", year: "numeric" });
  const dayLabels = lang === "ar"
    ? ["أحد","إثن","ثلا","أرب","خمي","جمع","سبت"]
    : ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  return (
    <div className="rounded-2xl bg-muted/40 p-5 ring-1 ring-border">
      <div className="flex items-center justify-between">
        <button onClick={() => setCursor(new Date(year, month - 1, 1))} className="grid h-9 w-9 place-items-center rounded-full hover:bg-background transition">
          <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
        </button>
        <div className="font-bold text-primary">{monthName}</div>
        <button onClick={() => setCursor(new Date(year, month + 1, 1))} className="grid h-9 w-9 place-items-center rounded-full hover:bg-background transition">
          <ChevronRight className="h-4 w-4 rtl:rotate-180" />
        </button>
      </div>
      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-[10px] uppercase tracking-wider text-muted-foreground">
        {dayLabels.map(d => <div key={d}>{d}</div>)}
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
  const { t } = useI18n();
  const anyAddon = Object.values(addons).some(Boolean);
  return (
    <div className="space-y-8">
      <SectionHead eyebrowKey="s2_eyebrow" titleKey="s2_title" subKey="s2_sub" />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 p-6 ring-1 ring-primary/20">
          <div className="flex items-center gap-2 text-primary">
            <Check className="h-5 w-5" />
            <h3 className="font-bold">{t("included_title")}</h3>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{t("included_sub")}</p>
          <ul className="mt-5 space-y-3">
            {INCLUDED.map((it) => (
              <li key={it.key} className="flex items-center gap-3 rounded-xl bg-background/60 px-4 py-3 ring-1 ring-border">
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
                  <it.icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium">{t(it.key)}</div>
                </div>
                <span className="text-xs font-bold text-primary">{t("free")}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="flex items-center gap-2 text-accent">
            <Sparkles className="h-5 w-5" />
            <h3 className="font-bold">{t("addons_title")}</h3>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{t("addons_sub")}</p>
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
                      <div className="text-sm font-medium truncate">{t(a.key)}</div>
                    </div>
                    <div className="text-end shrink-0">
                      <div className="text-sm font-bold text-primary">+{a.price} {t("sar")}</div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        {a.perHour ? `× ${hours}h = ${lineTotal}` : t("flat")}
                      </div>
                    </div>
                  </label>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className={`relative overflow-hidden rounded-2xl p-6 ring-1 transition
        ${anyAddon ? "bg-accent/10 ring-accent" : "bg-primary/5 ring-primary/20"}`}>
        <div className="flex items-center gap-4">
          <div className={`grid h-12 w-12 place-items-center rounded-xl ${anyAddon ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground"}`}>
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold">{t("insurance_title")}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {anyAddon ? t("insurance_high") : t("insurance_low")}
            </div>
          </div>
          <div className="text-end shrink-0">
            <div className="text-2xl font-bold text-primary">{anyAddon ? 500 : 200} {t("sar")}</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{t("refundable")}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------- STEP 3 -------------------- */
function Step3({ policies, setPolicies }: any) {
  const { t } = useI18n();
  return (
    <div className="space-y-8">
      <SectionHead eyebrowKey="s3_eyebrow" titleKey="s3_title" subKey="s3_sub" />

      <div className="rounded-2xl border-s-4 border-accent bg-accent/10 p-5">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 h-5 w-5 text-accent shrink-0" />
          <div>
            <div className="font-bold text-foreground">{t("deposit_title")}</div>
            <p className="mt-1 text-sm text-muted-foreground">{t("deposit_body")}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {POLICY_KEYS.map((p, i) => {
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
                  <h4 className="font-bold text-foreground">{t(p.t)}</h4>
                  <p className="mt-2 text-sm text-muted-foreground">{t(p.b)}</p>
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
function Step4({ payment, setPayment, total, promoInput, setPromoInput, promoApplied, promoError, applyPromo, removePromo }: any) {
  const { t } = useI18n();
  const tabs = [
    { id: "apple", key: "pay_apple" as const, icon: Smartphone },
    { id: "tabby", key: "pay_tabby" as const, icon: CreditCard },
    { id: "tamara", key: "pay_tamara" as const, icon: CreditCard },
    { id: "bank", key: "pay_bank" as const, icon: Banknote },
  ] as const;
  return (
    <div className="space-y-8">
      <SectionHead eyebrowKey="s4_eyebrow" titleKey="s4_title" subKey="s4_sub" />

      {/* Promo code */}
      <div className="rounded-2xl bg-muted/40 ring-1 ring-border p-5">
        <Label icon={Sparkles}>{t("coupon_title")}</Label>
        <div className="mt-3 flex gap-2">
          <input
            type="text"
            value={promoInput}
            onChange={(e) => setPromoInput(e.target.value)}
            placeholder={t("coupon_placeholder")}
            disabled={promoApplied}
            className="flex-1 rounded-xl bg-background ring-1 ring-border px-4 py-3 text-sm font-mono uppercase tracking-wider focus:outline-none focus:ring-primary disabled:opacity-60"
          />
          {promoApplied ? (
            <button onClick={removePromo} className="rounded-xl bg-muted ring-1 ring-border px-5 text-sm font-bold text-foreground hover:bg-destructive/10 hover:text-destructive transition">
              {t("coupon_remove")}
            </button>
          ) : (
            <button onClick={applyPromo} className="rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition">
              {t("coupon_apply")}
            </button>
          )}
        </div>
        {promoApplied && (
          <p className="mt-3 text-xs font-bold text-primary inline-flex items-center gap-2">
            <Check className="h-4 w-4" /> {t("coupon_applied")}
          </p>
        )}
        {promoError && !promoApplied && (
          <p className="mt-3 text-xs font-bold text-destructive">{t("coupon_invalid")}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {tabs.map((tb) => {
          const active = payment === tb.id;
          return (
            <button key={tb.id} onClick={() => setPayment(tb.id)}
              className={`flex flex-col items-center gap-2 rounded-2xl px-4 py-5 ring-1 transition
                ${active ? "bg-primary text-primary-foreground ring-primary shadow-elegant" : "bg-background ring-border hover:ring-primary/40"}`}>
              <tb.icon className="h-6 w-6" />
              <span className="text-xs font-bold text-center">{t(tb.key)}</span>
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
  const { t } = useI18n();
  return (
    <div className="mx-auto max-w-md text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-foreground text-background">
        <Smartphone className="h-8 w-8" />
      </div>
      <p className="mt-4 text-sm text-muted-foreground">{t("apple_hint").replace("{n}", String(total))}</p>
      <button className="mt-5 w-full rounded-xl bg-foreground text-background py-3 font-bold">
        {t("apple_btn")}
      </button>
    </div>
  );
}

function SplitMock({ total, brand, color }: { total: number; brand: string; color: string }) {
  const { t } = useI18n();
  const split = Math.ceil(total / 4);
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">{brand} · {t("split_label")}</div>
          <div className="text-2xl font-bold text-primary">{split} {t("sar")} <span className="text-sm font-medium text-muted-foreground">{t("split_payments")}</span></div>
        </div>
        <div className="rounded-full px-3 py-1 text-xs font-bold text-white" style={{ background: color }}>{t("no_interest")}</div>
      </div>
      <div className="mt-5 grid grid-cols-4 gap-2">
        {[0,1,2,3].map(i => (
          <div key={i} className="rounded-xl bg-background p-3 ring-1 ring-border text-center">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{t("payment_n")} {i+1}</div>
            <div className="mt-1 font-bold text-primary">{split} {t("sar")}</div>
            <div className="text-[10px] text-muted-foreground">{i === 0 ? t("today") : `+${i*30}d`}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BankTransfer({ total }: { total: number }) {
  const { t } = useI18n();
  const [file, setFile] = useState<string | null>(null);
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Info label={t("bank_name")} value="Al Rajhi Bank" />
        <Info label={t("account_name")} value="NewArt Studio LLC" />
        <Info label={t("iban")} value="SA03 8000 0000 6080 1016 7519" mono />
        <Info label={t("amount_due")} value={`${total} ${t("sar")}`} highlight />
      </div>
      <label className="flex cursor-pointer items-center gap-4 rounded-2xl border-2 border-dashed border-border bg-background p-5 hover:border-primary transition">
        <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
          <Upload className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold">{file ? file : t("upload_receipt")}</div>
          <div className="text-xs text-muted-foreground">{t("upload_hint")}</div>
        </div>
        <input type="file" className="sr-only" onChange={(e) => setFile(e.target.files?.[0]?.name ?? null)} />
        <span className="rounded-full bg-primary px-4 py-2 text-xs font-bold text-primary-foreground">{t("choose_file")}</span>
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
function Summary({ date, startTime, hours, spacePrice, addonItems, addonsTotal, insurance, total, storeItems = [], removeStoreItem, discount = 0, promoApplied = false, longSession = false }: any) {
  const { t, lang } = useI18n();
  const showStrike1h = hours === 1;
  return (
    <aside className="lg:sticky lg:top-6 h-fit rounded-3xl bg-ink text-ink-foreground shadow-elegant overflow-hidden">
      <div className="relative p-6 bg-grad-brand">
        <div className="text-[10px] uppercase tracking-[0.25em] text-white/80">{t("live_estimate")}</div>
        <div className="mt-1 text-3xl font-bold text-white">{total} <span className="text-base font-medium text-white/80">{t("sar")}</span></div>
        <div className="mt-1 text-xs text-white/70">{t("vat_inclusive")}</div>
      </div>

      <div className="p-6 space-y-5 text-sm">
        <Row label={t("date")} value={date ? date.toLocaleDateString(lang === "ar" ? "ar" : "en-GB", { weekday:"short", day:"numeric", month:"short", year:"numeric" }) : "—"} />
        <Row label={t("start")} value={startTime ?? "—"} />
        <Row label={t("hours_short")} value={`${hours} ${t("hr")}`} />

        {/* Compensation badges in summary */}
        <div className="flex flex-col gap-2">
          <div className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-[11px] text-white/80">
            <Clock className="h-3.5 w-3.5 text-accent" /> {t("prayer_badge")}
          </div>
          {longSession && (
            <div className="inline-flex items-center gap-2 rounded-lg bg-accent/20 px-3 py-2 text-[11px] text-white font-bold">
              <Sparkles className="h-3.5 w-3.5" /> {t("compensation_badge")}
            </div>
          )}
        </div>

        <Divider />

        <div className="flex items-start justify-between gap-3">
          <div className="text-white/80">{t("space_total_label")} ({hours}h)</div>
          <div className="text-end">
            {showStrike1h && (
              <div className="text-[11px] text-white/40 line-through">{ORIGINAL_1H_PRICE} {t("sar")}</div>
            )}
            <div className="font-bold text-white">{spacePrice} {t("sar")}</div>
          </div>
        </div>

        {addonItems.length > 0 && (
          <>
            <Divider />
            <div>
              <div className="text-[10px] uppercase tracking-wider text-white/50 mb-2">{t("addons_word")}</div>
              <ul className="space-y-2">
                {addonItems.map((a: AddOn) => (
                  <li key={a.id} className="flex items-center justify-between gap-2">
                    <span className="text-white/80 truncate">{t(a.key)}</span>
                    <span className="font-bold shrink-0">{a.perHour ? a.price * hours : a.price} {t("sar")}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
                <span className="text-white/80">{t("addons_total")}</span>
                <span className="font-bold">{addonsTotal} {t("sar")}</span>
              </div>
            </div>
          </>
        )}

        {storeItems.length > 0 && (
          <>
            <Divider />
            <div>
              <div className="text-[10px] uppercase tracking-wider text-white/50 mb-2">{t("store_eyebrow")}</div>
              <ul className="space-y-2">
                {storeItems.map((s: any) => (
                  <li key={s.id} className="flex items-center justify-between gap-2">
                    <span className="text-white/80 truncate">{s.name}</span>
                    <span className="flex items-center gap-2 shrink-0">
                      <span className="font-bold">{s.price} {t("sar")}</span>
                      {removeStoreItem && (
                        <button onClick={() => removeStoreItem(s.id)} className="text-white/40 hover:text-destructive transition" aria-label="remove">
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        <Divider />
        <Row label={t("refundable_insurance")} value={`${insurance} ${t("sar")}`} sub={insurance === 500 ? t("premium_tier") : t("standard_tier")} />

        {promoApplied && discount > 0 && (
          <>
            <Divider />
            <div className="flex items-center justify-between text-accent font-bold">
              <span className="inline-flex items-center gap-2"><Sparkles className="h-4 w-4" /> {t("discount")} (NEWART10)</span>
              <span>−{discount} {t("sar")}</span>
            </div>
          </>
        )}

        <Divider />
        <div className="flex items-end justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-white/50">{t("final_total")}</div>
            <div className="text-2xl font-bold text-white">{total} {t("sar")}</div>
          </div>
          <div className="flex items-center gap-1 text-accent">
            {[0,1,2,3,4].map(i => <Star key={i} className="h-4 w-4 fill-accent" />)}
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
function SectionHead({ eyebrowKey, titleKey, subKey }: { eyebrowKey: keyof typeof T; titleKey: keyof typeof T; subKey: keyof typeof T }) {
  const { t } = useI18n();
  return (
    <div>
      <div className="text-[11px] uppercase tracking-[0.25em] font-bold text-accent">{t(eyebrowKey)}</div>
      <h3 className="mt-2 text-2xl sm:text-3xl font-bold text-primary">{t(titleKey)}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{t(subKey)}</p>
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
  const { t, lang } = useI18n();
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/60 backdrop-blur p-4 animate-in fade-in">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-card shadow-elegant ring-1 ring-border animate-in zoom-in-95">
        <button onClick={onClose} className="absolute end-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-muted text-foreground hover:bg-accent hover:text-accent-foreground transition">
          <X className="h-4 w-4" />
        </button>
        <div className="bg-grad-brand p-8 text-center text-white">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-white/20 backdrop-blur ring-4 ring-white/30">
            <PartyPopper className="h-10 w-10" />
          </div>
          <h3 className="mt-5 text-3xl font-bold">{t("booking_confirmed")}</h3>
          <p className="mt-1 text-white/85 text-sm">{t("see_you")}</p>
        </div>
        <div className="p-8 space-y-4">
          <div className="rounded-2xl bg-muted/40 p-5 text-center">
            <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{t("ref_no")}</div>
            <div className="mt-1 text-2xl font-bold text-primary font-mono">{info.ref}</div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <Box label={t("date")} value={date ? date.toLocaleDateString(lang === "ar" ? "ar" : "en-GB", { day:"numeric", month:"short" }) : "—"} />
            <Box label={t("start")} value={startTime ?? "—"} />
            <Box label={t("duration")} value={`${hours} ${hours > 1 ? t("hours_unit") : t("hour_unit")}`} />
            <Box label={t("total")} value={`${total} ${t("sar")}`} accent />
          </div>
          <p className="text-center text-xs text-muted-foreground pt-2">{t("confirmation_sent")}</p>
          <button onClick={onClose} className="w-full rounded-full bg-primary py-3 font-bold text-primary-foreground hover:bg-primary/90 transition">
            {t("done")}
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
  const { t } = useI18n();
  const phone = "+966530926745";
  const phoneDigits = "966530926745";
  return (
    <footer className="bg-ink text-ink-foreground">
      <div className="mx-auto max-w-7xl px-6 py-14 grid gap-10 md:grid-cols-3">
        <div>
          <div className="inline-block rounded-xl bg-white/10 px-3 py-2 ring-1 ring-white/15">
            <img src={logoAsset.url} alt="NewArt Studio" className="h-8 w-auto" />
          </div>
          <p className="mt-4 text-sm text-white/60 max-w-xs">{t("ft_tag")}</p>
          <div className="mt-5 flex items-center gap-3">
            <a
              href="https://www.instagram.com/newartksa/"
              target="_blank" rel="noopener noreferrer"
              aria-label="Instagram"
              className="grid h-10 w-10 place-items-center rounded-full bg-white/10 ring-1 ring-white/15 hover:bg-accent hover:text-accent-foreground transition"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href={`https://api.whatsapp.com/send?phone=${phoneDigits}`}
              target="_blank" rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="grid h-10 w-10 place-items-center rounded-full bg-white/10 ring-1 ring-white/15 hover:bg-accent hover:text-accent-foreground transition"
            >
              <MessageCircle className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div className="text-sm space-y-3">
          <div className="text-white font-bold uppercase tracking-wider text-xs">{t("ft_contact")}</div>
          <a href="mailto:info@newartksa.com" className="flex items-center gap-3 text-white/75 hover:text-white transition">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/10"><Mail className="h-4 w-4" /></span>
            <span className="min-w-0">
              <div className="text-[10px] uppercase tracking-wider text-white/50">{t("ft_email")}</div>
              <div className="truncate">info@newartksa.com</div>
            </span>
          </a>
          <a href={`tel:${phone}`} className="flex items-center gap-3 text-white/75 hover:text-white transition" dir="ltr">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/10"><Phone className="h-4 w-4" /></span>
            <span className="min-w-0">
              <div className="text-[10px] uppercase tracking-wider text-white/50">{t("ft_phone")}</div>
              <div>{phone}</div>
            </span>
          </a>
          <a
            href={`https://api.whatsapp.com/send?phone=${phoneDigits}`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 text-white/75 hover:text-white transition" dir="ltr"
          >
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/10"><MessageCircle className="h-4 w-4" /></span>
            <span className="min-w-0">
              <div className="text-[10px] uppercase tracking-wider text-white/50">{t("ft_whatsapp")}</div>
              <div>{phone}</div>
            </span>
          </a>
        </div>

        <div className="text-sm space-y-3">
          <div className="text-white font-bold uppercase tracking-wider text-xs">{t("ft_address")}</div>
          <a
            href="https://maps.app.goo.gl/VFGDzJsjJYUyuRbW8"
            target="_blank" rel="noopener noreferrer"
            className="flex items-start gap-3 text-white/75 hover:text-white transition"
          >
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/10 shrink-0"><MapPin className="h-4 w-4" /></span>
            <span className="min-w-0">
              <div className="text-[10px] uppercase tracking-wider text-white/50">{t("ft_address")}</div>
              <div>{t("ft_address_value")}</div>
              <div className="text-xs text-white/50 mt-1">Open in Google Maps →</div>
            </span>
          </a>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/50">
        {t("ft_rights")}
      </div>
    </footer>
  );
}

/* -------------------- Portfolio (masonry) -------------------- */


function Portfolio() {
  const { t } = useI18n();
  const tiles = [
    { h: "h-64", src: img001.url, label: "Editorial" },
    { h: "h-48", src: img002.url, label: "Product" },
    { h: "h-72", src: img003.url, label: "Podcast" },
    { h: "h-56", src: img004.url, label: "Fashion" },
    { h: "h-60", src: img005.url, label: "Events" },
    { h: "h-44", src: img006.url, label: "Panel" },
    { h: "h-52", src: img007.url, label: "Studio" },
    { h: "h-64", src: img008.url, label: "Cinema" },
  ];
  return (
    <section id="portfolio" className="relative mx-auto max-w-7xl px-6 py-20 sm:py-24">
      <div className="mb-10 max-w-2xl">
        <div className="text-xs uppercase tracking-[0.25em] text-accent font-bold">{t("pf_eyebrow")}</div>
        <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-primary">{t("pf_title")}</h2>
        <p className="mt-3 text-muted-foreground">{t("pf_sub")}</p>
      </div>
      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 [column-fill:_balance]">
        {tiles.map((tile, i) => (
          <div key={i} className={`mb-4 break-inside-avoid group relative overflow-hidden rounded-2xl ring-1 ring-border ${tile.h}`}>
            <img src={tile.src} alt={tile.label} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4 text-white">
              <div className="text-[10px] uppercase tracking-widest opacity-80">NewArt</div>
              <div className="font-bold">{tile.label}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}


/* -------------------- Store Services -------------------- */
function StoreServices() {
  const { t } = useI18n();
  const [added, setAdded] = useState<Record<string, boolean>>({});
  const services = [
    {
      id: "personal", title: t("store_personal_t"), desc: t("store_personal_d"),
      price: 1200, icon: Camera, accent: "from-primary to-primary/70",
      features: [t("store_f_pers_1"), t("store_f_pers_2"), t("store_f_pers_3")],
    },
    {
      id: "product", title: t("store_product_t"), desc: t("store_product_d"),
      price: 1800, icon: Aperture, accent: "from-accent to-accent/70",
      features: [t("store_f_prod_1"), t("store_f_prod_2"), t("store_f_prod_3")],
    },
    {
      id: "podcast", title: t("store_podcast_t"), desc: t("store_podcast_d"),
      price: 2200, icon: Mic2, accent: "from-primary via-accent to-primary",
      features: [t("store_f_pod_1"), t("store_f_pod_2"), t("store_f_pod_3")],
    },
  ];

  function addService(s: { id: string; title: string; price: number }) {
    window.dispatchEvent(new CustomEvent("na:add-store", { detail: { id: s.id, name: s.title, price: s.price } }));
    setAdded((p) => ({ ...p, [s.id]: true }));
    setTimeout(() => setAdded((p) => ({ ...p, [s.id]: false })), 2500);
  }

  return (
    <section id="services" className="relative mx-auto max-w-7xl px-6 py-20 sm:py-28">
      <div className="mb-12 max-w-2xl">
        <div className="text-xs uppercase tracking-[0.25em] text-accent font-bold">{t("store_eyebrow")}</div>
        <h2 className="mt-3 text-4xl sm:text-5xl font-bold text-primary">{t("store_title")}</h2>
        <p className="mt-4 text-muted-foreground">{t("store_sub")}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {services.map((s) => (
          <article key={s.id} className="group relative flex flex-col overflow-hidden rounded-3xl bg-card ring-1 ring-border shadow-soft hover:shadow-elegant transition">
            <div className={`relative h-40 bg-gradient-to-br ${s.accent} overflow-hidden`}>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.3),transparent_60%)]" />
              <div className="absolute inset-0 grid place-items-center">
                <s.icon className="h-16 w-16 text-white/90 drop-shadow-lg" />
              </div>
              <div className="absolute top-3 end-3 rounded-full bg-white/15 backdrop-blur ring-1 ring-white/25 px-3 py-1 text-[10px] uppercase tracking-widest text-white font-bold">
                NewArt
              </div>
            </div>
            <div className="flex flex-1 flex-col p-6">
              <h3 className="text-xl font-bold text-primary">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              <ul className="mt-4 space-y-2 text-sm">
                {s.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex items-end justify-between gap-3 pt-4 border-t border-border">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{t("store_from")}</div>
                  <div className="text-2xl font-bold text-primary">{s.price} <span className="text-sm font-medium text-muted-foreground">{t("sar")}</span></div>
                </div>
                <button
                  onClick={() => addService(s)}
                  className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-xs font-bold transition shadow-elegant ${
                    added[s.id] ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground hover:scale-[1.02]"
                  }`}
                >
                  {added[s.id] ? (<><Check className="h-4 w-4" /> {t("store_added")}</>)
                    : (<>{t("store_add")} <ChevronRight className="h-4 w-4 rtl:rotate-180" /></>)}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* -------------------- Sticky Booking FAB -------------------- */
function BookingFAB() {
  const { t } = useI18n();
  return (
    <a
      href="#booking"
      className="fixed bottom-5 start-5 z-50 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-bold text-accent-foreground shadow-glow ring-2 ring-accent/30 hover:scale-105 transition"
      aria-label={t("fab_label")}
    >
      <CalendarIcon className="h-5 w-5" />
      <span>{t("fab_label")}</span>
    </a>
  );
}

