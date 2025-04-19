import React, { useState } from 'react';
import styled from 'styled-components';

const StoreContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const StoreHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  color: #4CAF50;
  margin: 0;
`;

const CartSummary = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 15px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const CartIcon = styled.div`
  font-size: 20px;
`;

const CartCount = styled.span`
  background-color: #4CAF50;
  color: white;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  margin-left: 5px;
`;

const CartTotal = styled.span`
  font-weight: bold;
  margin-left: 10px;
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const ProductCard = styled.div`
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const ProductImage = styled.div`
  height: 160px;
  background-color: #f0f8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4CAF50;
  font-size: 40px;
`;

const ProductDetails = styled.div`
  padding: 15px;
`;

const ProductName = styled.h3`
  margin: 0 0 10px 0;
  color: #333;
  font-size: 16px;
`;

const ProductDescription = styled.p`
  margin: 0 0 15px 0;
  color: #666;
  font-size: 14px;
  line-height: 1.4;
`;

const ProductFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Price = styled.span`
  font-weight: bold;
  color: #333;
  font-size: 18px;
`;

const AddToCartButton = styled.button`
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: #3e8e41;
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const CartSection = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const CartTitle = styled.h3`
  margin: 0 0 15px 0;
  color: #333;
`;

const CartList = styled.div`
  margin-bottom: 20px;
`;

const CartItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
  }
`;

const ItemDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const ItemName = styled.span`
  font-weight: bold;
  margin-bottom: 5px;
`;

const ItemPrice = styled.span`
  color: #666;
  font-size: 14px;
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const QuantityButton = styled.button`
  width: 25px;
  height: 25px;
  border-radius: 50%;
  border: 1px solid #ddd;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  
  &:hover {
    background-color: #f1f1f1;
  }
`;

const Quantity = styled.span`
  font-weight: bold;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #ff5252;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    text-decoration: underline;
  }
`;

const CheckoutSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
`;

const TotalPrice = styled.div`
  font-size: 18px;
  font-weight: bold;
`;

const CheckoutButton = styled.button`
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: #3e8e41;
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const EmptyCartMessage = styled.p`
  color: #666;
  font-style: italic;
  text-align: center;
  margin: 20px 0;
`;

const BackToChatButton = styled.button`
  background: none;
  border: none;
  color: #4CAF50;
  text-decoration: underline;
  cursor: pointer;
  padding: 5px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 5px;
  
  &:hover {
    color: #3e8e41;
  }
`;

const SuccessMessage = styled.div`
  padding: 20px;
  background-color: #e8f5e9;
  border-radius: 8px;
  margin-bottom: 20px;
  text-align: center;
  
  h3 {
    color: #4CAF50;
    margin-top: 0;
  }
  
  p {
    margin-bottom: 0;
    color: #333;
  }
`;

const PaymentForm = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  margin-top: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const FormTitle = styled.h3`
  margin: 0 0 20px 0;
  color: #333;
`;

const FormRow = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  
  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const FormGroup = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 14px;
  margin-bottom: 5px;
  color: #555;
`;

const Input = styled.input`
  padding: 10px;
  border: 1px solid ${props => props.error ? '#ff5252' : '#ddd'};
  border-radius: 4px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #4CAF50;
  }
`;

const ErrorMessage = styled.span`
  color: #ff5252;
  font-size: 12px;
  margin-top: 5px;
`;

const SubmitButton = styled.button`
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 12px 20px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 10px;
  width: 100%;
  transition: all 0.2s;
  
  &:hover {
    background-color: #3e8e41;
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const MedicineStore = ({ medications, onBackToChat }) => {
  const [cart, setCart] = useState([]);
  const [notification, setNotification] = useState(null);
  const [checkout, setCheckout] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState({
    name: '',
    email: '',
    address: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  const [orderComplete, setOrderComplete] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  
  const addToCart = (medication) => {
    const existingItemIndex = cart.findIndex(item => item.id === medication.id);
    
    if (existingItemIndex >= 0) {
      // Increase quantity if already in cart
      const updatedCart = [...cart];
      updatedCart[existingItemIndex] = {
        ...updatedCart[existingItemIndex],
        quantity: updatedCart[existingItemIndex].quantity + 1
      };
      setCart(updatedCart);
    } else {
      // Add new item to cart
      setCart([...cart, { ...medication, quantity: 1 }]);
    }
  };
  
  const removeFromCart = (medicationId) => {
    setCart(cart.filter(item => item.id !== medicationId));
  };
  
  const updateQuantity = (medicationId, change) => {
    const updatedCart = cart.map(item => {
      if (item.id === medicationId) {
        const newQuantity = item.quantity + change;
        if (newQuantity < 1) return item; // Prevent quantity less than 1
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    
    setCart(updatedCart);
  };
  
  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };
  
  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  const handleCheckout = () => {
    setCheckout(true);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Format card number with spaces for readability
    if (name === 'cardNumber') {
      const formattedValue = value
        .replace(/\s/g, '')
        .replace(/[^0-9]/g, '')
        .substring(0, 16)
        .replace(/(.{4})/g, '$1 ')
        .trim();
      
      setPaymentInfo(prev => ({ ...prev, [name]: formattedValue }));
    } 
    // Format CVV to allow only numbers
    else if (name === 'cvv') {
      const formattedValue = value
        .replace(/[^0-9]/g, '')
        .substring(0, 4);
      
      setPaymentInfo(prev => ({ ...prev, [name]: formattedValue }));
    } 
    // Format expiry date to MM/YY format
    else if (name === 'expiryDate') {
      let formattedValue = value.replace(/[^0-9]/g, '');
      
      if (formattedValue.length > 0) {
        // Add a slash after the month for MM/YY format
        if (formattedValue.length <= 2) {
          formattedValue = formattedValue;
        } else {
          formattedValue = `${formattedValue.substring(0, 2)}/${formattedValue.substring(2, 4)}`;
        }
      }
      
      setPaymentInfo(prev => ({ ...prev, [name]: formattedValue }));
    } 
    // Handle other fields normally
    else {
      setPaymentInfo(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!paymentInfo.name.trim()) errors.name = 'Name is required';
    if (!paymentInfo.email.trim()) errors.email = 'Email is required';
    if (!paymentInfo.address.trim()) errors.address = 'Address is required';
    if (!paymentInfo.cardNumber || paymentInfo.cardNumber.replace(/\s/g, '').length < 16) 
      errors.cardNumber = 'Valid card number is required';
    if (!paymentInfo.expiryDate || paymentInfo.expiryDate.length < 5) 
      errors.expiryDate = 'Valid expiry date is required';
    if (!paymentInfo.cvv || paymentInfo.cvv.length < 3) 
      errors.cvv = 'Valid CVV is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmitPayment = () => {
    if (validateForm()) {
      // In a real application, this would connect to a payment processor
      setOrderComplete(true);
      // Clear the cart after successful checkout
      setCart([]);
      setCheckout(false);
    }
  };
  
  return (
    <StoreContainer>
      <BackToChatButton onClick={onBackToChat}>
        ← Back to Chat
      </BackToChatButton>
      
      {orderComplete && (
        <SuccessMessage>
          <h3>Order Completed Successfully!</h3>
          <p>Thank you for your purchase. Your medications will be shipped soon.</p>
        </SuccessMessage>
      )}
      
      <StoreHeader>
        <Title>PetCarePal Medicine Store</Title>
        <CartSummary>
          <CartIcon>🛒</CartIcon>
          <CartCount>{getTotalItems()}</CartCount>
          <CartTotal>${getTotalPrice().toFixed(2)}</CartTotal>
        </CartSummary>
      </StoreHeader>
      
      {checkout ? (
        <PaymentForm>
          <FormTitle>Payment Information</FormTitle>
          
          <FormRow>
            <FormGroup>
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name"
                name="name"
                value={paymentInfo.name}
                onChange={handleInputChange}
                error={formErrors.name}
              />
              {formErrors.name && <ErrorMessage>{formErrors.name}</ErrorMessage>}
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                name="email"
                type="email"
                value={paymentInfo.email}
                onChange={handleInputChange}
                error={formErrors.email}
              />
              {formErrors.email && <ErrorMessage>{formErrors.email}</ErrorMessage>}
            </FormGroup>
          </FormRow>
          
          <FormGroup>
            <Label htmlFor="address">Shipping Address</Label>
            <Input 
              id="address"
              name="address"
              value={paymentInfo.address}
              onChange={handleInputChange}
              error={formErrors.address}
            />
            {formErrors.address && <ErrorMessage>{formErrors.address}</ErrorMessage>}
          </FormGroup>
          
          <FormRow>
            <FormGroup>
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input 
                id="cardNumber"
                name="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={paymentInfo.cardNumber}
                onChange={handleInputChange}
                error={formErrors.cardNumber}
              />
              {formErrors.cardNumber && <ErrorMessage>{formErrors.cardNumber}</ErrorMessage>}
            </FormGroup>
          </FormRow>
          
          <FormRow>
            <FormGroup>
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input 
                id="expiryDate"
                name="expiryDate"
                placeholder="MM/YY"
                value={paymentInfo.expiryDate}
                onChange={handleInputChange}
                error={formErrors.expiryDate}
              />
              {formErrors.expiryDate && <ErrorMessage>{formErrors.expiryDate}</ErrorMessage>}
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="cvv">CVV</Label>
              <Input 
                id="cvv"
                name="cvv"
                placeholder="123"
                value={paymentInfo.cvv}
                onChange={handleInputChange}
                error={formErrors.cvv}
              />
              {formErrors.cvv && <ErrorMessage>{formErrors.cvv}</ErrorMessage>}
            </FormGroup>
          </FormRow>
          
          <SubmitButton onClick={handleSubmitPayment}>
            Complete Purchase
          </SubmitButton>
        </PaymentForm>
      ) : (
        <>
          <ProductsGrid>
            {medications.map(medication => (
              <ProductCard key={medication.id}>
                <ProductImage>💊</ProductImage>
                <ProductDetails>
                  <ProductName>{medication.name}</ProductName>
                  <ProductDescription>{medication.description}</ProductDescription>
                  <ProductFooter>
                    <Price>${medication.price.toFixed(2)}</Price>
                    <AddToCartButton onClick={() => addToCart(medication)}>
                      Add to Cart
                    </AddToCartButton>
                  </ProductFooter>
                </ProductDetails>
              </ProductCard>
            ))}
          </ProductsGrid>
          
          <CartSection>
            <CartTitle>Your Cart</CartTitle>
            
            {cart.length === 0 ? (
              <EmptyCartMessage>Your cart is empty</EmptyCartMessage>
            ) : (
              <>
                <CartList>
                  {cart.map(item => (
                    <CartItem key={item.id}>
                      <ItemDetails>
                        <ItemName>{item.name}</ItemName>
                        <ItemPrice>${item.price.toFixed(2)} each</ItemPrice>
                      </ItemDetails>
                      
                      <QuantityControls>
                        <QuantityButton onClick={() => updateQuantity(item.id, -1)}>-</QuantityButton>
                        <Quantity>{item.quantity}</Quantity>
                        <QuantityButton onClick={() => updateQuantity(item.id, 1)}>+</QuantityButton>
                        <RemoveButton onClick={() => removeFromCart(item.id)}>Remove</RemoveButton>
                      </QuantityControls>
                    </CartItem>
                  ))}
                </CartList>
                
                <CheckoutSection>
                  <TotalPrice>Total: ${getTotalPrice().toFixed(2)}</TotalPrice>
                  <CheckoutButton onClick={handleCheckout}>
                    Proceed to Checkout
                  </CheckoutButton>
                </CheckoutSection>
              </>
            )}
          </CartSection>
        </>
      )}
    </StoreContainer>
  );
};

export default MedicineStore; 