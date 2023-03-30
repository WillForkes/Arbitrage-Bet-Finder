declare global {
    interface Window {
        _rwq:any;
    }
}

import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

export default function Document() {
  return (
    <Html lang="en" className="dark">
      <Head>
        <Script onLoad={() => {
          (function(w,r){
            if(typeof window == undefined) { return; }

            w._rwq=r;w[r]=w[r]||function(){(w[r].q=w[r].q||[]).push(arguments)}})(window,'rewardful');
        }} />
        <Script async src='https://r.wdfl.co/rw.js' data-rewardful='6e654d'></Script>
    </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
