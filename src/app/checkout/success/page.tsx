const createOrderAfterPayment = async (sessionId: string) => {
  try {
    console.log('=== RETRIEVING STRIPE SESSION ===');
    console.log('Session ID:', sessionId);

    // Retrieve the Stripe session to get order data from metadata
    const sessionResponse = await fetch(`/api/stripe/get-session?session_id=${sessionId}`);
    
    if (!sessionResponse.ok) {
      const errorData = await sessionResponse.json();
      throw new Error(errorData.error || 'Failed to retrieve payment session');
    }

    const sessionData = await sessionResponse.json();
    console.log('=== SESSION DATA FROM STRIPE ===');
    console.log(sessionData);

    // Parse metadata
    const items = JSON.parse(sessionData.metadata.items);
    const shippingAddress = JSON.parse(sessionData.metadata.shippingAddress);
    const customerEmail = sessionData.metadata.customerEmail;

    console.log('=== PARSED METADATA ===');
    console.log('Items:', items);
    console.log('Email:', customerEmail);
    console.log('Shipping:', shippingAddress);

    // Calculate total from items
    const totalAmount = items.reduce((sum: number, item: any) => {
      return sum + (item.weight * item.pricePerUnit);
    }, 0);

    console.log('=== CALCULATED TOTAL ===', totalAmount);

    // Create the order object
    const order = {
      customerEmail: customerEmail,
      items: items.map((item: any) => ({
        id: item.id,
        name: item.name,
        weight: parseFloat(item.weight),
        unit: item.unit,
        pricePerUnit: parseFloat(item.pricePerUnit)
      })),
      totalAmount: parseFloat(totalAmount.toFixed(2)),
      shippingAddress: shippingAddress,
      paymentInfo: {
        stripeSessionId: sessionId,
        paymentStatus: 'paid',
        paymentMethod: 'card',
        paidAt: Date.now()
      }
    };

    console.log('=== ORDER TO BE SENT TO API ===');
    console.log(JSON.stringify(order, null, 2));

    // Create the order via API
    const response = await createOrder(order);

    console.log('=== API RESPONSE ===');
    console.log(response);

    // Check if order was created successfully
    if (response.orderId) {
      setOrderId(response.orderId);
      // Clear localStorage after successful order creation
      localStorage.removeItem('cart');
      localStorage.removeItem('checkoutData');
      console.log('✅ Order created successfully!');
    } else {
      console.error('❌ No orderId in response');
      setError(response.error || response.message || 'Failed to create order');
    }
  } catch (err: any) {
    console.error('=== ERROR CREATING ORDER ===');
    console.error('Error:', err);
    console.error('Message:', err.message);
    setError(err.message || 'Error creating order');
  } finally {
    setLoading(false);
  }
};