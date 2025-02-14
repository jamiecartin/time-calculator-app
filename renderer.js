// Focus on the duration input when the app loads
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('duration').focus();
});

// Array to store entries
let entries = [];

// Add Duration Entry
document.getElementById('add-entry').addEventListener('click', () => {
  const duration = document.getElementById('duration').value;

  // Validate and normalize duration
  const normalizedDuration = normalizeDuration(duration);
  if (!normalizedDuration) {
    alert('Please enter a valid duration in hh:mm format (e.g., 5:00 or 00:80).');
    return;
  }

  // Add entry to the list
  entries.push(normalizedDuration);
  updateEntriesList();
  updateTotalHours();

  // Reset the duration input
  document.getElementById('duration').value = '';
  document.getElementById('duration').focus(); // Focus back on the input
});

// Prevent form submission on Enter and trigger Add Entry for duration input
document.getElementById('duration').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault(); // Prevent form submission
    document.getElementById('add-entry').click(); // Trigger Add Entry button
  }
});

// Prevent form submission on Enter and trigger Calculate Duration for start/end time inputs
document.getElementById('start-time').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault(); // Prevent form submission
    document.getElementById('calculate-duration').click(); // Trigger Calculate Duration button
  }
});

document.getElementById('end-time').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault(); // Prevent form submission
    document.getElementById('calculate-duration').click(); // Trigger Calculate Duration button
  }
});

// Calculate Duration from Start/End Time
document.getElementById('calculate-duration').addEventListener('click', () => {
  const startTime = document.getElementById('start-time').value;
  const startAmPm = document.getElementById('start-am-pm').value;
  const endTime = document.getElementById('end-time').value;
  const endAmPm = document.getElementById('end-am-pm').value;

  // Validate start and end times
  if (!validateTime(startTime) || !validateTime(endTime)) {
    alert('Please enter valid start and end times in hh:mm format.');
    return;
  }

  // Calculate duration
  const duration = calculateDuration(startTime, startAmPm, endTime, endAmPm);
  if (!duration) {
    alert('End time must be later than start time.');
    return;
  }

  // Add duration to the list
  entries.push(duration);
  updateEntriesList();
  updateTotalHours();

  // Reset start and end time inputs
  document.getElementById('start-time').value = '';
  document.getElementById('end-time').value = '';
  document.getElementById('duration').focus(); // Focus back on the duration input
});

// Clear All Entries
document.getElementById('clear').addEventListener('click', () => {
  entries = []; // Clear all entries
  updateEntriesList();
  updateTotalHours();
  document.getElementById('duration').focus(); // Focus back on the input
});

// Validate duration (hh:mm) - allows minutes > 59 (e.g., 00:80)
function validateDuration(duration) {
  const regex = /^([0-9]|0?[0-9]|1[0-9]|2[0-3]):[0-9]{2}$/;
  return regex.test(duration);
}

// Normalize duration (convert excess minutes to hours)
function normalizeDuration(duration) {
  if (!validateDuration(duration)) return null;

  let [hours, minutes] = duration.split(':').map(Number);

  // Convert excess minutes to hours
  if (minutes >= 60) {
    hours += Math.floor(minutes / 60);
    minutes = minutes % 60;
  }

  return `${hours}:${String(minutes).padStart(2, '0')}`;
}

// Validate time (hh:mm) - allows single-digit hours (e.g., 5:00)
function validateTime(time) {
  const regex = /^(0?[1-9]|1[0-2]):[0-5][0-9]$/;
  return regex.test(time);
}

// Calculate duration between start and end times
function calculateDuration(startTime, startAmPm, endTime, endAmPm) {
  // Convert start time to 24-hour format
  let [startHours, startMinutes] = startTime.split(':').map(Number);
  if (startAmPm === 'PM' && startHours !== 12) startHours += 12;
  if (startAmPm === 'AM' && startHours === 12) startHours = 0;

  // Convert end time to 24-hour format
  let [endHours, endMinutes] = endTime.split(':').map(Number);
  if (endAmPm === 'PM' && endHours !== 12) endHours += 12;
  if (endAmPm === 'AM' && endHours === 12) endHours = 0;

  // Calculate total minutes
  let totalStartMinutes = startHours * 60 + startMinutes;
  let totalEndMinutes = endHours * 60 + endMinutes;

  // Handle case where end time is earlier than start time (e.g., overnight)
  if (totalEndMinutes < totalStartMinutes) {
    totalEndMinutes += 24 * 60; // Add 24 hours
  }

  const durationMinutes = totalEndMinutes - totalStartMinutes;
  if (durationMinutes < 0) return null; // Invalid duration

  // Convert duration to hh:mm format
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;
  return `${hours}:${String(minutes).padStart(2, '0')}`;
}

// Calculate total hours for payroll
function calculateTotalHours(duration) {
  const [hours, minutes] = duration.split(':').map(Number);
  return hours + (minutes / 60); // Convert minutes to hours
}

// Convert decimal hours to hours and minutes
function decimalToHoursMinutes(decimalHours) {
  const hours = Math.floor(decimalHours);
  const minutes = Math.round((decimalHours - hours) * 60);
  return { hours, minutes };
}

// Update the entries list
function updateEntriesList() {
  const entriesList = document.getElementById('entries-list');
  entriesList.innerHTML = ''; // Clear the list

  entries.forEach((entry, index) => {
    const li = document.createElement('li');
    li.textContent = `Entry ${index + 1}: ${entry}`;
    entriesList.appendChild(li);
  });
}

// Update the total hours across all entries
function updateTotalHours() {
  let totalHours = 0;

  entries.forEach((entry) => {
    const [hours, minutes] = entry.split(':').map(Number);
    totalHours += hours + (minutes / 60); // Convert minutes to hours
  });

  // Display total hours in decimal format
  document.getElementById('total-hours').textContent = `Total Hours: ${totalHours.toFixed(2)}`;

  // Convert total hours to hours and minutes
  const { hours, minutes } = decimalToHoursMinutes(totalHours);
  document.getElementById('total-hours-readable').textContent = `Total Hours: ${hours} hours and ${minutes} minutes`;
}
