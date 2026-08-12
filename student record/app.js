// Student Record Web Application Controller

let studentDatabase = {};
let currentRollNo = "25CH07";
let activeSemester = 3;

// Initialize App
document.addEventListener("DOMContentLoaded", () => {
    loadDatabase();
    setupEventListeners();
    loadStudentByRoll(currentRollNo);
});

// Load database from LocalStorage or fall back to initial data
function loadDatabase() {
    const savedData = localStorage.getItem("psg_student_records");
    if (savedData) {
        try {
            studentDatabase = JSON.parse(savedData);
            // Auto upgrade if 25CH07 is missing
            if (!studentDatabase["25CH07"]) {
                studentDatabase = INITIAL_STUDENT_DATABASE;
                saveDatabase();
            }
        } catch (e) {
            console.error("Error parsing saved student database", e);
            studentDatabase = INITIAL_STUDENT_DATABASE;
            saveDatabase();
        }
    } else {
        studentDatabase = INITIAL_STUDENT_DATABASE;
        saveDatabase();
    }
}

function saveDatabase() {
    localStorage.setItem("psg_student_records", JSON.stringify(studentDatabase));
}

// Setup Event Listeners
function setupEventListeners() {
    // Search Box Listener (Search on Enter key or button click)
    const searchInput = document.getElementById("rollNoSearchInput");
    const searchBtn = document.getElementById("searchBtn");

    searchInput.addEventListener("keyup", (e) => {
        if (e.key === "Enter") {
            performRollNoSearch();
        }
    });

    searchBtn.addEventListener("click", performRollNoSearch);

    // Tab Navigation
    const tabButtons = document.querySelectorAll(".tab-btn");
    tabButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const targetTab = btn.getAttribute("data-tab");
            
            // Toggle active button
            tabButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            // Toggle active tab pane
            document.querySelectorAll(".tab-pane").forEach(pane => {
                pane.classList.remove("active");
            });
            document.getElementById(targetTab).classList.add("active");
        });
    });
}

// Perform Roll No Search
function performRollNoSearch() {
    const query = document.getElementById("rollNoSearchInput").value.trim().toUpperCase();
    if (!query) {
        alert("Please enter a Roll No (e.g. 25EH07)");
        return;
    }
    loadStudentByRoll(query);
}

// Main Function: Load Student Record by Roll No
function loadStudentByRoll(rollNo) {
    const formattedRoll = rollNo.trim().toUpperCase();
    const student = studentDatabase[formattedRoll];

    if (!student) {
        const createNew = confirm(`No record found for Roll No "${formattedRoll}". Would you like to create a new record for this Roll No?`);
        if (createNew) {
            openNewStudentModal(formattedRoll);
        }
        return;
    }

    currentRollNo = formattedRoll;

    // Update Search Input & Chips state
    document.getElementById("rollNoSearchInput").value = currentRollNo;
    document.querySelectorAll(".chip").forEach(chip => {
        if (chip.textContent.includes(currentRollNo)) {
            chip.classList.add("active");
        } else {
            chip.classList.remove("active");
        }
    });

    // Populate Sidebar Photos & Info
    const defaultStudentImg = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80";
    const defaultFatherImg = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80";
    const defaultMotherImg = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80";

    const sPhoto = student.photoUrl || defaultStudentImg;
    const fPhoto = student.fatherPhotoUrl || defaultFatherImg;
    const mPhoto = student.motherPhotoUrl || defaultMotherImg;

    if (document.getElementById("sidebarStudentPhoto")) document.getElementById("sidebarStudentPhoto").src = sPhoto;
    if (document.getElementById("sidebarFatherPhoto")) document.getElementById("sidebarFatherPhoto").src = fPhoto;
    if (document.getElementById("sidebarMotherPhoto")) document.getElementById("sidebarMotherPhoto").src = mPhoto;

    document.getElementById("sidebarName").textContent = student.name;
    document.getElementById("sidebarRollNo").textContent = `ROLL NO: ${student.rollNo}`;
    document.getElementById("sidebarCourse").textContent = student.course;
    document.getElementById("sidebarBranch").textContent = student.branch;
    document.getElementById("sidebarPeriod").textContent = student.periodOfStudy;
    document.getElementById("sidebarDob").textContent = student.dob;
    document.getElementById("sidebarMobile").textContent = student.studentMobile;
    document.getElementById("sidebarCgpa").textContent = student.cgpa ? student.cgpa.toFixed(2) : "N/A";
    document.getElementById("sidebarEmis").textContent = student.emisId || "-";
    document.getElementById("sidebarUmis").textContent = student.umisId || "-";
    document.getElementById("sidebarBlood").textContent = student.bloodGroup;
    document.getElementById("sidebarCategory").textContent = student.communityCategory;

    // Populate TAB 1: Personal Details, Photos & Header
    document.getElementById("recCourse").textContent = student.course;
    document.getElementById("recBranch").textContent = student.branch;
    document.getElementById("recPeriod").textContent = student.periodOfStudy;
    document.getElementById("recRollNo").textContent = student.rollNo;
    document.getElementById("recName").textContent = student.name;
    document.getElementById("recDob").textContent = student.dob;
    document.getElementById("recReligion").textContent = student.religion;
    document.getElementById("recBloodGroup").textContent = student.bloodGroup;
    document.getElementById("recCommunity").textContent = student.communityCategory;
    document.getElementById("recDifferentlyAbled").textContent = student.differentlyAbled;
    document.getElementById("recFatherName").textContent = student.fatherName;
    document.getElementById("recMotherName").textContent = student.motherName;
    document.getElementById("recFatherMobile").textContent = student.fatherMobile;
    document.getElementById("recMotherMobile").textContent = student.motherMobile;
    document.getElementById("recStudentMobile").textContent = student.studentMobile;
    document.getElementById("recIncome").textContent = student.parentOccupationIncome;
    document.getElementById("recResAddress").textContent = student.residentialAddress;
    document.getElementById("recResPin").textContent = student.resPin || "642202";
    document.getElementById("recPermAddress").textContent = student.permanentAddress;
    document.getElementById("recPermPin").textContent = student.permPin || "642202";
    document.getElementById("recEmis").textContent = student.emisId;
    document.getElementById("recUmis").textContent = student.umisId;
    document.getElementById("recBank").textContent = student.bankDetails;

    // Family Photos in Tab 1
    if (document.getElementById("recMotherPhoto")) document.getElementById("recMotherPhoto").src = mPhoto;
    if (document.getElementById("recFatherPhoto")) document.getElementById("recFatherPhoto").src = fPhoto;
    if (document.getElementById("recStudentTabPhoto")) document.getElementById("recStudentTabPhoto").src = sPhoto;
    if (document.getElementById("recMotherPhotoName")) document.getElementById("recMotherPhotoName").textContent = student.motherName || "Mother";
    if (document.getElementById("recFatherPhotoName")) document.getElementById("recFatherPhotoName").textContent = student.fatherName || "Father";
    if (document.getElementById("recStudentPhotoName")) document.getElementById("recStudentPhotoName").textContent = student.name || "Student";

    // Render Studies Table
    renderStudiesTable(student.studies || []);

    // Populate TAB 2: Academic Marks
    document.getElementById("academicsCgpaBadge").textContent = student.cgpa ? student.cgpa.toFixed(2) : "N/A";
    switchSemester(activeSemester);

    // Populate TAB 3: Annexure I
    renderAnnexure1(student.annexure1 || {});

    // Populate TAB 4: Annexure II
    renderAnnexure2(student.annexure2 || {});
}

// Render Prior Qualifications Table
function renderStudiesTable(studies) {
    const tbody = document.getElementById("studiesTableBody");
    tbody.innerHTML = "";
    if (studies.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;">No prior studies recorded.</td></tr>`;
        return;
    }

    studies.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><strong>${item.class}</strong></td>
            <td>${item.period}</td>
            <td>${item.school}</td>
            <td>${item.marks}</td>
            <td><span class="pill pill-success">${item.percentage}</span></td>
            <td><code style="font-family:var(--font-mono);">${item.regNo}</code></td>
            <td>${item.remarks}</td>
        `;
        tbody.appendChild(row);
    });
}

// Switch Semester View (1 to 6)
function switchSemester(semNum) {
    activeSemester = semNum;
    const student = studentDatabase[currentRollNo];
    if (!student || !student.academics) return;

    // Update active sem button
    const buttons = document.querySelectorAll(".sem-btn");
    buttons.forEach((btn, idx) => {
        if (idx + 1 === semNum) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });

    document.getElementById("currentSemTitle").textContent = `Semester ${semNum} - Course Performance`;
    document.getElementById("semHostelStatus").textContent = student.academics.hostellerStatus || "Day Scholar";
    document.getElementById("semScholarship").textContent = student.academics.scholarships || "None";

    const semData = student.academics.semesters ? student.academics.semesters[semNum] : null;
    const tbody = document.getElementById("marksTableBody");
    tbody.innerHTML = "";

    if (!semData || !semData.subjects || semData.subjects.length === 0) {
        document.getElementById("semCgpa").textContent = "N/A";
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 2rem; color: var(--text-muted);">No courses/marks recorded yet for Semester ${semNum}.</td></tr>`;
        return;
    }

    document.getElementById("semCgpa").textContent = semData.semCgpa ? semData.semCgpa.toFixed(2) : "N/A";

    semData.subjects.forEach((sub, idx) => {
        const row = document.createElement("tr");
        let gradeClass = "grade-o";
        if (sub.grade === "A+") gradeClass = "grade-aplus";
        if (sub.grade === "A") gradeClass = "grade-a";

        row.innerHTML = `
            <td>${idx + 1}</td>
            <td>
                <strong>${sub.name}</strong>
                <div style="font-size:0.75rem; color:var(--text-muted); font-family:var(--font-mono);">${sub.code}</div>
            </td>
            <td><span class="pill pill-success">${sub.attendance}</span></td>
            <td><strong style="color:var(--primary);">${sub.ca} / 30</strong></td>
            <td>
                <span class="grade-badge ${gradeClass}">${sub.grade}</span>
                <span style="font-size:0.75rem; color:var(--text-muted); margin-left:6px;">(${sub.attempt || 'Passed'})</span>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Render Annexure I
function renderAnnexure1(annexure1) {
    // Mandatory & Additional Courses
    const mandBody = document.getElementById("mandatoryCoursesBody");
    mandBody.innerHTML = "";
    (annexure1.mandatoryCourses || []).forEach(c => {
        mandBody.innerHTML += `<tr><td>${c.sem}</td><td>${c.name}</td><td><span class="pill pill-success">${c.status}</span></td></tr>`;
    });

    const addBody = document.getElementById("additionalCoursesBody");
    addBody.innerHTML = "";
    (annexure1.additionalCourses || []).forEach(c => {
        addBody.innerHTML += `<tr><td>${c.sem}</td><td>${c.name}</td><td><span class="pill pill-success">${c.status}</span></td></tr>`;
    });

    // Internships
    const intBody = document.getElementById("internshipBody");
    intBody.innerHTML = "";
    (annexure1.internships || []).forEach(i => {
        intBody.innerHTML += `
            <tr>
                <td><strong>${i.company}</strong></td>
                <td>${i.description}</td>
                <td>${i.duration}</td>
                <td><span class="pill">${i.skills}</span></td>
            </tr>
        `;
    });

    // Projects
    const projBody = document.getElementById("projectBody");
    projBody.innerHTML = "";
    (annexure1.projects || []).forEach(p => {
        projBody.innerHTML += `
            <tr>
                <td><strong>${p.title}</strong></td>
                <td>${p.guide}</td>
                <td>${p.domain}</td>
                <td><code>${p.tools}</code></td>
            </tr>
        `;
    });

    // Placements
    const placeBody = document.getElementById("placementBody");
    placeBody.innerHTML = "";
    (annexure1.placements || []).forEach(pl => {
        placeBody.innerHTML += `
            <tr>
                <td><strong>${pl.company}</strong></td>
                <td>${pl.designation}</td>
                <td><strong style="color:var(--success);">${pl.salary}</strong></td>
                <td>${pl.joiningDate}</td>
                <td>${pl.location}</td>
            </tr>
        `;
    });

    // Final Results
    const res = annexure1.finalResults || {};
    document.getElementById("resGraduation").textContent = res.graduationDate || "N/A";
    document.getElementById("resPercentage").textContent = res.overallPercentage || "N/A";
    document.getElementById("resAward").textContent = res.awardClass || "N/A";
}

// Render Annexure II
function renderAnnexure2(annexure2) {
    // Sports
    const sportsBody = document.getElementById("sportsBody");
    sportsBody.innerHTML = "";
    (annexure2.sports || []).forEach(s => {
        sportsBody.innerHTML += `<tr><td><strong>${s.sport}</strong></td><td>${s.level}</td><td>${s.role}</td><td><span class="pill pill-success">${s.achievements}</span></td></tr>`;
    });

    // Union
    const unionBody = document.getElementById("unionBody");
    unionBody.innerHTML = "";
    (annexure2.unionActivities || []).forEach(u => {
        unionBody.innerHTML += `<tr><td><strong>${u.club}</strong></td><td>${u.role}</td><td>${u.activities}</td><td>${u.achievements}</td></tr>`;
    });

    // Competitions
    const compBody = document.getElementById("competitionsBody");
    compBody.innerHTML = "";
    (annexure2.competitions || []).forEach(cp => {
        compBody.innerHTML += `<tr><td><strong>${cp.event}</strong></td><td>${cp.conductedBy}</td><td>${cp.type}</td><td><span class="pill pill-success">${cp.achievements}</span></td></tr>`;
    });

    document.getElementById("facultyRemarks").textContent = annexure2.remarks || "No remarks entered.";
}

// Modal Handlers
function openNewStudentModal(defaultRoll = "") {
    document.getElementById("modalTitle").textContent = "Add New Student Record";
    document.getElementById("studentForm").reset();
    document.getElementById("formRollNo").value = defaultRoll;
    document.getElementById("studentModal").classList.remove("hidden");
}

function editCurrentStudent() {
    const student = studentDatabase[currentRollNo];
    if (!student) return;

    document.getElementById("modalTitle").textContent = `Edit Record - ${student.rollNo}`;
    document.getElementById("formRollNo").value = student.rollNo;
    document.getElementById("formName").value = student.name;
    document.getElementById("formBranch").value = student.branch;
    document.getElementById("formPeriod").value = student.periodOfStudy;
    document.getElementById("formDob").value = student.dob;
    document.getElementById("formBlood").value = student.bloodGroup;
    document.getElementById("formFather").value = student.fatherName;
    document.getElementById("formMother").value = student.motherName;
    document.getElementById("formMobile").value = student.studentMobile;
    document.getElementById("formAddress").value = student.residentialAddress;
    document.getElementById("formEmis").value = student.emisId;
    document.getElementById("formCgpa").value = student.cgpa;

    document.getElementById("studentModal").classList.remove("hidden");
}

function closeStudentModal() {
    document.getElementById("studentModal").classList.add("hidden");
}

function saveStudentForm(event) {
    event.preventDefault();
    const roll = document.getElementById("formRollNo").value.trim().toUpperCase();
    if (!roll) return;

    // Existing or new object
    const existing = studentDatabase[roll] || {
        rollNo: roll,
        course: "Diploma",
        studies: [],
        academics: { hostellerStatus: "Day Scholar", scholarships: "None", semesters: {} },
        annexure1: { mandatoryCourses: [], additionalCourses: [], internships: [], projects: [], placements: [], finalResults: {} },
        annexure2: { sports: [], unionActivities: [], competitions: [], remarks: "" }
    };

    existing.name = document.getElementById("formName").value.trim();
    existing.branch = document.getElementById("formBranch").value.trim();
    existing.periodOfStudy = document.getElementById("formPeriod").value.trim() || "2025 - 2027";
    existing.dob = document.getElementById("formDob").value.trim();
    existing.bloodGroup = document.getElementById("formBlood").value.trim();
    existing.fatherName = document.getElementById("formFather").value.trim();
    existing.motherName = document.getElementById("formMother").value.trim();
    existing.studentMobile = document.getElementById("formMobile").value.trim();
    existing.residentialAddress = document.getElementById("formAddress").value.trim();
    existing.permanentAddress = document.getElementById("formAddress").value.trim();
    existing.emisId = document.getElementById("formEmis").value.trim();
    existing.cgpa = parseFloat(document.getElementById("formCgpa").value) || 9.0;

    studentDatabase[roll] = existing;
    saveDatabase();
    closeStudentModal();
    loadStudentByRoll(roll);
    alert(`Student Record for Roll No "${roll}" saved successfully!`);
}

// Print Functionality
function printStudentRecord() {
    window.print();
}

// Global Window Exports for Inline HTML Handlers & Modules
if (typeof window !== "undefined") {
    window.loadStudentByRoll = loadStudentByRoll;
    window.openNewStudentModal = openNewStudentModal;
    window.closeStudentModal = closeStudentModal;
    window.editCurrentStudent = editCurrentStudent;
    window.saveStudentForm = saveStudentForm;
    window.printStudentRecord = printStudentRecord;
    window.switchSemester = switchSemester;
    window.performRollNoSearch = performRollNoSearch;
}
