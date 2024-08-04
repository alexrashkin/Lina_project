import styles from './styles.module.css'
import cn from 'classnames'
import { hexToRgba } from '../../utils'

const Tag = ({ name, color = 'grey' }) => {
  const background = hexToRgba(color, 0.1)
  return <div className={cn(styles.tag)}>
    {name}
  </div>
}

export default Tag
