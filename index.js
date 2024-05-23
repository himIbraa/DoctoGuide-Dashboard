const supabaseUrl = 'https://gkgupdxpofpowtfwcufj.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrZ3VwZHhwb2Zwb3d0ZndjdWZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTMxMzM2NDcsImV4cCI6MjAyODcwOTY0N30.YQ1gz3dYcCVoA874jZDQ8-YPh02ib1wl1AWxZwQyXtE"
const database = supabase.createClient(supabaseUrl, supabaseKey)

console.log(database)

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
    // Load data only if the user is authenticated
    getConsultation();
    getDoctor();
    getPatient();
});

//appointment-list.html
const getConsultation = async () => {
    let consultation = document.getElementById("consultation");
    let dr = "";
    const res = await database.from("consultationPrice").select("*").limit(5);

    if (res) {
        for (var i in res.data) {
            const doctorRes = await database.from("doctor").select("name", "speciality", "picture").eq("id_doctor", res.data[i].id_doctor).single();
            const patientRes = await database.from("patient").select("name", "picture").eq("id_patient", res.data[i].patient_id).single();
            const timestamp = new Date(res.data[i].time);
            const date = timestamp.toISOString().split('T')[0];
            const time = timestamp.toTimeString().split(' ')[0];
            dr += `<tr>
                        <td>
                            <h2 class="table-avatar">
                                <a href="" class="avatar avatar-sm mr-2"><img class="avatar-img rounded-circle" src="${doctorRes.data.picture}" alt="Doctor Image"></a>
                                <a href="">${doctorRes.data.name}</a>
                            </h2>
                        </td>
                        <td>${doctorRes.data.speciality}</td>
                        <td>
                            <h2 class="table-avatar">
                                <a href="" class="avatar avatar-sm mr-2"><img class="avatar-img rounded-circle" src="${patientRes.data.picture}" alt="Patient Image"></a>
                                <a href="">${patientRes.data.name}</a>
                            </h2>
                        </td>
                        <td>${date} <span class="text-primary d-block">${time}</span></td>
                        
                        <td class="text-right">
                            $${res.data[i].price}
                        </td>
                    </tr>`;
        }
        consultation.innerHTML = dr; 
    }
}

document.addEventListener("DOMContentLoaded", function () {
    getConsultation();
});




//doctor-list.html
const getDoctor = async () => {
    let doctor = document.getElementById("doctor");
    let dr = "";
    let check = "";
    const res = await database.from("doctor").select("*").limit(5);

    if (res) {
        for (var i in res.data) {
            if (res.data[i].account_status === true) {
                check = "checked";
            } else {
                check = "";
            }

            dr += `<tr>
                    <td>
                        <h2 class="table-avatar">
                        <a href="" class="avatar avatar-sm mr-2"><img class="avatar-img rounded-circle" src="${res.data[i].picture}" alt="User Image"></a>
                            <a href="">${res.data[i].name}</a>
                        </h2>
                    </td>
                    <td>${res.data[i].speciality}</td>
                    <td>
                    <div class="status-toggle">
                        <input type="checkbox" id="status_${i}" class="check" ${check} disabled>
                        <label for="status_${i}" class="checktoggle">checkbox</label>
                    </div>
                    </td>
                 </tr>`;
        }
        doctor.innerHTML = dr;
    }
}


document.addEventListener("DOMContentLoaded", function () {
    getDoctor();
});

// patient-list.html

const getPatient = async () => {
    let patient = document.getElementById("patient");
    let dr = "";
    const res = await database.from("patient").select("*").limit(5);

    if (res) {
        for (var i in res.data) {
            birthDate = res.data[i].birthDate;
            const today = new Date();
            const dob = new Date(birthDate);

            let age = today.getFullYear() - dob.getFullYear();
            const monthDiff = today.getMonth() - dob.getMonth();

            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
                age--;
            }
            dr += `<tr>
                        <td>
                            <h2 class="table-avatar">
                                <a href="" class="avatar avatar-sm mr-2"><img class="avatar-img rounded-circle" src="${res.data[i].picture}" alt="User Image"></a>
                                <a href="">${res.data[i].name} </a>
                            </h2>
                        </td>
                        <td>${res.data[i].phone}</td>
                        <td>${res.data[i].email}</td>
                    </tr>`;
        }
        patient.innerHTML = dr;
    }
}


document.addEventListener("DOMContentLoaded", function () {
    getPatient();
});



const getDoctorCount = async () => {
    try {
        const res = await database.from("doctor").select("id_doctor").eq("accepted", true);

        if (res && res.data && res.data.length > 0) {
            const doctorCount = res.data.length;
            return doctorCount;
        } else {
            return 0;
        }
    } catch (error) {
        console.error("Error fetching doctor count:", error.message);
        return 0;
    }
};

document.addEventListener("DOMContentLoaded", async function () {
    try {
        const doctorCount = await getDoctorCount();
        const dashCount = document.getElementById("doctor-count");
        if (dashCount) {
            dashCount.textContent = doctorCount.toString();
        }
    } catch (error) {
        console.error("Error updating doctor count on dashboard:", error.message);
    }
});

const getPatientCount = async () => {
    try {
        const res = await database.from("patient").select("id_patient");

        if (res && res.data && res.data.length > 0) {
            const patientCount = res.data.length;
            return patientCount;
        } else {
            return 0;
        }
    } catch (error) {
        console.error("Error fetching patient count:", error.message);
        return 0;
    }
};

const getConsultationPriceCount = async () => {
    try {
        const res = await database.from("consultationPrice").select("id");

        if (res && res.data && res.data.length > 0) {
            const consultationPriceCount = res.data.length;
            return consultationPriceCount;
        } else {
            return 0;
        }
    } catch (error) {
        console.error("Error fetching consultation price count:", error.message);
        return 0;
    }
};

document.addEventListener("DOMContentLoaded", async function () {
    try {
        const patientCount = await getPatientCount();
        const consultationPriceCount = await getConsultationPriceCount();

        const patientDashCount = document.getElementById("patient-count");
        const consultationPriceDashCount = document.getElementById("consultation-count");

        if (patientDashCount) {
            patientDashCount.textContent = patientCount.toString();
        }

        if (consultationPriceDashCount) {
            consultationPriceDashCount.textContent = consultationPriceCount.toString();
        }
    } catch (error) {
        console.error("Error updating counts on dashboard:", error.message);
    }
});

const calculateRevenue = async () => {
    try {
        const res = await database.from("consultationPrice").select("price");

        if (res && res.data && res.data.length > 0) {
            // Calculate the sum of prices
            const totalPrices = res.data.reduce((acc, cur) => acc + cur.price, 0);
            // Calculate revenue (10% of total prices)
            const revenue = totalPrices * 0.1;
            return revenue;
        } else {
            return 0;
        }
    } catch (error) {
        console.error("Error calculating revenue:", error.message);
        return 0;
    }
};

document.addEventListener("DOMContentLoaded", async function () {
    try {
        const revenue = await calculateRevenue();
        const revenueDashCount = document.getElementById("revenue");

        if (revenueDashCount) {
            revenueDashCount.textContent = "$"+revenue.toString();
        }
    } catch (error) {
        console.error("Error updating revenue on dashboard:", error.message);
    }
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