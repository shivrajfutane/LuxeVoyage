# LuxeVoyage | AI-Powered Luxury Travel Planner

LuxeVoyage is a modern, high-end travel planning platform that leverages AI to create personalized, weather-aware itineraries. Built with a focus on experience and aesthetics, it features a "Nomad Identity Hub" for travelers to showcase their journeys and manage their travel persona.

![LuxeVoyage Banner](https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?q=80&w=2070&auto=format&fit=crop)

## ✨ Features

### 🤖 AI Trip Generation
- **Intelligent Itineraries**: Generate many-day plans using Groq (LLaMA 3.3 70B) based on destination, budget, and travel style.
- **Weather-Aware Planning**: Integrates real-time weather context from Open-Meteo to suggest appropriate activities.
- **Smart Packing Lists**: Get AI-generated packing strategies tailored to your destination and trip duration.

### 👤 Nomad Identity Hub
- **Traveler Profiles**: Create a professional traveler identity with custom bios and travel personas.
- **Public Sharing**: Share your travel history and stats through privacy-safe public profile links.
- **Journey Stats**: Automatically calculates your travel milestones, including journey counts and estimated "miles" explored.

### 💰 Trip Management
- **Expense Tracking**: Manage your travel budget with categorized expense logging.
- **Itinerary Storage**: Access your entire travel history in one secure location.
- **Shared Experiences**: View and share specific trip details with friends or fellow nomads.

### 🔒 Security & Privacy
- **Secure Authentication**: Traditional login/signup alongside seamless Google OAuth integration.
- **Data Sovereignty**: A secure, 2-stage account deletion workflow with OTP verification via email.
- **Password Recovery**: Secure PIN-based password reset system.

## 🚀 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion, Lucide Icons.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB Atlas.
- **AI Engine**: Groq (LLaMA 3.3 70B Versatile).
- **APIs**: Open-Meteo (Weather), Google OAuth 2.0.

## 🛠️ Setup & Installation

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas Account
- Groq API Key
- Google Cloud Console Project (for OAuth)

### 1. Clone the Repository
```bash
git clone https://github.com/shivrajfutane/LuxeVoyage.git
cd LuxeVoyage
```

### 2. Backend Configuration
Navigate to the `backend` directory and create a `.env` file:
```bash
cd backend
npm install
```
Add the following to `backend/.env`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
GROQ_API_KEY=your_groq_api_key
GOOGLE_CLIENT_ID=your_google_client_id
EMAIL_USER=your_email_for_otp
EMAIL_PASS=your_email_app_password
```

### 3. Frontend Configuration
Navigate to the `frontend` directory and create a `.env` file:
```bash
cd ../frontend
npm install
```
Add the following to `frontend/.env`:
```env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### 4. Running the Application
Open two terminals:

**Terminal 1 (Backend):**
```bash
cd backend
npm start
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

---
Built with ❤️ for global nomads by [Shivraj](https://github.com/shivrajfutane).
