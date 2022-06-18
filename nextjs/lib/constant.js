const is_production = process.env.NODE_ENV === "production";

export const SITE_NAME = "MDCU Research Club";
export const SITE_ORIGIN = is_production
  ? "https://researchclub.docchula.com"
  : "http://localhost:3000";
export const STRAPI_ENDPOINT = "https://mdcuresearchclub-strapiv4.thew.pro";
