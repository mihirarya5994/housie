dataLayer = [{
  'appName': 'Jio Tambola 2.0',
  'env': 'dev'
}];

window.dataLayer = window.dataLayer || [];
src = "https://www.googletagmanager.com/ns.html?id=GTM-TDJBK5Z";
// Call GTM script here

(function (w, d, s, l, i) {
  w[l] = w[l] || [];
  w[l].push({
    "gtm.start": new Date().getTime(),
    event: "gtm.js"
  });
  var f = d.getElementsByTagName(s)[0],
    j = d.createElement(s),
    dl = l != "dataLayer" ? "&l=" + l : "";
  j.async = true;
  j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
  f.parentNode.insertBefore(j, f);
})(window, document, "script", "dataLayer", "GTM-TDJBK5Z");
