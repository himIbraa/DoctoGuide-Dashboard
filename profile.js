const supabaseUrl = 'https://gkgupdxpofpowtfwcufj.supabase.co';
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrZ3VwZHhwb2Zwb3d0ZndjdWZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTMxMzM2NDcsImV4cCI6MjAyODcwOTY0N30.YQ1gz3dYcCVoA874jZDQ8-YPh02ib1wl1AWxZwQyXtE";
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

const getAdminProfileForm = async () => {
    let profileForm = document.getElementById("profile-form");
    let dr = "";
    const res = await database.from("admin").select("*").limit(1);

    if (res.data) {
        for (var i in res.data) {
            dr = `<div class="row form-row">
            <div class="col-12">
                <div class="form-group">
                    <label>Name</label>
                    <input type="text" id="admin-name" class="form-control" value="${res.data[i].name}">
                </div>
            </div>
            <div class="col-12">
                <div class="form-group">
                    <label>Date of Birth</label>
                    <div class="cal-icon">
                        <input type="text" id="admin-dob" class="form-control" value="${res.data[i].date_of_birth}">
                    </div>
                </div>
            </div>
            <div class="col-12 col-sm-6">
                <div class="form-group">
                    <label>Email ID</label>
                    <input type="email" id="admin-email" class="form-control" value="${res.data[i].email}">
                </div>
            </div>
            <div class="col-12 col-sm-6">
                <div class="form-group">
                    <label>Mobile</label>
                    <input type="text" id="admin-mobile" value="${res.data[i].mobile}" class="form-control">
                </div>
            </div>
            <div class="col-12">
                <h5 class="form-title"><span>Address</span></h5>
            </div>
            <div class="col-12">
                <div class="form-group">
                    <label>Address</label>
                    <input type="text" id="admin-address" class="form-control" value="${res.data[i].address}">
                </div>
            </div>
            <div class="col-12 col-sm-6">
                <div class="form-group">
                    <label>City</label>
                    <input type="text" id="admin-city" class="form-control" value="${res.data[i].city}">
                </div>
            </div>
            <div class="col-12 col-sm-6">
                <div class="form-group">
                    <label>State</label>
                    <input type="text" id="admin-state" class="form-control" value="${res.data[i].state}">
                </div>
            </div>
            <div class="col-12 col-sm-6">
                <div class="form-group">
                    <label>Zip Code</label>
                    <input type="text" id="admin-zip" class="form-control" value="${res.data[i].zip_code}">
                </div>
            </div>
            <div class="col-12 col-sm-6">
                <div class="form-group">
                    <label>Country</label>
                    <input type="text" id="admin-country" class="form-control" value="${res.data[i].country}">
                </div>
            </div>
        </div>
        <button type="submit" class="btn btn-primary btn-block">Save Changes</button>`;
        }
        profileForm.innerHTML = dr; 

        // Attach form submission event handler
        profileForm.onsubmit = async (event) => {
            event.preventDefault(); // Prevent form from reloading the page
            await updateAdminProfile();
        }
    }
}

const updateAdminProfile = async () => {
    const name = document.getElementById("admin-name").value;
    const date_of_birth = document.getElementById("admin-dob").value;
    const email = document.getElementById("admin-email").value;
    const mobile = document.getElementById("admin-mobile").value;
    const address = document.getElementById("admin-address").value;
    const city = document.getElementById("admin-city").value;
    const state = document.getElementById("admin-state").value;
    const zip_code = document.getElementById("admin-zip").value;
    const country = document.getElementById("admin-country").value;

    const { error } = await database
        .from("admin")
        .update({
            name,
            date_of_birth,
            email,
            mobile,
            address,
            city,
            state,
            zip_code,
            country
        })
        .eq("id", 1); // Assuming there's only one row with an "id" of 1

    if (error) {
        console.error("Error updating admin profile:", error.message);
        alert("Failed to update profile. Please try again.");
    } else {
        alert("Profile updated successfully!");
        getAdminProfile(); // Refresh the profile data
    }
}

const getAdminProfile = async () => {
    let profile = document.getElementById("profile");
    let dr = "";
    const res = await database.from("admin").select("*").limit(1);

    if (res.data) {
        for (var i in res.data) {
            dr = `<div class="card-body">
            <h5 class="card-title d-flex justify-content-between">
                <span>Personal Details</span>
                <a class="edit-link" data-toggle="modal" href="#edit_personal_details"><i class="fa fa-edit mr-1"></i>Edit</a>
            </h5>
            <div class="row">
                <p class="col-sm-2 text-muted text-sm-right mb-0 mb-sm-3">Name</p>
                <p class="col-sm-10">${res.data[i].name}</p>
            </div>
            <div class="row">
                <p class="col-sm-2 text-muted text-sm-right mb-0 mb-sm-3">Date of Birth</p>
                <p class="col-sm-10">${res.data[i].date_of_birth}</p>
            </div>
            <div class="row">
                <p class="col-sm-2 text-muted text-sm-right mb-0 mb-sm-3">Email ID</p>
                <p class="col-sm-10">${res.data[i].email}</p>
            </div>
            <div class="row">
                <p class="col-sm-2 text-muted text-sm-right mb-0 mb-sm-3">Mobile</p>
                <p class="col-sm-10">${res.data[i].mobile}</p>
            </div>
            <div class="row">
                <p class="col-sm-2 text-muted text-sm-right mb-0">Address</p>
                <p class="col-sm-10 mb-0">${res.data[i].address}</p>
            </div>
        </div>`;
        }
        profile.innerHTML = dr; 
    }
}

document.addEventListener("DOMContentLoaded", function () {
    getAdminProfile();
    getAdminProfileForm();
});


const getProfile = async () => {
    let consultation = document.getElementById("admin");
    let dr = "";
    const res = await database.from("admin").select("*").limit(1);

    if (res) {
        for (var i in res.data) {
            dr = ` <div class="col-auto profile-image">
                        <a href="#">
                            <img class="rounded-circle" alt="User Image" src="${res.data[i].image}">
                        </a>
                    </div>
                    <div class="col ml-md-n2 profile-user-info" >
                        <h4 class="user-name mb-0">${res.data[i].name}</h4>
                        <h6 class="text-muted">${res.data[i].email}</h6>
                        <div class="user-Location"><i class="fa fa-map-marker"></i> ${res.data[i].state}, ${res.data[i].country}</div>
                        <div class="about-text">${res.data[i].description}</div>
                    </div>`;
        }
        consultation.innerHTML = dr; 
    }
}

document.addEventListener("DOMContentLoaded", function () {
    getProfile();
});





//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Add notifications when consultation requests are suspended
const addNotificationOnSuspended = async () => {
    const { data, error } = await database.from('consultationrequest').select('*').eq('status', 'suspended');

    if (data) {
        for (const request of data) {
            const doctor = await database.from('doctor').select('name').eq('id_doctor', request.did).single();
            const patient = await database.from('patient').select('name').eq('id_patient', request.pid).single();

            if (doctor.data && patient.data) {
                await database.from('notification').insert([{
                    doctor_id: request.did,
                    patient_id: request.pid,
                    read_it: false
                }]);
            }
        }
    }
    if (error) console.error("Error adding notifications:", error.message);
}

// Retrieve and display notifications
const getNotification = async () => {
    let notification = document.getElementById("notifications");
    let badgeCount = 0;
    let dr = "";
    const { data, error } = await database.from("notification").select("*");

    if (data) {
        for (const notificationData of data) {
            const doctorRes = await database.from("doctor").select("name").eq("id_doctor", notificationData.doctor_id).single();
            const patientRes = await database.from("patient").select("name", "picture").eq("id_patient", notificationData.patient_id).single();

            const notificationEntered = notificationData.created_at;
            const notificationEnteredDate = new Date(notificationEntered);
            const today = new Date();

            const timeDifferenceMs = today.getTime() - notificationEnteredDate.getTime();
            const seconds = Math.floor(timeDifferenceMs / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            const remainingMinutes = minutes % 60;
            const remainingHours = hours % 24;

            if (!notificationData.read_it) badgeCount++;

            dr += `<li class="notification-message">
                    <a href="consultation-list.html" onclick="markNotificationRead(${notificationData.id})">
                        <div class="media">
                            <span class="avatar avatar-sm">
                                <img class="avatar-img rounded-circle" alt="User Image" src="${patientRes.data.picture}">
                            </span>
                            <div class="media-body">
                                <p class="noti-details"><span class="noti-title">${patientRes.data.name}</span> has booked her Consultation to <span class="noti-title">Dr. ${doctorRes.data.name}</span></p>
                                <p class="noti-time"><span class="notification-time">${remainingHours} hours ${remainingMinutes} mins ago</span></p>
                            </div>
                        </div>
                    </a>
                </li>`;
        }
        notification.innerHTML = dr;
        document.querySelector(".badge-pill").innerText = badgeCount;
    }
    if (error) console.error("Error fetching notifications:", error.message);
}

// Mark notification as read
const markNotificationRead = async (notificationId) => {
    const { error } = await database.from("notification").update({ read_it: true }).eq("id", notificationId);
    if (error) console.error("Error marking notification as read:", error.message);
    getNotification();
}

// Clear all notifications
const clearAllNotifications = async () => {
    const { error } = await database.from("notification").update({ read_it: true }).eq("read_it", false);
    if (error) console.error("Error clearing notifications:", error.message);
    getNotification();
}

// Event Listeners
document.addEventListener("DOMContentLoaded", function () {
    getNotification();
    addNotificationOnSuspended();

    document.querySelector(".clear-noti").addEventListener("click", clearAllNotifications);
});


async function getProfileHeader() {
    let profileContainer = document.getElementById("profileHeader");
    let profileHtml = "";
    const res = await database.from("admin").select("*").limit(1);

    if (res && res.data && res.data.length > 0) {
        const admin = res.data[0];
        profileHtml = `<a href="#" class="dropdown-toggle nav-link" data-toggle="dropdown">
                    <span class="user-img"><img class="rounded-circle" src="${admin.image}" width="31" alt="${admin.name}"></span>
                    </a>
                    <div class="dropdown-menu">
                    <div class="user-header">
                    <div class="avatar avatar-sm">
                        <img src="${admin.image}" alt="User Image" class="avatar-img rounded-circle">
                    </div>
                    <div class="user-text">
                        <h6>${admin.name}</h6>
                        <p class="text-muted mb-0">${admin.email}</p>
                    </div>
                    </div>
                    <a class="dropdown-item" href="profile.html">My Profile</a>
                    <a class="dropdown-item" href="javascript:logout();">Logout</a>
                    </div>`;
        
        profileContainer.innerHTML = profileHtml;
    }
}
document.addEventListener('DOMContentLoaded', function () {
    getProfileHeader();
});