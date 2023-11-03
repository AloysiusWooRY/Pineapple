import { useAuthContext } from './useAuthContext'
import { accountLogout } from '../apis/exportedAPIs'

export const useLogout = () => {
    const { dispatch } = useAuthContext()

    const logout = () => {

        accountLogout();
        // Remove user from storage
        localStorage.removeItem('user')
        // Dispatch logout action
        dispatch({ type: 'LOGOUT' })

        
    }

    return { logout }
}