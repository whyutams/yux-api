import axios from "axios";
import general from "../../data/general.json" with { type: "json" };

/**
 * Fetch raw html
 */
export async function fetchHtml(url: string, sourceUrl?: string): Promise<string | null> {
    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': general.user_agents[0] as string,
                'Accept': 'application/json, text/javascript, */*; q=0.01',
                'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
                'Referer': sourceUrl ? sourceUrl + '/' : url + '/',
                'Origin': sourceUrl ? sourceUrl : url,
                'X-Requested-With': 'XMLHttpRequest',
                'Connection': 'keep-alive',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'cross-site'
            }
        });
        return response.data;
    } catch (error) {
        return null;
    }
}