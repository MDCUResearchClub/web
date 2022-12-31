import Link from "next/link";
import Image from "next/image";
import styles from "./NewsCard.module.css";
import Loading from "../common/Loading";
import { STRAPI_ENDPOINT } from "../../lib/constant";

export default function NewsCard({
  theme = "light",
  intro,
  title,
  description,
  href = "/",
  image,
  className = "",
}: {
  theme?: "light" | "dark";
  intro?: string;
  title?: string;
  description?: string;
  href?: string;
  image?: {
    url: string;
    width: number;
    height: number;
  };
  className?: string;
}) {
  const lightTheme = theme === "light";
  const colorClass = lightTheme ? "" : "text-white bg-blue-900";
  return (
    <div
      className={`relative m-2 p-2 md:p-4 border-solid border-2 border-blue-500 rounded ${colorClass} ${styles.card} ${className}`}
    >
      {intro && (
        <span className={`text-lg ${lightTheme ? "" : "text-blue-100"}`}>
          {intro}
        </span>
      )}
      {title && (
        <Link
          href={href}
          className="relative block z-10 w-3/5 sm:w-3/4 lg:w-1/2"
        >
          <h3 className="my-4 text-xl">{title}</h3>
          {description && <p>{description}</p>}
        </Link>
      )}
      {!title && (
        <div className="ml-4 my-2">
          <Loading colorClass={lightTheme ? "bg-blue-600" : "bg-white"} />
        </div>
      )}
      {image && (
        <div className="absolute top-0 right-0 bottom-0 w-1/2 lg:w-3/5 overflow-hidden">
          <div className="relative h-full ml-auto">
            <Image
              src={STRAPI_ENDPOINT + image.url}
              alt=""
              className="layout-fill object-cover"
              layout="fill"
              objectFit="cover"
              sizes="25vw"
            />
          </div>
        </div>
      )}
    </div>
  );
}
