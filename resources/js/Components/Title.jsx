export default function Title({ children, className = '' }) {
    return (
        <h2
            className={`${className} text-lg font-medium text-gray-900 dark:text-gray-100`}
        >
            {children}
        </h2>
    );
}
