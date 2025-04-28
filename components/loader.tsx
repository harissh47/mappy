import React from 'react';
import Image from 'next/image';

export default function Loader() {
    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
            <Image
                src="/loader.gif"
                alt="Loading..."
                width={64}
                height={64}
                className="w-16 h-16"
                priority
            />
        </div>
    );
}
