import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-zinc-800">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 text-sm text-gray-500 dark:text-gray-400 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} Your Company Name. All rights reserved.
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <Link
            to="/terms"
            className="hover:text-gray-900 dark:hover:text-gray-100 underline-offset-2 hover:underline"
          >
            Terms &amp; Conditions
          </Link>
          <Link
            to="/privacy"
            className="hover:text-gray-900 dark:hover:text-gray-100 underline-offset-2 hover:underline"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
