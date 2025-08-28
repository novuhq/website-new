import Script from "next/script"

export const GTM_ID = "GTM-KXMC4XP2"

function Scripts() {
  if (process.env.NODE_ENV !== "production") {
    return null
  }

  return (
    <>
      {/* LinkedIn analytics */}
      <Script
        id="linkedin-init"
        dangerouslySetInnerHTML={{
          __html: `
      _linkedin_partner_id = "5915650";
      window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
      window._linkedin_data_partner_ids.push(_linkedin_partner_id);
    `,
        }}
      />
      <Script
        id="linkedin-analytics"
        dangerouslySetInnerHTML={{
          __html: `
      (function(l) {
        if (!l){window.lintrk = function(a,b){window.lintrk.q.push([a,b])};
        window.lintrk.q=[]}
        var s = document.getElementsByTagName("script")[0];
        var b = document.createElement("script");
        b.type = "text/javascript";b.async = true;
        b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
        s.parentNode.insertBefore(b, s);})(window.lintrk);
    `,
        }}
      />

      {/** Google Tag Manager */}
      <Script
        dangerouslySetInnerHTML={{
          __html: `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${GTM_ID}');
    `,
        }}
      />

      <Script
        type="text/javascript"
        src="//script.crazyegg.com/pages/scripts/0123/1426.js"
        async
      />
    </>
  )
}

export default Scripts
