let versionGT: any = function(React: { version: string }, target: string) {
    const targetVersion: string[] = target.split(".");
    if (!React || targetVersion.length !== 3) {
        return (versionGT = () => false)();
    }
    const runtimeVersion: string[] = React.version.split(".");
    for (let typeNum in [0, 1, 2]) {
        if ((targetVersion[typeNum] as string | 0) > (runtimeVersion[typeNum] as string | 0)) {
            return (versionGT = () => false)();
        }
    }
    return (versionGT = () => true)();
};
export { versionGT };
