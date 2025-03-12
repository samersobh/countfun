document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("generateBtn").addEventListener("click", generateCalendar);
    document.getElementById("resetBtn").addEventListener("click", resetForm);
});

// ✅ Fetch AI-Generated Suggestions (Includes Location)
async function fetchAIActivities(eventName, eventLocation, countdownDays) {
    try {
        const response = await axios.post("https://countfun-backend.onrender.com/api/fetch-activities", { eventName, eventLocation, countdownDays });
        return response.data.activities;
    } catch (error) {
        console.error("❌ AI fetch failed:", error);
        return Array(countdownDays).fill("📝 Plan your own activity for this day!");
    }
}

// ✅ Generate Calendar with AI Suggestions
async function generateCalendar() {
    const eventName = document.getElementById("eventName").value.trim();
    const eventLocation = document.getElementById("eventLocation").value.trim();
    const countdownDays = parseInt(document.getElementById("countdownDays").value);
    const calendarDiv = document.getElementById("calendar");
    const funIdeasList = document.getElementById("funIdeasList");

    calendarDiv.innerHTML = "";
    funIdeasList.innerHTML = "";

    const activities = await fetchAIActivities(eventName, eventLocation, countdownDays);

    for (let i = 0; i < countdownDays; i++) {
        const dayBox = document.createElement("div");
        dayBox.className = "day-box";
        const activity = activities[i] || "📝 Plan your own activity!";
        
        dayBox.innerHTML = `<strong>Day ${countdownDays - i}</strong><br>
            <textarea>${activity}</textarea>`;

        calendarDiv.appendChild(dayBox);
    }
}
