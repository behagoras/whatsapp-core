const getFormattedDates = (date) => {
  // const date = new Date()
  const year = date.getFullYear(); // 2019
  const month = date.getMonth(); // 2019
  const day = date.getDay(); // 2019

  const formatted = `${day}, ${month} ${year}`;
  return formatted;
};


module.exports = getFormattedDates;
