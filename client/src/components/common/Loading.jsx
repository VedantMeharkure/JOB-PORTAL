function Loading({ message = "Loading..." }) {
    return (
        <div className="loading-state">
            <p>{message}</p>
        </div>
    );
}

export default Loading;