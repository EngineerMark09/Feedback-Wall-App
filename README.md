# 💬 Feedback Wall

A simple, beautiful feedback wall app powered by Supabase (free database).

## 🚀 Live Demo

After setup: `https://YOUR-USERNAME.github.io/feedback-wall/`

---

## 📋 Setup Instructions

### Step 1: Create Supabase Account (FREE)

1. Go to [https://supabase.com](https://supabase.com)
2. Click **Start your project** → Sign up with GitHub
3. Click **New Project**
4. Choose organization, enter project name, set a password
5. Select a region near you (e.g., Singapore)
6. Click **Create new project** and wait ~2 minutes

### Step 2: Create Database Table

1. In your Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **New query**
3. Paste this SQL and click **Run**:

```sql
-- Create messages table
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) DEFAULT 'Anonymous',
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read messages
CREATE POLICY "Allow public read" ON messages
    FOR SELECT USING (true);

-- Allow anyone to insert messages
CREATE POLICY "Allow public insert" ON messages
    FOR INSERT WITH CHECK (true);
```

### Step 3: Get Your API Keys

1. Go to **Project Settings** (gear icon) → **API**
2. Copy your:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

### Step 4: Configure the App

1. Open `js/config.js`
2. Replace the placeholder values:

```javascript
const SUPABASE_URL = 'https://your-project-id.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';
```

### Step 5: Deploy to GitHub Pages

1. Create a new GitHub repository
2. Push this code:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR-USERNAME/feedback-wall.git
git push -u origin master
```

3. Go to repo **Settings** → **Pages**
4. Select **master** branch → **Save**
5. Wait 1-2 minutes, your site is live!

---

## 🎨 Features

- ✅ Post anonymous or named messages
- ✅ Real-time message loading
- ✅ Character counter (500 max)
- ✅ Beautiful purple gradient theme
- ✅ Mobile responsive
- ✅ Toast notifications
- ✅ Stats dashboard
- ✅ 100% free hosting

---

## 🛡️ Security Note

This is a demo app with public read/write access. For production:
- Add authentication
- Add rate limiting
- Add content moderation

---

## 📱 Screenshots

The app works on both desktop and mobile browsers!

---

Made with ❤️ using Supabase + GitHub Pages
