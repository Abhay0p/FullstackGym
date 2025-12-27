// js/guard.js - FRONTEND ONLY
document.addEventListener("DOMContentLoaded", function() {
    // 1. SELECTORS
    const token = localStorage.getItem('token');
    const userEmail = localStorage.getItem('userEmail');
    const body = document.querySelector('body');
    const loginNavItem = document.getElementById('login-nav-item');

    // 2. SECURITY CHECK (The Bouncer)
    if (!token) {
        // If we are NOT on the login/register page, kick them out
        const currentPage = window.location.pathname;
        if (!currentPage.includes('login.html') && !currentPage.includes('register.html')) {
             window.location.href = 'login.html';
             return;
        }
    }

    // 3. REVEAL PAGE
    if (body) {
        body.style.display = 'block'; 
    }

    // 4. UPDATE NAVBAR (Login -> Logout)
    if (loginNavItem && token) {
        const displayName = userEmail ? userEmail.split('@')[0] : 'Member';

        loginNavItem.innerHTML = `
            <a id="logout-link" class="nav-link" href="#" style="cursor: pointer;">
                <img src="account.png" alt="Logout" width="20" height="20" style="margin-right: 5px; vertical-align: text-bottom;">
                Logout (${displayName})
            </a>
        `;

        // Attach Logout Event
        document.getElementById('logout-link').addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('token');
            localStorage.removeItem('userEmail');
            window.location.href = 'login.html';
        });
    }
});