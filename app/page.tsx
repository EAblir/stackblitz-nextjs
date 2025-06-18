'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        const isLoggedIn = document.cookie.includes('auth=1');
        router.replace(isLoggedIn ? '/dashboard' : '/login');
    }, [router]);

    return null;
}