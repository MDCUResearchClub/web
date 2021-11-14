export const UA_TRACKING_ID = "UA-121443271-3";

export const G_TRACKING_ID =
  process.env.NODE_ENV === "production" ? "G-HDHM4V8SR6" : "G-G832CFVLYM";

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const config = () => {
  (<any>window).gtag("config", UA_TRACKING_ID, { send_page_view: false });
  (<any>window).gtag("config", G_TRACKING_ID, { send_page_view: false });
};

export const pageview = () => {
  (<any>window).gtag("event", "page_view");
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }) => {
  (<any>window).gtag("event", action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};
