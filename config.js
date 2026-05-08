/**
 * NusaTube Downloader - Configuration File
 */

// Integrasi Tailwind Config ke CDN
const tailwindConfig = {
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#f0f9ff',
                    100: '#e0f2fe',
                    500: '#06b6d4',
                    600: '#0891b2',
                    700: '#0e7490',
                    900: '#164e63',
                },
                darkBg: '#0b0f19',
                glassBg: 'rgba(15, 23, 42, 0.6)',
                glassBorder: 'rgba(255, 255, 255, 0.08)'
            },
            fontFamily: {
                sans: ['Poppins', 'Inter', 'sans-serif'],
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'blob': 'blob 10s infinite',
            },
            keyframes: {
                blob: {
                    '0%': { transform: 'translate(0px, 0px) scale(1)' },
                    '33%': { transform: 'translate(40px, -60px) scale(1.15)' },
                    '66%': { transform: 'translate(-30px, 30px) scale(0.9)' },
                    '100%': { transform: 'translate(0px, 0px) scale(1)' },
                }
            }
        }
    }
};

// Daftarkan ke global window object agar dibaca oleh Tailwind CDN script
window.tailwind = { config: tailwindConfig };

// Konfigurasi API Endpoints & Failback Simulation
const CONFIG = {
    API: {
        VIDEO_ENDPOINT: "https://api.ryzumi.net/api/downloader/ytmp4",
        AUDIO_ENDPOINT: "https://api.ryzumi.net/api/downloader/ytmp3",
        TIMEOUT_MS: 15000, // Batas waktu tunggu API (15 detik)
        MAX_RETRIES: 2     // Coba ulang otomatis jika gagal
    },
    MOCK_FALLBACK: {
        title: "Minecraft Actions and Stuff Java vs Bedrock Part 68",
        author: "VowLa Shorts",
        duration: 15, // Detik
        views: 36995,
        uploadDate: "1 week ago",
        thumbnail: "https://i.ytimg.com/vi/A6kdLHeTXzg/hqdefault.jpg",
        videoDirectUrl: "https://ytdlpyton.nvlgroup.my.id/download/file/Minecraft%20Actions%20and%20Stuff%20Java%20vs%20Bedrock%20Part%2068_480x640p.mp4",
        isShorts: true
    }
};

// Kamus Multilingual
const DICTIONARY = {
    id: {
        hero_title: "Download Video & Audio",
        hero_subtitle: "Download cepat, ringan, dan modern tanpa ribet.",
        nav_home: "Beranda",
        nav_history: "Riwayat",
        nav_about: "Tentang",
        nav_settings: "Pengaturan",
        nav_help: "Bantuan",
        input_label: "Masukkan URL YouTube",
        quality_label: "Pilih Kualitas Video",
        btn_paste: "Tempel",
        btn_analyze: "Analisis Video",
        err_invalid_url: "Format link YouTube tidak valid!",
        btn_dl_video: "Unduh Video",
        btn_dl_audio: "Unduh MP3",
        stat_dl_total: "Total Download",
        stat_dl_speed: "Koneksi Server",
        stat_bookmark: "Disimpan",
        history_title: "Riwayat & Bookmark",
        history_subtitle: "Unduhan lokal di perangkat ini",
        btn_clear_history: "Hapus Riwayat",
        history_tab_all: "Semua Riwayat",
        history_tab_bookmark: "Favorit",
        about_desc: "NusaTube Downloader adalah aplikasi premium pengunduh media YouTube berkecepatan tinggi dengan antarmuka modern yang futuristik, aman, responsif, dan bebas iklan.",
        about_spec_free: "Tanpa Bayar",
        about_spec_ads: "Bebas Iklan",
        about_spec_quality: "Resolusi HD",
        about_spec_speed: "Direct API",
        settings_title: "Pengaturan",
        settings_subtitle: "Konfigurasi pengalaman penggunaan aplikasi",
        settings_theme: "Tema Aplikasi",
        settings_theme_sub: "Atur mode gelap atau terang",
        settings_lang: "Bahasa (Language)",
        settings_lang_sub: "Pilih bahasa antarmuka aplikasi",
        settings_sound: "Efek Suara",
        settings_sound_sub: "Mainkan audio lembut pada interaksi",
        settings_haptic: "Efek Getar",
        settings_haptic_sub: "Getaran haptik lembut di ponsel Anda",
        help_title: "Bantuan Pengguna",
        help_subtitle: "Panduan penggunaan dan pertanyaan umum",
        faq_q1: "Bagaimana cara mengunduh?",
        faq_a1: "Salin URL video YouTube / Shorts, tempel di kolom utama, klik 'Analisis Video'. Ketika info metadata muncul, klik tombol unduh.",
        faq_q2: "Mengapa proses download gagal?",
        faq_a2: "Kegagalan bisa terjadi jika koneksi internet tidak stabil, video bersifat pribadi (private), atau server API eksternal sedang mengalami limit pembatasan harian.",
        footer_credit: "Dibuat dengan",
        footer_credit_2: "di Nusantara"
    },
    en: {
        hero_title: "Download Video & Audio",
        hero_subtitle: "Fast, lightweight, and modern downloader without hassle.",
        nav_home: "Home",
        nav_history: "History",
        nav_about: "About",
        nav_settings: "Settings",
        nav_help: "Help",
        input_label: "Enter YouTube URL",
        quality_label: "Select Video Quality",
        btn_paste: "Paste",
        btn_analyze: "Analyze Video",
        err_invalid_url: "Invalid YouTube URL format!",
        btn_dl_video: "Download Video",
        btn_dl_audio: "Download MP3",
        stat_dl_total: "Total Downloads",
        stat_dl_speed: "Server Connection",
        stat_bookmark: "Bookmarks",
        history_title: "History & Bookmarks",
        history_subtitle: "Local downloads recorded on this device",
        btn_clear_history: "Clear History",
        history_tab_all: "All History",
        history_tab_bookmark: "Favorites",
        about_desc: "NusaTube Downloader is a premium high-speed YouTube media downloader featuring a futuristic, secure, responsive, and completely ad-free interface.",
        about_spec_free: "Free of Charge",
        about_spec_ads: "Ad-Free",
        about_spec_quality: "Up to 1080p",
        about_spec_speed: "Direct API Link",
        settings_title: "Settings",
        settings_subtitle: "Configure your personal application workspace",
        settings_theme: "Theme Mode",
        settings_theme_sub: "Set styling mode to dark or light",
        settings_lang: "Language",
        settings_lang_sub: "Select display system interface language",
        settings_sound: "Interaction Sounds",
        settings_sound_sub: "Synthesize audio clicks during feedback",
        settings_haptic: "Haptic Feedback",
        settings_haptic_sub: "Trigger fine haptic vibrations on smartphones",
        help_title: "User Support",
        help_subtitle: "General guides and frequently asked questions",
        faq_q1: "How to download media?",
        faq_a1: "Copy a YouTube video/shorts URL, paste it into the primary text box, click 'Analyze Video', wait for metadata information, and click download.",
        faq_q2: "Why does download fail?",
        faq_a2: "It can happen due to a weak network connection, restricted private content access, or API server rate-limits.",
        footer_credit: "Crafted with",
        footer_credit_2: "in Nusantara"
    }
};

// Export ke Window global object
window.CONFIG = CONFIG;
window.DICTIONARY = DICTIONARY;
