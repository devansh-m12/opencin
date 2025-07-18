export const baseUrl = {
    Dashboard: process.env.NEXT_PUBLIC_DASHBOARD_URL || 'http://localhost:3000',
    Marketing: process.env.NEXT_PUBLIC_MARKETING_URL || 'http://localhost:3001'
};
export const routes = {
    marketing: {
        Index: '/',
        About: '/about',
        Contact: '/contact',
        Pricing: '/pricing',
        Blog: '/blog',
        Careers: '/careers',
        Story: '/story',
        Docs: '/docs',
        Roadmap: '/roadmap',
        Privacy: '/privacy-policy',
        PrivacyPolicy: '/privacy-policy',
        Terms: '/terms-of-use',
        TermsOfUse: '/terms-of-use',
        Cookie: '/cookie-policy',
        CookiePolicy: '/cookie-policy'
    },
    dashboard: {
        Index: '/',
        Profile: '/profile',
        Settings: '/settings',
        Dashboard: '/dashboard',
        auth: {
            SignIn: '/auth/signin',
            SignUp: '/auth/signup'
        },
        organizations: {
            Index: '/organizations'
        }
    }
};
export const getPathname = (pathname, baseUrl) => {
    if (baseUrl && pathname.startsWith(baseUrl)) {
        return pathname.replace(baseUrl, '');
    }
    return pathname;
};
