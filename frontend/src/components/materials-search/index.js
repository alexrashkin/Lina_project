import styles from './styles.module.css'

const MaterialsSearch = ({ materials, onClick }) => {
  return <div className={styles.container}>
    {materials.map(({ name, id }) => {
      return <div key={id} onClick={_ => onClick({ id, name })}>{name}</div>
    })}
  </div>
}

export default MaterialsSearch