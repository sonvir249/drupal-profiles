import SearchForm from '@/components/SearchForm'
import Error from 'next/error'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import Link from 'next/link'
import styles from '@/styles/Home.module.css'
import Image from 'next/image'
import { useEffect, useState } from 'react'

const API_URL = 'https://www.drupal.org/api-d7'

export default function Home({ errorCode, profiles }) {
  const [isScroll, setIsScroll] = useState(false)

  const topFunction = ()=> {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  const changeNavbarColor = () => {
    let backToTopButton = document.getElementById("back-to-top");
    if (window.scrollY >= 20) {
      backToTopButton.style.display = "block";
      setIsScroll(true)
    }
    else {
      setIsScroll(false)
      backToTopButton.style.display = "none";
    }
  }

  useEffect(() => {
    changeNavbarColor()
    window.addEventListener("scroll", changeNavbarColor)
  });

  if (errorCode) {
    return <Error statusCode={errorCode} />
  }

  return(
    <>
      <div className={styles['top-button']} onClick={topFunction} id="back-to-top" title="Go to top"></div>
      <Navbar expand="lg" sticky='top' variant="dark" className={isScroll ? styles['custom-color'] : ''}>
        <Container>
          <Image src="/drupal-logo.svg" width='50' height='50' alt='durpal-logo' />
          <Navbar.Toggle aria-controls="basic-navbar-nav" className={styles['custom-toggler']} />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <small><Nav.Link href="https://forms.gle/YUKWQJWMszBksZ2G8" className={styles['nav-text']} target="_blank">Leave Feedback</Nav.Link></small>
              <small><Nav.Link href="https://github.com/sonvir249/drupal-profiles" target='_blank' className={styles['nav-text']}>Github</Nav.Link></small>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div className="container">
        <div className='text-center'>
          <h1 className="mb-1">Drupal Profile Finder</h1>
          <h6 className="mb-5"><em>Search any user profile created on <Link href="https://www.drupal.org/" className={styles.nounderline} target='_blank'>drupal.org</Link></em></h6>
        </div>
        <SearchForm profiles={profiles} />
        <footer className="my-4">
          <div className='border-top'>
            <p className={`${styles.trademark} text-center`}>
              Made by <Link href="https://twitter.com/sonvir249" target="_blank" className={styles.nounderline}>Sonvir </Link>
              | Built with <Link href="https://nextjs.org/" target="_blank" className={styles.nounderline}>NEXT.js</Link>
            </p>
          </div>
        </footer>
      </div>
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
    revalidate: false,
  }
}
