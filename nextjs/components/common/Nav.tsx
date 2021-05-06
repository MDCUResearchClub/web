import Link from "next/link";
import { SITE_NAME } from "../../lib/constant";
import { useState } from "react";
import { NavbarAuth } from "../auth";

import styles from "./Nav.module.css";

export default function Nav() {
  const [expanded, setExpanded] = useState(false);

  const links = [
    ["/", "Home"],
    ["/news", "News"],
    ["/talks", "Research Talks"],
    ["/opportunities", "Opportunities"],
    ["/researchers", "Researchers"],
  ];

  return (
    <nav className="flex flex-col md:flex-row text-center bg-gray-800 text-gray-100 items-stretch md:items-center p-2">
      <div className="flex justify-between w-full md:w-auto">
        <div className="flex items-center">
          <Link href="/">
            <a rel="home" className="pr-2">
              <img src="/logo.svg" alt={`${SITE_NAME} logo`} className="w-8" />
            </a>
          </Link>

          <Link href="/">
            <a title="Home" rel="home">
              {SITE_NAME}
            </a>
          </Link>
        </div>
        <div className="md:hidden">
          <button
            className={`${styles.hamburger} ${styles.hamburgerSqueeze} ${
              expanded ? styles.isActive : ""
            }`}
            type="button"
            onClick={() => setExpanded((expanded) => !expanded)}
            aria-label="Toggle Menu"
            aria-controls="navbarSupportedContent"
            aria-expanded={expanded}
          >
            <span className={styles.hamburgerBox}>
              <span className={styles.hamburgerInner}></span>
            </span>
          </button>
        </div>
      </div>

      <div
        id="navbarSupportedContent"
        className={`md:flex flex-1 ${expanded ? "" : "hidden"}`}
      >
        <ul className="flex-1 flex flex-col md:flex-row justify-center">
          {links.map((link) => (
            <li className="m-2" key={link[1]}>
              <Link href={link[0]}>
                <a>{link[1]}</a>
              </Link>
            </li>
          ))}
        </ul>
        <div>
          <NavbarAuth />
        </div>
      </div>
    </nav>
  );
}
