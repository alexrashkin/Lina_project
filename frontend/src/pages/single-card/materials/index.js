import styles from './styles.module.css'

const Materials = ({ materials }) => {
  if (!materials) { return null }
  return <div className={styles.materials}>
    <h3 className={styles['materials__title']}>Материалы:</h3>
    <div className={styles['materials__list']}>
      {materials.map(({
        name, 
      }) => <p
        key={`${name}`}
        className={styles['materials__list-item']}
      >
        {name}
      </p>)}
    </div>
  </div>
}

export default Materials

