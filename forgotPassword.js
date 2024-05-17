const supabaseUrl = 'https://gkgupdxpofpowtfwcufj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrZ3VwZHhwb2Zwb3d0ZndjdWZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTMxMzM2NDcsImV4cCI6MjAyODcwOTY0N30.YQ1gz3dYcCVoA874jZDQ8-YPh02ib1wl1AWxZwQyXtE';
const database = supabase.createClient(supabaseUrl, supabaseKey);

// Check if the user is authenticated
async function checkAuthentication() {
    const { data: { session } } = await database.auth.getSession();
    if (!session) {
        // No session, redirect to login page
        window.location.href = 'login.html';
    }
}

async function logout() {
    const { error } = await database.auth.signOut();
    if (!error) {
        window.location.href = 'login.html'; // Redirect to login page
    } else {
        console.error('Logout error:', error.message);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    checkAuthentication();
});

document.addEventListener('DOMContentLoaded', function () {
    const forgotPasswordForm = document.querySelector('form');
    const emailInput = forgotPasswordForm.querySelector('input[type="text"][placeholder="Email"]');

    forgotPasswordForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const email = emailInput.value;

        if (!email) {
            alert('Please enter your email address.');
            return;
        }

        // Send password reset email
        const { data, error } = await database.auth.resetPasswordForEmail(email, {
            redirectTo: 'file:///D:/Group%20Project/reset-password.html',
        });

        if (error) {
            alert('Error: ' + error.message);
        } else {
            alert('Password reset link sent to ' + email);
        }
    });
});
