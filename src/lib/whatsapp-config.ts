// lib/whatsapp-config.ts
// Centralized WhatsApp Business configuration

export const whatsappConfig = {
  // YOUR WHATSAPP NUMBER
  // Format: Country code + number (no + or spaces)
  // Example: US number +1 (234) 567-8900 becomes: 12345678900
  phoneNumber: '12345678900', // ⚠️ REPLACE WITH YOUR ACTUAL NUMBER
  
  // BUSINESS INFORMATION
  businessName: 'Javed Scaffolding Pipe Store',
  businessEmail: 'support@javedscaffolding.com',
  businessHours: 'Monday - Saturday: 8:00 AM - 6:00 PM',
  
  // PRE-FILLED MESSAGES
  messages: {
    general: 'Hi! I have a question about your scaffolding products.',
    product: (productName: string) => {
      return `Hi! I'm interested in: ${productName}. Can you provide more details?`;
    },
    quote: 'Hi! I would like to request a quote for scaffolding materials.',
    support: 'Hi! I need help with my order.',
    bulk: 'Hi! I am interested in bulk pricing for scaffolding materials.',
  },
  
  // BUTTON SETTINGS
  floatingButton: {
    position: 'bottom-right' as const,
    enabled: true,
  },
};

// Helper function to generate WhatsApp URL
export function getWhatsAppUrl(message?: string): string {
  const text = message || whatsappConfig.messages.general;
  return `https://wa.me/${whatsappConfig.phoneNumber}?text=${encodeURIComponent(text)}`;
}

// Helper function to format phone number for display
export function formatPhoneNumber(phoneNumber: string): string {
  // Assuming US format: +1 (234) 567-8900
  if (phoneNumber.length === 11 && phoneNumber.startsWith('1')) {
    const areaCode = phoneNumber.slice(1, 4);
    const firstPart = phoneNumber.slice(4, 7);
    const secondPart = phoneNumber.slice(7);
    return `+1 (${areaCode}) ${firstPart}-${secondPart}`;
  }
  return phoneNumber;
}