import { useContext, useState } from "react";
import mark from "../assets/mark.svg";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "./Spinner";
import { signIn } from "../data/repository";
import Alert from "./Alert";
import AuthContext from "../hooks/AuthContext";

export default function SignIn() {
  const { signInUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const [fields, setFields] = useState({ email: "", password: "" });
  const [alerts, setAlerts] = useState({ form: null });
  const [loading, setLoading] = useState({ form: false });

  const handleInputChange = e => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    setLoading({ ...loading, form: true });
    setAlerts({ ...alerts, form: null });

    const response = await signIn(fields);
    if (response.status === 200) {
      setLoading({ ...loading, form: false });
      setAlerts({ ...alerts, form: response.data.alert });

      signInUser(response.data.user);

      navigate("/dashboard");
    } else {
      setLoading({ ...loading, form: false });
      setAlerts({ ...alerts, form: response.data.alert });
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img alt="Logo" src={mark} className="mx-auto h-10 w-auto" />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {alerts.form && (
            <Alert
              className="mb-6"
              type={alerts.form.type}
              heading={alerts.form.heading}
              message={alerts.form.message}
              list={alerts.form.list}
              buttons={alerts.form.buttons}
            />
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={fields.email}
                  onChange={handleInputChange}
                  required
                  autoComplete="email"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900">
                  Password
                </label>
                {/* // TODO Forgot password */}
                {/* <div className="text-sm">
                  <a
                    href="#"
                    className="font-semibold text-indigo-600 hover:text-indigo-500">
                    Forgot password?
                  </a>
                </div> */}
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={fields.password}
                  onChange={handleInputChange}
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                {loading.form ? (
                  <>
                    <Spinner />
                    Loading...
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?{" "}
            <Link
              to="/sign-up"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
