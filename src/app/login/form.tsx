"use client";
import React from "react";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthApi } from "@/store/action/auth";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { z } from "zod";
import { SubmitHandler } from "react-hook-form";

const schema = z.object({
    email: z.string().email("Invalid email address").nonempty("Email is required"),
    password: z.string().nonempty("Password is required"),
});

interface FormValues {
    email: string;
    password: string;
}

export default function SignInForm() {
    const dispatch = useDispatch<AppDispatch>();
    const { handleSubmit, control, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(schema) })

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        dispatch(AuthApi.login({ payload: data }))
    }

    return (
        <>
            <h1 className="text-2xl font-semibold text-center mb-6">Sign in to your account</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-4 mb-6">
                    <Input control={control} placeholder="info@gmail.com" type="email" label="Email" name="email" error={errors} />
                    <Input
                        control={control}
                        type="password"
                        placeholder="Enter your password"
                        label="Password"
                        name="password" error={errors}
                    />
                    <Button className="w-full" size="sm" type="submit" label="Sign in" />
                </div>
            </form>
        </>
    );
}
