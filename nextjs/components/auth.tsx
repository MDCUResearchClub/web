import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/client";
import { useReducer, useEffect, useState } from "react";

const isSSR = typeof window === "undefined";

const actionTypes = {
  signIn: "SIGNIN",
  signOut: "SIGNOUT",
  loaded: "LOADED",
};

function loadingReducer(state, action) {
  switch (action.type) {
    case actionTypes.signIn:
      return { loading: true, text: "Logging in" };
    case actionTypes.signOut:
      return { loading: true, text: "Logging out" };
    case actionTypes.loaded:
      return { loading: false, text: "" };
    default:
      throw new Error();
  }
}

export function NavbarAuth() {
  const [session, sessionLoading] = useSession();
  const [isLoading, dispatchIsLoading] = useReducer(loadingReducer, {
    loading: true,
    text: isSSR ? "" : localStorage.getItem("authStatus"),
  });
  const linkItems = [];

  if ((isLoading.loading || sessionLoading) && isLoading.text && !session) {
    linkItems.push(isLoading.text);
  } else if (!session) {
    linkItems.push(
      <button
        onClick={() => {
          dispatchIsLoading({ type: actionTypes.signIn });
          localStorage.setItem("authStatus", "Logging in");
          signIn("google");
        }}
      >
        Log in
      </button>
    );
  } else {
    linkItems.push(session.user.name.split(" ")[0]);
    linkItems.push(
      <button
        onClick={() => {
          dispatchIsLoading({ type: actionTypes.signOut });
          localStorage.setItem("authStatus", "Logging out");
          signOut();
        }}
      >
        Log out
      </button>
    );
  }

  useEffect(() => {
    if (isLoading.loading && session) {
      localStorage.removeItem("authStatus");
      dispatchIsLoading({ type: actionTypes.loaded });
    }
  });

  return (
    <ul className="flex flex-col md:flex-row mt-4 md:m-0">
      {linkItems.map((linkItem) => (
        <li key={linkItem} className="m-2">
          {linkItem}
        </li>
      ))}
    </ul>
  );
}

export function HomeCTA() {
  const [session, loading] = useSession();
  const [authStatus, setAuthStatus] = useState(
    !isSSR && localStorage.getItem("authStatus")
  );
  const className =
    "inline-block rounded-md text-center text-xl text-white bg-blue-500 px-12 md:px-auto md:w-full py-2";

  if (session) {
    return (
      <Link href="/talks">
        <a className={className}>
          Watch <span className="whitespace-no-wrap">Research Talks</span>
        </a>
      </Link>
    );
  }
  return (
    <button
      className={className}
      onClick={() => {
        setAuthStatus("Logging in");
        localStorage.setItem("authStatus", "Logging in");
        signIn("google");
      }}
    >
      {authStatus || "Log in"}
    </button>
  );
}
