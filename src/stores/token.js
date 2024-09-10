import axios from "axios";

function set_token(new_token) {
    localStorage.twitch_token = new_token
}

function get_token() {
    return localStorage.twitch_token
}

async function is_token_valid() {
    try {
        await axios.get("https://id.twitch.tv/oauth2/validate", {
            headers: {
                'Authorization': `Bearer ${get_token()}`
            }
        })
        return true
    } catch (error) {
        return false
    }
}

export {set_token, get_token, is_token_valid}