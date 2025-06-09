import { AxiosRequestConfig, AxiosResponse } from "axios";
import { axiosInstance } from "@/server/http";
import { toast } from "react-hot-toast";
import { AnyAction, Dispatch } from "redux";
import { HTTP_METHODS } from "@/const/dictionary";

interface DispatchActionParams<T = unknown, R = unknown> {
    payload?: T;
    headers?: Record<string, string>;
    endpoint?: string;
    method?: AxiosRequestConfig["method"];
    params?: Record<string, unknown>;
    setLoading?: (val: boolean) => void;
    dispatchSetLoading?: (val: boolean) => AnyAction;
    setData?: (data: R | null) => AnyAction;
    dispatchSetData?: (data: R | null) => AnyAction;
    onSuccess?: ((res: AxiosResponse, dispatch: Dispatch<AnyAction>) => Promise<R> | R) | null;
    onError?: ((error: unknown) => Promise<unknown> | unknown) | null;
    showError?: boolean;
    errorMsg?: string;
    showSuccess?: boolean;
    successMsg?: string;
    isFormData?: boolean;
    onUploadProgress?: AxiosRequestConfig["onUploadProgress"];
    onDownloadProgress?: AxiosRequestConfig["onDownloadProgress"];
    signal?: AbortSignal;
    rest?: AxiosRequestConfig;
    [key: string]: unknown;
}

const handleApiRequest = <T = unknown, R = unknown>({
    payload,
    headers = {},
    endpoint = "",
    method = HTTP_METHODS.GET,
    params = {},
    setLoading,
    dispatchSetLoading,
    setData,
    dispatchSetData,
    onSuccess = null,
    onError,
    showError = true,
    errorMsg = "Something went wrong",
    showSuccess = true,
    successMsg = "Success",
    isFormData = false,
    onUploadProgress,
    onDownloadProgress,
    signal,
    ...rest
}: DispatchActionParams<T, R>) => {
    return async (dispatch: Dispatch<AnyAction>) => {
        const startLoading = (val: boolean) => {
            if (setLoading && typeof setLoading === "function") {
                setLoading(val);
            } else if (dispatchSetLoading && typeof dispatchSetLoading === "function") {
                dispatch(dispatchSetLoading(val));
            }
        };
        startLoading(true);
        try {
            const res = await axiosInstance({
                method: method,
                url: endpoint,
                data: payload,
                params: params,
                headers: {
                    ...headers,
                    "Content-Type": isFormData ? "multipart/form-data" : "application/json",
                },
                onUploadProgress: onUploadProgress,
                onDownloadProgress: onDownloadProgress,
                signal: signal,
                ...rest,
            });
            let finalData: R = res.data;
            if (onSuccess && typeof onSuccess === "function") {
                finalData = await onSuccess(res, dispatch);
            }
            if (finalData && setData) {
                setData(finalData);
            } else if (dispatchSetData && finalData) {
                dispatch(dispatchSetData(finalData));
            } else {
                if (dispatchSetData) {
                    dispatch(dispatchSetData(null));
                } else if (setData) {
                    setData(null);
                }
            }
            if (showSuccess) {
                toast.success(successMsg);
            }
            return { data: finalData, status: res.status };
        } catch (error: unknown) {
            let finalErr;
            if (
                error &&
                typeof error === "object" &&
                "response" in error &&
                (error as { response?: { data?: unknown } }).response?.data
            ) {
                finalErr = (error as { response: { data: unknown } }).response.data;
            } else {
                finalErr = error;
            }
            if (onError && typeof onError === "function") {
                finalErr = await onError(error);
            }
            if (showError && !onError) {
                if (setData) {
                    dispatch(setData(null));
                } else if (dispatchSetData) {
                    dispatch(dispatchSetData(null));
                }
                toast.error(errorMsg);
            }
            return finalErr;
        } finally {
            startLoading(false);
        }
    };
};

export default handleApiRequest;
