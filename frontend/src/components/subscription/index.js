import styles from './styles.module.css'
import cn from 'classnames'
import { Icons, Button, LinkComponent } from '../index'
const countForm = (number, titles) => {
  number = Math.abs(number);
  if (Number.isInteger(number)) {
    let cases = [2, 0, 1, 1, 1, 2];  
    return titles[ (number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number%10<5)?number%10:5] ]
  }
  return titles[1];
}

const Subscription = ({ email, first_name, last_name, username, removeSubscription, works_count, id, works }) => {
  const shouldShowButton = works_count  > 3
  const moreworks = works_count - 3
  return <div className={styles.subscription}>
    <div className={styles.subscriptionHeader}>
      <h2 className={styles.subscriptionTitle}>
        <LinkComponent className={styles.subscriptionworkLink} href={`/user/${id}`} title={`${first_name} ${last_name}`} />
      </h2>
    </div>
    <div className={styles.subscriptionBody}>
      <ul className={styles.subscriptionItems}>
        {works.map(work => {
          return <li className={styles.subscriptionItem} key={work.id}>
            <LinkComponent className={styles.subscriptionworkLink} href={`/works/${work.id}`} title={
              <div className={styles.subscriptionwork}>
                <img src={work.image} alt={work.name} className={styles.subscriptionworkImage} />
                <h3 className={styles.subscriptionworkTitle}>
                  {work.name}
                </h3>
              </div>
            } />
          </li>
        })}
        {shouldShowButton && <li className={styles.subscriptionMore}>
          <LinkComponent
            className={styles.subscriptionLink}
            title={`Еще ${moreworks} ${countForm(moreworks, ['работа', 'работы', 'работ'])}...`}
            href={`/user/${id}`}
          />
        </li>}
      </ul>
    </div>
    <div className={styles.subscriptionFooter}>
      <Button
        className={styles.subscriptionButton}
        clickHandler={_ => {
          removeSubscription({ id })
        }}
      >
        Отписаться
      </Button>
    </div>
  </div>
}

export default Subscription
