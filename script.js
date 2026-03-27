/* ===== AHSIS Landing Page - JavaScript ===== */

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initMobileMenu();
    initRevealAnimations();
    initCounters();
    initSkillTabs();
    initTestimonials();
    initTimeline();
    initContactForm();
    initMap();
    initModalSystem();
    initAllPopupButtons();
});

/* ===== NAVBAR SCROLL ===== */
function initNavbar() {
    const nav = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 40);
    });
}

/* ===== MOBILE MENU ===== */
function initMobileMenu() {
    const toggle = document.getElementById('nav-toggle');
    const menu = document.getElementById('mobile-menu');
    const links = menu.querySelectorAll('a');

    toggle.addEventListener('click', () => {
        const isOpen = menu.classList.toggle('open');
        toggle.innerHTML = isOpen
            ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'
            : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
    });

    links.forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('open');
            toggle.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
        });
    });
}

/* ===== SCROLL REVEAL ===== */
function initRevealAnimations() {
    const revealElements = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.05, rootMargin: '50px 0px -20px 0px' });

    revealElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight + 100 && rect.bottom > -100) {
            setTimeout(() => el.classList.add('visible'), 50);
        }
        observer.observe(el);
    });
}

/* ===== ANIMATED COUNTERS ===== */
function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                entry.target.dataset.animated = 'true';
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.3 });

    counters.forEach(el => observer.observe(el));
}

function animateCounter(el) {
    const target = parseInt(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    let start = null;

    function step(timestamp) {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

/* ===== SKILL TABS ===== */
function initSkillTabs() {
    const tabs = document.querySelectorAll('.skill-tab');
    const panels = document.querySelectorAll('.course-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.tab;
            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(`courses-${target}`).classList.add('active');
        });
    });
}

/* ===== TESTIMONIALS ===== */
function initTestimonials() {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.testimonial-dot');
    const prevBtn = document.getElementById('test-prev');
    const nextBtn = document.getElementById('test-next');
    let current = 0;

    function showSlide(index) {
        slides.forEach(s => s.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        current = index;
    }

    prevBtn.addEventListener('click', () => showSlide((current - 1 + slides.length) % slides.length));
    nextBtn.addEventListener('click', () => showSlide((current + 1) % slides.length));
    dots.forEach((dot, i) => dot.addEventListener('click', () => showSlide(i)));

    setInterval(() => showSlide((current + 1) % slides.length), 6000);
}

/* ===== TIMELINE ===== */
function initTimeline() {
    const progress = document.querySelector('.timeline-progress');
    if (!progress) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                progress.classList.add('animate');
            }
        });
    }, { threshold: 0.2 });

    observer.observe(progress.parentElement);
}

/* ===== CONTACT FORM ===== */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const msgEl = document.getElementById('form-msg');
    const submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg> Sending...';
        msgEl.textContent = '';
        msgEl.className = 'form-msg';

        const data = {
            name: form.name.value,
            email: form.email.value,
            phone: form.phone.value,
            message: form.message.value,
        };

        try {
            const API_URL = window.location.origin;
            const res = await fetch(`${API_URL}/api/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                msgEl.textContent = 'Message sent successfully!';
                msgEl.className = 'form-msg success';
                form.reset();
            } else {
                throw new Error('Failed');
            }
        } catch (err) {
            msgEl.textContent = 'Failed to send message. Please try again.';
            msgEl.className = 'form-msg error';
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Send Message';
        }
    });
}

/* ===== LEAFLET MAP ===== */
function initMap() {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;

    const map = L.map('map', {
        center: [28.6, 77.2],
        zoom: 5,
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: false,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
    }).addTo(map);

    function createIcon(color) {
        return L.divIcon({
            className: '',
            html: '<div style="width:16px;height:16px;border-radius:50%;background:' + color + ';box-shadow:0 0 12px ' + color + '60;border:3px solid white"></div>',
            iconSize: [16, 16],
            iconAnchor: [8, 8],
        });
    }

    L.marker([33.7311, 75.1487], { icon: createIcon('#0066FF') })
        .addTo(map)
        .bindPopup('<div style="font-family:Outfit,sans-serif;color:#1a1a2e;padding:4px"><strong>AHSIS HQ</strong><br>NH-44, Anantnag<br>Jammu & Kashmir</div>');

    L.marker([22.5726, 88.3639], { icon: createIcon('#FF5500') })
        .addTo(map)
        .bindPopup('<div style="font-family:Outfit,sans-serif;color:#1a1a2e;padding:4px"><strong>AHSIS Kolkata</strong><br>Kolkata - 700089<br>West Bengal</div>');

    L.control.zoom({ position: 'bottomright' }).addTo(map);
}

/* ========================================
   MODAL/POPUP SYSTEM
   ======================================== */

let modalContainer = null;

function initModalSystem() {
    // Create modal container
    modalContainer = document.createElement('div');
    modalContainer.id = 'modal-container';
    modalContainer.className = 'modal-overlay';
    modalContainer.innerHTML = `
    <div class="modal-backdrop"></div>
    <div class="modal-wrapper">
      <div class="modal-content">
        <button class="modal-close" aria-label="Close modal">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
        <div class="modal-body"></div>
      </div>
    </div>
  `;
    document.body.appendChild(modalContainer);

    // Close handlers
    const closeBtn = modalContainer.querySelector('.modal-close');
    const backdrop = modalContainer.querySelector('.modal-backdrop');

    closeBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalContainer.classList.contains('active')) {
            closeModal();
        }
    });
}

function openModal(content, size = 'medium') {
    const modalBody = modalContainer.querySelector('.modal-body');
    const modalContent = modalContainer.querySelector('.modal-content');

    modalBody.innerHTML = content;
    modalContent.className = `modal-content modal-${size}`;
    modalContainer.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Focus trap
    setTimeout(() => {
        const firstFocusable = modalBody.querySelector('button, a, input, textarea');
        if (firstFocusable) firstFocusable.focus();
    }, 100);
}

function closeModal() {
    modalContainer.classList.remove('active');
    document.body.style.overflow = '';
}

/* ========================================
   POPUP DATA - All Content
   ======================================== */

const POPUP_DATA = {
    // ABOUT SECTION
    about: {
        title: 'About AHSIS',
        content: `
      <div class="popup-header">
        <div class="popup-icon" style="background:rgba(0,102,255,0.08)">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0066FF" stroke-width="2">
            <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/>
          </svg>
        </div>
        <h2>Alpine Hub for Sustainable Innovation and Skills Pvt. Ltd.</h2>
        <p class="popup-subtitle">DPIIT Recognized Startup | Transforming Rural India</p>
      </div>
      
      <div class="popup-section">
        <h3>Who We Are</h3>
        <p>Founded in 2025, AHSIS is a pioneering DPIIT-recognized startup dedicated to bridging the gap between innovation, sustainability, and community development. We harness the power of geospatial intelligence, Earth observation technologies, and data-driven innovation to address complex challenges in natural resource management, climate resilience, Agrotech, and rural development.</p>
      </div>

      <div class="popup-section">
        <h3>Our Vision</h3>
        <p>To be a global leader in technology and geospatial innovation, recognized for quality, innovation, and impact. We transform businesses and communities through cutting-edge, technology-enabled solutions that support the UN Sustainable Development Goals.</p>
      </div>

      <div class="popup-section">
        <h3>Our Mission</h3>
        <p>To empower businesses and communities by delivering innovative technology and geospatial solutions that drive growth, resilience, and sustainability. We provide high-quality skill development programs tailored to the unique needs of each partner, focusing on practical, hands-on learning experiences.</p>
      </div>

      <div class="popup-grid-2">
        <div class="popup-card">
          <h4>Government Registrations</h4>
          <ul class="popup-list">
            <li><strong>MCA Registered:</strong> U74999JK2025PTC018886</li>
            <li><strong>MSME Certified:</strong> UDYAM-JK-01-0007215</li>
            <li><strong>Startup India:</strong> DIPP178650</li>
            <li><strong>GST:</strong> 01AARCA4815J1ZN</li>
          </ul>
        </div>
        <div class="popup-card">
          <h4>Core Values</h4>
          <ul class="popup-list">
            <li><strong>Innovation:</strong> Pushing boundaries with cutting-edge tech</li>
            <li><strong>Sustainability:</strong> Building for future generations</li>
            <li><strong>Community:</strong> Empowering rural transformation</li>
            <li><strong>Excellence:</strong> Delivering quality in everything</li>
          </ul>
        </div>
      </div>

      <div class="popup-cta-section">
        <a href="#contact" class="popup-btn-primary" onclick="closeModal()">Partner With Us</a>
        <a href="#team" class="popup-btn-outline" onclick="closeModal()">Meet Our Team</a>
      </div>
    `
    },

    // PROGRAMS DATA
    programs: {
        'gis-remote-sensing': {
            title: 'Advanced GIS & Remote Sensing',
            duration: '6 Months',
            content: `
        <div class="popup-header">
          <div class="popup-icon" style="background:rgba(0,102,255,0.08)">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0066FF" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
          </div>
          <span class="popup-badge">6 Months Program</span>
          <h2>Advanced GIS & Remote Sensing</h2>
          <p class="popup-subtitle">Master geospatial analysis with industry-standard tools</p>
        </div>

        <div class="popup-section">
          <h3>Course Overview</h3>
          <p>This comprehensive 6-month program covers advanced Geographic Information Systems (GIS) and Remote Sensing technologies. Learn to analyze satellite imagery, create detailed maps, and develop spatial solutions for real-world challenges in agriculture, environment, and urban planning.</p>
        </div>

        <div class="popup-section">
          <h3>What You'll Learn</h3>
          <div class="popup-grid-2">
            <div class="popup-card">
              <h4>Core Skills</h4>
              <ul class="popup-list">
                <li>ArcGIS Pro & QGIS mastery</li>
                <li>Satellite image processing</li>
                <li>Spatial data analysis</li>
                <li>Map design & cartography</li>
                <li>Geodatabase management</li>
              </ul>
            </div>
            <div class="popup-card">
              <h4>Advanced Topics</h4>
              <ul class="popup-list">
                <li>LiDAR data processing</li>
                <li>Multispectral analysis</li>
                <li>Change detection</li>
                <li>Web GIS development</li>
                <li>Python for GIS automation</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="popup-section">
          <h3>Course Structure</h3>
          <div class="popup-timeline">
            <div class="popup-timeline-item"><span>Month 1-2</span> GIS Fundamentals & ArcGIS/QGIS</div>
            <div class="popup-timeline-item"><span>Month 3</span> Remote Sensing Principles</div>
            <div class="popup-timeline-item"><span>Month 4</span> Image Processing & Analysis</div>
            <div class="popup-timeline-item"><span>Month 5</span> Spatial Modeling & Python</div>
            <div class="popup-timeline-item"><span>Month 6</span> Capstone Project & Certification</div>
          </div>
        </div>

        <div class="popup-section">
          <h3>Career Opportunities</h3>
          <p>GIS Analyst, Remote Sensing Specialist, Spatial Data Scientist, Environmental Consultant, Urban Planner, Cartographer</p>
        </div>

        <div class="popup-cta-section">
          <a href="#contact" class="popup-btn-primary" onclick="closeModal()">Enroll Now</a>
          <span class="popup-price">Course Fee: Contact for details</span>
        </div>
      `
        },
        'ai-ml-agriculture': {
            title: 'AI & Machine Learning for Agriculture',
            duration: '6 Months',
            content: `
        <div class="popup-header">
          <div class="popup-icon" style="background:rgba(0,85,221,0.08)">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0055DD" stroke-width="2">
              <rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/>
            </svg>
          </div>
          <span class="popup-badge">6 Months Program</span>
          <h2>AI & Machine Learning for Agriculture</h2>
          <p class="popup-subtitle">Transform farming with intelligent technology</p>
        </div>

        <div class="popup-section">
          <h3>Course Overview</h3>
          <p>Learn to apply Artificial Intelligence and Machine Learning techniques to solve agricultural challenges. From crop health monitoring using satellite imagery to yield prediction models, this course equips you with cutting-edge skills for smart farming.</p>
        </div>

        <div class="popup-section">
          <h3>Key Topics</h3>
          <div class="popup-grid-2">
            <div class="popup-card">
              <h4>AI/ML Foundations</h4>
              <ul class="popup-list">
                <li>Python for data science</li>
                <li>Machine learning algorithms</li>
                <li>Deep learning & neural networks</li>
                <li>Computer vision basics</li>
              </ul>
            </div>
            <div class="popup-card">
              <h4>Agriculture Applications</h4>
              <ul class="popup-list">
                <li>Crop disease detection</li>
                <li>Yield prediction models</li>
                <li>Precision agriculture</li>
                <li>Drone image analysis</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="popup-section">
          <h3>Tools & Technologies</h3>
          <p>Python, TensorFlow, PyTorch, Google Earth Engine, OpenCV, Scikit-learn, Pandas, NumPy</p>
        </div>

        <div class="popup-cta-section">
          <a href="#contact" class="popup-btn-primary" onclick="closeModal()">Enroll Now</a>
          <span class="popup-price">Course Fee: Contact for details</span>
        </div>
      `
        },
        'webgis-development': {
            title: 'Full Stack Web GIS Development',
            duration: '6 Months',
            content: `
        <div class="popup-header">
          <div class="popup-icon" style="background:rgba(255,85,0,0.08)">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FF5500" stroke-width="2">
              <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m6.08 9.5-3.5 1.6a1 1 0 0 0 0 1.81l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9a1 1 0 0 0 0-1.83l-3.5-1.59"/>
            </svg>
          </div>
          <span class="popup-badge">6 Months Program</span>
          <h2>Full Stack Web GIS Development</h2>
          <p class="popup-subtitle">Build interactive geospatial web applications</p>
        </div>

        <div class="popup-section">
          <h3>Course Overview</h3>
          <p>Master the art of building interactive web-based GIS applications. Learn frontend mapping libraries, backend geospatial databases, and cloud deployment to create professional spatial web applications.</p>
        </div>

        <div class="popup-section">
          <h3>Technology Stack</h3>
          <div class="popup-grid-2">
            <div class="popup-card">
              <h4>Frontend</h4>
              <ul class="popup-list">
                <li>Leaflet.js & OpenLayers</li>
                <li>Mapbox GL JS</li>
                <li>React/Vue for maps</li>
                <li>D3.js visualization</li>
              </ul>
            </div>
            <div class="popup-card">
              <h4>Backend & Database</h4>
              <ul class="popup-list">
                <li>PostGIS spatial database</li>
                <li>GeoServer</li>
                <li>Node.js/Python APIs</li>
                <li>Cloud deployment</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="popup-cta-section">
          <a href="#contact" class="popup-btn-primary" onclick="closeModal()">Enroll Now</a>
          <span class="popup-price">Course Fee: Contact for details</span>
        </div>
      `
        },
        'drone-mapping': {
            title: 'Drone Technology & Mapping',
            duration: '3 Months',
            content: `
        <div class="popup-header">
          <div class="popup-icon" style="background:rgba(0,102,255,0.08)">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0066FF" stroke-width="2">
              <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
          </div>
          <span class="popup-badge">3 Months Program</span>
          <h2>Drone Technology & Mapping</h2>
          <p class="popup-subtitle">UAV operations, aerial surveying & photogrammetry</p>
        </div>

        <div class="popup-section">
          <h3>Course Overview</h3>
          <p>Learn professional drone operations for mapping, surveying, and data collection. Master photogrammetry techniques to create high-resolution orthomosaics, 3D terrain models, and precision agriculture applications.</p>
        </div>

        <div class="popup-section">
          <h3>Key Skills</h3>
          <ul class="popup-list">
            <li>Drone flight operations & safety</li>
            <li>Mission planning & execution</li>
            <li>Photogrammetry processing</li>
            <li>3D modeling & terrain analysis</li>
            <li>Agricultural drone applications</li>
            <li>Regulatory compliance</li>
          </ul>
        </div>

        <div class="popup-cta-section">
          <a href="#contact" class="popup-btn-primary" onclick="closeModal()">Enroll Now</a>
        </div>
      `
        },
        'iot-agriculture': {
            title: 'IoT for Smart Agriculture',
            duration: '3 Months',
            content: `
        <div class="popup-header">
          <div class="popup-icon" style="background:rgba(0,85,221,0.08)">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0055DD" stroke-width="2">
              <path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16"/>
            </svg>
          </div>
          <span class="popup-badge">3 Months Program</span>
          <h2>IoT for Smart Agriculture</h2>
          <p class="popup-subtitle">Build connected farming solutions</p>
        </div>

        <div class="popup-section">
          <h3>Course Overview</h3>
          <p>Design and implement IoT solutions for smart farming. Learn to deploy sensor networks, build automated irrigation systems, and create real-time monitoring dashboards for precision agriculture.</p>
        </div>

        <div class="popup-section">
          <h3>Topics Covered</h3>
          <ul class="popup-list">
            <li>IoT fundamentals & architecture</li>
            <li>Soil & weather sensors</li>
            <li>Arduino & Raspberry Pi</li>
            <li>Automated irrigation systems</li>
            <li>Data logging & cloud platforms</li>
            <li>Dashboard development</li>
          </ul>
        </div>

        <div class="popup-cta-section">
          <a href="#contact" class="popup-btn-primary" onclick="closeModal()">Enroll Now</a>
        </div>
      `
        },
        'climate-analytics': {
            title: 'Climate Data Analytics',
            duration: '3 Months',
            content: `
        <div class="popup-header">
          <div class="popup-icon" style="background:rgba(255,85,0,0.08)">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FF5500" stroke-width="2">
              <path d="M2 12a5 5 0 0 0 5 5 8 8 0 0 1 5 2 8 8 0 0 1 5-2 5 5 0 0 0 5-5V7h-5a8 8 0 0 0-5 2 8 8 0 0 0-5-2H2Z"/>
            </svg>
          </div>
          <span class="popup-badge">3 Months Program</span>
          <h2>Climate Data Analytics</h2>
          <p class="popup-subtitle">Analyze weather patterns & climate trends</p>
        </div>

        <div class="popup-section">
          <h3>Course Overview</h3>
          <p>Master climate data analysis techniques for agricultural applications. Learn to process weather data, create climate models, and develop agrometeorology advisory services.</p>
        </div>

        <div class="popup-section">
          <h3>Key Topics</h3>
          <ul class="popup-list">
            <li>Climate data sources & APIs</li>
            <li>Statistical analysis methods</li>
            <li>Weather pattern recognition</li>
            <li>Agricultural weather advisories</li>
            <li>Climate change impact assessment</li>
          </ul>
        </div>

        <div class="popup-cta-section">
          <a href="#contact" class="popup-btn-primary" onclick="closeModal()">Enroll Now</a>
        </div>
      `
        },
        'python-geospatial': {
            title: 'Python for Geospatial Analysis',
            duration: '2 Months',
            content: `
        <div class="popup-header">
          <div class="popup-icon" style="background:rgba(255,85,0,0.08)">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FF5500" stroke-width="2">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
            </svg>
          </div>
          <span class="popup-badge">2 Months Program</span>
          <h2>Python for Geospatial Analysis</h2>
          <p class="popup-subtitle">Automate GIS workflows with Python</p>
        </div>

        <div class="popup-section">
          <h3>Course Overview</h3>
          <p>Learn to automate geospatial workflows using Python. Master essential libraries like GeoPandas, Rasterio, and Shapely for efficient spatial data processing and analysis.</p>
        </div>

        <div class="popup-section">
          <h3>Libraries Covered</h3>
          <ul class="popup-list">
            <li>GeoPandas & Shapely</li>
            <li>Rasterio & GDAL</li>
            <li>Folium for web maps</li>
            <li>Google Earth Engine Python API</li>
            <li>Automating ArcGIS/QGIS</li>
          </ul>
        </div>

        <div class="popup-cta-section">
          <a href="#contact" class="popup-btn-primary" onclick="closeModal()">Enroll Now</a>
        </div>
      `
        },
        'intro-gis': {
            title: 'Introduction to GIS',
            duration: '1 Month',
            content: `
        <div class="popup-header">
          <div class="popup-icon" style="background:rgba(0,102,255,0.08)">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0066FF" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
          </div>
          <span class="popup-badge">1 Month Program</span>
          <h2>Introduction to GIS</h2>
          <p class="popup-subtitle">Start your geospatial journey</p>
        </div>

        <div class="popup-section">
          <h3>Course Overview</h3>
          <p>Perfect for beginners! Learn the fundamentals of Geographic Information Systems including spatial concepts, map creation, and basic analysis techniques using industry-standard tools.</p>
        </div>

        <div class="popup-section">
          <h3>What You'll Learn</h3>
          <ul class="popup-list">
            <li>GIS concepts & terminology</li>
            <li>Coordinate systems & projections</li>
            <li>Working with vector & raster data</li>
            <li>Basic map creation</li>
            <li>Simple spatial analysis</li>
            <li>QGIS fundamentals</li>
          </ul>
        </div>

        <div class="popup-cta-section">
          <a href="#contact" class="popup-btn-primary" onclick="closeModal()">Enroll Now</a>
        </div>
      `
        },
        'data-visualization': {
            title: 'Data Visualization & Dashboards',
            duration: '1 Month',
            content: `
        <div class="popup-header">
          <div class="popup-icon" style="background:rgba(255,85,0,0.08)">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FF5500" stroke-width="2">
              <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
            </svg>
          </div>
          <span class="popup-badge">1 Month Program</span>
          <h2>Data Visualization & Dashboards</h2>
          <p class="popup-subtitle">Create compelling data stories</p>
        </div>

        <div class="popup-section">
          <h3>Course Overview</h3>
          <p>Learn to create stunning interactive dashboards and visualizations that communicate data insights effectively. Master tools used by professionals in agriculture and environmental sectors.</p>
        </div>

        <div class="popup-section">
          <h3>Tools & Topics</h3>
          <ul class="popup-list">
            <li>Power BI & Tableau basics</li>
            <li>Chart design principles</li>
            <li>Interactive dashboards</li>
            <li>Storytelling with data</li>
            <li>Real-time data visualization</li>
          </ul>
        </div>

        <div class="popup-cta-section">
          <a href="#contact" class="popup-btn-primary" onclick="closeModal()">Enroll Now</a>
        </div>
      `
        }
    },

    // PROJECTS DATA
    projects: {
        'ndvi-analysis': {
            title: 'NDVI Analysis',
            content: `
        <div class="popup-header">
          <div class="popup-icon" style="background:rgba(0,102,255,0.08)">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0066FF" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <h2>NDVI Analysis Project</h2>
          <p class="popup-subtitle">Vegetation Health Assessment</p>
        </div>

        <div class="popup-section">
          <h3>Project Overview</h3>
          <p>Normalized Difference Vegetation Index (NDVI) mapping for comprehensive crop health assessment across agricultural regions. This project uses satellite imagery to monitor vegetation vigor and identify areas requiring attention.</p>
        </div>

        <div class="popup-section">
          <h3>What We Did</h3>
          <ul class="popup-list">
            <li>Processed Sentinel-2 satellite imagery</li>
            <li>Calculated NDVI values for 50,000+ hectares</li>
            <li>Created time-series analysis for crop growth monitoring</li>
            <li>Identified stressed vegetation zones</li>
            <li>Generated actionable reports for farmers</li>
          </ul>
        </div>

        <div class="popup-section">
          <h3>Technologies Used</h3>
          <p>Google Earth Engine, Python, QGIS, Sentinel-2 Data, GeoPandas</p>
        </div>

        <div class="popup-gallery">
          <img src="https://static.prod-images.emergentagent.com/jobs/8f832d45-494b-4c2c-927a-60ef2ac268e0/images/afbd544eed1eea08e28fde16189e5bb5961debd1c9c359399ee36066bfa389a5.png" alt="NDVI Map">
        </div>

        <div class="popup-section">
          <h3>Impact</h3>
          <p>Helped 200+ farmers optimize irrigation and fertilizer application, resulting in 15% average yield improvement.</p>
        </div>
      `
        },
        'evi-mapping': {
            title: 'EVI Mapping',
            content: `
        <div class="popup-header">
          <div class="popup-icon" style="background:rgba(0,85,221,0.08)">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0055DD" stroke-width="2">
              <path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>
            </svg>
          </div>
          <h2>Enhanced Vegetation Index Mapping</h2>
          <p class="popup-subtitle">Advanced Biomass Estimation</p>
        </div>

        <div class="popup-section">
          <h3>Project Overview</h3>
          <p>Enhanced Vegetation Index (EVI) analysis provides improved biomass estimation and better captures canopy structural variations compared to traditional NDVI. Ideal for dense vegetation areas.</p>
        </div>

        <div class="popup-section">
          <h3>Key Features</h3>
          <ul class="popup-list">
            <li>Atmospheric correction applied</li>
            <li>Reduced soil background influence</li>
            <li>Better sensitivity in high biomass areas</li>
            <li>Seasonal vegetation monitoring</li>
          </ul>
        </div>

        <div class="popup-section">
          <h3>Applications</h3>
          <p>Forest monitoring, crop biomass estimation, carbon stock assessment, agricultural planning</p>
        </div>
      `
        },
        'lulc-classification': {
            title: 'LULC Classification',
            content: `
        <div class="popup-header">
          <div class="popup-icon" style="background:rgba(255,85,0,0.08)">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FF5500" stroke-width="2">
              <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/>
            </svg>
          </div>
          <h2>Land Use / Land Cover Classification</h2>
          <p class="popup-subtitle">ML-Powered Land Mapping</p>
        </div>

        <div class="popup-section">
          <h3>Project Overview</h3>
          <p>Automated land use and land cover classification using machine learning algorithms on high-resolution satellite imagery. Tracks changes over time for urban planning and environmental monitoring.</p>
        </div>

        <div class="popup-section">
          <h3>Classification Categories</h3>
          <ul class="popup-list">
            <li>Agricultural land (crops, orchards)</li>
            <li>Forest & vegetation</li>
            <li>Water bodies</li>
            <li>Built-up areas</li>
            <li>Barren land</li>
            <li>Wetlands</li>
          </ul>
        </div>

        <div class="popup-section">
          <h3>Accuracy</h3>
          <p>Overall classification accuracy: 92% using Random Forest & Support Vector Machine algorithms</p>
        </div>
      `
        },
        'satellite-drone': {
            title: 'Satellite & Drone Imagery',
            content: `
        <div class="popup-header">
          <div class="popup-icon" style="background:rgba(0,102,255,0.08)">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0066FF" stroke-width="2">
              <path d="M2 12a5 5 0 0 0 5 5 8 8 0 0 1 5 2 8 8 0 0 1 5-2 5 5 0 0 0 5-5V7h-5a8 8 0 0 0-5 2 8 8 0 0 0-5-2H2Z"/>
            </svg>
          </div>
          <h2>Satellite & Drone Imagery Analysis</h2>
          <p class="popup-subtitle">Multi-Resolution Data Fusion</p>
        </div>

        <div class="popup-section">
          <h3>Project Overview</h3>
          <p>Combining satellite and UAV imagery for comprehensive agricultural monitoring. High-resolution drone data complements satellite observations for precision farming applications.</p>
        </div>

        <div class="popup-section">
          <h3>Data Sources</h3>
          <ul class="popup-list">
            <li>Sentinel-2 (10m resolution)</li>
            <li>Landsat-8/9 (30m resolution)</li>
            <li>DJI Phantom 4 RTK (2cm resolution)</li>
            <li>Multispectral drone sensors</li>
          </ul>
        </div>

        <div class="popup-gallery">
          <img src="https://images.pexels.com/photos/586056/pexels-photo-586056.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" alt="Drone imagery">
        </div>
      `
        },
        'webgis-apps': {
            title: 'Web GIS Applications',
            content: `
        <div class="popup-header">
          <div class="popup-icon" style="background:rgba(0,85,221,0.08)">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0055DD" stroke-width="2">
              <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>
            </svg>
          </div>
          <h2>Interactive Web GIS Platforms</h2>
          <p class="popup-subtitle">Real-Time Spatial Decision Support</p>
        </div>

        <div class="popup-section">
          <h3>Project Overview</h3>
          <p>Custom web-based GIS applications for real-time spatial data visualization and decision support. Built with modern frameworks for seamless user experience.</p>
        </div>

        <div class="popup-section">
          <h3>Features</h3>
          <ul class="popup-list">
            <li>Interactive map layers</li>
            <li>Real-time data updates</li>
            <li>Spatial querying tools</li>
            <li>Custom dashboards</li>
            <li>Mobile-responsive design</li>
            <li>API integrations</li>
          </ul>
        </div>
      `
        },
        'ai-ml-showcase': {
            title: 'AI/ML Model Showcase',
            content: `
        <div class="popup-header">
          <div class="popup-icon" style="background:rgba(255,85,0,0.08)">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FF5500" stroke-width="2">
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>
            </svg>
          </div>
          <h2>AI/ML Model Showcase</h2>
          <p class="popup-subtitle">Intelligent Agricultural Solutions</p>
        </div>

        <div class="popup-section">
          <h3>Our AI Models</h3>
          <div class="popup-grid-2">
            <div class="popup-card">
              <h4>Crop Prediction</h4>
              <p>Yield estimation with 89% accuracy using weather and soil data</p>
            </div>
            <div class="popup-card">
              <h4>Pest Detection</h4>
              <p>Early pest identification from drone/mobile images</p>
            </div>
            <div class="popup-card">
              <h4>Disease Classification</h4>
              <p>Identify crop diseases from leaf images</p>
            </div>
            <div class="popup-card">
              <h4>Climate Impact</h4>
              <p>Predict climate effects on crop patterns</p>
            </div>
          </div>
        </div>

        <div class="popup-gallery">
          <img src="https://static.prod-images.emergentagent.com/jobs/8f832d45-494b-4c2c-927a-60ef2ac268e0/images/f1bb89c99fc3ece40ee09c2f902087084fb82193b0b3045665f79739498528f6.png" alt="AI Analysis">
        </div>
      `
        }
    },

    // BLOGS DATA
    blogs: {
        'renewable-energy-training': {
            title: 'AHSIS Launches Skill Training Initiative in Renewable Energy',
            date: 'December 2025',
            category: 'Skill Training',
            content: `
        <div class="popup-header">
          <span class="popup-badge" style="background:rgba(0,102,255,0.08);color:#0066FF">Skill Training</span>
          <h2>AHSIS Launches Skill Training Initiative in Renewable Energy</h2>
          <p class="popup-meta">Published: December 2025 | 5 min read</p>
        </div>

        <div class="popup-section">
          <p class="popup-lead">Empowering rural communities with practical skills in solar energy, biogas systems, and sustainable energy solutions.</p>
        </div>

        <div class="popup-section">
          <h3>The Initiative</h3>
          <p>AHSIS has launched a comprehensive skill training program focused on renewable energy technologies. This initiative aims to equip rural youth and farmers with the knowledge and practical skills needed to install, maintain, and benefit from clean energy solutions.</p>
        </div>

        <div class="popup-section">
          <h3>Program Highlights</h3>
          <ul class="popup-list">
            <li><strong>Solar Energy:</strong> Installation and maintenance of solar panels, solar pumping systems</li>
            <li><strong>Biogas Systems:</strong> Design and operation of household and community biogas plants</li>
            <li><strong>Energy Efficiency:</strong> Best practices for reducing energy consumption in agriculture</li>
            <li><strong>Hands-on Training:</strong> Real-world installation and troubleshooting experience</li>
          </ul>
        </div>

        <div class="popup-section">
          <h3>Impact Goals</h3>
          <p>By 2026, we aim to train 500+ individuals in renewable energy skills, creating employment opportunities and reducing carbon footprint in rural communities.</p>
        </div>

        <div class="popup-share">
          <span>Share this article:</span>
          <button onclick="navigator.share({title:'AHSIS Renewable Energy Training',url:window.location.href})">Share</button>
        </div>
      `
        },
        'ai-agro-sensing': {
            title: 'AI Meets Agriculture: AHSIS Unveils New Agro-sensing Technologies',
            date: 'November 2025',
            category: 'AI & Innovation',
            content: `
        <div class="popup-header">
          <span class="popup-badge" style="background:rgba(0,85,221,0.08);color:#0055DD">AI & Innovation</span>
          <h2>AI Meets Agriculture: AHSIS Unveils New Agro-sensing Technologies</h2>
          <p class="popup-meta">Published: November 2025 | 6 min read</p>
        </div>

        <div class="popup-section">
          <p class="popup-lead">Launching AI-powered tools for smart farming -- from crop health monitoring to yield prediction using satellite data.</p>
        </div>

        <div class="popup-section">
          <h3>The Technology</h3>
          <p>Our new agro-sensing platform combines artificial intelligence with satellite and drone imagery to provide farmers with actionable insights. The system analyzes multiple data streams to deliver recommendations on irrigation, fertilization, and pest management.</p>
        </div>

        <div class="popup-section">
          <h3>Key Features</h3>
          <ul class="popup-list">
            <li>Real-time crop health monitoring using NDVI and EVI indices</li>
            <li>AI-powered yield prediction with 85%+ accuracy</li>
            <li>Automated pest and disease detection</li>
            <li>Weather-integrated advisory system</li>
            <li>Mobile app for farmers</li>
          </ul>
        </div>

        <div class="popup-section">
          <h3>Pilot Results</h3>
          <p>Initial pilots with 50 farms showed 20% reduction in water usage and 15% increase in crop yields through optimized resource management.</p>
        </div>
      `
        },
        'vertical-farming': {
            title: 'Breaking Ground: AHSIS Expands Vertical Farming Research',
            date: 'October 2025',
            category: 'Research',
            content: `
        <div class="popup-header">
          <span class="popup-badge" style="background:rgba(255,85,0,0.08);color:#FF5500">Research</span>
          <h2>Breaking Ground: AHSIS Expands Vertical Farming Research</h2>
          <p class="popup-meta">Published: October 2025 | 4 min read</p>
        </div>

        <div class="popup-section">
          <p class="popup-lead">Exploring vertical farming techniques and controlled environment agriculture for food security in urban areas.</p>
        </div>

        <div class="popup-section">
          <h3>Research Focus</h3>
          <p>Our GeoInnovation Lab has initiated research into vertical farming systems optimized for Indian conditions. The project explores low-cost solutions that can be implemented in urban and peri-urban settings.</p>
        </div>

        <div class="popup-section">
          <h3>Research Areas</h3>
          <ul class="popup-list">
            <li>LED lighting optimization for local crops</li>
            <li>Hydroponic nutrient solutions</li>
            <li>Climate control systems</li>
            <li>Cost-benefit analysis for smallholders</li>
          </ul>
        </div>
      `
        },
        'gis-rural-leaders': {
            title: 'GIS Training Program for Rural Leaders Completed',
            date: 'September 2025',
            category: 'GIS Training',
            content: `
        <div class="popup-header">
          <span class="popup-badge" style="background:rgba(0,102,255,0.08);color:#0066FF">GIS Training</span>
          <h2>GIS Training Program for Rural Leaders Completed</h2>
          <p class="popup-meta">Published: September 2025 | 3 min read</p>
        </div>

        <div class="popup-section">
          <p class="popup-lead">Empowering grassroots leaders with geospatial tools for better resource management and planning.</p>
        </div>

        <div class="popup-section">
          <h3>Program Success</h3>
          <p>AHSIS successfully completed a 2-week intensive GIS training program for 30 rural leaders from Jammu & Kashmir. Participants learned to use mapping tools for village-level planning and resource management.</p>
        </div>

        <div class="popup-section">
          <h3>Skills Acquired</h3>
          <ul class="popup-list">
            <li>Basic GIS concepts and applications</li>
            <li>GPS data collection</li>
            <li>Simple map creation with QGIS</li>
            <li>Village resource mapping</li>
            <li>Data interpretation for planning</li>
          </ul>
        </div>

        <div class="popup-section">
          <h3>Testimonial</h3>
          <blockquote>"The training opened my eyes to how maps can help us plan better for our villages. I can now show others exactly where our water sources are and plan irrigation." - Training Participant</blockquote>
        </div>
      `
        }
    },

    // SERVICES DATA
    services: {
        'gis-remote-sensing': {
            title: 'GIS & Remote Sensing',
            content: `
        <div class="popup-header">
          <div class="popup-icon" style="background:rgba(0,102,255,0.08)">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0066FF" stroke-width="2">
              <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>
            </svg>
          </div>
          <h2>GIS & Remote Sensing Services</h2>
          <p class="popup-subtitle">Advanced geospatial solutions for mapping, monitoring, and spatial decision-making</p>
        </div>

        <div class="popup-section">
          <h3>Our Capabilities</h3>
          <p>We provide comprehensive GIS and remote sensing services leveraging satellite imagery, aerial photography, and spatial analysis techniques to solve complex challenges across agriculture, environment, and urban planning.</p>
        </div>

        <div class="popup-section">
          <h3>Services Offered</h3>
          <ul class="popup-list">
            <li><strong>Spatial Mapping:</strong> High-resolution land use/cover mapping, cadastral mapping, infrastructure mapping</li>
            <li><strong>Remote Sensing Analysis:</strong> Vegetation indices, change detection, environmental monitoring</li>
            <li><strong>Data Management:</strong> Geodatabase design, spatial data integration, quality assurance</li>
            <li><strong>Custom Solutions:</strong> Tailored GIS applications for specific client needs</li>
          </ul>
        </div>

        <div class="popup-section">
          <h3>Industries Served</h3>
          <p>Agriculture, Forestry, Urban Planning, Environmental Management, Disaster Response, Infrastructure Development</p>
        </div>

        <div class="popup-cta-section">
          <a href="#contact" class="popup-btn-primary" onclick="closeModal()">Request a Quote</a>
        </div>
      `
        },
        'agri-innovation': {
            title: 'AhsisAgri Innovation',
            content: `
        <div class="popup-header">
          <div class="popup-icon" style="background:rgba(0,102,255,0.08)">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0066FF" stroke-width="2">
              <path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/>
            </svg>
          </div>
          <h2>AhsisAgri Innovation</h2>
          <p class="popup-subtitle">Technology-driven agricultural solutions for modern farming</p>
        </div>

        <div class="popup-section">
          <h3>Our Approach</h3>
          <p>AhsisAgri combines precision farming techniques with cutting-edge technology to transform agricultural practices. We help farmers optimize resources, increase yields, and adopt sustainable practices.</p>
        </div>

        <div class="popup-section">
          <h3>Solutions</h3>
          <ul class="popup-list">
            <li><strong>Precision Farming:</strong> Variable rate application, zone management, yield mapping</li>
            <li><strong>Crop Monitoring:</strong> Satellite-based crop health tracking, growth stage analysis</li>
            <li><strong>Smart Irrigation:</strong> Soil moisture sensing, automated irrigation scheduling</li>
            <li><strong>Advisory Services:</strong> Data-driven recommendations for crop management</li>
          </ul>
        </div>

        <div class="popup-cta-section">
          <a href="#contact" class="popup-btn-primary" onclick="closeModal()">Get Started</a>
        </div>
      `
        },
        'geoinnovation-lab': {
            title: 'GeoInnovation Lab',
            content: `
        <div class="popup-header">
          <div class="popup-icon" style="background:rgba(255,85,0,0.08)">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FF5500" stroke-width="2">
              <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"/>
            </svg>
          </div>
          <h2>GeoInnovation Lab</h2>
          <p class="popup-subtitle">Research, prototyping, and GIS-based innovations</p>
        </div>

        <div class="popup-section">
          <h3>About the Lab</h3>
          <p>Our GeoInnovation Lab is a dedicated space for research, experimentation, and development of cutting-edge geospatial solutions. We collaborate with researchers, students, and industry partners to push the boundaries of spatial technology.</p>
        </div>

        <div class="popup-section">
          <h3>Research Areas</h3>
          <ul class="popup-list">
            <li>AI/ML for geospatial analysis</li>
            <li>Climate modeling and prediction</li>
            <li>Precision agriculture technologies</li>
            <li>Environmental monitoring systems</li>
            <li>Smart city applications</li>
          </ul>
        </div>

        <div class="popup-cta-section">
          <a href="#contact" class="popup-btn-primary" onclick="closeModal()">Collaborate With Us</a>
        </div>
      `
        },
        'agromet-advisory': {
            title: 'Agromet Advisory',
            content: `
        <div class="popup-header">
          <div class="popup-icon" style="background:rgba(0,102,255,0.08)">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0066FF" stroke-width="2">
              <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M16 14v6"/><path d="M8 14v6"/><path d="M12 16v6"/>
            </svg>
          </div>
          <h2>Agromet Advisory Services</h2>
          <p class="popup-subtitle">Weather-based advisory and climate-smart solutions</p>
        </div>

        <div class="popup-section">
          <h3>Our Services</h3>
          <p>We provide tailored agrometeorology advisories combining weather forecasts, climate data, and crop information to help farmers make informed decisions and mitigate weather-related risks.</p>
        </div>

        <div class="popup-section">
          <h3>Advisory Types</h3>
          <ul class="popup-list">
            <li><strong>Sowing Advisory:</strong> Optimal planting windows based on weather forecasts</li>
            <li><strong>Irrigation Scheduling:</strong> Water management based on rainfall and evapotranspiration</li>
            <li><strong>Pest & Disease Alerts:</strong> Weather-triggered warnings for pest outbreaks</li>
            <li><strong>Harvest Planning:</strong> Weather windows for harvesting operations</li>
          </ul>
        </div>

        <div class="popup-cta-section">
          <a href="#contact" class="popup-btn-primary" onclick="closeModal()">Subscribe to Advisories</a>
        </div>
      `
        },
        'innovation-hubs': {
            title: 'Innovation Hubs & Incubation',
            content: `
        <div class="popup-header">
          <div class="popup-icon" style="background:rgba(0,102,255,0.08)">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0066FF" stroke-width="2">
              <line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/>
            </svg>
          </div>
          <h2>Innovation Hubs & Incubation</h2>
          <p class="popup-subtitle">Supporting startups and innovators</p>
        </div>

        <div class="popup-section">
          <h3>Our Support</h3>
          <p>AHSIS supports emerging entrepreneurs and innovators in the geospatial and agritech space. We provide mentorship, resources, and a collaborative environment to help ideas become impactful solutions.</p>
        </div>

        <div class="popup-section">
          <h3>What We Offer</h3>
          <ul class="popup-list">
            <li>Technical mentorship from industry experts</li>
            <li>Access to geospatial tools and infrastructure</li>
            <li>Networking with industry partners</li>
            <li>Market access and pilot opportunities</li>
            <li>Funding guidance and investor connections</li>
          </ul>
        </div>

        <div class="popup-cta-section">
          <a href="#contact" class="popup-btn-primary" onclick="closeModal()">Apply for Incubation</a>
        </div>
      `
        },
        'ai-solutions': {
            title: 'AI-Driven Solutions',
            content: `
        <div class="popup-header">
          <div class="popup-icon" style="background:rgba(255,85,0,0.08)">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FF5500" stroke-width="2">
              <path d="M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0-1.32 4.24 3 3 0 0 0 .34 5.58 2.5 2.5 0 0 0 2.96 3.08A2.5 2.5 0 0 0 12 19.5"/>
            </svg>
          </div>
          <h2>AI-Driven Solutions</h2>
          <p class="popup-subtitle">Intelligent analytics and automation</p>
        </div>

        <div class="popup-section">
          <h3>Our AI Capabilities</h3>
          <p>We leverage artificial intelligence and machine learning to extract insights from complex data, automate processes, and enable smarter decision-making across agriculture and environmental domains.</p>
        </div>

        <div class="popup-section">
          <h3>Solutions</h3>
          <ul class="popup-list">
            <li><strong>Computer Vision:</strong> Crop disease detection, weed identification, quality assessment</li>
            <li><strong>Predictive Analytics:</strong> Yield forecasting, demand prediction, risk assessment</li>
            <li><strong>NLP Solutions:</strong> Document processing, multilingual advisory systems</li>
            <li><strong>Optimization:</strong> Resource allocation, route planning, supply chain</li>
          </ul>
        </div>

        <div class="popup-cta-section">
          <a href="#contact" class="popup-btn-primary" onclick="closeModal()">Explore AI Solutions</a>
        </div>
      `
        }
    },

    // TEAM DATA
    team: {
        'founder-md': {
            name: 'Founder & Managing Director',
            role: 'MD & Founder',
            content: `
        <div class="popup-header team-popup">
          <div class="popup-avatar" style="background:linear-gradient(135deg,rgba(0,102,255,0.1),rgba(0,102,255,0.05))">
            <span style="color:#0066FF">MD</span>
          </div>
          <h2>Founder & Managing Director</h2>
          <p class="popup-subtitle">MD & Founder, AHSIS Pvt. Ltd.</p>
        </div>

        <div class="popup-section">
          <h3>About</h3>
          <p>Visionary leader driving AHSIS's mission to transform rural India through geospatial innovation. With extensive experience in technology and sustainable development, leads the strategic direction of the organization.</p>
        </div>

        <div class="popup-section">
          <h3>Focus Areas</h3>
          <ul class="popup-list">
            <li>Strategic Vision & Leadership</li>
            <li>Business Development</li>
            <li>Technology Innovation</li>
            <li>Partnership Building</li>
          </ul>
        </div>

        <div class="popup-cta-section">
          <a href="#contact" class="popup-btn-primary" onclick="closeModal()">Connect</a>
        </div>
      `
        },
        'chairperson': {
            name: 'Chairperson',
            role: 'Chairperson',
            content: `
        <div class="popup-header team-popup">
          <div class="popup-avatar" style="background:linear-gradient(135deg,rgba(0,85,221,0.1),rgba(0,85,221,0.05))">
            <span style="color:#0055DD">CP</span>
          </div>
          <h2>Chairperson</h2>
          <p class="popup-subtitle">Chairperson, AHSIS Pvt. Ltd.</p>
        </div>

        <div class="popup-section">
          <h3>About</h3>
          <p>Provides strategic guidance and governance to ensure long-term impact and sustainable growth. Brings decades of experience in organizational leadership and community development.</p>
        </div>

        <div class="popup-section">
          <h3>Responsibilities</h3>
          <ul class="popup-list">
            <li>Board Governance</li>
            <li>Strategic Oversight</li>
            <li>Stakeholder Relations</li>
            <li>Policy Guidance</li>
          </ul>
        </div>
      `
        },
        'chief-advisor': {
            name: 'Chief Advisor & Head',
            role: 'Climate Modelling & DRM',
            content: `
        <div class="popup-header team-popup">
          <div class="popup-avatar" style="background:linear-gradient(135deg,rgba(255,85,0,0.1),rgba(255,85,0,0.05))">
            <span style="color:#FF5500">CA</span>
          </div>
          <h2>Chief Advisor & Head</h2>
          <p class="popup-subtitle">Climate Modelling & Disaster Risk Management</p>
        </div>

        <div class="popup-section">
          <h3>About</h3>
          <p>Leads climate modeling, disaster risk management research, and sustainability advisory. Expert in climate science with focus on agricultural applications and community resilience.</p>
        </div>

        <div class="popup-section">
          <h3>Expertise</h3>
          <ul class="popup-list">
            <li>Climate Modeling & Prediction</li>
            <li>Disaster Risk Management</li>
            <li>Sustainability Assessment</li>
            <li>Environmental Policy</li>
          </ul>
        </div>
      `
        },
        'research-scientist': {
            name: 'Dr. Aaqib Ashraf',
            role: 'Research Scientist',
            content: `
        <div class="popup-header team-popup">
          <div class="popup-avatar" style="background:linear-gradient(135deg,rgba(0,102,255,0.1),rgba(0,102,255,0.05))">
            <span style="color:#0066FF">AA</span>
          </div>
          <h2>Dr. Aaqib Ashraf</h2>
          <p class="popup-subtitle">Research Scientist</p>
        </div>

        <div class="popup-section">
          <h3>About</h3>
          <p>Drives research in geospatial technology, environmental science, and agricultural innovation. Ph.D. in Remote Sensing with publications in peer-reviewed journals on vegetation monitoring and climate impacts.</p>
        </div>

        <div class="popup-section">
          <h3>Research Focus</h3>
          <ul class="popup-list">
            <li>Satellite Remote Sensing</li>
            <li>Vegetation Dynamics</li>
            <li>Climate Change Impacts</li>
            <li>Agricultural Geoinformatics</li>
          </ul>
        </div>
      `
        }
    },

    // ALL TESTIMONIALS
    allTestimonials: {
        content: `
      <div class="popup-header">
        <h2>What People Say About AHSIS</h2>
        <p class="popup-subtitle">Testimonials from our partners, trainees, and collaborators</p>
      </div>

      <div class="popup-testimonials-grid">
        <div class="popup-testimonial-card">
          <div class="popup-testimonial-quote">"AHSIS represents a timely and much-needed initiative that bridges scientific understanding with real-world applications, particularly in rural and vulnerable regions."</div>
          <div class="popup-testimonial-author">
            <div class="popup-testimonial-avatar">DP</div>
            <div>
              <strong>Mr. Deepak Panda</strong>
              <span>Ph.D. Research Scholar</span>
            </div>
          </div>
        </div>

        <div class="popup-testimonial-card">
          <div class="popup-testimonial-quote">"AHSIS stands out as a dynamic platform that is truly bridging the gap between academic research and ground-level sustainability action."</div>
          <div class="popup-testimonial-author">
            <div class="popup-testimonial-avatar">MJ</div>
            <div>
              <strong>Ms. Mahjabeen</strong>
              <span>PhD Research Scholar</span>
            </div>
          </div>
        </div>

        <div class="popup-testimonial-card">
          <div class="popup-testimonial-quote">"AHSIS stands out for its practical, hands-on approach to sustainability, empowering communities and young professionals with regionally relevant skills."</div>
          <div class="popup-testimonial-author">
            <div class="popup-testimonial-avatar">HS</div>
            <div>
              <strong>Dr. Husain Shabbar</strong>
              <span>Assistant Professor (Geology)</span>
            </div>
          </div>
        </div>

        <div class="popup-testimonial-card">
          <div class="popup-testimonial-quote">"The GIS training provided by AHSIS was transformative. I now use mapping tools daily in my work managing village resources."</div>
          <div class="popup-testimonial-author">
            <div class="popup-testimonial-avatar">RK</div>
            <div>
              <strong>Rahul Kumar</strong>
              <span>Program Trainee, Block Development Officer</span>
            </div>
          </div>
        </div>

        <div class="popup-testimonial-card">
          <div class="popup-testimonial-quote">"Working with AHSIS on our agricultural monitoring project was seamless. Their technical expertise and commitment to sustainability impressed us."</div>
          <div class="popup-testimonial-author">
            <div class="popup-testimonial-avatar">PS</div>
            <div>
              <strong>Dr. Priya Sharma</strong>
              <span>Environmental Consultant</span>
            </div>
          </div>
        </div>
      </div>
    `
    },

    // ALL COURSES POPUP
    allCourses: {
        content: `
      <div class="popup-header">
        <h2>All Programs & Courses</h2>
        <p class="popup-subtitle">Industry-relevant skill training designed to bridge the gap between academia and real-world challenges</p>
      </div>

      <div class="popup-section">
        <h3 style="color:#0066FF;border-bottom:2px solid rgba(0,102,255,0.2);padding-bottom:8px;margin-bottom:20px">6-Month Programs</h3>
        <div class="popup-courses-grid">
          <div class="popup-course-card" onclick="openProgramPopup('gis-remote-sensing')">
            <div class="popup-course-icon" style="background:rgba(0,102,255,0.08)">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0066FF" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            </div>
            <div class="popup-course-info">
              <h4>Advanced GIS & Remote Sensing</h4>
              <p>Comprehensive geospatial analysis with ArcGIS, QGIS, and satellite image processing.</p>
              <span class="popup-course-duration">6 Months</span>
            </div>
          </div>
          <div class="popup-course-card" onclick="openProgramPopup('ai-ml-agriculture')">
            <div class="popup-course-icon" style="background:rgba(0,85,221,0.08)">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0055DD" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/></svg>
            </div>
            <div class="popup-course-info">
              <h4>AI & Machine Learning for Agriculture</h4>
              <p>Deep learning, predictive analytics, and crop health monitoring using AI models.</p>
              <span class="popup-course-duration">6 Months</span>
            </div>
          </div>
          <div class="popup-course-card" onclick="openProgramPopup('webgis-development')">
            <div class="popup-course-icon" style="background:rgba(255,85,0,0.08)">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF5500" stroke-width="2"><path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/></svg>
            </div>
            <div class="popup-course-info">
              <h4>Full Stack Web GIS Development</h4>
              <p>Build interactive GIS web applications using modern frameworks and spatial databases.</p>
              <span class="popup-course-duration">6 Months</span>
            </div>
          </div>
        </div>
      </div>

      <div class="popup-section">
        <h3 style="color:#0055DD;border-bottom:2px solid rgba(0,85,221,0.2);padding-bottom:8px;margin-bottom:20px">3-Month Programs</h3>
        <div class="popup-courses-grid">
          <div class="popup-course-card" onclick="openProgramPopup('drone-mapping')">
            <div class="popup-course-icon" style="background:rgba(0,102,255,0.08)">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0066FF" stroke-width="2"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            </div>
            <div class="popup-course-info">
              <h4>Drone Technology & Mapping</h4>
              <p>UAV operations, aerial surveying, photogrammetry, and 3D terrain modeling.</p>
              <span class="popup-course-duration">3 Months</span>
            </div>
          </div>
          <div class="popup-course-card" onclick="openProgramPopup('iot-agriculture')">
            <div class="popup-course-icon" style="background:rgba(0,85,221,0.08)">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0055DD" stroke-width="2"><path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4"/></svg>
            </div>
            <div class="popup-course-info">
              <h4>IoT for Smart Agriculture</h4>
              <p>Sensor networks, soil monitoring, automated irrigation, and precision farming.</p>
              <span class="popup-course-duration">3 Months</span>
            </div>
          </div>
          <div class="popup-course-card" onclick="openProgramPopup('climate-analytics')">
            <div class="popup-course-icon" style="background:rgba(255,85,0,0.08)">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF5500" stroke-width="2"><path d="M2 12a5 5 0 0 0 5 5 8 8 0 0 1 5 2 8 8 0 0 1 5-2 5 5 0 0 0 5-5V7h-5a8 8 0 0 0-5 2 8 8 0 0 0-5-2H2Z"/></svg>
            </div>
            <div class="popup-course-info">
              <h4>Climate Data Analytics</h4>
              <p>Climate modeling, weather pattern analysis, and agrometeorology advisory.</p>
              <span class="popup-course-duration">3 Months</span>
            </div>
          </div>
        </div>
      </div>

      <div class="popup-section">
        <h3 style="color:#FF5500;border-bottom:2px solid rgba(255,85,0,0.2);padding-bottom:8px;margin-bottom:20px">Short-Term Programs</h3>
        <div class="popup-courses-grid">
          <div class="popup-course-card" onclick="openProgramPopup('python-geospatial')">
            <div class="popup-course-icon" style="background:rgba(255,85,0,0.08)">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF5500" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
            </div>
            <div class="popup-course-info">
              <h4>Python for Geospatial Analysis</h4>
              <p>Geospatial libraries, satellite data processing, and automation scripts.</p>
              <span class="popup-course-duration">2 Months</span>
            </div>
          </div>
          <div class="popup-course-card" onclick="openProgramPopup('intro-gis')">
            <div class="popup-course-icon" style="background:rgba(0,102,255,0.08)">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0066FF" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/></svg>
            </div>
            <div class="popup-course-info">
              <h4>Introduction to GIS</h4>
              <p>Fundamentals of geographic information systems, spatial data, and map creation.</p>
              <span class="popup-course-duration">1 Month</span>
            </div>
          </div>
          <div class="popup-course-card" onclick="openProgramPopup('data-visualization')">
            <div class="popup-course-icon" style="background:rgba(255,85,0,0.08)">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF5500" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
            </div>
            <div class="popup-course-info">
              <h4>Data Visualization & Dashboards</h4>
              <p>Creating interactive dashboards using modern data visualization tools.</p>
              <span class="popup-course-duration">1 Month</span>
            </div>
          </div>
        </div>
      </div>

      <div class="popup-cta-section">
        <a href="#contact" class="popup-btn-primary" onclick="closeModal(); prefillContactForm('Course Enrollment');">Enroll Now</a>
        <a href="#contact" class="popup-btn-outline" onclick="closeModal(); prefillContactForm('Course Inquiry');">Request Information</a>
      </div>
    `
    },

    // ALL BLOG POSTS POPUP
    allBlogPosts: {
        content: `
      <div class="popup-header">
        <h2>All Blog Posts & Insights</h2>
        <p class="popup-subtitle">Latest news, research updates, and insights from AHSIS</p>
      </div>

      <div class="popup-blog-list">
        <div class="popup-blog-item" onclick="openBlogPopup('renewable-energy-training')">
          <span class="popup-blog-tag" style="background:rgba(0,102,255,0.08);color:#0066FF">Skill Training</span>
          <h3>AHSIS Launches Skill Training Initiative in Renewable Energy</h3>
          <p>Empowering rural communities with practical skills in solar energy, biogas systems, and sustainable energy solutions.</p>
          <span class="popup-blog-date">December 2025</span>
        </div>

        <div class="popup-blog-item" onclick="openBlogPopup('ai-agro-sensing')">
          <span class="popup-blog-tag" style="background:rgba(0,85,221,0.08);color:#0055DD">AI & Innovation</span>
          <h3>AI Meets Agriculture: AHSIS Unveils New Agro-sensing Technologies</h3>
          <p>Launching AI-powered tools for smart farming -- from crop health monitoring to yield prediction using satellite data.</p>
          <span class="popup-blog-date">November 2025</span>
        </div>

        <div class="popup-blog-item" onclick="openBlogPopup('vertical-farming')">
          <span class="popup-blog-tag" style="background:rgba(255,85,0,0.08);color:#FF5500">Research</span>
          <h3>Breaking Ground: AHSIS Expands Vertical Farming Research</h3>
          <p>Exploring vertical farming techniques and controlled environment agriculture for food security in urban areas.</p>
          <span class="popup-blog-date">October 2025</span>
        </div>

        <div class="popup-blog-item" onclick="openBlogPopup('gis-rural-leaders')">
          <span class="popup-blog-tag" style="background:rgba(0,102,255,0.08);color:#0066FF">GIS Training</span>
          <h3>GIS Training Program for Rural Leaders Completed</h3>
          <p>Empowering grassroots leaders with geospatial tools for better resource management and planning.</p>
          <span class="popup-blog-date">September 2025</span>
        </div>
      </div>

      <div class="popup-section" style="margin-top:32px;text-align:center">
        <p style="color:#64748b;font-size:14px">Stay updated with our latest research and innovations</p>
        <a href="#contact" class="popup-btn-primary" onclick="closeModal(); prefillContactForm('Newsletter Subscription');" style="margin-top:16px">Subscribe to Newsletter</a>
      </div>
    `
    }
};

/* ========================================
   POPUP BUTTON INITIALIZATION
   ======================================== */

function initAllPopupButtons() {
    // About "Dig More" button
    document.querySelectorAll('[data-popup="about"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(POPUP_DATA.about.content, 'large');
        });
    });

    // Program/Course buttons
    document.querySelectorAll('[data-popup-program]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const programId = btn.dataset.popupProgram;
            if (POPUP_DATA.programs[programId]) {
                openModal(POPUP_DATA.programs[programId].content, 'large');
            }
        });
    });

    // Project buttons
    document.querySelectorAll('[data-popup-project]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const projectId = btn.dataset.popupProject;
            if (POPUP_DATA.projects[projectId]) {
                openModal(POPUP_DATA.projects[projectId].content, 'large');
            }
        });
    });

    // Blog buttons
    document.querySelectorAll('[data-popup-blog]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const blogId = btn.dataset.popupBlog;
            if (POPUP_DATA.blogs[blogId]) {
                openModal(POPUP_DATA.blogs[blogId].content, 'large');
            }
        });
    });

    // Service buttons
    document.querySelectorAll('[data-popup-service]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const serviceId = btn.dataset.popupService;
            if (POPUP_DATA.services[serviceId]) {
                openModal(POPUP_DATA.services[serviceId].content, 'large');
            }
        });
    });

    // Team buttons
    document.querySelectorAll('[data-popup-team]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const teamId = btn.dataset.popupTeam;
            if (POPUP_DATA.team[teamId]) {
                openModal(POPUP_DATA.team[teamId].content, 'medium');
            }
        });
    });

    // All testimonials button
    document.querySelectorAll('[data-popup="all-testimonials"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(POPUP_DATA.allTestimonials.content, 'large');
        });
    });

    // All courses button
    document.querySelectorAll('[data-popup="all-courses"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(POPUP_DATA.allCourses.content, 'large');
        });
    });

    // All blog posts button
    document.querySelectorAll('[data-popup="all-posts"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(POPUP_DATA.allBlogPosts.content, 'large');
        });
    });

    // Contact form prefill buttons
    document.querySelectorAll('[data-contact-subject]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const subject = btn.dataset.contactSubject;
            prefillContactForm(subject);
            // Scroll to contact
            document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Generic popup trigger for any link-arrow with specific parent
    document.querySelectorAll('.link-arrow').forEach(link => {
        if (!link.dataset.popup && !link.dataset.popupProgram && !link.dataset.popupProject) {
            // Check if it's the about section dig more
            const aboutSection = link.closest('#about');
            if (aboutSection) {
                link.setAttribute('data-popup', 'about');
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    openModal(POPUP_DATA.about.content, 'large');
                });
            }
        }
    });
}

/* Helper functions for nested popup navigation */
function openProgramPopup(programId) {
    if (POPUP_DATA.programs[programId]) {
        openModal(POPUP_DATA.programs[programId].content, 'large');
    }
}

function openBlogPopup(blogId) {
    if (POPUP_DATA.blogs[blogId]) {
        openModal(POPUP_DATA.blogs[blogId].content, 'large');
    }
}

/* Contact form prefill function */
function prefillContactForm(subject) {
    const messageField = document.querySelector('#contact-form textarea[name="message"]');
    const submitBtn = document.querySelector('#contact-form button[type="submit"]');

    if (messageField) {
        // Prefill based on subject type
        let prefillText = '';
        let buttonText = 'Send Message';

        switch (subject) {
            case 'Research Internship':
                prefillText = 'I am interested in applying for a Research Internship at AHSIS. Please share details about:\n- Available internship positions\n- Duration and requirements\n- Application process';
                buttonText = 'Apply for Internship';
                break;
            case 'Placement Inquiry':
                prefillText = 'I would like to connect with the Placement Cell regarding career opportunities. Please provide information about:\n- Current job openings\n- Placement assistance\n- Career counselling';
                buttonText = 'Contact Placement Cell';
                break;
            case 'Membership Application':
                prefillText = 'I am interested in becoming a member of AHSIS. Please share details about:\n- Membership benefits\n- Application process\n- Membership fees (if any)';
                buttonText = 'Apply for Membership';
                break;
            case 'Partnership Inquiry':
                prefillText = 'I/We are interested in partnering with AHSIS. Please share details about:\n- Partnership opportunities\n- Collaboration areas\n- Next steps';
                buttonText = 'Partner With Us';
                break;
            case 'Career Inquiry':
                prefillText = 'I am interested in career opportunities at AHSIS. Please share details about:\n- Current openings\n- Required qualifications\n- Application process';
                buttonText = 'View Openings';
                break;
            case 'Course Enrollment':
                prefillText = 'I am interested in enrolling in one of your courses. Please share details about:\n- Course schedule\n- Fee structure\n- Registration process';
                buttonText = 'Enroll Now';
                break;
            case 'Course Inquiry':
                prefillText = 'I would like more information about your training programs. Please share details about:\n- Available courses\n- Prerequisites\n- Certification';
                buttonText = 'Get Information';
                break;
            case 'Newsletter Subscription':
                prefillText = 'I would like to subscribe to the AHSIS newsletter to stay updated on:\n- Latest research\n- Training programs\n- Events and webinars';
                buttonText = 'Subscribe';
                break;
            default:
                prefillText = `Inquiry regarding: ${subject}\n\nPlease provide more information.`;
                buttonText = 'Send Message';
        }

        messageField.value = prefillText;
        messageField.focus();

        // Update button text
        if (submitBtn) {
            submitBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> ${buttonText}`;
        }
    }
}

/* Spin animation for loader */
const style = document.createElement('style');
style.textContent = '@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}.spin{animation:spin 1s linear infinite}';
document.head.appendChild(style);
