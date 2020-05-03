declare module '*.txt' {
  const content: string;
  export default content;
}
declare module '*.jpg' {
  const content: string;
  export default content;
}
declare module '*.png' {
  const content: string;
  export default content;
}
declare module '*.gif' {
  const content: string;
  export default content;
}
declare module '*.svg' {
  const content: { id: string, content: string };
  export default content;
}
// Some do it the other way around.
declare module '*.json' {
  const value: any;
  export default value;
}
declare module '*.less' {
  const styles: any;
  export default styles;
}

