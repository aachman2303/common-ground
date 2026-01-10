<div align="center">

# 🌱 Common Ground  
### Ambient well-being support — without the mental health label

> *“You’re not the only one feeling this — and you don’t have to deal with it alone.”*

🔗 **Predictive • Anonymous • Campus-Scale • Human-Centered**

---

![Status](https://img.shields.io/badge/status-prototype-blue)
![Built With](https://img.shields.io/badge/built%20with-Next.js%20%7C%20Firebase%20%7C%20Vertex%20AI-green)
![License](https://img.shields.io/badge/license-MIT-purple)

</div>

---

## 📌 Table of Contents

- [🎯 About](#-about)
- [✨ Why Common Ground?](#-why-common-ground)
- [🚀 Core Features](#-core-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🏗️ System Architecture](#️-system-architecture)
- [📦 Installation & Setup](#-installation--setup)
- [🎮 Usage](#-usage)
- [🧠 AI & Predictive Model](#-ai--predictive-model)
- [📊 Impact & Metrics](#-impact--metrics)
- [📁 Project Structure](#-project-structure)
- [🙏 Acknowledgements](#-acknowledgements)

---

## 🎯 About

**Common Ground** is an ambient, AI-powered layer of well-being support woven directly into **campus digital life**.

Instead of treating mental health as a **crisis-only, clinical problem**, Common Ground reframes it as a **shared, everyday human experience** — something students can feel together, anonymously, without stigma.

> No labels.  
> No forced vulnerability.  
> Just *presence, awareness, and connection*.

---

## ✨ Why Common Ground?

| Current Systems | Common Ground |
|-----------------|---------------|
| ❌ Clinical & stigmatizing | ✅ Normalized & relatable |
| ❌ Reactive (crisis-only) | ✅ Predictive & preventive |
| ❌ Requires vulnerability upfront | ✅ Zero-openness by default |
| ❌ Isolating experiences | ✅ Collective awareness |
| ❌ Another app to install | ✅ Ambient layer in existing tools |

---

## 🚀 Core Features

### 🌍 1. Shared Reality Visualization
- Live **campus emotional heatmap** (Google Maps)
- Messages like:  
  > *“You + 312 others feel overwhelmed today”*
- Fully anonymous, aggregated stress insights

---

### 🤝 2. Activity-Based Connection
Connection **without pressure to talk**:
- 🤫 Silent Study Rooms  
- 👯 Parallel Work Sessions  
- ⏱️ 48-Hour Accountability Pairing  
- 🧘 Synchronized breathing & break sessions  

---

### 🔮 3. Predictive, Preventive AI
- Detects stress trends **7–10 days before peaks**
- Gentle nudges *before* burnout happens
- Contextual awareness via:
  - Google Calendar
  - Gmail (language stress signals)
  - Campus schedules

---

### 🔐 4. Privacy-First by Design
- 🕶️ Anonymous by default  
- ⏳ Ephemeral check-ins (auto-deleted in 24h)  
- 🔒 End-to-end encrypted peer chats  
- ✅ Opt-in everything, user-controlled  

---

## 🛠️ Tech Stack

### Frontend
- **React.js + Next.js** — Progressive Web App  
- **Tailwind CSS** — Responsive, modern UI  
- **Firebase SDK** — Real-time sync  
- **Google Maps JS API** — Heatmaps  

### Backend
- **Node.js + Express**
- **Firebase Cloud Functions**
- **Firestore**
- **Google Cloud Run**

### AI & ML
- **Vertex AI** — Stress prediction models  
- **Gemini API** — Empathetic suggestions  
- **Dialogflow** — Conversational mediation  
- **TensorFlow.js** — On-device pattern detection  

### Analytics & DevOps
- BigQuery • Looker Studio • GA4  
- Cloud Build • Secret Manager • Cloud Armor  

---

## 🏗️ System Architecture

```text
User (PWA)
   ↓
Firebase Auth & Realtime Sync
   ↓
Cloud Functions (API Gateway)
   ↓
Vertex AI + Gemini (AI Layer)
   ↓
Firestore / BigQuery (Data Layer)
   ↓
Admin Dashboards & Campus Systems