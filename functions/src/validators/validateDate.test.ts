import isValid from "./validateDate";

test("it validates a valid date", () => {
  const date = "2020-08-02";
  const result = isValid(date);
  expect(result).toBe(true);
});

test("it invalidates an invalid date", () => {
  const date = "2020-8-02";
  const result = isValid(date);
  expect(result).not.toBe(true);
});
