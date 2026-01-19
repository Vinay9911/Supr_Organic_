
# Supr Organic - Project Setup Guide (Windows/VS Code)

## Project Directory Structure
```
supr-organic/
├── components/          # Reusable UI components
├── services/            # API services (Supabase, Gemini)
├── types/               # TypeScript interfaces
├── App.tsx              # Main entry application
├── index.tsx            # DOM mounting
├── index.html           # HTML template
├── metadata.json        # App metadata
└── supabase_setup.sql   # SQL for Database creation
```

## Steps to Run the Project locally

1. **Install Node.js**: Ensure you have Node.js 18+ installed on your Windows machine.
2. **Open Terminal**: Open VS Code, then open the integrated terminal (`Ctrl + ` `).
3. **Initialize Project**: 
   ```bash
   npm init -y
   ```
4. **Install Dependencies**:
   ```bash
   npm install react react-dom lucide-react @supabase/supabase-js @google/genai framer-motion recharts
   npm install -D typescript @types/react @types/react-dom vite @vitejs/plugin-react
   ```
5. **Set Environment Variables**:
   Create a `.env` file in the root directory and add the keys provided in your prompt:
   ```env
   VITE_SUPABASE_URL=https://mcohrkahvyyrtffojran.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
6. **Supabase Database Setup**:
   - Go to your Supabase Dashboard.
   - Open the **SQL Editor**.
   - Copy and paste the contents of `supabase_setup.sql` and run it.
7. **Run the App**:
   ```bash
   npx vite
   ```
8. **View in Browser**: Open the provided local URL (usually `http://localhost:5173`).

## Key Features Implemented:
- **Aeroponic Saffron**: Highlighted as "Launching Soon" with specialized visuals.
- **Modern Mushroom Farming**: Full catalog for Oyster, Shiitake, and Lion's Mane mushrooms.
- **Rupee Pricing**: All pricing optimized for the Delhi market.
- **Cart System**: Context-based shopping cart with drawer UI.
- **Modern UI**: Tailwind-based premium aesthetic using dark/light high-contrast elements.
- **AI Assistant**: Gemini-powered chatbot for customer queries.
