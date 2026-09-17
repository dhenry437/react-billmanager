import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="relative isolate px-6 pt-14 lg:px-8">
      <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            The simple way to manage your bills
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Align your upcoming bills with your paycheck cycles so you always
            know exactly how much to set aside from each pay. No spreadsheets, no
            surprises.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              to="/dashboard"
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              Get started
            </Link>
            <Link
              to="/how-it-works"
              className="text-sm font-semibold leading-6 text-gray-900 hover:text-indigo-600 transition-colors">
              Learn more <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
