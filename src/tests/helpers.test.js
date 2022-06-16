import { getTotalPagesInArray, paginateArray } from "../util/helpers";

describe("getTotalPagesInArray()", () => {
  it("Should return 2", () => {
    expect(getTotalPagesInArray([1, 3, 3, 5], 2)).toEqual(2);
  })
  it("Should return 4", () => {
    expect(getTotalPagesInArray([1, 3, 3, 5], 1)).toEqual(4);
  })
  it("Should return 2", () => {
    expect(getTotalPagesInArray([1, 3, 3, 5], 3)).toEqual(2);
  })
})

describe("paginateArray()", () => {
  it("Should return [3, 5]", () => {
    expect(paginateArray([1, 3, 3, 5], 2, 2)).toEqual([3, 5]);
  })
  it("Should return [5]", () => {
    expect(paginateArray([1, 3, 3, 5], 1, 4)).toEqual([5]);
  })
  it("Should return [1, 3, 3]", () => {
    expect(paginateArray([1, 3, 3, 5], 3, 1)).toEqual([1, 3, 3]);
  })
})