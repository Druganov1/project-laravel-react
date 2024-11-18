import { Icon } from '@iconify/react';

export default function SocialLoginButton(props) {
    const providerColors = {
        github: 'bg-black hover:bg-gray-900',
        google: 'bg-[#dd4e41] hover:bg-red-500',
        facebook: 'bg-blue-600 hover:bg-blue-500',
        twitter: 'bg-blue-400 hover:bg-blue-300',
        discord: 'bg-[#5865f2] hover:bg-[#677bc4]',
        // Add more providers and their colors here
    };
    const buttonColorClass = providerColors[props.provider] || 'bg-black'; // Default to black if props.provider is not found

    return (
        <a
            href={`/auth/${props.provider}/redirect`}
            className={`social-button ${buttonColorClass} flex items-center justify-center gap-2 rounded px-4 py-2 text-white`}
        >
            <Icon className="size-7" icon={`mdi:${props.provider}`} />
            Sign in with{' '}
            {props.provider.charAt(0).toUpperCase() + props.provider.slice(1)}
        </a>
    );
}
