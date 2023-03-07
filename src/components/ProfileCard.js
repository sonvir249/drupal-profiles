import Link from "next/link"
import styles from '@/styles/Home.module.css'
import LoadingScreen from './LoadingScreen'

export default function ProfileCard({ cardProfiles, isLoading, countriesList }) {
  // Date unix timestamp.
  const formartJoinedDate = (joinedDate)=> {
    const dateFormat = new Date(parseInt(joinedDate) * 1000);
    const year  = dateFormat.getFullYear();
    const month = (dateFormat.getMonth() + 1).toString().padStart(2, "0");
    const day   = dateFormat.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`
  }
  return (
    <div>
      {isLoading ? 
          <LoadingScreen />
          : <>
              {cardProfiles?.list.length ? 
                <div className={styles.cards}>
                  {cardProfiles?.list?.map((user, i) => (
                    <div key={i} className={styles.card}>
                      <div className={styles['content']}>
                        <div className={styles['content-data']}>username: {user.name}</div>
                        {user?.field_first_name !== null || (user?.field_first_name !== null && user?.field_last_name !== null) ?
                          <div className={styles['content-data']}>Name: {user.field_first_name} {user.field_last_name}</div>
                          : ''
                        }
                        <div className={styles['content-data']}>Joined on: {formartJoinedDate(user.created)}</div>
                        {user?.field_country.length ?
                          <div className={styles['content-data']}>Country: {countriesList.getName(user?.field_country[0], 'en')}</div>
                          : ''
                        }
                      </div>
                      <div className={styles['card-link-wrapper']}>
                        <Link href={user.url} target='_blank' className={styles['card-link']}>Drupal profile</Link>
                      </div>
                    </div>
                  ))}
                </div>
                : <div className={styles['no_result']}>
                    <h2>Nothing Found</h2>
                    <p>Sorry, but nothing matched your search of <b>[search keywords]</b>. Please try again with some different keywords.</p>
                  </div>
              }
              </>
        }
    </div>
  )
}
