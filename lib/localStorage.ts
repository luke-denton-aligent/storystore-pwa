type Keys = 'cartId'

export const getFromLocalStorage = (key: Keys) => localStorage.getItem(`luma/${key}`)

export const writeInLocalStorage = (key: Keys, value: string) => localStorage.setItem(`luma/${key}`, value)
