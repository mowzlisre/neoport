import { setStatusAction } from "../../redux/actions/storeActions"

export const dispatchStatus = (dispatch, status) => {
    dispatch(setStatusAction({status: status}))
}