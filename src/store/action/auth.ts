import { HTTP_METHODS } from "@/const/dictionary";
import handleApiRequest from "../helper/action-handler";
import { setAuthState } from "../slice/auth";

export class AuthApi {
    static login({ payload }: { payload: object }) {
        return handleApiRequest({
            method: HTTP_METHODS.POST,
            payload,
            endpoint: "auth/sign-in",
            onSuccess: (res, dispatch) => {
                console.log("login response:", res);
                dispatch(setAuthState({ user: res.data.user, isAuthenticated: true }));
                return res.data;
            }
        })
    }

    static logout() {
        return handleApiRequest({
            method: HTTP_METHODS.POST,
            endpoint: "auth/sign-out",
            onSuccess: (res, dispatch) => {
                console.log("logout response:", res);
                dispatch(setAuthState({ user: null, isAuthenticated: false }));
                return res.data;
            }
        })
    }
};

