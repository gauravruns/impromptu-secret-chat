# Impromptu 🤫

> **Ephemeral Secret Conversations & Anonymous Q&A for Friends**

[![Live Demo](https://img.shields.io/badge/Live_Demo-GitHub_Pages-00FF88?style=for-the-badge&logo=github)](https://gauravruns.github.io/impromptu-secret-chat/)
[![React](https://img.shields.io/badge/React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite_4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Firebase_10-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

---

## 🌟 Overview

**Impromptu** is an anonymous, real-time social web application designed for friend groups, college circles, and teams who want to have completely candid, uninhibited conversations without opening up credentials or fearing social exposure.

Unlike traditional platforms that mandate phone numbers, emails, or account sign-ups, **Impromptu operates on an ephemeral, zero-credential privacy model**:
- Anyone can create or join an encrypted session room in seconds.
- Every participant receives an evocative, randomized anonymous persona per room (e.g. *Midnight Falcon*, *Velvet Cipher*, *Neon Ghost*).
- Rooms automatically expire after 12 hours of inactivity, leaving no persistent digital footprint.

---

## 🚀 Key Features

- 🔒 **Zero-Credential Anonymity**: No passwords, no phone numbers, no emails. Users simply create or join a room with a 6-character code or direct invite link.
- 🎭 **Dynamic Persona Engine**: Real identities are completely scrubbed. The system assigns unique, fun burner aliases and avatars to every participant upon joining.
- 📊 **Interactive Live Polls**: Multi-choice polls with live percentage vote progression and instant peer feedback.
- 🤫 **Anonymous Confessionals**: Long-form and short-take confessional threads where friends can answer candid prompts without fear of judgement.
- ⚡ **Real-Time Stream**: Powered by Google Cloud Firestore reactive listeners (`onSnapshot`) for real-time synchronization with zero page reloads.
- 🔗 **Frictionless Share Links**: One-click invite link copying (`?room=CODE`) automatically pre-fills the room code for seamless group onboarding.
- ⏱️ **Auto-Expiring Ephemeral Lifecycle**: Sessions auto-expire after 12 hours of inactivity to ensure discussions remain private and time-bound.

---

## 🏗️ Architecture & Data Flow

```ascii
+--------------------------------------------------------------------------------+
|                                  CLIENT LAYER                                  |
|                                                                                |
|     [ Host / Join View ]  --->  [ Dynamic Persona Engine ] ---> [ Live Feed ]   |
|      (Instant Link / Code)      (Random Burner Identity)        (Polls/Chats)  |
+---------------------------------------+----------------------------------------+
                                        |  (Reactive WebSockets / WSS)
                                        v
+--------------------------------------------------------------------------------+
|                                FIREBASE BACKEND                                |
|                                                                                |
|  +-----------------------------+             +-------------------------------+ |
|  |      Firebase Auth          |             |       Cloud Firestore         | |
|  |  (Anonymous User Token)     |             |  - /rooms/{roomCode}          | |
|  +-----------------------------+             |  - /room_members/{memberId}   | |
|                                              |  - /questions/{questionId}    | |
|                                              |  - /answers/{answerId}        | |
|                                              +-------------------------------+ |
+--------------------------------------------------------------------------------+
```

---

## 📁 Project Structure

```
Impromptu-3/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions: automated build & deploy to Pages
├── index.html                   # HTML shell with Google Fonts & responsive viewport
├── package.json                 # Dependencies and npm scripts
├── vite.config.js               # Vite 4 configuration and base paths
├── README.md                    # Project documentation & architecture
└── src/
    ├── main.jsx                 # Application entry point
    └── App.jsx                  # Main application: Persona generator, Room views, Polls & Feed
```

---

## 🛠️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- [npm](https://www.npmjs.com/) (v9.0.0 or higher)

### Installation

1. **Clone the repository**:
   ```bash
   git clone git@github.com:gauravruns/impromptu-secret-chat.git
   cd impromptu-secret-chat
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the local development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## 🔐 Privacy & Security Model

| Risk Vector | Traditional Platforms | Impromptu Architecture |
| :--- | :--- | :--- |
| **Identity Exposure** | Tied to email, phone, or Google OAuth | Scrubbed; randomized burner personas per session |
| **Data Persistence** | Indefinite archival of messages and chats | Ephemeral; room expires after 12 hours |
| **Credentials / Leaks** | Passwords vulnerable to credential stuffing | Zero credentials; tokenized room handshake |
| **Cross-Session Tracking** | Cookies and browser fingerprinting | Session-scoped state with no persistent trackers |

---

## 🗺️ Roadmap

- [x] Ephemeral room generation and joining via 6-character room codes
- [x] Dynamic anonymous persona assignments with custom burner aliases
- [x] Multi-format interactions (Polls, Short Answers, Confessions)
- [x] One-click invite link sharing (`?room=XYZ` URL parameter handling)
- [ ] End-to-end client-side encryption using the Web Crypto API (SubtleCrypto)
- [ ] Voice confessional notes with real-time acoustic distortion
- [ ] Icebreaker spark card decks ("Who in this room is most likely to...")

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">
  <b>Crafted with ❤️ for candid, private conversations by <a href="https://github.com/gauravruns">@gauravruns</a></b>
</div>
