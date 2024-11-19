export const formatDate = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }

  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export const usDate = (dateString) => {
   var inputDate = new Date(dateString);
   var formattedDate = inputDate.getFullYear()+'-'+(inputDate.getMonth() + 1)+'-'+ 
   inputDate.getDate();
   return formattedDate;
}
