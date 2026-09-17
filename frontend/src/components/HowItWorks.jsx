import { Link } from "react-router-dom";
import {
  BanknotesIcon,
  CalendarDaysIcon,
  CalculatorIcon,
  ArrowPathIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

export default function HowItWorks() {
  return (
    <div className="bg-white py-8 sm:py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Stress-free bill planning, synchronized with your paydays
          </h1>
          <p className="mt-5 text-base sm:text-lg leading-7 text-gray-600">
            Most budgets look backward at what you already spent. BillManager
            looks forward—ensuring that every time you receive a paycheck, you
            know the exact amount to set aside so every bill is fully funded
            when due.
          </p>
        </div>

        {/* 3 Step Workflow */}
        <div className="mt-16 sm:mt-20">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Step 1 */}
            <div className="relative flex flex-col rounded-2xl border border-gray-200 bg-gray-50/50 p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white mb-6 shadow-sm">
                <BanknotesIcon className="h-6 w-6" aria-hidden="true" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-1">
                Step 1
              </span>
              <h3 className="text-lg font-semibold text-gray-900">
                Log Your Paydays
              </h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Whether you are paid weekly, fortnightly, or monthly, set up
                your earning schedule. BillManager establishes pay cycles to
                anchor your savings targets.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative flex flex-col rounded-2xl border border-gray-200 bg-gray-50/50 p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white mb-6 shadow-sm">
                <CalendarDaysIcon className="h-6 w-6" aria-hidden="true" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-1">
                Step 2
              </span>
              <h3 className="text-lg font-semibold text-gray-900">
                Add Your Bills
              </h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Track frequent subscriptions, monthly rent, quarterly utility
                bills, or one-off medical expenses. Set due dates and recurring
                frequencies in seconds.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative flex flex-col rounded-2xl border border-gray-200 bg-gray-50/50 p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white mb-6 shadow-sm">
                <ShieldCheckIcon className="h-6 w-6" aria-hidden="true" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-1">
                Step 3
              </span>
              <h3 className="text-lg font-semibold text-gray-900">
                Follow Target Savings
              </h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Every single day on your calendar features a Target Savings
                figure. Keep that balance in your bills account, and you will
                never be caught off guard.
              </p>
            </div>
          </div>
        </div>

        {/* How Target Savings is Calculated */}
        <div className="mt-20 sm:mt-24 rounded-3xl border border-gray-200 bg-white p-8 sm:p-12 shadow-sm">
          <div className="max-w-3xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
              The Philosophy
            </span>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              How Target Savings is Calculated
            </h2>
            <p className="mt-4 text-base leading-7 text-gray-600">
              Traditional bill tracking either makes you hoard a large lump sum
              at all times or leaves you stressed when a large quarterly invoice
              arrives. BillManager distributes costs proportionally across your
              actual earning opportunities.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Card A: Bills within current cycle */}
            <div className="rounded-xl border border-gray-100 bg-gray-50/80 p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
                  <ArrowPathIcon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="font-semibold text-gray-900">
                  Bills Due in Your Current Pay Cycle
                </h3>
              </div>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                If an upcoming bill (such as weekly groceries or a subscription)
                falls between your most recent payday and your next one, it has
                no further paydays ahead to save up. The full amount is budgeted
                immediately from your current paycheck so the money is reserved
                until payment day.
              </p>
            </div>

            {/* Card B: Bills spread across paydays */}
            <div className="rounded-xl border border-gray-100 bg-gray-50/80 p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
                  <CalculatorIcon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="font-semibold text-gray-900">
                  Larger Bills Spread Across Paydays
                </h3>
              </div>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                For larger expenses like electricity, insurance, or council
                rates, BillManager counts how many paydays occur between bill
                cycles. Each payday sets aside an equal fraction of the bill,
                steadily accumulating to 100% right on the due date.
              </p>
            </div>
          </div>

          {/* Example Walkthrough Box */}
          <div className="mt-10 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-6 sm:p-8">
            <h4 className="text-base font-semibold text-indigo-950 flex items-center gap-2">
              <CheckCircleIcon className="h-5 w-5 text-indigo-600 flex-shrink-0" />
              Example: Car Registration ($300, due in 3 paydays)
            </h4>
            <p className="mt-2 text-sm text-indigo-900/80">
              Rather than scrambling for $300 all at once, your Target Savings
              progressively paces the bill:
            </p>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-indigo-100">
                <p className="text-xs font-medium text-gray-500 uppercase">
                  Payday 1
                </p>
                <p className="mt-1 text-xl font-bold text-gray-900">$100</p>
                <p className="mt-1 text-xs text-gray-500">
                  1 of 3 paydays past
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-indigo-100">
                <p className="text-xs font-medium text-gray-500 uppercase">
                  Payday 2
                </p>
                <p className="mt-1 text-xl font-bold text-gray-900">$200</p>
                <p className="mt-1 text-xs text-gray-500">
                  2 of 3 paydays past
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-indigo-100 ring-2 ring-indigo-600">
                <p className="text-xs font-semibold text-indigo-600 uppercase">
                  Due Date (Payday 3)
                </p>
                <p className="mt-1 text-xl font-bold text-indigo-600">$300</p>
                <p className="mt-1 text-xs text-indigo-700 font-medium">
                  Fully funded & ready
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Breakdown & Calculator Feature */}
        <div className="mt-16 sm:mt-20 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800 mb-3">
              Built-in Confidence
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Instant breakdown & balance checking
            </h2>
            <p className="mt-4 text-base leading-7 text-gray-600">
              Curious about what makes up today&apos;s savings target? Click any
              Target Savings badge on the calendar to open an itemized
              breakdown.
            </p>
            <ul className="mt-6 space-y-4 text-sm text-gray-600">
              <li className="flex items-start gap-3">
                <CheckCircleIcon className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Itemized List:</strong> See every bill and its exact
                  accrued share for that date.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircleIcon className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Balance Calculator:</strong> Type in your bank balance
                  to immediately see whether you have a surplus or need to top
                  up your bills account.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircleIcon className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>One-Click Copy:</strong> Copy the exact deposit amount
                  needed directly to your clipboard for fast bank transfers.
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
            <div className="rounded-xl bg-white border border-gray-200 p-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Target Savings Breakdown (Sample)
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                  Today
                </span>
              </div>
              <div className="divide-y divide-gray-100 text-sm">
                <div className="flex justify-between py-3">
                  <div>
                    <p className="font-medium text-gray-900">Rent</p>
                    <p className="text-xs text-gray-500">
                      Monthly accommodation
                    </p>
                  </div>
                  <span className="font-semibold text-gray-900">$586.50</span>
                </div>
                <div className="flex justify-between py-3">
                  <div>
                    <p className="font-medium text-gray-900">
                      Car Registration
                    </p>
                    <p className="text-xs text-gray-500">Quarterly rego</p>
                  </div>
                  <span className="font-semibold text-gray-900">$161.64</span>
                </div>
                <div className="flex justify-between py-3">
                  <div>
                    <p className="font-medium text-gray-900">Electricity</p>
                    <p className="text-xs text-gray-500">Quarterly power</p>
                  </div>
                  <span className="font-semibold text-gray-900">$75.00</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center">
                <span className="font-bold text-gray-900 text-sm">
                  Total Target Balance
                </span>
                <span className="font-bold text-indigo-600 text-base">
                  $823.14
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Call to Action */}
        <div className="mt-16 sm:mt-20 rounded-3xl bg-gray-900 px-6 py-12 sm:px-12 sm:py-16 text-center text-white shadow-xl">
          <h2 className="text-2xl font-bold tracking-tight sm:text-4xl">
            Take control of your bills today
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-gray-300">
            Stop worrying about whether you have enough money left over when
            bills come due. Set up your schedule and let BillManager do the
            math.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/dashboard"
              className="rounded-md bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 transition-colors"
            >
              Get started
            </Link>
            <Link
              to="/sign-in"
              className="rounded-md bg-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-white/20 transition-colors"
            >
              Sign in to your account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
