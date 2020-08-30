export const UA_TRACKING_ID = "UA-121443271-3";

export const G_TRACKING_ID =
  process.env.NODE_ENV === "production" ? "G-HDHM4V8SR6" : "G-G832CFVLYM";

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url) => {
  (<any>window).gtag("config", UA_TRACKING_ID, {
    page_path: url,
  });

  (<any>window).gtag("config", G_TRACKING_ID, {
    page_path: url,
  });
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }) => {
  (<any>window).gtag("event", action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};
