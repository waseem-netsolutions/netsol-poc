export const paginateArray = (array, page_size, page_number) => {
  // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
  return array.slice((page_number - 1) * page_size, page_number * page_size);
}

export const getTotalPagesInArray = (arr, page_size) => {
  if(!Array.isArray(arr)) return 0;
  if(!arr.length) return 0;
  const result = arr.length/page_size;
  let pages = Math.floor(result);
  if(result > pages)
      return pages + 1;
  return pages;
}