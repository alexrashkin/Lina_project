import { Container, IngredientsSearch, FileInput, Input, Title, CheckboxGroup, Main, Form, Button, Checkbox, Textarea } from '../../components'
import styles from './styles.module.css'
import api from '../../api'
import { useEffect, useState } from 'react'
import { UseTags } from '../../utils'
import { useParams, useHistory } from 'react-router-dom'
import MetaTags from 'react-meta-tags'

const WorkEdit = ({ onItemDelete }) => {
  const { value, handleChange, setValue } = UseTags()
  const [ workName, setWorkName ] = useState('')

  const [ ingredientValue, setIngredientValue ] = useState({
    name: '',
    id: null,
    amount: '',
    measurement_unit: ''
  })

  const [ workIngredients, setWorkIngredients ] = useState([])
  const [ workText, setWorkText ] = useState('')
  const [ workTime, setWorkTime ] = useState(0)
  const [ workFile, setWorkFile ] = useState(null)
  const [
    workFileWasManuallyChanged,
    setWorkFileWasManuallyChanged
  ] = useState(false)

  const [ ingredients, setIngredients ] = useState([])
  const [ showIngredients, setShowIngredients ] = useState(false)
  const [ loading, setLoading ] = useState(true)
  const history = useHistory()

  useEffect(_ => {
    if (ingredientValue.name === '') {
      return setIngredients([])
    }
    api
      .getIngredients({ name: ingredientValue.name })
      .then(ingredients => {
        setIngredients(ingredients)
      })
  }, [ingredientValue.name])

  useEffect(_ => {
    api.getTags()
      .then(tags => {
        setValue(tags.map(tag => ({ ...tag, value: true })))
      })
  }, [])

  const { id } = useParams()
  useEffect(_ => {
    if (value.length === 0 || !loading) { return }
    api.getWork ({
      work_id: id
    }).then(res => {
      const {
        image,
        tags,
        cooking_time,
        name,
        ingredients,
        text
      } = res
      setWorkText(text)
      setWorkName(name)
      setWorkTime(cooking_time)
      setWorkFile(image)
      setWorkIngredients(ingredients)


      const tagsValueUpdated = value.map(item => {
        item.value = Boolean(tags.find(tag => tag.id === item.id))
        return item
      })
      setValue(tagsValueUpdated)
      setLoading(false)
    })
    .catch(err => {
      history.push('/works')
    })
  }, [value])

  const handleIngredientAutofill = ({ id, name, measurement_unit }) => {
    setIngredientValue({
      ...ingredientValue,
      id,
      name,
      measurement_unit
    })
  }

  const checkIfDisabled = () => {
    return workText === '' ||
    workName === '' ||
    workIngredients.length === 0 ||
    value.filter(item => item.value).length === 0 ||
    workTime === '' ||
    workFile === '' ||
    workFile === null
  }

  return <Main>
    <Container>
      <MetaTags>
        <title>Редактирование работы</title>
        <meta name="description" content="Художник Ангелина Хижняк - Редактирование работы" />
        <meta property="og:title" content="Редактирование работы" />
      </MetaTags>
      <Title title='Редактирование работы' />
      <Form
        className={styles.form}
        onSubmit={e => {
          e.preventDefault()
          const data = {
            text: workText,
            name: workName,
            ingredients: workIngredients.map(item => ({
              id: item.id,
              amount: item.amount
            })),
            tags: value.filter(item => item.value).map(item => item.id),
            cooking_time: workTime,
            image: workFile,
            work_id: id
          }
          api
            .updateWork(data, workFileWasManuallyChanged)
            .then(res => {
              history.push(`/works/${id}`)
            })
            .catch(err => {
              const { non_field_errors, ingredients, cooking_time } = err
              console.log({  ingredients })
              if (non_field_errors) {
                return alert(non_field_errors.join(', '))
              }
              if (ingredients) {
                return alert(`Материалы: ${ingredients.filter(item => Object.keys(item).length).map(item => {
                  const error = item[Object.keys(item)[0]]
                  return error && error.join(' ,')
                })[0]}`)
              }
              if (cooking_time) {
                return alert(`Время создания работы: ${cooking_time[0]}`)
              }
              const errors = Object.values(err)
              if (errors) {
                alert(errors.join(', '))
              }
            })
        }}
      >
        <Input
          label='Название работы'
          onChange={e => {
            const value = e.target.value
            setWorkName(value)
          }}
          value={workName}
        />
        <CheckboxGroup
          label='Теги'
          values={value}
          className={styles.checkboxGroup}
          labelClassName={styles.checkboxGroupLabel}
          tagsClassName={styles.checkboxGroupTags}
          checkboxClassName={styles.checkboxGroupItem}
          handleChange={handleChange}
        />
        <div className={styles.ingredients}>
          <div className={styles.ingredientsInputs}>
            <Input
              label='Материалы'
              className={styles.ingredientsNameInput}
              inputClassName={styles.ingredientsInput}
              labelClassName={styles.ingredientsLabel}
              onChange={e => {
                const value = e.target.value
                setIngredientValue({
                  ...ingredientValue,
                  name: value
                })
              }}
              onFocus={_ => {
                setShowIngredients(true)
              }}
              value={ingredientValue.name}
            />
            <div className={styles.ingredientsAmountInputContainer}>
              <Input
                className={styles.ingredientsAmountInput}
                inputClassName={styles.ingredientsAmountValue}
                onChange={e => {
                  const value = e.target.value
                  setIngredientValue({
                    ...ingredientValue,
                    amount: value
                  })
                }}
                value={ingredientValue.amount}
              />
              {ingredientValue.measurement_unit !== '' && <div className={styles.measurementUnit}>{ingredientValue.measurement_unit}</div>}
            </div>
            {showIngredients && ingredients.length > 0 && <IngredientsSearch
              ingredients={ingredients}
              onClick={({ id, name, measurement_unit }) => {
                handleIngredientAutofill({ id, name, measurement_unit })
                setIngredients([])
                setShowIngredients(false)
              }}
            />}
          </div>
          <div className={styles.ingredientsAdded}>
            {workIngredients.map(item => {
              return <div
                className={styles.ingredientsAddedItem}
              >
                <span className={styles.ingredientsAddedItemTitle}>{item.name}</span> <span>-</span> <span>{item.amount}{item.measurement_unit}</span> <span
                  className={styles.ingredientsAddedItemRemove}
                  onClick={_ => {
                    const workIngredientsUpdated = workIngredients.filter(ingredient => {
                      return ingredient.id !== item.id
                    })
                    setWorkIngredients(workIngredientsUpdated)
                  }}
                >Удалить</span>
              </div>
            })}
          </div>
          <div
            className={styles.ingredientAdd}
            onClick={_ => {
              if (ingredientValue.amount === '' || ingredientValue.name === '') { return }
              setWorkIngredients([...workIngredients, ingredientValue])
              setIngredientValue({
                name: '',
                id: null,
                amount: '',
                measurement_unit: ''
              })
            }}
          >
            Добавить материал
          </div>
        </div>
        <div className={styles.cookingTime}>
          <Input
            label='Время создания работы'
            className={styles.ingredientsTimeInput}
            labelClassName={styles.cookingTimeLabel}
            inputClassName={styles.ingredientsTimeValue}
            onChange={e => {
              const value = e.target.value
              setWorkTime(value)
            }}
            value={workTime}
          />
          <div className={styles.cookingTimeUnit}>мин.</div>
        </div>
        <Textarea
          label='Описание работы'
          onChange={e => {
            const value = e.target.value
            setWorkText(value)
          }}
          value={workText}
        />
        <FileInput
          onChange={file => {
            setWorkFileWasManuallyChanged(true)
            setWorkFile(file)
          }}
          className={styles.fileInput}
          label='Загрузить фото'
          file={workFile}
        />
        <div className={styles.actions}>
          <Button
            modifier='style_dark-blue'
            disabled={checkIfDisabled()}
            className={styles.button}
          >
            Редактировать работу
          </Button>
          <div
            className={styles.deleteWork}
            onClick={_ => {
              api.deleteWork({ work_id: id })
                .then(res => {
                  onItemDelete && onItemDelete()
                  history.push('/works')
                })
            }}
          >
            Удалить
          </div>
        </div>
      </Form>
    </Container>
  </Main>
}

export default WorkEdit