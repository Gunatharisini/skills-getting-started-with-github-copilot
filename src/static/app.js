document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");

  // Function to fetch activities from API
  async function fetchActivities() {
    try {
      const response = await fetch("/activities");
      const activities = await response.json();

      // Clear loading message
      activitiesList.innerHTML = "";

      // Populate activities list
      Object.entries(activities).forEach(([name, details]) => {
        const activityCard = document.createElement("div");
        ```javascript
        document.addEventListener("DOMContentLoaded", () => {
          const activitiesList = document.getElementById("activities-list");
          const activitySelect = document.getElementById("activity");
          const signupForm = document.getElementById("signup-form");
          const messageDiv = document.getElementById("message");

          // Function to fetch activities from API
          async function fetchActivities() {
            try {
              const response = await fetch("/activities");
              const activities = await response.json();

              // Clear loading message
              activitiesList.innerHTML = "";
              // Reset activity select
              activitySelect.innerHTML = '<option value="">-- Select an activity --</option>';

              // Populate activities list
              Object.entries(activities).forEach(([name, details]) => {
                const activityCard = document.createElement("div");
                activityCard.className = "activity-card";

                document.addEventListener("DOMContentLoaded", () => {
                  const activitiesList = document.getElementById("activities-list");
                  const activitySelect = document.getElementById("activity");
                  const signupForm = document.getElementById("signup-form");
                  const messageDiv = document.getElementById("message");

                  // Function to fetch activities from API
                  async function fetchActivities() {
                    try {
                      const response = await fetch("/activities");
                      const activities = await response.json();

                      // Clear loading message
                      activitiesList.innerHTML = "";
                      // Reset activity select
                      activitySelect.innerHTML = '<option value="">-- Select an activity --</option>';

                      // Populate activities list
                      Object.entries(activities).forEach(([name, details]) => {
                        const activityCard = document.createElement("div");
                        activityCard.className = "activity-card";

                        const spotsLeft = details.max_participants - details.participants.length;

                        // Header and basic info
                        const header = document.createElement("div");
                        header.innerHTML = `
                          <h4>${name}</h4>
                          <p>${details.description}</p>
                          <p><strong>Schedule:</strong> ${details.schedule}</p>
                          <p class="availability"><strong>Availability:</strong> ${spotsLeft} spots left</p>
                        `;
                        activityCard.appendChild(header);

                        // Participants section
                        const participantsSection = document.createElement("div");
                        participantsSection.className = "participants-section";
                        const h5 = document.createElement("h5");
                        h5.textContent = "Participants";
                        participantsSection.appendChild(h5);

                        if (details.participants && details.participants.length) {
                          const ul = document.createElement("ul");
                          ul.className = "participants-list";

                          details.participants.forEach((p) => {
                            const li = document.createElement("li");
                            li.className = "participant-item";

                            const span = document.createElement("span");
                            span.className = "participant-email";
                            span.textContent = p;

                            const btn = document.createElement("button");
                            btn.className = "delete-participant";
                            btn.type = "button";
                            btn.title = "Unregister participant";
                            btn.dataset.activity = name;
                            btn.dataset.email = p;
                            btn.innerHTML = "✕";

                            btn.addEventListener("click", async (e) => {
                              e.stopPropagation();
                              const email = btn.dataset.email;
                              const activityName = btn.dataset.activity;

                              try {
                                const resp = await fetch(
                                  `/activities/${encodeURIComponent(activityName)}/participants?email=${encodeURIComponent(email)}`,
                                  { method: "DELETE" }
                                );

                                const result = await resp.json();

                                if (resp.ok) {
                                  showMessage(result.message, "success");
                                  // Refresh list
                                  fetchActivities();
                                } else {
                                  showMessage(result.detail || "Failed to unregister", "error");
                                }
                              } catch (err) {
                                console.error("Error unregistering:", err);
                                showMessage("Failed to unregister. Please try again.", "error");
                              }
                            });

                            li.appendChild(span);
                            li.appendChild(btn);
                            ul.appendChild(li);
                          });

                          participantsSection.appendChild(ul);
                        } else {
                          const p = document.createElement("p");
                          p.className = "no-participants";
                          p.textContent = "No participants yet";
                          participantsSection.classList.add("empty");
                          participantsSection.appendChild(p);
                        }

                        activityCard.appendChild(participantsSection);
                        activitiesList.appendChild(activityCard);

                        // Add option to select dropdown
                        const option = document.createElement("option");
                        option.value = name;
                        option.textContent = name;
                        activitySelect.appendChild(option);
                      });
                    } catch (error) {
                      activitiesList.innerHTML = "<p>Failed to load activities. Please try again later.</p>";
                      console.error("Error fetching activities:", error);
                    }
                  }

                  // Handle form submission
                  signupForm.addEventListener("submit", async (event) => {
                    event.preventDefault();

                    const email = document.getElementById("email").value;
                    const activity = document.getElementById("activity").value;

                    try {
                      const response = await fetch(
                        `/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}`,
                        {
                          method: "POST",
                        }
                      );

                      const result = await response.json();

                      if (response.ok) {
                        messageDiv.textContent = result.message;
                        messageDiv.className = "message success";
                        signupForm.reset();
                        // Refresh activities list to show new participant
                        fetchActivities();
                      } else {
                        messageDiv.textContent = result.detail || "An error occurred";
                        messageDiv.className = "message error";
                      }

                      messageDiv.classList.remove("hidden");

                      // Hide message after 5 seconds
                      setTimeout(() => {
                        messageDiv.classList.add("hidden");
                      }, 5000);
                    } catch (error) {
                      messageDiv.textContent = "Failed to sign up. Please try again.";
                      messageDiv.className = "message error";
                      messageDiv.classList.remove("hidden");
                      console.error("Error signing up:", error);
                    }
                  });

                  // Initialize app
                  fetchActivities();

                  // Helper to show messages
                  function showMessage(text, type) {
                    messageDiv.textContent = text;
                    messageDiv.className = `message ${type}`;
                    messageDiv.classList.remove("hidden");
                    setTimeout(() => {
                      messageDiv.classList.add("hidden");
                    }, 5000);
                  }
                });
