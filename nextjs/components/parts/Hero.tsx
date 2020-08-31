import { AuthCTA } from "../auth";

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
  ctaHref = "",
  imageClassName = "justify-end",
}: HeroProps) {
  return (
    <>
      <div className="p-4 md:p-8 container relative mx-auto md:flex justify-around items-start">
        <div
          className={
            "flex flex-col absolute md:static top-0 bottom-0 right-0 self-center w-1/2 md:w-5/12 lg:w-4/12 headline-img px-4 " +
            imageClassName
          }
        >
          <img alt="" src={image} />
        </div>
        <div className="md:bg-blue-200 md:p-8 lg:p-12 xl:p-16 my-32 headline-container">
          <h1 className="text-3xl md:text-4xl xl:text-5xl leading-relaxed mb-8 font-serif">
            {heading[0]}
            <br />
            <span className="whitespace-no-wrap text-4xl md:text-5xl xl:text-6xl relative headline-highlight z-0">
              {heading[1]}
            </span>
            <br />
            {heading[2]}
          </h1>
          {ctaText && <AuthCTA text={ctaText} href={ctaHref} />}
        </div>
      </div>
      <style jsx>
        {`
          .headline-container {
            border-radius: 37px 96px 35px 66px;
          }

          .headline-highlight::after {
            content: "";
            @apply absolute inset-0 bg-orange-300 transform -skew-x-12;
            z-index: -1;
          }

          .headline-img {
            transform: scaleX(-1);
            z-index: -1;
            animation: headline-img 0.5s ease-out;
          }

          @keyframes headline-img {
            from {
              transform: scaleX(-1) translateY(1rem);
              opacity: 0.25;
            }
          }

          @screen md {
            .headline-img {
              @apply transform scale-x-100;
            }
            @keyframes headline-img {
              from {
                transform: translateY(2rem);
                opacity: 0.25;
              }
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .headline-img {
              animation: none;
            }
          }
        `}
      </style>
    </>
  );
}
