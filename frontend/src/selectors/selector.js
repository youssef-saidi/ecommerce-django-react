/* eslint-disable no-plusplus */
/* eslint-disable no-else-return */
export const selectFilter = (products, filter) => {
  if (!products || products.length === 0) return [];
  const keyword = filter.keyword.toLowerCase();
  return products.filter((product) => {
    const isInRange = filter.maxPrice
      ? (parseFloat(product.price) >= filter.minPrice && parseFloat(product.price) <= filter.maxPrice)
      : true;
    const matchKeyword = product.keywords ? product.keywords.includes(keyword) : true;
    const matchDescription = product.description
      ? product.description.toLowerCase().includes(keyword)
      : true;
    const matchBrand = product.brand ? product.brand.toLowerCase().includes(filter.brand) : true;

    return ((matchKeyword || matchDescription) && matchBrand && isInRange);
  }).sort((a, b) => {
    if (filter.sortBy === 'name-desc') {
      return a.name < b.name ? 1 : -1;
    } else if (filter.sortBy === 'name-asc') {
      return a.name > b.name ? 1 : -1;
    } else if (filter.sortBy === 'price-desc') {
      return parseFloat(a.price) < parseFloat(b.price) ? 1 : -1;
    }

    return parseFloat(a.price) > parseFloat(b.price) ? 1 : -1;
  });
};

// Select product with highest price
export const selectMax = (products) => {
  if (!products || products.length === 0) return 0;
  let high =products[0];


  for (let i = 0; i < products.length; i++) {
    if (parseInt(products[i].price) > parseInt(high.price)) {
      high = products[i];
    }
  }

  return Math.floor(parseFloat(high.price));
};

// Select product with lowest price
export const selectMin = (products) => {
  if (!products || products.length === 0) return 0;
  let low = products[0];

  for (let i = 0; i < products.length; i++) {
    if (parseInt(products[i].price) < parseInt(low.price)) {
      low = products[i];
    }
  }

  return Math.floor(parseFloat(low.price));
};
