import {HashLoader} from 'react-spinners'
import styles from './LoadingScreen.module.css'

export default function LoadingScreen() {
  return (
    <div className={styles['loading-screen-wrapper']}>
      <HashLoader
       color="#041ae3"
       size={150}
       />
    </div>
  )
}
