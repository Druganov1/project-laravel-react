export default function SubTitle({ children, className = '' }) {
    return (
        <p
            className={`${className} mt-1 text-sm text-gray-600 dark:text-gray-400`}
        >
            {children}
        </p>
    );
}
