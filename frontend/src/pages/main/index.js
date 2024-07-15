import { Card, Title, Pagination, CardList, Container, Main, CheckboxGroup  } from '../../components'
import { useLocation, useHistory } from 'react-router-dom'
import styles from './styles.module.css'
import { useWorks } from '../../utils/index.js'
import { useEffect } from 'react'
import api from '../../api'
import MetaTags from 'react-meta-tags'

const HomePage = ({ updateOrders }) => {
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
  const history = useHistory()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search);
  let  page = queryParams.get("page");
  if (page == undefined || page == null)
  {
    page = 1
  }
  else
  {
    if (page != worksPage)
        setWorksPage(page);
  }
  
  const getWorks = ({ page = page, tags }) => {
    api
      .getWorks({ page, tags })
      .then(res => {
        const { results, count } = res
        setWorks(results)
        setWorksCount(count)
      })
  }

  useEffect(_ => {
    if (tagsValue.length != 0) {
        getWorks({ page: worksPage, tags: tagsValue })
    }
  }, [worksPage, tagsValue])


  useEffect(_ => {
    api.getTags()
      .then(tags => {
        setTagsValue(tags.map(tag => ({ ...tag, value: true })))
      })
  }, [])


  return <Main>
    <Container>
      <MetaTags>
        <title>Работы</title>
        <meta name="description" content="Художник Ангелина Игоревна Хижняк - Работы" />
        <meta property="og:title" content="Работы" />
      </MetaTags>
      <div className={styles.title}>
        <Title title='Работы' />
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
        onPageChange={page => history.push(`/works?page=${page}`)}
      />
    </Container>
  </Main>
}

export default HomePage

