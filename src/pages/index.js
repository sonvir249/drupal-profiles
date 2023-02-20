import SearchForm from './components/SearchForm'
import Error from 'next/error'

const API_URL = 'https://www.drupal.org/api-d7'

export default function Home({ errorCode, profiles }) {
  if (errorCode) {
    return <Error statusCode={errorCode} />
  }

  return(
    <>
      <SearchForm profiles={profiles} />
    </>
  )
}

export async function getStaticProps() {
  const res = await fetch(`${API_URL}/user.json?limit=48&page=1&sort=created&direction=DESC`)
  const profiles = await res.json()
  const errorCode = res.ok ? false : res.status

  if (!profiles) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      errorCode,
      profiles,
    },
    revalidate: 60,
  }
}
