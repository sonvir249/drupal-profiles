import Head from "next/head";
// add bootstrap css 
import 'bootstrap/dist/css/bootstrap.css'
import '@/styles/globals.css'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Drupal profile finder</title>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:site_name" content="drupal-profiles.vercel.app/" />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://drupal-profiles.vercel.app/" />
        <meta property="og:title" content="Drupal Profile Finder" />
        <meta name="description" content="Drupal is an open source platform for building amazing digital experiences. It's made by a dedicated community. Anyone can use it, and it will always be free." />
        <meta property="og:description" content="Drupal - the leading open-source CMS for ambitious digital experiences that reach your audience across multiple channels. Because we all have different needs, Drupal allows you to create a unique space in a world of cookie-cutter solutions." />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
