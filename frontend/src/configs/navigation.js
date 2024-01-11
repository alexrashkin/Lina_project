export default [
  {
    title: 'О художнике',
    href: '/artist',
    auth: false,
    admin: false
  },
  {
    title: 'Работы',
    href: '/works',
    auth: false,
    admin: false
  },
  {
    title: 'Добавить работу',
    href: '/works/create',
    auth: true,
    admin: true
  },
  {
    title: 'Избранное',
    href: '/favorites',
    auth: true,
    admin: false
  },
]