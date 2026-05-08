const REVIEWS_KEY = 'greenroot_reviews';

const galleryImages = [
  { src: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=700&q=80', caption: 'Golden Wheat Fields', category: 'farms' },
  { src: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=700&q=80', caption: 'Harvesting Season', category: 'harvest' },
  { src: 'https://images.unsplash.com/photo-1592210454359-9043f067919b?w=700&q=80', caption: 'Drone Surveillance', category: 'tech' },
  { src: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=700&q=80', caption: 'Irrigation Networks', category: 'irrigation' },
  { src: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=700&q=80', caption: 'Rice Paddy Fields', category: 'farms' },
  { src: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=700&q=80', caption: 'Greenhouse Crops', category: 'farms' },
  { src: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=700&q=80', caption: 'Agri-Tech Research', category: 'tech' },
  { src: 'https://images.unsplash.com/photo-1468581264429-2548ef9eb732?w=700&q=80', caption: 'Tractor at Work', category: 'farms' },
  { src: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=700&q=80', caption: 'Crop Monitoring', category: 'tech' },
  { src: 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=700&q=80', caption: 'Organic Vegetables', category: 'harvest' },
  { src: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=700&q=80', caption: 'Morning Mist Fields', category: 'farms' },
  { src: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=700&q=80', caption: 'Drip Irrigation', category: 'irrigation' },
  { src: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=700&q=80', caption: 'Terraced Farming', category: 'farms' },
  { src: 'https://images.unsplash.com/photo-1598300056393-4aac492f4344?w=700&q=80', caption: 'Fresh Harvest', category: 'harvest' },
  { src: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=700&q=80', caption: 'Sprinkler System', category: 'irrigation' },
  // { src: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=700&q=80', caption: 'Seed Planting', category: 'farms' },
];

function seedDemoReviews() {
  const existing = getReviews();
  if (existing.length === 0) {
    const demos = [
      { id: 'demo1', name: 'Samuel Ochieng', role: 'Maize Farmer, Kenya', rating: 5, text: 'GreenRoot helped us detect fall armyworm early and protect most of our crop.', status: 'approved', date: '2024-03-12' },
      { id: 'demo2', name: 'Priya Rajendran', role: 'Tea Plantation Owner, India', rating: 5, text: 'Their irrigation redesign improved quality and cut water usage dramatically.', status: 'approved', date: '2024-02-28' },
      { id: 'demo3', name: 'Luca Ferreira', role: 'Export Manager, Brazil', rating: 4, text: 'Their export team opened premium buyer relationships quickly and professionally.', status: 'approved', date: '2024-01-15' },
    ];
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(demos));
  }
}

function getReviews() {
  try {
    return JSON.parse(localStorage.getItem(REVIEWS_KEY)) || [];
  } catch {
    return [];
  }
}

function saveReviews(reviews) {
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
}

let selectedStars = 0;

function initStarPicker() {
  const stars = document.querySelectorAll('#stars-pick span');
  if (!stars.length) return;

  stars.forEach((star) => {
    star.addEventListener('mouseenter', () => {
      const val = Number(star.dataset.val);
      stars.forEach((item) => item.classList.toggle('active', Number(item.dataset.val) <= val));
    });

    star.addEventListener('mouseleave', () => {
      stars.forEach((item) => item.classList.toggle('active', Number(item.dataset.val) <= selectedStars));
    });

    star.addEventListener('click', () => {
      selectedStars = Number(star.dataset.val);
      stars.forEach((item) => item.classList.toggle('active', Number(item.dataset.val) <= selectedStars));
    });
  });
}

function submitReview() {
  const nameField = document.getElementById('review-name');
  const roleField = document.getElementById('review-role');
  const textField = document.getElementById('review-text');

  if (!nameField || !roleField || !textField) return;

  const name = nameField.value.trim();
  const role = roleField.value.trim();
  const text = textField.value.trim();

  if (!name) {
    showToast('Please enter your name.');
    return;
  }
  if (!text) {
    showToast('Please write your review.');
    return;
  }
  if (selectedStars === 0) {
    showToast('Please select a star rating.');
    return;
  }

  const review = {
    id: `r_${Date.now()}`,
    name,
    role: role || 'Valued Customer',
    rating: selectedStars,
    text,
    status: 'pending',
    date: new Date().toISOString().split('T')[0],
  };

  const reviews = getReviews();
  reviews.push(review);
  saveReviews(reviews);

  nameField.value = '';
  roleField.value = '';
  textField.value = '';
  selectedStars = 0;
  document.querySelectorAll('#stars-pick span').forEach((star) => star.classList.remove('active'));

  showToast('Review submitted. Awaiting admin approval.');
}

function renderApprovedReviews() {
  const grid = document.getElementById('reviews-grid');
  const noMsg = document.getElementById('no-reviews-msg');
  if (!grid || !noMsg) return;

  const approved = getReviews().filter((review) => review.status === 'approved');
  grid.innerHTML = '';

  if (!approved.length) {
    noMsg.style.display = 'block';
    return;
  }

  noMsg.style.display = 'none';
  approved.forEach((review, index) => {
    const card = document.createElement('div');
    card.className = 'review-card';
    card.style.animationDelay = `${index * 0.08}s`;
    card.innerHTML = `
      <div class="rc-stars">${'&#9733;'.repeat(review.rating)}${'&#9734;'.repeat(5 - review.rating)}</div>
      <p class="rc-text">"${escHtml(review.text)}"</p>
      <div class="rc-author">
        <strong>${escHtml(review.name)}</strong>
        <span>${escHtml(review.role)} - ${review.date}</span>
      </div>
    `;
    grid.appendChild(card);
  });
}

function renderGallery(filter = 'all') {
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;

  grid.innerHTML = '';
  const filtered = filter === 'all' ? galleryImages : galleryImages.filter((img) => img.category === filter);

  filtered.forEach((img, index) => {
    const item = document.createElement('div');
    item.className = 'gallery-item fade-in';
    item.style.animationDelay = `${index * 0.05}s`;
    item.innerHTML = `
      <img src="${img.src}" alt="${escHtml(img.caption)}" loading="lazy">
      <div class="gallery-item-overlay"><span>${escHtml(img.caption)}</span></div>
    `;
    item.addEventListener('click', () => openLightbox(img.src, img.caption));
    grid.appendChild(item);
  });

  setTimeout(() => {
    grid.querySelectorAll('.fade-in').forEach((el) => el.classList.add('visible'));
  }, 50);
}

function openLightbox(src, caption) {
  const lightbox = document.getElementById('lightbox');
  const image = document.getElementById('lb-img');
  const text = document.getElementById('lb-caption');
  if (!lightbox || !image || !text) return;

  image.src = src;
  text.textContent = caption;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return;
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

function initGalleryFilters() {
  const buttons = document.querySelectorAll('.filter-btn');
  if (!buttons.length) return;

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      buttons.forEach((item) => item.classList.remove('active'));
      btn.classList.add('active');
      renderGallery(btn.dataset.filter || 'all');
    });
  });
}

function sendContact() {
  const name = document.getElementById('cf-name')?.value.trim() || '';
  const email = document.getElementById('cf-email')?.value.trim() || '';
  const msg = document.getElementById('cf-message')?.value.trim() || '';
  const form = document.getElementById('contact-form');
  const success = document.getElementById('form-success');

  if (!form || !success) return;
  if (!name) {
    showToast('Please enter your name.');
    return;
  }
  if (!email || !email.includes('@')) {
    showToast('Please enter a valid email.');
    return;
  }
  if (!msg) {
    showToast('Please enter your message.');
    return;
  }

  form.style.display = 'none';
  success.style.display = 'block';
  showToast('Message sent successfully.');
}

let adminLoggedIn = false;
const ADMIN_CREDS = { user: 'admin', pass: 'admin123' };
let currentAdmTab = 'pending';

function adminLogin() {
  const u = document.getElementById('admin-user')?.value.trim() || '';
  const p = document.getElementById('admin-pass')?.value || '';
  const login = document.getElementById('admin-login');
  const panel = document.getElementById('admin-panel');

  if (!login || !panel) return;

  if (u === ADMIN_CREDS.user && p === ADMIN_CREDS.pass) {
    adminLoggedIn = true;
    login.style.display = 'none';
    panel.style.display = 'block';
    renderAdminReviews();
    showToast('Welcome, Admin.');
    return;
  }

  showToast('Invalid credentials. Try admin / admin123');
}

function adminLogout() {
  const login = document.getElementById('admin-login');
  const panel = document.getElementById('admin-panel');
  const user = document.getElementById('admin-user');
  const pass = document.getElementById('admin-pass');

  adminLoggedIn = false;
  if (login) login.style.display = 'flex';
  if (panel) panel.style.display = 'none';
  if (user) user.value = '';
  if (pass) pass.value = '';
  showToast('Logged out.');
}

function switchAdmTab(tab, el) {
  currentAdmTab = tab;
  document.querySelectorAll('.adm-tab').forEach((btn) => btn.classList.remove('active'));
  if (el) el.classList.add('active');
  renderAdminReviews();
}

function renderAdminReviews() {
  const statPending = document.getElementById('stat-pending');
  const statApproved = document.getElementById('stat-approved');
  const statTotal = document.getElementById('stat-total');
  const list = document.getElementById('admin-reviews-list');
  if (!statPending || !statApproved || !statTotal || !list) return;

  const reviews = getReviews();
  const pending = reviews.filter((review) => review.status === 'pending');
  const approved = reviews.filter((review) => review.status === 'approved');
  const toShow = currentAdmTab === 'pending' ? pending : approved;

  statPending.textContent = String(pending.length);
  statApproved.textContent = String(approved.length);
  statTotal.textContent = String(reviews.length);

  if (!toShow.length) {
    list.innerHTML = `<div class="empty-state"><p>No ${currentAdmTab} reviews.</p></div>`;
    return;
  }

  list.innerHTML = toShow.map((review) => `
    <div class="admin-review-item ${review.status}" id="ari-${review.id}">
      <div class="ari-header">
        <div class="ari-info">
          <strong>${escHtml(review.name)}</strong>
          <span>${escHtml(review.role)} - ${review.date}</span>
        </div>
        <div>
          <div class="ari-stars">${'&#9733;'.repeat(review.rating)}${'&#9734;'.repeat(5 - review.rating)}</div>
          <span class="status-badge ${review.status}">${review.status.toUpperCase()}</span>
        </div>
      </div>
      <p class="ari-text">"${escHtml(review.text)}"</p>
      <div class="ari-actions">
        ${review.status === 'pending' ? `<button class="btn-approve" onclick="approveReview('${review.id}')">Approve</button>` : ''}
        <button class="btn-reject" onclick="deleteReview('${review.id}')">Delete</button>
      </div>
    </div>
  `).join('');
}

function approveReview(id) {
  const reviews = getReviews();
  const match = reviews.find((review) => review.id === id);
  if (!match) return;

  match.status = 'approved';
  saveReviews(reviews);
  renderAdminReviews();
  renderApprovedReviews();
  showToast('Review approved and published.');
}

function deleteReview(id) {
  const reviews = getReviews().filter((review) => review.id !== id);
  saveReviews(reviews);
  renderAdminReviews();
  renderApprovedReviews();
  showToast('Review deleted.');
}

function openModal(type) {
  const backdrop = document.getElementById('modal-backdrop');
  const modal = document.getElementById(`modal-${type}`);
  if (!backdrop || !modal) return false;

  backdrop.classList.add('open');
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  return false;
}

function closeModal() {
  document.querySelectorAll('.modal').forEach((modal) => modal.classList.remove('open'));
  document.getElementById('modal-backdrop')?.classList.remove('open');
  document.body.style.overflow = '';
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3200);
}

function triggerFadeIns() {
  const els = document.querySelectorAll('.fade-in:not(.visible)');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach((el) => observer.observe(el));
}

function initNavScroll() {
  const nav = document.getElementById('navbar');
  if (!nav) return;

  const update = () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  };

  update();
  window.addEventListener('scroll', update, { passive: true });
}

function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const links = document.getElementById('nav-links');
  if (!hamburger || !links) return;

  hamburger.addEventListener('click', () => {
    links.classList.toggle('open');
    hamburger.classList.toggle('active', links.classList.contains('open'));
  });

  links.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      hamburger.classList.remove('active');
    });
  });
}

function markActiveNav() {
  const currentPage = document.body.dataset.page;
  document.querySelectorAll('.nav-links a[data-page]').forEach((link) => {
    link.classList.toggle('active', link.dataset.page === currentPage);
  });
}

function hidePreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  const isHomePage = document.body.dataset.page === 'home';
  const delay = isHomePage ? 2200 : 1200;

  window.setTimeout(() => {
    preloader.classList.add('hidden');
    window.setTimeout(() => {
      preloader.remove();
    }, 500);
  }, delay);
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeModal();
    closeLightbox();
  }
});

function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

document.addEventListener('DOMContentLoaded', () => {
  seedDemoReviews();
  initNavScroll();
  initHamburger();
  initStarPicker();
  initGalleryFilters();
  renderApprovedReviews();
  renderGallery('all');
  markActiveNav();
  triggerFadeIns();
  window.addEventListener('scroll', triggerFadeIns, { passive: true });
});

window.addEventListener('load', () => {
  hidePreloader();
});
