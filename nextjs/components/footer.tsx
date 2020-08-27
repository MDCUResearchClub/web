import { SITE_NAME } from "../constant";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 py-12 px-4 sm:px-16 md:px-24 lg:px-32">
      <h2 className="text-xl mb-4">{SITE_NAME}</h2>
      <h3 className="mb-2">Students Academic Affairs</h3>
      <address className="not-italic">
        Faculty of Medicine,{" "}
        <span className="whitespace-no-wrap">Chulalongkorn University</span>
        <br />
        1873 Rama IV Rd Pathumwan,{" "}
        <span className="whitespace-no-wrap">Bangkok, 10330</span>
      </address>
    </footer>
  );
}
