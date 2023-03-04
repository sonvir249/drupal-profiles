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
          <Navbar.Brand><span> <Image src="/drupal-logo.svg" width='50' height='50' alt='durpal-logo' /></span>Drupal Profile Finder</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="https://forms.gle/YUKWQJWMszBksZ2G8" className='text-white' target='_blank'>Leave Feedback</Nav.Link>
              <Nav.Link href="https://github.com/sonvir249/drupal-profiles" target='_blank' className='text-white'>Github</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <SearchForm profiles={profiles} />
      <footer className="my-4">
        <div className='border-top'>
          <p className={`${styles.trademark} text-center`}>Built with <Link href="https://nextjs.org/" target="_blank">NEXT.js</Link></p>
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
