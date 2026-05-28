function addSubject() {

    const table = document.getElementById("subjectTable");

    const row = document.createElement("tr");

    row.innerHTML = `
        <td><input type="text" placeholder="Subject Name"></td>
        <td><input type="number" class="marks" placeholder="0"></td>
        <td><input type="number" class="total" placeholder="100"></td>
        <td class="grade">-</td>
    `;

    table.appendChild(row);
}

function calculateGrade(percentage) {

    if (percentage >= 90) return "A+";
    if (percentage >= 80) return "A";
    if (percentage >= 70) return "B";
    if (percentage >= 60) return "C";
    if (percentage >= 50) return "D";

    return "F";
}

function calculateGPA(percentage) {

    if (percentage >= 90) return 4.0;
    if (percentage >= 80) return 3.7;
    if (percentage >= 70) return 3.0;
    if (percentage >= 60) return 2.5;
    if (percentage >= 50) return 2.0;

    return 0;
}

function generateMarksheet() {

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

    const subjects = document.querySelectorAll("#subjectTable tr");

    subjects.forEach((row, index) => {

        const subjectName =
            row.cells[0].querySelector("input").value || "Unknown";

        const marks = Number(marksInputs[index].value);

        const totalMarks = Number(totalInputs[index].value);

        if (totalMarks <= 0) return;

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

    const finalPercentage =
        ((obtained / total) * 100).toFixed(2);

    const finalGrade =
        calculateGrade(finalPercentage);

    const gpa =
        calculateGPA(finalPercentage);

    // Fake previous performance for demo
    const previousPerformance = 65;

    const growth = (
        ((finalPercentage - previousPerformance)
        / previousPerformance) * 100
    ).toFixed(1);

    let recommendation = "";

    if (finalPercentage >= 85) {

        recommendation =
            "Outstanding academic performance. Continue maintaining consistency and focus on advanced concepts.";

    } else if (finalPercentage >= 70) {

        recommendation =
            "Good performance overall. Focus more on weaker subjects to improve further.";

    } else if (finalPercentage >= 50) {

        recommendation =
            "Average performance detected. Regular practice and revision are recommended.";

    } else {

        recommendation =
            "Performance needs improvement. Focus on fundamentals and daily study routines.";
    }

    document.getElementById("obtainedMarks").textContent =
        obtained;

    document.getElementById("totalMarks").textContent =
        total;

    document.getElementById("percentage").textContent =
        finalPercentage + "%";

    document.getElementById("finalGrade").textContent =
        finalGrade;

    document.getElementById("gpa").textContent =
        gpa;

    document.getElementById("status").textContent =
        failed ? "FAIL" : "PASS";

    document.getElementById("bestSubject").textContent =
        bestSubject;

    document.getElementById("weakSubject").textContent =
        weakSubject;

    document.getElementById("growthRate").textContent =
        growth + "%";

    document.getElementById("focusArea").textContent =
        weakSubject;

    document.getElementById("recommendationText").textContent =
        recommendation;

    document.getElementById("resultCard").style.display =
        "block";

    document.getElementById("analyticsCard").style.display =
        "block";
        document.getElementById("printStudentName").textContent =
document.getElementById("studentName").value;

document.getElementById("printRollNumber").textContent =
document.getElementById("rollNumber").value;

document.getElementById("printClass").textContent =
document.getElementById("studentClass").value;

document.getElementById("printPercentage").textContent =
finalPercentage + "%";

document.getElementById("printGrade").textContent =
finalGrade;

document.getElementById("printStatus").textContent =
failed ? "FAIL" : "PASS";

document.getElementById("printComment").textContent =
recommendation;

const printTableBody =
document.getElementById("printTableBody");

printTableBody.innerHTML = "";

subjects.forEach((row,index)=>{

    const subjectName =
    row.cells[0].querySelector("input").value;

    const marks =
    Number(marksInputs[index].value);

    const totalMarks =
    Number(totalInputs[index].value);

    const percentage =
    ((marks / totalMarks) * 100).toFixed(1);

    const grade =
    calculateGrade(percentage);

    printTableBody.innerHTML += `
        <tr>
            <td>${subjectName}</td>
            <td>${marks}</td>
            <td>${totalMarks}</td>
            <td>${percentage}%</td>
            <td>${grade}</td>
        </tr>
    `;
});
}