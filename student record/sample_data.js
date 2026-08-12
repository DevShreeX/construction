/* Sample Student Database matching the PSG Polytechnic College Student Record images */
const INITIAL_STUDENT_DATABASE = {
    "25CH07": {
        rollNo: "25CH07",
        name: "Jyothiprabha V.K.",
        course: "Diploma",
        branch: "DCN",
        periodOfStudy: "2025 - 2027",
        acRef: "AC / 06 (01) / 16.05.2025",
        dob: "10.01.2008",
        religion: "Hindu",
        bloodGroup: "O+ve",
        communityCategory: "BC",
        differentlyAbled: "No",
        fatherName: "VIJAYAKUMAR",
        motherName: "KRISHNA PRIYA V",
        residentialAddress: "3/76 A, Narayana Naicken Pudur, Kattampatti (P.O), Kinathukaduvu, Coimbatore",
        resPin: "642202",
        permanentAddress: "3/76 A, Narayana Naicken Pudur, Kattampatti (P.O), Kinathukaduvu, Coimbatore",
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
        motherPhotoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80",
        
        // Prior Qualifications (Details of Studies)
        studies: [
            { class: "SSLC", period: "2022-23", school: "SDM", marks: "492/500", percentage: "98.4 %", regNo: "5276266", remarks: "-" },
            { class: "HSC / Voc", period: "2024-25", school: "SDM", marks: "550/600", percentage: "91.6 %", regNo: "1244378", remarks: "-" },
            { class: "ITI (2 years)", period: "-", school: "-", marks: "-", percentage: "-", regNo: "-", remarks: "-" }
        ],

        // Academic Semesters Data (Matching Image 3 - CA Mark out of 30)
        academics: {
            hostellerStatus: "Day Scholar",
            scholarships: "BC Welfare Scholarship",
            semesters: {
                1: {
                    semCgpa: 9.75,
                    subjects: [
                        { code: "MATH101", name: "COMMUNICATION ENGLISH", attendance: "100%", ca: "30", grade: "O", attempt: "11/24" },
                        { code: "MATH102", name: "ENGINEERING MATHEMATICS - I", attendance: "98%", ca: "30", grade: "O", attempt: "11/24" },
                        { code: "PHYS103", name: "ENGINEERING PHYSICS", attendance: "100%", ca: "29", grade: "A+", attempt: "11/24" },
                        { code: "CHEM104", name: "ENGINEERING CHEMISTRY", attendance: "96%", ca: "30", grade: "O", attempt: "11/24" },
                        { code: "LAB105", name: "PHYSICS & CHEMISTRY LAB", attendance: "100%", ca: "30", grade: "O", attempt: "11/24" }
                    ]
                },
                2: {
                    semCgpa: 9.80,
                    subjects: [
                        { code: "MATH201", name: "ENGINEERING MATHEMATICS - II", attendance: "100%", ca: "30", grade: "O", attempt: "04/25" },
                        { code: "CS202", name: "BASICS OF COMPUTER ENGG", attendance: "100%", ca: "30", grade: "O", attempt: "04/25" },
                        { code: "EE203", name: "ELECTRICAL & ELECTRONICS LAB", attendance: "98%", ca: "29", grade: "A+", attempt: "04/25" },
                        { code: "CS204", name: "C PROGRAMMING LAB", attendance: "100%", ca: "30", grade: "O", attempt: "04/25" }
                    ]
                },
                3: {
                    semCgpa: 9.90,
                    subjects: [
                        { code: "DCN301", name: "STATISTICS", attendance: "100%", ca: "30", grade: "O", attempt: "11/25" },
                        { code: "DCN302", name: "PRINCIPLES OF DIGITAL ELE.", attendance: "100%", ca: "30", grade: "O", attempt: "11/25" },
                        { code: "DCN303", name: "DATA COMMUNICATIONS", attendance: "100%", ca: "30", grade: "O", attempt: "11/25" },
                        { code: "DCN304", name: "DATA STRUCTURES", attendance: "100%", ca: "30", grade: "O", attempt: "11/25" },
                        { code: "DCN305", name: "DIGITAL ELE. LAB", attendance: "100%", ca: "30", grade: "O", attempt: "11/25" },
                        { code: "DCN306", name: "DCN LAB", attendance: "100%", ca: "30", grade: "O", attempt: "11/25" },
                        { code: "DCN307", name: "DATA STRUCTURES LAB", attendance: "100%", ca: "30", grade: "O", attempt: "11/25" },
                        { code: "DCN308", name: "CHIS LAB", attendance: "100%", ca: "30", grade: "O", attempt: "11/25" },
                        { code: "DCN309", name: "AIP LAB", attendance: "100%", ca: "30", grade: "O", attempt: "11/25" },
                        { code: "DCN310", name: "TAMIL MARABU", attendance: "100%", ca: "30", grade: "O", attempt: "11/25" },
                        { code: "DCN311", name: "CA LAB", attendance: "100%", ca: "30", grade: "O", attempt: "11/25" }
                    ]
                },
                4: {
                    semCgpa: 9.85,
                    subjects: [
                        { code: "DCN401", name: "COMPUTER NETWORKS & TCP/IP", attendance: "100%", ca: "30", grade: "O", attempt: "04/26" },
                        { code: "DCN402", name: "OPERATING SYSTEMS (LINUX)", attendance: "98%", ca: "30", grade: "O", attempt: "04/26" },
                        { code: "DCN403", name: "PYTHON PROGRAMMING LAB", attendance: "100%", ca: "30", grade: "O", attempt: "04/26" },
                        { code: "DCN404", name: "NETWORKING LAB", attendance: "100%", ca: "30", grade: "O", attempt: "04/26" }
                    ]
                },
                5: {
                    semCgpa: 9.75,
                    subjects: [
                        { code: "DCN501", name: "NETWORK SECURITY & CRYPTOGRAPHY", attendance: "100%", ca: "30", grade: "O", attempt: "11/26" },
                        { code: "DCN502", name: "CLOUD COMPUTING ARCHITECTURE", attendance: "96%", ca: "28", grade: "A+", attempt: "11/26" },
                        { code: "DCN503", name: "ETHICAL HACKING LAB", attendance: "100%", ca: "30", grade: "O", attempt: "11/26" }
                    ]
                },
                6: {
                    semCgpa: 9.85,
                    subjects: [
                        { code: "DCN601", name: "WIRELESS & SENSOR NETWORKS", attendance: "100%", ca: "30", grade: "O", attempt: "04/27" },
                        { code: "DCN602", name: "CYBER FORENSICS", attendance: "100%", ca: "30", grade: "O", attempt: "04/27" },
                        { code: "DCN603", name: "PROJECT WORK", attendance: "100%", ca: "30", grade: "O", attempt: "04/27" }
                    ]
                }
            }
        },

        // Annexure I (Integrated Learning, Internship, Placement, Final Results - Matching Image 1)
        annexure1: {
            mandatoryCourses: [
                { sem: "Sem 1", name: "Environmental Science & Sustainability", status: "Completed" },
                { sem: "Sem 2", name: "Professional Ethics & Human Values", status: "Completed" },
                { sem: "Sem 3", name: "Cyber Safety & Digital Hygiene", status: "Completed" }
            ],
            additionalCourses: [
                { sem: "Sem 1", name: "Spoken English & Communication Skills", status: "Completed" },
                { sem: "Sem 2", name: "Basics of Linux Administration", status: "Completed" },
                { sem: "Sem 3", name: "Cisco Certified Network Associate (CCNA) Module 1", status: "Completed" }
            ],
            internships: [
                { company: "PSG Tech Soft Solutions, Coimbatore", description: "Network Monitoring & Router Configuration Automation", duration: "01/05/2026 - 31/05/2026", skills: "Cisco Packet Tracer, Wireshark, Bash Scripting" }
            ],
            projects: [
                { title: "IoT-based Network Traffic & Anomaly Detection System", guide: "Prof. S. Rajesh, M.E.", domain: "Cybersecurity / Computer Networks", tools: "Python, Wireshark API, Raspberry Pi, Snort IDS" }
            ],
            placements: [
                { company: "Zoho Corporation", designation: "Junior Network Engineer", salary: "₹ 5,20,000 / annum", joiningDate: "01/06/2027", location: "Chennai / Coimbatore" }
            ],
            finalResults: {
                graduationDate: "April 2027",
                overallPercentage: "94.5%",
                awardClass: "First Class with Distinction",
                higherStudies: "Planning for B.E. Direct Lateral Entry in CSE / IT"
            }
        },

        // Annexure II (Extra Curricular, Sports, Competitions - Matching Image 2)
        annexure2: {
            sports: [
                { sport: "Badminton", level: "Inter-Polytechnic Tournament", role: "Team Captain / Single Player", achievements: "Winner (Gold Medal)" }
            ],
            unionActivities: [
                { club: "Department of Computer Networking Association", role: "Office Bearer", activities: "Organized National Level Technical Symposium 'NETCON 2026'", achievements: "Best Student Coordinator Award" }
            ],
            competitions: [
                { event: "Paper Presentation", conductedBy: "Sankara Poly Clg.", type: "Team", achievements: "Second Prize" },
                { event: "Intellitech Expo '2025", conductedBy: "PSG Poly Clg.", type: "Team", achievements: "First Prize & Innovation Trophy" },
                { event: "IEI Seminar", conductedBy: "PSG Poly Clg.", type: "Team", achievements: "Certificate of Merit" }
            ],
            remarks: "Office Bearer in Department of Computer Networking. Exceptional leadership, high academic standing, active participant in paper presentations and state-level technical symposiums."
        }
    },

    "25CH01": {
        rollNo: "25CH01",
        name: "Arun Kumar R.",
        course: "Diploma",
        branch: "DCN",
        periodOfStudy: "2025 - 2027",
        acRef: "AC / 06 (01) / 16.05.2025",
        dob: "14.05.2007",
        religion: "Hindu",
        bloodGroup: "A+ve",
        communityCategory: "BC",
        differentlyAbled: "No",
        fatherName: "RAMESH CHANDRAN",
        motherName: "SUJATHA R",
        residentialAddress: "12, College Road, Peelamedu, Coimbatore",
        resPin: "641004",
        permanentAddress: "12, College Road, Peelamedu, Coimbatore",
        permPin: "641004",
        studentMobile: "9842100112",
        fatherMobile: "9842100999",
        motherMobile: "9842100888",
        emisId: "2012860611",
        umisId: "UMIS-2025-01",
        bankDetails: "State Bank of India / Peelamedu",
        parentOccupationIncome: "Agriculture and ₹ 1,80,000",
        cgpa: 8.90,
        photoUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80",
        fatherPhotoUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80",
        motherPhotoUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&auto=format&fit=crop&q=80",
        
        studies: [
            { class: "SSLC", period: "2022-23", school: "Government Higher Sec School", marks: "440/500", percentage: "88.0 %", regNo: "4412091", remarks: "-" }
        ],

        academics: {
            hostellerStatus: "Hosteller",
            scholarships: "Post Matric Scholarship",
            semesters: {
                1: { semCgpa: 8.70, subjects: [{ code: "MATH101", name: "COMMUNICATION ENGLISH", attendance: "94%", ca: "27", grade: "A+", attempt: "11/24" }] },
                2: { semCgpa: 8.90, subjects: [{ code: "CS201", name: "C PROGRAMMING", attendance: "96%", ca: "28", grade: "A+", attempt: "04/25" }] },
                3: { semCgpa: 9.10, subjects: [{ code: "DCN301", name: "STATISTICS", attendance: "98%", ca: "29", grade: "O", attempt: "11/25" }] }
            }
        },

        annexure1: {
            mandatoryCourses: [{ sem: "Sem 1", name: "Environmental Studies", status: "Completed" }],
            additionalCourses: [{ sem: "Sem 1", name: "Basic Hardware Maintenance", status: "Completed" }],
            internships: [{ company: "HCL Technologies, Coimbatore", description: "Network Cable Testing & Server Rack Setup", duration: "15 days", skills: "Structured Cabling" }],
            projects: [{ title: "Smart Hostel Wi-Fi Bandwidth Management", guide: "Prof. K. Venkatesh", domain: "Networking", tools: "MikroTik, Linux" }],
            placements: [{ company: "Infosys BPM", designation: "Systems Associate", salary: "₹ 3,60,000 / annum", joiningDate: "15/06/2027", location: "Mysore" }],
            finalResults: { graduationDate: "April 2027", overallPercentage: "89.0%", awardClass: "First Class", higherStudies: "B.E. Computer Science" }
        },

        annexure2: {
            sports: [{ sport: "Volleyball", level: "District Level", role: "Attacker", achievements: "Runner Up" }],
            unionActivities: [{ club: "NSS Unit", role: "Volunteer", activities: "Blood Donation Camp", achievements: "Certificate" }],
            competitions: [{ event: "Quiz Contest", conductedBy: "PSG Poly Clg.", type: "Individual", achievements: "Third Place" }],
            remarks: "Sincere student with excellent practical networking skills."
        }
    },

    "25CH02": {
        rollNo: "25CH02",
        name: "Deepika M.",
        course: "Diploma",
        branch: "DCN",
        periodOfStudy: "2025 - 2027",
        acRef: "AC / 06 (01) / 16.05.2025",
        dob: "22.09.2007",
        religion: "Hindu",
        bloodGroup: "B+ve",
        communityCategory: "MBC",
        differentlyAbled: "No",
        fatherName: "MURUGAN K",
        motherName: "CHITRA M",
        residentialAddress: "45, Saravanampatti Main Road, Coimbatore",
        resPin: "641035",
        permanentAddress: "45, Saravanampatti Main Road, Coimbatore",
        permPin: "641035",
        studentMobile: "9789012345",
        fatherMobile: "9789012344",
        motherMobile: "9789012343",
        emisId: "2012860612",
        umisId: "-",
        bankDetails: "Canara Bank / Saravanampatti",
        parentOccupationIncome: "Private Service and ₹ 2,10,000",
        cgpa: 9.45,
        photoUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80",
        fatherPhotoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80",
        motherPhotoUrl: "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=300&auto=format&fit=crop&q=80",
        
        studies: [
            { class: "SSLC", period: "2022-23", school: "St. Joseph Matric School", marks: "478/500", percentage: "95.6 %", regNo: "5118920", remarks: "-" }
        ],

        academics: {
            hostellerStatus: "Day Scholar",
            scholarships: "State Merit Scholarship",
            semesters: {
                1: { semCgpa: 9.40, subjects: [{ code: "MATH101", name: "COMMUNICATION ENGLISH", attendance: "100%", ca: "30", grade: "O", attempt: "11/24" }] },
                2: { semCgpa: 9.50, subjects: [{ code: "CS201", name: "C PROGRAMMING", attendance: "100%", ca: "30", grade: "O", attempt: "04/25" }] }
            }
        },

        annexure1: {
            mandatoryCourses: [{ sem: "Sem 1", name: "Environmental Science", status: "Completed" }],
            additionalCourses: [{ sem: "Sem 1", name: "Web Technologies", status: "Completed" }],
            internships: [{ company: "Bosch Global Software", description: "Frontend Development", duration: "1 Month", skills: "React, HTML, CSS" }],
            projects: [{ title: "Student Record Management Portal", guide: "Dr. N. Alagappan", domain: "Web Development", tools: "JavaScript, HTML5, CSS3" }],
            placements: [{ company: "TCS Digital", designation: "Software Trainee", salary: "₹ 4,50,000 / annum", joiningDate: "01/07/2027", location: "Kochi" }],
            finalResults: { graduationDate: "April 2027", overallPercentage: "94.5%", awardClass: "First Class with Distinction", higherStudies: "B.Tech IT" }
        },

        annexure2: {
            sports: [{ sport: "Chess", level: "State Level", role: "Player", achievements: "Winner" }],
            unionActivities: [{ club: "Youth Red Cross", role: "Member", activities: "Health Awareness Rally", achievements: "Parchment" }],
            competitions: [{ event: "Web Design Challenge", conductedBy: "PSG Poly Clg.", type: "Individual", achievements: "First Prize" }],
            remarks: "Outstanding academic performance and software design skill."
        }
    },

    "25CH15": {
        rollNo: "25CH15",
        name: "Siddharth S.",
        course: "Diploma",
        branch: "DCN",
        periodOfStudy: "2025 - 2027",
        acRef: "AC / 06 (01) / 16.05.2025",
        dob: "05.12.2007",
        religion: "Hindu",
        bloodGroup: "O-ve",
        communityCategory: "OC",
        differentlyAbled: "No",
        fatherName: "SAMPATH KUMAR",
        motherName: "USHA RANI",
        residentialAddress: "88, Gandhipuram 4th Street, Coimbatore",
        resPin: "641012",
        permanentAddress: "88, Gandhipuram 4th Street, Coimbatore",
        permPin: "641012",
        studentMobile: "9443210987",
        fatherMobile: "9443210986",
        motherMobile: "9443210985",
        emisId: "2012860625",
        umisId: "-",
        bankDetails: "Indian Overseas Bank / Gandhipuram",
        parentOccupationIncome: "Business and ₹ 3,60,000",
        cgpa: 9.12,
        photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80",
        fatherPhotoUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80",
        motherPhotoUrl: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=300&auto=format&fit=crop&q=80",
        
        studies: [
            { class: "SSLC", period: "2022-23", school: "PSG Sarvajana Higher Sec School", marks: "465/500", percentage: "93.0 %", regNo: "5891023", remarks: "-" }
        ],

        academics: {
            hostellerStatus: "Day Scholar",
            scholarships: "None",
            semesters: {
                1: { semCgpa: 9.00, subjects: [{ code: "MATH101", name: "COMMUNICATION ENGLISH", attendance: "95%", ca: "28", grade: "O", attempt: "11/24" }] },
                2: { semCgpa: 9.20, subjects: [{ code: "CS201", name: "C PROGRAMMING", attendance: "98%", ca: "29", grade: "O", attempt: "04/25" }] }
            }
        },

        annexure1: {
            mandatoryCourses: [{ sem: "Sem 1", name: "Ethics", status: "Completed" }],
            additionalCourses: [{ sem: "Sem 1", name: "Ethical Hacking Intro", status: "Completed" }],
            internships: [{ company: "L&T Infotech", description: "Cybersecurity Auditing", duration: "1 Month", skills: "Nmap, Wireshark" }],
            projects: [{ title: "Automated Vulnerability Scanner for LAN", guide: "Prof. P. Selvan", domain: "Cybersecurity", tools: "Python, Metasploit" }],
            placements: [{ company: "Cognizant", designation: "Programmer Analyst", salary: "₹ 4,00,000 / annum", joiningDate: "10/06/2027", location: "Coimbatore" }],
            finalResults: { graduationDate: "April 2027", overallPercentage: "91.2%", awardClass: "First Class with Distinction", higherStudies: "B.E. Cybersecurity" }
        },

        annexure2: {
            sports: [{ sport: "Table Tennis", level: "Zonal", role: "Player", achievements: "Runner Up" }],
            unionActivities: [{ club: "Cyber Security Club", role: "President", activities: "CTF Competition", achievements: "Winner" }],
            competitions: [{ event: "Hackathon 2025", conductedBy: "IIT Madras", type: "Team", achievements: "Top 5 Finalist" }],
            remarks: "Very innovative and strong interest in ethical hacking & network defence."
        }
    }
};

if (typeof window !== "undefined") {
    window.INITIAL_STUDENT_DATABASE = INITIAL_STUDENT_DATABASE;
}
