import * as moment from "moment";
import { DATE_FORMAT } from "../fitbit/metrics";

export default (date: string | undefined): true | string => {
  if (date && moment(date, DATE_FORMAT, true).isValid()) {
    return true;
  } else {
    return `Date ${date} is not valid. Please use the format ${DATE_FORMAT}`;
  }
};
