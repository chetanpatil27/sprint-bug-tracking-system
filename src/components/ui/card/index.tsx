import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

export interface CardProps {
    children: ReactNode;
    title?: string;
    subtitle?: string;
    headerslot?: ReactNode;
    className?: string;
    bodyClass?: string;
    noborder?: boolean;
    titleClass?: string;
    style?: React.CSSProperties;
}

const Card: React.FC<CardProps> = ({
    children,
    title,
    subtitle,
    headerslot,
    className = "",
    bodyClass = "p-6",
    noborder,
    titleClass = "",
    style,
}) => (
    <div
        className={cn(
            "h-full w-full rounded-md bg-white dark:bg-gray-400 shadow-lg",
            className
        )}
        style={style}
    >
        {(title || subtitle) && (
            <header
                className={cn("card-header", { "no-border": noborder })}
            >
                <div>
                    {title && (
                        <div className={cn("card-title", titleClass)}>
                            {title}
                        </div>
                    )}
                    {subtitle && <div className="card-subtitle">{subtitle}</div>}
                </div>
                {headerslot && <div className="card-header-slot">{headerslot}</div>}
            </header>
        )}
        <main className={cn("card-body", bodyClass)}>{children}</main>
    </div>
);

export default Card;