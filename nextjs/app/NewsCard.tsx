"use client";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { STRAPI_ENDPOINT } from "../lib/constant";

export default function NewsCard({
  theme = "light",
  title,
  description,
  href = "/",
  image,
  className = "",
}: {
  theme?: "light" | "dark";
  title?: string;
  description?: string;
  href?: string;
  image?: {
    url: string;
    alternativeText: string;
    width: number;
    height: number;
  } | null;
  className?: string;
}) {
  const router = useRouter();
  const lightTheme = theme === "light";
  const colorClass = lightTheme ? "" : "text-white bg-blue-900";
  return (
    <div
      className={`flex border-solid border-2 border-blue-700 rounded cursor-pointer ${colorClass} ${className}`}
      onClick={() => {
        router.push(href);
      }}
    >
      {image !== undefined && (
        <div className="w-28 relative hidden md:block overflow-hidden">
          {image === null ? null : (
            <Image
              src={STRAPI_ENDPOINT + image.url}
              alt={image.alternativeText}
              fill
              className="object-cover"
              sizes="25vw"
            />
          )}
        </div>
      )}
      <div className="flex p-2 md:p-4 w-full flex-auto">
        {title && (
          <Link href={href} className="flex items-center flex-auto">
            <h3 className="my-4 text-xl w-1/2 flex-auto">{title}</h3>
            {description && <div className="w-1/2">{description}</div>}
          </Link>
        )}
        {!title && (
          <div className="ml-4 my-2">
            {/* <Loading colorClass={lightTheme ? "bg-blue-600" : "bg-white"} /> */}
          </div>
        )}
      </div>
    </div>
  );
}
