import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
} from "@heroicons/react/20/solid";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

// ? {
// ?   type: success|info|warning|danger
// ?   heading: String|null
// ?   message: String|null
// ?   list: [String]|null
// ?   buttons: [{
// ?     text: String
// ?     href: String
// ?   }]|null
// ? }

export default function Alert(props) {
  const { className, type, heading, message, list, buttons } = props;

  const renderIcon = type => {
    switch (type) {
      case "success":
        return (
          <CheckCircleIcon
            className="h-5 w-5 text-green-400"
            aria-hidden="true"
          />
        );
      case "info":
        return (
          <InformationCircleIcon
            className="h-5 w-5 text-blue-400"
            aria-hidden="true"
          />
        );
      case "warning":
        return (
          <ExclamationTriangleIcon
            className="h-5 w-5 text-yellow-400"
            aria-hidden="true"
          />
        );
      case "danger":
        return (
          <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
        );
    }
  };

  const colour = type => {
    switch (type) {
      case "success":
        return "green";
      case "info":
        return "blue";
      case "warning":
        return "yellow";
      case "danger":
        return "red";
    }
  };

  return (
    <div className={`rounded-md bg-${colour(type)}-50 p-4 ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">{renderIcon(type)}</div>
        <div className="ml-3">
          {heading && (
            <h3 className={`text-sm font-medium text-${colour(type)}-800`}>
              {heading}
            </h3>
          )}
          {(message || list) && (
            <div
              className={`${heading ? "mt-2" : ""} text-sm text-${colour(
                type
              )}-700`}>
              {message && <p className={`${list && "mb-2"}`}>{message}</p>}
              {list && (
                <ul role="list" className="list-disc space-y-1 pl-5">
                  {list.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
          {buttons && (
            <div className={list ? "mt-2" : "mt-4"}>
              {buttons.map((button, i) => (
                <Link
                  key={i}
                  to={button.href}
                  className={`rounded-md bg-${colour(
                    type
                  )}-50 px-2 py-1.5 text-sm font-medium text-${colour(
                    type
                  )}-800 hover:bg-${colour(
                    type
                  )}-100 focus:outline-none focus:ring-2 focus:ring-${colour(
                    type
                  )}-600 focus:ring-offset-2 focus:ring-offset-${colour(
                    type
                  )}-50`}>
                  {button.text}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
Alert.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string.isRequired,
  heading: PropTypes.string,
  message: PropTypes.string,
  list: PropTypes.array,
  buttons: PropTypes.array,
};
