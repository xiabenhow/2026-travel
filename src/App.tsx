import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MapPin, Clock3, Plane, Hotel, Car, Link as LinkIcon, ClipboardCopy, CheckCircle2, Sparkles, Calculator, Coins, Wallet2, Users, Plus, Trash2 } from "lucide-react";

const DEFAULT_TWD_PER_THB = 1.012; // 可手動調整（依當下匯率）

const itinerary = [
  {
    id: "day1",
    dayLabel: "Day 1",
    date: "3/4 (三)",
    theme: "抵達曼谷・休息＋夜市",
    stay: "ThaiLoft",
    hotelInfo: {
      name: "ThaiLoft",
      address: "1390/42, 10 Chan Mueang Alley, Din Daeng, Bangkok 10400, Thailand",
      note: "已線上預約完成 booking",
    },
    events: [
      {
        time: "12:35",
        title: "班機抵達",
        location: "素萬那普機場 (BKK)",
        transport: "-",
        note: "辦理入境、網卡。",
        icon: "plane",
      },
      {
        time: "14:30",
        title: "飯店 Check-in",
        location: "ThaiLoft",
        transport: "計程車直達",
        note: "入住 ThaiLoft。",
        icon: "hotel",
      },
      {
        time: "16:00",
        title: "舒壓放鬆",
        location: "Spa 或周邊",
        transport: "步行 / 計程車",
        note: "放下行李先放鬆。",
        icon: "clock",
      },
      {
        time: "18:00",
        title: "晚餐｜เคบีบีคิว เดอะ สตรีท รัชดา",
        location: "The Street Ratchada 商場（步行約10分鐘）",
        transport: "步行",
        note: "韓式烤肉吃到飽，已線上預約完成。建議可請飯店櫃檯協助確認訂位。電話：096-173-0555",
        address: "139 Ratchadaphisek Rd, Khwaeng Din Daeng, Din Daeng, Bangkok 10400, Thailand",
        icon: "map",
      },
      {
        time: "20:00",
        title: "喬德夜市 (Jodd Fairs)",
        location: "Jodd Fairs",
        transport: "步行 8 分鐘",
        note: "超近，逛完可直接走回飯店休息。",
        link: "https://kimiyo.tw/jodd-fair/",
        icon: "map",
      },
    ],
  },
  {
    id: "day2",
    dayLabel: "Day 2",
    date: "3/5 (四)",
    theme: "包車一日遊・象神＋古城",
    stay: "ThaiLoft",
    hotelInfo: {
      name: "ThaiLoft",
      address: "1390/42, 10 Chan Mueang Alley, Din Daeng, Bangkok 10400, Thailand",
      note: "已線上預約完成 booking",
    },
    events: [
      {
        time: "9:00",
        title: "飯店出發",
        location: "ThaiLoft",
        transport: "包車",
        note: "已線上預約完成（LINE: Nakky Tour）。",
        icon: "car",
      },
      {
        time: "10:00",
        title: "三頭象神博物館",
        location: "The Erawan Museum",
        transport: "包車",
        note: "粉紅建築＋巨大象神；已購 Klook（象神＋暹羅古城＋午餐）。",
        link: "https://bobotravel.tw/blog/post/the-erawan-museum",
        icon: "map",
      },
      {
        time: "12:00",
        title: "午餐",
        location: "古城周邊",
        transport: "-",
        note: "古城自助餐。",
        icon: "clock",
      },
      {
        time: "13:30",
        title: "暹羅古城 76 府",
        location: "Ancient City",
        transport: "包車",
        note: "建議租高爾夫球車拍美照。2人座首小時350泰銖（之後+100/時）；4人座首小時350泰銖（之後+200/時）。準備護照＋駕照。",
        link: "https://tsnio.com/the-ancient-city/",
        icon: "map",
      },
      {
        time: "19:00",
        title: "返回市區＆晚餐",
        location: "Thonglor 或 Siam",
        transport: "包車 / 計程車",
        note: "回市中心吃飯，自由時間自行安排。",
        icon: "car",
      },
    ],
  },
  {
    id: "day3",
    dayLabel: "Day 3",
    date: "3/6 (五)",
    theme: "文青散策・咖啡＋老街",
    stay: "ThaiLoft",
    hotelInfo: {
      name: "ThaiLoft",
      address: "1390/42, 10 Chan Mueang Alley, Din Daeng, Bangkok 10400, Thailand",
      note: "已線上預約完成 booking",
    },
    events: [
      {
        time: "10:00",
        title: "BENKOFF 咖啡廳",
        location: "BENKOFF Cafe (Thong Lo)",
        transport: "計程車前往",
        note: "臘腸狗咖啡，慢慢享用早午餐。",
        address: "195 NT TOWER Thong Lo, Khlong Tan Nuea, Watthana, Bangkok 10110, Thailand",
        link: "https://www.instagram.com/benkoff.cafe/",
        icon: "map",
      },
      {
        time: "13:30",
        title: "嵩越路 Song Wat 散策",
        location: "Song Wat Road",
        transport: "計程車前往",
        note: "文青散策：老宅咖啡、藝廊。定位可用 925-937 Song Wat Rd。",
        link: "https://kenji.life/bkk-song-wat-road/",
        icon: "map",
      },
      {
        time: "18:00",
        title: "晚餐｜ZZ Italian-Thai Fusion",
        location: "The Street Ratchada 1F",
        transport: "計程車前往",
        note: "義泰融合料理，菜單豐富（打拋豬義大利麵、冬蔭功燉飯等）。電話：02-121-1831 / 098-702-0785",
        address: "Din Daeng, Bangkok 10400, Thailand",
        link: "https://www.instagram.com/p/C7Pnxy4SO-5/",
        icon: "map",
      },
      {
        time: "21:00",
        title: "高空酒吧（選配）/ 喬德夜市 / 自由安排",
        location: "Tichuca 或飯店附近",
        transport: "計程車",
        note: "回市中心活動時間。",
        icon: "clock",
      },
    ],
  },
  {
    id: "day4",
    dayLabel: "Day 4",
    date: "3/7 (六)",
    theme: "移動日・恰圖恰＋機場飯店",
    stay: "The Park Nine",
    hotelInfo: {
      name: "The Park Nine Hotel",
      address: "599, 599 1, Lat Krabang, Bangkok 10520, Thailand",
      note: "已線上預約完成 booking",
    },
    events: [
      {
        time: "9:30",
        title: "退房、寄放行李",
        location: "ThaiLoft 櫃台",
        transport: "-",
        note: "關鍵操作：行李寄放飯店，輕裝去市集。",
        icon: "hotel",
      },
      {
        time: "10:00",
        title: "恰圖恰週末市集",
        location: "Chatuchak Weekend Market",
        transport: "計程車",
        note: "從 ThaiLoft 約 15–20 分鐘。",
        address: "587, 10 Kamphaeng Phet 2 Rd, Khwaeng Chatuchak, Chatuchak, Bangkok 10900, Thailand",
        icon: "map",
      },
      {
        time: "15:00",
        title: "返回拿行李",
        location: "ThaiLoft",
        transport: "計程車",
        note: "帶著戰利品回飯店拿行李。",
        icon: "hotel",
      },
      {
        time: "15:30",
        title: "移動前往機場飯店",
        location: "The Park Nine Hotel",
        transport: "計程車（約40分鐘）",
        note: "前往機場附近飯店，準備隔天回程。",
        icon: "car",
      },
      {
        time: "16:20",
        title: "Check-in",
        location: "The Park Nine",
        transport: "-",
        note: "渡假模式：享受運河泳池／自由時間。",
        icon: "hotel",
      },
      {
        time: "18:00",
        title: "晚餐",
        location: "Robinson 或 Paseo Mall（飯店附近）",
        transport: "步行 / 計程車",
        note: "自行用餐，自由安排。",
        icon: "map",
      },
    ],
  },
  {
    id: "day5",
    dayLabel: "Day 5",
    date: "3/8 (日)",
    theme: "回程日",
    stay: "-",
    hotelInfo: {
      name: "The Park Nine Hotel",
      address: "599, 599 1, Lat Krabang, Bangkok 10520, Thailand",
      note: "機場接駁可使用",
    },
    events: [
      {
        time: "9:00",
        title: "飯店早餐",
        location: "The Park Nine",
        transport: "-",
        note: "睡到自然醒（早餐 06:00 - 10:30）。",
        icon: "hotel",
      },
      {
        time: "10:00",
        title: "前往機場",
        location: "素萬那普機場 (BKK)",
        transport: "飯店接駁",
        note: "約 10–15 分鐘抵達機場。",
        icon: "car",
      },
      {
        time: "10:30",
        title: "抵達機場 / 辦理登機",
        location: "素萬那普機場 (BKK)",
        transport: "-",
        note: "預留時間托運、退稅、安檢。",
        icon: "plane",
      },
      {
        time: "12:45",
        title: "班機起飛",
        location: "BKK",
        transport: "-",
        note: "完美 Ending ✨",
        icon: "plane",
      },
    ],
  },
];

function iconFor(type: string) {
  switch (type) {
    case "plane":
      return <Plane className="h-4 w-4" />;
    case "hotel":
      return <Hotel className="h-4 w-4" />;
    case "car":
      return <Car className="h-4 w-4" />;
    case "map":
      return <MapPin className="h-4 w-4" />;
    default:
      return <Clock3 className="h-4 w-4" />;
  }
}

function getTypeStyle(type: string) {
  const styles: Record<string, any> = {
    plane: { badge: "bg-violet-100 text-violet-800 border-violet-200", label: "航班" },
    hotel: { badge: "bg-amber-100 text-amber-800 border-amber-200", label: "住宿" },
    car: { badge: "bg-emerald-100 text-emerald-800 border-emerald-200", label: "交通" },
    map: { badge: "bg-sky-100 text-sky-800 border-sky-200", label: "景點/餐廳" },
    clock: { badge: "bg-slate-100 text-slate-800 border-slate-200", label: "行程" },
  };
  return styles[type] || styles.clock;
}

function estimateCostTHB(event: any) {
  const text = `${event.title || ""} ${event.note || ""} ${event.transport || ""}`;
  if (/高爾夫球車/.test(text)) return 350;
  if (/包車/.test(text)) return 1200;
  if (/計程車/.test(text)) return 180;
  if (/夜市/.test(text)) return 300;
  if (/晚餐/.test(text)) return 600;
  if (/咖啡|早午餐/.test(text)) return 350;
  if (/市集/.test(text)) return 800;
  if (/Spa|舒壓/.test(text)) return 800;
  return 0;
}

function buildMapUrl(addressOrPlace: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressOrPlace)}`;
}

function getDayPalette(dayId: string) {
  const palettes: Record<string, any> = {
    day1: {
      tab: "data-[state=active]:border-amber-300 data-[state=active]:bg-amber-50",
      header: "from-amber-100 via-orange-50 to-white",
      chip: "bg-amber-100 text-amber-800 border-amber-200",
      line: "before:bg-amber-200",
      dot: "bg-amber-400",
      accent: "bg-amber-50 border-amber-200",
      icon: "bg-amber-100 text-amber-700",
    },
    day2: {
      tab: "data-[state=active]:border-pink-300 data-[state=active]:bg-pink-50",
      header: "from-pink-100 via-rose-50 to-white",
      chip: "bg-pink-100 text-pink-800 border-pink-200",
      line: "before:bg-pink-200",
      dot: "bg-pink-400",
      accent: "bg-pink-50 border-pink-200",
      icon: "bg-pink-100 text-pink-700",
    },
    day3: {
      tab: "data-[state=active]:border-sky-300 data-[state=active]:bg-sky-50",
      header: "from-sky-100 via-cyan-50 to-white",
      chip: "bg-sky-100 text-sky-800 border-sky-200",
      line: "before:bg-sky-200",
      dot: "bg-sky-400",
      accent: "bg-sky-50 border-sky-200",
      icon: "bg-sky-100 text-sky-700",
    },
    day4: {
      tab: "data-[state=active]:border-emerald-300 data-[state=active]:bg-emerald-50",
      header: "from-emerald-100 via-green-50 to-white",
      chip: "bg-emerald-100 text-emerald-800 border-emerald-200",
      line: "before:bg-emerald-200",
      dot: "bg-emerald-400",
      accent: "bg-emerald-50 border-emerald-200",
      icon: "bg-emerald-100 text-emerald-700",
    },
    day5: {
      tab: "data-[state=active]:border-violet-300 data-[state=active]:bg-violet-50",
      header: "from-violet-100 via-purple-50 to-white",
      chip: "bg-violet-100 text-violet-800 border-violet-200",
      line: "before:bg-violet-200",
      dot: "bg-violet-400",
      accent: "bg-violet-50 border-violet-200",
      icon: "bg-violet-100 text-violet-700",
    },
  };
  return palettes[dayId] || palettes.day1;
}

const LEDGER_STORAGE_KEY = "bangkok-trip-ledger-v1";

function TravelLedger({ rate, palette }: { rate: number; palette: any }) {
  const [members, setMembers] = useState(["我"]);
  const [newMember, setNewMember] = useState("");
  const [entries, setEntries] = useState<any[]>([]);
  const [form, setForm] = useState({
    date: "3/4",
    member: "我",
    category: "餐飲",
    note: "",
    amountTHB: 0,
    paidBy: "我",
    splitMode: "equal",
    splitWith: ["我"],
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LEDGER_STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (saved.members?.length) setMembers(saved.members);
      if (saved.entries?.length) setEntries(saved.entries);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LEDGER_STORAGE_KEY, JSON.stringify({ members, entries }));
    } catch (e) {
      console.error(e);
    }
  }, [members, entries]);

  useEffect(() => {
    if (!members.includes(form.member) || !members.includes(form.paidBy)) {
      const first = members[0] || "我";
      setForm((prev) => ({ ...prev, member: first, paidBy: first, splitWith: [first] }));
    }
  }, [members]);

  const addMember = () => {
    const name = newMember.trim();
    if (!name || members.includes(name)) return;
    setMembers((prev) => [...prev, name]);
    setNewMember("");
  };

  const toggleSplitMember = (name: string) => {
    setForm((prev) => {
      const exists = prev.splitWith.includes(name);
      const next = exists ? prev.splitWith.filter((n) => n !== name) : [...prev.splitWith, name];
      return { ...prev, splitWith: next.length ? next : [name] };
    });
  };

  const addEntry = () => {
    const amount = Number(form.amountTHB || 0);
    if (!amount) return;
    const splitWith = form.splitMode === "self" ? [form.member] : (form.splitWith.length ? form.splitWith : [form.member]);
    const entry = {
      id: `${Date.now()}`,
      ...form,
      amountTHB: amount,
      splitWith,
      createdAt: new Date().toISOString(),
    };
    setEntries((prev) => [entry, ...prev]);
    setForm((prev) => ({ ...prev, note: "", amountTHB: 0 }));
  };

  const removeEntry = (id: string) => setEntries((prev) => prev.filter((e) => e.id !== id));

  const summary = useMemo(() => {
    const result: Record<string, any> = {};
    members.forEach((m) => {
      result[m] = { paid: 0, share: 0 };
    });
    entries.forEach((e) => {
      result[e.paidBy] ??= { paid: 0, share: 0 };
      result[e.paidBy].paid += Number(e.amountTHB || 0);
      const list = e.splitWith?.length ? e.splitWith : [e.member || e.paidBy];
      const per = Number(e.amountTHB || 0) / list.length;
      list.forEach((m) => {
        result[m] ??= { paid: 0, share: 0 };
        result[m].share += per;
      });
    });
    return result;
  }, [entries, members]);

  const totalTHB = entries.reduce((s, e) => s + Number(e.amountTHB || 0), 0);

  return (
    <Card className="rounded-2xl overflow-hidden border">
      <CardHeader className={`bg-gradient-to-r ${palette.header}`}>
        <CardTitle className="text-lg flex items-center gap-2"><Wallet2 className="h-5 w-5" /> 旅遊記帳器（共用版）</CardTitle>
        <p className="text-sm text-slate-600">目前是瀏覽器儲存版本：同一台裝置會保留資料；不同人不同手機不會自動同步。</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 lg:grid-cols-[1.3fr_2fr]">
          <div className={`rounded-xl border p-3 ${palette.accent}`}>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium"><Users className="h-4 w-4" /> 旅伴名單</div>
            <div className="flex gap-2">
              <input value={newMember} onChange={(e) => setNewMember(e.target.value)} placeholder="輸入旅伴名稱" className="w-full rounded-lg border px-2 py-1.5 text-sm" />
              <Button type="button" size="sm" onClick={addMember}><Plus className="h-4 w-4" /></Button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {members.map((m) => <Badge key={m} className="rounded-lg border bg-white text-slate-700">{m}</Badge>)}
            </div>
            <div className="mt-3 text-xs text-slate-500">可用來算誰先墊、誰該分攤。</div>
          </div>

          <div className="rounded-xl border p-3">
            <div className="mb-2 text-sm font-medium">新增記帳</div>
            <div className="grid gap-2 md:grid-cols-2">
              <input value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} placeholder="日期" className="rounded-lg border px-2 py-1.5 text-sm" />
              <select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} className="rounded-lg border px-2 py-1.5 text-sm">
                {['餐飲','交通','門票','購物','住宿','其他'].map((c)=><option key={c}>{c}</option>)}
              </select>
              <select value={form.member} onChange={(e) => setForm((p) => ({ ...p, member: e.target.value }))} className="rounded-lg border px-2 py-1.5 text-sm">
                {members.map((m)=><option key={m}>{m}</option>)}
              </select>
              <select value={form.paidBy} onChange={(e) => setForm((p) => ({ ...p, paidBy: e.target.value }))} className="rounded-lg border px-2 py-1.5 text-sm">
                {members.map((m)=><option key={m}>{m}</option>)}
              </select>
              <input type="number" value={form.amountTHB} onChange={(e) => setForm((p) => ({ ...p, amountTHB: Number(e.target.value || 0) }))} placeholder="金額 THB" className="rounded-lg border px-2 py-1.5 text-sm" />
              <input value={form.note} onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))} placeholder="備註（例如：晚餐/Grab）" className="rounded-lg border px-2 py-1.5 text-sm" />
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-500">分攤方式：</span>
              <button className={`rounded-full border px-2 py-1 ${form.splitMode==='equal'?'bg-slate-900 text-white':'bg-white'}`} onClick={() => setForm((p)=>({ ...p, splitMode:'equal' }))}>多人均分</button>
              <button className={`rounded-full border px-2 py-1 ${form.splitMode==='self'?'bg-slate-900 text-white':'bg-white'}`} onClick={() => setForm((p)=>({ ...p, splitMode:'self' }))}>自己負擔</button>
            </div>
            {form.splitMode === 'equal' && (
              <div className="mt-2 flex flex-wrap gap-2">
                {members.map((m) => {
                  const active = form.splitWith.includes(m);
                  return (
                    <button key={m} onClick={() => toggleSplitMember(m)} className={`rounded-full border px-2 py-1 text-xs ${active ? 'bg-sky-100 border-sky-300 text-sky-800' : 'bg-white'}`}>
                      {m}
                    </button>
                  );
                })}
              </div>
            )}
            <div className="mt-3 flex items-center justify-between">
              <div className="text-xs text-slate-500">約 TWD {(Number(form.amountTHB || 0) * rate).toFixed(0)}</div>
              <Button size="sm" onClick={addEntry}>新增記帳</Button>
            </div>
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-[1.2fr_1.8fr]">
          <div className={`rounded-xl border p-3 ${palette.accent}`}>
            <div className="text-sm font-medium">分帳總覽</div>
            <div className="mt-2 space-y-2">
              {Object.entries(summary).map(([name, data]) => {
                const balance = data.paid - data.share;
                return (
                  <div key={name} className="rounded-lg border bg-white/80 p-2 text-sm">
                    <div className="font-medium">{name}</div>
                    <div className="text-xs text-slate-600">已付 ฿{data.paid.toFixed(0)}｜應分攤 ฿{data.share.toFixed(0)}</div>
                    <div className={`text-xs mt-1 ${balance >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {balance >= 0 ? `應收回 ฿${balance.toFixed(0)}` : `應再付 ฿${Math.abs(balance).toFixed(0)}`}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 text-xs text-slate-500">總支出：฿{totalTHB.toFixed(0)}（約 TWD {(totalTHB * rate).toFixed(0)}）</div>
          </div>

          <div className="rounded-xl border p-3">
            <div className="text-sm font-medium">記帳明細</div>
            <div className="mt-2 max-h-72 space-y-2 overflow-auto pr-1">
              {entries.length === 0 && <div className="text-xs text-slate-500">尚未新增記帳資料</div>}
              {entries.map((e) => (
                <div key={e.id} className="rounded-lg border p-2 text-sm">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-medium">{e.date}｜{e.category}｜฿{Number(e.amountTHB).toFixed(0)}</div>
                      <div className="text-xs text-slate-600">{e.note || '-'}｜付款：{e.paidBy}｜分攤：{(e.splitWith || []).join('、')}</div>
                    </div>
                    <button onClick={() => removeEntry(e.id)} className="rounded-md border p-1 hover:bg-slate-50"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EventCard({ event, palette, rate }: { event: any; palette: any; rate: number }) {
  const [copied, setCopied] = useState(false);
  const [done, setDone] = useState(false);
  const [costTHB, setCostTHB] = useState(event.budgetTHB ?? estimateCostTHB(event));
  const typeStyle = getTypeStyle(event.icon || "clock");
  const costTWD = Number(costTHB || 0) * rate;

  const copyAddress = async () => {
    if (!event.address) return;
    try {
      await navigator.clipboard.writeText(event.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className={`relative rounded-2xl border bg-white/85 p-4 shadow-sm backdrop-blur ${palette.accent}`}>
      <div className="absolute left-[-9px] top-6 h-4 w-4 rounded-full border bg-white" />
      <div className="absolute right-3 top-3">
        <button onClick={() => setDone((v) => !v)} className={`text-xs rounded-full border px-2 py-1 ${done ? "bg-emerald-100 border-emerald-300 text-emerald-800" : "bg-white border-slate-200 text-slate-600"}`}>
          {done ? "已完成" : "未完成"}
        </button>
      </div>
      <div className="flex flex-col gap-3 md:flex-row md:items-start">
        <div className="min-w-[84px]">
          <Badge className={`rounded-xl px-3 py-1 text-sm border ${palette.chip}`}>{event.time}</Badge>
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-start gap-2">
            <span className={`mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full ${palette.icon}`}>
              {iconFor(event.icon)}
            </span>
            <div>
              <h3 className="font-semibold leading-snug text-slate-900">{event.title}</h3>
              <p className="mt-0.5 text-sm text-slate-600">{event.location}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <Badge className={`rounded-lg border ${typeStyle.badge}`}>{typeStyle.label}</Badge>
            {event.transport && event.transport !== "-" && (
              <Badge variant="secondary" className="rounded-lg">交通：{event.transport}</Badge>
            )}
            {event.link && (
              <a href={event.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-lg border px-2 py-1 hover:bg-slate-50">
                <LinkIcon className="h-3.5 w-3.5" /> 參考連結
              </a>
            )}
            {(event.address || event.location) && (
              <a
                href={buildMapUrl(event.address || event.location)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-lg border px-2 py-1 hover:bg-slate-50"
              >
                <MapPin className="h-3.5 w-3.5" /> Google Maps
              </a>
            )}
            {event.address && (
              <button
                onClick={copyAddress}
                className="inline-flex items-center gap-1 rounded-lg border px-2 py-1 hover:bg-slate-50"
              >
                {copied ? <CheckCircle2 className="h-3.5 w-3.5" /> : <ClipboardCopy className="h-3.5 w-3.5" />}
                {copied ? "已複製地址" : "複製地址"}
              </button>
            )}
          </div>

          {event.note && <p className="text-sm leading-relaxed text-slate-700">{event.note}</p>}

          <div className="rounded-xl border border-white/70 bg-white/70 p-3">
            <div className="mb-2 flex items-center gap-2 text-xs text-slate-600">
              <Calculator className="h-3.5 w-3.5" /> 預算估算（可修改）
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">THB</span>
                <input type="number" min="0" value={costTHB} onChange={(e) => setCostTHB(Number(e.target.value || 0))} className="w-24 rounded-lg border px-2 py-1 text-sm" />
              </div>
              <div className="text-xs text-slate-500">≈</div>
              <div className="flex items-center gap-1 rounded-lg border bg-slate-50 px-2 py-1 text-sm">
                <Coins className="h-3.5 w-3.5" />
                <span>TWD {costTWD.toFixed(0)}</span>
              </div>
            </div>
          </div>

          {event.address && <p className="text-xs text-slate-500">地址：{event.address}</p>}
        </div>
      </div>
    </div>
  );
}

export default function BangkokTripApp() {
  const [selectedDay, setSelectedDay] = useState(itinerary[0].id);
  const [rate, setRate] = useState(DEFAULT_TWD_PER_THB);
  const [thbInput, setThbInput] = useState(1000);
  const [twdInput, setTwdInput] = useState(1000);

  const selected = useMemo(() => itinerary.find((d) => d.id === selectedDay) || itinerary[0], [selectedDay]);
  const totalStops = itinerary.reduce((sum, d) => sum + d.events.length, 0);
  const activePalette = getDayPalette(selected.id);
  const selectedDayEstimatedTHB = selected.events.reduce((sum, e) => sum + estimateCostTHB(e), 0);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-100 p-4 md:p-8">
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-amber-200 blur-3xl" />
        <div className="absolute top-20 right-10 h-40 w-40 rounded-full bg-pink-200 blur-3xl" />
        <div className="absolute bottom-10 left-1/3 h-48 w-48 rounded-full bg-sky-200 blur-3xl" />
      </div>
      <div className="pointer-events-none absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #334155 1px, transparent 0)", backgroundSize: "18px 18px" }} />
      <div className="relative mx-auto max-w-6xl space-y-6">
        <Card className="rounded-3xl border-0 shadow-lg overflow-hidden">
          <div className="h-1.5 w-full bg-gradient-to-r from-amber-300 via-pink-300 via-sky-300 to-emerald-300" />
          <CardHeader className={`pb-2 bg-gradient-to-r ${activePalette.header}`}>
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm text-slate-500">Bangkok Trip Planner</p>
                <CardTitle className="text-2xl md:text-3xl">曼谷 5 天 4 夜行程 Web App</CardTitle>
                <p className="mt-2 text-sm text-slate-600">3/4（三）～ 3/8（日）｜住宿切換：ThaiLoft → The Park Nine</p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm md:grid-cols-3">
                <div className={`rounded-2xl p-3 border ${activePalette.accent}`}>
                  <div className="text-slate-500">總天數</div>
                  <div className="text-lg font-semibold">5 天</div>
                </div>
                <div className={`rounded-2xl p-3 border ${activePalette.accent}`}>
                  <div className="text-slate-500">總行程點</div>
                  <div className="text-lg font-semibold">{totalStops}</div>
                </div>
                <div className={`rounded-2xl p-3 border col-span-2 md:col-span-1 ${activePalette.accent}`}>
                  <div className="text-slate-500">狀態</div>
                  <div className="text-lg font-semibold flex items-center gap-1"><Sparkles className="h-4 w-4" />已安排完成</div>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
          <Card className="rounded-2xl overflow-hidden border">
            <CardHeader className={`bg-gradient-to-r ${activePalette.header}`}>
              <CardTitle className="text-lg flex items-center gap-2"><Coins className="h-5 w-5" /> 匯率換算器（THB / TWD）</CardTitle>
              <p className="text-sm text-slate-600">已預設匯率，可手動改成你當天實際換到的匯率。</p>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-3">
              <div className="rounded-xl border p-3">
                <div className="text-xs text-slate-500">1 THB = ? TWD</div>
                <input type="number" step="0.001" value={rate} onChange={(e) => setRate(Number(e.target.value || 0))} className="mt-2 w-full rounded-lg border px-2 py-1.5" />
              </div>
              <div className="rounded-xl border p-3">
                <div className="text-xs text-slate-500">THB → TWD</div>
                <input type="number" value={thbInput} onChange={(e) => setThbInput(Number(e.target.value || 0))} className="mt-2 w-full rounded-lg border px-2 py-1.5" />
                <div className="mt-2 text-sm font-medium">≈ TWD {(thbInput * rate).toFixed(0)}</div>
              </div>
              <div className="rounded-xl border p-3">
                <div className="text-xs text-slate-500">TWD → THB</div>
                <input type="number" value={twdInput} onChange={(e) => setTwdInput(Number(e.target.value || 0))} className="mt-2 w-full rounded-lg border px-2 py-1.5" />
                <div className="mt-2 text-sm font-medium">≈ THB {rate ? (twdInput / rate).toFixed(0) : 0}</div>
              </div>
            </CardContent>
          </Card>

          <Card className={`rounded-2xl border ${activePalette.accent}`}>
            <CardContent className="p-4">
              <div className="text-xs text-slate-500">當日預估花費</div>
              <div className="mt-1 text-xl font-bold">฿{selectedDayEstimatedTHB.toLocaleString()}</div>
              <div className="text-sm text-slate-600">約 TWD {(selectedDayEstimatedTHB * rate).toFixed(0)}</div>
              <div className="mt-3 text-xs text-slate-500">* 可在每個行程卡中調整預算數字</div>
            </CardContent>
          </Card>
        </div>

        <TravelLedger rate={rate} palette={activePalette} />

        <Tabs value={selectedDay} onValueChange={setSelectedDay}>
          <TabsList className="grid h-auto w-full grid-cols-2 gap-2 rounded-2xl bg-transparent p-0 md:grid-cols-5">
            {itinerary.map((day) => (
              <TabsTrigger
                key={day.id}
                value={day.id}
                className={`rounded-2xl border bg-white px-3 py-3 data-[state=active]:shadow ${getDayPalette(day.id).tab}`}
              >
                <div className="text-left">
                  <div className="text-xs text-slate-500">{day.dayLabel}</div>
                  <div className="font-semibold">{day.date}</div>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>

          {itinerary.map((day) => (
            <TabsContent key={day.id} value={day.id} className="mt-4 space-y-4">
              <div className="grid gap-4 lg:grid-cols-[1.2fr_2.8fr]">
                <Card className="rounded-2xl overflow-hidden">
                  <CardHeader className={`bg-gradient-to-r ${getDayPalette(day.id).header}`}>
                    <CardTitle className="text-lg">{day.dayLabel}｜{day.date}</CardTitle>
                    <p className="text-sm text-slate-600">{day.theme}</p>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <div className={`rounded-xl p-3 border ${getDayPalette(day.id).accent}`}>
                      <div className="mb-1 text-xs text-slate-500">住宿</div>
                      <div className="font-medium">{day.hotelInfo.name}</div>
                      <div className="mt-1 text-xs text-slate-600 leading-relaxed">{day.hotelInfo.address}</div>
                      <div className="mt-2 text-xs text-slate-600">{day.hotelInfo.note}</div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <a
                          href={buildMapUrl(day.hotelInfo.address)}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 rounded-lg border px-2 py-1 hover:bg-slate-50"
                        >
                          <MapPin className="h-3.5 w-3.5" /> 飯店地圖
                        </a>
                      </div>
                    </div>

                    <div className={`rounded-xl p-3 border ${getDayPalette(day.id).accent}`}>
                      <div className="mb-1 text-xs text-slate-500">當日重點</div>
                      <ul className="space-y-1 text-slate-700">
                        {day.events.slice(0, 3).map((e, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className={`mt-1 h-1.5 w-1.5 rounded-full ${getDayPalette(day.id).dot}`} />
                            <span>{e.time} {e.title}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl overflow-hidden">
                  <CardHeader className={`pb-2 flex-row items-center justify-between bg-gradient-to-r ${getDayPalette(day.id).header}`}>
                    <CardTitle className="text-lg">時間軸行程</CardTitle>
                    <Button variant="outline" size="sm" onClick={() => window.print()}>
                      列印 / 存 PDF
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className={`relative space-y-3 pl-6 before:absolute before:left-1.5 before:top-2 before:h-[calc(100%-12px)] before:w-0.5 ${getDayPalette(day.id).line}`}>
                      {day.events.map((event, index) => (
                        <EventCard key={`${day.id}-${index}`} event={event} palette={getDayPalette(day.id)} rate={rate} />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <Card className={`rounded-2xl border-dashed border-2 ${activePalette.accent}`}>
          <CardContent className="flex flex-col gap-3 p-4 text-sm text-slate-700 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="font-medium">已升級功能</div>
              <div className="text-slate-600">匯率換算、旅遊記帳器（本機儲存）、預算估算、完成勾選、行程類型色塊、泰系漸層背景</div>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setSelectedDay("day1")}>回 Day 1</Button>
              <Button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>回頂部</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
