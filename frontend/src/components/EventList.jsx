import { Link } from "react-router-dom";
import { sentenceCase, titleCase } from "../util";
import Spinner from "./Spinner";
import { useCallback, useEffect, useState } from "react";
import { getEventsCurrentUser } from "../data/repository";
import Alert from "./Alert";

export default function EventList() {
  const [tableData, setTableData] = useState(null);
  const [loading, setLoading] = useState(true);

  const eventType = window.location.pathname.split("/")[1].slice(0, -1);

  const fetchEventsCallback = useCallback(async () => {
    const response = await getEventsCurrentUser(eventType);

    if (response.status === 200) {
      setTableData(response.data.events);
    }
  }, [eventType]);

  useEffect(() => {
    fetchEventsCallback();
    setLoading(false);
  }, [fetchEventsCallback]);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            {titleCase(eventType)}s
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            View and manage all {eventType}s
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Link
            to={`/${eventType}s/add`}
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            Add {eventType}
          </Link>
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center mt-6 text-indigo-600">
          <div>
            <Spinner size={5} />
          </div>
        </div>
      ) : tableData?.length > 0 ? (
        <div className="-mx-4 mt-8 sm:-mx-0">
          <table className="min-w-full divide-y divide-gray-300">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                  Name
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell">
                  Description
                </th>
                <th
                  scope="col"
                  className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 sm:table-cell">
                  Amount
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  Recurring
                </th>
                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {tableData?.map(row => (
                <tr key={row.amount}>
                  <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-0">
                    {row.name}
                    <dl className="font-normal lg:hidden">
                      <dt className="sr-only">Description</dt>
                      <dd className="mt-1 truncate text-gray-700">
                        {row.description}
                      </dd>
                      <dt className="sr-only sm:hidden">Amount</dt>
                      <dd className="mt-1 truncate text-gray-500 sm:hidden">
                        ${row.amount}
                      </dd>
                    </dl>
                  </td>
                  <td className="hidden px-3 py-4 text-sm text-gray-500 lg:table-cell">
                    {row.description}
                  </td>
                  <td className="hidden px-3 py-4 text-sm text-gray-500 sm:table-cell">
                    ${row.amount}
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500">
                    {sentenceCase(row.recurring)}
                  </td>
                  <td className="py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                    <Link
                      to={`/paydays/${row.id}`}
                      className="text-indigo-600 hover:text-indigo-900">
                      Edit<span className="sr-only">, {row.name}</span>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-6 px-6">
          <Alert
            type="info"
            heading="It's rather empty here..."
            message={`Add some ${eventType}s to get started`}
          />
        </div>
      )}
    </div>
  );
}

// EventList.propTypes = {
//   title: PropTypes.string.isRequired,
//   subtitle: PropTypes.string.isRequired,
//   tableData: PropTypes.array,
//   button: PropTypes.object.isRequired,
//   loading: PropTypes.bool.isRequired,
// };
