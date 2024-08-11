import { Content, GoogleGenerativeAI, Part, } from "@google/generative-ai";

const GeminiService = (function () {
    const MODEL_NAME = "gemini-pro";
    const API_KEY = "AIzaSyC5HiXbUPCpUG8aIRJqbwlYomtnl6rb0aY";
    const genAI = new GoogleGenerativeAI(API_KEY);
    const service = {} as any;

    service.sendMessages = async function (message: string | Array<string | Part>, prevChat: Content[] | undefined) {
        const model = genAI.getGenerativeModel({ model: MODEL_NAME });
        const chat = model.startChat({
            history: prevChat,
        });
        const result = await chat.sendMessageStream(message);
        return result.stream
    }

    return service;
}());

export default GeminiService;