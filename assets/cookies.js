(function() {
  const COOKIE_KEY = 'ryanair_cookies_accepted';
  
  // Check if already accepted
  if (localStorage.getItem(COOKIE_KEY)) {
    // skip banner
  } else {
    // Create banner elements
    const banner = document.createElement('div');
    banner.className = 'fixed bottom-0 left-0 right-0 bg-white border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] p-6 z-50 transform transition-transform duration-300 translate-y-full';
    banner.innerHTML = `
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="flex-1">
          <h3 class="text-lg font-bold text-[#073590] mb-1">Your Privacy Matters</h3>
          <p class="text-sm text-gray-600">
            By clicking "Yes, I agree", you agree to Ryanair using cookies to improve your browsing experience, personalise content, and provide social media features.
            See our <a href="/privacy.html" class="text-blue-600 underline hover:text-blue-800">Privacy Policy</a> and <a href="/terms.html" class="text-blue-600 underline hover:text-blue-800">Cookie Policy</a> for more info.
          </p>
        </div>
        <div class="flex items-center gap-3 w-full md:w-auto">
          <button id="cookie-reject" class="flex-1 md:flex-none px-6 py-2.5 border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition rounded text-sm">
            No, thanks
          </button>
          <button id="cookie-accept" class="flex-1 md:flex-none px-6 py-2.5 bg-[#F1C933] text-[#073590] font-bold hover:bg-[#eebb00] transition rounded text-sm uppercase">
            Yes, I agree
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(banner);

    // Trigger animation after small delay
    setTimeout(() => {
      banner.classList.remove('translate-y-full');
    }, 100);

    // Event Listeners
    document.getElementById('cookie-accept').addEventListener('click', () => {
      localStorage.setItem(COOKIE_KEY, 'true');
      hideBanner();
    });

    document.getElementById('cookie-reject').addEventListener('click', () => {
      localStorage.setItem(COOKIE_KEY, 'false'); 
      hideBanner();
    });

    function hideBanner() {
      banner.classList.add('translate-y-full');
      setTimeout(() => {
        banner.remove();
      }, 300);
    }
  }

  // --- Auth Link Injection ---
  function injectAuth() {
    // Don't inject on login page
    if (window.location.pathname.includes('login.html')) return;
    
    // Find the desktop nav
    const nav = document.querySelector('header nav');
    if (!nav) return;

    const uid = sessionStorage.getItem('user_id');
    const role = sessionStorage.getItem('role');
    
    let link;
    if (uid) {
        // Logged in
        const container = document.createElement('div');
        container.className = 'relative group ml-2';
        
        const btn = document.createElement('button');
        btn.className = 'text-sm font-medium text-white bg-blue-700 px-3 py-1 rounded hover:bg-blue-600 transition-colors flex items-center gap-1';
        btn.innerHTML = `<span>My Account</span> <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>`;
        
        const dropdown = document.createElement('div');
        dropdown.className = 'absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block z-50';
        
        let menuItems = '';
        if (role === 'admin') {
            menuItems += `<a href="/admin.html" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Admin Dashboard</a>`;
        }
        menuItems += `<a href="#" id="auth-logout" class="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">Log out</a>`;
        
        dropdown.innerHTML = menuItems;
        container.appendChild(btn);
        container.appendChild(dropdown);
        nav.appendChild(container);

        // Bind logout
        setTimeout(() => {
            const logoutBtn = document.getElementById('auth-logout');
            if (logoutBtn) {
                logoutBtn.onclick = (e) => {
                    e.preventDefault();
                    sessionStorage.clear();
                    window.location.reload();
                };
            }
        }, 0);

    } else {
        // Not logged in
        const a = document.createElement('a');
        a.href = '/login.html';
        a.className = 'text-sm font-medium text-white bg-[#F1C933] text-[#073590] px-4 py-1.5 rounded hover:bg-[#eebb00] transition-colors ml-2';
        a.textContent = 'Log in';
        nav.appendChild(a);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectAuth);
  } else {
    injectAuth();
  }

})();
