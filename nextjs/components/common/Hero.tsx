import { AuthCTA } from "../auth";

import styles from "./Hero.module.css";

type HeroProps = {
  heading: Array<string>;
  image: string;
  ctaText?: string;
  ctaHref?: string;
  imageClassName?: string;
};

export default function Hero({
  heading = [],
  image = "",
  ctaText = "",
  ctaHref = "/",
  imageClassName = "justify-end",
}: HeroProps) {
  return (
    <>
      <div className="px-4 md:px-8 container relative mx-auto md:flex justify-around items-start">
        <div
          className={`flex flex-col absolute md:static top-0 bottom-0 right-0 self-center w-1/2 md:w-5/12 lg:w-4/12 px-4 ${imageClassName} ${styles.headlineImg}`}
        >
          <img alt="" src={image} />
        </div>
        <div
          className={`md:bg-blue-200 md:p-8 lg:p-12 xl:p-16 my-28 ${styles.headlineContainer}`}
        >
          <h1 className="text-3xl md:text-4xl xl:text-5xl leading-relaxed md:leading-relaxed xl:leading-relaxed mb-8 font-serif">
            {heading[0]}
            <br />
            <span
              className={`whitespace-no-wrap text-4xl md:text-5xl xl:text-6xl relative z-0 ${styles.headlineHighlight}`}
            >
              {heading[1]}
            </span>
            <br />
            {heading[2]}
          </h1>
          {ctaText && <AuthCTA text={ctaText} href={ctaHref} />}
        </div>
      </div>
    </>
  );
}
