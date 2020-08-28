export const GA_TRACKING_ID =
  process.env.NODE_ENV === "production" ? "G-HDHM4V8SR6" : "G-G832CFVLYM";

export const HEAD_SCRIPT = `
<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', '${GA_TRACKING_ID}');
</script>`;

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url) => {
  (<any>window).gtag("config", GA_TRACKING_ID, {
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
