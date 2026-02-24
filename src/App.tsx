import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MapPin, Clock3, Plane, Hotel, Car, Link as LinkIcon, ClipboardCopy, CheckCircle2, Sparkles, Calculator, Coins, Wallet2, Users, Plus, Trash2 } from "lucide-react";

// Firebase Imports
import { initializeApp } from "firebase/app";
import { getFirestore, collection, onSnapshot, addDoc, deleteDoc, doc, setDoc, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC0glWkM8VJgLQJpBDY5DhIl8qCM8bym4k",
  authDomain: "travel-4b894.firebaseapp.com",
  projectId: "travel-4b894",
  storageBucket: "travel-4b894.firebasestorage.app",
  messagingSenderId: "720636986328",
  appId: "1:720636986328:web:93f1caf9a4e204b56ee8ad",
  measurementId: "G-60FSVH9ZEY"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const DEFAULT_TWD_PER_THB = 1.012;

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
      { time: "12:35", title: "班機抵達", location: "素萬那普機場 (BKK)", transport: "-", note: "辦理入境、網卡。", icon: "plane" },
      { time: "14:30", title: "飯店 Check-in", location: "ThaiLoft", transport: "計程車直達", note: "入住 ThaiLoft。", icon: "hotel" },
      { time: "16:00", title: "舒壓放鬆", location: "Spa 或周邊", transport: "步行 / 計程車", note: "放下行李先放鬆。", icon: "clock" },
      { time: "18:00", title: "晚餐｜เคบีบีคิว เดอะ สตรีท รัชดา", location: "The Street Ratchada 商場", transport: "步行", note: "韓式烤肉吃到飽，已線上預約完成。", address: "139 Ratchadaphisek Rd, Khwaeng Din Daeng, Din Daeng, Bangkok 10400, Thailand", icon: "map" },
      { time: "20:00", title: "喬德夜市 (Jodd Fairs)", location: "Jodd Fairs", transport: "步行 8 分鐘", note: "超近，逛完可直接走回飯店休息。", link: "https://kimiyo.tw/jodd-fair/", icon: "map" },
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
      { time: "9:00", title: "飯店出發", location: "ThaiLoft", transport: "包車", note: "已線上預約完成（LINE: Nakky Tour）。", icon: "car" },
      { time: "10:00", title: "三頭象神博物館", location: "The Erawan Museum", transport: "包車", note: "粉紅建築＋巨大象神；已購 Klook。", link: "https://bobotravel.tw/blog/post/the-erawan-museum", icon: "map" },
      { time: "12:00", title: "午餐", location: "古城周邊", transport: "-", note: "古城自助餐。", icon: "clock" },
      { time: "13:30", title: "暹羅古城 76 府", location: "Ancient City", transport: "包車", note: "建議租高爾夫球車拍美照。準備護照＋駕照。", link: "https://tsnio.com/the-ancient-city/", icon: "map" },
      { time: "19:00", title: "返回市區＆晚餐", location: "Thonglor 或 Siam", transport: "包車 / 計程車", note: "回市中心吃飯。", icon: "car" },
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
      { time: "10:00", title: "BENKOFF 咖啡廳", location: "BENKOFF Cafe", transport: "計程車前往", note: "臘腸狗咖啡，早午餐。", address: "195 NT TOWER Thong Lo, Bangkok 10110", link: "https://www.instagram.com/benkoff.cafe/", icon: "map" },
      { time: "13:30", title: "嵩越路 Song Wat 散策", location: "Song Wat Road", transport: "計程車前往", note: "文青散策：老宅咖啡、藝廊。", link: "https://kenji.life/bkk-song-wat-road/", icon: "map" },
      { time: "18:00", title: "晚餐｜ZZ Italian-Thai Fusion", location: "The Street Ratchada 1F", transport: "計程車前往", note: "義泰融合料理。", address: "Din Daeng, Bangkok 10400, Thailand", link: "https://www.instagram.com/p/C7Pnxy4SO-5/", icon: "map" },
      { time: "21:00", title: "高空酒吧 / 喬德夜市 / 自由安排", location: "Tichuca 或飯店附近", transport: "計程車", note: "回市中心活動時間。", icon: "clock" },
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
      { time: "9:30", title: "退房、寄放行李", location: "ThaiLoft 櫃台", transport: "-", note: "行李寄放飯店，輕裝去市集。", icon: "hotel" },
      { time: "10:00", title: "恰圖恰週末市集", location: "Chatuchak Weekend Market", transport: "計程車", note: "約 15–20 分鐘。", address: "Chatuchak, Bangkok 10900", icon: "map" },
      { time: "15:00", title: "返回拿行李", location: "ThaiLoft", transport: "計程車", note: "帶著戰利品回飯店拿行李。", icon: "hotel" },
      { time: "15:30", title: "移動前往機場飯店", location: "The Park Nine Hotel", transport: "計程車", note: "前往機場附近飯店。", icon: "car" },
      { time: "16:20", title: "Check-in", location: "The Park Nine", transport: "-", note: "享受運河泳池／自由時間。", icon: "hotel" },
      { time: "18:00", title: "晚餐", location: "Robinson 或 Paseo Mall", transport: "步行 / 計程車", note: "自行用餐，自由安排。", icon: "map" },
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
      { time: "9:00", title: "飯店早餐", location: "The Park Nine", transport: "-", note: "睡到自然醒。", icon: "hotel" },
      { time: "10:00", title: "前往機場", location: "素萬那普機場 (BKK)", transport: "飯店接駁", note: "約 10–15 分鐘抵達機場。", icon: "car" },
      { time: "10:30", title: "抵達機場 / 辦理登機", location: "素萬那普機場 (BKK)", transport: "-", note: "預留時間托運、退稅。", icon: "plane" },
      { time: "12:45", title: "班機起飛", location: "BKK", transport: "-", note: "完美 Ending ✨", icon: "plane" },
    ],
  },
];

function iconFor(type: string) {
  switch (type) {
    case "plane": return <Plane className="h-4 w-4" />;
    case "hotel": return <Hotel className="h-4 w-4" />;
    case "car": return <Car className="h-4 w-4" />;
    case "map": return <MapPin className="h-4 w-4" />;
    default: return <Clock3 className="h-4 w-4" />;
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

function TravelLedger({ rate, palette }: { rate: number; palette: any }) {
  const [members, setMembers] = useState(["我"]);
  const [newMember, setNewMember] = useState("");
  const [entries, setEntries] = useState<any[]>([]);
  const [form, setForm] = useState({ date: "3/4", member: "我", category: "餐飲", note: "", amountTHB: 0, paidBy: "我", splitMode: "equal", splitWith: ["我"] });

  // 實時監聽 Firestore 資料
  useEffect(() => {
    const unsubMembers = onSnapshot(doc(db, "travel", "members"), (docSnap) => {
      if (docSnap.exists()) setMembers(docSnap.data().list);
    });

    const unsubEntries = onSnapshot(collection(db, "ledger"), (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEntries(list.sort((a: any, b: any) => b.createdAt.localeCompare(a.createdAt)));
    });

    return () => { unsubMembers(); unsubEntries(); };
  }, []);

  const addMember = async () => {
    const name = newMember.trim();
    if (!name || members.includes(name)) return;
    const newList = [...members, name];
    await setDoc(doc(db, "travel", "members"), { list: newList });
    setNewMember("");
  };

  const addEntry = async () => {
    const amount = Number(form.amountTHB || 0);
    if (!amount) return;
    const splitWith = form.splitMode === "self" ? [form.member] : (form.splitWith.length ? form.splitWith : [form.member]);
    await addDoc(collection(db, "ledger"), { ...form, amountTHB: amount, splitWith, createdAt: new Date().toISOString() });
    setForm((prev) => ({ ...prev, note: "", amountTHB: 0 }));
  };

  const removeEntry = async (id: string) => await deleteDoc(doc(db, "ledger", id));

  const summary = useMemo(() => {
    const result: Record<string, any> = {};
    members.forEach((m) => result[m] = { paid: 0, share: 0 });
    entries.forEach((e) => {
      result[e.paidBy] ??= { paid: 0, share: 0 };
      result[e.paidBy].paid += Number(e.amountTHB || 0);
      const list = e.splitWith?.length ? e.splitWith : [e.member || e.paidBy];
      const per = Number(e.amountTHB || 0) / list.length;
      list.forEach((m: string) => { result[m] ??= { paid: 0, share: 0 }; result[m].share += per; });
    });
    return result;
  }, [entries, members]);

  return (
    <Card className="rounded-2xl overflow-hidden border">
      <CardHeader className={`bg-gradient-to-r ${palette.header}`}>
        <CardTitle className="text-lg flex items-center gap-2"><Wallet2 className="h-5 w-5" /> 雲端即時記帳（Firebase 同步）</CardTitle>
        <p className="text-sm text-slate-600">手機與電腦會即時同步資料。適合多人共同記錄。</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 lg:grid-cols-[1.3fr_2fr]">
          <div className={`rounded-xl border p-3 ${palette.accent}`}>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium"><Users className="h-4 w-4" /> 旅伴名單</div>
            <div className="flex gap-2">
              <input value={newMember} onChange={(e) => setNewMember(e.target.value)} placeholder="輸入旅伴名稱" className="w-full rounded-lg border px-2 py-1.5 text-sm" />
              <Button type="button" size="sm" onClick={addMember}><Plus className="h-4 w-4" /></Button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">{members.map((m) => <Badge key={m} className="rounded-lg border bg-white text-slate-700">{m}</Badge>)}</div>
          </div>
          <div className="rounded-xl border p-3">
            <div className="mb-2 text-sm font-medium">新增記帳</div>
            <div className="grid gap-2 md:grid-cols-2">
              <input value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} className="rounded-lg border px-2 py-1.5 text-sm" />
              <select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} className="rounded-lg border px-2 py-1.5 text-sm">
                {['餐飲','交通','門票','購物','住宿','其他'].map((c)=><option key={c}>{c}</option>)}
              </select>
              <select value={form.paidBy} onChange={(e) => setForm((p) => ({ ...p, paidBy: e.target.value }))} className="rounded-lg border px-2 py-1.5 text-sm">
                {members.map((m)=><option key={m}>{m}</option>)}
              </select>
              <input type="number" value={form.amountTHB} onChange={(e) => setForm((p) => ({ ...p, amountTHB: Number(e.target.value || 0) }))} placeholder="金額 THB" className="rounded-lg border px-2 py-1.5 text-sm" />
              <input value={form.note} onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))} placeholder="備註" className="rounded-lg border px-2 py-1.5 text-sm md:col-span-2" />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="text-xs text-slate-500">TWD {(Number(form.amountTHB || 0) * rate).toFixed(0)}</div>
              <Button size="sm" onClick={addEntry}>新增雲端記帳</Button>
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
                    <div className="text-xs mt-1 {balance >= 0 ? 'text-emerald-700' : 'text-rose-700'}">
                      {balance >= 0 ? `應收 ฿${balance.toFixed(0)}` : `應付 ฿${Math.abs(balance).toFixed(0)}`}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="rounded-xl border p-3">
            <div className="text-sm font-medium">記帳明細</div>
            <div className="mt-2 max-h-72 space-y-2 overflow-auto pr-1">
              {entries.map((e) => (
                <div key={e.id} className="rounded-lg border p-2 text-sm flex justify-between items-start">
                  <div>
                    <div className="font-medium">{e.date}｜฿{Number(e.amountTHB).toFixed(0)}</div>
                    <div className="text-xs text-slate-600">{e.note || '-'}｜由 {e.paidBy} 支付</div>
                  </div>
                  <button onClick={() => removeEntry(e.id)} className="p-1 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
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
  const [done, setDone] = useState(false);
  const costTHB = estimateCostTHB(event);
  const costTWD = costTHB * rate;

  return (
    <div className={`relative rounded-2xl border bg-white/85 p-4 shadow-sm backdrop-blur ${palette.accent}`}>
      <div className="absolute right-3 top-3">
        <button onClick={() => setDone(!done)} className={`text-xs rounded-full border px-2 py-1 ${done ? "bg-emerald-100 text-emerald-800" : "bg-white"}`}>
          {done ? "已完成" : "未完成"}
        </button>
      </div>
      <div className="flex gap-3">
        <Badge className={`h-fit border ${palette.chip}`}>{event.time}</Badge>
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2">
            <span className={`p-1 rounded-full ${palette.icon}`}>{iconFor(event.icon)}</span>
            <h3 className="font-semibold">{event.title}</h3>
          </div>
          <p className="text-sm text-slate-600 flex items-center gap-1"><MapPin className="h-3 w-3"/>{event.location}</p>
          {event.note && <p className="text-sm text-slate-700 bg-white/50 p-2 rounded-lg">{event.note}</p>}
          <div className="text-xs text-slate-500 border-t pt-2">預估費用：฿{costTHB} (≈ NT${costTWD.toFixed(0)})</div>
        </div>
      </div>
    </div>
  );
}

export default function BangkokTripApp() {
  const [selectedDay, setSelectedDay] = useState(itinerary[0].id);
  const [rate, setRate] = useState(DEFAULT_TWD_PER_THB);
  const selected = useMemo(() => itinerary.find((d) => d.id === selectedDay) || itinerary[0], [selectedDay]);
  const activePalette = getDayPalette(selected.id);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 space-y-6">
      <Card className="rounded-3xl border-0 shadow-lg overflow-hidden">
        <CardHeader className={`bg-gradient-to-r ${activePalette.header}`}>
          <CardTitle className="text-2xl">曼谷員旅行程 2026</CardTitle>
          <p className="text-sm text-slate-600">3/4 ～ 3/8｜Firebase 即時雲端同步版</p>
        </CardHeader>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <TravelLedger rate={rate} palette={activePalette} />
          
          <Tabs value={selectedDay} onValueChange={setSelectedDay}>
            <TabsList className="grid grid-cols-5 gap-2 bg-transparent">
              {itinerary.map((day) => (
                <TabsTrigger key={day.id} value={day.id} className={`bg-white border rounded-xl p-2 ${getDayPalette(day.id).tab}`}>
                  <div className="text-xs">{day.dayLabel}</div>
                  <div className="font-bold">{day.date}</div>
                </TabsTrigger>
              ))}
            </TabsList>
            {itinerary.map((day) => (
              <TabsContent key={day.id} value={day.id} className="space-y-3 mt-4">
                {day.events.map((e, i) => <EventCard key={i} event={e} palette={getDayPalette(day.id)} rate={rate} />)}
              </TabsContent>
            ))}
          </Tabs>
        </div>

        <div className="space-y-4 h-fit sticky top-8">
          <Card className="rounded-2xl border p-4">
            <h4 className="text-sm font-medium mb-2">匯率設定</h4>
            <div className="flex items-center gap-2">
              <span className="text-xs">1 THB =</span>
              <input type="number" step="0.001" value={rate} onChange={(e)=>setRate(Number(e.target.value))} className="border rounded px-2 py-1 w-full" />
              <span className="text-xs">TWD</span>
            </div>
          </Card>
          <Card className={`rounded-2xl border p-4 ${activePalette.accent}`}>
            <div className="text-xs text-slate-500">{selected.dayLabel} 主題</div>
            <div className="font-bold text-lg">{selected.theme}</div>
            <div className="mt-2 text-xs text-slate-600">住宿：{selected.hotelInfo.name}</div>
          </Card>
        </div>
      </div>
    </div>
  );
}
