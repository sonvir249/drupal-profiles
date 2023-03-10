import Head from "next/head";
import 'bootstrap/dist/css/bootstrap.css'
import '@/styles/globals.css'
import { Analytics } from '@vercel/analytics/react';
export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Drupal profile finder</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:site_name" content="Drupal Profile Finder" />
        <meta name="author" content="sonvir249" />
        <meta name="keywords" content="Drupal, nextjs, vercel, drupal-profiles, drupal-users, cms"/>
        <meta property="og:url" content="https://drupal-profiles.vercel.app/" />
        <meta property="og:title" content="Drupal Profile Finder" />
        <meta name="description" content="Drupal Profile Finder makes search drupal profiles easy and interactive." />
        <meta property="og:description" content="Drupal Profile Finder will help you to search profiles with username, first name, last name and country." />
      </Head>
      <Component {...pageProps} />
      <Analytics />
    </>
  )
}
