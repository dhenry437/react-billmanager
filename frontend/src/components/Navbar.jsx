import { Fragment, useContext } from "react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Outlet, Link, useMatch } from "react-router-dom";
import mark from "../assets/mark.svg";
import AuthContext from "../hooks/AuthContext";
import Jdenticon from "react-jdenticon";

export default function Navbar() {
  const { user, signOutUser } = useContext(AuthContext);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", current: useMatch("/dashboard") },
    { name: "Bills", href: "/bills", current: useMatch("/bills") },
    { name: "Paydays", href: "/paydays", current: useMatch("/paydays") },
  ];
  const userNavigation = [{ name: "Sign out", action: signOutUser }];

  const classNames = (...classes) => {
    return classes.filter(Boolean).join(" ");
  };

  return (
    <>
      <div className="min-h-full">
        <Disclosure as="nav" className="border-b border-gray-200 bg-white">
          {({ open }) => (
            <>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 justify-between">
                  <div className="flex">
                    <div className="flex flex-shrink-0 items-center">
                      <Link to="/">
                        <img style={{ width: 32 }} src={mark} alt="Logo" />
                      </Link>
                    </div>
                    <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                      {navigation.map(item => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className={classNames(
                            item.current
                              ? "border-indigo-500 text-gray-900"
                              : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                            "inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium"
                          )}
                          aria-current={item.current ? "page" : undefined}>
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div className="hidden sm:ml-6 sm:flex sm:items-center">
                    {/* Profile dropdown */}
                    {user ? (
                      <Menu as="div" className="relative ml-3">
                        <div>
                          <MenuButton className="flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                            <span className="sr-only">Open user menu</span>
                            <div className="h-8 w-8 rounded-full">
                              <Jdenticon value={user.email} />
                            </div>
                          </MenuButton>
                        </div>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-200"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95">
                          <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            {userNavigation.map(item => (
                              <MenuItem key={item.name}>
                                {({ focus }) => {
                                  return Object.keys(item).find(
                                    x => x === "action"
                                  ) ? (
                                    <button
                                      className={classNames(
                                        focus ? "bg-gray-100" : "",
                                        "w-full text-left block px-4 py-2 text-sm text-gray-700"
                                      )}
                                      onClick={item.action}>
                                      {item.name}
                                    </button>
                                  ) : (
                                    <Link
                                      to={item.href}
                                      className={classNames(
                                        focus ? "bg-gray-100" : "",
                                        "block px-4 py-2 text-sm text-gray-700"
                                      )}>
                                      {item.name}
                                    </Link>
                                  );
                                }}
                              </MenuItem>
                            ))}
                          </MenuItems>
                        </Transition>
                      </Menu>
                    ) : (
                      <Link
                        to="/sign-in"
                        className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-700">
                        Sign in&nbsp;<span aria-hidden="true">&rarr;</span>
                      </Link>
                    )}
                  </div>
                  <div className="-mr-2 flex items-center sm:hidden">
                    {/* Mobile menu button */}
                    <DisclosureButton className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      ) : (
                        <Bars3Icon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      )}
                    </DisclosureButton>
                  </div>
                </div>
              </div>

              <DisclosurePanel className="sm:hidden">
                <div className="space-y-1 pb-3 pt-2">
                  {navigation.map(item => (
                    <DisclosureButton
                      key={item.name}
                      as={Link}
                      to={item.href}
                      className={classNames(
                        item.current
                          ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                          : "border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800",
                        "block border-l-4 py-2 pl-3 pr-4 text-base font-medium"
                      )}
                      aria-current={item.current ? "page" : undefined}>
                      {item.name}
                    </DisclosureButton>
                  ))}
                </div>
                <div className="border-t border-gray-200 pb-3 pt-4">
                  {user ? (
                    <>
                      <div className="flex items-center px-4">
                        <div className="flex-shrink-0">
                          <div className="h-8 w-8 rounded-full">
                            <Jdenticon value={user.email} />
                          </div>
                        </div>
                        <div className="ml-3">
                          <div className="text-base font-medium text-gray-800">
                            {user.name}
                          </div>
                          <div className="text-sm font-medium text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 space-y-1">
                        {userNavigation.map(item => {
                          return Object.keys(item).find(x => x === "action") ? (
                            <DisclosureButton
                              key={item.name}
                              as="button"
                              onClick={item.action}
                              className="w-full text-left block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800">
                              {item.name}
                            </DisclosureButton>
                          ) : (
                            <DisclosureButton
                              key={item.name}
                              as={Link}
                              to={item.href}
                              className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800">
                              {item.name}
                            </DisclosureButton>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    <Link
                      to="/sign-in"
                      className="border-transparent text-gray-600 hover:text-gray-800 block pt-1 pb-2 pl-3 pr-4 text-base font-medium">
                      Sign in&nbsp;<span aria-hidden="true">&rarr;</span>
                    </Link>
                  )}
                </div>
              </DisclosurePanel>
            </>
          )}
        </Disclosure>
      </div>

      <div className="mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </div>
    </>
  );
}
