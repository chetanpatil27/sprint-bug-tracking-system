"use client";
import React from "react";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import { useForm } from "react-hook-form";
import { AuthApi } from "@/store/action/auth";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";

export default function SignInForm() {
    const dispatch = useDispatch<AppDispatch>();
    const { handleSubmit, control } = useForm()

    const onSubmit = (data: object) => {
        dispatch(AuthApi.login({ payload: data }))
    }

    return (
        <>
            <h1 className="text-2xl font-semibold text-center mb-6">Sign in to your account</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-4 mb-6">
                    <Input control={control} placeholder="info@gmail.com" type="email" label="Email" name="email" />
                    <Input
                        control={control}
                        type="password"
                        placeholder="Enter your password"
                        label="Password"
                        name="password"
                    />
                    <Button className="w-full" size="sm" type="submit" label="Sign in" />
                </div>
            </form>
        </>
    );
}
