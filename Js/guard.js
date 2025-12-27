// This script will run on every protected page
(async function() {
    try {
        // Check if the user is logged in.
        // 'credentials: "include"' is VITAL. It sends the session cookie.
        const response = await fetch('https://fullstackgym.onrender.com/check-auth', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include' 
        });

        if (!response.ok) {
            // If status is 401 or any other error, they are not logged in.
            // Redirect them to the login page.

            // Get the current page path to add as a redirect query
            const currentPath = window.location.pathname;
            window.location.href = `login.html?redirect=${currentPath}`;
        }

        // If response is OK, the user is logged in.
        // You can optionally get the data and display it
        const data = await response.json();
        console.log(`Welcome, ${data.username}`);
        // You could use this to show "Welcome, [Username]" on the page

    } catch (error) {
        // If the server is down or there's a network error
        console.error('Auth check failed:', error);
        // Redirect to login just in case
        window.location.href = 'login.html';
    }
})();