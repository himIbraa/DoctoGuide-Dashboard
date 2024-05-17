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
    const resetPasswordBtn = document.getElementById('reset-password-btn');
    const newPasswordInput = document.getElementById('new-password');
    const confirmPasswordInput = document.getElementById('confirm-password');

    resetPasswordBtn.addEventListener('click', async (event) => {
        event.preventDefault();

        const newPassword = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (!newPassword || !confirmPassword) {
            alert('Please enter both password fields.');
            return;
        }

        if (newPassword !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }

        // Update user's password
        const { error } = await database.auth.updateUser({
            password: newPassword,
        });

        if (error) {
            alert('Password reset failed: ' + error.message);
        } else {
            alert('Password reset successful!');
            window.location.href = 'login.html';
        }
    });
});
