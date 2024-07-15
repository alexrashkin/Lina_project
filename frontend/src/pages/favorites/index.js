import { Card, Title, Pagination, CardList, Container, Main, CheckboxGroup  } from '../../components'
import styles from './styles.module.css'
import { useWorks } from '../../utils/index.js'
import { useEffect } from 'react'
import api from '../../api'
import MetaTags from 'react-meta-tags'

const Favorites = ({ updateOrders }) => {
  const {
    works,
    setWorks,
    worksCount,
    setWorksCount,
    worksPage,
    setWorksPage,
    tagsValue,
    handleTagsChange,
    setTagsValue,
    handleLike,
  } = useWorks()
  
  const getWorks = ({ page = 1, tags }) => {
    api
      .getWorks({ page, is_favorited: Number(true), tags })
      .then(res => {
        const { results, count } = res
        setWorks(results)
        setWorksCount(count)
      })
  }

  useEffect(_ => {
    getWorks({ page: worksPage, tags: tagsValue })
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
        <title>Избранное</title>
        <meta name="description" content="Художник Ангелина Игоревна Хижняк - Избранное" />
        <meta property="og:title" content="Избранное" />
      </MetaTags>
      <div className={styles.title}>
        <Title title='Избранное' />
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

export default Favorites

