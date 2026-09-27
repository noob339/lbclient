import { useState } from "react";
import styles from "./HistorySideBar.module.css";

const demo = [
    "Getting LadyBug running",
    "Improving the React interface",
    "README and contributing",
];

export default function HistorySideBar() {
    const [activeThread, setActiveThread] = useState(0);

    return (
        <aside className={styles.sidebar}>
            <div className={styles.header}>
                <span className={styles.title}>Chats</span>

                <button
                    type='button'
                    className={styles.newChatButton}
                    title='New chats are coming soon'
                    aria-label='Start a new chat'
                >
                    +
                </button>
            </div>

            <nav className={styles.history} aria-label='Chat history'>
                {demo.map((thread, index) => (
                    <button
                        key={thread}
                        type='button'
                        className={`${styles.threadButton} ${
                            index === activeThread ? styles.active : ""
                        }`}
                        onClick={() => setActiveThread(index)}
                        aria-current={
                            index === activeThread ? "page" : undefined
                        }
                    >
                        {thread}
                    </button>
                ))}
            </nav>

            <p className={styles.demoLabel}>Demo history</p>
        </aside>
    );
}
