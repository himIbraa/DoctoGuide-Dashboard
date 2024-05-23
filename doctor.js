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

let itemsPerPage = 10; // Default to 10 rows per page
let currentPage = 1;
let totalItems = 0;

const getDoctor = async (page = 1) => {
    let doctor = document.getElementById("doctor");
    let dr = "";
    let check = "";
    const offset = (page - 1) * itemsPerPage;
    const res = await database
        .from("doctor")
        .select("*", { count: "exact" })
        .eq("accepted", true)
        .range(offset, offset + itemsPerPage - 1);

    if (res.data) {
        totalItems = res.count;
        for (var i in res.data) {
            if (res.data[i].account_status === true) {
                check = "checked";
            } else {
                check = "";
            }
            const timestamp = new Date(res.data[i].created_at);
            const date = timestamp.toISOString().split('T')[0];
            const time = timestamp.toTimeString().split(' ')[0];

            dr += `<tr>
                    <td>
                        <h2 class="table-avatar">
                            <a href="" class="avatar avatar-sm mr-2"><img class="avatar-img rounded-circle" src="${res.data[i].picture}" alt="User Image"></a>
                            <a href="">${res.data[i].name}</a>
                        </h2>
                    </td>
                    <td>${res.data[i].speciality}</td>
                    <td>${date} <br><small>${time}</small></td>
                    <td>${res.data[i].phone}</td>
                    <td>
                    <div class="status-toggle">
                        <input type="checkbox" id="status_${i}" class="check" ${check} disabled>
                        <label for="status_${i}" class="checktoggle">checkbox</label>
                    </div>
                    </td>
                </tr>`;
        }
        doctor.innerHTML = dr;
        updatePagination(page);
    }
}

const updatePagination = (page) => {
    const pagination = document.getElementById("pagination");
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    let paginationHTML = "";

    if (page > 1) {
        paginationHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page - 1}">Previous</a></li>`;
    } else {
        paginationHTML += `<li class="page-item disabled"><a class="page-link" href="#">Previous</a></li>`;
    }

    for (let i = 1; i <= totalPages; i++) {
        if (i === page) {
            paginationHTML += `<li class="page-item active"><a class="page-link" href="#">${i}</a></li>`;
        } else {
            paginationHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
        }
    }

    if (page < totalPages) {
        paginationHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page + 1}">Next</a></li>`;
    } else {
        paginationHTML += `<li class="page-item disabled"><a class="page-link" href="#">Next</a></li>`;
    }

    pagination.innerHTML = paginationHTML;

    Array.from(document.querySelectorAll("#pagination a")).forEach((element) => {
        element.addEventListener("click", (event) => {
            event.preventDefault();
            const targetPage = parseInt(event.target.getAttribute("data-page"));
            if (!isNaN(targetPage)) {
                currentPage = targetPage;
                getDoctor(currentPage);
            }
        });
    });
}

const updateRowsPerPage = () => {
    const rowsPerPageSelector = document.getElementById("rowsPerPage");
    itemsPerPage = parseInt(rowsPerPageSelector.value);
    currentPage = 1; // Reset to the first page
    getDoctor(currentPage);
}

const searchDoctor = () => {
    const searchInput = document.getElementById("searchInputDoctor");
    const filter = searchInput.value.toUpperCase();
    const rows = document.getElementById("doctor").getElementsByTagName("tr");

    for (let i = 0; i < rows.length; i++) {
        const td = rows[i].getElementsByTagName("td")[0];
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
    getDoctor(currentPage);

    const searchFormDoctor = document.getElementById("searchFormDoctor");
    searchFormDoctor.addEventListener("submit", function (event) {
        event.preventDefault();
        searchDoctor();
    });

    const rowsPerPageSelector = document.getElementById("rowsPerPage");
    rowsPerPageSelector.addEventListener("change", updateRowsPerPage);
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