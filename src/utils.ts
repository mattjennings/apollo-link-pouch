export function capitilize(str: string) {
  if (!str) { return str }

  return str.slice(0, 1).toUpperCase() + str.slice(1).toLowerCase()
}
