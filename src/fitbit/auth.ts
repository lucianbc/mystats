import axios from "axios";

const x = "asd";

export default async () => {
  const ppl = await axios.get(
    "http://dummy.restapiexample.com/api/v1/employees"
  );
  console.debug(ppl);
  return ppl;
};
