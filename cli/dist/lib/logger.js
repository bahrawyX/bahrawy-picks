import pc from 'picocolors';
export const log = {
    info(msg) {
        console.log(pc.cyan(msg));
    },
    success(msg) {
        console.log(pc.green(msg));
    },
    warn(msg) {
        console.log(pc.yellow(msg));
    },
    error(msg) {
        console.error(pc.red(msg));
    },
    dim(msg) {
        console.log(pc.dim(msg));
    },
    bold(msg) {
        console.log(pc.bold(msg));
    },
    /** Print a labelled key-value pair */
    kv(label, value) {
        console.log(`  ${pc.dim(label)} ${value}`);
    },
};
//# sourceMappingURL=logger.js.map