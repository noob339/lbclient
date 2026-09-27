import styles from "./ThreadBox.module.css";
import ReactMarkdown from "react-markdown";

export default function ThreadBox({ messages, querying }) {
    return (
        <div className={styles.thread}>
            {messages.length === 0 && !querying && (
                <p className={styles.empty}>
                    Ask something below to see a response here.
                </p>
            )}

            {messages.map((message) => (
                <div
                    key={message.id}
                    className={`${styles.message} ${
                        message.role === "user"
                            ? styles.userMessage
                            : styles.assistantMessage
                    }`}
                >
                    <span className={styles.role}>
                        {message.role === "user" ? "You" : "LadyBug"}
                    </span>

                    {message.role === "assistant" ? (
                        <div className={styles.responseText}>
                            <ReactMarkdown>{message.content}</ReactMarkdown>
                        </div>
                    ) : (
                        <p className={styles.userText}>{message.content}</p>
                    )}

                    {message.elapsed && (
                        <p className={styles.meta}>
                            time elapsed: {message.elapsed}s
                        </p>
                    )}
                </div>
            ))}

            {querying && (
                <div
                    className={styles.loading}
                    role='status'
                    aria-live='polite'
                >
                    <span className={styles.loadingDot} />
                    <span className={styles.loadingDot} />
                    <span className={styles.loadingDot} />
                    <span className={styles.loadingLabel}>Querying model…</span>
                </div>
            )}
        </div>
    );
}
