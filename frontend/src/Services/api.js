// Mock API service layer using in-memory data for demo flows
import {
  mockUsers,
  mockProducts,
  mockSellerRequests,
  mockPlatformStats,
  mockDisputes,
  mockSellerSales,
  mockSellerBids
} from '../Utils/mockData';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let users = [...mockUsers];
let products = [...mockProducts];
let sellerRequests = [...mockSellerRequests];
let disputes = [...mockDisputes];
let sellerSales = [...mockSellerSales];
let sellerBids = [...mockSellerBids];
let sellerOrders = [
  {
    id: 'ORD-120501',
    orderId: 'ORD-120501',
    productId: 1,
    sellerId: 2,
    buyerId: 1,
    buyerName: 'Yasas Lasitha',
    shippingAddress: 'University of Vavuniya, Vavuniya',
    totalAmount: 45000,
    quantity: 1,
    status: 'PENDING',
    createdAt: '2026-03-01',
    rejectionReason: ''
  }
];

const clone = (data) => JSON.parse(JSON.stringify(data));

export const api = {
  login: async (email, password) => {
    await delay(500);
    const user = users.find(u => u.email === email && u.password === password);
    return user
      ? { success: true, user: clone(user) }
      : { success: false, error: 'Invalid email or password.' };
  },

  register: async ({ fullName, email, password }) => {
    await delay(700);

    const normalizedEmail = email.trim().toLowerCase();
    const exists = users.some(user => user.email.toLowerCase() === normalizedEmail);

    if (exists) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    const newUser = {
      id: users.length + 1,
      fullName: fullName.trim(),
      email: normalizedEmail,
      password,
      role: 'BUYER',
      sellerRequestStatus: 'NONE',
      profilePic: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fullName.trim())}`,
      addresses: [],
      createdAt: new Date().toISOString().slice(0, 10)
    };

    users = [...users, newUser];
    return { success: true, user: clone(newUser) };
  },

  getProducts: async (filters = {}) => {
    await delay(300);
    let filtered = [...products];

    if (filters.category && filters.category !== 'All') {
      filtered = filtered.filter(p => 
        p.category.toLowerCase() === filters.category.toLowerCase()
      );
    }

    if (filters.type && filters.type !== 'All') {
      filtered = filtered.filter(p => p.type === filters.type);
    }

    if (filters.search) {
      const searchStr = filters.search.toLowerCase().trim();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchStr) || 
        p.category.toLowerCase().includes(searchStr) ||
        (p.brand && p.brand.toLowerCase().includes(searchStr))
      );
    }
    return clone(filtered);
  },

  getProduct: async (id) => {
    await delay(200);
    const product = products.find(p => p.id === parseInt(id, 10));
    return product ? clone(product) : null;
  },

  syncCart: async (cartItems, userId) => {
    await delay(400);
    return { success: true, syncedItems: cartItems };
  },

  placeBid: async (productId, bidAmount, userId) => {
    await delay(600);

    const parsedProductId = parseInt(productId, 10);
    const amount = Number(bidAmount);
    const product = products.find(item => item.id === parsedProductId);

    if (!product) {
      return { success: false, error: 'Product not found.' };
    }

    if (product.type !== 'AUCTION') {
      return { success: false, error: 'Bids can only be placed on auction items.' };
    }

    const nextMinimum = (product.currentBid || product.startPrice || 0) + 1000;
    if (amount < nextMinimum) {
      return { success: false, error: `Your bid must be at least LKR ${nextMinimum.toLocaleString()}.` };
    }

    product.currentBid = amount;
    product.bids = (product.bids || 0) + 1;
    sellerBids = [...sellerBids, { productId: parsedProductId, bidderId: userId, amount }];

    return { success: true, product: clone(product), newCurrentBid: amount };
  },

  placeOrder: async (orderData) => {
    await delay(1200);
    return { 
      success: true, 
      orderId: `ORD-${Date.now().toString().slice(-6)}`,
      message: "Order placed successfully!" 
    };
  },

  createListing: async (listingData, sellerId) => {
    await delay(1000);
    const newListing = {
      id: products.length + 1,
      title: listingData.title.trim(),
      description: listingData.description.trim(),
      category: listingData.category.trim(),
      type: listingData.type,
      sellerId,
      img: listingData.imageUrl?.trim() || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
      status: 'ACTIVE',
      ...(listingData.type === 'AUCTION'
        ? {
            startPrice: Number(listingData.startPrice),
            currentBid: Number(listingData.startPrice),
            reserve: listingData.reservePrice ? Number(listingData.reservePrice) : undefined,
            bids: 0,
            endTime: listingData.endDate,
            bidIncrement: Number(listingData.increment || 1000)
          }
        : {
            price: Number(listingData.price),
            stock: Number(listingData.stock || 1)
          })
    };

    products = [newListing, ...products];
    return { success: true, listingId: newListing.id, listing: clone(newListing) };
  },

  getSellerListings: async (sellerId) => {
    await delay(300);
    return clone(products.filter(p => p.sellerId === sellerId));
  },

  deleteListing: async (id) => {
    await delay(300);
    products = products.filter(product => product.id !== id);
    return { success: true };
  },

  endAuctionEarly: async (id) => {
    await delay(300);
    products = products.map(product =>
      product.id === id ? { ...product, status: 'ENDED', endTime: new Date().toISOString() } : product
    );
    return { success: true, product: clone(products.find(product => product.id === id)) };
  },

  getSellerSales: async (sellerId) => {
    await delay(300);
    return clone(sellerSales.filter(sale => {
      const product = products.find(item => item.id === sale.productId);
      return product?.sellerId === sellerId;
    }));
  },

  getSellerBids: async (sellerId) => {
    await delay(300);
    return clone(sellerBids.filter(bid => {
      const product = products.find(item => item.id === bid.productId);
      return product?.sellerId === sellerId;
    }));
  },

  updateListing: async (id, updates) => {
    await delay(300);
    products = products.map(product =>
      product.id === id ? { ...product, ...updates } : product
    );
    return { success: true, product: clone(products.find(product => product.id === id)) };
  },

  getSellerOrders: async (sellerId) => {
    await delay(300);
    return clone(sellerOrders.filter(order => order.sellerId === sellerId));
  },

  updateSellerOrder: async (orderId, updates) => {
    await delay(350);
    sellerOrders = sellerOrders.map(order =>
      order.orderId === orderId ? { ...order, ...updates } : order
    );

    const updatedOrder = sellerOrders.find(order => order.orderId === orderId);
    if (updatedOrder?.status === 'SHIPPED') {
      sellerSales = sellerSales.some(sale => sale.orderId === orderId)
        ? sellerSales
        : [...sellerSales, { orderId, revenue: updatedOrder.totalAmount, productId: updatedOrder.productId }];
    }

    if (updatedOrder?.status === 'REJECTED') {
      disputes = [
        ...disputes,
        {
          id: disputes.length + 1,
          title: 'Seller Rejected Purchase',
          description: updatedOrder.rejectionReason || 'Seller rejected a purchase and requested admin review.',
          orderId,
          type: 'REJECTED_ORDER',
          status: 'OPEN'
        }
      ];
    }

    return { success: true, order: clone(updatedOrder) };
  },

  getSellerRequests: async () => {
    await delay(400);
    return clone(sellerRequests);
  },

  createSellerRequest: async (payload, userId) => {
    await delay(500);

    const existingRequest = sellerRequests.find(request => request.userId === userId);
    const businessDetails = {
      name: payload.businessName.trim(),
      description: payload.description.trim(),
      contact: payload.contact.trim(),
      documents: payload.documents || ''
    };

    users = users.map(user =>
      user.id === userId
        ? {
            ...user,
            sellerRequestStatus: 'PENDING',
            businessDetails
          }
        : user
    );

    if (existingRequest) {
      sellerRequests = sellerRequests.map(request =>
        request.userId === userId
          ? {
              ...request,
              businessName: businessDetails.name,
              description: businessDetails.description,
              status: 'PENDING',
              appliedDate: new Date().toISOString().slice(0, 10)
            }
          : request
      );
    } else {
      const currentUser = users.find(user => user.id === userId);
      sellerRequests = [
        ...sellerRequests,
        {
          userId,
          name: currentUser?.fullName || 'Seller Applicant',
          email: currentUser?.email || '',
          businessName: businessDetails.name,
          description: businessDetails.description,
          appliedDate: new Date().toISOString().slice(0, 10),
          status: 'PENDING'
        }
      ];
    }

    const updatedUser = users.find(user => user.id === userId);
    return { success: true, user: clone(updatedUser) };
  },

  getUserById: async (userId) => {
    await delay(200);
    const user = users.find(item => item.id === userId);
    return user ? clone(user) : null;
  },

  approveSeller: async (userId) => {
    await delay(400);
    sellerRequests = sellerRequests.filter(request => request.userId !== userId);
    users = users.map(user =>
      user.id === userId ? { ...user, role: 'SELLER', sellerRequestStatus: 'APPROVED' } : user
    );
    return { success: true, user: clone(users.find(user => user.id === userId)) };
  },

  denySeller: async (userId) => {
    await delay(400);
    sellerRequests = sellerRequests.filter(request => request.userId !== userId);
    users = users.map(user =>
      user.id === userId ? { ...user, sellerRequestStatus: 'REJECTED' } : user
    );
    return { success: true, user: clone(users.find(user => user.id === userId)) };
  },

  getPlatformStats: async () => {
    await delay(400);
    return {
      ...mockPlatformStats,
      totalUsers: users.length,
      activeAuctions: products.filter(product => product.type === 'AUCTION' && product.status === 'ACTIVE').length
    };
  },

  getDisputes: async () => {
    await delay(400);
    return clone(disputes);
  },

  resolveDispute: async (id, resolution) => {
    await delay(400);
    disputes = disputes.filter(dispute => dispute.id !== id);
    return { success: true };
  },

  updateProfile: async (userId, updates) => {
    await delay(400);
    users = users.map(user =>
      user.id === userId ? { ...user, ...updates } : user
    );

    const updatedUser = users.find(user => user.id === userId);
    return { success: true, user: clone(updatedUser) };
  }
};
