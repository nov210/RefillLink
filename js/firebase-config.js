/**
 * 리필링크 랜딩 — Supabase / Firebase / GA 설정
 * Supabase: Dashboard → Settings → API 에서 URL·anon key 확인
 */
window.RefillinkConfig = {
  USE_SUPABASE: true,
  supabaseUrl: "https://cphnvygrdgcnozstnzuv.supabase.co",
  supabaseAnonKey:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwaG52eWdyZGdjbm96c3RuenV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzMjUzNzgsImV4cCI6MjA5NDkwMTM3OH0.3xY40EUTh2-8QIGvz5Z5q8NhIOxh7RB-tBQPCut-jss",

  firebaseConfig: {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "refillink-landing",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID",
  },
  GA_MEASUREMENT_ID: "",
  USE_FIREBASE: false,
};
