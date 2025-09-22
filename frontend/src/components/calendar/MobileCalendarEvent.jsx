import PropTypes from "prop-types";
import { titleCase } from "../../util";
import { Link } from "react-router-dom";

export default function MobileCalendarEvent(props) {
  const { id, type, name, description, amount, getEventColour } = props;
  return (
    <li className="group flex p-4 pr-6 focus-within:bg-gray-50 hover:bg-gray-50">
      <div className="flex-auto">
        <span
          className={`inline-flex items-center justify-between gap-x-1.5 rounded-md bg-${getEventColour(
            type
          )}-100 hover:bg-${getEventColour(
            type
          )}-200 px-2 py-1 text-xs font-normal text-${getEventColour(
            type
          )}-700`}>
          <div className="inline-flex items-center gap-x-1.5">
            <svg
              className={`h-1.5 w-1.5 fill-${getEventColour(type)}-500`}
              viewBox="0 0 6 6"
              aria-hidden="true">
              <circle cx={3} cy={3} r={3} />
            </svg>
            <span>{titleCase(type)}</span>
          </div>
        </span>
        <p className=" mt-2 font-semibold text-gray-900">{name}</p>
        <p className="text-gray-800">{description}</p>
        <p className="mt-2 text-gray-700">${amount}</p>
      </div>
      <Link
        to={`/${type}s/${id}`}
        className="ml-6 flex-none self-center rounded-md bg-white px-3 py-2 font-semibold text-gray-900 opacity-0 shadow-sm ring-1 ring-inset ring-gray-300 hover:ring-gray-400 focus:opacity-100 group-hover:opacity-100">
        Edit<span className="sr-only">, {name}</span>
      </Link>
    </li>
  );
}

MobileCalendarEvent.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
  getEventColour: PropTypes.func.isRequired,
};
