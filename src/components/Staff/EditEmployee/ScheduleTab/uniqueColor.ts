const availableColors = [
  "GREEN",
  "BLUE",
  "RED",
  "YELLOW",
  "GREY",
  "ORANGE",
  "BLACK",
];

export const getUniqueColor = (tours, usedColors, setUsedColors) => {
  const uniqueAvailableColors = availableColors.filter(
    (color) => !usedColors.includes(color)
  );

  const filteredUniqueColors = uniqueAvailableColors.filter(
    (color) => !tours.some((tour) => tour.color === color)
  );

  if (filteredUniqueColors.length === 0) {
    setUsedColors([]);
    return null; // You may want to handle this case differently
  }

  const colorIndex = Math.floor(Math.random() * filteredUniqueColors.length);
  const uniqueColor = filteredUniqueColors[colorIndex];

  setUsedColors((prevColors) => [...prevColors, uniqueColor]);

  return uniqueColor;
};
