const API_BASE_URL = 'http://127.0.0.1:8000';

async function fetchGrades() {
   const input = document.getElementById("student_id");
   const resultDiv = document.getElementById("result");
   const student_id = input.value.trim();

   // Input validation
   if (!student_id || isNaN(student_id)) {
       alert("Please enter a valid numeric Student ID.");
       input.focus();
       return;
   }

   // Loading indicator
   resultDiv.innerHTML = `<p class="status">Loading grades...</p>`;

   try {
       const response = await fetch(`${API_BASE_URL}/get_grades?student_id=${encodeURIComponent(student_id)}`);

       if (!response.ok) {
           const errData = await response.json().catch(() => ({}));
           throw new Error(errData.detail || `Server error (${response.status})`);
       }

       const grades = await response.json();
       displayGrades(grades);
   } catch (error) {
       console.error("Fetch error:", error);
       resultDiv.innerHTML = `<p class="status status-error">${error.message || "Failed to connect to the server."}</p>`;
   }
}

function displayGrades(grades) {
   const resultDiv = document.getElementById("result");

   if (!grades.length) {
       resultDiv.innerHTML = `<p class="status">No grades found for this Student ID.</p>`;
       return;
   }

   const headers = Object.keys(grades[0]);

   resultDiv.innerHTML = `
       <table aria-label="Student grades">
           <thead>
               <tr>
                   ${headers.map(h => `<th scope="col">${h}</th>`).join('')}
               </tr>
           </thead>
           <tbody>
               ${grades.map(row => `
                   <tr>
                       ${headers.map(h => `<td>${row[h]}</td>`).join('')}
                   </tr>
               `).join('')}
           </tbody>
       </table>
   `;
}

// Ensure the listener attaches after DOM nodes are available
document.addEventListener("DOMContentLoaded", () => {
   const input = document.getElementById("student_id");
   if (input) {
       input.addEventListener("keydown", (event) => {
           if (event.key === "Enter") {
               fetchGrades();
           }
       });
   }
});

