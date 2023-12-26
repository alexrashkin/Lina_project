import { Card, Title, Pagination, CardList, Container, Main, CheckboxGroup  } from '../../components'
import styles from './styles.module.css'
import { useWorks } from '../../utils/index.js'
import { useEffect } from 'react'
import api from '../../api'
import MetaTags from 'react-meta-tags'

const HomePage = ({ updateOrders }) => {
  const {
    works,
    setworks,
    worksCount,
    setworksCount,
    worksPage,
    setworksPage,
    tagsValue,
    setTagsValue,
    handleTagsChange,
    handleLike,
    handleAddToCart
  } = useWorks()


  const getWorks = ({ page = 1, tags }) => {
    api
      .getWorks({ page, tags })
      .then(res => {
        const { results, count } = res
        setworks(results)
        setworksCount(count)
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
        <title>Работы</title>
        <meta name="description" content="Художник Ангелина Хижняк - Работы" />
        <meta property="og:title" content="Работы" />
      </MetaTags>
      <div className={styles.title}>
        <Title title='Работы' />
        <CheckboxGroup
          values={tagsValue}
          handleChange={value => {
            setworksPage(1)
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
          handleAddToCart={handleAddToCart}
        />)}
      </CardList>
      <Pagination
        count={worksCount}
        limit={6}
        page={worksPage}
        onPageChange={page => setworksPage(page)}
      />
    </Container>
  </Main>
}

export default HomePage

