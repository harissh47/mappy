import React from 'react';

export default function Loader() {
    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
            <img src="/loader.gif" alt="Loading..." className="w-16 h-16" />
        </div>
    );
}