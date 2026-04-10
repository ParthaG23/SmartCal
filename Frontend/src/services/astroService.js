/**
 * Astrology Service
 * Communicates with astrology-api.io (v3)
 */

const API_KEY = import.meta.env.VITE_ASTRO_API_KEY;

/**
 * Common fetch wrapper for Astrology API v3
 * @param {string} endpoint 
 * @param {object} data 
 */
async function callAstroApi(endpoint, data = {}, method = 'POST') {
    if (!API_KEY || API_KEY === "your_key_here") {
        console.warn("Astrology API key missing. Falling back to local calculation.");
        return null;
    }

    try {
        const url = `https://api.astrology-api.io/api/v3${endpoint}`;
        const options = {
            method,
            headers: {
                'X-Api-Key': API_KEY,
                'Content-Type': 'application/json'
            }
        };

        if (method === 'POST') {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(url, options);

        if (!response.ok) {
            let err = {};
            try { err = await response.json(); } catch(e) {}
            throw new Error(err.message || `API Error ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.warn("Astro API Fallback Triggered:", error.message || error);
        return null;
    }
}

/**
 * Fetch planetary positions (to find Sun Sign accurately)
 */
export async function getPlanetaryPositions(day, month, year, hour = 12, min = 0, lat = 28.6, lon = 77.2) {
    const raw = await callAstroApi("/data/positions", {
        subject: {
            birth_data: { year, month, day, hour, min, latitude: lat, longitude: lon }
        }
    });

    if (raw?.success && raw?.data?.positions) {
        const sMap = { ari: "Aries", tau: "Taurus", gem: "Gemini", can: "Cancer", leo: "Leo", vir: "Virgo", lib: "Libra", sco: "Scorpio", sag: "Sagittarius", cap: "Capricorn", aqu: "Aquarius", pis: "Pisces" };
        
        const mappedData = raw.data.positions.map(p => {
           let fullSign = p.sign;
           if (p.sign) {
               fullSign = sMap[p.sign.toLowerCase().substring(0,3)] || p.sign;
           }
           return { ...p, sign: fullSign, full_degree: p.degree || p.absolute_longitude };
        });
        
        return { data: mappedData };
    }
    
    return raw;
}

/**
 * Fetch a lucky prediction / sun sign summary if available
 * Note: Endpoints vary by API version.
 */
export async function getZodiacSummary(sunSign) {
    // This is a placeholder as v3 Focuses on raw data. 
    // We will extract the sign from positions usually.
    return { sign: sunSign };
}
