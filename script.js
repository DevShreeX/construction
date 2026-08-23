/* PSG Polytechnic College - Student Record Auxiliary Scripts & Helper Functions */

// Ensure INITIAL_STUDENT_DATABASE is accessible globally
if (typeof INITIAL_STUDENT_DATABASE === 'undefined') {
  var INITIAL_STUDENT_DATABASE = {
    "25CH07": {
      rollNo: "25CH07",
      name: "Jyothiprabha V.H.",
      course: "Diploma",
      branch: "CHDH / DCN",
      periodOfStudy: "2025 - 2027",
      acRef: "AC / 06 (01) / 16.05.2025",
      dob: "10.01.2008",
      religion: "Hindu",
      bloodGroup: "O +ve",
      communityCategory: "BC",
      differentlyAbled: "No",
      fatherName: "VIJAYAKUMAR",
      motherName: "KRISHNA PRIVAY",
      residentialAddress: "3/76 A, Narayana Naicken Pudur, Kattampatti (P.O), Kinathukadavu, Coimbatore. Pin: 642 202",
      resPin: "642202",
      permanentAddress: "3/76 A, Narayana Naicken Pudur, Kattampatti (P.O), Kinathukadavu, Coimbatore. Pin: 642 202",
      permPin: "642202",
      studentMobile: "8122359816",
      fatherMobile: "9865911633",
      motherMobile: "9578808816",
      emisId: "2012860630",
      umisId: "-",
      bankDetails: "Indian Bank / Kattampatti",
      parentOccupationIncome: "Business and ₹ 2,48,000",
      cgpa: 9.80,
      photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80",
      fatherPhotoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
      motherPhotoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80"
    },
    "25EH08": {
      rollNo: "25EH08",
      name: "Santhosh Kumar K.",
      course: "Diploma",
      branch: "DGN",
      periodOfStudy: "2025 - 2027",
      dob: "12.04.2007",
      religion: "Hindu",
      bloodGroup: "B +ve",
      communityCategory: "BC",
      differentlyAbled: "No",
      fatherName: "KUMARAN S",
      motherName: "LATHA K",
      studentMobile: "9842100223",
      fatherMobile: "9842100888",
      motherMobile: "9842100777",
      emisId: "2012860644",
      cgpa: 9.25
    },
    "25EH01": {
      rollNo: "25EH01",
      name: "Abishek R.",
      course: "Diploma",
      branch: "DGN",
      periodOfStudy: "2025 - 2027",
      dob: "08.08.2007",
      religion: "Hindu",
      bloodGroup: "A +ve",
      communityCategory: "MBC",
      differentlyAbled: "No",
      fatherName: "RAMANATHAN P",
      motherName: "SARASWATHI R",
      studentMobile: "9789012399",
      fatherMobile: "9789012388",
      motherMobile: "9789012377",
      emisId: "2012860655",
      cgpa: 9.10
    },
    "25CH01": {
      rollNo: "25CH01",
      name: "Arun Kumar R.",
      course: "Diploma",
      branch: "DCN",
      periodOfStudy: "2025 - 2027",
      dob: "14.05.2007",
      religion: "Hindu",
      bloodGroup: "A +ve",
      communityCategory: "BC",
      differentlyAbled: "No",
      fatherName: "RAMESH CHANDRAN",
      motherName: "SUJATHA R",
      studentMobile: "9842100112",
      fatherMobile: "9842100999",
      motherMobile: "9842100888",
      emisId: "2012860611",
      cgpa: 8.90
    },
    "25CH02": {
      rollNo: "25CH02",
      name: "Deepika M.",
      course: "Diploma",
      branch: "DCN",
      periodOfStudy: "2025 - 2027",
      dob: "22.09.2007",
      religion: "Hindu",
      bloodGroup: "B +ve",
      communityCategory: "MBC",
      differentlyAbled: "No",
      fatherName: "MURUGAN K",
      motherName: "CHITRA M",
      studentMobile: "9789012345",
      fatherMobile: "9789012344",
      motherMobile: "9789012343",
      emisId: "2012860612",
      cgpa: 9.45
    }
  };
}

// Toast notification display
function showToast(message) {
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toastText');
  if (toast && toastText) {
    toastText.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  } else {
    alert(message);
  }
}

// Image File Upload Preview Helper
function previewPhoto(event, imgId, placeholderId) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const img = document.getElementById(imgId);
      const placeholder = document.getElementById(placeholderId);
      if (img) {
        img.src = e.target.result;
        img.style.display = 'block';
      }
      if (placeholder) {
        placeholder.style.display = 'none';
      }
      showToast('Photo uploaded and updated successfully!');
    };
    reader.readAsDataURL(file);
  }
}

// Quick Load Record by Roll No
function quickLoadRecord(rollNo) {
  const searchInput = document.getElementById('rollSearchInput');
  const dropdown = document.getElementById('rollSelectDropdown');
  if (searchInput) searchInput.value = rollNo;
  if (dropdown) dropdown.value = rollNo;
  
  if (typeof window.loadStudentByRoll === 'function') {
    window.loadStudentByRoll(rollNo);
  }
  showToast('Loaded student record for Roll No: ' + rollNo);
}

// Medical Leave Application Helper
function addMedicalLeaveRecord() {
  const cause = document.getElementById('medCause')?.value || 'Medical Leave';
  const hospital = document.getElementById('medHospital')?.value || 'PSG Hospitals';
  const fromDate = document.getElementById('medFromDate')?.value || new Date().toISOString().split('T')[0];
  const toDate = document.getElementById('medToDate')?.value || new Date().toISOString().split('T')[0];
  const days = document.getElementById('medTotalDays')?.value || '1';
  const cert = document.getElementById('medCertificate')?.value || 'Yes (Attached)';

  const table = document.getElementById('medLeaveTable')?.getElementsByTagName('tbody')[0];
  if (table) {
    const newRow = table.insertRow(0);
    const id = 'ML-2025-0' + (table.rows.length);
    newRow.innerHTML = `
      <td class="center">${id}</td>
      <td class="center">${fromDate}</td>
      <td class="center">${toDate}</td>
      <td class="center">${days}</td>
      <td>${cause}</td>
      <td>${hospital}</td>
      <td class="center" style="color:#10b981; font-weight:700;">${cert.includes('Yes') ? 'Verified' : 'Pending'}</td>
      <td class="center"><span style="background:#dcfce7; color:#15803d; padding:2px 8px; border-radius:10px; font-weight:700;">APPROVED</span></td>
    `;
    showToast('Medical Leave application submitted & approved successfully!');
  }
}

// Simulated Attendance Portal Sync
function simulatePortalSync() {
  showToast('Syncing live attendance records with PSG Internal Server...');
  setTimeout(() => {
    showToast('✅ Live attendance records synced successfully with PSG Faculty Server.');
  }, 1000);
}

// Export functions for global access
window.showToast = showToast;
window.previewPhoto = previewPhoto;
window.quickLoadRecord = quickLoadRecord;
window.addMedicalLeaveRecord = addMedicalLeaveRecord;
window.simulatePortalSync = simulatePortalSync;
