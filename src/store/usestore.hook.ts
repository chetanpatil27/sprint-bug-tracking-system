import { AppSelector } from '.'

const useReduxStore = () => {
    const auth = AppSelector((state) => state.auth)
    return { auth }
}

export default useReduxStore