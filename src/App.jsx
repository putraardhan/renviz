import { useState, useRef, useCallback, useEffect } from "react";
import TermsPage from "./Terms";

function PageTransition({ children, pageKey }) {
  return (
    <div key={pageKey} className="page-transition">
      {children}
    </div>
  );
}

const SUPABASE_URL = "https://slmplhhqkzfdlmpscsvj.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsbXBsaGhxa3pmZGxtcHNjc3ZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxNDk0MjIsImV4cCI6MjA5NTcyNTQyMn0.LbRgXMBku8hrrd-AJJtL3MJlKITlMuCc6LoDenEX8Mw";
const API_BASE = "https://n8n.renviz.app/webhook";

const supabase = {
  async signUp(email, password) {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "apikey": SUPABASE_ANON_KEY },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  },
  async signIn(email, password) {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "apikey": SUPABASE_ANON_KEY },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  },
  async signInWithGoogle() {
    window.location.href = `${SUPABASE_URL}/auth/v1/authorize?provider=google&redirect_to=${window.location.origin}`;
  },
  saveSession(u) {
    try { localStorage.setItem("renviz_v1", JSON.stringify(u)); } catch {}
  },
  clearSession() {
    try { localStorage.removeItem("renviz_v1"); } catch {}
  },
  getSession() {
    try { return JSON.parse(localStorage.getItem("renviz_v1")); } catch { return null; }
  },
  async refreshToken(refresh_token) {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "apikey": SUPABASE_ANON_KEY },
      body: JSON.stringify({ refresh_token }),
    });
    return res.ok ? res.json() : null;
  },
  async getCredits(userId, token) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/user_credits?id=eq.${userId}&select=credits,plan,is_new_user`, {
      headers: { "Authorization": `Bearer ${token}`, "apikey": SUPABASE_ANON_KEY },
    });
    const data = await res.json();
    return data[0] || null;
  },
  async deductCredit(userId, currentCredits, token) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/user_credits?id=eq.${userId}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${token}`,
        "apikey": SUPABASE_ANON_KEY,
        "Content-Type": "application/json",
        "Prefer": "return=representation",
      },
      body: JSON.stringify({ credits: Math.max(0, currentCredits - 1) }),
    });
    const data = await res.json();
    return data[0] || null;
  },
  async setNewUserFalse(userId, token) {
    await fetch(`${SUPABASE_URL}/rest/v1/user_credits?id=eq.${userId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'apikey': SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ is_new_user: false }),
    });
  },
  async addCredits(userId, currentCredits, addAmount, plan, token) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/user_credits?id=eq.${userId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'apikey': SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
      body: JSON.stringify({ credits: currentCredits + addAmount, plan }),
    });
    const data = await res.json();
    return data[0] || null;
  },
};

const G = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@300;400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&family=Space+Mono:wght@400;700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg: #ffffff;
  --surface: #f8f8f6;
  --surface2: #f0f0ec;
  --border: #e8e8e4;
  --text: #0f0f0e;
  --muted: #888884;
  --accent: #f05a28;
  --accent-light: #fff2ed;
  --dark: #0f0f0e;
  --heading: 'Bricolage Grotesque', sans-serif;
  --body: 'DM Sans', sans-serif;
  --mono: 'Space Mono', monospace;
  --radius: 12px;
  --radius-lg: 20px;
}

html { scroll-behavior: smooth; }
body { background: var(--bg); color: var(--text); font-family: var(--body); line-height: 1.6; overflow-x: hidden; }

@keyframes pageIn {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
.page-transition {
  animation: pageIn 0.25s cubic-bezier(0.22, 1, 0.36, 1) both;
}

/* NAV */
.nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; padding: 0 48px; height: 64px; background: rgba(255,255,255,0.92); backdrop-filter: blur(12px); border-bottom: 1px solid var(--border); }
.nav-logo { font-family: var(--mono); font-weight: 700; font-size: 17px; color: var(--text); cursor: pointer; letter-spacing: -0.5px; }
.nav-logo span { color: var(--accent); }
.nav-links { display: flex; align-items: center; gap: 8px; }
.nav-link { padding: 8px 16px; border-radius: 8px; font-size: 14px; font-weight: 500; color: var(--muted); cursor: pointer; border: none; background: none; transition: color 0.2s; font-family: var(--body); }
.nav-link:hover { color: var(--text); }
.nav-cta { padding: 9px 20px; background: var(--accent); color: white; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; border: none; transition: background 0.2s; font-family: var(--body); }
.nav-cta:hover { background: #d94e22; }

/* BUTTONS */
.btn-primary { display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px; background: var(--accent); color: white; border: none; border-radius: var(--radius); font-family: var(--body); font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
.btn-primary:hover { background: #d94e22; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(240,90,40,0.25); }
.btn-secondary { display: inline-flex; align-items: center; gap: 8px; padding: 13px 28px; background: transparent; color: var(--text); border: 1.5px solid var(--border); border-radius: var(--radius); font-family: var(--body); font-size: 15px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
.btn-secondary:hover { border-color: var(--text); }

/* HERO */
.hero { min-height: 100vh; display: flex; align-items: center; padding: 120px 48px 80px; gap: 80px; }
.hero-left { flex: 1; max-width: 560px; }
.hero-tag { display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px; background: var(--accent-light); border-radius: 100px; font-size: 12px; font-weight: 600; color: var(--accent); letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 28px; }
.hero-tag::before { content: ''; width: 6px; height: 6px; background: var(--accent); border-radius: 50%; }
.hero-h1 { font-family: var(--heading); font-size: clamp(42px, 5vw, 64px); font-weight: 800; line-height: 1.05; letter-spacing: -2px; color: var(--text); margin-bottom: 20px; }
.hero-h1 em { font-style: normal; color: var(--accent); }
.hero-sub { font-size: 17px; color: var(--muted); line-height: 1.7; margin-bottom: 36px; max-width: 440px; font-weight: 300; }
.hero-actions { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }
.hero-note { font-size: 13px; color: var(--muted); margin-top: 20px; }
.hero-right { flex: 1; max-width: 600px; }

/* BEFORE/AFTER */
.ba-container { position: relative; border-radius: var(--radius-lg); overflow: hidden; aspect-ratio: 4/3; box-shadow: 0 32px 80px rgba(0,0,0,0.12); background: var(--surface2); cursor: col-resize; user-select: none; }
.ba-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.ba-divider { position: absolute; top: 0; bottom: 0; width: 2px; background: white; transform: translateX(-50%); z-index: 10; pointer-events: none; }
.ba-handle { position: absolute; top: 50%; transform: translate(-50%, -50%); width: 44px; height: 44px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 20px rgba(0,0,0,0.2); z-index: 11; pointer-events: none; }
.ba-label { position: absolute; bottom: 16px; padding: 5px 12px; background: rgba(0,0,0,0.55); color: white; border-radius: 100px; font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; backdrop-filter: blur(8px); }
.ba-label-before { left: 16px; }
.ba-label-after { right: 16px; }
.ba-placeholder { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; }
.ba-ph-icon { width: 56px; height: 56px; background: var(--border); border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 24px; }
.ba-ph-text { font-size: 14px; color: var(--muted); text-align: center; line-height: 1.6; }
.ba-ph-text strong { display: block; color: var(--text); font-family: var(--heading); font-weight: 600; margin-bottom: 4px; }

/* SECTIONS */
.section { padding: 96px 48px; }
.section-tag { display: inline-block; font-size: 12px; font-weight: 600; color: var(--accent); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 16px; }
.section-h2 { font-family: var(--heading); font-size: clamp(32px, 4vw, 48px); font-weight: 800; letter-spacing: -1.5px; color: var(--text); margin-bottom: 12px; line-height: 1.1; }
.section-sub { font-size: 16px; color: var(--muted); max-width: 480px; font-weight: 300; }

/* STEPS */
.steps-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-top: 56px; }
.step-card { padding: 32px; background: var(--surface); border-radius: var(--radius-lg); border: 1px solid var(--border); position: relative; overflow: hidden; }
.step-card::before { content: attr(data-num); position: absolute; right: 24px; top: 20px; font-family: var(--heading); font-size: 64px; font-weight: 800; color: var(--border); line-height: 1; }
.step-icon { width: 44px; height: 44px; background: var(--accent-light); border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; font-size: 20px; }
.step-h { font-family: var(--heading); font-size: 18px; font-weight: 700; margin-bottom: 8px; letter-spacing: -0.3px; }
.step-p { font-size: 14px; color: var(--muted); line-height: 1.6; }

/* PRICING */
.pricing-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 56px; } .pricing-bottom { display: flex; justify-content: center; margin-top: 20px; } .pricing-bottom .price-card { width: calc(33.333% - 14px); min-width: 260px; }
.price-card { padding: 28px 24px; border-radius: var(--radius-lg); border: 1.5px solid var(--border); background: var(--bg); position: relative; transition: all 0.2s; display: flex; flex-direction: column; }
.price-card:hover { border-color: var(--text); transform: translateY(-2px); box-shadow: 0 12px 40px rgba(0,0,0,0.08); }
.price-card.featured { background: var(--dark); border-color: var(--dark); color: white; }
.price-card.featured .price-desc, .price-card.featured .price-per { color: rgba(255,255,255,0.45); }
.price-card.featured .price-feature { color: rgba(255,255,255,0.8); }
.price-card.new-user { border-color: var(--accent); }
.price-badge { display: inline-block; padding: 4px 10px; border-radius: 100px; font-size: 11px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 16px; }
.price-badge.trial { background: var(--accent-light); color: var(--accent); }
.price-badge.basic { background: #f0f7ff; color: #2563eb; }
.price-badge.pro { background: #f0f0f0; color: #555; }
.price-badge.studio { background: #fefce8; color: #854d0e; }
.price-name { font-family: var(--heading); font-size: 20px; font-weight: 800; margin-bottom: 4px; letter-spacing: -0.5px; }
.price-desc { font-size: 13px; color: var(--muted); margin-bottom: 20px; }
.price-amount { font-family: var(--mono); font-size: 32px; font-weight: 700; letter-spacing: -1px; margin-bottom: 2px; }
.price-per { font-size: 13px; color: var(--muted); margin-bottom: 24px; }
.price-features { display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px; flex: 1; }
.price-feature { display: flex; align-items: flex-start; gap: 8px; font-size: 14px; }
.price-feature::before { content: '✓'; color: var(--accent); font-weight: 700; flex-shrink: 0; margin-top: 1px; }
.price-card.featured .price-feature::before { color: #ff7a4d; }
.price-btn { width: 100%; padding: 12px; border-radius: 10px; font-family: var(--body); font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; border: none; }
.price-btn-light { background: var(--surface2); color: var(--text); }
.price-btn-light:hover { background: var(--border); }
.price-btn-accent { background: var(--accent); color: white; }
.price-btn-accent:hover { background: #d94e22; }
.price-btn-white { background: white; color: var(--dark); }
.price-btn-white:hover { background: #f0f0f0; }
.price-btn:disabled { opacity: 0.4; cursor: not-allowed; }

/* AUTH */
.auth-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 80px 24px; background: var(--surface); }
.auth-card { width: 100%; max-width: 420px; background: white; border-radius: var(--radius-lg); border: 1px solid var(--border); padding: 40px; box-shadow: 0 8px 40px rgba(0,0,0,0.06); }
.auth-logo { font-family: var(--mono); font-size: 20px; font-weight: 700; letter-spacing: -0.5px; margin-bottom: 32px; text-align: center; }
.auth-logo span { color: var(--accent); }
.auth-h { font-family: var(--heading); font-size: 26px; font-weight: 800; letter-spacing: -0.8px; margin-bottom: 6px; }
.auth-sub { font-size: 14px; color: var(--muted); margin-bottom: 24px; }
.btn-google { width: 100%; padding: 12px 16px; background: white; border: 1.5px solid var(--border); border-radius: 10px; font-family: var(--body); font-size: 14px; font-weight: 500; color: var(--text); cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; transition: all 0.2s; margin-bottom: 8px; }
.btn-google:hover { border-color: var(--text); background: var(--surface); }
.btn-google svg { flex-shrink: 0; }
.auth-divider { display: flex; align-items: center; gap: 12px; margin: 16px 0; }
.auth-divider::before, .auth-divider::after { content: ''; flex: 1; height: 1px; background: var(--border); }
.auth-divider span { font-size: 12px; color: var(--muted); white-space: nowrap; }
.field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
.field label { font-size: 13px; font-weight: 500; color: var(--text); }
.field input { padding: 12px 14px; border: 1.5px solid var(--border); border-radius: 10px; font-family: var(--body); font-size: 15px; color: var(--text); background: white; outline: none; transition: border-color 0.2s; }
.field input:focus { border-color: var(--text); }
.auth-submit { width: 100%; padding: 14px; background: var(--text); color: white; border: none; border-radius: 10px; font-family: var(--body); font-size: 15px; font-weight: 600; cursor: pointer; margin-top: 8px; transition: background 0.2s; }
.auth-submit:hover { background: var(--accent); }
.auth-submit:disabled { opacity: 0.5; cursor: not-allowed; }
.auth-switch { text-align: center; margin-top: 20px; font-size: 14px; color: var(--muted); }
.auth-switch button { background: none; border: none; color: var(--accent); font-weight: 600; cursor: pointer; font-size: 14px; font-family: var(--body); }
.auth-error { padding: 12px 14px; background: #fff0f0; border: 1px solid #ffc0c0; border-radius: 8px; font-size: 13px; color: #cc0000; margin-bottom: 16px; }
.auth-success { padding: 12px 14px; background: #f0fff4; border: 1px solid #9ae6b4; border-radius: 8px; font-size: 13px; color: #276749; margin-bottom: 16px; }

/* RENDER PAGE - LIGHT THEME */
.render-page { min-height: 100vh; background: var(--surface); color: var(--text); }
.render-header { display: flex; align-items: center; justify-content: space-between; padding: 0 32px; height: 64px; border-bottom: 1px solid var(--border); background: rgba(255,255,255,0.92); backdrop-filter: blur(12px); position: sticky; top: 0; z-index: 50; }
.render-logo { font-family: var(--mono); font-size: 16px; font-weight: 700; letter-spacing: -0.5px; color: var(--text); cursor: pointer; }
.render-logo span { color: var(--accent); }
.render-user { display: flex; align-items: center; gap: 12px; }
.credit-pill { display: flex; align-items: center; gap: 6px; padding: 6px 14px; background: var(--accent-light); border: 1px solid rgba(240,90,40,0.2); border-radius: 100px; font-size: 13px; color: var(--text); font-family: var(--body); }
.credit-pill strong { color: var(--accent); font-family: var(--mono); font-size: 15px; }
.hdr-btn { padding: 6px 14px; background: none; border: 1px solid var(--border); border-radius: 8px; color: var(--muted); font-size: 13px; cursor: pointer; font-family: var(--body); transition: all 0.2s; }
.hdr-btn:hover { border-color: var(--text); color: var(--text); }
.hdr-btn-accent { padding: 6px 14px; background: var(--accent); border: none; border-radius: 8px; color: white; font-size: 13px; font-weight: 600; cursor: pointer; font-family: var(--body); transition: background 0.2s; }
.hdr-btn-accent:hover { background: #d94e22; }
.render-body { max-width: 1000px; margin: 0 auto; padding: 40px 24px; }
.render-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.r-panel { background: white; border: 1px solid var(--border); border-radius: var(--radius-lg); overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.04); }
.r-panel-header { display: flex; align-items: center; gap: 10px; padding: 14px 20px; border-bottom: 1px solid var(--border); background: var(--surface); }
.r-panel-num { font-family: var(--mono); font-size: 10px; color: var(--muted); background: var(--border); padding: 2px 6px; border-radius: 3px; }
.r-panel-title { font-size: 11px; color: var(--text); letter-spacing: 2px; text-transform: uppercase; font-weight: 700; font-family: var(--heading); }
.r-panel-body { padding: 20px; }
.drop-zone { border: 2px dashed var(--border); border-radius: var(--radius); aspect-ratio: 4/3; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; cursor: pointer; transition: all 0.2s; position: relative; overflow: hidden; background: var(--surface); }
.drop-zone:hover, .drop-zone.drag-over { border-color: var(--accent); background: var(--accent-light); }
.drop-zone.has-image { border-style: solid; border-color: var(--border); }
.drop-text { font-size: 13px; color: var(--muted); text-align: center; line-height: 1.6; font-family: var(--body); }
.drop-text strong { display: block; color: var(--text); font-size: 14px; font-weight: 600; margin-bottom: 4px; font-family: var(--heading); }
.preview-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.preview-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; opacity: 0; transition: 0.2s; }
.drop-zone:hover .preview-overlay { opacity: 1; }
.change-text { font-size: 12px; color: white; letter-spacing: 0.5px; font-weight: 600; font-family: var(--body); }
.upload-status { margin-top: 12px; padding: 10px 14px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); display: flex; align-items: center; gap: 10px; }
.status-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.status-dot.uploading { background: var(--accent); animation: pulse 1s infinite; }
.status-dot.done { background: #16a34a; }
.status-dot.error { background: #dc2626; }
.status-text { font-size: 12px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-family: var(--body); }
.output-area { aspect-ratio: 4/3; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
.output-placeholder { display: flex; flex-direction: column; align-items: center; gap: 12px; opacity: 0.4; }
.output-placeholder span { font-size: 12px; letter-spacing: 0.5px; color: var(--muted); font-family: var(--body); }
.output-img { width: 100%; height: 100%; object-fit: cover; }
.loading-overlay { position: absolute; inset: 0; background: rgba(248,248,246,0.92); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; backdrop-filter: blur(4px); }
.loader-ring { width: 44px; height: 44px; border: 3px solid var(--border); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.8s linear infinite; }
.loading-text { font-size: 13px; color: var(--accent); letter-spacing: 0.5px; text-transform: uppercase; font-weight: 600; font-family: var(--heading); }
.loading-sub { font-size: 13px; color: var(--muted); font-family: var(--body); }
.btn-render { width: 100%; margin-top: 16px; padding: 15px; background: var(--accent); color: white; border: none; border-radius: var(--radius); font-family: var(--heading); font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.15s; display: flex; align-items: center; justify-content: center; gap: 10px; }
.btn-render:hover:not(:disabled) { background: #d94e22; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(240,90,40,0.25); }
.btn-render:disabled { opacity: 0.35; cursor: not-allowed; transform: none; box-shadow: none; }
.download-link { display: block; margin-top: 12px; padding: 11px; background: white; border: 1.5px solid var(--border); border-radius: var(--radius); text-align: center; font-size: 14px; color: var(--text); text-decoration: none; font-weight: 500; cursor: pointer; font-family: var(--body); transition: all 0.2s; }
.download-link:hover { border-color: var(--text); }
.r-error { margin-top: 12px; padding: 12px 16px; background: #fff0f0; border: 1px solid #ffc0c0; border-radius: var(--radius); font-size: 13px; color: #cc0000; line-height: 1.5; }
.r-footer { margin-top: 48px; padding-top: 20px; border-top: 1px solid var(--border); display: flex; justify-content: space-between; }
.r-footer-text { font-size: 12px; color: var(--muted); font-family: var(--mono); }
.no-credits-banner { margin-bottom: 24px; padding: 16px 20px; background: var(--accent-light); border: 1px solid rgba(240,90,40,0.2); border-radius: var(--radius); display: flex; align-items: center; justify-content: space-between; gap: 16px; }
.no-credits-text { font-size: 14px; color: var(--accent); font-family: var(--body); font-weight: 500; }
.no-credits-btn { padding: 8px 16px; background: var(--accent); color: white; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: var(--body); }

/* FOOTER */
.footer { padding: 48px; border-top: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
.footer-logo { font-family: var(--mono); font-size: 16px; font-weight: 700; letter-spacing: -0.3px; }
.footer-logo span { color: var(--accent); }
.footer-text { font-size: 13px; color: var(--muted); }

@keyframes spin { to { transform: rotate(360deg); } }
@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
@keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.fade-up { animation: fadeUp 0.5s ease forwards; }

@media (max-width: 768px) {
  .nav { padding: 0 20px; }
  .hero { flex-direction: column; padding: 100px 20px 60px; gap: 40px; }
  .hero-left, .hero-right { max-width: 100%; }
  .section { padding: 64px 20px; }
  .steps-grid { grid-template-columns: 1fr; }
  .pricing-grid { grid-template-columns: 1fr 1fr 1fr; }
  .render-grid { grid-template-columns: 1fr; }
  .footer { flex-direction: column; gap: 12px; text-align: center; padding: 32px 20px; }
}
@media (max-width: 480px) { .pricing-grid { grid-template-columns: 1fr; } }
`;

function BeforeAfterSlider({ beforeSrc, afterSrc }) {
  const [pos, setPos] = useState(50);
  const ref = useRef(null);
  const dragging = useRef(false);
  const update = useCallback((clientX) => {
    const rect = ref.current.getBoundingClientRect();
    setPos(Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100)));
  }, []);
  useEffect(() => {
    const onMove = (e) => { if (dragging.current) update(e.clientX ?? e.touches?.[0]?.clientX); };
    const onUp = () => { dragging.current = false; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove);
    window.addEventListener("touchend", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); window.removeEventListener("touchmove", onMove); window.removeEventListener("touchend", onUp); };
  }, [update]);
  return (
    <div ref={ref} className="ba-container"
      onMouseDown={(e) => { dragging.current = true; update(e.clientX); }}
      onTouchStart={(e) => { dragging.current = true; update(e.touches[0].clientX); }}>
      {beforeSrc && afterSrc ? (
        <>
          <img src={afterSrc} className="ba-img" alt="after" />
          <img src={beforeSrc} className="ba-img" alt="before" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }} />
          <div className="ba-divider" style={{ left: `${pos}%` }} />
          <div className="ba-handle" style={{ left: `${pos}%`, top: "50%" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0f0f0e" strokeWidth="2.5"><path d="M9 18l-6-6 6-6M15 6l6 6-6 6" /></svg>
          </div>
          <span className="ba-label ba-label-before">Before</span>
          <span className="ba-label ba-label-after">After</span>
        </>
      ) : (
        <div className="ba-placeholder">
          <div className="ba-ph-icon">🏗️</div>
          <div className="ba-ph-text"><strong>Before / After</strong>Drag to compare SketchUp vs AI render</div>
        </div>
      )}
    </div>
  );
}

const PLANS = [
  { id: "trial", badge: "trial", badgeText: "New User Only", name: "Trial", desc: "Try before you commit", price: "Rp9.000", credits: 3, perRender: "Rp3K/render", features: ["3 AI renders", "PNG output", "One-time offer for new accounts"], btnClass: "price-btn-accent", btnText: "Claim Trial", newUserOnly: true },
  { id: "basic", badge: "basic", badgeText: "Basic", name: "Basic", desc: "For occasional use", price: "Rp19.900", credits: 4, perRender: "Rp4.975/render", features: ["4 AI renders", "PNG output", "No expiry"], btnClass: "price-btn-light", btnText: "Buy Basic" },
  { id: "pro", badge: "pro", badgeText: "Pro", name: "Pro", desc: "Best value", price: "Rp48.900", credits: 10, perRender: "Rp4.890/render", features: ["10 AI renders", "PNG output", "No expiry", "Priority queue"], btnClass: "price-btn-white", btnText: "Buy Pro", featured: true },
  { id: "studio", badge: "studio", badgeText: "Studio", name: "Studio", desc: "For power users", price: "Rp99.800", credits: 25, perRender: "Rp3.992/render", features: ["25 AI renders", "PNG output", "No expiry", "Priority queue", "Bulk savings"], btnClass: "price-btn-light", btnText: "Buy Studio" },
];

function PricingCards({ onNav, isNewUser, onPurchase, purchasing }) {
  const mainPlans = PLANS.filter(p => !p.newUserOnly);
  const trialPlan = PLANS.find(p => p.newUserOnly);
  const showTrial = isNewUser || !onPurchase;

  const renderCard = (p) => (
    <div className={`price-card ${p.featured ? "featured" : ""} ${p.newUserOnly ? "new-user" : ""}`} key={p.id}>
      <div className={`price-badge ${p.badge}`}>{p.badgeText}</div>
      <div className="price-name">{p.name}</div>
      <div className="price-desc">{p.desc}</div>
      <div className="price-amount">{p.price}</div>
      <div className="price-per">{p.credits} credits · {p.perRender}</div>
      <div className="price-features">{p.features.map(f => <div className="price-feature" key={f}>{f}</div>)}</div>
      <button className={`price-btn ${p.btnClass}`}
        onClick={() => onPurchase ? onPurchase(p) : onNav("auth")}
        disabled={purchasing === p.id}>
        {purchasing === p.id ? "Processing..." : p.btnText}
      </button>
    </div>
  );

  return (
    <>
      <div className="pricing-grid">
        {mainPlans.map(p => renderCard(p))}
      </div>
      {trialPlan && showTrial && (
        <div className="pricing-bottom">
          {renderCard(trialPlan)}
        </div>
      )}
    </>
  );
}

function HomePage({ onNav }) {
  return (
    <div>
      <section className="hero">
        <div className="hero-left fade-up">
          <div className="hero-tag">AI Architectural Rendering</div>
          <h1 className="hero-h1">Turning Models<br />Into <em>Reality</em></h1>
          <p className="hero-sub">Transform your SketchUp models into stunning photorealistic renders with the power of AI, faster, easier, and more affordable than traditional rendering.</p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => onNav("render")}>
              Render Now <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </button>
            <button className="btn-secondary" onClick={() => onNav("pricing")}>See Pricing</button>
          </div>
          <p className="hero-note">✦ No subscription · Pay per render · Credits never expire</p>
        </div>
        <div className="hero-right fade-up" style={{ animationDelay: "0.12s" }}>
          <BeforeAfterSlider
            beforeSrc="https://slmplhhqkzfdlmpscsvj.supabase.co/storage/v1/object/public/renders/before.png?v=2"
            afterSrc="https://slmplhhqkzfdlmpscsvj.supabase.co/storage/v1/object/public/renders/after.png?v=2"
          />
        </div>
      </section>

      <section className="section">
        <div className="section-tag">How it works</div>
        <h2 className="section-h2">Three steps.<br />One stunning render.</h2>
        <div className="steps-grid">
          {[
            { icon: "📤", num: "01", title: "Upload your model", desc: "Export a JPG or PNG screenshot from SketchUp. Any angle, any style — just make sure the geometry is clear." },
            { icon: "⚡", num: "02", title: "AI renders it", desc: "Renviz analyzes your model and generates a photorealistic render while preserving your exact design." },
            { icon: "📥", num: "03", title: "Download & use", desc: "Get a high-quality PNG render in seconds. Ready for presentations, proposals, or client pitches." },
          ].map(s => (
            <div className="step-card" data-num={s.num} key={s.num}>
              <div className="step-icon">{s.icon}</div>
              <div className="step-h">{s.title}</div>
              <p className="step-p">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section" style={{ background: "var(--surface)", borderTop: "1px solid var(--border)" }}>
        <div className="section-tag">Pricing</div>
        <h2 className="section-h2">Simple, transparent<br />pricing.</h2>
        <p className="section-sub">Buy credits, use them whenever you want. No monthly fees.</p>
        <PricingCards onNav={onNav} isNewUser={false} onPurchase={() => onNav("auth")} />
      </section>

      <footer className="footer">
        <div className="footer-logo">renviz<span>.app</span></div>
        <div className="footer-text">© 2025 Renviz · AI-powered architectural rendering</div>
      </footer>
    </div>
  );
}

function AuthPage({ onLogin, onNav }) {
  return (
    <div className="auth-page">
      <div className="auth-card fade-up">
        <div className="auth-logo">renviz<span>.app</span></div>
        <h2 className="auth-h">Welcome</h2>
        <p className="auth-sub">Sign in or create an account to start rendering your architectural models.</p>
        <button className="btn-google" onClick={() => supabase.signInWithGoogle()}>
          <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
          Continue with Google
        </button>
        <p style={{ textAlign: "center", fontSize: 12, color: "var(--muted)", marginTop: 20, lineHeight: 1.6 }}>
          By continuing, you agree to our Terms of Service.<br />New accounts are created automatically on first sign in.
        </p>
      </div>
    </div>
  );
}

function PricingPage({ user, onNav, onCreditsUpdate, isNewUser, setIsNewUser }) {
  const [purchasing, setPurchasing] = useState(null);
  const [done, setDone] = useState(false);

const handlePurchase = async (plan) => {
  if (!user) { onNav("auth"); return; }
  setPurchasing(plan.id);
  try {
    // Request snap token dari n8n
    const res = await fetch(`${API_BASE}/midtrans-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.userId, package: plan.id }),
    });
    const { snap_token } = await res.json();

    // Buka Midtrans Snap popup
    window.snap.pay(snap_token, {
      onSuccess: () => {
        setDone(true);
        if (plan.newUserOnly) {
          setIsNewUser(false);
          supabase.setNewUserFalse(user.userId, user.token);
        }
        if (onCreditsUpdate) onCreditsUpdate(plan.credits, plan.id);
        setTimeout(() => { setDone(false); onNav("render"); }, 1800);
      },
      onPending: () => {
        setPurchasing(null);
      },
      onError: () => {
        setPurchasing(null);
      },
      onClose: () => {
        setPurchasing(null);
      },
    });
  } catch (err) {
    console.error(err);
    setPurchasing(null);
  }
};

  return (
    <div style={{ paddingTop: 64 }}>
      <section className="section" style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div className="section-tag">Pricing</div>
        <h2 className="section-h2">Pay as you go.<br />No subscriptions.</h2>
        <p className="section-sub">Buy credits, render whenever you need. Credits never expire.</p>
        {done && <div className="auth-success" style={{ marginTop: 24, maxWidth: 400 }}>✓ Payment successful! Redirecting...</div>}
        <PricingCards onNav={onNav} isNewUser={isNewUser} onPurchase={handlePurchase} purchasing={purchasing} />
      </section>
    </div>
  );
}

function RenderPage({ user, credits, setCredits, onNav }) {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [outputUrl, setOutputUrl] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [uploadMsg, setUploadMsg] = useState("");
  const [isRendering, setIsRendering] = useState(false);
  const [renderMsg, setRenderMsg] = useState("RENDERING...");
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [mode, setMode] = useState("exterior");
  const fileInputRef = useRef(null);

  const compressImage = (file, maxSizeMB = 2) => new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        const maxDim = 1920;
        if (width > maxDim || height > maxDim) {
          if (width > height) { height = Math.round(height * maxDim / width); width = maxDim; }
          else { width = Math.round(width * maxDim / height); height = maxDim; }
        }
        canvas.width = width; canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        const tryCompress = (quality) => {
          canvas.toBlob((blob) => {
            if (blob.size <= maxSizeMB * 1024 * 1024 || quality <= 0.3) {
              resolve(new File([blob], file.name, { type: 'image/jpeg' }));
            } else {
              tryCompress(quality - 0.1);
            }
          }, 'image/jpeg', quality);
        };
        tryCompress(0.85);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });

  const uploadFile = async (f) => {
    setUploadStatus("uploading"); setUploadMsg("Uploading..."); setError(null);
    try {
      const formData = new FormData();
      formData.append("user_id", user.userId);
      formData.append("data", f, f.name);
      const res = await fetch(`${API_BASE}/upload`, { method: "POST", body: formData });
      const text = await res.text();
      let result;
      try { const raw = JSON.parse(text); result = Array.isArray(raw) ? raw[0] : raw; } catch { throw new Error('Invalid response: ' + text.substring(0, 100)); }
      if (!result.public_url) throw new Error(result.message || 'Upload failed');
      setImageUrl(result.public_url); setUploadStatus("done"); setUploadMsg(result.public_url.split("/").pop());
    } catch (err) { setUploadStatus("error"); setUploadMsg("Upload failed"); setError("Upload error: " + err.message); }
  };

  const handleFile = useCallback((f) => {
    if (!f || !f.type.startsWith("image/")) return;
    setPreviewUrl(URL.createObjectURL(f)); setImageUrl(null); setOutputUrl(null);
    setError(null); setUploadStatus(null); setUploadMsg(""); uploadFile(f);
  }, [user]);

  const handleRender = async () => {
    if (!imageUrl || credits < 1) return;
    setIsRendering(true); setOutputUrl(null); setError(null);
    const msgs = ["ANALYSING STRUCTURE...", "APPLYING AI...", "RENDERING PIXELS...", "ALMOST THERE..."];
    let mi = 0;
    const iv = setInterval(() => { mi = (mi + 1) % msgs.length; setRenderMsg(msgs[mi]); }, 3000);
    try {
      const res = await fetch(`${API_BASE}/render`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ user_id: user.userId, image_url: imageUrl, mode: mode }) });
      const data = await res.json();
      clearInterval(iv);
      if (!res.ok || data._route === "gagal") throw new Error(data.message || "Render failed");
      const out = Array.isArray(data.output) ? data.output[0] : (data.output_url || data.image_url);
      setOutputUrl(out);
      setCredits(c => {
        const newVal = Math.max(0, c - 1);
        supabase.deductCredit(user.userId, c, user.token);
        return newVal;
      });
    } catch (err) { clearInterval(iv); setError("Render error: " + err.message); }
    finally { setIsRendering(false); setRenderMsg("RENDERING..."); }
  };

  const handleDownload = async () => {
    if (!outputUrl) return;
    const res = await fetch(outputUrl);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "renviz-output.png"; a.click();
    URL.revokeObjectURL(url);
  };

  const canRender = imageUrl && uploadStatus === "done" && !isRendering && credits > 0;

  return (
    <div className="render-page">
      <div className="render-header">
        <div className="render-logo" onClick={() => onNav("home")}>renviz<span>.app</span></div>
        <div className="render-user">
          <div className="credit-pill"><strong>{credits}</strong> credits</div>
          <button className="hdr-btn-accent" onClick={() => onNav("pricing")}>+ Buy Credits</button>
          <button className="hdr-btn" onClick={() => onNav("home")} title="Home" style={{ padding: "6px 10px" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </button>
        </div>
      </div>
      <div className="render-body">
        {credits === 0 && (
          <div className="no-credits-banner">
            <span className="no-credits-text">⚡ You're out of credits. Purchase more to continue rendering.</span>
            <button className="no-credits-btn" onClick={() => onNav("pricing")}>Buy Credits</button>
          </div>
        )}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "24px", gap: "12px" }}>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => setMode("exterior")}
              style={{
                padding: "10px 32px", borderRadius: "8px", border: "1.5px solid",
                borderColor: mode === "exterior" ? "var(--accent)" : "var(--border)",
                background: mode === "exterior" ? "var(--accent-light)" : "transparent",
                color: mode === "exterior" ? "var(--accent)" : "var(--muted)",
                fontWeight: "600", fontSize: "13px", cursor: "pointer", fontFamily: "var(--body)",
                transition: "all 0.2s"
              }}>
              🏠 Exterior
            </button>
            <button
              onClick={() => setMode("interior")}
              style={{
                padding: "10px 32px", borderRadius: "8px", border: "1.5px solid",
                borderColor: mode === "interior" ? "var(--accent)" : "var(--border)",
                background: mode === "interior" ? "var(--accent-light)" : "transparent",
                color: mode === "interior" ? "var(--accent)" : "var(--muted)",
                fontWeight: "600", fontSize: "13px", cursor: "pointer", fontFamily: "var(--body)",
                transition: "all 0.2s"
              }}>
              🛋️ Interior
            </button>
          </div>
          <p style={{ fontSize: "13px", color: "var(--muted)", textAlign: "center", maxWidth: "480px", lineHeight: 1.6 }}>
            ⚠️ Pastikan mode yang dipilih sesuai dengan gambar yang diupload. Memilih mode yang salah dapat menghasilkan render yang tidak sesuai.
          </p>
        </div>
        <div className="render-grid">
          <div className="r-panel">
            <div className="r-panel-header"><span className="r-panel-num">01</span><span className="r-panel-title">Input Image</span></div>
            <div className="r-panel-body">
              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => e.target.files[0] && handleFile(e.target.files[0])} />
              <div className={`drop-zone ${dragOver ? "drag-over" : ""} ${previewUrl ? "has-image" : ""}`}
                onClick={() => fileInputRef.current.click()}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}>
                {previewUrl
                  ? <><img src={previewUrl} alt="preview" className="preview-img" /><div className="preview-overlay"><span className="change-text">↑ Change</span></div></>
                  : <div className="drop-text"><strong>Drop image here</strong>or click to browse · JPG, PNG</div>}
              </div>
              {uploadStatus && <div className="upload-status"><div className={`status-dot ${uploadStatus}`} /><span className="status-text">{uploadMsg}</span></div>}
              {error && <div className="r-error">{error}</div>}
            </div>
          </div>
          <div className="r-panel">
            <div className="r-panel-header"><span className="r-panel-num">02</span><span className="r-panel-title">Render Output</span></div>
            <div className="r-panel-body">
              <div className="output-area">
                {outputUrl
                  ? <img src={outputUrl} alt="render" className="output-img" />
                  : <div className="output-placeholder"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg><span>Awaiting Render</span></div>}
                {isRendering && <div className="loading-overlay"><div className="loader-ring" /><div className="loading-text">{renderMsg}</div><div className="loading-sub">~30 seconds</div></div>}
              </div>
              <button className="btn-render" onClick={handleRender} disabled={!canRender}>
                {isRendering
                  ? <><div style={{ width: 12, height: 12, border: "2px solid white", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />RENDERING</>
                  : <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="5 3 19 12 5 21 5 3" /></svg>RENDER NOW — 1 CREDIT</>}
              </button>
              {outputUrl && <div className="download-link" onClick={handleDownload}>↓ Download PNG</div>}
            </div>
          </div>
        </div>
        <div className="r-footer"><span className="r-footer-text">renviz.app</span><span className="r-footer-text">{user?.email}</span><span className="r-footer-text" style={{ cursor: "pointer", textDecoration: "underline" }} onClick={() => onNav("terms")}>Terms & Conditions</span></div>
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("home");
  const [user, setUser] = useState(null);
  const [credits, setCredits] = useState(0);
  const [isNewUser, setIsNewUser] = useState(false);
  const onNav = (p) => {
    if ((p === "render" || p === "pricing") && !user) { setPage("auth"); return; }
    setPage(p);
    if (p !== "render") window.scrollTo(0, 0);
  };

  const [sessionLoading, setSessionLoading] = useState(true);

  const onLogin = async (u) => {
    supabase.saveSession(u);
    setUser(u);
    const d = await supabase.getCredits(u.userId, u.token);
    setCredits(d?.credits ?? 0);
    setIsNewUser(d?.is_new_user ?? false);
    setPage("pricing");
  };

  useEffect(() => {
    const init = async () => {
      try {
        const hash = window.location.hash;
        if (hash.includes("access_token")) {
          const p = new URLSearchParams(hash.substring(1));
          const token = p.get("access_token");
          const refresh_token = p.get("refresh_token");
          const expires_in = parseInt(p.get("expires_in") || "3600");
          window.history.replaceState({}, "", "/");
          const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
            headers: { "Authorization": `Bearer ${token}`, "apikey": SUPABASE_ANON_KEY }
          });
          const ud = await res.json();
          if (ud.id) {
            const u = { token, refresh_token, expires_at: Date.now() + expires_in * 1000, userId: ud.id, email: ud.email };
            supabase.saveSession(u);
            setUser(u);
            const d = await supabase.getCredits(ud.id, token);
            setCredits(d?.credits ?? 0);
            setIsNewUser(d?.is_new_user ?? false);
            setPage("pricing");
          }
          return;
        }
        const saved = supabase.getSession();
        if (!saved?.token) return;
        let { token, refresh_token, expires_at, userId, email } = saved;
        if (expires_at && Date.now() > expires_at - 5 * 60 * 1000) {
          if (!refresh_token) { supabase.clearSession(); return; }
          const r = await supabase.refreshToken(refresh_token);
          if (!r?.access_token) { supabase.clearSession(); return; }
          token = r.access_token;
          const u = { token, refresh_token: r.refresh_token || refresh_token, expires_at: Date.now() + (r.expires_in || 3600) * 1000, userId, email };
          supabase.saveSession(u);
          setUser(u);
        } else {
          setUser(saved);
        }
        const d = await supabase.getCredits(userId, token);
        setCredits(d?.credits ?? 0);
        setIsNewUser(d?.is_new_user ?? false);
        setPage("render");
      } catch { supabase.clearSession(); }
      finally { setSessionLoading(false); }
    };
    init();
  }, []);

  if (sessionLoading) return (
    <>
      <style>{G}</style>
      <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#fff", flexDirection:"column", gap:16 }}>
        <div style={{ width:36, height:36, border:"3px solid #e8e8e4", borderTopColor:"#f05a28", borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
        <span style={{ fontFamily:"Space Mono,monospace", fontSize:13, color:"#888" }}>renviz<span style={{color:"#f05a28"}}>.app</span></span>
      </div>
    </>
  );

  return (
    <>
      <style>{G}</style>
      {page !== "render" && (
        <nav className="nav">
          <div className="nav-logo" onClick={() => setPage("home")}>renviz<span>.app</span></div>
          <div className="nav-links">
            <button className="nav-link" onClick={() => onNav("pricing")}>Pricing</button>
            <button className="nav-link" onClick={() => onNav("terms")}>Terms</button>
            {user ? (
              <><button className="nav-link" onClick={() => onNav("render")}>Dashboard</button>
              <button className="nav-cta" onClick={() => { supabase.clearSession(); setUser(null); setIsNewUser(false); setPage("home"); }}>Sign Out</button></>
            ) : (
              <><button className="nav-link" onClick={() => setPage("auth")}>Sign In</button>
              <button className="nav-cta" onClick={() => setPage("auth")}>Get Started →</button></>
            )}
          </div>
        </nav>
      )}
      <PageTransition pageKey={page}>
        {page === "home" && <div style={{ paddingTop: 0 }}><HomePage onNav={onNav} /></div>}
        {page === "auth" && <AuthPage onLogin={onLogin} onNav={onNav} />}
        {page === "pricing" && <PricingPage user={user} onNav={onNav} isNewUser={isNewUser} setIsNewUser={setIsNewUser} onCreditsUpdate={(add, plan) => { setCredits(c => { supabase.addCredits(user.userId, c, add, plan, user.token); return c + add; }); }} />}
        {page === "render" && <RenderPage user={user} credits={credits} setCredits={setCredits} onNav={onNav} />}
        {page === "terms" && <TermsPage onNav={onNav} />}
      </PageTransition>
    </>
  );
}
