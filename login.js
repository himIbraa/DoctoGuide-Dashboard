const supabaseUrl = 'https://gkgupdxpofpowtfwcufj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrZ3VwZHhwb2Zwb3d0ZndjdWZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTMxMzM2NDcsImV4cCI6MjAyODcwOTY0N30.YQ1gz3dYcCVoA874jZDQ8-YPh02ib1wl1AWxZwQyXtE';
const database = supabase.createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.querySelector('form');
    const emailInput = loginForm.querySelector('input[type="text"][placeholder="Email"]');
    const passwordInput = loginForm.querySelector('input[type="password"][placeholder="Password"]');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const email = emailInput.value;
        const password = passwordInput.value;

        if (!email || !password) {
            alert('Please enter both email and password');
            return;
        }

        // Authenticate the user
        const { data, error } = await database.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            alert('Login failed: ' + error.message);
        } else {
            alert('Login successful!');
            // Redirect to dashboard
            window.location.href = 'index.html';
        }
    });
});
