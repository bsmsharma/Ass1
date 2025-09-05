// Data storage: keep all assessments grouped by intern
let internsData = {};

// Show/Hide sections
function showDashboard() {
  document.getElementById("dashboardSection").style.display = "block";
  document.getElementById("assessmentSection").style.display = "none";
}

function showAssessment() {
  document.getElementById("dashboardSection").style.display = "none";
  document.getElementById("assessmentSection").style.display = "block";
}

// Handle form submission
document.getElementById("assessmentForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const internName = document.getElementById("internName").value;
  const domain = document.getElementById("domain").value;
  const mentorName = document.getElementById("mentorName").value;
  const assessmentNo = document.getElementById("assessmentNo").value;
  const topic = document.getElementById("assessmentTopic").value;
  const date = document.getElementById("assessmentDate").value;

  const overallScore =
    (parseInt(document.getElementById("technical").value || 0) +
      parseInt(document.getElementById("analytical").value || 0) +
      parseInt(document.getElementById("troubleshooting").value || 0) +
      parseInt(document.getElementById("verbal").value || 0) +
      parseInt(document.getElementById("written").value || 0) +
      parseInt(document.getElementById("collaboration").value || 0) +
      parseInt(document.getElementById("time").value || 0) +
      parseInt(document.getElementById("ethic").value || 0) +
      parseInt(document.getElementById("strength").value || 0) +
      parseInt(document.getElementById("improvement").value || 0)) / 10;

  const tableBody = document.getElementById("assessmentTableBody");

  // Create unique intern key
  const internKey = `${internName}_${domain}_${mentorName}`;

  // If intern not in data → add
  if (!internsData[internKey]) {
    internsData[internKey] = {
      name: internName,
      domain: domain,
      mentor: mentorName,
      score: overallScore.toFixed(1),
      assessments: []
    };
  }

  // Push new assessment
  internsData[internKey].assessments.push({
    no: assessmentNo,
    topic: topic,
    date: date,
    score: overallScore.toFixed(1)
  });

  // Update score (optional: average or latest — here we keep latest)
  internsData[internKey].score = overallScore.toFixed(1);

  // Re-render table
  renderTable();

  // Close modal
  bootstrap.Modal.getInstance(document.getElementById("assessmentModal")).hide();
  document.getElementById("assessmentForm").reset();
});

// Render table
function renderTable() {
  const tableBody = document.getElementById("assessmentTableBody");
  tableBody.innerHTML = "";

  Object.values(internsData).forEach(intern => {
    const row = document.createElement("tr");

    // Collect assessment numbers only
    const assessmentList = intern.assessments.map(a => a.no).join(", ");

    row.innerHTML = `
      <td>${intern.name}</td>
      <td>${intern.domain}</td>
      <td>${intern.mentor}</td>
      <td>${intern.score}</td>
      <td>${assessmentList}</td>
      <td>
        <button class="btn btn-info btn-sm me-1" onclick="viewRow('${intern.name}_${intern.domain}_${intern.mentor}')">View</button>
        <button class="btn btn-warning btn-sm me-1" onclick="editRow('${intern.name}_${intern.domain}_${intern.mentor}')">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="removeRow('${intern.name}_${intern.domain}_${intern.mentor}')">Remove</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Remove row
function removeRow(key) {
  delete internsData[key];
  renderTable();
}

// View row → show all assessments in modal
function viewRow(key) {
  const intern = internsData[key];
  let details = `
    <tr><th>Intern Name</th><td>${intern.name}</td></tr>
    <tr><th>Domain</th><td>${intern.domain}</td></tr>
    <tr><th>Mentor</th><td>${intern.mentor}</td></tr>
    <tr><th>Overall Score</th><td>${intern.score}</td></tr>
    <tr><th colspan="2"><strong>Assessments</strong></th></tr>
  `;

  intern.assessments.forEach((a, index) => {
    details += `
      <tr><td colspan="2"><b>${a.no}</b></td></tr>
      <tr><th>Topic</th><td>${a.topic}</td></tr>
      <tr><th>Date</th><td>${a.date}</td></tr>
      <tr><th>Score</th><td>${a.score}</td></tr>
    `;
  });

  document.getElementById("viewTableBody").innerHTML = details;

  const modal = new bootstrap.Modal(document.getElementById("viewModal"));
  modal.show();
}

// Edit row (loads only the intern basic info, not old assessments)
function editRow(key) {
  const intern = internsData[key];
  document.getElementById("internName").value = intern.name;
  document.getElementById("domain").value = intern.domain;
  document.getElementById("mentorName").value = intern.mentor;

  // Optional: remove intern data so new submission replaces it
  delete internsData[key];
  renderTable();

  // Open modal
  const modal = new bootstrap.Modal(document.getElementById("assessmentModal"));
  modal.show();
}
 