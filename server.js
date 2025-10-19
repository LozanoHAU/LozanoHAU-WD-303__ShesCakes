const express = require('express');
const cors = require('cors');
const session = require('express-session');
const path = require('path');
const crypto = require('crypto');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? true : 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'shes-cakes-secret-key-2024',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  }
}));

const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'shescakes2025'
};

function requireAuth(req, res, next) {
  if (req.session && req.session.isAuthenticated) {
    next();
  } else {
    res.redirect('/login');
  }
}

let products = [
  {id: 'p01', name:'Chocolate 11 (11")', image:'images/cake1.jpg', price:750, sizes:['8" (8-11 slices)','11" (12-15)'], flavors:['Chocolate'], description:'Rich chocolate breading with chocolate buttercream.'},
  {id: 'p02', name:'Vanilla Dream (8")', image:'images/cake2.jpg', price:650, sizes:['8"','10"'], flavors:['Vanilla'], description:'Light vanilla sponge with fresh cream frosting.'},
  {id: 'p03', name:'Porcelain (8")', image:'images/cake3.jpg', price:800, sizes:['8"','10"'], flavors:['Vanilla'], description:'Fresh vanilla layers with milky buttercream.'},
  {id: 'p04', name:'Cut of Nature (8")', image:'images/cake4.jpg', price:900, sizes:['8"'], flavors:['Mango'], description:'Fresh mango filling and meringue topping.'},
  {id: 'p05', name:'A Decade and Eight (8")', image:'images/cake5.jpg', price:820, sizes:['8"','10"'], flavors:['Red Velvet'], description:'Classic red velvet with cream cheese frosting.'},
  {id: 'p06', name:'Sweet Florist', image:'images/cake6.jpg', price:450, sizes:['8"','10"'], flavors:['Oreo'], description:'Vanilla cake filled with oreo crumbs.'},
  {id: 'p07', name:'Rainbow Deluxe (6")', image:'images/cake7.jpg', price:680, sizes:['6"','8"'], flavors:['Strawberry','Chocolate'], description:'Strawberry mousse and sprinkle crunch.'},
  {id: 'p08', name:'Summer of \'09 (10")', image:'images/cake9.jpg', price:1200, sizes:['10"'], flavors:['Chocolate'], description:'Cold decadent ganache finish ÃƒÂ¢Ã¢â€šÂ¬" best for a hot day.'},
  {id: 'p09', name:'Strawberry Heart (8")', image:'images/cake8.jpg', price:770, sizes:['8"'], flavors:['Strawberry'], description:'Fresh strawberries between layers of sponge.'},
  {id: 'p10', name:'Halloween (8")', image:'images/cake10.jpg', price:700, sizes:['8"'], flavors:['Carrot'], description:'Classic carrot cake with macarons and cream cheese.'},
  {id: 'p11', name:'High 5 (6")', image:'images/cake11.jpg', price:640, sizes:['6"','8"'], flavors:['Blackforest','Cherry'], description:'Chocolate sponge, hard candies and whipped cream.'}
];


let customers = [
  {
    id: 1,
    name: 'Maria Santos',
    phone: '0917-234-5678',
    email: 'maria.santos1985@gmail.com',
    eventDate: '2025-08-15',
    address: '123 McArthur Highway, Angeles City, Pampanga',
    cakeType: 'Chocolate 11 (11")',
    message: 'Please add "Happy Birthday Mama Mary" on top',
    dateOrdered: '2025-08-08',
    status: 'Confirmed'
  },
  {
    id: 2,
    name: 'Roberto Cruz',
    phone: '0926-345-6789',
    email: 'robertocruz.ph@gmail.com',
    eventDate: '2025-08-22',
    address: '456 Jose Abad Santos Ave, San Fernando City, Pampanga',
    cakeType: 'Red Velvet (8")',
    message: 'Can you make it extra red? Anniversary cake',
    dateOrdered: '2025-08-18',
    status: 'Confirmed'
  },
  {
    id: 3,
    name: 'Jennifer Reyes',
    phone: '09354567890',
    email: 'jen.reyes92@gmail.com',
    eventDate: '2025-09-05',
    address: '789 Olongapo-Gapan Road, Mabalacat City, Pampanga',
    cakeType: 'Vanilla Dream (8")',
    message: 'Delivery before 2pm please. Birthday party starts at 3pm',
    dateOrdered: '2025-09-01',
    status: 'Confirmed'
  },
  {
    id: 4,
    name: 'Carlos Mendoza',
    phone: '09185678901',
    email: 'carlitomendoza@gmail.com',
    eventDate: '2025-09-12',
    address: '234 Don Juico Ave, Angeles City, Pampanga',
    cakeType: 'Strawberry Heart (8")',
    message: 'For my wife. Can you add fresh roses?',
    dateOrdered: '2025-09-07',
    status: 'Confirmed'
  },
  {
    id: 5,
    name: 'Anna Garcia',
    phone: '0929-678-9012',
    email: 'annagarcia.pampanga@gmail.com',
    eventDate: '2025-09-18',
    address: '567 MacArthur Highway, Guagua, Pampanga',
    cakeType: 'Rainbow Deluxe (6")',
    message: 'Kids party theme is unicorns!',
    dateOrdered: '2025-09-13',
    status: 'Confirmed'
  },
  {
    id: 6,
    name: 'Luis Fernandez',
    phone: '09157890123',
    email: 'luisfernandez.dev@gmail.com',
    eventDate: '2025-09-25',
    address: '890 Rizal Street, Mexico, Pampanga',
    cakeType: 'Halloween (8")',
    message: '',
    dateOrdered: '2025-09-20',
    status: 'Confirmed'
  },

  {
    id: 7,
    name: 'Patricia Lim',
    phone: '09328901234',
    email: 'patricia.lim88@gmail.com',
    eventDate: '2025-10-25',
    address: '123 Friendship Highway, Angeles City, Pampanga',
    cakeType: 'Porcelain (8")',
    message: 'Engagement party cake. Can you add gold accents?',
    dateOrdered: '2025-10-19',
    status: 'Pending'
  },
  {
    id: 8,
    name: 'Miguel Torres',
    phone: '09219012345',
    email: 'migueltorres.fitness@gmail.com',
    eventDate: '2025-10-26',
    address: '456 Sindalan Road, San Fernando City, Pampanga',
    cakeType: 'Cut of Nature (8")',
    message: 'Wife loves mango! 25th birthday',
    dateOrdered: '2025-10-19',
    status: 'Pending'
  },
  {
    id: 9,
    name: 'Sofia Ramos',
    phone: '0936-012-3456',
    email: 'sofia.ramos2000@gmail.com',
    eventDate: '2025-10-28',
    address: '789 Arayat Boulevard, Arayat, Pampanga',
    cakeType: 'Sweet Florist',
    message: 'Pastel colors please! Baby shower theme',
    dateOrdered: '2025-10-18',
    status: 'Pending'
  }
];

let contactMessages = [
  {
    id: 1,
    fullName: 'Elena Villanueva',
    contactNumber: '0917-234-5678',
    email: 'elena.villanueva@gmail.com',
    subject: 'Wedding Cake Inquiry',
    message: 'Good day! I would like to inquire about a 3-tier wedding cake for December 2025. Do you offer consultations? Also, can you accommodate custom designs? Thank you!',
    contactMethod: 'email',
    dateSent: '2025-08-15',
    status: 'Replied'
  },
  {
    id: 2,
    fullName: 'Marco Santos',
    contactNumber: '0926-345-6789',
    email: 'marco.santos.ph@gmail.com',
    subject: 'Birthday Cake Order Question',
    message: 'Hi! I saw your Rainbow Deluxe cake on the website. Can you make it in a larger size? My daughter wants a rainbow cake for her 7th birthday. Please let me know. Thanks!',
    contactMethod: 'phone',
    dateSent: '2025-09-03',
    status: 'Replied'
  },
  {
    id: 3,
    fullName: 'Catherine Reyes',
    contactNumber: '0935-456-7890',
    email: 'cat.reyes92@gmail.com',
    subject: 'Corporate Event Cake',
    message: 'Hello! Our company is celebrating its 10th anniversary next month. We need a large cake that can serve 50-60 people. Do you do corporate orders? What are your rates? Looking forward to your response.',
    contactMethod: 'email',
    dateSent: '2025-09-20',
    status: 'Replied'
  },
  {
    id: 4,
    fullName: 'Joshua Mendoza',
    contactNumber: '0918-567-8901',
    email: 'josh.mendoza.pamp@gmail.com',
    subject: 'Urgent - Same Week Delivery',
    message: 'Hi She\'s Cakes! Is it possible to order a cake for this Friday? I totally forgot my mom\'s birthday is coming up. I know it\'s short notice but hoping you can help. Thanks!',
    contactMethod: 'phone',
    dateSent: '2025-10-14',
    status: 'Replied'
  },
  {
    id: 5,
    fullName: 'Angelica Cruz',
    contactNumber: '0929-678-9012',
    email: 'angelica.cruz88@gmail.com',
    subject: 'Allergen Information',
    message: 'Good afternoon. My son has a nut allergy. Do your cakes contain nuts or are they processed in a facility that handles nuts? We want to order for his birthday but need to be sure. Thank you for your time.',
    contactMethod: 'email',
    dateSent: '2025-10-16',
    status: 'New'
  },
  {
    id: 6,
    fullName: 'Ricardo Fernandez',
    contactNumber: '0915-789-0123',
    email: 'ricardo.fern.dev@gmail.com',
    subject: 'Custom Design Request',
    message: 'Hello! I\'m looking for a cake designed to look like a basketball court for my nephew\'s 10th birthday. Is this something you can do? What would be the cost? The party is on November 15. Thanks!',
    contactMethod: 'email',
    dateSent: '2025-10-18',
    status: 'New'
  },
  {
    id: 7,
    fullName: 'Patricia Lim',
    contactNumber: '0932-890-1234',
    email: 'trish.lim2000@gmail.com',
    subject: 'Pricing Question',
    message: 'Hi! I love the Porcelain cake design. How much would it cost to add fresh flowers on top? Also, do you deliver to Mabalacat City? Thank you!',
    contactMethod: 'facebook',
    dateSent: '2025-10-19',
    status: 'New'
  },
  {
    id: 8,
    fullName: 'Daniel Torres',
    contactNumber: '0921-901-2345',
    email: 'daniel.torres.fit@gmail.com',
    subject: 'Anniversary Cake - Special Request',
    message: 'Good day! I want to order a red velvet cake for our 5th wedding anniversary. Can you write "Happy 5th Anniversary Dan & Sarah" in gold lettering? Also, can it be ready by October 25? Thanks so much!',
    contactMethod: 'email',
    dateSent: '2025-10-17',
    status: 'New'
  },
  {
    id: 9,
    fullName: 'Michelle Garcia',
    contactNumber: '0936-012-3456',
    email: 'michelle.garcia.rn@gmail.com',
    subject: 'Baby Shower Cake Colors',
    message: 'Hello! I ordered a Sweet Florist cake for my baby shower. I requested pastel colors. Just wanted to confirm - can you do pastel pink and blue? The event is on October 28. Thanks!',
    contactMethod: 'phone',
    dateSent: '2025-10-18',
    status: 'New'
  },
  {
    id: 10,
    fullName: 'Benjamin Ramos',
    contactNumber: '0917-123-4567',
    email: 'ben.ramos.architect@gmail.com',
    subject: 'Multiple Cake Order',
    message: 'Hi! I need to order 5 small cakes (6 inch) for a family reunion. Can you give me a bulk discount? We\'re flexible with the flavors. The date needed is November 10. Please let me know your rates. Thank you!',
    contactMethod: 'email',
    dateSent: '2025-10-19',
    status: 'New'
  },
  {
    id: 11,
    fullName: 'Sofia Aquino',
    contactNumber: '0928-234-5678',
    email: 'sofia.aquino.teacher@gmail.com',
    subject: 'Vegan Cake Options',
    message: 'Good afternoon! Do you make vegan cakes? My sister is vegan and I want to surprise her with a birthday cake. If you do, what flavors are available? Thank you for your help!',
    contactMethod: 'email',
    dateSent: '2025-08-28',
    status: 'Replied'
  },
  {
    id: 12,
    fullName: 'Gabriel Santos',
    contactNumber: '0919-345-6789',
    email: 'gab.santos.gamer@gmail.com',
    subject: 'Minecraft Theme Cake',
    message: 'Hey! Can you make a Minecraft-themed cake? My son is obsessed with it and his birthday is coming up on November 8. He wants a creeper design. Is that possible? How much would it be?',
    contactMethod: 'facebook',
    dateSent: '2025-10-19',
    status: 'New'
  }
];

app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    req.session.isAuthenticated = true;
    req.session.username = username;
    res.json({ success: true, message: 'Login successful' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid username or password' });
  }
});

app.post('/api/admin/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({ success: false, message: 'Logout failed' });
    } else {
      res.json({ success: true, message: 'Logged out successfully' });
    }
  });
});

app.get('/api/admin/check-auth', (req, res) => {
  if (req.session && req.session.isAuthenticated) {
    res.json({ success: true, authenticated: true, username: req.session.username });
  } else {
    res.json({ success: true, authenticated: false });
  }
});

app.post('/api/admin/generate-email-token', requireAuth, (req, res) => {
  const { messageId } = req.body;
  
  const token = crypto.randomBytes(32).toString('hex');
  req.session.emailToken = token;
  req.session.emailTokenExpiry = Date.now() + (5 * 60 * 1000);
  req.session.emailMessageId = messageId;
  
  res.json({ success: true, token: token });
});

app.get('/email-mockup', requireAuth, (req, res) => {
  const { token } = req.query;
  
  if (!token || 
      !req.session.emailToken || 
      token !== req.session.emailToken ||
      !req.session.emailTokenExpiry ||
      Date.now() > req.session.emailTokenExpiry) {
    return res.redirect('/ADMINmessages');
  }
  
  delete req.session.emailToken;
  delete req.session.emailTokenExpiry;
  delete req.session.emailMessageId;
  
  res.sendFile(path.join(__dirname, 'email-mockup.html'));
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ success: true, message: 'API is working!', timestamp: new Date().toISOString() });
});

app.get('/api/products', (req, res) => {
  console.log('Products API called with query:', req.query);
  let result = [...products];
  const { search, flavor, size, sort } = req.query;

  if (search) {
    const searchLower = search.toLowerCase();
    result = result.filter(p => 
      p.name.toLowerCase().includes(searchLower) ||
      p.description.toLowerCase().includes(searchLower) ||
      p.flavors.some(f => f.toLowerCase().includes(searchLower))
    );
  }

  if (flavor) {
    result = result.filter(p => p.flavors.includes(flavor));
  }

  if (size) {
    result = result.filter(p => p.sizes.includes(size));
  }

  if (sort === 'price-asc') result.sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') result.sort((a, b) => b.price - a.price);
  if (sort === 'name-asc') result.sort((a, b) => a.name.localeCompare(b.name));

  console.log('Returning products:', result.length);
  res.json({ success: true, data: result, count: result.length });
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (product) {
    res.json({ success: true, data: product });
  } else {
    res.status(404).json({ success: false, message: 'Product not found' });
  }
});

app.get('/api/customers', (req, res) => {
  let result = [...customers];
  const { search, status } = req.query;

  if (search) {
    const searchLower = search.toLowerCase();
    result = result.filter(c => 
      c.name.toLowerCase().includes(searchLower) ||
      c.email.toLowerCase().includes(searchLower) ||
      c.phone.includes(search) ||
      c.cakeType.toLowerCase().includes(searchLower)
    );
  }

  if (status) {
    result = result.filter(c => c.status === status);
  }

  res.json({ success: true, data: result, count: result.length });
});

app.post('/api/customers', (req, res) => {
  const newCustomer = {
    id: customers.length + 1,
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
    eventDate: req.body.eventDate,
    address: req.body.address,
    cakeType: req.body.cakeType,
    message: req.body.message || '',
    dateOrdered: new Date().toISOString().split('T')[0],
    status: 'Pending'
  };
  customers.push(newCustomer);
  res.json({ success: true, message: 'Order received successfully', data: newCustomer });
});

app.patch('/api/customers/:id/confirm', (req, res) => {
  const customerId = parseInt(req.params.id);
  const customer = customers.find(c => c.id === customerId);
  
  if (customer) {
    customer.status = 'Confirmed';
    res.json({ 
      success: true, 
      message: 'Order confirmed successfully', 
      data: customer 
    });
  } else {
    res.status(404).json({ 
      success: false, 
      message: 'Customer order not found' 
    });
  }
});

app.delete('/api/customers/:id', (req, res) => {
  const customerId = parseInt(req.params.id);
  const customerIndex = customers.findIndex(c => c.id === customerId);
  
  if (customerIndex !== -1) {
    const deletedCustomer = customers.splice(customerIndex, 1)[0];
    res.json({ 
      success: true, 
      message: 'Order deleted successfully', 
      data: deletedCustomer 
    });
  } else {
    res.status(404).json({ 
      success: false, 
      message: 'Customer order not found' 
    });
  }
});

app.get('/api/messages', (req, res) => {
  let result = [...contactMessages];
  const { search, status } = req.query;

  if (search) {
    const searchLower = search.toLowerCase();
    result = result.filter(m => 
      m.fullName.toLowerCase().includes(searchLower) ||
      m.email.toLowerCase().includes(searchLower) ||
      m.subject.toLowerCase().includes(searchLower) ||
      m.message.toLowerCase().includes(searchLower)
    );
  }

  if (status) {
    result = result.filter(m => m.status === status);
  }

  res.json({ success: true, data: result, count: result.length });
});

app.post('/api/messages', (req, res) => {
  const newMessage = {
    id: contactMessages.length + 1,
    fullName: req.body.fullName,
    contactNumber: req.body.contactNumber,
    email: req.body.email,
    subject: req.body.subject,
    message: req.body.message,
    contactMethod: req.body.contactMethod,
    dateSent: new Date().toISOString().split('T')[0],
    status: 'New'
  };
  contactMessages.push(newMessage);
  res.json({ success: true, message: 'Message received successfully', data: newMessage });
});

app.patch('/api/messages/:id/mark-replied', (req, res) => {
  const messageId = parseInt(req.params.id);
  const message = contactMessages.find(m => m.id === messageId);
  
  if (message) {
    message.status = 'Replied';
    res.json({ 
      success: true, 
      message: 'Message marked as replied', 
      data: message 
    });
  } else {
    res.status(404).json({ 
      success: false, 
      message: 'Message not found' 
    });
  }
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/feature', (req, res) => {
  res.sendFile(path.join(__dirname, 'feature.html'));
});

app.get('/display', (req, res) => {
  res.sendFile(path.join(__dirname, 'display.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'contact.html'));
});

app.get('/login', (req, res) => {
  if (req.session && req.session.isAuthenticated) {
    res.redirect('/ADMINcustomers');
  } else {
    res.sendFile(path.join(__dirname, 'login.html'));
  }
});

app.get('/ADMINcustomers', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'ADMINcustomers.html'));
});

app.get('/ADMINmessages', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'ADMINmessages.html'));
});

app.get('*', (req, res) => {
  res.status(404).send('404 - Not Found');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});