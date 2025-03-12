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
    funIdeasList.innerHTML = ""; // Clear "Other Fun Ideas"

    if (!eventName || !eventLocation || isNaN(countdownDays) || countdownDays < 1) {
        alert("❗ Please fill in all fields correctly!");
        return;
    }

    // ✅ Fetch AI-generated activities from the backend
    const response = await fetchAIActivities(eventName, eventLocation, countdownDays);

    // ✅ Extract activities for countdown days & extra fun ideas
    const activities = response.slice(0, countdownDays); // First part is for countdown days
    const extraFunIdeas = response.slice(countdownDays); // Last 5 are extra fun ideas

    // ✅ Ensure "Other Fun Ideas" section is populated
    funIdeasList.innerHTML = ""; // Clear previous items
    
    if (extraFunIdeas.length > 0) {
        extraFunIdeas.forEach(idea => {
            if (idea.trim() !== "") { // Ensure no empty ideas
                const li = document.createElement("li");
                li.textContent = idea;
                funIdeasList.appendChild(li);
            }
        });
    } else {
        funIdeasList.innerHTML = "<p>No extra fun ideas available.</p>"; // Fallback message
    }
    

    // ✅ Generate countdown calendar
    for (let i = 0; i < countdownDays; i++) {
    const dayDate = new Date(eventDate);
    dayDate.setDate(eventDate.getDate() - (countdownDays - 1 - i));

    const options = { weekday: "long", day: "numeric", month: "short" };
    const formattedDate = dayDate.toLocaleDateString("en-US", options);

    const dayBox = document.createElement("div");
    dayBox.className = "day-box";
    dayBox.innerHTML = `<strong>${formattedDate} - Day ${countdownDays - i}</strong><br>
        <textarea>${activities[i]}</textarea>`;
    calendarDiv.appendChild(dayBox);
}
