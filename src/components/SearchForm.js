import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react'
import countries from "i18n-iso-countries"
import enLocale from "i18n-iso-countries/langs/en.json"
import ProfileTable from './ProfileTable'
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
  const [lastPageProfiles, setLastPageProfiles] = useState({})

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
      fetch(`${API_URL}/user.json?${queryParam}&sort=created&direction=DESC`)
      .then(async (data) => {
        if (data.ok) {
          data = await data.json()
          setSearchedProfile(data)
          setLoading(false)
          setDisplayWarning('hide_warning')
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

  useEffect(() => {
    const paramString = searchedProfile['last'].split('?')[1];
    const urlParams = new URLSearchParams(paramString);
    const lastPage = urlParams.get('page');
    if(!queryParam && lastPage > 0) {
      fetch(`${API_URL}/user.json?${queryParam}&page=${lastPage}`)
      .then(async (data) => {
        if (data.ok) {
          data = await data.json()
          setLastPageProfiles(data);
        }
      }).catch(e => console.log('Connection error', e))
    }

  }, [searchedProfile, queryParam])

  const getTotalProfiles = () => {
    const paramString = searchedProfile['last'].split('?')[1];
    const urlParams = new URLSearchParams(paramString);
    const lastPage = urlParams.get('page');
    let totalUsers = searchedProfile?.list?.length;

    if(lastPage == 1) {
      totalUsers = 50 + (lastPageProfiles?.list?.length)
    } else if (lastPage > 1) {
      totalUsers = (50* (lastPage-1)) + (lastPageProfiles?.list?.length)
    }

    if(!isLoading && totalUsers > 0) {
      return (
        <p>Found {totalUsers} profiles.</p>
      );
    }
  }

  return (
    <>
      <div className='form-action my-4'>
        <form id='search-form' onSubmit={handleSubmit} className='row g-1'>
          <div className="col-lg-2">
            <input
              aria-label="username"
              type="text"
              placeholder="Username"
              value={username}
              onChange={handleUsernameChange}
              name="username"
              className="form-control"
            />
          </div>
          <div className="col-lg-2">
            <input
              aria-label="first name"
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={handleFirstNameChange}
              name="first-name"
              className="form-control"
            />
          </div>
          <div className="col-lg-2">
            <input
              aria-label="last name"
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={handleLastNameChange}
              name="last-name"
              className="form-control"
            />
          </div>
          <div className="col-lg-2">
            <select value={selectedCountry} onChange={handleCountryChange} name='country' className="form-control">
              <option value="">Select country</option>
              {countryArr?.length && countryArr.map(({label, value}, i) => (
                  <option key={i} value={value}>{label}</option>
                ))}
            </select>
          </div>
          <div className="col-lg-4 d-grid gap-2 d-md-block">
              <button className={`btn btn-primary ${styles['search-button']}`} type="submit">
                Search
              </button>
              <button className="btn btn-primary" type="submit" onClick={resetForm}>
                Reset
              </button>
          </div>
          <div className={styles[`${displayWarning}`]}>
            <p className="alert alert-danger container">Atleast one field is required to filter data.</p>
          </div>
        </form>
      </div>
      <div className=''>{getTotalProfiles()}</div>
      <ProfileTable cardProfiles={searchedProfile} isLoading={isLoading} countriesList={countries} />
    </>
  )
}
