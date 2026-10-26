/**
 * A page
 */
export type PageType = {
  label: string
  path: string
}

/**
 * The list of available pages with their url paths.
 */
export const pages: PageType[] = [
  {
    label: 'Prospects',
    path: '/prospects',
  },
  {
    label: 'Dashboard',
    path: '/dashboard',
  },
]
