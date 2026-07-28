document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  initParentsAccordion();
  initModals();
  initRSVP();
  initGuestbook();
  initFooterActions();
});

/* Toast Notification Utility */
function showToast(message) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast-msg';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

/* Clipboard Copy Utility */
function copyToClipboard(text, successMessage = '복사되었습니다.') {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(successMessage);
    }).catch(() => {
      fallbackCopyText(text, successMessage);
    });
  } else {
    fallbackCopyText(text, successMessage);
  }
}

function fallbackCopyText(text, successMessage) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.opacity = '0';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    showToast(successMessage);
  } catch (err) {
    showToast('복사에 실패했습니다.');
  }
  document.body.removeChild(textArea);
}

/* 1. D-Day Countdown Timer */
function initCountdown() {
  const targetDate = new Date('2026-09-05T15:00:00+09:00').getTime();

  function updateTimer() {
    const now = new Date().getTime();
    const diff = targetDate - now;

    const daysEl = document.getElementById('dday-days');
    const hoursEl = document.getElementById('dday-hours');
    const minutesEl = document.getElementById('dday-minutes');
    const secondsEl = document.getElementById('dday-seconds');

    if (!daysEl) return;

    if (diff <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* 2. Parents Contact Accordion */
function initParentsAccordion() {
  const toggleBtn = document.getElementById('toggle-parents-btn');
  const parentsList = document.getElementById('parents-list');

  if (toggleBtn && parentsList) {
    toggleBtn.addEventListener('click', () => {
      const isActive = parentsList.classList.toggle('active');
      toggleBtn.innerHTML = isActive 
        ? '혼주 정보 닫기 ▲' 
        : '혼주에게 연락하기 ▼';
    });
  }
}

/* 3. Modal Handlers (Account & RSVP) */
function initModals() {
  // Account Modals
  const btnGroomAccount = document.getElementById('btn-groom-account');
  const btnBrideAccount = document.getElementById('btn-bride-account');
  const modalGroomAccount = document.getElementById('modal-groom-account');
  const modalBrideAccount = document.getElementById('modal-bride-account');

  if (btnGroomAccount && modalGroomAccount) {
    btnGroomAccount.addEventListener('click', () => openModal(modalGroomAccount));
  }
  if (btnBrideAccount && modalBrideAccount) {
    btnBrideAccount.addEventListener('click', () => openModal(modalBrideAccount));
  }

  // RSVP Modal
  const btnRsvpOpen = document.getElementById('btn-rsvp-open');
  const modalRsvp = document.getElementById('modal-rsvp');
  if (btnRsvpOpen && modalRsvp) {
    btnRsvpOpen.addEventListener('click', () => openModal(modalRsvp));
  }

  // Close Modals
  document.querySelectorAll('.btn-close-modal, .modal-overlay').forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target === el || el.classList.contains('btn-close-modal')) {
        closeAllModals();
      }
    });
  });

  // Account Copy Buttons
  document.querySelectorAll('.btn-copy-account').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const accountNum = btn.getAttribute('data-account');
      if (accountNum) {
        copyToClipboard(accountNum, '계좌번호가 복사되었습니다.');
      }
    });
  });
}

function openModal(modalEl) {
  if (modalEl) {
    modalEl.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeAllModals() {
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.classList.remove('active');
  });
  document.body.style.overflow = '';
}

/* 4. RSVP Form & Logic */
function initRSVP() {
  const tabBtns = document.querySelectorAll('.rsvp-tab-btn');
  const typeInput = document.getElementById('rsvp-side-type');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const side = btn.getAttribute('data-tab');
      if (typeInput) typeInput.value = side;
    });
  });

  // Meal & Bus option toggle buttons
  setupOptionGroup('.eat-option', 'rsvp-eat-val');
  setupOptionGroup('.bus-option', 'rsvp-bus-val');

  // Submit RSVP Form
  const rsvpForm = document.getElementById('rsvp-form');
  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('rsvp-name').value.trim();
      const count = document.getElementById('rsvp-count').value.trim();
      const agree = document.getElementById('rsvp-agree').checked;

      if (!name) {
        showToast('성함을 입력해 주세요.');
        return;
      }
      if (!count) {
        showToast('참석 인원을 입력해 주세요.');
        return;
      }
      if (!agree) {
        showToast('개인정보 수집 및 이용에 동의해 주세요.');
        return;
      }

      showToast('참석 의사가 성공적으로 전달되었습니다.');
      closeAllModals();
      rsvpForm.reset();
    });
  }
}

function setupOptionGroup(selector, hiddenInputId) {
  const btns = document.querySelectorAll(selector);
  const hiddenInput = document.getElementById(hiddenInputId);
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (hiddenInput) {
        hiddenInput.value = btn.getAttribute('data-value');
      }
    });
  });
}

/* 5. Guestbook Logic with LocalStorage */
function initGuestbook() {
  const STORAGE_KEY = 'wedding_guestbook_messages';
  const initialMessages = [
    {
      id: 1,
      name: '김지현',
      date: '2026.07.25',
      message: '민제야, 운슬아 결실을 맺게 된 걸 축하해! 늘 서로 사랑하며 행복하길 바란다 ❤️',
      password: '123'
    },
    {
      id: 2,
      name: '이동현',
      date: '2026.07.26',
      message: '세상에서 가장 아름다운 유쾌한 커플! 결혼식 날 뵙겠습니다~ 축하해요!',
      password: '123'
    }
  ];

  let messages = JSON.parse(localStorage.getItem(STORAGE_KEY));
  if (!messages || !Array.isArray(messages)) {
    messages = initialMessages;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }

  function renderMessages() {
    const listEl = document.getElementById('guestbook-list');
    if (!listEl) return;
    listEl.innerHTML = '';

    messages.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'guestbook-item';
      card.innerHTML = `
        <div class="guestbook-header">
          <span class="guestbook-author">${escapeHtml(item.name)}</span>
          <div>
            <span class="guestbook-date">${item.date}</span>
            <button class="btn-del-msg" data-index="${index}">삭제</button>
          </div>
        </div>
        <div class="guestbook-msg">${escapeHtml(item.message)}</div>
      `;
      listEl.appendChild(card);
    });

    // Delete Event Binding
    document.querySelectorAll('.btn-del-msg').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.target.getAttribute('data-index'), 10);
        const inputPw = prompt('비밀번호를 입력해 주세요:');
        if (inputPw === null) return;

        if (inputPw === messages[idx].password) {
          messages.splice(idx, 1);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
          renderMessages();
          showToast('메시지가 삭제되었습니다.');
        } else {
          showToast('비밀번호가 일치하지 않습니다.');
        }
      });
    });
  }

  renderMessages();

  // Add Message Form Submit
  const gbForm = document.getElementById('guestbook-form');
  if (gbForm) {
    gbForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('gb-name').value.trim();
      const password = document.getElementById('gb-password').value.trim();
      const message = document.getElementById('gb-message').value.trim();

      if (!name || !password || !message) {
        showToast('이름, 비밀번호, 메시지를 모두 입력해 주세요.');
        return;
      }

      const today = new Date();
      const dateStr = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;

      const newMsg = {
        id: Date.now(),
        name: name,
        date: dateStr,
        message: message,
        password: password
      };

      messages.unshift(newMsg);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      renderMessages();
      gbForm.reset();
      showToast('축하 메시지가 등록되었습니다.');
    });
  }
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* 6. Footer Sharing & Calendar Actions */
function initFooterActions() {
  const btnCopyLink = document.getElementById('btn-copy-link');
  if (btnCopyLink) {
    btnCopyLink.addEventListener('click', (e) => {
      e.preventDefault();
      copyToClipboard(window.location.href, '청첩장 주소가 복사되었습니다.');
    });
  }

  const btnAddCalendar = document.getElementById('btn-add-calendar');
  if (btnAddCalendar) {
    btnAddCalendar.addEventListener('click', (e) => {
      e.preventDefault();
      const title = encodeURIComponent('박민제 ♥ 채운슬 결혼식');
      const details = encodeURIComponent('더링크호텔 5층 가든홀\n2026년 9월 5일 토요일 오후 3시');
      const location = encodeURIComponent('서울 구로구 경인로 610 더링크호텔');
      const startDate = '20260905T150000';
      const endDate = '20260905T170000';
      const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startDate}/${endDate}&details=${details}&location=${location}`;
      window.open(googleCalUrl, '_blank');
    });
  }
}
