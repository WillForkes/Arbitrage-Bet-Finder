import axios from 'axios';
import { useContext } from 'react';
import { Plan, User } from './types';
export const getter = (url: string) => axios.get(process.env.NEXT_PUBLIC_URI + url, {withCredentials: true}).then(res => res.data.data) 

async function sendApiRequest<T>(method: "GET" | "PUT" | "POST" | "DELETE" | "PATCH", path: string, withCredentials:boolean, data?: any, headers?: any): Promise<T> {
    path = `${process.env.NEXT_PUBLIC_URI}/${path}`;
    const response = await axios.request({method, baseURL: path, data, withCredentials:withCredentials, headers: headers});
    const success: boolean = response.data.status;
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

export async function spreadStake(id: number, stake: number): Promise<any> {
    return await sendApiRequest("GET", `calculator/spreadStake?betid=${id}&stake=${stake}`, true)
}

export async function hedgeStake(id: number, stake: number): Promise<any> {
    return await sendApiRequest("GET", `calculator/hedgeStake?betid=${id}&stake=${stake}`, true)
}

export async function createBet(id: number, stake: number): Promise<any> {
    return await sendApiRequest("POST", `tracker/new`, true, {betid: id, stake: stake})
}

export async function createPayment(plan: Plan, ref: string, trial: boolean = false, withBuyItNowDiscount: boolean = false): Promise<any> {
    return await sendApiRequest("POST", "payment/create?ref=" + ref, true, {plan: plan, trial: trial, withBuyItNowDiscount: withBuyItNowDiscount})
}

export async function createPaypalPayment(plan: Plan, trial: boolean = false, withBuyItNowDiscount: boolean = false): Promise<any> {
    return await sendApiRequest("POST", "payment/create-subscription", true, {plan: plan, trial: trial, withBuyItNowDiscount: withBuyItNowDiscount})
}

export async function deleteTrackedBet(betId: number): Promise<any> {
    return await sendApiRequest("DELETE", `tracker/${betId}`, true)
}

export async function createPortal(): Promise<any> {
    return await sendApiRequest("GET", "payment/portal", true)
}

export async function updateProfileA(region: string): Promise<any> {
    return await sendApiRequest("POST", "profile/update", true, {region: region})
}

export async function updateWhitelist(whiteList: [{value: string, label: string, disabled: boolean}]): Promise<any> {
    var x = whiteList.map((x) => x.label)
    return await sendApiRequest("POST", "profile/whitelist", true, {add: x})
}


export async function updateTrackerStatus(trackerId: number, status: number): Promise<any> {
    return await sendApiRequest("POST", "tracker/update", true, {trackerId: trackerId, status: status})
}

export async function startFreeTrial(): Promise<any> {
    return await sendApiRequest("POST", "profile/startTrial", true)
}

export async function simulateEVBet(id: number, bets: number): Promise<any> {
    return await sendApiRequest("POST", "scraper/ev/simulate", true, {betId: id, bets: bets})
}

export async function getOrderFromStripePaymentID(paymentId: string): Promise<any> {
    return await sendApiRequest("GET", `payment/${paymentId}`, true)
}

export async function updateNotificationsA(user: {
    email: boolean,
    emaila: string,
    sms: boolean,
    phone: string,
  }): Promise<any> {
    return await sendApiRequest("POST", "profile/update", true, {smsNotifications: user.sms, emailNotifications: user.email, phone: user.phone, email: user.emaila})
}


