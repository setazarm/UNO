const devConfig={
    server: "http://localhost:8000",
    
}
const prodConfig={
    server:"https://uno-5dzs.onrender.com/"
}
export const config=process.env.NODE_ENV==="development"?devConfig:prodConfig;