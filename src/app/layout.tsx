import "@/styles/globals.css"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // suppressHydrationWarning added according to https://github.com/pacocoursey/next-themes?tab=readme-ov-file#with-app
    <html lang="en" suppressHydrationWarning>
      {children}
      <script
        key="plain-live-chat"
        dangerouslySetInnerHTML={{
          __html: `
            (function(d, script) {
              script = d.createElement('script');
              script.async = false;
              script.onload = function(){
                Plain.init({
                  appId: 'liveChatApp_01KJAVQQ5YRKY7NNZDEZV6KHED',
                });
              };
              script.src = 'https://chat.cdn-plain.com/index.js';
              d.getElementsByTagName('head')[0].appendChild(script);
            }(document));
          `,
        }}
      />
    </html>
  )
}
