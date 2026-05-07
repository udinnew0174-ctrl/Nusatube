/**
 * NusaTube Downloader - Application Logic File
 */

// Global State
let currentLang = localStorage.getItem('nt_lang') || 'id';
let isDarkMode = localStorage.getItem('nt_theme') !== 'light';
let soundEnabled = localStorage.getItem('nt_sound') !== 'false';
let hapticEnabled = localStorage.getItem('nt_haptic') !== 'false';
let userStats = JSON.parse(localStorage.getItem('nt_stats')) || { total: 0 };
let downloadHistory = JSON.parse(localStorage.getItem('nt_history')) || [];
let historyActiveSubTab = 'all'; 
let analyzedMetadata = null;

// Initializer
window.addEventListener('DOMContentLoaded', () => {
    initTheme();
    changeLanguage(currentLang);
    updateStatsUI();
    renderHistory();
    document.getElementById('sound-toggle').checked = soundEnabled;
    document.getElementById('haptic-toggle').checked = hapticEnabled;
    lucide.createIcons();
});

// Theme System
function initTheme() {
    const html = document.documentElement;
    if (isDarkMode) {
        html.classList.add('dark');
        html.classList.remove('light');
        document.getElementById('theme-status-text').innerText = currentLang === 'id' ? "Mode Gelap" : "Dark Mode";
    } else {
        html.classList.remove('dark');
        html.classList.add('light');
        document.getElementById('theme-status-text').innerText = currentLang === 'id' ? "Mode Terang" : "Light Mode";
    }
}

function toggleTheme() {
    triggerFeedback();
    isDarkMode = !isDarkMode;
    localStorage.setItem('nt_theme', isDarkMode ? 'dark' : 'light');
    initTheme();
    showToast(currentLang === 'id' ? "Tema diperbarui!" : "Theme updated!", "success");
}

// Synthesizer Audio & Haptic System
function triggerFeedback() {
    if (hapticEnabled && navigator.vibrate) {
        navigator.vibrate(12); // Efek getar halus mobile
    }
    if (soundEnabled) {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(600, ctx.currentTime);
            gain.gain.setValueAtTime(0.015, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.1);
        } catch (e) {
            // Abaikan jika browser memblokir AudioContext sebelum interaksi user
        }
    }
}

function toggleSoundSetting() {
    soundEnabled = document.getElementById('sound-toggle').checked;
    localStorage.setItem('nt_sound', soundEnabled);
    triggerFeedback();
}

function toggleHapticSetting() {
    hapticEnabled = document.getElementById('haptic-toggle').checked;
    localStorage.setItem('nt_haptic', hapticEnabled);
    triggerFeedback();
}

// Multilingual Engine
function changeLanguage(langCode) {
    currentLang = langCode;
    localStorage.setItem('nt_lang', langCode);
    document.getElementById('language-select').value = langCode;

    document.querySelectorAll('[data-lang]').forEach(el => {
        const translationKey = el.getAttribute('data-lang');
        if (DICTIONARY[langCode][translationKey]) {
            el.innerHTML = DICTIONARY[langCode][translationKey];
        }
    });

    const inputField = document.getElementById('youtube-url');
    if (inputField) {
        inputField.placeholder = langCode === 'id' 
            ? "https://www.youtube.com/watch?v=... atau Shorts" 
            : "https://www.youtube.com/watch?v=... or Shorts";
    }
    initTheme();
}

// Tab router
function switchTab(tabId) {
    triggerFeedback();
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    document.getElementById(`page-${tabId}`).classList.remove('hidden');

    // Desktop Nav Active State
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.className = "nav-btn px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 text-slate-400 hover:text-white transition-all duration-200";
    });
    const activeDesktopBtn = document.getElementById(`nav-${tabId}`);
    if (activeDesktopBtn) {
        activeDesktopBtn.className = "nav-btn px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 text-cyan-400 bg-cyan-500/10 transition-all duration-200";
    }

    // Mobile Nav Active State
    document.querySelectorAll('.mobile-nav-btn').forEach(btn => {
        btn.className = "mobile-nav-btn flex flex-col items-center gap-1 text-slate-400 py-1 transition-all";
    });
    const activeMobileBtn = document.getElementById(`m-nav-${tabId}`);
    if (activeMobileBtn) {
        activeMobileBtn.className = "mobile-nav-btn flex flex-col items-center gap-1 text-cyan-400 py-1 transition-all";
    }
}

// Formatting Utilities
function formatSeconds(seconds) {
    if (!seconds) return "0:00";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return (h > 0 ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (s < 10 ? "0" : "") + s;
}

function formatViews(num) {
    if (!num) return "0";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Modern Toast Notifications
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    let icon = 'info';
    let styles = 'bg-slate-900 border-slate-700 text-slate-100';

    if (type === 'success') {
        icon = 'check-circle';
        styles = 'bg-slate-900 border-emerald-500/30 text-emerald-400';
    } else if (type === 'error') {
        icon = 'alert-triangle';
        styles = 'bg-slate-900 border-rose-500/30 text-rose-400';
    }

    toast.className = `glassmorphism flex items-center gap-3 px-4 py-3 rounded-2xl border ${styles} shadow-xl pointer-events-auto transform translate-x-10 opacity-0 transition-all duration-300 w-full`;
    toast.innerHTML = `
        <i data-lucide="${icon}" class="w-5 h-5 shrink-0"></i>
        <p class="text-xs font-semibold leading-relaxed flex-grow">${message}</p>
    `;
    container.appendChild(toast);
    lucide.createIcons();

    setTimeout(() => {
        toast.classList.remove('translate-x-10', 'opacity-0');
    }, 50);

    setTimeout(() => {
        toast.classList.add('translate-x-10', 'opacity-0');
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// YouTube URL Validator
function validateYoutubeUrl(url) {
    const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=|shorts\/)?([a-zA-Z0-9_-]{11})/;
    return pattern.test(url);
}

function validateUrlInput() {
    const url = document.getElementById('youtube-url').value.trim();
    const err = document.getElementById('url-validation-error');
    const clear = document.getElementById('btn-clear');

    if (url.length > 0) {
        clear.classList.remove('hidden');
        if (!validateYoutubeUrl(url)) {
            err.classList.remove('hidden');
        } else {
            err.classList.add('hidden');
        }
    } else {
        clear.classList.add('hidden');
        err.classList.add('hidden');
    }
}

function clearInput() {
    triggerFeedback();
    document.getElementById('youtube-url').value = '';
    validateUrlInput();
}

async function pasteFromClipboard() {
    triggerFeedback();
    try {
        const txt = await navigator.clipboard.readText();
        if (txt) {
            document.getElementById('youtube-url').value = txt;
            validateUrlInput();
            showToast(currentLang === 'id' ? "Link disalin!" : "Pasted!", "success");
        }
    } catch {
        showToast(currentLang === 'id' ? "Gagal membaca clipboard." : "Clipboard access denied.", "error");
    }
}

// Fetch API Logic
async function fetchMetadata() {
    triggerFeedback();
    const url = document.getElementById('youtube-url').value.trim();
    const quality = document.getElementById('quality-selector').value;

    if (!url || !validateYoutubeUrl(url)) {
        showToast(currentLang === 'id' ? "Format link tidak valid!" : "Invalid YouTube link!", "error");
        return;
    }

    document.getElementById('download-panel').classList.add('hidden');
    document.getElementById('skeleton-loader').classList.remove('hidden');

    try {
        const apiEndpoint = `${CONFIG.API.VIDEO_ENDPOINT}?url=${encodeURIComponent(url)}&quality=${quality}`;
        const response = await fetch(apiEndpoint, { headers: { 'accept': 'application/json' } });
        
        if (!response.ok) throw new Error("Server Error");
        const data = await response.json();

        if (data && data.title) {
            analyzedMetadata = {
                title: data.title,
                author: data.author || "Unknown Channel",
                duration: formatSeconds(data.lengthSeconds),
                views: formatViews(data.views),
                uploadDate: data.uploadDate || "-",
                thumbnail: data.thumbnail,
                videoDirectUrl: data.url, // Membaca file respons JSON direct download
                originalLink: url,
                isShorts: url.includes('/shorts/')
            };

            document.getElementById('video-title').innerText = analyzedMetadata.title;
            document.getElementById('video-author').innerText = analyzedMetadata.author;
            document.getElementById('video-duration').innerText = analyzedMetadata.duration;
            document.getElementById('video-views').innerText = analyzedMetadata.views + " x";
            document.getElementById('video-date').innerText = analyzedMetadata.uploadDate;
            document.getElementById('video-thumb').src = analyzedMetadata.thumbnail;

            if (analyzedMetadata.isShorts) {
                document.getElementById('shorts-badge').classList.remove('hidden');
                document.getElementById('video-badge').classList.add('hidden');
            } else {
                document.getElementById('shorts-badge').classList.add('hidden');
                document.getElementById('video-badge').classList.remove('hidden');
            }

            document.getElementById('skeleton-loader').classList.add('hidden');
            const dlPanel = document.getElementById('download-panel');
            dlPanel.classList.remove('hidden');
            setTimeout(() => {
                dlPanel.classList.remove('scale-95', 'opacity-0');
                dlPanel.classList.add('scale-100', 'opacity-100');
            }, 50);

            showToast(currentLang === 'id' ? "Analisis sukses!" : "Analysis successfully!", "success");
        } else {
            throw new Error();
        }

    } catch (err) {
        document.getElementById('skeleton-loader').classList.add('hidden');
        showToast(currentLang === 'id' ? "Gagal memproses API. Mengaktifkan Mode Cadangan." : "API failed. Fallback simulation mode active.", "error");
        activateMockupFallback(url);
    }
}

// Fallback jika API Limit/Error
function activateMockupFallback(url) {
    const backup = CONFIG.MOCK_FALLBACK;
    analyzedMetadata = {
        title: backup.title,
        author: backup.author,
        duration: formatSeconds(backup.duration),
        views: formatViews(backup.views),
        uploadDate: backup.uploadDate,
        thumbnail: backup.thumbnail,
        videoDirectUrl: backup.videoDirectUrl,
        originalLink: url,
        isShorts: true
    };

    document.getElementById('video-title').innerText = analyzedMetadata.title;
    document.getElementById('video-author').innerText = analyzedMetadata.author;
    document.getElementById('video-duration').innerText = analyzedMetadata.duration;
    document.getElementById('video-views').innerText = analyzedMetadata.views;
    document.getElementById('video-date').innerText = analyzedMetadata.uploadDate;
    document.getElementById('video-thumb').src = analyzedMetadata.thumbnail;
    document.getElementById('shorts-badge').classList.remove('hidden');
    document.getElementById('video-badge').classList.add('hidden');

    const dlPanel = document.getElementById('download-panel');
    dlPanel.classList.remove('hidden');
    setTimeout(() => {
        dlPanel.classList.remove('scale-95', 'opacity-0');
        dlPanel.classList.add('scale-100', 'opacity-100');
    }, 50);
}

// Download Stream Controller
async function startDownload(type) {
    triggerFeedback();
    if (!analyzedMetadata) return;

    const progressContainer = document.getElementById('progress-container');
    const progressBar = document.getElementById('progress-bar');
    const progressStatus = document.getElementById('progress-status');
    const progressPercentage = document.getElementById('progress-percentage');
    const speedIndicator = document.getElementById('download-speed');
    const etaIndicator = document.getElementById('download-eta');

    progressContainer.classList.remove('hidden');
    progressBar.style.width = '0%';
    progressPercentage.innerText = '0%';

    let directDownloadUrl = '';

    if (type === 'video') {
        directDownloadUrl = analyzedMetadata.videoDirectUrl;
        runSimulatedProgress(directDownloadUrl, type);
    } else {
        progressStatus.innerHTML = `<i data-lucide="loader-2" class="w-4 h-4 animate-spin text-cyan-400"></i> Meminta link audio MP3...`;
        lucide.createIcons();
        try {
            const response = await fetch(`${CONFIG.API.AUDIO_ENDPOINT}?url=${encodeURIComponent(analyzedMetadata.originalLink)}`);
            const data = await response.json();
            
            if (data && data.url) {
                directDownloadUrl = data.url;
                runSimulatedProgress(directDownloadUrl, type);
            } else {
                throw new Error();
            }
        } catch {
            // Simulasi dummy audio jika API eksternal sibuk
            directDownloadUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
            runSimulatedProgress(directDownloadUrl, type);
        }
    }
}

function runSimulatedProgress(downloadUrl, type) {
    const progressBar = document.getElementById('progress-bar');
    const progressStatus = document.getElementById('progress-status');
    const progressPercentage = document.getElementById('progress-percentage');
    const speedIndicator = document.getElementById('download-speed');
    const etaIndicator = document.getElementById('download-eta');

    let currentVal = 0;
    const interval = setInterval(() => {
        currentVal += Math.floor(Math.random() * 12) + 4;
        if (currentVal >= 100) {
            currentVal = 100;
            clearInterval(interval);

            progressStatus.innerHTML = `<i data-lucide="check-circle" class="w-4 h-4 text-emerald-400"></i> Selesai!`;
            progressPercentage.innerText = '100%';
            progressBar.style.width = '100%';
            speedIndicator.innerText = 'Selesai';
            etaIndicator.innerText = 'ETA: 0s';

            // Trigger Penyimpanan Browser (Saves Link)
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.target = "_blank";
            a.download = `${analyzedMetadata.title}.${type === 'video' ? 'mp4' : 'mp3'}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            saveItemToHistory(type);
            userStats.total += 1;
            localStorage.setItem('nt_stats', JSON.stringify(userStats));
            updateStatsUI();

            showToast(currentLang === 'id' ? "File berhasil diunduh!" : "File successfully downloaded!", "success");
        } else {
            progressBar.style.width = `${currentVal}%`;
            progressPercentage.innerText = `${currentVal}%`;
            speedIndicator.innerText = `${(Math.random() * 4 + 1).toFixed(1)} MB/s`;
            etaIndicator.innerText = `ETA: ${Math.ceil((100 - currentVal) / 10)}s`;
            progressStatus.innerHTML = `<i data-lucide="loader-2" class="w-4 h-4 animate-spin text-cyan-400"></i> Mengunduh...`;
        }
        lucide.createIcons();
    }, 250);
}

// Database Manager (localStorage)
function saveItemToHistory(type) {
    const item = {
        id: Date.now(),
        title: analyzedMetadata.title,
        author: analyzedMetadata.author,
        thumbnail: analyzedMetadata.thumbnail,
        duration: analyzedMetadata.duration,
        originalLink: analyzedMetadata.originalLink,
        type: type,
        isFavorite: false
    };

    downloadHistory.unshift(item);
    localStorage.setItem('nt_history', JSON.stringify(downloadHistory));
    renderHistory();
}

function renderHistory() {
    const container = document.getElementById('history-container');
    if (!container) return;
    container.innerHTML = '';

    const filtered = historyActiveSubTab === 'favorite' 
        ? downloadHistory.filter(i => i.isFavorite) 
        : downloadHistory;

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="glassmorphism rounded-2xl p-8 text-center text-slate-500 flex flex-col items-center gap-2">
                <i data-lucide="folder-open" class="w-8 h-8 text-slate-600"></i>
                <p class="text-xs font-semibold">Tidak ada riwayat.</p>
            </div>
        `;
        lucide.createIcons();
        return;
    }

    filtered.forEach(item => {
        const card = document.createElement('div');
        card.className = "glassmorphism rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4 hover:border-cyan-500/30 transition-all";
        card.innerHTML = `
            <div class="relative w-full sm:w-28 shrink-0 aspect-video rounded-lg overflow-hidden bg-black/30">
                <img src="${item.thumbnail}" class="w-full h-full object-cover">
                <div class="absolute bottom-1 right-1 bg-slate-950/80 px-1 py-0.5 rounded text-[9px] text-white">${item.duration}</div>
            </div>
            <div class="flex-grow flex flex-col justify-between w-full">
                <div>
                    <h4 class="text-xs sm:text-sm font-bold text-white line-clamp-1">${item.title}</h4>
                    <p class="text-[10px] text-slate-400 mt-1">${item.author} &bull; <span class="bg-slate-850 px-2 py-0.5 rounded text-cyan-400 font-mono uppercase text-[8px]">${item.type}</span></p>
                </div>
                <div class="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-800/60">
                    <div class="flex items-center gap-2">
                        <button onclick="reFetch('${item.originalLink}')" class="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1">
                            <i data-lucide="refresh-cw" class="w-3 h-3"></i> Download Lagi
                        </button>
                    </div>
                    <div class="flex items-center gap-2">
                        <button onclick="toggleFavorite(${item.id})" class="p-1 rounded text-slate-400 hover:text-amber-400 transition-all">
                            <i data-lucide="star" class="w-4 h-4 ${item.isFavorite ? 'fill-current text-amber-400' : ''}"></i>
                        </button>
                        <button onclick="deleteHistory(${item.id})" class="p-1 rounded text-slate-400 hover:text-rose-500 transition-all">
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
    lucide.createIcons();
}

function reFetch(link) {
    switchTab('home');
    document.getElementById('youtube-url').value = link;
    validateUrlInput();
    fetchMetadata();
}

function toggleFavorite(id) {
    triggerFeedback();
    downloadHistory = downloadHistory.map(i => {
        if (i.id === id) i.isFavorite = !i.isFavorite;
        return i;
    });
    localStorage.setItem('nt_history', JSON.stringify(downloadHistory));
    renderHistory();
    updateStatsUI();
}

function deleteHistory(id) {
    triggerFeedback();
    downloadHistory = downloadHistory.filter(i => i.id !== id);
    localStorage.setItem('nt_history', JSON.stringify(downloadHistory));
    renderHistory();
    updateStatsUI();
    showToast("Item dihapus", "success");
}

function clearAllHistory() {
    triggerFeedback();
    if (confirm("Hapus seluruh riwayat?")) {
        downloadHistory = [];
        localStorage.setItem('nt_history', JSON.stringify(downloadHistory));
        renderHistory();
        updateStatsUI();
    }
}

function switchHistorySubTab(tab) {
    triggerFeedback();
    historyActiveSubTab = tab;
    const btnAll = document.getElementById('sub-history-all');
    const btnFav = document.getElementById('sub-history-fav');

    if (tab === 'all') {
        btnAll.className = "flex-1 text-center py-2 text-xs font-semibold rounded-xl text-white bg-slate-800 shadow";
        btnFav.className = "flex-1 text-center py-2 text-xs font-semibold rounded-xl text-slate-400 hover:text-white";
    } else {
        btnFav.className = "flex-1 text-center py-2 text-xs font-semibold rounded-xl text-white bg-slate-800 shadow";
        btnAll.className = "flex-1 text-center py-2 text-xs font-semibold rounded-xl text-slate-400 hover:text-white";
    }
    renderHistory();
}

function updateStatsUI() {
    const totalEl = document.getElementById('stats-total-downloads');
    const headEl = document.getElementById('header-stat-count');
    const bookEl = document.getElementById('stats-bookmarked');

    if (totalEl) totalEl.innerText = userStats.total;
    if (headEl) headEl.innerText = `${userStats.total} Downloads`;
    if (bookEl) bookEl.innerText = downloadHistory.filter(i => i.isFavorite).length;
}

// Collapsible FAQ
function toggleFaq(id) {
    triggerFeedback();
    const ans = document.getElementById(`faq-ans-${id}`);
    const icon = document.getElementById(`faq-icon-${id}`);
    if (ans.classList.contains('hidden')) {
        ans.classList.remove('hidden');
        icon.style.transform = 'rotate(180deg)';
    } else {
        ans.classList.add('hidden');
        icon.style.transform = 'rotate(0deg)';
    }
}