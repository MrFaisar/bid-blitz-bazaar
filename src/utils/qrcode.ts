
export function generateSessionCode(length: number = 6): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  
  return result;
}

export function generateOnlineShareLink(sessionId: string): string {
  // In a real app, this would generate a shareable link to join the session
  const baseUrl = window.location.origin;
  return `${baseUrl}/join?session=${sessionId}`;
}

// This would be used with a QR code library in a real implementation
export function getQRCodeData(sessionId: string): string {
  // For now, we'll just return the session URL which would be encoded into a QR code
  const data = {
    type: 'bid-blitz-session',
    sessionId,
    timestamp: Date.now()
  };
  
  return JSON.stringify(data);
}
