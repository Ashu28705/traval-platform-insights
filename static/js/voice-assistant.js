/* ================================================================
   TRAVELAI — VOICE ASSISTANT ENGINE v1.0
   Web Speech API · Hands-free Travel Planning · Accessibility
   ================================================================ */

(function () {
    'use strict';

    /* ── CONFIGURATION ─────────────────────────────────────────── */
    const CONFIG = {
        lang: 'en-US',
        continuous: false,
        interimResults: true,
        maxAlternatives: 1,
        voiceRate: 0.92,
        voicePitch: 1.05,
        voiceVolume: 1,
        preferredVoiceGender: 'female',
        wakeWord: 'travel',          // optional wake-word detection
        idleTimeout: 8000,           // ms before mic auto-stops
    };

    /* ── STATE ─────────────────────────────────────────────────── */
    const state = {
        listening: false,
        speaking: false,
        initialized: false,
        recognition: null,
        synth: window.speechSynthesis,
        idleTimer: null,
        transcript: '',
        history: [],
    };

    const FEMALE_VOICE_HINTS = [
        /google .* female/i,
        /microsoft zira/i,
        /zira/i,
        /samantha/i,
        /susan/i,
        /victoria/i,
        /karen/i,
        /moira/i,
        /tessa/i,
        /linda/i,
        /julie/i,
        /amy/i,
        /ava/i,
        /emma/i,
    ];

    /* ── COMMANDS MAP ───────────────────────────────────────────── */
    // Each entry: { patterns: [regex...], handler: fn }
    const COMMANDS = [
        {
            id: 'go-home',
            patterns: [/go (?:to )?home/i, /open home/i, /take me home/i],
            handler: () => { speak('Taking you to the Home page!'); navigate('/home'); },
        },
        {
            id: 'go-explore',
            patterns: [/(?:go to |open )?explore/i, /show me destinations/i],
            handler: () => { speak('Opening the Explore page!'); navigate('/explore'); },
        },
        {
            id: 'go-dashboard',
            patterns: [/(?:go to |open )?dashboard/i, /my dashboard/i],
            handler: () => { speak('Opening your dashboard!'); navigate('/dashboard'); },
        },
        {
            id: 'go-reviews',
            patterns: [/(?:go to |open )?reviews/i, /show reviews/i, /traveler reviews/i],
            handler: () => { speak('Opening the Reviews page!'); navigate('/reviews'); },
        },
        {
            id: 'search-city',
            patterns: [/search (?:for )?(.+)/i, /find (?:info(?:rmation)? (?:about|for) )?(.+)/i, /look up (.+)/i, /plan (?:a )?trip to (.+)/i],
            handler: (match) => {
                const city = (match[1] || match[2] || '').trim().replace(/\s*\bplease\b/gi, '').trim();
                if (city) {
                    speak(`Searching for ${city}. Let me get the travel insights!`);
                    searchCity(city);
                } else {
                    speak('Which city would you like to search for?');
                }
            },
        },
        {
            id: 'weather',
            patterns: [/weather (?:in |for )?(.+)/i, /what is the weather (?:in |for )?(.+)/i],
            handler: (match) => {
                const city = (match[1] || '').trim();
                if (city) {
                    speak(`Searching weather data for ${city}.`);
                    searchCity(city);
                } else {
                    speak('Please say a city name to check the weather.');
                }
            },
        },
        {
            id: 'help',
            patterns: [/help/i, /what can you do/i, /commands/i, /how do i use/i],
            handler: () => {
                speak(
                    'I can help you with hands-free travel planning! ' +
                    'You can say: Search for Paris, Go to Dashboard, ' +
                    'Show reviews, Go to Explore, or Open Home.'
                );
                showHelp();
            },
        },
        {
            id: 'logout',
            patterns: [/(?:log out|logout|sign out)/i],
            handler: () => { speak('Logging you out. Goodbye!'); setTimeout(() => navigate('/logout'), 1200); },
        },
        {
            id: 'stop',
            patterns: [/stop(?: listening)?/i, /quiet/i, /be quiet/i, /silence/i],
            handler: () => { speak('Voice assistant paused. Click the mic to resume.'); stopListening(); },
        },
        {
            id: 'scroll-top',
            patterns: [/scroll (?:to )?top/i, /go (?:to )?top/i, /back to top/i],
            handler: () => { window.scrollTo({ top: 0, behavior: 'smooth' }); speak('Scrolled to top.'); },
        },
        {
            id: 'scroll-bottom',
            patterns: [/scroll (?:to )?bottom/i, /go (?:to )?bottom/i],
            handler: () => { window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); speak('Scrolled to bottom.'); },
        },
        {
            id: 'greeting',
            patterns: [/^(?:hi|hello|hey)(?: there)?\.?$/i],
            handler: () => {
                const greetings = [
                    'Hello! Ready to plan your next adventure?',
                    'Hi there, explorer! Where shall we go today?',
                    'Hey! Let\'s find your perfect destination!',
                ];
                speak(greetings[Math.floor(Math.random() * greetings.length)]);
            },
        },
    ];

    /* ── SPEECH RECOGNITION SETUP ──────────────────────────────── */
    function initRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return null;

        const rec = new SpeechRecognition();
        rec.lang = CONFIG.lang;
        rec.continuous = CONFIG.continuous;
        rec.interimResults = CONFIG.interimResults;
        rec.maxAlternatives = CONFIG.maxAlternatives;

        rec.onstart = () => {
            state.listening = true;
            updateUI('listening');
            setStatusText('Listening…');
            resetIdleTimer();
        };

        rec.onend = () => {
            state.listening = false;
            if (!state.speaking) updateUI('idle');
            setStatusText('Click mic to speak');
        };

        rec.onerror = (e) => {
            console.warn('[VoiceAssistant] Recognition error:', e.error);
            state.listening = false;
            updateUI('error');
            setStatusText('Mic error — try again');
            setTimeout(() => { if (!state.listening) updateUI('idle'); }, 2000);
        };

        rec.onresult = (event) => {
            resetIdleTimer();
            let interim = '';
            let final = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const t = event.results[i][0].transcript;
                if (event.results[i].isFinal) final += t;
                else interim += t;
            }

            if (final) {
                state.transcript = final.trim();
                updateTranscriptDisplay(state.transcript, false);
                processCommand(state.transcript);
            } else if (interim) {
                updateTranscriptDisplay(interim, true);
            }
        };

        return rec;
    }

    /* ── COMMAND PROCESSOR ─────────────────────────────────────── */
    function processCommand(text) {
        addToHistory(text, 'user');

        for (const cmd of COMMANDS) {
            for (const pattern of cmd.patterns) {
                const match = text.match(pattern);
                if (match) {
                    cmd.handler(match);
                    return;
                }
            }
        }

        // Fallback: attempt city search if it looks like a place name
        if (/^[a-z\s]{2,30}$/i.test(text) && !text.includes(' ')) {
            speak(`Searching for ${text}!`);
            searchCity(text);
            return;
        }

        const fallbacks = [
            `I didn\'t quite catch that. Try saying "search for Paris" or "help" for commands.`,
            `Hmm, not sure about that. Say "help" to hear what I can do!`,
            `Could you rephrase that? Try "go to dashboard" or "search for Tokyo".`,
        ];
        speak(fallbacks[Math.floor(Math.random() * fallbacks.length)]);
    }

    /* ── TTS ───────────────────────────────────────────────────── */
    function speak(text) {
        if (!state.synth) return;
        state.synth.cancel();

        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = CONFIG.lang;
        utter.rate = CONFIG.voiceRate;
        utter.pitch = CONFIG.voicePitch;
        utter.volume = CONFIG.voiceVolume;

        // Prefer a natural-sounding female voice when the browser provides one.
        const voices = state.synth.getVoices();
        const englishVoices = voices.filter(v => v.lang && v.lang.startsWith('en'));
        const femaleVoices = englishVoices.filter(v =>
            FEMALE_VOICE_HINTS.some(pattern => pattern.test(v.name))
        );
        const preferred = femaleVoices[0] || englishVoices[0] || voices[0];
        if (preferred) utter.voice = preferred;

        utter.onstart = () => {
            state.speaking = true;
            updateUI('speaking');
            setStatusText('Speaking…');
        };

        utter.onend = () => {
            state.speaking = false;
            updateUI('idle');
            setStatusText('Click mic to speak');
        };

        state.synth.speak(utter);
        addToHistory(text, 'assistant');
    }

    /* ── NAVIGATION & SEARCH ───────────────────────────────────── */
    function navigate(path) {
        setTimeout(() => { window.location.href = path; }, 800);
    }

    function formatDateTimeLocal(date) {
        const pad = (n) => String(n).padStart(2, '0');
        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1);
        const day = pad(date.getDate());
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    function toQueryString(params) {
        return Object.entries(params)
            .filter(([, value]) => value !== undefined && value !== null && String(value).trim() !== '')
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
            .join('&');
    }

    function openDashboardWithCity(city, startTime = '', endTime = '') {
        const query = toQueryString({
            voice_city: city,
            voice_start_time: startTime,
            voice_end_time: endTime,
        });
        sessionStorage.setItem('vaPendingSearch', JSON.stringify({
            city,
            startTime,
            endTime,
        }));
        window.location.href = `/dashboard?${query}`;
    }

    function searchCity(city) {
        const cityInput = document.querySelector('input[name="city"]');
        const startInput = document.querySelector('input[name="start_time"]');
        const endInput = document.querySelector('input[name="end_time"]');
        const startTime = startInput ? startInput.value : '';
        const endTime = endInput ? endInput.value : '';

        if (cityInput && cityInput.form) {
            cityInput.value = city;
            if (startInput && endInput && !startInput.value) {
                const start = new Date();
                const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
                startInput.value = formatDateTimeLocal(start);
                endInput.value = formatDateTimeLocal(end);
            }
        }
        setTimeout(() => {
            openDashboardWithCity(city, startInput ? startInput.value : startTime, endInput ? endInput.value : endTime);
        }, 1000);
    }

    /* ── IDLE TIMER ─────────────────────────────────────────────── */
    function resetIdleTimer() {
        clearTimeout(state.idleTimer);
        state.idleTimer = setTimeout(() => {
            if (state.listening) stopListening();
        }, CONFIG.idleTimeout);
    }

    /* ── MIC CONTROL ───────────────────────────────────────────── */
    function startListening() {
        if (state.listening) return;
        if (!state.recognition) {
            state.recognition = initRecognition();
        }
        if (!state.recognition) {
            speak('Sorry, your browser does not support voice input. Please try Chrome or Edge.');
            return;
        }
        try {
            state.synth && state.synth.cancel();
            state.recognition.start();
        } catch (e) {
            console.warn('[VoiceAssistant] Start error:', e);
        }
    }

    function stopListening() {
        if (state.recognition && state.listening) {
            state.recognition.stop();
        }
        state.listening = false;
        updateUI('idle');
        setStatusText('Click mic to speak');
        clearTimeout(state.idleTimer);
    }

    function toggleListening() {
        if (state.listening) stopListening();
        else startListening();
    }

    /* ── UI HELPERS ─────────────────────────────────────────────── */
    function updateUI(mode) {
        const btn = document.getElementById('va-mic-btn');
        const widget = document.getElementById('va-widget');
        if (!btn || !widget) return;

        widget.dataset.mode = mode;

        btn.classList.remove('va-listening', 'va-speaking', 'va-error');
        if (mode === 'listening') btn.classList.add('va-listening');
        else if (mode === 'speaking') btn.classList.add('va-speaking');
        else if (mode === 'error') btn.classList.add('va-error');
    }

    function setStatusText(text) {
        const el = document.getElementById('va-status');
        if (el) el.textContent = text;
    }

    function updateTranscriptDisplay(text, isInterim) {
        const el = document.getElementById('va-transcript');
        if (el) {
            el.textContent = text;
            el.style.opacity = isInterim ? '0.55' : '1';
        }
    }

    function addToHistory(text, role) {
        state.history.push({ role, text, ts: Date.now() });
        renderHistory();
    }

    function renderHistory() {
        const list = document.getElementById('va-history');
        if (!list) return;
        list.innerHTML = '';
        const recent = state.history.slice(-6); // last 6 messages
        recent.forEach(item => {
            const li = document.createElement('li');
            li.className = `va-history-item va-history-${item.role}`;
            li.innerHTML = `<span class="va-history-icon">${item.role === 'user' ? '🎤' : '🤖'}</span><span>${item.text}</span>`;
            list.appendChild(li);
        });
        list.scrollTop = list.scrollHeight;
    }

    function showHelp() {
        const panel = document.getElementById('va-help-panel');
        if (panel) {
            panel.classList.add('visible');
            setTimeout(() => panel.classList.remove('visible'), 6000);
        }
    }

    /* ── WIDGET BUILDER ─────────────────────────────────────────── */
    function buildWidget() {
        if (document.getElementById('va-widget')) return; // already mounted

        const supported = !!(window.SpeechRecognition || window.webkitSpeechRecognition);

        const widget = document.createElement('div');
        widget.id = 'va-widget';
        widget.setAttribute('aria-label', 'Voice Assistant');
        widget.setAttribute('role', 'complementary');
        widget.innerHTML = `
            <!-- Floating trigger button -->
            <button id="va-toggle-btn" class="va-fab" aria-label="Toggle voice assistant" title="Voice Assistant">
                <span class="va-fab-icon">🎙️</span>
                <span class="va-fab-ripple"></span>
            </button>

            <!-- Expanded panel -->
            <div id="va-panel" class="va-panel" aria-hidden="true">

                <!-- Header -->
                <div class="va-header">
                    <div class="va-header-left">
                        <div class="va-avatar">
                            <div class="va-avatar-rings">
                                <div class="va-ring r1"></div>
                                <div class="va-ring r2"></div>
                                <div class="va-ring r3"></div>
                            </div>
                            <span class="va-avatar-icon">🤖</span>
                        </div>
                        <div>
                            <div class="va-name">TravelAI Voice</div>
                            <div class="va-status-dot-row">
                                <span class="va-dot"></span>
                                <span id="va-status" class="va-status-txt">Click mic to speak</span>
                            </div>
                        </div>
                    </div>
                    <button id="va-close-btn" class="va-close" aria-label="Close voice assistant">✕</button>
                </div>

                <!-- Waveform visualizer -->
                <div class="va-wave-container" aria-hidden="true">
                    <div class="va-wave"><span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span></div>
                </div>

                <!-- Transcript display -->
                <div class="va-transcript-box" aria-live="polite">
                    <span id="va-transcript" class="va-transcript-text">Say something…</span>
                </div>

                <!-- Conversation history -->
                <ul id="va-history" class="va-history" aria-label="Conversation history"></ul>

                <!-- Mic button -->
                <div class="va-controls">
                    ${supported
                        ? `<button id="va-mic-btn" class="va-mic-btn" aria-label="Start voice input" title="Hold to speak">
                                <i class="fa-solid fa-microphone"></i>
                                <span class="va-mic-pulse"></span>
                           </button>`
                        : `<p class="va-unsupported">⚠️ Voice input not supported in this browser. Try Chrome or Edge.</p>`
                    }
                </div>

                <!-- Quick command chips -->
                <div class="va-chips" aria-label="Quick voice commands">
                    <button class="va-chip" data-cmd="Go to Dashboard">📊 Dashboard</button>
                    <button class="va-chip" data-cmd="Go to Explore">🗺️ Explore</button>
                    <button class="va-chip" data-cmd="Search for Paris">🗼 Paris</button>
                    <button class="va-chip" data-cmd="Search for Tokyo">⛩️ Tokyo</button>
                    <button class="va-chip" data-cmd="Search for Dubai">🏙️ Dubai</button>
                    <button class="va-chip" data-cmd="Help">❓ Help</button>
                </div>

                <!-- Help panel -->
                <div id="va-help-panel" class="va-help-panel">
                    <strong>🎤 Voice Commands</strong>
                    <ul>
                        <li>"Search for Paris"</li>
                        <li>"Go to Dashboard"</li>
                        <li>"Open Explore"</li>
                        <li>"Show Reviews"</li>
                        <li>"Go to Home"</li>
                        <li>"Scroll to top"</li>
                        <li>"Log out"</li>
                        <li>"Stop listening"</li>
                    </ul>
                </div>

            </div>
        `;

        document.body.appendChild(widget);

        /* ── BIND EVENTS ── */
        // FAB open/close
        document.getElementById('va-toggle-btn').addEventListener('click', () => {
            const panel = document.getElementById('va-panel');
            const isOpen = panel.classList.toggle('va-open');
            panel.setAttribute('aria-hidden', String(!isOpen));

            if (isOpen && !state.initialized) {
                state.initialized = true;
                setTimeout(() => speak('Hi! I\'m your TravelAI voice assistant. Say "help" to hear what I can do!'), 400);
            }
        });

        // Close button
        document.getElementById('va-close-btn').addEventListener('click', () => {
            document.getElementById('va-panel').classList.remove('va-open');
            stopListening();
        });

        // Mic button
        const micBtn = document.getElementById('va-mic-btn');
        if (micBtn) {
            micBtn.addEventListener('click', toggleListening);
        }

        // Quick-command chips
        document.querySelectorAll('.va-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                const cmd = chip.dataset.cmd;
                updateTranscriptDisplay(cmd, false);
                addToHistory(cmd, 'user');
                processCommand(cmd);
            });
        });

        // Keyboard shortcut: Alt+V to toggle
        document.addEventListener('keydown', (e) => {
            if (e.altKey && e.key === 'v') {
                document.getElementById('va-toggle-btn').click();
            }
            if (e.altKey && e.key === 'm') {
                const panel = document.getElementById('va-panel');
                if (panel.classList.contains('va-open')) toggleListening();
            }
        });
    }

    /* ── INIT ───────────────────────────────────────────────────── */
    function init() {
        // Load voices asynchronously
        if (window.speechSynthesis) {
            window.speechSynthesis.getVoices(); // warm up
            window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
        }

        buildWidget();

        const pendingSearchRaw = sessionStorage.getItem('vaPendingSearch');
        if (pendingSearchRaw) {
            try {
                const pendingSearch = JSON.parse(pendingSearchRaw);
                sessionStorage.removeItem('vaPendingSearch');
                const panel = document.getElementById('va-panel');
                if (panel && !panel.classList.contains('va-open')) {
                    panel.classList.add('va-open');
                    panel.setAttribute('aria-hidden', 'false');
                }
                const target = pendingSearch.city ? pendingSearch.city : 'your destination';
                setTimeout(() => speak(`Showing results for ${target}.`), 500);
            } catch (e) {
                sessionStorage.removeItem('vaPendingSearch');
            }
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    /* ── PUBLIC API (optional external control) ────────────────── */
    window.TravelAIVoice = { start: startListening, stop: stopListening, speak };

})();
