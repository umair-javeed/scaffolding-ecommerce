'use client';

export default function PurchasePage() {
  const whatsappNumber = "+923224867978"; // Replace with your WhatsApp number
  const yourName = "Javed Scaffolding";
  
  const handleContactWhatsApp = () => {
    const message = `Hello ${yourName},\n\nI am interested in supplying scaffolding materials to your business.\n\nI can provide:\n- Iron Pipes\n- Clamps\n- Scaffolding Ladders\n- Other Accessories\n\nPlease let me know your requirements.\n\nThank you!`;
    
    const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary-600 mb-4">
              We're Purchasing Scaffolding Materials
            </h1>
            <p className="text-xl text-gray-600">
              Suppliers Welcome - Contact Us on WhatsApp
            </p>
          </div>

          <div className="mb-8">
            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                📋 What We're Looking For
              </h2>
              <div className="text-gray-700 leading-relaxed space-y-3">
                <p>
                  We are actively seeking <strong>new and used scaffolding materials</strong> for our construction, 
                  renovation, and maintenance projects. We require high-quality products that provide safe and 
                  reliable support for elevated work platforms.
                </p>
                
                <div className="mt-6">
                  <h3 className="font-bold text-lg mb-3">Materials We Purchase:</h3>
                  <ul className="space-y-2 ml-4">
                    <li className="flex items-start">
                      <span className="text-primary-600 mr-3 text-xl">•</span>
                      <span><strong>Iron Pipes</strong> - MS pipes, GI pipes, scaffolding tubes (all sizes)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary-600 mr-3 text-xl">•</span>
                      <span><strong>Clamps & Couplers</strong> - Fixed clamps, swivel clamps, putlog couplers</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary-600 mr-3 text-xl">•</span>
                      <span><strong>Scaffolding Ladders</strong> - Step ladders, mobile ladders, frame scaffolds</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary-600 mr-3 text-xl">•</span>
                      <span><strong>Related Accessories</strong> - Base plates, adjustable jacks, planks, safety equipment</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-green-800">
                    <strong>✓ New Materials:</strong> We purchase brand new scaffolding equipment in bulk quantities.
                  </p>
                  <p className="text-green-800 mt-2">
                    <strong>✓ Used Materials:</strong> We also buy good-condition used scaffolding materials at competitive prices.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-600 p-6 rounded-lg mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                🤝 Why Supply to Us?
              </h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-yellow-600 mr-3 text-2xl">✓</span>
                  <span><strong>Bulk Orders:</strong> We place large volume orders regularly</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-600 mr-3 text-2xl">✓</span>
                  <span><strong>Quick Payments:</strong> Fast and reliable payment processing</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-600 mr-3 text-2xl">✓</span>
                  <span><strong>Long-term Partnership:</strong> Build a lasting business relationship</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-600 mr-3 text-2xl">✓</span>
                  <span><strong>Fair Pricing:</strong> We offer competitive market rates</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 border-l-4 border-gray-600 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                📞 How to Contact Us
              </h2>
              <p className="text-gray-700 mb-4">
                If you are a supplier or have scaffolding materials to sell, please contact us directly on WhatsApp. 
                Share your product details, pricing, and availability, and we'll get back to you promptly.
              </p>
              <p className="text-gray-600 italic">
                Please include: Product specifications, quantities available, pricing, and delivery options.
              </p>
            </div>
          </div>

          <div className="text-center mt-8">
            <button
              onClick={handleContactWhatsApp}
              className="inline-flex items-center gap-3 bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition font-bold text-lg shadow-lg"
            >
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Contact Us on WhatsApp
            </button>
            
            <p className="text-gray-600 mt-4">
              Tap the button above to send us a message on WhatsApp
            </p>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-600">
            <p className="text-sm">
              <strong>Note:</strong> We welcome both wholesale suppliers and individuals with scaffolding materials to sell. 
              Competitive pricing and genuine materials preferred.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}