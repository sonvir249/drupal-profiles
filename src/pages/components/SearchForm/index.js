import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import countries from "i18n-iso-countries"
import enLocale from "i18n-iso-countries/langs/en.json"
import ProfileCard from '../ProfileCard'

const API_URL = 'https://www.drupal.org/api-d7'

export default function SearchForm ({ profiles = null }) {

  const [searchedProfile, setSearchedProfile] = useState(profiles)
  const [username, setUsername] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('')
  const [queryParam, setQueryParam] = useState('')
  const [displayWarning, setDisplayWarning] = useState('hide_warning')
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    makeQuery([
      {'name': username}, 
      {'field_first_name' : firstName}, 
      {'field_last_name': lastName},
      {'field_country': selectedCountry}
    ]);

  }, [username, firstName, lastName, selectedCountry]);
  
  //Register the language.
  countries.registerLocale(enLocale)
  const countryObj = countries.getNames("en", {select: "official"})
  const countryArr = Object.entries(countryObj).map(([key, value]) => {
    return {
      label: value,
      value: key
    }
  })

  // Create search query based on filters.
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

  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
  }

  // Submit handler.
  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    if(queryParam) {
      fetch(`${API_URL}/user.json?${queryParam}`)
      .then(async (data) => {
        if (data.ok) {
          data = await data.json()
          setSearchedProfile(data)
          setLoading(false)
        }
      }).catch(e => console.log('Connection error', e))
    } else {
      setLoading(false)
      setDisplayWarning('show_warning')
    }
  };

  // Rest form.
  const resetForm = (e) => {
    e.preventDefault()
    setUsername('')
    setFirstName('')
    setLastName('')
    setSelectedCountry('')
    setSearchedProfile(profiles)
    setLoading(false)
    setDisplayWarning('hide_warning')
  }

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
          <div className={styles['page-title']}><h1>Welcome to Drupal Profiles</h1></div>
          <form id='search-form' onSubmit={handleSubmit}>
            <div className={styles.search_form}>
              <fieldset className={styles.fieldset} disabled={isLoading ? 'disabled' : ''}>
                <div className={styles.form_item}>
                  <input
                    aria-label="username"
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={handleUsernameChange}
                    name="username"
                    className={styles.form_element}
                  />
                </div>
                <div className={styles.form_item}>
                  <input
                    aria-label="first name"
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={handleFirstNameChange}
                    name="first-name"
                    className={styles.form_element}
                  />
                </div>
                <div className={styles.form_item}>
                  <input
                    aria-label="last name"
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={handleLastNameChange}
                    name="last-name"
                    className={styles.form_element}
                  />
                </div>
                <div className={styles.form_item}>
                  <select
                    value={selectedCountry}
                    onChange={handleCountryChange}
                    name='country'
                    className={styles.form_element}
                  >
                    <option value="">Select country</option>
                    {countryArr?.length && countryArr.map(({label, value}, i) => (
                        <option key={i} value={value}>{label}</option>
                      ))}
                  </select>
                  </div>
                <div className={styles.form_item}>
                  <button className={styles.form_submit} type="submit">
                    Search
                  </button>
                </div>
                <div className={styles.form_item}>
                  <button className={styles.form_submit} type="submit" onClick={resetForm}>
                    Reset
                  </button>
                </div>
              </fieldset>
            </div>
            <div className={styles['warning-text']}>
              <p id='warning-message' className={styles[`${displayWarning}`]}>Atleast one field is required to filter data.</p>
            </div>
          </form>
          <ProfileCard cardProfiles={searchedProfile} isLoading={isLoading} countriesList={countries} />
        </div>
      </main>
    </>
  )
}
