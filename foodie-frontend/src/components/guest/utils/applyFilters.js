// utils/applyFilters.js
export const applyFilters = (data, filters, searchText = "") => {
  let result = [...data];

  // ✅ Veg / Non-Veg
  if (filters.veg === "true") {
    result = result.filter(item => item.veg === true);
  }
  if (filters.veg === "false") {
    result = result.filter(item => item.veg === false);
  }

  // ✅ Category (more forgiving, Zomato-style)
  if (filters.category) {
    const category = filters.category.toLowerCase();
    result = result.filter(
      item =>
        item.category &&
        item.category.toLowerCase().includes(category)
    );
  }

  // ✅ Rating
  if (filters.rating) {
    result = result.filter(
      item => Number(item.rating) >= Number(filters.rating)
    );
  }

  // ✅ Text Search (SAFE + FLEXIBLE)
  if (searchText) {
    const text = searchText.toLowerCase();

    result = result.filter(item => {
      const itemName =
        item.name || item.itemName || "";

      const restaurantName =
        item.restaurantName || "";

      return (
        itemName.toLowerCase().includes(text) ||
        restaurantName.toLowerCase().includes(text)
      );
    });
  }

  // ✅ Sorting (IMMUTABLE)
  if (filters.sort === "price_low") {
    result = [...result].sort((a, b) => a.price - b.price);
  }

  if (filters.sort === "price_high") {
    result = [...result].sort((a, b) => b.price - a.price);
  }

  if (filters.sort === "rating") {
    result = [...result].sort((a, b) => b.rating - a.rating);
  }

  return result;
};
