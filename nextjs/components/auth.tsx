import { signIn, signOut, useSession } from "next-auth/client";

export function NavbarAuth() {
  const [session, loading] = useSession();
  const linkItems = [];
  if (!session) {
    linkItems.push(<button onClick={() => signIn("google")}>Log in</button>);
  } else {
    linkItems.push(session.user.name.split(" ")[0]);
    linkItems.push(<button onClick={signOut}>Log out</button>);
  }
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
