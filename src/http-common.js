import axios from "axios";

export default axios.create({
    baseURL: "https://ap-southeast-2.aws.data.mongodb-api.com/app/application-0-rlnsp/endpoint",
    headers: {
        "Content-Type": "application/json"
    }
})