import Link from "next/link"
import styles from '@/styles/Home.module.css'
import LoadingScreen from '../LoadingScreen'

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
          : <div className={styles.cards}>
              {cardProfiles?.list?.map((user, i) => (
                <div key={i} className={styles.card}>
                  <span>username: {user.name}</span>
                  <span>Fname: {user.field_first_name}</span>
                  <span>Lname: {user.field_last_name}</span>
                  <span>Joined on: {formartJoinedDate(user.created)}</span>
                  {user?.field_country.length ?
                    <span>Country: {countriesList.getName(user?.field_country[0], 'en')}</span>
                    : ''
                  }
                  <Link href={user.url} target='_blank'>Drupal profile</Link>
                </div>
              ))}
            </div>
        }
    </div>
  )
}
