import {
  Card,
  Title,
  Pagination,
  CardList,
  Button,
  CheckboxGroup,
  Container,
  Main 
} from '../../components'
import cn from 'classnames'
import styles from './styles.module.css'
import { useWorks } from '../../utils/index.js'
import { useEffect, useState, useContext } from 'react'
import api from '../../api'
import { useParams, useHistory } from 'react-router-dom'
import { UserContext } from '../../contexts'
import MetaTags from 'react-meta-tags'

const UserPage = ({ updateOrders }) => {
  const {
    works,
    setWorks,
    worksCount,
    setWorksCount,
    worksPage,
    setWorksPage,
    tagsValue,
    setTagsValue,
    handleTagsChange,
    handleLike,
  } = useWorks()
  const { id } = useParams()
  const [ user, setUser ] = useState(null)
  const history = useHistory()
  const userContext = useContext(UserContext)

  const getWorks = ({ page = 1, tags }) => {
    api
      .getWorks({ page, author: id, tags })
        .then(res => {
          const { results, count } = res
          setWorks(results)
          setWorksCount(count)
        })
  }

  const getUser = () => {
    api.getUser({ id })
      .then(res => {
        setUser(res)
      })
      .catch(err => {
        history.push('/works')
      })
  }

  useEffect(_ => {
    if (!user) { return }
    getWorks({ page: worksPage, tags: tagsValue, author: user.id })
  }, [ worksPage, tagsValue, user ])

  useEffect(_ => {
    getUser()
  }, [])

  useEffect(_ => {
    api.getTags()
      .then(tags => {
        setTagsValue(tags.map(tag => ({ ...tag, value: true })))
      })
  }, [])


  return <Main>
    <Container className={styles.container}>
      <MetaTags>
        <title>{user ? `${user.first_name} ${user.last_name}` : 'Страница пользователя'}</title>
        <meta name="description" content={user ? `Художник Ангелина Игоревна Хижняк - ${user.first_name} ${user.last_name}` : 'Художник Ангелина Игоревна Хижняк - Страница пользователя'} />
        <meta property="og:title" content={user ? `${user.first_name} ${user.last_name}` : 'Страница пользователя'} />
      </MetaTags>
      <div className={styles.title}>
        <Title
          className={cn({
            [styles.titleText]: (userContext || {}).id !== (user || {}).id
          })}
          title={user ? `${user.first_name} ${user.last_name}` : ''}
        />
        <CheckboxGroup
          values={tagsValue}
          handleChange={value => {
            setWorksPage(1)
            handleTagsChange(value)
          }}
        />
      </div>
      <CardList>
        {works.map(card => <Card
          {...card}
          key={card.id}
          updateOrders={updateOrders}
          handleLike={handleLike}
        />)}
      </CardList>
      <Pagination
        count={worksCount}
        limit={6}
        page={worksPage}
        onPageChange={page => setWorksPage(page)}
      />
    </Container>
  </Main>
}

export default UserPage

