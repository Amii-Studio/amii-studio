/**
 * Amii Studio — Shared Components
 * Nav + Footer 共用元件，所有頁面引入這一個檔案即可
 * 如需修改 nav/footer，只改這裡
 */

(function () {

  /* ── 判斷目前頁面，設定 active nav link ── */
  const page = location.pathname.split('/').pop() || 'index.html';
  const isHome = page === 'index.html' || page === '';

  /* ── Nav HTML ── */
  const LOGO_SVG = `<svg width="173" height="20" viewBox="0 0 173 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M82.5 0V5H77.5V10H67.5V5H72.5V0H82.5ZM82.5 10V15H77.5V10H82.5ZM77.5 15V20H67.5V15H77.5Z" fill="black"/>
    <path d="M102.5 0V5H97.5V20H92.5V5H87.5V0H102.5Z" fill="black"/>
    <path d="M112.5 0V15H117.5V0H122.5V20H112.5V15H107.5V0H112.5Z" fill="black"/>
    <path d="M137.5 0V5H132.5V15H137.5V20H127.5V0H137.5ZM142.5 5V15H137.5V5H142.5Z" fill="black"/>
    <rect x="147.5" width="5" height="20" fill="black"/>
    <path d="M172.5 0V20H157.5V0H172.5ZM162.5 5V15H167.5V5H162.5Z" fill="black"/>
    <path d="M45 15H50V10H55V20H40V10H45V15ZM45 5H40V0H45V5ZM55 5H50V0H55V5Z" fill="black"/>
    <path d="M30 0V5H35V20H30V10H25V20H20V0H30Z" fill="black"/>
    <path d="M10 5H15V20H10V15H5V20H0V5H5V0H10V5ZM5 10H10V5H5V10Z" fill="black"/>
  </svg>`;

  const LOGO_SVG_WHITE = LOGO_SVG.replace(/fill="black"/g, 'fill="white"');

  /* Nav 連結定義 */
  const NAV_LINKS = [
    { label: 'Home',    labelZh: '首頁', href: 'index.html',  key: 'home'    },
    { label: 'About',   labelZh: '關於', href: 'about.html', key: 'about'   },
    { label: 'Works',   labelZh: '作品', href: 'works.html',     key: 'works'   },
    { label: 'Blog',    labelZh: 'Blog', href: 'blog.html',      key: 'blog'    },
    { label: 'Contact', labelZh: '聯絡', href: 'index.html#contact-section', key: 'contact' },
  ];

  /* 目前頁面對應 key */
  const activeKey =
    page.includes('about') ? 'about' :
    page.includes('works')  ? 'works'  :
    page.includes('blog')   ? 'blog'   :
    isHome                  ? 'home'   : '';

  const navLinksHTML = NAV_LINKS.map(l =>
    `<li><a href="${l.href}" data-key="${l.key}" data-en="${l.label}" data-zh="${l.labelZh}" ${l.key === activeKey ? 'style="opacity:1;font-weight:500;"' : ''}>${l.label}</a></li>`
  ).join('');

  const mobileLinksHTML = NAV_LINKS.map((l, i) =>
    `<a href="${l.href}" class="mobile-link" data-en="${l.label}" data-zh="${l.labelZh}" style="--i:${i}" onclick="closeMobileMenu()">${l.label}</a>`
  ).join('');

  /* Nav DOM */
  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.innerHTML = `
    <a id="logo" href="index.html">${LOGO_SVG}</a>
    <ul id="nav-links">${navLinksHTML}</ul>
    <div style="display:flex;align-items:center;gap:12px;">
      <button id="hamburger" aria-label="Menu" style="display:none;">
        <span></span><span></span><span></span>
      </button>
      <div id="lang">
        <span class="lang-en">EN</span>
        <span class="lang-sep">|</span>
        <span class="lang-zh">中</span>
      </div>
    </div>`;

  /* Mobile Menu DOM */
  const mobileMenu = document.createElement('div');
  mobileMenu.id = 'mobile-menu';
  mobileMenu.style.cssText = 'position:fixed;inset:0;z-index:99;flex-direction:column;align-items:center;justify-content:center;gap:36px;';
  mobileMenu.innerHTML = mobileLinksHTML;

  /* Footer DOM */
  const footer = document.createElement('footer');
  footer.id = 'footer';
  footer.innerHTML = `
    <div class="footer-inner">
      <div class="footer-row">
        <div class="footer-left-group">
          <a href="index.html" class="footer-logo-link">${LOGO_SVG_WHITE}</a>
          <span class="footer-sep">|</span>
          <a href="#" class="privacy-link" data-en="Privacy Policy" data-zh="隱私權政策" onclick="document.getElementById('privacy-dialog').showModal();return false;">Privacy Policy</a>
          <span class="footer-sep">|</span>
          <a href="#" class="privacy-link copyright-link-footer" data-en="Copyright" data-zh="版權聲明" onclick="document.getElementById('copyright-dialog').showModal();return false;">Copyright</a>
        </div>
        <div class="footer-socials">
          <a href="#" aria-label="LinkedIn">
            <svg viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M26.67 26.67V16.0501C26.67 14.3176 25.9818 12.6561 24.7567 11.4311C23.5317 10.2061 21.8702 9.51784 20.1378 9.51784C18.4346 9.51784 16.4508 10.5598 15.489 12.1227V9.89856H9.89856V26.67H15.489V16.7915C15.489 15.2486 16.7314 13.9862 18.2743 13.9862C19.0183 13.9862 19.7318 14.2818 20.2579 14.8079C20.784 15.3339 21.0795 16.0475 21.0795 16.7915V26.67H26.67ZM3.38635 6.75266C4.27915 6.75266 5.13538 6.398 5.76669 5.76669C6.398 5.13538 6.75266 4.27915 6.75266 3.38635C6.75266 1.52285 5.24984 0 3.38635 0C2.48823 0 1.6269 0.356775 0.991838 0.991838C0.356775 1.6269 0 2.48823 0 3.38635C0 5.24984 1.52285 6.75266 3.38635 6.75266ZM6.17157 26.67V9.89856H0.621164V26.67H6.17157Z" fill="white"/></svg>
          </a>
          <a href="#" aria-label="Instagram">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="white" stroke-width="2" fill="none"/>
              <circle cx="12" cy="12" r="5" stroke="white" stroke-width="2" fill="none"/>
              <circle cx="17.5" cy="6.5" r="1.2" fill="white"/>
            </svg>
          </a>
          <a href="#" aria-label="Facebook">
            <svg viewBox="0 0 14 27" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.3345 15.3353H12.6683L14.0018 10.0013H9.3345V7.33425C9.3345 5.96075 9.3345 4.66725 12.0015 4.66725H14.0018V0.18669C13.567 0.12935 11.9255 0 10.1919 0C6.57149 0 4.0005 2.20961 4.0005 6.26745V10.0013H0V15.3353H4.0005V26.67H9.3345V15.3353Z" fill="white"/></svg>
          </a>
        </div>
      </div>
      <span class="footer-copy" data-en="© 2026 Amii Studio. All rights reserved." data-zh="© 2026 Amii Studio 版權所有。">© 2026 Amii Studio. All rights reserved.</span>
    </div>`;

  /* ── 注入到 DOM ── */
  document.addEventListener('DOMContentLoaded', () => {
    document.body.insertBefore(nav, document.body.firstChild);
    document.body.insertBefore(mobileMenu, nav.nextSibling);

    // About 頁是全螢幕互動設計（overflow:hidden），不注入 footer
    const isAbout = page.includes('about');
    if (!isAbout) {
      document.body.appendChild(footer);

      // ── inject dialogs if not already present ──
      if (!document.getElementById('privacy-dialog')) {
        const privacyEl = document.createElement('div');
        privacyEl.innerHTML = `<dialog id="privacy-dialog">
  <div class="privacy-header">
    <h2>Privacy Policy ／ 隱私權政策</h2>
    <button class="privacy-close" onclick="this.closest('dialog').close()" aria-label="Close">Close</button>
  </div>
  <div class="privacy-body">
    <div class="privacy-en">
      <p>Welcome to Amii Studio. Your privacy is incredibly important to us. This Privacy Policy explains how we collect, use, and protect your information when you visit our website, review our portfolio, read our blog, or contact us for freelance collaborations.</p>
      <h3>1. Information We Collect and How We Use It</h3>
      <ul>
        <li><strong>Contact Information:</strong> When you reach out to us via email for freelance inquiries or collaborations, we collect your name (or alias), email address, and the content of your message. This information is strictly used to respond to your inquiries and discuss potential projects. We will never sell, lease, or share your contact info with third parties.</li>
        <li><strong>Browsing Data:</strong> We may use standard third-party web analytics tools (such as Google Search Console or Google Analytics) to improve user experience. These tools collect anonymous data, including your IP address, browser type, time spent on the site, and pages visited. This data is completely anonymized and cannot be used to identify you personally.</li>
      </ul>
      <h3>2. Cookies</h3>
      <p>Our website may use cookies to enhance your browsing experience. You can choose to disable cookies through your browser settings at any time without affecting your ability to view our portfolio or blog posts.</p>
      <h3>3. Third-Party Links</h3>
      <p>Our blog or portfolio may contain links to external websites. Once you leave our site via these links, please note that we do not have control over those third-party websites, and they are governed by their own privacy policies.</p>
      <h3>4. Changes to This Policy</h3>
      <p>We reserve the right to update this Privacy Policy as needed. Any changes will be posted directly on this page with an updated revision date.</p>
      <p class="privacy-updated">Last updated: June 2026</p>
    </div>
    <div class="privacy-zh" style="margin-top:24px;">
      <p>歡迎訪問 Amii Studio。我們非常重視您的隱私權，特此說明本網站的隱私權保護政策。</p>
      <h3>一、個人資料的收集與使用</h3>
      <ul>
        <li><strong>聯絡我們：</strong>當您透過電子郵件與我們聯絡以洽談接案或合作事宜時，我們會保留您的姓名、電子郵件地址及信件內容，僅用於回覆需求，絕不外洩。</li>
        <li><strong>瀏覽紀錄：</strong>本網站可能使用第三方分析工具（如 Google Analytics）收集匿名瀏覽資訊，這些數據無法識別您的個人身分。</li>
      </ul>
      <h3>二、Cookie 的使用</h3>
      <p>本網站可能使用 Cookie 提供更好的瀏覽體驗。您可透過瀏覽器設定拒絕 Cookie，不影響正常瀏覽。</p>
      <h3>三、第三方連結</h3>
      <p>本網站文章或作品集可能包含其他網站連結，點擊後適用該網站的隱私權政策。</p>
      <h3>四、政策修訂</h3>
      <p>本政策將不定期修訂，修正後條款直接刊登於本頁。</p>
      <p class="privacy-updated">最近更新：2026 年 6 月</p>
    </div>
  </div>
</dialog>`;
        document.body.appendChild(privacyEl.firstChild);
      }

      if (!document.getElementById('copyright-dialog')) {
        const copyrightEl = document.createElement('div');
        copyrightEl.innerHTML = `<dialog id="copyright-dialog">
  <div class="privacy-header">
    <h2>版權聲明 ／ Copyright Notice</h2>
    <button class="privacy-close" onclick="this.closest('dialog').close()" aria-label="Close">Close</button>
  </div>
  <div class="privacy-body">
    <div class="privacy-zh">
      <p>本網站（Amii Studio）之所有內容，包括但不限於文字、專案圖片、設計作品、影像及部落格文章，其著作權均歸屬 Amii Studio 所有。非經本站正式書面授權，禁止任何形式之複製、轉載、改寫、擷取或用於商業用途。如有侵權行為，本站將保留法律追訴權。</p>
    </div>
    <div class="privacy-en" style="margin-top:24px;">
      <p>All content on this website (Amii Studio), including but not limited to text, project images, design works, photography, and blog posts, is the exclusive property of Amii Studio and is protected by international copyright laws. No part of this website may be reproduced, redistributed, modified, or used for commercial purposes in any form without prior written permission. Amii Studio reserves all legal rights to pursue remedies for any copyright infringement.</p>
      <p class="privacy-updated">© 2026 Amii Studio. All rights reserved.</p>
    </div>
  </div>
</dialog>`;
        document.body.appendChild(copyrightEl.firstChild);
      }

      // click-outside to close dialogs
      ['privacy-dialog','copyright-dialog'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('click', function(e) {
          if (e.target === el) el.close();
        });
      });
    }

    /* Hamburger 邏輯 */
    const btn = document.getElementById('hamburger');
    if (!btn) return;
    mobileMenu.style.display = 'none';
    let open = false;
    btn.addEventListener('click', () => {
      open = !open;
      if (open) {
        mobileMenu.style.display = 'flex';
        requestAnimationFrame(() => mobileMenu.classList.add('open'));
        btn.classList.add('open');
      } else {
        closeMobileMenu();
        open = false;
      }
    });

    // ── Language Switch ──
    const isZhKey = 'amii-lang';
    let isZh = localStorage.getItem(isZhKey) === 'zh';

    function applyLang(zh) {
      isZh = zh;
      localStorage.setItem(isZhKey, zh ? 'zh' : 'en');

      // nav active states
      const langEl = document.getElementById('lang');
      if (langEl) {
        langEl.querySelector('.lang-en').style.opacity = zh ? '0.4' : '1';
        langEl.querySelector('.lang-en').style.fontWeight = zh ? '400' : '600';
        langEl.querySelector('.lang-zh').style.opacity = zh ? '1' : '0.4';
        langEl.querySelector('.lang-zh').style.fontWeight = zh ? '600' : '400';
      }

      // nav links text
      document.querySelectorAll('#nav-links a[data-en], .mobile-link[data-en]').forEach(el => {
        el.textContent = zh ? el.dataset.zh : el.dataset.en;
      });

      // footer links text
      document.querySelectorAll('.privacy-link[data-en], .footer-copy[data-en]').forEach(el => {
        el.textContent = zh ? el.dataset.zh : el.dataset.en;
      });

      // page content: btn-link, see-all-link, about-intro-text
      document.querySelectorAll('.btn-link[data-en], .see-all-link[data-en]').forEach(el => {
        el.textContent = zh ? el.dataset.zh : el.dataset.en;
      });
      const introEl = document.querySelector('.about-intro-text[data-en]');
      if (introEl) introEl.innerHTML = zh ? introEl.dataset.zh : introEl.dataset.en;

      // dialog content: show zh or en sections
      document.querySelectorAll('#privacy-dialog, #copyright-dialog').forEach(dialog => {
        const enEl = dialog.querySelector('.privacy-en');
        const zhEl = dialog.querySelector('.privacy-zh');
        if (enEl) enEl.style.display = zh ? 'none' : 'block';
        if (zhEl) zhEl.style.display = zh ? 'block' : 'none';
        // dialog title
        const h2 = dialog.querySelector('.privacy-header h2');
        if (h2) {
          if (dialog.id === 'privacy-dialog') h2.textContent = zh ? '隱私權政策' : 'Privacy Policy';
          if (dialog.id === 'copyright-dialog') h2.textContent = zh ? '版權聲明' : 'Copyright Notice';
        }
      });
    }

    // init on load
    applyLang(isZh);

    // click handler
    const langEl = document.getElementById('lang');
    if (langEl) {
      langEl.querySelector('.lang-en').addEventListener('click', () => applyLang(false));
      langEl.querySelector('.lang-zh').addEventListener('click', () => applyLang(true));
    }
  });

  /* ── Nav CSS ── */
  const style = document.createElement('style');
  style.textContent = `
    #nav{
      position:fixed;top:0;left:0;right:0;z-index:300;
      display:flex;align-items:center;justify-content:space-between;
      padding:0 4%;height:72px;
    }
    #nav.white-nav #logo svg path,
    #nav.white-nav #logo svg rect{fill:white;}
    #nav.white-nav #nav-links a{color:white;}
    #nav.white-nav #lang{color:white;border-color:rgba(255,255,255,0.4);background:rgba(0,0,0,0.2);}
    #nav #logo svg path,#nav #logo svg rect{transition:fill 0.4s;}
    #nav #nav-links a{transition:opacity .2s,color .4s;}
    #nav #lang{transition:color 0.4s,border-color 0.4s,background 0.4s;}
    #logo{display:flex;align-items:center;text-decoration:none;height:20px;}
    #logo svg{height:100%;width:auto;}
    #nav-links{display:flex;align-items:center;gap:clamp(24px,3vw,48px);list-style:none;}
    #nav-links a{
      font-family:'Poppins',sans-serif;font-size:clamp(0.75rem,0.9vw,1rem);
      font-weight:400;color:#0a0a0a;text-decoration:none;opacity:0.55;
      transition:opacity .2s,color .2s;position:relative;
    }
    #nav-links a::after{content:'';position:absolute;bottom:-4px;left:0;width:0;height:1.5px;background:#01FFBC;transition:width .3s ease;}
    #nav-links a:hover{opacity:1;}
    #nav-links a:hover::after{width:100%;}
    #lang{
      font-family:'Poppins',sans-serif;font-size:0.875rem;
      color:#0a0a0a;border:1px solid rgba(0,0,0,0.2);border-radius:100px;
      padding:6px 20px;display:flex;align-items:center;gap:10px;
      background:rgba(250,250,250,0.5);cursor:pointer;
    }
    .lang-en{font-weight:600;opacity:1;}
    .lang-sep{opacity:0.3;}
    .lang-zh{opacity:0.4;font-weight:400;}
    #hamburger{
      display:none;flex-direction:column;justify-content:center;
      gap:5px;width:28px;height:28px;cursor:pointer;
      background:none;border:none;padding:0;z-index:110;flex-shrink:0;
    }
    #hamburger span{display:block;width:100%;height:2px;background:#0a0a0a;border-radius:2px;transition:transform 0.3s ease,opacity 0.3s ease,width 0.3s ease,background 0.3s;}
    #nav.white-nav #hamburger span{background:white;}
    #hamburger.open span:nth-child(1){transform:translateY(7px) rotate(45deg);}
    #hamburger.open span:nth-child(2){width:0;opacity:0;}
    #hamburger.open span:nth-child(3){transform:translateY(-7px) rotate(-45deg);}
    #mobile-menu{
      transform:translateY(-100%);
      transition:transform 0.4s cubic-bezier(0.65,0,0.35,1);
      background:rgba(250,250,250,0.6)!important;
      backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);
      min-height:100vh;
    }
    #mobile-menu.open{transform:translateY(0);}
    .mobile-link{
      font-family:'Poppins',sans-serif;font-size:1.5rem;font-weight:500;
      color:#0a0a0a;text-decoration:none;
      opacity:0;transform:translateY(24px);
      transition:opacity 0.4s ease calc(var(--i)*0.07s + 0.15s),
                 transform 0.4s ease calc(var(--i)*0.07s + 0.15s);
    }
    #mobile-menu.open .mobile-link{opacity:0.8;transform:translateY(0);}

    /* ── Footer ── */
    #footer{
      position:relative;background:#0a0a0a;z-index:20;
    }
    .footer-inner{
      padding:40px 72px;display:flex;flex-direction:column;gap:8px;
      max-width:1534px;margin:0 auto;width:100%;
    }
    .footer-row{display:flex;align-items:center;justify-content:space-between;width:100%;}
    .footer-left-group{display:flex;align-items:center;gap:16px;}
    .footer-sep{color:rgba(255,255,255,0.3);font-size:14px;font-weight:300;}
    .footer-logo-link{display:block;}
    .footer-logo-white{display:block;height:13px;width:auto;}
    .footer-copy{font-family:'Poppins',sans-serif;font-size:13px;font-weight:300;color:rgba(255,255,255,0.7);}
    /* ── shared dialog styles ── */
    #privacy-dialog,
    #copyright-dialog {
      display: none;
    }
    #privacy-dialog[open],
    #copyright-dialog[open] {
      display: block;
      border: none;
      border-radius: 16px;
      padding: 0;
      max-width: 580px;
      width: 90%;
      box-shadow: 0 8px 48px rgba(0,0,0,0.14);
      font-family: 'Poppins', sans-serif;
      margin: auto;
      max-height: 80vh;
      overflow: hidden;
      animation: dialogIn 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
    }
    #privacy-dialog::backdrop,
    #copyright-dialog::backdrop {
      background: rgba(10,10,10,0.45);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
    }
    @keyframes dialogIn {
      from { opacity: 0; transform: scale(0.97) translateY(-8px); }
      to   { opacity: 1; transform: scale(1) translateY(0); }
    }
    @keyframes backdropIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    #privacy-dialog[open]::backdrop,
    #copyright-dialog[open]::backdrop {
      animation: backdropIn 0.3s ease forwards;
    }
    .privacy-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 28px 32px 20px;
      border-bottom: 1px solid rgba(10,10,10,0.08);
      position: sticky;
      top: 0;
      background: white;
      z-index: 1;
    }
    .privacy-header h2 {
      font-size: 1rem;
      font-weight: 600;
      letter-spacing: -0.01em;
      color: #0a0a0a;
    }
    .privacy-close {
      background: none; border: none; cursor: pointer;
      width: 48px; height: 48px;
      position: relative;
      display: flex; align-items: center; justify-content: center;
      padding: 0; outline: none; flex-shrink: 0;
      overflow: hidden; font-size: 0; color: transparent;
      -webkit-tap-highlight-color: transparent;
    }
    .privacy-close::before,
    .privacy-close::after {
      content: '';
      width: 100%; height: 1px;
      background: #0a0a0a;
      position: absolute;
      top: 50%; left: 0;
      transition: transform 0.35s cubic-bezier(0.23, 1, 0.32, 1);
    }
    .privacy-close::before { transform: rotate(-45deg); }
    .privacy-close::after  { transform: rotate(45deg); }
    .privacy-close:hover::before { transform: rotate(-225deg); }
    .privacy-close:hover::after  { transform: rotate(225deg); }
    .privacy-body {
      padding: 24px 32px 32px;
      font-size: 0.88rem;
      font-weight: 300;
      line-height: 1.75;
      color: rgba(10,10,10,0.7);
      overflow-y: auto;
      max-height: calc(80vh - 80px);
    }
    #privacy-dialog h3,
    #copyright-dialog h3 {
      font-size: 0.9rem;
      font-weight: 600;
      color: #0a0a0a;
      margin: 1.5em 0 0.5em;
    }
    #privacy-dialog p,
    #copyright-dialog p,
    #privacy-dialog li,
    #copyright-dialog li {
      margin-bottom: 0.75em;
    }
    #privacy-dialog ul,
    #copyright-dialog ul { padding-left: 20px; margin-bottom: 16px; }
    .privacy-updated {
      font-size: 0.78rem;
      color: rgba(10,10,10,0.35);
      margin-top: 1.5em;
    }
    .footer-socials{display:flex;align-items:center;gap:24px;}
    .footer-socials a{display:flex;align-items:center;justify-content:center;height:26px;transition:opacity .2s;}
    .footer-socials a:hover{opacity:0.6;}
    .footer-socials svg{height:26px;width:auto;display:block;}
    .privacy-link{
      font-family:'Poppins',sans-serif;font-size:12px;font-weight:400;
      color:rgba(255,255,255,0.6);text-decoration:underline;
      text-underline-offset:3px;text-decoration-color:rgba(255,255,255,0.3);
      transition:color 0.2s,text-decoration-color 0.2s;
    }
    .privacy-link:hover{color:#fff;text-decoration-color:#01FFBC;}

    @media(max-width:768px){
      #nav{padding:0 5%;height:56px;}
      #nav-links{display:none;}
      #hamburger{display:flex!important;}
      .footer-inner{padding:24px 5%;}
      .footer-row{flex-direction:column;align-items:flex-start;gap:16px;}
    }
  `;
  document.head.appendChild(style);

})();
