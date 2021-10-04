declare module 'use-react-screenshot' {
    export function useScreenshot(): [any, (node: HTMLElement) => Promise<string | void>];
}