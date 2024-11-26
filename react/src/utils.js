export const formatDate = date => {
  const dt = new Date(date);
  const isThisYear = dt.getFullYear() === new Date().getFullYear();
  return new Date(date).toLocaleDateString("en-GB", {
    weekday: "short", month: "short", day: "numeric", year: isThisYear ? undefined : "numeric"
  });
}