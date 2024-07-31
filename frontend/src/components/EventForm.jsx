// import PropTypes from "prop-types";

import { useState } from "react";
import Select from "./ui/Select";
import WeekdayBubbles from "./ui/WeekdayBubbles";

export const EventForm = () => {
  const [fields, setFields] = useState({
    name: "",
    description: "",
    recurring: true,
    recurringN: "1",
    recurringFrequency: "weeks",
    recurringDays: ["mon", "wed"],
    recurringEnds: "never",
    recurringEndsOnDate: new Date(),
    recurringEndsAfterN: "13",
  });

  const handleInputChange = e => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = e => {
    setFields({ ...fields, [e.target.name]: e.target.checked });
  };

  return (
    <div className="mx-auto max-w-lg">
      <header>
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
          Add a new bill
        </h1>
      </header>
      <form>
        <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
          <div className="col-span-full">
            <label
              htmlFor="name"
              className="block text-sm font-medium leading-6 text-gray-900">
              Bill name
            </label>
            <div className="mt-2">
              <input
                id="name"
                name="name"
                value={fields.name}
                onChange={handleInputChange}
                type="text"
                autoComplete="off"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="col-span-full">
            <label
              htmlFor="description"
              className="block text-sm font-medium leading-6 text-gray-900">
              Description
            </label>
            <div className="mt-2">
              <textarea
                rows={3}
                id="description"
                name="description"
                value={fields.description}
                onChange={handleInputChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="col-span-full">
            <div className="relative flex items-start pb-4 pt-3.5">
              <div className="min-w-0 flex-1 text-sm leading-6">
                <label
                  htmlFor="recurring"
                  className="font-medium text-gray-900">
                  Recurring?
                </label>
                <p id="recurring" className="text-gray-500">
                  Most bills tend to be recurring
                </p>
              </div>
              <div className="ml-3 flex h-6 items-center">
                <input
                  id="recurring"
                  aria-describedby="recurring"
                  name="recurring"
                  type="checkbox"
                  checked={fields.recurring}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                />
              </div>
            </div>
          </div>

          <div className="col-span-1 col-start-1 flex items-center">Every</div>
          <div className="col-span-1">
            <input
              id="recurringN"
              name="recurringN"
              value={fields.recurringN}
              onChange={handleInputChange}
              type="number"
              autoComplete="off"
              className="block w-full rounded-md border-0 py-1.5 pr-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
          <div className="col-span-4">
            <Select
              options={["days", "weeks", "months", "years"]}
              selected={fields.recurringFrequency}
              setSelected={x => setFields({ ...fields, recurringFrequency: x })}
            />
          </div>

          <div className="col-span-full">
            <WeekdayBubbles
              weekdays={["sun", "mon", "tue", "wed", "thur", "fri", "sat"]}
              selected={fields.recurringDays}
              setSelected={x => setFields({ ...fields, recurringDays: x })}
            />
          </div>

          <div className="col-span-full">
            <label className="text-base font-semibold text-gray-900">
              Ends
            </label>
            <p className="text-sm text-gray-500">
              When should the recurrence end?
            </p>
            <fieldset className="mt-4">
              <legend className="sr-only">Notification method</legend>
              <div className="grid grid-cols-3 gap-x-4">
                <div className="flex h-full items-start">
                  <div className="flex items-center">
                    <input
                      id="endsNever"
                      name="ends"
                      type="radio"
                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                    <label
                      htmlFor="endsNever"
                      className="ml-3 block text-sm font-medium leading-6 text-gray-900">
                      Never
                    </label>
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <input
                      id="endsOn"
                      name="ends"
                      type="radio"
                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                    <label
                      htmlFor="endsOn"
                      className="ml-3 block text-sm font-medium leading-6 text-gray-900">
                      On
                    </label>
                  </div>
                  <div className="mt-2 flex items-center">
                    <input
                      id="endsOnDate"
                      name="endsOnDate"
                      type="date"
                      autoComplete="off"
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <input
                      id="endsAfter"
                      name="ends"
                      type="radio"
                      className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                    <label
                      htmlFor="endsAfter"
                      className="ml-3 block text-sm font-medium leading-6 text-gray-900">
                      After
                    </label>
                  </div>
                  <div className="mt-2">
                    <div className="relative rounded-md shadow-sm">
                      <input
                        type="number"
                        name="price"
                        id="price"
                        className="block w-full rounded-md border-0 py-1.5 pl-7 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <span
                          className="text-gray-500 sm:text-sm"
                          id="price-currency">
                          occurrences
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </fieldset>
          </div>
        </div>
      </form>
    </div>
  );
};

EventForm.propTypes = {};
