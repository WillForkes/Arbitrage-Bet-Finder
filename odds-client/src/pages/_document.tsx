declare global {
    interface Window {
        _rwq:any;
        q: any;
    }
}

import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

export default function Document() {
  return (
    <Html lang="en" className="dark">
      <Head>
        <Script id="rewardful_src" strategy="afterInteractive"> {`(function(w,r){w._rwq=r;w[r]=w[r]||function(){(w[r].q=w[r].q||[]).push(arguments)}})(window,'rewardful');`} </Script> 
        <Script strategy="afterInteractive" src="https://r.wdfl.co/rw.js" data-rewardful="6e654d" ></Script>
    </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
