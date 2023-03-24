import { TrackedBet, Tracker } from "./types";
import Logo from "/public/arbster.png";


var oneDay: number = 1000 * 60 * 60 * 24;

function getMidnight(day: Date){
    const date = new Date(day);
    date.setMilliseconds(999);
    date.setSeconds(59);
    date.setMinutes(59);
    date.setHours(23);
    return date;
}
  

function isTomorrow(date: Date): boolean {
    const midnightTonight = getMidnight(new Date());
  const midnightTomorrow = new Date(midnightTonight.getTime() + oneDay);

  return date > midnightTonight && date < midnightTomorrow;
}

function isToday(date: Date) {
    return (new Date().toDateString() == date.toDateString());
}

export function dateFormat(date: number): string {
    var d: Date = new Date(date *1000)
    if (isTomorrow(d)) {
        return 'Tomorrow at ' + d.toLocaleTimeString([], {timeStyle: "short"}); 
    } else if (isToday(d)) {
        return 'Today at ' + d.toLocaleTimeString([], {timeStyle: "short"})
    } else {
        return d.toLocaleString([], { dateStyle: "long", timeStyle: 'short' });
    }
}

export function currencyCode(code: string, europe: boolean): string {
    if (europe) {
        return '€'
    }

    switch (code) {
        case 'US':
            return '$'
        case 'UK':
            return '£'
        default:
            return '$'
    }
}

export function getBookmakerLogo(bookmaker: string): string {
    //const url = "https://www.top100bookmakers.com/buttons/" + bookmaker.toLowerCase().replace(/ /g, '-') + '-button.png';
    let bookie = bookmaker.toLowerCase()
    bookie = bookie.replace(/\(.*?\)/g, '')
    bookie = bookie.replace(" sportsbook", "")

    let url

    switch (bookie) {
        case 'sky bet':
            url = "https://marcommnews.com/wp-content/uploads/2017/06/skybet-logo-300x300.png"
            break;
        case '1xbet':
            url = "https://d1yjjnpx0p53s8.cloudfront.net/styles/logo-thumbnail/s3/072018/untitled-1_141.png?w0G_SAqF3m2_KjvfAH2qw1T9eJoF63Dy&itok=LJRdCj8Z"
            break;
        case 'virgin bet':
            url = "https://www.betopin.com/wp-content/uploads/2020/11/Virgin-Bet-Logo.jpg"
            break;
        case 'marathon bet':
            url = "https://is1-ssl.mzstatic.com/image/thumb/Purple115/v4/dd/b0/a4/ddb0a469-53d6-7ba9-b433-5e97dcac3c9b/source/512x512bb.jpg"
            break;
        case 'livescore bet':
            url = "https://pbs.twimg.com/profile_images/1542057636857872384/Dq-nBCwZ_400x400.jpg"
            break;
        case 'nordic bet':
            url = "https://www.onlinecasinoreports.com/images/nordicbet234.png"
            break;
        case 'matchbook':
            url = "https://media.squawka.com/images/en/2022/05/17141643/1262572_1262572_matchbook-logo1.png"
        case 'boylesports':
            url = "https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,f_auto,q_auto:eco,dpr_1/v1452590072/enaew913algybfl7sada.png"
            break;
        case 'mybookie.ag':
            url = "https://sportsbetting.legal/wp-content/uploads/2020/07/MB-icon.jpg"
            break
        case 'paddy power':
            bookie = "paddy_power"
        default:
            bookie = bookie.replace(/ /g, '')
            url = "https://storage.googleapis.com/oddsjam-static-assets/sportsbook-logos/" + bookie +".jpg"
    } 
    
    return url
}

export function transformChartData(data: TrackedBet[]) {
    const allTimeProfits: number[] = [];
    const monthlyProfits: number[] = [];
    const yearlyProfits: number[] = [];
    const monthlyDates: Date[] = [];
    const yearlyDates: Date[] = [];
    const allTimeDates: Date[] = [];
    const today = new Date();
  
    data.forEach((bet) => {
      const betDate = new Date(bet.createdAt);
      const betProfit = bet.profitPercentage * bet.totalStake;
      
      // all time profits
      allTimeProfits.push(betProfit);
      allTimeDates.push(betDate);
      
      // monthly profits
      if (betDate.getFullYear() === today.getFullYear() &&
          betDate.getMonth() === today.getMonth()) {
        monthlyProfits.push(betProfit);
        monthlyDates.push(betDate)
      }
      
      // yearly profits
      if (betDate.getFullYear() === today.getFullYear()) {
        yearlyProfits.push(betProfit);
        yearlyDates.push(betDate);
      }
    });
    
    return {
      allTimeProfits,
      monthlyProfits,
      yearlyProfits,
      allTimeDates,
      monthlyDates,
      yearlyDates,
    };
}

export function filterRegion(region: string, data: any) {
    return data.filter(d => d.data.region == region.toLowerCase())
}
  