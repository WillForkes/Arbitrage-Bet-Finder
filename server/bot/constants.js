const BASE_URL = "https://api.the-odds-api.com/v4"
const API_KEY = "87ee5d2e1aed5bcbc1949dba1f855d92" // $100/month superstar plan (4.5m requests)
const DEMO = (process.env.NODE_ENV == "development") ? true : false
module.exports = { BASE_URL, API_KEY, DEMO}
