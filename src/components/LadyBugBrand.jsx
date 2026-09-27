import styles from "./LadyBugBrand.module.css";

export default function LadyBugBrand() {
    
    return (
        <header className={styles.brand}>
            <svg
                viewBox='0 0 32 32'
                className={styles.spotIcon}
                aria-hidden='true'
            >
                <circle cx='16' cy='16' r='13' className={styles.body} />

                <line
                    x1='16'
                    y1='4'
                    x2='16'
                    y2='28'
                    className={styles.divider}
                />

                <circle cx='11' cy='12' r='2.1' className={styles.spot} />
                <circle cx='21' cy='12' r='2.1' className={styles.spot} />
                <circle cx='11' cy='21' r='2.1' className={styles.spot} />
                <circle cx='21' cy='21' r='2.1' className={styles.spot} />
            </svg>

            <h1 className={styles.wordmark}>
                Lady<span className={styles.wordmarkAccent}>Bug</span>
            </h1>
        </header>
    );
}
