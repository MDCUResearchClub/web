import Page from "../page";
import { HomeCTA } from "../auth";

export default function IndexPage({ message = "" }) {
  const messageBox = (
    <div className="my-12 text-center text-4xl text-orange-800">{message}</div>
  );
  return (
    <Page title="Home">
      {message ? messageBox : null}
      <div className="p-4 sm:p-6 md:p-8 container relative mx-auto md:flex justify-around items-start">
        <div className="flex flex-col justify-center absolute md:static top-0 bottom-0 right-0 self-center w-1/2 md:w-5/12 lg:w-4/12 headline-img px-4">
          <img alt="" src="/images/front.svg" />
        </div>
        <div className="md:bg-blue-200 md:p-8 lg:p-12 xl:p-16 my-20 headline-container">
          <h1 className="text-3xl md:text-4xl xl:text-5xl leading-relaxed mb-24 md:mb-8 font-serif">
            Research is
            <br />
            <span className="whitespace-no-wrap text-4xl md:text-5xl xl:text-6xl relative headline-highlight z-0">
              not as hard
            </span>
            <br />
            as you think.
          </h1>
          <HomeCTA />
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
            animation: headline-img .5s ease-out;
          }


          @keyframes headline-img {
            from {
              transform: scaleX(-1) translateY(1rem);
              opacity: .25;
            }
          }

          @screen md {
            .headline-img {
              @apply transform scale-x-100;
            }
            @keyframes headline-img {
              from {
                transform: translateY(2rem);
                opacity: .25;
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
    </Page>
  );
}
