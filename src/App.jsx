import { useRef, useState } from "react";
import ThreadBox from "./components/ThreadBox";
import PromptBox from "./components/PromptBox";
import styles from "./App.module.css";
import LadyBugBrand from "./components/LadyBugBrand";
import HistorySideBar from "./components/HistorySideBar";

export default function App() {
    const [prompt, setPrompt] = useState("");
    const [messages, setMessages] = useState([]);
    const [querying, setQuerying] = useState(false);
    const abortRef = useRef(null);

    const handleSubmit = () => {
        const submittedPrompt = prompt.trim();

        if (querying || !submittedPrompt) return;

        setPrompt("");
        setQuerying(true);

        setMessages((currentMessages) => [
            ...currentMessages,
            {
                id: crypto.randomUUID(),
                role: "user",
                content: submittedPrompt,
            },
        ]);

        const start = Date.now();
        const controller = new AbortController();
        abortRef.current = controller;

        fetch(`/query?prompt=${encodeURIComponent(submittedPrompt)}`, {
            signal: controller.signal,
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`Server returned ${res.status}`);
                }

                return res.text();
            })
            .then((modelOutput) => {
                const elapsed = ((Date.now() - start) / 1000).toFixed(2);
                setMessages((currentMessages) => [
                    ...currentMessages,
                    {
                        id: crypto.randomUUID(),
                        role: "assistant",
                        content: modelOutput,
                        elapsed,
                    },
                ]);
            })
            .catch((err) => {
                if (err.name !== "AbortError") {
                    console.error("Error:", err);
                    setMessages((currentMessages) => [
                        ...currentMessages,
                        {
                            id: crypto.randomUUID(),
                            role: "assistant",
                            content:
                                "Could not reach the model. Check that the server is running and try again.",
                        },
                    ]);
                }
            })
            .finally(() => {
                setQuerying(false);
                abortRef.current = null;
            });
    };

    const handleHalt = () => {
        abortRef.current?.abort();
    };

    return (
        <div className={styles.app}>
            <HistorySideBar />
            <main className={styles.main}>
                <LadyBugBrand />
                <ThreadBox messages={messages} querying={querying} />

                <PromptBox
                    prompt={prompt}
                    setPrompt={setPrompt}
                    onSubmit={handleSubmit}
                    onHalt={handleHalt}
                    querying={querying}
                />
            </main>
        </div>
    );
}
