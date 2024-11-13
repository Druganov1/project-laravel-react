export default function HelloWorld() {
    return (
        <div className="flex h-dvh w-dvw flex-col items-center justify-center gap-2 bg-slate-900">
            <h1 className="text-xl text-white">Hello World</h1>
            <img
                src="/assets/img/React-icon.png"
                alt="react"
                className="animate-spin-slow block w-20"
            />
        </div>
    );
}
