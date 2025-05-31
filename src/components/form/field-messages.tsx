"use client"
import React, { useEffect, useState } from 'react'
import { getErrorInFormControls } from '@/helper/react-hook-form-helper';

const FieldMessages = ({error,success,className,name}: {error: string|object|boolean|undefined|null; className?: string,name:string|undefined,success:string|object|boolean|undefined|null}) => {
    const [message, setMessage] = useState<{text: string  | null; type: "error" | "success" | null}>({text: null, type: null});
    
    useEffect(()=>{
        if (error && error !== true&&name) {
            const errorMsg = getErrorInFormControls(error, name);
            setMessage({ text: errorMsg, type: "error" });
        } else if (success) {
            setMessage({ text: typeof success === 'string' ? success : String(success), type: "success" });
        } else {
            setMessage({ text: null, type: null });
        }
    }, [error, success,name]);

    if( !message.text ) return null;
    return (
        <p
          className={`mt-1.5 text-xs ${className}`}
        >
          {message.text }
        </p>
  )
}

export default FieldMessages