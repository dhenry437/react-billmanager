import PropTypes from "prop-types";
import { Fragment } from "react";
import {
  Label,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Select(props) {
  const { label, options, selected, setSelected } = props;

  return (
    <Listbox value={selected} onChange={setSelected}>
      {({ open }) => (
        <>
          <Label className="block text-sm font-medium leading-6 text-gray-900">
            {label}
          </Label>
          <div className="relative">
            <ListboxButton className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
              <span className="block truncate">{selected}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </ListboxButton>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0">
              <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {options.map((option, i) => (
                  <ListboxOption
                    key={i}
                    className={({ focus }) =>
                      classNames(
                        focus ? "bg-indigo-600 text-white" : "text-gray-900",
                        "relative cursor-default select-none py-2 pl-3 pr-9"
                      )
                    }
                    value={option}>
                    {({ selected, focus }) => (
                      <>
                        <span
                          className={classNames(
                            selected ? "font-semibold" : "font-normal",
                            "block truncate"
                          )}>
                          {option}
                        </span>

                        {selected ? (
                          <span
                            className={classNames(
                              focus ? "text-white" : "text-indigo-600",
                              "absolute inset-y-0 right-0 flex items-center pr-4"
                            )}>
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </ListboxOption>
                ))}
              </ListboxOptions>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
}

Select.propTypes = {
  options: PropTypes.array.isRequired,
  label: PropTypes.string,
  selected: PropTypes.string.isRequired,
  setSelected: PropTypes.func.isRequired,
};
