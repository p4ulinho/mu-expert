export class Logger {
    static info(category: string, message: string) {
        console.log(`[${category}] ${message}`);
    }

    static error(category: string, message: string) {
        console.error(`[${category}] ${message}`);
    }

    static success(category: string, message: string) {
        console.log(`[${category}] ✅ ${message}`);
    }

    static warn(category: string, message: string) {
        console.warn(`[${category}] ⚠️ ${message}`);
    }

    static log(category: string, message: string) {
        console.log(`[${category}] ${message}`);
    }

    static header(message: string) {
        console.log(`\n=== ${message} ===\n`);
    }
}
