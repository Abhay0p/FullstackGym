document.addEventListener("DOMContentLoaded", function() {
    // 1. SELECTORS
    const token = localStorage.getItem('token');
    const userEmail = localStorage.getItem('userEmail');
    const body = document.querySelector('body');
    const loginNavItem = document.getElementById('login-nav-item');

    // 2. SECURITY CHECK (The Bouncer)
    if (!token) {
        // If no token, redirect to login immediately
        window.location.href = 'login.html';
        return; // Stop the script here
    }

    // 3. REVEAL PAGE (The Curtain)
    // If we passed the check above, show the page content
    if (body) {
        body.style.display = 'block'; 
    }

    // 4. UPDATE NAVBAR (The UI)
    if (loginNavItem) {
        // Extract name from email (e.g., "abhay" from "abhay@gmail.com")
        const displayName = userEmail ? userEmail.split('@')[0] : 'Member';

        // Swap "Login" link with "Logout" link
        loginNavItem.innerHTML = `
            <a id="logout-link" class="nav-link" href="#" style="cursor: pointer;">
                <img src="account.png" alt="Logout" width="20" height="20" style="margin-right: 5px; vertical-align: text-bottom;">
                Logout (${displayName})
            </a>
        `;

        // Add the click event to the new Logout button
        document.getElementById('logout-link').addEventListener('click', (e) => {
            e.preventDefault(); // Stop it from jumping to top of page
            logout();
        });
    }
});

// GLOBAL LOGOUT FUNCTION
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    window.location.href = 'login.html';
}