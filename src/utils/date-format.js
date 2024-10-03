function formatDate(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function formatDayOfWeek(date) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
  return days[date.getDay()];
}

export const getDaysOfCurrentWeek = () => {
  const currentDate = new Date();
  const currentDay = currentDate.getDay();

  const firstDayOfWeek = new Date(currentDate);
  firstDayOfWeek.setDate(currentDate.getDate() - currentDay + 1);

  const daysOfWeek = [];

  for (let i = 0; i < 7; i++) {
    const day = new Date(firstDayOfWeek);
    day.setDate(firstDayOfWeek.getDate() + i);
    daysOfWeek.push({ date: formatDate(day), dayOfWeek: formatDayOfWeek(day) });
  }

  return daysOfWeek;
};
