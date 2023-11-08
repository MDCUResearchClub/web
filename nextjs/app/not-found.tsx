import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Not found",
};

export default function ErrorPage() {
  return (
    <div className="my-12 text-center text-4xl text-yellow-600">
      Oops! You have found a missing page.
    </div>
  );
}
