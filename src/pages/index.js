import SearchForm from './components/SearchForm'
import Error from 'next/error'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Link from 'next/link'
import styles from '@/styles/Home.module.css'
import Image from 'next/image'

const API_URL = 'https://www.drupal.org/api-d7'

export default function Home({ errorCode, profiles }) {
  if (errorCode) {
    return <Error statusCode={errorCode} />
  }

  return(
    <>
      <Navbar bg="primary" expand="lg" sticky='top' variant="dark">
        <Container>
          <Navbar.Brand><span> <Image src="/drupal-logo.svg" width='50' height='50' alt='durpal-logo' /></span>Drupal profile finder <span className={styles['built-with']}>Built with NextJs</span></Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="#">Leave Feedback</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <SearchForm profiles={profiles} />
      <footer class="my-4">
        <div className='border-top'>
          <p class="trademark text-center">Drupal is a <Link href="http://drupal.com/trademark" target="_blank">registered trademark</Link> of <Link href="https://dri.es" target="_blank">Dries Buytaert</Link>.</p>
        </div>
      </footer>
    </>
  )
}

export async function getStaticProps() {
  const res = await fetch(`${API_URL}/user.json?page=0&sort=created&direction=DESC`)
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
