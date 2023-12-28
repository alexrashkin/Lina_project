class Api {
  constructor (url, headers) {
    this._url = url
    this._headers = headers
  }

  checkResponse (res) {
    return new Promise((resolve, reject) => {
      if (res.status === 204) {
        return resolve(res)
      }
      const func = res.status < 400 ? resolve : reject
      res.json().then(data => func(data))
    })
  }

  signin ({ email, password }) {
    return fetch(
      '/api/auth/token/login/',
      {
        method: 'POST',
        headers: this._headers,
        body: JSON.stringify({
          email, password
        })
      }
    ).then(this.checkResponse)
  }

  signout () {
    const token = localStorage.getItem('token')
    return fetch(
      '/api/auth/token/logout/',
      {
        method: 'POST',
        headers: {
          ...this._headers,
          'authorization': `Token ${token}`
        }
      }
    ).then(this.checkResponse)
  }

  signup ({ email, password, username, first_name, last_name }) {
    return fetch(
      `/api/users/`,
      {
        method: 'POST',
        headers: this._headers,
        body: JSON.stringify({
          email, password, username, first_name, last_name
        })
      }
    ).then(this.checkResponse)
  }

  getUserData () {
    const token = localStorage.getItem('token')
    return fetch(
      `/api/users/me/`,
      {
        method: 'GET',
        headers: {
          ...this._headers,
          'authorization': `Token ${token}`
        }
      }
    ).then(this.checkResponse)
  }

  changePassword ({ current_password, new_password }) {
    const token = localStorage.getItem('token')
    return fetch(
      `/api/users/set_password/`,
      {
        method: 'POST',
        headers: {
          ...this._headers,
          'authorization': `Token ${token}`
        },
        body: JSON.stringify({ current_password, new_password })
      }
    ).then(this.checkResponse)
  }


  // works

  getWorks ({
    page = 1,
    limit = 6,
    is_favorited = 0,
    author,
    tags
  } = {}) {
      const token = localStorage.getItem('token')
      const authorization = token ? { 'authorization': `Token ${token}` } : {}
      const tagsString = tags ? tags.filter(tag => tag.value).map(tag => `&tags=${tag.slug}`).join('') : ''
      return fetch(
        `/api/works/?page=${page}&limit=${limit}${author ? `&author=${author}` : ''}${is_favorited ? `&is_favorited=${is_favorited}` : ''}${tagsString}`,
        {
          method: 'GET',
          headers: {
            ...this._headers,
            ...authorization
          }
        }
      ).then(this.checkResponse)
  }

  getWork ({
    work_id
  }) {
    const token = localStorage.getItem('token')
    const authorization = token ? { 'authorization': `Token ${token}` } : {}
    return fetch(
      `/api/works/${work_id}/`,
      {
        method: 'GET',
        headers: {
          ...this._headers,
          ...authorization
        }
      }
    ).then(this.checkResponse)
  }

  createWork ({
    name = '',
    image,
    tags = [],
    text = '',
    materials = []
  }) {
    const token = localStorage.getItem('token')
    return fetch(
      '/api/works/',
      {
        method: 'POST',
        headers: {
          ...this._headers,
          'authorization': `Token ${token}`
        },
        body: JSON.stringify({
          name,
          image,
          tags,
          text,
          materials
        })
      }
    ).then(this.checkResponse)
  }

  updateWork ({
    name,
    work_id,
    image,
    tags,
    text,
    materials
  }, wasImageUpdated) { // image was changed
    const token = localStorage.getItem('token')
    return fetch(
      `/api/works/${work_id}/`,
      {
        method: 'PATCH',
        headers: {
          ...this._headers,
          'authorization': `Token ${token}`
        },
        body: JSON.stringify({
          name,
          id: work_id,
          image: wasImageUpdated ? image : undefined,
          tags,
          text,
          materials
        })
      }
    ).then(this.checkResponse)
  }

  addToFavorites ({ id }) {
    const token = localStorage.getItem('token')
    return fetch(
      `/api/works/${id}/favorite/`,
      {
        method: 'POST',
        headers: {
          ...this._headers,
          'authorization': `Token ${token}`
        }
      }
    ).then(this.checkResponse)
  }

  removeFromFavorites ({ id }) {
    const token = localStorage.getItem('token')
    return fetch(
      `/api/works/${id}/favorite/`,
      {
        method: 'DELETE',
        headers: {
          ...this._headers,
          'authorization': `Token ${token}`
        }
      }
    ).then(this.checkResponse)
  }

  getUser ({ id }) {
    const token = localStorage.getItem('token')
    return fetch(
      `/api/users/${id}/`,
      {
        method: 'GET',
        headers: {
          ...this._headers,
          'authorization': `Token ${token}`
        }
      }
    ).then(this.checkResponse)
  }

  getUsers ({
    page = 1,
    limit = 6
  }) {
    const token = localStorage.getItem('token')
    return fetch(
      `/api/users/?page=${page}&limit=${limit}`,
      {
        method: 'GET',
        headers: {
          ...this._headers,
          'authorization': `Token ${token}`
        }
      }
    ).then(this.checkResponse)
  }

  // materials
  getMaterials ({ name }) {
    const token = localStorage.getItem('token')
    return fetch(
      `/api/materials/?name=${name}`,
      {
        method: 'GET',
        headers: {
          ...this._headers
        }
      }
    ).then(this.checkResponse)
  }

  // tags
  getTags () {
    const token = localStorage.getItem('token')
    return fetch(
      `/api/tags/`,
      {
        method: 'GET',
        headers: {
          ...this._headers
        }
      }
    ).then(this.checkResponse)
  }

  deleteWork ({ work_id }) {
    const token = localStorage.getItem('token')
    return fetch(
      `/api/works/${work_id}/`,
      {
        method: 'DELETE',
        headers: {
          ...this._headers,
          'authorization': `Token ${token}`
        }
      }
    ).then(this.checkResponse)
  }  
}

export default new Api(process.env.API_URL || 'http://localhost', { 'content-type': 'application/json' })