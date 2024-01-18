import { Container, Main, Button, TagsContainer, Icons, LinkComponent } from '../../components'
import { UserContext, AuthContext } from '../../contexts'
import { useContext, useState, useEffect } from 'react'
import styles from './styles.module.css'
import Materials from './materials'
import Description from './description'
import { useRouteMatch, useParams, useHistory } from 'react-router-dom'
import MetaTags from 'react-meta-tags'

import { useWork } from '../../utils/index.js'
import api from '../../api'

const SingleCard = ({ loadItem, updateOrders }) => {
  const [ loading, setLoading ] = useState(true)
  const {
    work,
    setWork,
    handleLike,
  } = useWork()
  const authContext = useContext(AuthContext)
  const userContext = useContext(UserContext)
  const { id } = useParams()
  const history = useHistory()

  useEffect(_ => {
    api.getWork ({
        work_id: id
      })
      .then(res => {
        setWork(res)
        setLoading(false)
      })
      .catch(err => {
        history.push('/works')
      })
  }, [])
  
  const { url } = useRouteMatch()
  const {
    author = {},
    image,
    tags,
    name,
    materials,
    text,
    is_favorited,
    video,
  } = work
  
  return <Main>
    <Container>
      <MetaTags>
        <title>{name}</title>
        <meta name="description" content={`Художник Ангелина Хижняк - ${name}`} />
        <meta property="og:title" content={name} />
      </MetaTags>
      <div className={styles['single-card']}>
        <img src={image} alt={name} className={styles["single-card__image"]} />
        <div className={styles["single-card__info"]}>
          <div className={styles["single-card__header-info"]}>
              <h1 className={styles["single-card__title"]}>{name}</h1>
              {authContext && <Button
                modifier='style_none'
                clickHandler={_ => {
                  handleLike({ id, toLike: Number(!is_favorited) })
                }}
              >
                {is_favorited ? <Icons.StarBigActiveIcon /> : <Icons.StarBigIcon />}
              </Button>}
          </div>
          <TagsContainer tags={tags} />
          <div>
            <p className={styles['single-card__text_with_link']}>
              <div className={styles['single-card__text']}>
                <Icons.UserIcon /> <LinkComponent
                  title={`${author.first_name} ${author.last_name}`}
                  href={`/user/${author.id}`}
                  className={styles['single-card__link']}
                />
              </div>
              {(userContext || {}).id === author.id && <LinkComponent
                href={`${url}/edit`}
                title='Редактировать работу'
                className={styles['single-card__edit']}
              />}
            </p>
          </div>
          <Materials materials={materials} />
          <Description description={text} />
          {video && ( // проверка наличия видео
            <div className={styles.mediaContainer}>
              <video className={styles.video} controls>
                <source src={video} type='video/mp4' />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </div>
    </div>
    </Container>
  </Main>
}

export default SingleCard

