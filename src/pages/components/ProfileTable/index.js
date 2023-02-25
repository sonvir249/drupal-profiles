import Link from "next/link"
import styles from '@/styles/Home.module.css'
import LoadingScreen from '../LoadingScreen'

export default function ProfileTable({ cardProfiles, isLoading, countriesList }) {
  // Date unix timestamp.
  const formartJoinedDate = (joinedDate)=> {
    const dateFormat = new Date(parseInt(joinedDate) * 1000);
    const year  = dateFormat.getFullYear();
    const month = (dateFormat.getMonth() + 1).toString().padStart(2, "0");
    const day   = dateFormat.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`
  }

  return (
    <>
      {isLoading ? 
          <LoadingScreen />
          : <>
              {cardProfiles?.list.length ? 
                <div className="table-responsive">
                  <table className="table table-hover table-bordered">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Username</th>
                        <th>Name</th>
                        <th>Joined On</th>
                        <th>Country</th>
                        <th>Drupal Profile</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cardProfiles?.list?.map((user, i) => (
                        <tr key={i} >
                          <td>{i+1}</td>
                          <td>{user.name}</td>
                          <td>
                            {user?.field_first_name !== null || (user?.field_first_name !== null && user?.field_last_name !== null) ?
                              <p>{user.field_first_name} {user.field_last_name}</p>
                              : ''
                            }
                          </td>
                          <td>{formartJoinedDate(user.created)}</td>
                          <td>
                            {user?.field_country.length ?
                              <p>{countriesList.getName(user?.field_country[0], 'en')}</p>
                              : ''
                            }
                          </td>
                          <td>
                            <Link href={user.url} target='_blank' className="btn btn-success btn-sm">View profile</Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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