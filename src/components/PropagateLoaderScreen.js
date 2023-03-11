import {PropagateLoader} from 'react-spinners'
import styles from '@/styles/Home.module.css'

export default function PropagateLoaderScreen() {
  return (
    <div className={`${styles['loading-screen-wrapper']} my-4 text-center`}>
      <PropagateLoader
       color="#0d6efd"
       size={20}
       />
    </div>
  )
}
