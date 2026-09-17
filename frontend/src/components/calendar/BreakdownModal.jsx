import PropTypes from "prop-types";
import { Fragment, useState, useRef, useEffect } from "react";
import {
  CalculatorIcon,
  CheckIcon,
  ClipboardDocumentIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Link } from "react-router-dom";
import { formatCurrency, getCurrencySymbol } from "../../util";

export default function BreakdownModal(props) {
  const { breakdownModalOpen, setBreakdownModalOpen, breakdown, targetSavings } =
    props;

  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [currentBalance, setCurrentBalance] = useState("");
  const [copied, setCopied] = useState(false);
  const balanceInputRef = useRef(null);

  useEffect(() => {
    if (calculatorOpen) {
      const frame = requestAnimationFrame(() => {
        balanceInputRef.current?.focus();
      });
      return () => cancelAnimationFrame(frame);
    }
  }, [calculatorOpen]);

  const totalTarget =
    targetSavings?.amount ??
    (breakdown
      ? breakdown.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
      : 0);

  const bufferAmount = targetSavings?.bufferAmount || 0;

  const balanceNum = parseFloat(currentBalance);
  const hasValidBalance = !isNaN(balanceNum) && currentBalance.trim() !== "";
  const difference = hasValidBalance ? totalTarget - balanceNum : null;

  const handleCopyAmount = () => {
    if (difference === null) return;
    const valueToCopy = Math.abs(difference).toFixed(2);
    navigator.clipboard.writeText(valueToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Transition show={breakdownModalOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={setBreakdownModalOpen}
      >
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
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
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full max-w-fit sm:p-6 sm:pt-9">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={() => setBreakdownModalOpen(false)}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="py-2 flow-root px-3">
                  {(breakdown && breakdown.length > 0) || bufferAmount > 0 ? (
                    <ul role="list" className="-mb-8">
                      {breakdown?.map((breakdownItem, i) => {
                        const { name, amount, id, description } = breakdownItem;

                        return (
                          <li key={i}>
                            <Link to={`/bills/${id}`}>
                              <div className="relative pb-8">
                                {i !== breakdown.length - 1 || bufferAmount > 0 ? (
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
                                      <span>{formatCurrency(amount)}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          </li>
                        );
                      })}
                      {bufferAmount > 0 && (
                        <li key="buffer-item">
                          <div className="relative pb-8">
                            <div className="relative flex space-x-3">
                              <div>
                                <span className="bg-indigo-600 h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white">
                                  <ShieldCheckIcon
                                    className="h-5 w-5 text-white"
                                    aria-hidden="true"
                                  />
                                </span>
                              </div>
                              <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    Buffer
                                    {"  "}
                                    <span className="font-normal text-gray-500">
                                      Target savings buffer
                                    </span>
                                  </p>
                                </div>
                                <div className="whitespace-nowrap text-right text-sm text-gray-500">
                                  <span>{formatCurrency(bufferAmount)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      )}
                    </ul>
                  ) : (
                    <div className="py-6 text-center text-sm text-gray-500">
                      <p className="font-medium text-gray-900">
                        No bill contributions needed today
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        Target savings are split across paydays leading up to
                        each bill&apos;s due date. Make sure your paydays are
                        added to calculate savings.
                      </p>
                    </div>
                  )}
                </div>

                <Transition
                  show={calculatorOpen}
                  as="div"
                  enter="transition-all ease-out duration-300 overflow-hidden"
                  enterFrom="opacity-0 max-h-0 -translate-y-2"
                  enterTo="opacity-100 max-h-48 translate-y-0"
                  leave="transition-all ease-in duration-200 overflow-hidden"
                  leaveFrom="opacity-100 max-h-48 translate-y-0"
                  leaveTo="opacity-0 max-h-0 -translate-y-2"
                >
                  <div className="mt-4 rounded-lg bg-gray-50 p-3 ring-1 ring-inset ring-gray-200">
                    <div className="flex items-center justify-between gap-2">
                      <label
                        htmlFor="currentBalance"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Current account balance
                      </label>
                      <span className="text-sm text-gray-500">
                        Target:{" "}
                        <span className="font-semibold text-gray-800">
                          {formatCurrency(totalTarget)}
                        </span>
                      </span>
                    </div>
                    <div className="relative mt-1.5 rounded-md shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="text-gray-500 sm:text-sm">
                          {getCurrencySymbol()}
                        </span>
                      </div>
                      <input
                        ref={balanceInputRef}
                        type="number"
                        step="0.01"
                        id="currentBalance"
                        name="currentBalance"
                        value={currentBalance}
                        onChange={(e) => setCurrentBalance(e.target.value)}
                        placeholder="0.00"
                        className="block w-full rounded-md border-0 py-1.5 pl-7 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>

                    <div className="mt-2 text-sm">
                      {hasValidBalance ? (
                        <button
                          type="button"
                          onClick={handleCopyAmount}
                          title="Click to copy amount"
                          className="group w-full flex items-center justify-between p-1.5 -mx-1.5 rounded hover:bg-gray-100 active:bg-gray-200 transition-colors text-left"
                        >
                          {difference > 0 ? (
                            <>
                              <span className="text-indigo-700 font-medium">
                                Deposit needed:
                              </span>
                              <span className="flex items-center gap-1.5 text-sm font-semibold text-indigo-700">
                                {formatCurrency(difference)}
                                <span className="relative inline-flex h-4 w-4 items-center justify-center shrink-0">
                                  <ClipboardDocumentIcon
                                    className={`h-4 w-4 transition-all duration-200 transform text-gray-400 group-hover:text-indigo-600 ${
                                      copied
                                        ? "opacity-0 scale-50 -rotate-45 pointer-events-none"
                                        : "opacity-100 scale-100 rotate-0"
                                    }`}
                                  />
                                  <CheckIcon
                                    className={`absolute inset-0 h-4 w-4 text-emerald-600 transition-all duration-200 transform ${
                                      copied
                                        ? "opacity-100 scale-100 rotate-0"
                                        : "opacity-0 scale-50 rotate-45 pointer-events-none"
                                    }`}
                                  />
                                </span>
                              </span>
                            </>
                          ) : (
                            <>
                              <span className="text-emerald-700 font-medium">
                                Target covered:
                              </span>
                              <span className="flex items-center gap-1.5 text-sm font-semibold text-emerald-700">
                                {difference === 0
                                  ? "Exact target"
                                  : `+${formatCurrency(Math.abs(difference))} surplus`}
                                <span className="relative inline-flex h-4 w-4 items-center justify-center shrink-0">
                                  <ClipboardDocumentIcon
                                    className={`h-4 w-4 transition-all duration-200 transform text-gray-400 group-hover:text-emerald-600 ${
                                      copied
                                        ? "opacity-0 scale-50 -rotate-45 pointer-events-none"
                                        : "opacity-100 scale-100 rotate-0"
                                    }`}
                                  />
                                  <CheckIcon
                                    className={`absolute inset-0 h-4 w-4 text-emerald-600 transition-all duration-200 transform ${
                                      copied
                                        ? "opacity-100 scale-100 rotate-0"
                                        : "opacity-0 scale-50 rotate-45 pointer-events-none"
                                    }`}
                                  />
                                </span>
                              </span>
                            </>
                          )}
                        </button>
                      ) : (
                        <p className="text-gray-400 italic text-right">
                          Enter balance to calculate deposit
                        </p>
                      )}
                    </div>
                  </div>
                </Transition>

                <div className="mt-4 sm:mt-6 flex items-center gap-2">
                  <button
                    type="button"
                    className="inline-flex flex-1 justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    onClick={() => setBreakdownModalOpen(false)}
                  >
                    Go back to dashboard
                  </button>
                  <button
                    type="button"
                    onClick={() => setCalculatorOpen(!calculatorOpen)}
                    className={`inline-flex items-center justify-center rounded-md p-2 shadow-sm ring-1 ring-inset shrink-0 aspect-square transition-colors ${
                      calculatorOpen
                        ? "bg-indigo-50 text-indigo-600 ring-indigo-300 hover:bg-indigo-100"
                        : "bg-white text-gray-900 ring-gray-300 hover:bg-gray-50"
                    }`}
                    aria-label={
                      calculatorOpen ? "Close calculator" : "Open calculator"
                    }
                    aria-expanded={calculatorOpen}
                  >
                    <CalculatorIcon className="h-5 w-5" aria-hidden="true" />
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
  breakdown: PropTypes.array,
  targetSavings: PropTypes.object,
};
