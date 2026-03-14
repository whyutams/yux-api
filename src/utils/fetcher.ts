import axios from "axios";
import general from "../../data/general.json" with { type: "json" };

/**
 * Fetch raw html
 */
export async function fetchHtml(url: string): Promise<string | null> {
    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': general.user_agents[0] as string,
            }
        });
        return response.data;
    } catch (error) {
        return null;
    }
}