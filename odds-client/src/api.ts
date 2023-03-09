import axios from 'axios';
export const getter = (url: string) => axios.get(process.env.NEXT_PUBLIC_URI + url, {withCredentials: true}).then(res => res.data.data) 

async function sendApiRequest<T>(method: "GET" | "PUT" | "POST" | "DELETE" | "PATCH", path: string, withCredentials:boolean, data?: any, headers?: any): Promise<T> {
    path = `${process.env.NEXT_PUBLIC_URI}/${path}`;
    const response = await axios.request({method, baseURL: path, data, withCredentials:withCredentials, headers: headers});
    const success: boolean = response.data.status;
    console.log(success)
    if (success) {
        return response.data.data as T;
    } else {
        if (response.data.error) {
            throw new Error(response.data.error);
        } else {
            throw new Error(`Received error code from server: ${response.status}`);
        }
    }
}

export async function getScrapes(): Promise<any> {
    return await sendApiRequest("GET", "scraper/all", true)
}