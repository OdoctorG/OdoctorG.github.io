import {AuthResponse} from "./CallbackPage";

export class AppData {
  static getSessionId(): string {
    let sessionId = getCookie('sessionId');

    if (!sessionId) {
      sessionId = generateRandomHex(32);
      setCookie('sessionId', sessionId);
    }

    return sessionId;
  }

  static setAccessToken(token: string): void {
    setCookie('access_token', token)
  }

  static getAccessToken(): AuthResponse | null {
    let cookie = getCookie('access_token')
    if (cookie == null){
      return null
    }
    return JSON.parse(cookie)
    //return getCookie('access_token') // This should probably check if the token is valid first. And if it soon expires automatically fetch a new token.
  }

  static setLocal(name: string, value: string): void {
    window.localStorage.setItem(name, value)
  }
  
  static getLocal(name: string): string | null {
    return window.localStorage.getItem(name)
  }

}

// Utility function to generate random hex string
function generateRandomHex(size: number): string {
  const array = new Uint8Array(size);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Utility function to get a cookie value by name
function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
}

// Utility function to set a cookie value
function setCookie(name: string, value: string): void {
  document.cookie = `${name}=${value}; path=/`;
}

