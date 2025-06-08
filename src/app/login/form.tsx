"use client";
import React from "react";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import { useForm } from "react-hook-form";

export default function SignInForm() {
    const { handleSubmit, control } = useForm()
    const onSubmit = (data: object) => {
        console.log("on submit data:", data)
        document.cookie = "isAuthenticated=true; path=/"; // Set cookie for authentication
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
