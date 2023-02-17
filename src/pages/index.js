import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react';
import Link from 'next/link';
const { getCode, getName } = require('country-list');

const API_URL = 'https://www.drupal.org/api-d7'

export default function Home({ users }) {

  const [userProfile, setUserProfile] = useState(null)
  const [username, setUsername] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [queryParam, setQueryParam] = useState('')

  useEffect(() => {
    // reset form with user data
    makeQuery([
      {'name': username}, 
      {'field_first_name' : firstName}, 
      {'field_last_name': lastName}
    ]);

  }, [username, firstName, lastName]);

  if(users === 'undefined') {
    return;
  }

  const formartJoinedDate = (joinedDate)=> {
    const dateFormat = new Date(parseInt(joinedDate) * 1000);
    const year  = dateFormat.getFullYear();
    const month = (dateFormat.getMonth() + 1).toString().padStart(2, "0");
    const day   = dateFormat.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`
  }

  const getUserCountry = (countryCode) => {
    if(countryCode[0]?.toLowerCase() !== undefined) {
      return getName(countryCode[0]?.toLowerCase())
    }
  }
  

  const makeQuery = (filters) => {
    let temp = ''
    let flag = true
    
    filters.map((value)=>{
      if(value[Object.keys(value)[0]] !== '') {
        if(flag) {
          temp += `${Object.keys(value)[0]}=${value[Object.keys(value)[0]]}`  
          flag = false
        } else {
          temp += `&${Object.keys(value)[0]}=${value[Object.keys(value)[0]]}`
        }
      }
    })
    setQueryParam(temp)
  }
  
  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
  };

  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    async function fetchData() {
      const response = await fetch(
        `${API_URL}/user.json?${queryParam}`
      );
      const data = await response.json();
      setUserProfile(data);
    }
    fetchData();
  };

  const userData = userProfile == null ? users.list : userProfile.list

  return (
    <>
      <Head>
        <title>Drupal profiles</title>
        <meta name="description" content="Drupal profiles" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className={styles.container}>
          <h2>Welcome to drupal profiles</h2>
          <form className="input-group" onSubmit={handleSubmit}>
            <input
              aria-label="username"
              type="text"
              placeholder="username"
              value={username}
              onChange={handleUsernameChange}
              name="username"
            />
            <input
              aria-label="first name"
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={handleFirstNameChange}
              name="first-name"
            />
            <input
              aria-label="last name"
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={handleLastNameChange}
              name="last-name"
            />

            <button className="btn btn-outline-success my-2 my-sm-0" type="submit">
              Search
            </button>
          </form>
          <div className={styles.cards}>
            {}
            {userData.map((user, i) => (
              <div key={i} className={styles.card}>
                <span>username: {user.name}</span>
                <span>Fname: {user.field_first_name}</span>
                <span>Lname: {user.field_last_name}</span>
                <span>Joined on: {formartJoinedDate(user.created)}</span>
                <span>Country: {getUserCountry(user?.field_country)}</span>
                <Link href={user.url} target='_blank'>Drupal profile</Link>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  )
}


export async function getStaticProps() {
  const res = await fetch(`${API_URL}/user.json?limit=40&page=1&sort=created&direction=DESC`)
  const users = await res.json()
  return {
    props: {
      users,
    },
  }
}
