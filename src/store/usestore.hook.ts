import { AppSelector } from '.'

const useReduxStore = () => {
    const store = AppSelector((state) => state)
    return { ...store }
}

export default useReduxStore