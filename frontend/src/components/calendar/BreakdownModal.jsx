import PropTypes from "prop-types";
import { Fragment } from "react";
import { CurrencyDollarIcon, XMarkIcon } from "@heroicons/react/20/solid";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Link } from "react-router-dom";

export default function BreakdownModal(props) {
  const { breakdownModalOpen, setBreakdownModalOpen, breakdown } = props;

  return (
    <Transition show={breakdownModalOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={setBreakdownModalOpen}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 transition-opacity" />
        </TransitionChild>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
              <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full max-w-fit sm:p-6 sm:pt-9">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={() => setBreakdownModalOpen(false)}>
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="py-2 flow-root px-3">
                  <ul role="list" className="-mb-8">
                    {breakdown.map((breakdownItem, i) => {
                      const { name, amount, id, description } = breakdownItem;

                      return (
                        <li key={i}>
                          <Link to={`/bills/${id}`}>
                            <div className="relative pb-8">
                              {i !== breakdown.length - 1 ? (
                                <span
                                  className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                                  aria-hidden="true"
                                />
                              ) : null}
                              <div className="relative flex space-x-3">
                                <div>
                                  <span className="bg-red-500 h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white">
                                    <CurrencyDollarIcon
                                      className="h-5 w-5 text-white"
                                      aria-hidden="true"
                                    />
                                  </span>
                                </div>
                                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">
                                      {name}
                                      {"  "}
                                      <span className="font-normal text-gray-500">
                                        {description}
                                      </span>
                                    </p>
                                  </div>
                                  <div className="whitespace-nowrap text-right text-sm text-gray-500">
                                    <span>
                                      ${parseFloat(amount.toFixed(2))}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div className="mt-5 sm:mt-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    onClick={() => setBreakdownModalOpen(false)}>
                    Go back to dashboard
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

BreakdownModal.propTypes = {
  breakdownModalOpen: PropTypes.bool.isRequired,
  setBreakdownModalOpen: PropTypes.func.isRequired,
  breakdown: PropTypes.array.isRequired,
};
