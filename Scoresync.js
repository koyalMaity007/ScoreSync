
// =========================
// 🔥 SUBJECT NORMALIZER (SMART HYBRID)
// =========================
function normalizeSubject(subject) {

    subject = subject
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "");

    const map = {
        math: "maths",
        maths: "maths",
        mathematics: "maths",

        english: "english",
        englis: "english",

        hindi: "hindi",
        science: "science"
    };

    return map[subject] || subject;
}


// =========================
// ✅ VALIDATION
// =========================
function isSimilar(a, b) {

    a = a.toLowerCase().trim();
    b = b.toLowerCase().trim();

    if (a === b) return true;

    if (a.startsWith(b) || b.startsWith(a)) {
        return true;
    }

    return false;
}


// =========================
// ✅ VALIDATION (IMPROVED DUPLICATE CHECK)
// =========================
function validateSubjects() {

    const rows = document.querySelectorAll("#subjectTable tr");
    const subjectSet = [];

    for (const row of rows) {

        const subjectInput = row.cells[0].querySelector("input");
        const marksInput = row.querySelector(".marks");
        const totalInput = row.querySelector(".total");

        const rawSubject = subjectInput.value.trim();

        subjectInput.style.border = "";
        marksInput.style.border = "";
        totalInput.style.border = "";

        if (!rawSubject) {
            subjectInput.style.border = "2px solid #ef4444";
            alert("Subject name cannot be empty");
            subjectInput.focus();
            return false;
        }

        // 🔥 SMART DUPLICATE CHECK
        for (const existing of subjectSet) {

            if (isSimilar(rawSubject, existing)) {

                subjectInput.style.border = "2px solid #ef4444";
                alert(`You already added "${existing}" subject.`);
                subjectInput.focus();
                return false;
            }
        }

        subjectSet.push(rawSubject);

        if (marksInput.value === "" || totalInput.value === "") {
            marksInput.style.border = "2px solid #ef4444";
            totalInput.style.border = "2px solid #ef4444";
            alert("Marks and Total Marks are required");
            return false;
        }

        if (Number(marksInput.value) > Number(totalInput.value)) {
            marksInput.style.border = "2px solid #ef4444";
            alert("Marks cannot be greater than total marks");
            return false;
        }
    }

    return true;
}


// =========================
// ➕ ADD SUBJECT
// =========================
function addSubject(subjectData = {}) {

    const table = document.getElementById("subjectTable");

    const row = document.createElement("tr");

    row.innerHTML = `
        <td>
            <input 
                type="text" 
                placeholder="Subject Name"
                value="${subjectData.subject || ""}"
                oninput="saveData()"
            >
        </td>

        <td>
            <input 
                type="number" 
                class="marks" 
                placeholder="0"
                min="0"
                value="${subjectData.marks || ""}"
                oninput="updateGrade(this); saveData();"
            >
        </td>

        <td>
            <input 
                type="number" 
                class="total" 
                placeholder="100"
                min="1"
                value="${subjectData.total || ""}"
                oninput="updateGrade(this); saveData();"
            >
        </td>

        <td class="grade">-</td>

        <td>
            <button onclick="removeSubject(this)">Delete</button>
        </td>
    `;

    table.appendChild(row);

    updateGrade(row.querySelector(".marks"));
}

// =========================
// ❌ REMOVE SUBJECT
// =========================
function removeSubject(button) {

    const rows = document.querySelectorAll("#subjectTable tr");

    if (rows.length === 1) {
        alert("At least one subject is required.");
        return;
    }

    button.closest("tr").remove();
    saveData();
}


// =========================
// 📊 GRADE SYSTEM
// =========================
function calculateGrade(percentage) {

    percentage = Number(percentage);

    if (percentage >= 90) return "A+";
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B";
    if (percentage >= 60) return "C";
    if (percentage >= 50) return "D";

    return "F";
}

function calculateGPA(percentage) {

    percentage = Number(percentage);

    if (percentage >= 90) return 4.0;
    if (percentage >= 80) return 3.7;
    if (percentage >= 70) return 3.0;
    if (percentage >= 60) return 2.5;
    if (percentage >= 50) return 2.0;

    return 0;
}


// =========================
// 📈 LIVE UPDATE
// =========================
function updateGrade(input) {

    const row = input.closest("tr");

    const marksInput = row.querySelector(".marks");
    const totalInput = row.querySelector(".total");
    const gradeCell = row.querySelector(".grade");

    const marks = Number(marksInput.value);
    const total = Number(totalInput.value);

    if (marksInput.value === "" || totalInput.value === "") {
        gradeCell.textContent = "-";
        return;
    }

    if (total <= 0) {
        gradeCell.textContent = "-";
        return;
    }

    if (marks > total) {
        marksInput.style.border = "2px solid #ef4444";
        gradeCell.textContent = "Invalid";
        return;
    }

    marksInput.style.border = "";

    const percentage = (marks / total) * 100;

    gradeCell.style.color = "#38bdf8";
    gradeCell.textContent = calculateGrade(percentage);
}


// =========================
// 🧠 GENERATE MARKSHEET
// =========================
function generateMarksheet() {

    if (!validateSubjects()) return;

    const rows = document.querySelectorAll("#subjectTable tr");

    const marksInputs = document.querySelectorAll(".marks");
    const totalInputs = document.querySelectorAll(".total");
    const grades = document.querySelectorAll(".grade");

    let obtained = 0;
    let total = 0;

    let highestPercentage = 0;
    let lowestPercentage = 100;

    let bestSubject = "";
    let weakSubject = "";

    let failed = false;

    rows.forEach((row, index) => {

        const subjectName = normalizeSubject(
            row.cells[0].querySelector("input").value
        );

        let marks = Number(marksInputs[index].value);
        let totalMarks = Number(totalInputs[index].value);

        if (marks < 0) marks = 0;
        if (totalMarks <= 0) return;

        if (marks > totalMarks) {
            marks = totalMarks;
            marksInputs[index].value = totalMarks;
        }

        obtained += marks;
        total += totalMarks;

        const percentage = (marks / totalMarks) * 100;

        const grade = calculateGrade(percentage);
        grades[index].textContent = grade;

        if (percentage > highestPercentage) {
            highestPercentage = percentage;
            bestSubject = subjectName;
        }

        if (percentage < lowestPercentage) {
            lowestPercentage = percentage;
            weakSubject = subjectName;
        }

        if (percentage < 35) {
            failed = true;
        }
    });

    if (total === 0) {
        alert("Please enter valid marks.");
        return;
    }

    const finalPercentage = ((obtained / total) * 100).toFixed(2);
    const finalGrade = calculateGrade(finalPercentage);
    const gpa = calculateGPA(finalPercentage);

    const previousPerformance = 65;

    const growth = (
        ((finalPercentage - previousPerformance) / previousPerformance) * 100
    ).toFixed(1);

    const recommendation =
        finalPercentage >= 85
            ? "Outstanding performance."
            : finalPercentage >= 70
                ? "Good performance."
                : finalPercentage >= 50
                    ? "Average performance."
                    : "Needs improvement.";

    document.getElementById("obtainedMarks").textContent = obtained;
    document.getElementById("totalMarks").textContent = total;
    document.getElementById("percentage").textContent = finalPercentage + "%";
    document.getElementById("finalGrade").textContent = finalGrade;
    document.getElementById("gpa").textContent = gpa;
    document.getElementById("status").textContent = failed ? "FAIL" : "PASS";
    document.getElementById("bestSubject").textContent = bestSubject;
    document.getElementById("weakSubject").textContent = weakSubject;
    document.getElementById("growthRate").textContent = growth + "%";
    document.getElementById("focusArea").textContent = weakSubject;
    document.getElementById("recommendationText").textContent = recommendation;

    document.getElementById("printStudentName").textContent =
        document.getElementById("studentName").value || "-";

    document.getElementById("printRollNumber").textContent =
        document.getElementById("rollNumber").value || "-";

    document.getElementById("printClass").textContent =
        document.getElementById("studentClass").value || "-";

    document.getElementById("printPercentage").textContent =
        finalPercentage + "%";

    document.getElementById("printGrade").textContent =
        finalGrade;

    document.getElementById("printStatus").textContent =
        failed ? "FAIL" : "PASS";

    document.getElementById("printComment").textContent =
        recommendation;

    document.getElementById("printDate").textContent =
        new Date().toLocaleDateString();

    const printTableBody =
        document.getElementById("printTableBody");


    if (printTableBody) {

        printTableBody.innerHTML = "";

        rows.forEach((row) => {

            const subject = row.querySelector("td input").value;
            const marks = Number(row.querySelector(".marks").value);
            const total = Number(row.querySelector(".total").value);

            if (!subject || total <= 0) return;

            const percentage = ((marks / total) * 100).toFixed(1);
            const grade = calculateGrade(percentage);

            const tr = document.createElement("tr");

            tr.innerHTML = `
            <td>${subject}</td>
            <td>${marks}</td>
            <td>${total}</td>
            <td>${percentage}%</td>
            <td>${grade}</td>
        `;

            printTableBody.appendChild(tr);
        });
    }

    document.getElementById("resultCard").style.display = "block";
    document.getElementById("analyticsCard").style.display = "block";

    saveData();
}


// =========================
// 💾 SAVE DATA
// =========================
function saveData() {

    const subjects = [];

    document.querySelectorAll("#subjectTable tr").forEach(row => {

        subjects.push({
            subject: row.cells[0].querySelector("input").value,
            marks: row.querySelector(".marks").value,
            total: row.querySelector(".total").value
        });
    });

    const data = {
        studentName: document.getElementById("studentName").value,
        rollNumber: document.getElementById("rollNumber").value,
        studentClass: document.getElementById("studentClass").value,
        subjects
    };

    localStorage.setItem("scoresyncData", JSON.stringify(data));
}


// =========================
// 📥 LOAD DATA
// =========================
function loadData() {

    const savedData = localStorage.getItem("scoresyncData");

    if (!savedData) {
        addSubject();
        return;
    }

    const data = JSON.parse(savedData);

    document.getElementById("studentName").value = data.studentName || "";
    document.getElementById("rollNumber").value = data.rollNumber || "";
    document.getElementById("studentClass").value = data.studentClass || "";

    document.getElementById("subjectTable").innerHTML = "";

    if (!data.subjects || data.subjects.length === 0) {
        addSubject();
    } else {
        data.subjects.forEach(addSubject);
    }
}


// =========================
// 🧹 CLEAR DATA
// =========================
function clearAllData() {

    if (!confirm("Are you sure?")) return;

    localStorage.removeItem("scoresyncData");
    location.reload();
}


// =========================
// 🔗 EVENTS
// =========================
document.getElementById("studentName").addEventListener("input", saveData);
document.getElementById("rollNumber").addEventListener("input", saveData);
document.getElementById("studentClass").addEventListener("input", saveData);

window.onload = loadData; 