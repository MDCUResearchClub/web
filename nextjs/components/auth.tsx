import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export function NavbarAuth() {
  const { data: session, status } = useSession();
  const [authStatus, setAuthStatus] = useState({
    startProcessing: false,
    text: "",
  });
  const linkItems = [];

  if (!session) {
    linkItems.push(
      <button
        onClick={() => {
          setAuthStatus({ startProcessing: true, text: "Logging in" });
          localStorage.setItem("authStatus", "Logging in");
          signIn("google");
        }}
      >
        {authStatus.text || "Log in"}
      </button>
    );
  } else {
    linkItems.push(session.user.name.split(" ")[0]);
    linkItems.push(
      <button
        onClick={() => {
          setAuthStatus({ startProcessing: true, text: "Logging out" });
          localStorage.setItem("authStatus", "Logging out");
          signOut().then(() => {
            // Fix hash bug https://github.com/nextauthjs/next-auth/issues/603
            window.location.reload();
          });
        }}
      >
        {authStatus.text || "Log out"}
      </button>
    );
  }

  useEffect(() => {
    const localAuthStatus = localStorage.getItem("authStatus");
    if (!authStatus.text && localAuthStatus && status === "loading") {
      setAuthStatus({ startProcessing: false, text: localAuthStatus });
    } else if (
      authStatus.text &&
      !authStatus.startProcessing &&
      status !== "loading"
    ) {
      setAuthStatus({ startProcessing: false, text: "" });
      localStorage.removeItem("authStatus");
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

type AuthCTAProps = {
  text: string;
  href: string;
};

export function AuthCTA({ text = "", href = "/" }: AuthCTAProps) {
  const { status } = useSession();
  const [authStatus, setAuthStatus] = useState("");
  const className =
    "inline-block rounded-md text-center text-xl md:text-2xl text-white bg-indigo-700 px-12 md:px-auto md:w-full py-2";

  useEffect(() => {
    const localAuthStatus = localStorage.getItem("authStatus");
    if (localAuthStatus && status === "loading") {
      setAuthStatus(localAuthStatus);
    } else if (authStatus && !localAuthStatus && status !== "loading") {
      setAuthStatus("");
    }
  });

  if (status === "authenticated") {
    if (href) {
      return (
        <Link href={href} className={className}>
          {text}
        </Link>
      );
    }

    return <p className={className}>{text}</p>;
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
