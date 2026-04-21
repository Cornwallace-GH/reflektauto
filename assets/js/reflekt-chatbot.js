/**
 * Reflekt Auto Care — AI Chat Widget
 * ────────────────────────────────────
 * Drop this script into any page to add the floating AI chatbot.
 * Update CHAT_API_URL below to point to your deployed server when ready.
 */

(function () {
  'use strict';

  // ── CONFIG ───────────────────────────────────────────────────────────────
  const CHAT_API_URL   = 'http://localhost:3001/api/chat';
  const WELCOME_MSG    = "Hey there! I'm **Reflekt AI** — your guide to everything Reflekt Auto Care. Ask me about services, pricing, or what's right for your vehicle. I can also send you straight to booking. 🏁";
  const PLACEHOLDER    = 'Ask about services, pricing, booking…';
  const BOT_NAME       = 'Reflekt AI';

  // ── INJECT STYLES ─────────────────────────────────────────────────────────
  const style = document.createElement('style');
  style.textContent = `
    /* ── VARIABLES ── */
    #rac-widget { --rac-black: #0A0A0A; --rac-black2: #141414; --rac-black3: #1C1C1C; --rac-gold: #C9A84C; --rac-gold-light: #E2C37A; --rac-white: #F5F4F0; --rac-muted: rgba(245,244,240,0.5); --rac-border: rgba(201,168,76,0.2); --rac-radius: 12px; }

    /* ── FAB BUTTON ── */
    #rac-fab {
      position: fixed; bottom: 28px; right: 28px; z-index: 9999;
      width: 58px; height: 58px; border-radius: 50%;
      background: var(--rac-gold); border: none; cursor: pointer;
      box-shadow: 0 4px 20px rgba(201,168,76,0.4);
      display: flex; align-items: center; justify-content: center;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    #rac-fab:hover { transform: scale(1.07); box-shadow: 0 6px 28px rgba(201,168,76,0.5); }
    #rac-fab svg { transition: opacity 0.2s, transform 0.2s; }
    #rac-fab.open .rac-icon-chat { opacity: 0; transform: scale(0.5); position: absolute; }
    #rac-fab.open .rac-icon-close { opacity: 1; transform: scale(1); }
    #rac-fab .rac-icon-close { opacity: 0; transform: scale(0.5); position: absolute; }
    #rac-badge {
      position: absolute; top: -3px; right: -3px;
      width: 14px; height: 14px; background: #e84040; border-radius: 50%;
      border: 2px solid #fff; display: none;
    }
    #rac-fab.has-badge #rac-badge { display: block; }

    /* ── PANEL ── */
    #rac-panel {
      position: fixed; bottom: 100px; right: 28px; z-index: 9998;
      width: 360px; max-width: calc(100vw - 40px);
      background: var(--rac-black2); border: 1px solid var(--rac-border);
      border-radius: var(--rac-radius);
      box-shadow: 0 16px 48px rgba(0,0,0,0.6);
      display: flex; flex-direction: column;
      overflow: hidden;
      opacity: 0; pointer-events: none; transform: translateY(12px) scale(0.97);
      transition: opacity 0.22s ease, transform 0.22s ease;
      font-family: 'DM Sans', sans-serif;
      max-height: 520px;
    }
    #rac-panel.open { opacity: 1; pointer-events: all; transform: translateY(0) scale(1); }

    /* ── HEADER ── */
    #rac-header {
      background: var(--rac-black); padding: 16px 18px;
      border-bottom: 1px solid var(--rac-border);
      display: flex; align-items: center; gap: 12px; flex-shrink: 0;
    }
    #rac-avatar {
      width: 36px; height: 36px; border-radius: 50%;
      background: var(--rac-gold); display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    #rac-avatar span { font-family: 'Bebas Neue', sans-serif; font-size: 16px; color: var(--rac-black); letter-spacing: 1px; }
    #rac-header-text { flex: 1; }
    #rac-header-name { font-size: 14px; font-weight: 600; color: var(--rac-white); letter-spacing: 0.3px; }
    #rac-header-status { font-size: 11px; color: var(--rac-gold); display: flex; align-items: center; gap: 5px; margin-top: 1px; }
    .rac-dot { width: 6px; height: 6px; border-radius: 50%; background: #4caf50; flex-shrink: 0; }
    #rac-clear-btn {
      background: transparent; border: 1px solid var(--rac-border); color: var(--rac-muted);
      font-family: 'DM Sans', sans-serif; font-size: 11px; letter-spacing: 0.5px; text-transform: uppercase;
      padding: 5px 10px; border-radius: 4px; cursor: pointer; transition: all 0.2s;
    }
    #rac-clear-btn:hover { border-color: var(--rac-gold); color: var(--rac-gold); }

    /* ── MESSAGES ── */
    #rac-messages {
      flex: 1; overflow-y: auto; padding: 18px 16px; display: flex;
      flex-direction: column; gap: 14px; min-height: 0;
    }
    #rac-messages::-webkit-scrollbar { width: 3px; }
    #rac-messages::-webkit-scrollbar-track { background: transparent; }
    #rac-messages::-webkit-scrollbar-thumb { background: rgba(201,168,76,0.3); border-radius: 2px; }

    .rac-msg { display: flex; gap: 10px; align-items: flex-start; max-width: 100%; }
    .rac-msg.user { flex-direction: row-reverse; }

    .rac-msg-avatar {
      width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0; margin-top: 2px;
      background: var(--rac-gold); display: flex; align-items: center; justify-content: center;
    }
    .rac-msg-avatar span { font-family: 'Bebas Neue', sans-serif; font-size: 13px; color: var(--rac-black); }
    .rac-msg.user .rac-msg-avatar { background: var(--rac-black3); border: 1px solid rgba(255,255,255,0.1); }
    .rac-msg.user .rac-msg-avatar span { color: var(--rac-muted); }

    .rac-bubble {
      max-width: 82%; background: var(--rac-black3); border: 1px solid rgba(255,255,255,0.06);
      border-radius: 10px; padding: 10px 13px;
      font-size: 13.5px; color: var(--rac-white); line-height: 1.65; font-weight: 300;
    }
    .rac-msg.user .rac-bubble {
      background: var(--rac-gold); color: var(--rac-black); border-color: transparent; font-weight: 500;
    }
    .rac-bubble strong { font-weight: 600; }
    .rac-bubble a { color: var(--rac-gold); text-decoration: underline; text-underline-offset: 2px; }
    .rac-msg.user .rac-bubble a { color: var(--rac-black); }
    .rac-bubble p { margin: 0 0 8px; }
    .rac-bubble p:last-child { margin: 0; }
    .rac-bubble ul { margin: 6px 0 0; padding-left: 16px; }
    .rac-bubble li { margin-bottom: 4px; }

    /* booking link button inside bubble */
    .rac-book-link {
      display: inline-block; margin-top: 8px; background: var(--rac-gold); color: var(--rac-black) !important;
      font-size: 11.5px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase;
      padding: 7px 14px; border-radius: 4px; text-decoration: none !important;
      transition: background 0.2s;
    }
    .rac-book-link:hover { background: #E2C37A; }

    /* ── TYPING INDICATOR ── */
    .rac-typing { display: flex; gap: 4px; align-items: center; padding: 10px 13px; }
    .rac-typing span {
      width: 6px; height: 6px; border-radius: 50%; background: var(--rac-gold);
      animation: rac-bounce 1.2s ease-in-out infinite;
    }
    .rac-typing span:nth-child(2) { animation-delay: 0.2s; }
    .rac-typing span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes rac-bounce { 0%,80%,100%{transform:translateY(0);opacity:0.4} 40%{transform:translateY(-5px);opacity:1} }

    /* ── QUICK REPLIES ── */
    #rac-quick {
      display: flex; gap: 6px; flex-wrap: wrap; padding: 0 16px 12px;
    }
    .rac-quick-btn {
      background: transparent; border: 1px solid var(--rac-border); color: var(--rac-muted);
      font-family: 'DM Sans', sans-serif; font-size: 11.5px; padding: 5px 12px;
      border-radius: 20px; cursor: pointer; transition: all 0.2s; white-space: nowrap;
    }
    .rac-quick-btn:hover { border-color: var(--rac-gold); color: var(--rac-gold); }

    /* ── INPUT ── */
    #rac-footer {
      border-top: 1px solid var(--rac-border); padding: 12px 14px;
      display: flex; gap: 10px; align-items: flex-end; flex-shrink: 0;
      background: var(--rac-black);
    }
    #rac-input {
      flex: 1; background: var(--rac-black3); border: 1px solid rgba(255,255,255,0.08);
      border-radius: 8px; padding: 10px 13px; color: var(--rac-white);
      font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 300;
      resize: none; outline: none; line-height: 1.5; max-height: 100px;
      transition: border-color 0.2s;
    }
    #rac-input::placeholder { color: rgba(245,244,240,0.3); }
    #rac-input:focus { border-color: rgba(201,168,76,0.4); }
    #rac-send {
      width: 38px; height: 38px; border-radius: 8px; background: var(--rac-gold);
      border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; transition: background 0.2s, opacity 0.2s; align-self: flex-end;
    }
    #rac-send:hover { background: var(--rac-gold-light); }
    #rac-send:disabled { opacity: 0.45; cursor: not-allowed; }

    /* ── BRANDING ── */
    #rac-brand {
      text-align: center; font-size: 10px; color: rgba(245,244,240,0.2);
      padding: 6px 0 10px; letter-spacing: 0.5px;
    }

    @media (max-width: 420px) {
      #rac-panel { right: 12px; bottom: 90px; width: calc(100vw - 24px); }
      #rac-fab  { right: 16px; bottom: 20px; }
    }
  `;
  document.head.appendChild(style);

  // ── BUILD HTML ───────────────────────────────────────────────────────────
  const widget = document.createElement('div');
  widget.id = 'rac-widget';
  widget.innerHTML = `
    <!-- FAB -->
    <button id="rac-fab" aria-label="Open chat">
      <div id="rac-badge"></div>
      <!-- Chat icon -->
      <svg class="rac-icon-chat" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="#0A0A0A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <!-- Close icon -->
      <svg class="rac-icon-close" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M4 4l12 12M16 4L4 16" stroke="#0A0A0A" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </button>

    <!-- PANEL -->
    <div id="rac-panel" role="dialog" aria-label="Reflekt AI Chat">
      <div id="rac-header">
        <div id="rac-avatar"><span>R</span></div>
        <div id="rac-header-text">
          <div id="rac-header-name">Reflekt AI</div>
          <div id="rac-header-status"><div class="rac-dot"></div>Online — ask me anything</div>
        </div>
        <button id="rac-clear-btn" title="Clear chat">Clear</button>
      </div>

      <div id="rac-messages"></div>

      <div id="rac-quick">
        <button class="rac-quick-btn" data-q="What services do you offer?">Services</button>
        <button class="rac-quick-btn" data-q="How much does a full detail cost?">Pricing</button>
        <button class="rac-quick-btn" data-q="How do I book an appointment?">Booking</button>
        <button class="rac-quick-btn" data-q="What's the difference between Silver, Gold, and Platinum?">Tiers explained</button>
      </div>

      <div id="rac-footer">
        <textarea id="rac-input" rows="1" placeholder="${PLACEHOLDER}" aria-label="Message"></textarea>
        <button id="rac-send" aria-label="Send message" disabled>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M14 8L2 2l2.5 6L2 14l12-6z" fill="#0A0A0A"/>
          </svg>
        </button>
      </div>
      <div id="rac-brand">Powered by Claude AI &middot; Reflekt Auto Care</div>
    </div>
  `;
  document.body.appendChild(widget);

  // ── REFS ─────────────────────────────────────────────────────────────────
  const fab      = document.getElementById('rac-fab');
  const panel    = document.getElementById('rac-panel');
  const messages = document.getElementById('rac-messages');
  const input    = document.getElementById('rac-input');
  const sendBtn  = document.getElementById('rac-send');
  const clearBtn = document.getElementById('rac-clear-btn');
  const quickBar = document.getElementById('rac-quick');
  const badge    = document.getElementById('rac-badge');

  // conversation history sent to the API
  let history   = [];
  let isOpen    = false;
  let isTyping  = false;
  let hasUnread = false;

  // ── TOGGLE PANEL ─────────────────────────────────────────────────────────
  function togglePanel() {
    isOpen = !isOpen;
    fab.classList.toggle('open', isOpen);
    panel.classList.toggle('open', isOpen);
    if (isOpen) {
      hasUnread = false;
      fab.classList.remove('has-badge');
      badge.style.display = 'none';
      if (history.length === 0) addWelcome();
      setTimeout(() => input.focus(), 250);
    }
  }
  fab.addEventListener('click', togglePanel);

  // ── WELCOME ───────────────────────────────────────────────────────────────
  function addWelcome() {
    addBotMessage(WELCOME_MSG);
  }

  // ── RENDER MESSAGE ────────────────────────────────────────────────────────
  function addBotMessage(text) {
    const div = document.createElement('div');
    div.className = 'rac-msg bot';
    div.innerHTML = `
      <div class="rac-msg-avatar"><span>R</span></div>
      <div class="rac-bubble">${formatMessage(text)}</div>
    `;
    messages.appendChild(div);
    scrollBottom();
  }

  function addUserMessage(text) {
    const div = document.createElement('div');
    div.className = 'rac-msg user';
    div.innerHTML = `
      <div class="rac-msg-avatar"><span>↑</span></div>
      <div class="rac-bubble">${escapeHtml(text)}</div>
    `;
    messages.appendChild(div);
    scrollBottom();
  }

  function showTyping() {
    const div = document.createElement('div');
    div.className = 'rac-msg bot';
    div.id = 'rac-typing-row';
    div.innerHTML = `
      <div class="rac-msg-avatar"><span>R</span></div>
      <div class="rac-bubble rac-typing"><span></span><span></span><span></span></div>
    `;
    messages.appendChild(div);
    scrollBottom();
  }

  function hideTyping() {
    const el = document.getElementById('rac-typing-row');
    if (el) el.remove();
  }

  // ── FORMAT MESSAGE ────────────────────────────────────────────────────────
  // Converts markdown-lite to HTML + makes Square booking links into buttons
  function formatMessage(text) {
    // Escape HTML first (except we'll convert markdown after)
    let html = text
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      // Bold
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      // Line breaks / paragraphs
      .split(/\n\n+/).map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');

    // Convert Square booking links (square.site or squareup.com/appointments) into book buttons
    html = html.replace(
      /https:\/\/(?:square\.site|squareup\.com\/appointments)[^\s<"]+/g,
      url => `<a href="${url}" class="rac-book-link" target="_blank" rel="noopener">Book Now →</a>`
    );

    // Also convert any /booking page links into book buttons
    html = html.replace(
      /https:\/\/www\.reflektautocare\.com\/booking[^\s<"]*/g,
      url => `<a href="${url}" class="rac-book-link" target="_blank" rel="noopener">Book Now →</a>`
    );

    // Convert other URLs to links
    html = html.replace(
      /(?<!href=")(?<![">])(https?:\/\/[^\s<"]+)/g,
      url => `<a href="${url}" target="_blank" rel="noopener">${url}</a>`
    );

    return html;
  }

  function escapeHtml(text) {
    return text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function scrollBottom() {
    messages.scrollTop = messages.scrollHeight;
  }

  // ── SEND MESSAGE ──────────────────────────────────────────────────────────
  async function sendMessage(userText) {
    userText = userText.trim();
    if (!userText || isTyping) return;

    // Hide quick replies after first real interaction
    quickBar.style.display = 'none';

    addUserMessage(userText);
    history.push({ role: 'user', content: userText });

    input.value = '';
    input.style.height = 'auto';
    sendBtn.disabled = true;
    isTyping = true;
    showTyping();

    try {
      const res = await fetch(CHAT_API_URL, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ messages: history })
      });

      if (!res.ok) throw new Error(`Server error ${res.status}`);

      const data = await res.json();
      hideTyping();

      const replyText = data.content || 'Sorry, I didn\'t catch that. Try again?';
      addBotMessage(replyText);
      history.push({ role: 'assistant', content: replyText });

      // If panel is closed, show unread badge
      if (!isOpen) {
        hasUnread = true;
        fab.classList.add('has-badge');
        badge.style.display = 'block';
      }

    } catch (err) {
      hideTyping();
      addBotMessage('Hmm, I\'m having trouble connecting right now. Please try again in a moment, or **book directly** at [reflektautocare.com/booking](https://www.reflektautocare.com/booking).');
      console.error('Reflekt chatbot error:', err);
    }

    isTyping = false;
    sendBtn.disabled = false;
    input.focus();
  }

  // ── INPUT HANDLING ────────────────────────────────────────────────────────
  input.addEventListener('input', () => {
    sendBtn.disabled = input.value.trim().length === 0;
    // Auto-resize textarea
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 100) + 'px';
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input.value);
    }
  });

  sendBtn.addEventListener('click', () => sendMessage(input.value));

  // ── QUICK REPLIES ─────────────────────────────────────────────────────────
  quickBar.querySelectorAll('.rac-quick-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      sendMessage(btn.dataset.q);
    });
  });

  // ── CLEAR CHAT ────────────────────────────────────────────────────────────
  clearBtn.addEventListener('click', () => {
    history = [];
    messages.innerHTML = '';
    quickBar.style.display = 'flex';
    addWelcome();
  });

})();
