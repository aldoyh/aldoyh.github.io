/**
 * Theme Management Utilities
 * Handles dark/light theme toggling with persistence
 */

const ThemeManager = {
  storageKey: 'theme-preference',
  attribute: 'data-theme',
  darkClass: 'dark',

  /**
   * Initialize theme on page load
   */
  init() {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;

    // Get stored preference or use system preference
    const savedTheme = this.getSavedTheme();
    const prefersDark = this.getSystemPreference();
    const initialTheme = savedTheme || (prefersDark ? this.darkClass : 'light');

    // Set initial theme
    this.setTheme(initialTheme);

    // Listen for toggle clicks
    toggle.addEventListener('click', () => this.toggle());

    // Listen for system theme changes
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!this.getSavedTheme()) {
          this.setTheme(e.matches ? this.darkClass : 'light');
        }
      });
    }
  },

  /**
   * Get saved theme preference from localStorage
   */
  getSavedTheme() {
    return localStorage.getItem(this.storageKey);
  },

  /**
   * Get system color scheme preference
   */
  getSystemPreference() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  },

  /**
   * Set theme and persist preference
   */
  setTheme(theme) {
    document.documentElement.setAttribute(this.attribute, theme);
    localStorage.setItem(this.storageKey, theme);
    this.updateToggleButton(theme);
  },

  /**
   * Toggle between dark and light themes
   */
  toggle() {
    const currentTheme = document.documentElement.getAttribute(this.attribute) || 'light';
    const newTheme = currentTheme === this.darkClass ? 'light' : this.darkClass;
    this.setTheme(newTheme);
  },

  /**
   * Update toggle button appearance
   */
  updateToggleButton(theme) {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;

    const icon = toggle.querySelector('span');
    if (icon) {
      icon.textContent = theme === this.darkClass ? '☀️' : '🌙';
    }
  }
};

// Initialize theme when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => ThemeManager.init());
} else {
  ThemeManager.init();
}

/**
 * Utility function to debounce function calls
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Utility function to throttle function calls
 */
function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Format a date to a readable string
 */
function formatDate(date) {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Check if element is in viewport
 */
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Smooth scroll to element
 */
function smoothScrollTo(element, offset = 0) {
  const target = typeof element === 'string'
    ? document.querySelector(element)
    : element;

  if (!target) return;

  const top = target.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({
    top,
    behavior: 'smooth'
  });
}
