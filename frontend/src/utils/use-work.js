import React, { useState } from "react";
import api from '../api'

export default function useWork () {
  const [ work, setWork ] = useState({})

  const handleLike = ({ id, toLike = 1 }) => {
    const method = toLike ? api.addToFavorites.bind(api) : api.removeFromFavorites.bind(api)
    method({ id }).then(res => {
      const workUpdated = { ...work, is_favorited: Number(toLike) }
      setWork(workUpdated)
    })
    .catch(err => {
      const { errors } = err
      if (errors) {
        alert(errors)
      }
    })
  }

  return {
    work,
    setWork,
    handleLike,
  }
}
