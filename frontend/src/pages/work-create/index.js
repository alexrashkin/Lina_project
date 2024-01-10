import { Container, MaterialsSearch, FileInput, Input, Title, CheckboxGroup, Main, Form, Button, Checkbox, Textarea } from '../../components'
import styles from './styles.module.css'
import api from '../../api'
import { useEffect, useState } from 'react'
import { UseTags } from '../../utils'
import { useHistory, Redirect } from 'react-router-dom'
import MetaTags from 'react-meta-tags'

const WorkCreate = ({ onEdit }) => {
  const { value, handleChange, setValue } = UseTags()
  const [ workName, setWorkName ] = useState('')
  const history = useHistory()
  const [ materialValue, setMaterialValue ] = useState({
    name: '',
    id: null,
  })
  const [ workMaterials, setWorkMaterials ] = useState([])
  const [ workText, setWorkText ] = useState('')
  const [ workFile, setWorkFile ] = useState(null)

  const [ materials, setMaterials ] = useState([])
  const [ showMaterials, setShowMaterials ] = useState(false)
  const [isSuperuser, setIsSuperuser] = useState(false);

  useEffect(() => {
    // Проверка статуса суперпользователя при загрузке страницы
    api.checkSuperuserStatus()
      .then(response => setIsSuperuser(response.is_superuser))
      .catch(error => console.error('Error checking superuser status:', error))
    },[])
  
  useEffect(_ => {
    if (materialValue.name === '') {
      return setMaterials([])
    }
    api
      .getMaterials({ name: materialValue.name })
      .then(materials => {
        setMaterials(materials)
      })
  }, [materialValue.name])

  useEffect(_ => {
    api.getTags()
      .then(tags => {
        setValue(tags.map(tag => ({ ...tag, value: true })))
      })
  }, [])

  const handleMaterialAutofill = ({ id, name }) => {
    setMaterialValue({
      ...materialValue,
      id,
      name
    })
  }

  const checkIfDisabled = () => {
    return workText === '' ||
    workName === '' ||
    workMaterials.length === 0 ||
    value.filter(item => item.value).length === 0 ||
    workFile === '' ||
    workFile === null
  }

  // Проверка статуса суперпользователя и редирект в случае отсутствия прав
  if (!isSuperuser) {
    return <Redirect to="/works" />;
  }

  return <Main>
    <Container>
      <MetaTags>
        <title>Добавление работы</title>
        <meta name="description" content="Художник Ангелина Хижняк - Добавление работы" />
        <meta property="og:title" content="Добавление работы" />
      </MetaTags>
      <Title title='Добавление работы' />
      <Form
        className={styles.form}
        onSubmit={e => {
          e.preventDefault()
          const data = {
            text: workText,
            name: workName,
            materials: workMaterials.map(item => ({
              id: item.id,
            })),
            tags: value.filter(item => item.value).map(item => item.id),
            image: workFile
          }
          api
          .createWork(data)
          .then(res => {
            history.push(`/works/${res.id}`)
          })
          .catch(err => {
            const { non_field_errors, materials } = err
            if (non_field_errors) {
              return alert(non_field_errors.join(', '))
            }
            if (materials) {
              return alert(`Материалы: ${materials.filter(item => Object.keys(item).length).map(item => {
                const error = item[Object.keys(item)[0]]
                return error && error.join(' ,')
              })[0]}`)
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
        <div className={styles.materials}>
          <div className={styles.materialsInputs}>
            <Input
              label='Материалы'
              className={styles.materialsNameInput}
              inputClassName={styles.materialsInput}
              labelClassName={styles.materialsLabel}
              onChange={e => {
                const value = e.target.value
                setMaterialValue({
                  ...materialValue,
                  name: value
                })
              }}
              onFocus={_ => {
                setShowMaterials(true)
              }}
              value={materialValue.name}
            />
            {showMaterials && materials.length > 0 && <MaterialsSearch
              materials={materials}
              onClick={({ id, name }) => {
                handleMaterialAutofill({ id, name })
                setMaterials([])
                setShowMaterials(false)
              }}
            />}

          </div>
          <div className={styles.materialsAdded}>
            {workMaterials.map(item => {
              return <div
                className={styles.materialsAddedItem}
              >
                <span className={styles.materialsAddedItemTitle}>{item.name}</span> <span></span> <span></span> <span
                  className={styles.materialsAddedItemRemove}
                  onClick={_ => {
                    const workMaterialsUpdated = workMaterials.filter(material => {
                      return material.id !== item.id
                    })
                    setWorkMaterials(workMaterialsUpdated)
                  }}
                >Удалить</span>
              </div>
            })}
          </div>
          <div
            className={styles.materialAdd}
            onClick={_ => {
              if (materialValue.name === '' || !materialValue.id) { return }
              setWorkMaterials([...workMaterials, materialValue])
              setMaterialValue({
                name: '',
                id: null,
              })
            }}
          >
            Добавить материал
          </div>
        </div>
        <Textarea
          label='Описание работы'
          onChange={e => {
            const value = e.target.value
            setWorkText(value)
          }}
        />
        <FileInput
          onChange={file => {
            setWorkFile(file)
          }}
          className={styles.fileInput}
          label='Загрузить фото'
        />
        <Button
          modifier='style_dark-blue'
          disabled={checkIfDisabled()}
          className={styles.button}
        >
          Добавить работу
        </Button>
      </Form>
    </Container>
  </Main>
}

export default WorkCreate