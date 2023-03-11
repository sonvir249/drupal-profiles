import Link from "next/link"
import styles from '@/styles/Home.module.css'
import HashLoaderScreen from './HashLoaderScreen'
import PropagateLoaderScreen from "./PropagateLoaderScreen"
import { useState, useEffect } from 'react'

const API_URL = 'https://www.drupal.org/api-d7'

export default function ProfileTable({ cardProfiles, isLoading, countriesList, queryParam, lastPageCount }) {
  const [loadMoreCount, setLoadMoreCount] = useState(1)
  const [isLoadMore, setIsLoadMore] = useState(false)
  const [profilesArr, setProfilesArr] = useState([])
  
  // set profiles in array.
  useEffect(() => {
    setProfilesArr(cardProfiles?.list)
  }, [cardProfiles])
  
  // Date unix timestamp.
  const formartJoinedDate = (joinedDate)=> {
    const dateFormat = new Date(parseInt(joinedDate) * 1000);
    const year  = dateFormat.getFullYear();
    const month = (dateFormat.getMonth() + 1).toString().padStart(2, "0");
    const day   = dateFormat.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`
  }

  // Get users full name.
  const getFullName = (firstName, lastName) => {
    let fullName = '';
    if (firstName !== null || (firstName !== null && lastName !== null)) {
      fullName = `${firstName} ${lastName}`;
    }
    return fullName.length > 15 ? firstName : fullName;
  }

  // helper function to load more profiles
  const loadMorePorfiles = (e)=> {
    e.preventDefault();    
    setIsLoadMore(true);
    fetch(`${API_URL}/user.json?${queryParam}&page=${loadMoreCount}&sort=created&direction=DESC`)
    .then(async (data) => {
      if (data.ok) {
        data = await data.json()
        const newUsers = data?.list;
        setProfilesArr(profilesArr.concat(newUsers));
        setIsLoadMore(false);
      }
    }).catch(e => console.log('Connection error', e))
    setLoadMoreCount(loadMoreCount+1);
  }
  
  return (
    <>
      {isLoading ? 
          <HashLoaderScreen />
          : <>
              {profilesArr?.length ? 
                <div className="profiles">
                  <div className="table-responsive table-responsive-md">
                    <table className="table table-bordered table-sm caption-top">
                      <thead className="table-light">
                        <tr>
                          <th>#</th>
                          <th>Username</th>
                          <th>Name</th>
                          <th>Joined On</th>
                          <th>Country</th>
                          <th className={styles['no-white-space']}>Drupal Profile</th>
                        </tr>
                      </thead>
                      <tbody>
                        {profilesArr?.map((user, i) => (
                          <tr key={i} >
                            <td>{i+1}</td>
                            <td>{user.name}</td>
                            <td>{getFullName(user?.field_first_name, user?.field_last_name)}</td>
                            <td className={styles['no-white-space']}>{formartJoinedDate(user.created)}</td>
                            <td>
                              {user?.field_country.length ?
                                <>{countriesList.getName(user?.field_country[0], 'en')}</>
                                : ''
                              }
                            </td>
                            <td className={styles['no-white-space']}>
                              <Link href={user.url} target='_blank' className="text-decoration-none">View profile</Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {isLoadMore 
                    ? <PropagateLoaderScreen />
                    : <>
                        {lastPageCount > 0 && (loadMoreCount <= lastPageCount) 
                          ? <div className="text-center"> <button className="btn btn-primary btn-sm" onClick={loadMorePorfiles}>Load More</button> </div>
                          : <></>
                        }
                      </>
                  }
                </div>
                : <div className={styles['no_result']}>
                    <h2>Nothing Found</h2>
                    <p>Sorry, but nothing matched your search of <b>[search keywords]</b>. Please try again with some different keywords.</p>
                  </div>
              }
              </>
        }
    </>
  )
}
