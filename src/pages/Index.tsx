import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const PRICES = [
  { stars: 50, price: 75 },
  { stars: 100, price: 150 },
  { stars: 200, price: 300 },
  { stars: 300, price: 450 },
  { stars: 400, price: 600 },
  { stars: 500, price: 750 },
  { stars: 600, price: 900 },
  { stars: 700, price: 1050 },
  { stars: 800, price: 1200 },
  { stars: 900, price: 1350 },
  { stars: 1000, price: 1500 },
  { stars: 1500, price: 2250 },
  { stars: 2000, price: 3000 },
  { stars: 2500, price: 3750 },
  { stars: 3000, price: 4500 },
  { stars: 3500, price: 5250 },
  { stars: 4000, price: 6000 },
  { stars: 4500, price: 6750 },
  { stars: 5000, price: 7500 },
  { stars: 5500, price: 8250 },
  { stars: 6000, price: 9000 },
  { stars: 6500, price: 9750 },
  { stars: 7000, price: 10500 },
  { stars: 7500, price: 11250 },
  { stars: 8000, price: 12000 },
  { stars: 8500, price: 12750 },
  { stars: 9000, price: 13500 },
  { stars: 9500, price: 14250 },
  { stars: 10000, price: 15000 },
  { stars: 15000, price: 22500 },
  { stars: 20000, price: 30000 },
  { stars: 25000, price: 37500 },
];

const RATE = 1.5;

function StarsBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const stars: { x: number; y: number; r: number; a: number; da: number; speed: number }[] = [];
    for (let i = 0; i < 220; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.3,
        a: Math.random(),
        da: (Math.random() * 0.005 + 0.002) * (Math.random() > 0.5 ? 1 : -1),
        speed: Math.random() * 0.05 + 0.01,
      });
    }

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // nebula blobs
      const grad1 = ctx.createRadialGradient(
        canvas.width * 0.2, canvas.height * 0.3, 0,
        canvas.width * 0.2, canvas.height * 0.3, canvas.width * 0.35
      );
      grad1.addColorStop(0, "rgba(90,40,160,0.18)");
      grad1.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad1;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const grad2 = ctx.createRadialGradient(
        canvas.width * 0.8, canvas.height * 0.6, 0,
        canvas.width * 0.8, canvas.height * 0.6, canvas.width * 0.3
      );
      grad2.addColorStop(0, "rgba(20,80,140,0.15)");
      grad2.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = grad2;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach((s) => {
        s.a += s.da;
        if (s.a > 1 || s.a < 0.1) s.da *= -1;
        s.y -= s.speed;
        if (s.y < 0) s.y = canvas.height;

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.a})`;
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ background: "linear-gradient(160deg, #06040f 0%, #0a0618 40%, #060312 100%)" }}
    />
  );
}

export default function Index() {
  const [customStars, setCustomStars] = useState("");
  const [username, setUsername] = useState("");
  const [selected, setSelected] = useState<{ stars: number; price: number } | null>(null);
  const [tab, setTab] = useState<"table" | "custom">("table");
  const [copied, setCopied] = useState(false);

  const customPrice = (() => {
    const n = parseInt(customStars);
    if (!n || n < 1) return null;
    return Math.ceil(n * RATE);
  })();

  const handleCopy = () => {
    navigator.clipboard.writeText("@abmsks");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOrder = (stars: number, price: number) => {
    setSelected({ stars, price });
    document.getElementById("order-section")?.scrollIntoView({ behavior: "smooth" });
  };

  const telegramLink = () => {
    const stars = selected?.stars ?? (parseInt(customStars) || "?");
    const price = selected?.price ?? customPrice ?? "?";
    const text = `Хочу купить ${stars} ⭐️ за ${price}₽\nМой юзернейм: ${username || "не указан"}`;
    return `https://t.me/abmsks?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="relative min-h-screen text-white" style={{ fontFamily: "'Golos Text', sans-serif" }}>
      <StarsBg />

      {/* HEADER */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⭐</span>
          <span
            className="text-xl font-semibold tracking-wide"
            style={{ fontFamily: "'Cormorant', serif", color: "#f0c060" }}
          >
            Звёздная Лавка
          </span>
        </div>
        <a
          href="https://t.me/abmsks"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all"
          style={{
            background: "rgba(240,192,96,0.12)",
            border: "1px solid rgba(240,192,96,0.3)",
            color: "#f0c060",
          }}
        >
          <Icon name="Send" size={14} />
          @abmsks
        </a>
      </header>

      {/* HERO */}
      <section className="relative z-10 text-center px-4 pt-16 pb-12">
        <div
          className="inline-block px-4 py-1.5 rounded-full text-xs font-medium mb-6 tracking-widest uppercase"
          style={{
            background: "rgba(240,192,96,0.1)",
            border: "1px solid rgba(240,192,96,0.25)",
            color: "#f0c060",
          }}
        >
          🔥 Новый курс — 1.50₽ за звезду
        </div>
        <h1
          className="text-5xl md:text-7xl font-light mb-4 leading-tight"
          style={{ fontFamily: "'Cormorant', serif", color: "#f5ecd4" }}
        >
          Купи звёзды<br />
          <span style={{ color: "#f0c060" }}>Telegram ⭐</span>
        </h1>
        <p className="text-lg md:text-xl mb-2" style={{ color: "rgba(200,190,230,0.7)" }}>
          Лучший курс · Быстрая отправка · Любое количество
        </p>
        <p className="text-sm mb-10" style={{ color: "rgba(160,150,200,0.5)" }}>
          Можно покупать нечётное количество — отправим точно!
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            className="px-8 py-3 rounded-full text-sm font-semibold transition-all hover:scale-105"
            style={{ background: "linear-gradient(135deg, #c9952a, #f0c060)", color: "#0a0815" }}
            onClick={() => document.getElementById("prices")?.scrollIntoView({ behavior: "smooth" })}
          >
            Смотреть цены
          </button>
          <a
            href="https://t.me/abmsks"
            target="_blank"
            rel="noreferrer"
            className="px-8 py-3 rounded-full text-sm font-medium transition-all hover:scale-105"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(220,215,245,0.8)",
            }}
          >
            Написать в Telegram
          </a>
        </div>
      </section>

      {/* STATS */}
      <section className="relative z-10 max-w-3xl mx-auto px-4 mb-16">
        <div
          className="grid grid-cols-3 gap-4 p-6 rounded-2xl"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {[
            { icon: "Star", val: "1.50₽", label: "за звезду" },
            { icon: "Zap", val: "Быстро", label: "отправка сразу" },
            { icon: "Infinity", val: "Любое", label: "количество" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <Icon name={s.icon} size={20} className="mx-auto mb-2" style={{ color: "#f0c060" }} />
              <div className="text-xl font-bold" style={{ color: "#f0c060", fontFamily: "'Cormorant', serif" }}>{s.val}</div>
              <div className="text-xs mt-0.5" style={{ color: "rgba(160,150,200,0.6)" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICES */}
      <section id="prices" className="relative z-10 max-w-4xl mx-auto px-4 mb-20">
        <h2
          className="text-4xl font-light text-center mb-2"
          style={{ fontFamily: "'Cormorant', serif", color: "#f5ecd4" }}
        >
          Прайс-лист
        </h2>
        <p className="text-center text-sm mb-8" style={{ color: "rgba(160,150,200,0.6)" }}>
          Нажми на строку, чтобы выбрать количество
        </p>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 p-1 rounded-full w-fit mx-auto" style={{ background: "rgba(255,255,255,0.05)" }}>
          {(["table", "custom"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-5 py-2 rounded-full text-sm font-medium transition-all"
              style={
                tab === t
                  ? { background: "linear-gradient(135deg, #c9952a, #f0c060)", color: "#0a0815" }
                  : { color: "rgba(200,190,230,0.6)" }
              }
            >
              {t === "table" ? "Таблица цен" : "Своя сумма"}
            </button>
          ))}
        </div>

        {tab === "table" ? (
          <div
            className="rounded-2xl overflow-hidden"
            style={{ border: "1px solid rgba(240,192,96,0.12)" }}
          >
            {/* Table header */}
            <div
              className="grid grid-cols-3 px-6 py-3 text-xs uppercase tracking-widest"
              style={{
                background: "rgba(240,192,96,0.08)",
                color: "rgba(240,192,96,0.7)",
                borderBottom: "1px solid rgba(240,192,96,0.1)",
              }}
            >
              <span>Звёзды ⭐</span>
              <span className="text-center">Цена</span>
              <span className="text-right">Действие</span>
            </div>

            <div className="max-h-[520px] overflow-y-auto scrollbar-hide">
              {PRICES.map((row, i) => (
                <div
                  key={row.stars}
                  className="grid grid-cols-3 items-center px-6 py-3.5 cursor-pointer transition-all"
                  style={{
                    background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.15)",
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(240,192,96,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background =
                      i % 2 === 0 ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.15)";
                  }}
                  onClick={() => handleOrder(row.stars, row.price)}
                >
                  <span className="font-semibold" style={{ color: "#f5ecd4" }}>
                    {row.stars.toLocaleString("ru")} ⭐
                  </span>
                  <span className="text-center font-bold" style={{ color: "#f0c060" }}>
                    {row.price.toLocaleString("ru")} ₽
                  </span>
                  <div className="flex justify-end">
                    <button
                      className="px-3 py-1 rounded-lg text-xs font-medium transition-all hover:scale-105"
                      style={{
                        background: "rgba(240,192,96,0.15)",
                        border: "1px solid rgba(240,192,96,0.3)",
                        color: "#f0c060",
                      }}
                    >
                      Выбрать
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div
            className="rounded-2xl p-8"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(240,192,96,0.12)" }}
          >
            <p className="text-sm mb-2" style={{ color: "rgba(200,190,230,0.7)" }}>
              Введи любое количество звёзд — мы отправим точно!
            </p>
            <input
              type="number"
              min={1}
              placeholder="Например: 777"
              value={customStars}
              onChange={(e) => {
                setCustomStars(e.target.value);
                setSelected(null);
              }}
              className="w-full rounded-xl px-4 py-3 text-lg mb-4 input-cosmic"
              style={{
                background: "rgba(10,8,25,0.8)",
                border: "1px solid rgba(240,192,96,0.2)",
                color: "rgba(220,215,245,0.9)",
              }}
            />
            {customPrice && (
              <div className="flex items-center justify-between p-4 rounded-xl mb-4"
                style={{ background: "rgba(240,192,96,0.08)", border: "1px solid rgba(240,192,96,0.2)" }}>
                <span style={{ color: "rgba(200,190,230,0.8)" }}>
                  {parseInt(customStars).toLocaleString("ru")} ⭐
                </span>
                <span className="text-2xl font-bold" style={{ fontFamily: "'Cormorant', serif", color: "#f0c060" }}>
                  {customPrice.toLocaleString("ru")} ₽
                </span>
              </div>
            )}
            {customPrice && (
              <button
                className="w-full py-3 rounded-xl font-semibold text-sm transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg, #c9952a, #f0c060)", color: "#0a0815" }}
                onClick={() => handleOrder(parseInt(customStars), customPrice)}
              >
                Выбрать этот вариант
              </button>
            )}
          </div>
        )}
      </section>

      {/* ORDER */}
      <section id="order-section" className="relative z-10 max-w-xl mx-auto px-4 mb-20">
        <div
          className="rounded-2xl p-8"
          style={{
            background: "linear-gradient(135deg, rgba(20,10,50,0.9), rgba(8,5,20,0.95))",
            border: "1px solid rgba(240,192,96,0.2)",
            boxShadow: "0 0 60px rgba(240,192,96,0.06)",
          }}
        >
          <h2
            className="text-3xl font-light text-center mb-1"
            style={{ fontFamily: "'Cormorant', serif", color: "#f5ecd4" }}
          >
            Оформить заказ
          </h2>
          <p className="text-center text-sm mb-6" style={{ color: "rgba(160,150,200,0.5)" }}>
            Укажи юзернейм — мы отправим звёзды на твой аккаунт
          </p>

          {selected && (
            <div
              className="flex items-center justify-between p-4 rounded-xl mb-5"
              style={{ background: "rgba(240,192,96,0.08)", border: "1px solid rgba(240,192,96,0.2)" }}
            >
              <div>
                <div className="text-xs uppercase tracking-widest mb-0.5" style={{ color: "rgba(240,192,96,0.6)" }}>
                  Выбрано
                </div>
                <div className="font-semibold" style={{ color: "#f5ecd4" }}>
                  {selected.stars.toLocaleString("ru")} ⭐
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs uppercase tracking-widest mb-0.5" style={{ color: "rgba(240,192,96,0.6)" }}>
                  К оплате
                </div>
                <div className="text-2xl font-bold" style={{ fontFamily: "'Cormorant', serif", color: "#f0c060" }}>
                  {selected.price.toLocaleString("ru")} ₽
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                style={{ color: "rgba(200,190,230,0.3)" }}
                className="hover:text-white transition-colors ml-2"
              >
                <Icon name="X" size={16} />
              </button>
            </div>
          )}

          {!selected && (
            <div
              className="flex items-center gap-3 p-4 rounded-xl mb-5"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <Icon name="Info" size={16} style={{ color: "rgba(160,150,200,0.5)" }} />
              <span className="text-sm" style={{ color: "rgba(160,150,200,0.5)" }}>
                Выбери количество звёзд в прайсе выше
              </span>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: "rgba(240,192,96,0.6)" }}>
              Юзернейм в Telegram
            </label>
            <div className="relative">
              <span
                className="absolute left-4 top-1/2 -translate-y-1/2 text-sm"
                style={{ color: "rgba(160,150,200,0.5)" }}
              >
                @
              </span>
              <input
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value.replace("@", ""))}
                className="w-full pl-8 pr-4 py-3 rounded-xl text-sm"
                style={{
                  background: "rgba(10,8,25,0.8)",
                  border: "1px solid rgba(240,192,96,0.2)",
                  color: "rgba(220,215,245,0.9)",
                  outline: "none",
                }}
              />
            </div>
            <p className="text-xs mt-1.5" style={{ color: "rgba(160,150,200,0.4)" }}>
              На этот аккаунт придут звёзды
            </p>
          </div>

          <a
            href={telegramLink()}
            target="_blank"
            rel="noreferrer"
            className={`flex items-center justify-center gap-2 w-full py-4 rounded-xl font-semibold text-sm transition-all ${
              selected || customPrice ? "hover:scale-105" : "opacity-40 pointer-events-none"
            }`}
            style={{
              background: selected || customPrice
                ? "linear-gradient(135deg, #c9952a, #f0c060)"
                : "rgba(240,192,96,0.2)",
              color: "#0a0815",
            }}
          >
            <Icon name="Send" size={16} />
            Написать @abmsks в Telegram
          </a>

          <p className="text-center text-xs mt-3" style={{ color: "rgba(160,150,200,0.4)" }}>
            После нажатия откроется Telegram с готовым сообщением
          </p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative z-10 max-w-3xl mx-auto px-4 mb-20">
        <h2
          className="text-4xl font-light text-center mb-10"
          style={{ fontFamily: "'Cormorant', serif", color: "#f5ecd4" }}
        >
          Как это работает
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { step: "1", icon: "Star", title: "Выбери количество", desc: "Любое число звёзд — хоть 77, хоть 10 000" },
            { step: "2", icon: "Send", title: "Напиши нам", desc: "Напишите @abmsks свой юзернейм и количество звёзд" },
            { step: "3", icon: "Zap", title: "Получи звёзды", desc: "Отправим на твой Telegram-аккаунт быстро" },
          ].map((s) => (
            <div
              key={s.step}
              className="rounded-2xl p-6 text-center transition-all hover:-translate-y-1"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold"
                style={{ background: "rgba(240,192,96,0.15)", color: "#f0c060" }}
              >
                {s.step}
              </div>
              <Icon name={s.icon} size={22} className="mx-auto mb-3" style={{ color: "#f0c060" }} />
              <div className="font-semibold mb-1" style={{ color: "#f5ecd4" }}>{s.title}</div>
              <div className="text-sm" style={{ color: "rgba(160,150,200,0.6)" }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section className="relative z-10 max-w-lg mx-auto px-4 mb-20 text-center">
        <div
          className="rounded-2xl p-10"
          style={{
            background: "linear-gradient(135deg, rgba(240,192,96,0.06), rgba(90,40,160,0.08))",
            border: "1px solid rgba(240,192,96,0.15)",
          }}
        >
          <div className="text-4xl mb-4">⭐</div>
          <h2
            className="text-3xl font-light mb-3"
            style={{ fontFamily: "'Cormorant', serif", color: "#f5ecd4" }}
          >
            По всем вопросам
          </h2>
          <p className="text-sm mb-6" style={{ color: "rgba(160,150,200,0.6)" }}>
            Пишите напрямую — отвечаем быстро
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://t.me/abmsks"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition-all hover:scale-105"
              style={{ background: "linear-gradient(135deg, #c9952a, #f0c060)", color: "#0a0815" }}
            >
              <Icon name="Send" size={15} />
              Написать в Telegram
            </a>
            <button
              onClick={handleCopy}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all hover:scale-105"
              style={{
                background: "rgba(240,192,96,0.08)",
                border: "1px solid rgba(240,192,96,0.25)",
                color: "#f0c060",
              }}
            >
              <Icon name={copied ? "Check" : "Copy"} size={15} />
              {copied ? "Скопировано!" : "@abmsks"}
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        className="relative z-10 text-center py-8 px-4"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)", color: "rgba(160,150,200,0.35)" }}
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <span>⭐</span>
          <span className="text-sm" style={{ fontFamily: "'Cormorant', serif" }}>Звёздная Лавка</span>
        </div>
        <p className="text-xs">Курс: 1.50₽ за звезду · @abmsks · Любое количество</p>
      </footer>
    </div>
  );
}