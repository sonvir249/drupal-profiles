import {HashLoader} from 'react-spinners'
import styles from '@/styles/Home.module.css'

export default function HashLoaderScreen() {
  return (
    <div className={`${styles['loading-screen-wrapper']} my-4 text-center`}>
      <HashLoader
      color="#0d6efd"
      size={150}
      />
    </div>
  )
}
