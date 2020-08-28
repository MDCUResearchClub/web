import Link from "next/link";
import { SITE_NAME } from "../lib/constant";
import { useState } from "react";
import { NavbarAuth } from "./auth";

export default function Nav() {
  const [expanded, setExpanded] = useState(false);

  const links = [
    ["/", "Home"],
    ["/journey", "MDCU's Journey"],
    ["/story", "Faculty's Story"],
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
            className={`hamburger hamburger--squeeze ${
              expanded ? "is-active" : ""
            }`}
            type="button"
            onClick={() => setExpanded((expanded) => !expanded)}
            aria-label="Toggle Menu"
            aria-controls="navbarSupportedContent"
            aria-expanded={expanded}
          >
            <span className="hamburger-box">
              <span className="hamburger-inner"></span>
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

      <style jsx>{`
        /*!
        * Hamburgers
        * @description Tasty CSS-animated hamburgers
        * @author Jonathan Suh @jonsuh
        * @site https://jonsuh.com/hamburgers
        * @link https://github.com/jonsuh/hamburgers
        */
        .hamburger {
          padding: 0.5em 0.5em;
          display: inline-block;
          cursor: pointer;
          transition-property: opacity, filter;
          transition-duration: 0.15s;
          transition-timing-function: linear;
          font: inherit;
          color: inherit;
          text-transform: none;
          background-color: transparent;
          border: 0;
          margin: 0;
          overflow: visible;
        }
        .hamburger:hover {
          opacity: 0.7;
        }
        .hamburger.is-active:hover {
          opacity: 0.7;
        }
        .hamburger.is-active .hamburger-inner,
        .hamburger.is-active .hamburger-inner::before,
        .hamburger.is-active .hamburger-inner::after {
          background-color: #fff;
        }

        .hamburger-box {
          width: 2em;
          height: 0.75em;
          display: inline-block;
          position: relative;
        }

        .hamburger-inner {
          display: block;
          top: 50%;
          margin-top: -0.125em;
        }
        .hamburger-inner,
        .hamburger-inner::before,
        .hamburger-inner::after {
          width: 2em;
          height: 0.25em;
          background-color: #fff;
          border-radius: 4px;
          position: absolute;
          transition-property: transform;
          transition-duration: 0.15s;
          transition-timing-function: ease;
        }
        .hamburger-inner::before,
        .hamburger-inner::after {
          content: "";
          display: block;
        }
        .hamburger-inner::before {
          top: -10px;
        }
        .hamburger-inner::after {
          bottom: -10px;
        }

        /*
            * Squeeze
            */
        .hamburger--squeeze .hamburger-inner {
          transition-duration: 0.075s;
          transition-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
        }
        .hamburger--squeeze .hamburger-inner::before {
          transition: top 0.075s 0.12s ease, opacity 0.075s ease;
        }
        .hamburger--squeeze .hamburger-inner::after {
          transition: bottom 0.075s 0.12s ease,
            transform 0.075s cubic-bezier(0.55, 0.055, 0.675, 0.19);
        }

        .hamburger--squeeze.is-active .hamburger-inner {
          transform: rotate(45deg);
          transition-delay: 0.12s;
          transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
        }
        .hamburger--squeeze.is-active .hamburger-inner::before {
          top: 0;
          opacity: 0;
          transition: top 0.075s ease, opacity 0.075s 0.12s ease;
        }
        .hamburger--squeeze.is-active .hamburger-inner::after {
          bottom: 0;
          transform: rotate(-90deg);
          transition: bottom 0.075s ease,
            transform 0.075s 0.12s cubic-bezier(0.215, 0.61, 0.355, 1);
        }
      `}</style>
    </nav>
  );
}
