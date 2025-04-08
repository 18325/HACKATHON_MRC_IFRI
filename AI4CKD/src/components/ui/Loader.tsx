import React from "react";

interface LoaderProps {
    size?: "sm" | "md" | "lg"; // Taille du loader
    className?: string; // Classes supplémentaires pour personnalisation
}

const Loader: React.FC<LoaderProps> = ({ size = "md", className = "" }) => {
    // Déterminer la taille du loader
    const sizeClasses = {
        sm: "w-6 h-6 border-2",
        md: "w-10 h-10 border-4",
        lg: "w-16 h-16 border-6",
    };

    return (
        <div className={`flex flex-col items-center justify-center ${className}`}>
            {/* Spinner circulaire */}
            <div
                className={`
          ${sizeClasses[size]}
          border-t-transparent border-solid rounded-full animate-spin
          border-brand-500 dark:border-brand-400
        `}
            ></div>
            {/* Texte de chargement avec pulsation */}
            <p
                className={`
          mt-2 text-sm font-medium text-gray-600 dark:text-gray-300
          animate-pulse
        `}
            >
                Chargement...
            </p>
        </div>
    );
};

export default Loader;