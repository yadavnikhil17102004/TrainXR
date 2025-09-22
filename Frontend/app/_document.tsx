import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no" />
        <meta name="description" content="AI-powered exercise tracking and form analysis" />
        <meta name="keywords" content="fitness, exercise, tracking, AI, AR, workout" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="theme-color" content="#3b82f6" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}