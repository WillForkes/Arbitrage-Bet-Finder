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
            <Script id="facebook_pixel">
                {`
                !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js'); fbq('init', '976556956667511'); fbq('track', 'PageView');
                `}
            </Script>
            <Script id="grow_tracking_tag">
                {`
                (function(i,s,o,g,r,a,m){i['TDConversionObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script', 'https://svht.tradedoubler.com/tr_sdk.js?org=2353477&prog=342530&dr=true&rand=' + Math.random(), 'tdconv');
                `}
            </Script>
            
            <noscript> 
                <img height="1" width="1" src="https://www.facebook.com/tr?id=976556956667511&ev=PageView&noscript=1"/>
            </noscript>

            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
            <link rel="manifest" href="/site.webmanifest" />
            <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        </Head>
    <body>
        <Main />
        <NextScript />
    </body>
</Html>
  )
}

// Fully test your initial setup using this guide:
// Make sure you have finished the integration of Rewardful in your marketing website.
// If possible, create a trial period to simulate actual signup or purchase. If not possible, proceed with an actual charge, you may refund the charged amount later on.
// Create a test affiliate account.
// Once the affiliate is created, go to Affiliates > name of Affiliate > Links.
// Copy the affiliate link.
// Open up an incognito browser or a different browser with a clean cache and no adblocker extension.
// Paste the affiliate link on the browser you copied on STEP 5.
// Proceed with the checkout/signup flow.
// Once checkout/signup is complete, go to your Stripe account.
// Go to Customers > test email address of the test purchase.
// Check the Metadata section, check for the field labeled "referral" and the value is alphanumeric character. If not present, contact us for further support.
// STEP 6 is important as this will simulate a referred customer. Use incognito/private browsing mode that doesn't have an adblocker. Or use a different browser wherein the cache and cookies are clean and there's no adblocker. Also, use an email address that is not yet present on your Stripe Customer record section.


// TEST AFFILIATE ACC PSWD: f9c8e4d0eaa462df 