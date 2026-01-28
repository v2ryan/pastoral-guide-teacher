// ===================================
// 跨世代牧養指南網站 JavaScript
// Cross-Generational Pastoral Guide Scripts
// ===================================

document.addEventListener('DOMContentLoaded', function() {

    // Mobile Menu Toggle
    initMobileMenu();

    // Accordion Functionality
    initAccordions();

    // Smooth Scrolling
    initSmoothScroll();

    // Scroll to Top Button
    initScrollToTop();

    // Active Navigation
    highlightActiveNav();

    // Print Checklists
    initChecklists();

    // Lazy Loading for Images
    initLazyLoading();

    // Fade-in Animation on Scroll
    initScrollAnimations();
});

// Mobile Menu Toggle
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.textContent = navMenu.classList.contains('active') ? '✕' : '☰';
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.main-nav') && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                menuToggle.textContent = '☰';
            }
        });
    }
}

// Accordion Functionality
function initAccordions() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const item = this.parentElement;
            const wasActive = item.classList.contains('active');

            // Close all accordions in the same group
            const accordion = item.closest('.accordion');
            accordion.querySelectorAll('.accordion-item').forEach(otherItem => {
                otherItem.classList.remove('active');
            });

            // Toggle current accordion
            if (!wasActive) {
                item.classList.add('active');
            }
        });
    });
}

// Smooth Scrolling for Anchor Links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Scroll to Top Button
function initScrollToTop() {
    const scrollTopBtn = document.querySelector('.scroll-top');

    if (scrollTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });

        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Highlight Active Navigation
function highlightActiveNav() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-menu a');

    navLinks.forEach(link => {
        const linkPath = new URL(link.href).pathname;
        if (currentPath === linkPath || (currentPath.endsWith('/') && linkPath.includes('index.html'))) {
            link.classList.add('active');
        }
    });
}

// Checklist Functionality
function initChecklists() {
    const checklistItems = document.querySelectorAll('.checklist-item input[type="checkbox"]');

    checklistItems.forEach(checkbox => {
        // Load saved state from localStorage
        const itemId = checkbox.id;
        if (itemId) {
            const savedState = localStorage.getItem(`checklist-${itemId}`);
            if (savedState === 'true') {
                checkbox.checked = true;
            }
        }

        // Save state on change
        checkbox.addEventListener('change', function() {
            if (this.id) {
                localStorage.setItem(`checklist-${this.id}`, this.checked);
            }
        });
    });
}

// Lazy Loading for Images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Scroll Animations
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.card, .generation-card, .accordion');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    animatedElements.forEach(el => observer.observe(el));
}

// Utility Functions
const utils = {
    // Copy text to clipboard
    copyToClipboard: function(text) {
        navigator.clipboard.writeText(text).then(() => {
            alert('已複製到剪貼簿！');
        }).catch(err => {
            console.error('複製失敗:', err);
        });
    },

    // Print specific section
    printSection: function(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const printWindow = window.open('', '', 'height=600,width=800');
            printWindow.document.write('<html><head><title>列印</title>');
            printWindow.document.write('<link rel="stylesheet" href="css/styles.css">');
            printWindow.document.write('</head><body>');
            printWindow.document.write(section.innerHTML);
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.print();
        }
    },

    // Toggle dark mode (future enhancement)
    toggleDarkMode: function() {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    },

    // Export checklist as text
    exportChecklist: function() {
        const checkedItems = [];
        document.querySelectorAll('.checklist-item input:checked').forEach(checkbox => {
            const label = checkbox.parentElement.textContent.trim();
            checkedItems.push(`✓ ${label}`);
        });

        if (checkedItems.length > 0) {
            const text = '已完成項目：\n\n' + checkedItems.join('\n');
            this.copyToClipboard(text);
        } else {
            alert('沒有已勾選的項目');
        }
    }
};

// Make utils available globally
window.pastoralGuide = {
    utils: utils
};

// Table of Contents Generator (if needed)
function generateTOC() {
    const headings = document.querySelectorAll('h2, h3');
    const toc = document.querySelector('.table-of-contents');

    if (toc && headings.length > 0) {
        const tocList = document.createElement('ul');
        tocList.className = 'toc-list';

        headings.forEach((heading, index) => {
            // Add ID to heading if it doesn't have one
            if (!heading.id) {
                heading.id = `section-${index}`;
            }

            const li = document.createElement('li');
            li.className = heading.tagName.toLowerCase();

            const a = document.createElement('a');
            a.href = `#${heading.id}`;
            a.textContent = heading.textContent;

            li.appendChild(a);
            tocList.appendChild(li);
        });

        toc.appendChild(tocList);
    }
}

// Search Functionality (basic)
function initSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchableContent = document.querySelectorAll('.card, .generation-card');

    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();

            searchableContent.forEach(element => {
                const text = element.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    element.style.display = '';
                } else {
                    element.style.display = 'none';
                }
            });
        });
    }
}

// Progress Tracker
class ProgressTracker {
    constructor() {
        this.key = 'pastoral-guide-progress';
        this.progress = this.load();
    }

    load() {
        const saved = localStorage.getItem(this.key);
        return saved ? JSON.parse(saved) : {};
    }

    save() {
        localStorage.setItem(this.key, JSON.stringify(this.progress));
    }

    markComplete(section) {
        this.progress[section] = true;
        this.save();
        this.updateUI();
    }

    isComplete(section) {
        return this.progress[section] === true;
    }

    updateUI() {
        // Update progress indicators in the UI
        Object.keys(this.progress).forEach(section => {
            const element = document.querySelector(`[data-section="${section}"]`);
            if (element && this.progress[section]) {
                element.classList.add('completed');
            }
        });
    }
}

// Initialize progress tracker if needed
const progressTracker = new ProgressTracker();
window.progressTracker = progressTracker;
