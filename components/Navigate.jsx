"use client"
import { useEffect } from 'react';

const Navigate = ({ to, router }) => {
    useEffect(() => {
        if (to) {
            router.replace(to);
        }
    }, [to, router]);

    return null;
};

export default Navigate;
