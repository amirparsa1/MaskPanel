# 🚂 استقرار MaskPanel by RunoFlux روی Railway

> بله حاجی! MaskPanel کاملا روی Railway کار می‌کنه - با Postgres و همه فیچرهای Flux. اینجا قدم به قدم یاد می‌گیری.

---

## 🎯 چرا Railway؟

- ✅ دیتابیس Postgres رایگان (500MB)
- ✅ دیپلوی خودکار از گیت‌هاب
- ✅ دامنه رایگان `*.up.railway.app`
- ✅ لاگ و متریک لایو
- ✅ بدون نیاز به سرور شخصی

---

## 🚀 روش ۱: دیپلوی یک‌کلیکه (ساده‌ترین)

### مرحله ۱: فورک کن

1. برو به https://github.com/amirparsa1/MaskPanel
2. دکمه Fork رو بزن

### مرحله ۲: Railway پروژه بساز

1. برو به https://railway.app/new
2. **Deploy from GitHub repo** رو بزن
3. ریپو `MaskPanel` که فورک کردی رو انتخاب کن
4. Railway خودش `Dockerfile` رو تشخیص می‌ده و شروع به بیلد می‌کنه

### مرحله ۳: دیتابیس اضافه کن

1. تو داشبورد Railway پروژه‌ات، دکمه **+ New** → **Database** → **Add PostgreSQL** رو بزن
2. Railway خودش متغیر `DATABASE_URL` رو می‌سازه

### مرحله ۴: متغیرهای محیطی (Environment Variables)

تو سرویس MaskPanel برو به تب **Variables** و اینا رو اضافه کن:

```env
# الزامی - Railway خودش PORT میده، ما مپ می‌کنیم
PORT=8000

# دیتابیس - Railway خودش DATABASE_URL میده، ما به SQLALCHEMY تبدیل می‌کنیم
# این متغیر رو اضافه کن و مقدارش رو از Postgres سرویس بگیر:
SQLALCHEMY_DATABASE_URL=${{Postgres.DATABASE_URL}}
# نکته: باید postgresql:// رو به postgresql+asyncpg:// تبدیل کنی
# مثال: postgresql+asyncpg://postgres:pass@host:5432/railway

# پنل
ROLE=all-in-one
NATS_ENABLED=0
DOCS=0
DEBUG=0

# سابسکریپشن
VITE_BASE_API=/
DASHBOARD_PATH=/dashboard/
SUBSCRIPTION_PATH=sub

# لاگ
LOG_LEVEL=INFO

# برای ادمین اول (اختیاری - بهتره از CLI بسازی)
# SUDO_USERNAME=admin
# SUDO_PASSWORD=یه-پسورد-قوی
```

**مهم برای Postgres URL:**

Railway بهت میده:
```
postgresql://postgres:xxxx@postgres.railway.internal:5432/railway
```

تو باید تبدیل کنی به:
```
postgresql+asyncpg://postgres:xxxx@postgres.railway.internal:5432/railway
```

یعنی فقط `+asyncpg` اضافه کن بعد `postgresql`.

### مرحله ۵: دامنه

1. تو سرویس MaskPanel → تب **Settings** → **Networking** → **Generate Domain**
2. یه دامنه مثل `maskpanel-by-runoflux.up.railway.app` می‌گیری
3. برو به `https://دامنه‌ات/dashboard/` 

### مرحله ۶: ادمین اول رو بساز

Railway → سرویس MaskPanel → تب **Deployments** → آخرین دیپلوی → **View Logs** رو باز کن، بعد:

یا از طریق **Railway CLI**:

```bash
railway login
railway link
railway run python maskpanel-cli.py user create --username admin --password YourStrongPass --is-sudo
```

یا راحت‌تر: تو لاگ وقتی بالا اومد میگه:

```
🎭 Starting MaskPanel (all-in-one) on 0.0.0.0:8000... ᛗ
```

بعد برو به:

```
https://your-domain.up.railway.app/dashboard/
```

صفحه لاگین میاد → پایین دکمه **Owner access** رو بزن → یه Temp Key بساز:

```bash
# تو Railway → Variables → یه متغیر موقت اضافه کن و بعد CLI:
railway run python maskpanel-cli.py generate-temp-key
```

کلید رو کپی کن، تو صفحه Owner access وارد کن، یوزر اونر بساز.

**تمام!** 🎉 پنل RunoFlux با Ghost Mode فعال بالا اومده!

---

## 🔧 روش ۲: با Railway CLI (حرفه‌ای)

```bash
# نصب Railway CLI
npm i -g @railway/cli
# یا
brew install railway

# لاگین
railway login

# پروژه جدید
railway init

# Postgres اضافه کن
railway add --database postgres

# متغیرها رو ست کن
railway variables --set "SQLALCHEMY_DATABASE_URL=postgresql+asyncpg://postgres:pass@postgres.railway.internal:5432/railway"
railway variables --set "ROLE=all-in-one"
railway variables --set "NATS_ENABLED=0"
railway variables --set "VITE_BASE_API=/"

# دیپلوی
railway up

# لاگ ببین
railway logs

# ادمین بساز
railway run python maskpanel-cli.py user create --username admin --password supersecret --is-sudo

# دامنه بگیر
railway domain
```

---

## 🐳 روش ۳: با Docker Compose روی Railway

Railway از `docker-compose.yml` پشتیبانی نمی‌کنه مستقیم، ولی می‌تونی 2 سرویس جدا بسازی:

**سرویس ۱: MaskPanel (همین Dockerfile)**
**سرویس ۲: Postgres**

تو `railway.json` ما گذاشتیم:

```json
{
  "build": { "builder": "dockerfile", "dockerfilePath": "Dockerfile" },
  "deploy": { "healthcheckPath": "/api/system" }
}
```

Railway خودش بیلد می‌کنه:
1. Python deps با `uv sync`
2. Dashboard با `bun run build` (نود 22)
3. کپی build به `/code/dashboard/build`
4. اجرای `start.sh` که migration می‌زنه و `main.py` رو اجرا می‌کنه

---

## ⚙️ متغیرهای مهم Railway

| متغیر | مقدار پیشنهادی | توضیح |
|-------|---------------|-------|
| `PORT` | `8000` (Railway خودش ست می‌کنه) | پورت Railway |
| `SQLALCHEMY_DATABASE_URL` | `postgresql+asyncpg://...` | از Postgres سرویس بگیر |
| `ROLE` | `all-in-one` | همه چیز تو یه سرویس |
| `NATS_ENABLED` | `0` | تو Railway تک‌ورکره، NATS خاموش |
| `VITE_BASE_API` | `/` | API همون دامنه |
| `DASHBOARD_PATH` | `/dashboard/` | مسیر داشبورد |
| `UVICORN_HOST` | `0.0.0.0` | برای Railway |
| `DOCS` | `0` | Swagger خاموش تو پروداکشن |

---

## 🔍 عیب‌یابی Railway

### بیلد فیل میشه؟

- چک کن `dashboard/bun.lock` موجوده
- لاگ بیلد رو ببین: Railway → Deployments → View Logs
- اگه bun فیل شد، npm fallback داریم

### دیتابیس وصل نمیشه؟

```bash
# URL باید asyncpg داشته باشه
postgresql+asyncpg://...

# نه این:
postgresql://...
```

### 502 Bad Gateway؟

- `start.sh` باید `PORT` رو بخونه - ما گذاشتیم
- Healthcheck مسیر `/api/system` - چک کن بالا اومده
- لاگ: `railway logs --service maskpanel`

### داشبورد سفید میاد؟

- `VITE_BASE_API` باید `/` باشه
- بیلد داشبورد چک کن: تو Dockerfile لاگ `ls -lh ./build/` داریم
- برو به `/dashboard/` نه `/`

### Ghost Mode کار نمی‌کنه؟

- Ghost Mode فقط UI هست، بک‌اندش mockه - ولی تو Railway هم کار می‌کنه
- Flux API ها: `/api/flux/meter`, `/api/flux/ghost/status` - بدون دیتابیس هم کار می‌کنن

---

## 🌊 فیچرهای RunoFlux تو Railway

همه فیچرهای منحصر به فرد MaskPanel تو Railway هم فعالن:

- ✅ **Mask Identities** - لیست ماسک‌ها (mock ولی قابل گسترش)
- ✅ **Flux Meter** - 6 متریک با انیمیشن
- ✅ **Obfuscation Score** - امتیاز دایره‌ای
- ✅ **Ghost Mode** - تگل و ویجت سایدبار
- ✅ **Rune System** - `ᛗ ᚱ ᚠ ᛚ ᚢ ᛉ` همه جا
- ✅ **Obsidian Flux Theme** - تم تیره پیش‌فرض
- ✅ **Flux Banner** - بنر بالا به جای تبلیغ

---

## 💰 هزینه Railway

- **Hobby Plan**: 5$ ماهانه، 500 ساعت اجرا، Postgres 500MB رایگان
- برای پنل کوچیک (50 کاربر) کافیه
- اگه ترافیکت بالاست، برو سراغ VPS (Hetzner 4€)

---

## 🔐 امنیت تو Railway

1. **دامنه رو با Cloudflare بپوشون** (اختیاری):
   - Cloudflare → Add site → دامنه Railway رو CNAME کن
   - SSL Full

2. **پسورد قوی** برای ادمین

3. **Temp Key** رو بعد ساخت اونر پاک کن:
   ```bash
   railway variables --set "SUDO_USERNAME=" --set "SUDO_PASSWORD="
   ```

4. **بک‌آپ Postgres**:
   - Railway → Postgres → Backups (روزانه)

---

## 📚 لینک‌ها

- ریپو: https://github.com/amirparsa1/MaskPanel
- داک اصلی PasarGuard: https://docs.pasarguard.org
- Railway Docs: https://docs.railway.app
- RunoFlux Brand: `RUNOFLUX.md` تو همین ریپو

---

## 🆘 کمک می‌خوای؟

اگه تو Railway گیر کردی:

1. لاگ رو بفرست: `railway logs`
2. متغیرها رو چک کن: `railway variables`
3. ایشو باز کن تو گیت‌هاب

**حاجی، Railway راحت‌ترین راهه برای تست MaskPanel بدون سرور!** 🎭🚂

---

<p align="center">
<strong>MaskPanel by RunoFlux on Railway</strong><br/>
<code>ᛗ ᚨᛊᚲ ᛈᚨᚾᛖᛚ • ᚱᚢᚾᛟᚠᛚᚢᛉ • 🚂 Railway Ready</code>
</p>
