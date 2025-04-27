function AppHeader() {
    return (
        <div className="w-full box-border p-4 bg-gray-200 flex items-start">
            <div className="flex-1">
                <h1 className="text-4xl font-bold">UTF-8 Playground</h1>
                <p className="mt-2 text-[12pt] text-gray-800">
                    Explore and understand UTF-8 encoding, the most popular Unicode character encoding that uses up to 4 bytes to represent Unicode characters.
                </p>
            </div>
            <a
                href="https://github.com/vishnuharidas/utf8-playground"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-4 flex flex-col items-center opacity-70 hover:opacity-100 transition-opacity"
            >
                <img src="/images/github-mark.svg" alt="UTF-8 Encoding" className="w-auto h-auto max-w-[30px]" />
                <span className="mt-2 text-sm">source↗</span>
            </a>
        </div>
    );
}

export default AppHeader;