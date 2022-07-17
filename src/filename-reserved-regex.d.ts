declare module 'filename-reserved-regex' {
  let filenameReservedRegex: () => RegExp
  let windowsReservedNameRegex: () => RegExp
  export default filenameReservedRegex
  export { windowsReservedNameRegex }
}
