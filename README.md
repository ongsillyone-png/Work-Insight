# 📊 Work Insight

## ระบบบริหารจัดการงานและวิเคราะห์ข้อมูลการปฏิบัติงานด้านดิจิทัลของโรงพยาบาล

Work Insight เป็นระบบสำหรับบริหารจัดการงาน (Work Management) และวิเคราะห์ข้อมูลการปฏิบัติงาน (Activity Intelligence) ของบุคลากรด้านเทคโนโลยีสารสนเทศในโรงพยาบาล

ระบบช่วยให้สามารถติดตามภาระงาน วิเคราะห์ประสิทธิภาพการทำงาน สรุปรายงาน KPI และแสดงข้อมูลผ่าน Dashboard เพื่อสนับสนุนการบริหารจัดการและการตัดสินใจของผู้บริหาร

---

# ✨ ความสามารถของระบบ

- 📊 Dashboard วิเคราะห์ข้อมูลแบบ Real-time
- 👥 จัดการผู้ใช้งานและสิทธิ์การใช้งาน
- 🏢 จัดการหน่วยงาน
- 📋 บันทึกกิจกรรมการปฏิบัติงานประจำวัน
- 📈 วิเคราะห์ภาระงาน (Workload Analytics)
- 📅 สรุปผลการปฏิบัติงานรายวัน / รายเดือน / รายปี
- 🎯 วิเคราะห์ KPI
- 🔔 ระบบแจ้งเตือน
- 📧 สรุปรายงานอัตโนมัติ (MOPH Daily Summary)
- 📂 นำเข้าและส่งออกข้อมูล
- 🔍 ค้นหาและกรองข้อมูล
- 📱 รองรับการใช้งานผ่านคอมพิวเตอร์ แท็บเล็ต และโทรศัพท์มือถือ
- 🔒 ระบบ Login และกำหนดสิทธิ์การใช้งาน

---

# 🛠 เทคโนโลยีที่ใช้

| รายการ | เทคโนโลยี |
|---------|------------|
| Backend | Node.js 22 LTS |
| Framework | Express.js 5 |
| Database | MariaDB 11.x |
| Template Engine | EJS |
| Frontend | Bootstrap 5.3 |
| Admin Template | AdminLTE 4 |
| Charts | Apache ECharts |
| UI Components | Tom Select |
| Alert | SweetAlert2 |
| Icons | Bootstrap Icons |

---

# 🏗️ โครงสร้างโปรเจกต์

```
Work-Insight
│
├── config/
├── controllers/
├── helpers/
├── jobs/
├── middlewares/
├── repositories/
├── routes/
├── services/
├── utils/
├── validators/
├── views/
├── public/
│   ├── css/
│   ├── js/
│   ├── img/
│   └── uploads/
│
├── app.js
├── server.js
├── package.json
├── package-lock.json
├── .env.example
└── README.md
```

---

# 🧩 สถาปัตยกรรมของระบบ

ระบบถูกออกแบบตามแนวคิด **MVC (Model - View - Controller)** และแบ่งหน้าที่ออกเป็นหลายชั้น (Layered Architecture) เพื่อให้ดูแลรักษาและพัฒนาต่อยอดได้ง่าย

- **Controllers** รับคำขอจากผู้ใช้งานและควบคุมการทำงานของระบบ
- **Services** ประมวลผล Business Logic
- **Repositories** ติดต่อฐานข้อมูล
- **Middlewares** ตรวจสอบสิทธิ์และจัดการ Request
- **Validators** ตรวจสอบความถูกต้องของข้อมูล
- **Views** แสดงผลด้วย EJS และ AdminLTE

---

# 🚀 วิธีติดตั้ง

## 1. Clone โปรเจกต์

```bash
git clone https://github.com/ongsillyone-png/Work-Insight.git
```

---

## 2. ติดตั้ง Package

```bash
npm install
```

---

## 3. สร้างไฟล์ .env

Windows

```cmd
copy .env.example .env
```

Linux

```bash
cp .env.example .env
```

แก้ไขค่าภายในไฟล์ `.env`

---

## 4. สร้างฐานข้อมูล

สร้างฐานข้อมูล MariaDB

จากนั้น Import ไฟล์ SQL

---

## 5. เริ่มต้นระบบ

```bash
npm run dev
```

หรือ

```bash
node app.js
```

---

# 🌐 เข้าใช้งาน

```
http://localhost:3000
```

---
user: admin
pass: admin1234

# 💻 ความต้องการของระบบ

- Node.js 22 LTS
- MariaDB 11.x
- npm

---

# 📈 แผนการพัฒนา

- Dashboard วิเคราะห์ข้อมูลขั้นสูง
- KPI Dashboard
- ระบบรายงานผู้บริหาร
- ระบบแจ้งเตือนอัตโนมัติ
- Email Notification
- LINE Notify
- Mobile Friendly
- REST API
- ระบบกำหนดเป้าหมาย (Goal & Performance)
- ระบบสรุปรายงานอัตโนมัติ
- รองรับหลายโรงพยาบาล (Multi Organization)

---

# 👨‍💻 ผู้พัฒนา

ong-napho
website
https://ssdpcu.com

GitHub
https://github.com/ongsillyone-png

---

# 📢 หมายเหตุ

Work Insight เป็นโครงการที่พัฒนาขึ้นเพื่อสนับสนุนการบริหารจัดการงานด้านเทคโนโลยีสารสนเทศภายในโรงพยาบาล โดยมุ่งเน้นการเพิ่มประสิทธิภาพการทำงาน การวิเคราะห์ข้อมูล และการสนับสนุนการตัดสินใจของผู้บริหารผ่านข้อมูลที่ถูกต้องและเป็นปัจจุบัน

โครงการยังอยู่ระหว่างการพัฒนาและจะมีการเพิ่มความสามารถอย่างต่อเนื่อง

---

⭐ หากโปรเจกต์นี้เป็นประโยชน์ สามารถกด **Star** บน GitHub เพื่อเป็นกำลังใจในการพัฒนาต่อไป
