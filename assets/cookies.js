(function() {
  const COOKIE_KEY = 'ryanair_cookies_accepted';
  
  // Check if already accepted
  if (localStorage.getItem(COOKIE_KEY)) {
    return;
  }

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
    // Even if rejected, we usually set a flag so we don't ask again immediately, 
    // or we might just hide it for this session. 
    // For this implementation, we'll remember the rejection to avoid annoyance.
    localStorage.setItem(COOKIE_KEY, 'false'); 
    hideBanner();
  });

  function hideBanner() {
    banner.classList.add('translate-y-full');
    setTimeout(() => {
      banner.remove();
    }, 300);
  }
})();
