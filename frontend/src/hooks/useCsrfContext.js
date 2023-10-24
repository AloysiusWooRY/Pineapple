import { useContext } from "react"
import { CsrfContext } from "../context/CsrfContext"

export const useCsrfContext = () => {
    const context = useContext(CsrfContext)

    if (!context) {
        throw Error('useCsrfContext must be used inside an CsrfContextProvider')
    }

    return context
}