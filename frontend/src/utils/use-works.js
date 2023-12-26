import React, { useState } from "react";
import { UseTags } from './index.js'
import api from '../api'

export default function useWorks () {
  const [ works, setworks ] = useState([])
  const [ worksCount, setworksCount ] = useState(0)
  const [ worksPage, setworksPage ] = useState(1)
  const { value: tagsValue, handleChange: handleTagsChange, setValue: setTagsValue } = UseTags()

  const handleLike = ({ id, toLike = true }) => {
    const method = toLike ? api.addToFavorites.bind(api) : api.removeFromFavorites.bind(api)
    method({ id }).then(res => {
      const worksUpdated = works.map(work => {
        if (work.id === id) {
          work.is_favorited = toLike
        }
        return work
      })
      setworks(worksUpdated)
    })
    .catch(err => {
      const { errors } = err
      if (errors) {
        alert(errors)
      }
    })
  }

  const handleAddToCart = ({ id, toAdd = true, callback }) => {
    const method = toAdd ? api.addToOrders.bind(api) : api.removeFromOrders.bind(api)
    method({ id }).then(res => {
      const worksUpdated = works.map(work => {
        if (work.id === id) {
          work.is_in_shopping_cart = toAdd
        }
        return work
      })
      setworks(worksUpdated)
      callback && callback(toAdd)
    })
    .catch(err => {
      const { errors } = err
      if (errors) {
        alert(errors)
      }
    })
  }

  return {
    works,
    setworks,
    worksCount,
    setworksCount,
    worksPage,
    setworksPage,
    tagsValue,
    handleLike,
    handleAddToCart,
    handleTagsChange,
    setTagsValue
  }
}