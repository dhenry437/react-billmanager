import { useEffect, useState } from "react";
import Select from "./ui/Select";
import WeekdayBubbles from "./ui/WeekdayBubbles";
import { format, isAfter } from "date-fns";
import { getOrdinalWeekdayOfMonth, titleCase } from "../util";
import { createEvent } from "../data/repository";
import Spinner from "./Spinner";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

export const EventForm = () => {
  const eventType = window.location.pathname.split("/")[1].slice(0, -1);

  const { executeRecaptcha } = useGoogleReCaptcha();

  const [alerts, setAlerts] = useState({ form: null });
  const [loading, setLoading] = useState({ form: false });
  const [fields, setFields] = useState({
    name: "",
    amount: "0",
    description: "",
    date: format(new Date(), "yyyy-MM-dd"),
    recurring: true,
    recurringN: "1",
    recurringFrequency: "weeks",
    recurringDays: [
      { name: "sun", selected: false },
      { name: "mon", selected: false },
      { name: "tue", selected: false },
      { name: "wed", selected: false },
      { name: "thu", selected: false },
      { name: "fri", selected: false },
      { name: "sat", selected: false },
    ],
    recurringMonthly: "nth",
    recurringEnds: "never",
    recurringEndsOnDate: format(new Date(), "yyyy-MM-dd"),
    recurringEndsAfterN: "5",
  });

  // When date is changed, update end date if it is before date
  useEffect(() => {
    setFields(fields =>
      isAfter(fields.date, fields.recurringEndsOnDate)
        ? { ...fields, recurringEndsOnDate: fields.date }
        : fields
    );
  }, [fields.date]);

  const handleInputChange = e => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = e => {
    setFields({ ...fields, [e.target.name]: e.target.checked });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const token = await executeRecaptcha("create_event");

    setLoading({ ...loading, form: true });
    setAlerts({ ...alerts, form: null });

    const response = await createEvent({ ...fields, type: eventType, token });
    if (response.status === 200) {
      setLoading({ ...loading, form: false });
      setAlerts({ ...alerts, form: response.data.alert });
    } else {
      setLoading({ ...loading, form: false });
      setAlerts({ ...alerts, form: response.data.alert });
    }
  };

  return (
    <div className="mx-auto max-w-lg">
      <header>
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
          Add a new {eventType}
        </h1>
      </header>
      <form onSubmit={handleSubmit}>
        <div className="mt-6 grid  gap-x-6 gap-y-6 grid-cols-6">
          <div className="col-span-full">
            <label
              htmlFor="name"
              className="block text-sm font-medium leading-6 text-gray-900">
              {titleCase(eventType)} name
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
                required
              />
            </div>
          </div>

          <div className="col-span-full">
            <label
              htmlFor="amount"
              className="block text-sm font-medium leading-6 text-gray-900">
              Amount
            </label>
            <div className="relative mt-2 rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                name="amount"
                id="amount"
                value={fields.amount}
                onChange={handleInputChange}
                min={0}
                className="block w-full rounded-md border-0 py-1.5 pl-7 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder="0.00"
                step={0.01}
                required
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
            <label
              htmlFor="description"
              className="block text-sm font-medium leading-6 text-gray-900">
              {fields.recurring ? "Start date" : "Date"}
            </label>
            <div className="mt-2">
              <input
                id="date"
                name="date"
                value={fields.date}
                onChange={handleInputChange}
                type="date"
                autoComplete="off"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                required
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
                  Most {eventType}s tend to be recurring
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

          {fields.recurring && (
            <>
              <div className="col-span-1 col-start-1 flex items-center">
                Every
              </div>
              <div className="col-span-1">
                <input
                  id="recurringN"
                  name="recurringN"
                  value={fields.recurringN}
                  onChange={handleInputChange}
                  type="number"
                  min={1}
                  autoComplete="off"
                  className="block w-full rounded-md border-0 py-1.5 pr-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  required
                />
              </div>
              <div className="col-span-4">
                <Select
                  options={["days", "weeks", "months", "years"]}
                  selected={fields.recurringFrequency}
                  setSelected={x =>
                    setFields({ ...fields, recurringFrequency: x })
                  }
                />
              </div>

              {fields.recurringFrequency === "weeks" && (
                <div className="col-span-full">
                  <WeekdayBubbles
                    weekdays={fields.recurringDays}
                    setWeekdays={x =>
                      setFields({ ...fields, recurringDays: x })
                    }
                  />
                </div>
              )}

              {fields.recurringFrequency === "months" && (
                <div className="col-span-full">
                  <fieldset>
                    <legend className="sr-only">Recurring Frequency</legend>
                    <div className="space-y-5">
                      <div className="relative flex items-start">
                        <div className="flex h-6 items-center">
                          <input
                            id="recurringMonthly"
                            name="recurringMonthly"
                            value="nth"
                            onChange={handleInputChange}
                            checked={fields.recurringMonthly === "nth"}
                            type="radio"
                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                          />
                        </div>
                        <div className="ml-3 text-sm leading-6">
                          <label
                            htmlFor="recurringMonthly"
                            className="flex items-center font-medium text-gray-900">
                            Monthly on the{" "}
                            {`${getOrdinalWeekdayOfMonth(fields.date)} ${format(
                              fields.date,
                              "EEEE"
                            )}`}
                          </label>
                        </div>
                      </div>
                      <div className="relative flex items-start">
                        <div className="flex h-6 items-center">
                          <input
                            id="recurringMonthly"
                            name="recurringMonthly"
                            value="date"
                            onChange={handleInputChange}
                            checked={fields.recurringMonthly === "date"}
                            type="radio"
                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                          />
                        </div>
                        <div className="ml-3 text-sm leading-6">
                          <label
                            htmlFor="recurringMonthly"
                            className="font-medium text-gray-900">
                            Monthly on the {format(fields.date, "do")}
                          </label>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Hint: Use start date to change the day or date
                    </p>
                  </fieldset>
                </div>
              )}

              <div className="col-span-full">
                <label className="text-base font-semibold text-gray-900">
                  Ends
                </label>
                <p className="text-sm text-gray-500">
                  When should the recurrence end?
                </p>
                <fieldset className="mt-4">
                  <legend className="sr-only">Recurring End</legend>
                  <div className="flex sm:grid grid-cols-3 gap-x-4">
                    <div className="flex h-full items-start">
                      <div className="flex items-center">
                        <input
                          id="endsNever"
                          name="recurringEnds"
                          value="never"
                          onChange={handleInputChange}
                          checked={fields.recurringEnds === "never"}
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
                          name="recurringEnds"
                          value="on"
                          onChange={handleInputChange}
                          checked={fields.recurringEnds === "on"}
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
                          name="recurringEndsOnDate"
                          value={fields.recurringEndsOnDate}
                          onChange={handleInputChange}
                          type="date"
                          min={format(fields.date, "yyyy-MM-dd")}
                          autoComplete="off"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          required={fields.recurringEnds === "on"}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <input
                          id="endsAfter"
                          name="recurringEnds"
                          value="after"
                          onChange={handleInputChange}
                          checked={fields.recurringEnds === "after"}
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
                            name="recurringEndsAfterN"
                            id="endsAfterN"
                            value={fields.recurringEndsAfterN}
                            onChange={handleInputChange}
                            min={1}
                            className="block w-full rounded-md border-0 py-1.5 sm:pr-[98px] text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            required={fields.recurringEnds === "after"}
                          />
                          <div className="hidden sm:flex pointer-events-none absolute inset-y-0 right-0 items-center pr-3">
                            <span className="text-gray-500 text-sm">
                              occurrences
                            </span>
                          </div>
                          <div className="flex justify-end sm:hidden text-gray-500 text-sm ">
                            <span>occurrences</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </fieldset>
              </div>
              <div className="col-span-full">
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                  {loading.form ? (
                    <>
                      <Spinner />
                      Loading...
                    </>
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </form>
    </div>
  );
};
