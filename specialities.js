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

let selectedSpecialityId = null;

const getSpeciality = async () => {
    let speciality = document.getElementById("special");
    let sr = "";
    const res = await database.from("speciality").select("*");

    if (res) {
        for (var i in res.data) {
            sr += `<tr>
                    <td>${res.data[i].id}</td>
                    <td>
                        <h2 class="table-avatar">
                            <a href="" class="avatar avatar-sm mr-2">
                                <img class="avatar-img" src="${res.data[i].image}" alt="Speciality">
                            </a>
                            <a href="">${res.data[i].name}</a>
                        </h2>
                    </td>
                    <td class="text-right">
                        <div class="actions">
                            <a class="btn btn-sm bg-success-light edit-speciality" data-id="${res.data[i].id}" data-name="${res.data[i].name}" data-image="${res.data[i].image}" data-toggle="modal" href="#edit_specialities_details">
                                <i class="fe fe-pencil"></i> Edit
                            </a>
                            <a class="btn btn-sm bg-danger-light delete-speciality" data-id="${res.data[i].id}" data-toggle="modal" href="#delete_modal">
                                <i class="fe fe-trash"></i> Delete
                            </a>
                        </div>
                    </td>
                </tr>`;
        }
        speciality.innerHTML = sr;

        // Add click events for edit and delete buttons
        document.querySelectorAll('.edit-speciality').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.target.closest('a').getAttribute('data-id');
                const name = e.target.closest('a').getAttribute('data-name');
                const image = e.target.closest('a').getAttribute('data-image');

                selectedSpecialityId = id;
                document.getElementById("edit_speciality_name").value = name;
                document.getElementById("edit_speciality_image_preview").src = image;
            });
        });

        document.querySelectorAll('.delete-speciality').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.target.closest('a').getAttribute('data-id');
                selectedSpecialityId = id;
            });
        });
    }
}

const addSpeciality = async (event) => {
    event.preventDefault();
    const name = document.getElementById("add_speciality_name").value;
    const id = document.getElementById("add_speciality_id").value;
    const fileInput = document.getElementById("add_speciality_image");
    const file = fileInput.files[0];
    let imageUrl = '';

    if (file) {
        // Upload the image to Supabase Storage (optional if needed)
        const { data, error } = await database.storage.from('specialities').upload(`public/${file.name}`, file, {
            cacheControl: '3600',
            upsert: true
        });

        if (error) {
            console.error("Error uploading image:", error.message);
            return;
        }

        imageUrl = `${supabaseUrl}/storage/v1/object/public/specialities/${file.name}`;
    }

    const { error } = await database.from("speciality").insert([{ id, name, image: imageUrl }]);

    if (error) {
        console.error("Error adding speciality:", error.message);
    } else {
        $('#Add_Specialities_details').modal('hide');
        getSpeciality();
    }
}

const editSpeciality = async (event) => {
    event.preventDefault();
    const name = document.getElementById("edit_speciality_name").value;
    const fileInput = document.getElementById("edit_speciality_image");
    const file = fileInput.files[0];
    let imageUrl = document.getElementById("edit_speciality_image_preview").src;

    if (file) {
        // Upload the new image to Supabase Storage (optional if needed)
        const { data, error } = await database.storage.from('specialities').upload(`public/${file.name}`, file, {
            cacheControl: '3600',
            upsert: true
        });

        if (error) {
            console.error("Error uploading image:", error.message);
            return;
        }

        imageUrl = `${supabaseUrl}/storage/v1/object/public/specialities/${file.name}`;
    }

    const { error } = await database.from("speciality").update({ name, image: imageUrl }).eq("id", selectedSpecialityId);

    if (error) {
        console.error("Error editing speciality:", error.message);
    } else {
        $('#edit_specialities_details').modal('hide');
        getSpeciality();
    }
}

const deleteSpeciality = async () => {
    const { error } = await database.from("speciality").delete().eq("id", selectedSpecialityId);

    if (error) {
        console.error("Error deleting speciality:", error.message);
    } else {
        $('#delete_modal').modal('hide');
        getSpeciality();
    }
}

const searchSpeciality = () => {
    const searchInput = document.getElementById("searchInputSpeciality");
    const filter = searchInput.value.toUpperCase();
    const rows = document.getElementById("special").getElementsByTagName("tr");

    for (let i = 0; i < rows.length; i++) {
        const td = rows[i].getElementsByTagName("td")[1];
        if (td) {
            const textValue = td.textContent || td.innerText;
            if (textValue.toUpperCase().indexOf(filter) > -1) {
                rows[i].style.display = "";
            } else {
                rows[i].style.display = "none";
            }
        }
    }
}

document.addEventListener("DOMContentLoaded", function () {
    getSpeciality();

    document.getElementById("searchFormSpeciality").addEventListener("submit", function (event) {
        event.preventDefault();
        searchSpeciality();
    });

    document.getElementById("add_speciality_form").addEventListener("submit", addSpeciality);
    document.getElementById("edit_speciality_form").addEventListener("submit", editSpeciality);
    document.getElementById("confirm_delete_speciality").addEventListener("click", deleteSpeciality);
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