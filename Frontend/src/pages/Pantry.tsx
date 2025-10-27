import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import {
  PlusIcon,
  XIcon,
  CheckIcon,
  SearchIcon,
  LockIcon,
} from 'lucide-react';
import '../styles/Pantry.css';
import { db, auth } from '../firebaseConfig';
import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  getDoc,
} from 'firebase/firestore';
import { createNotification } from '../services/notificationService';
import { useNavigate } from 'react-router-dom';

interface PantryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  expiresIn: string;
  expiryDate: string;
}

interface GroceryItem {
  id: string;
  name: string;
  category: string;
  checked: boolean;
}

const Pantry: React.FC = () => {
  const navigate = useNavigate();
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'grocery' | 'pantry' | 'stores'>('grocery');
  const [pantryItems, setPantryItems] = useState<PantryItem[]>([]);
  const [groceryItems, setGroceryItems] = useState<GroceryItem[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [showPantryDialog, setShowPantryDialog] = useState(false);
  const [selectedGroceryItem, setSelectedGroceryItem] = useState<GroceryItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newItem, setNewItem] = useState({
    name: '',
    category: '',
    quantity: 1,
    expiryDate: '',
  });

  const [newGroceryItem, setNewGroceryItem] = useState({
  name: '',
  category: '',
  checked: false,
});

  // Track which items we've already notified about
  const [notifiedItems, setNotifiedItems] = useState<Set<string>>(new Set());

    // Nearby grocery stores states
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [nearbyStores, setNearbyStores] = useState<
      { id: number; name: string; distance: number; description: string; lat: number; lng: number }[]
    >([]);
    const [loadingStores, setLoadingStores] = useState(false);

  // Check if user is premium
  useEffect(() => {
    const checkPremiumStatus = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setIsPremium(false);
          return;
        }

        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const userPlan = userData.plan || 'free';
          console.log('Pantry - User plan:', userPlan); // Debug log
          setIsPremium(userPlan.toLowerCase() === 'premium');
        } else {
          setIsPremium(false);
        }
      } catch (error) {
        console.error('Error checking premium status:', error);
        setIsPremium(false);
      }
    };

    // Initial check
    checkPremiumStatus().then(() => setLoading(false));

    // Set up an interval to check for plan updates every 3 seconds
    const interval = setInterval(() => {
      checkPremiumStatus();
    }, 3000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

    // Calculate distance using Haversine formula
    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
      const R = 6371;
      const dLat = (lat2 - lat1) * (Math.PI / 180);
      const dLon = (lon2 - lon1) * (Math.PI / 180);
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * (Math.PI / 180)) *
          Math.cos(lat2 * (Math.PI / 180)) *
          Math.sin(dLon / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    // Fetch user location & nearby stores
   const getNearbyStores = async () => {
      if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
      }

      setLoadingStores(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });

          try {
            // Fetch nearby grocery/supermarkets
            //OpenStreetMap (OSM) / Nominatim API
            const radius = 0.1; // ~10km range around user
            const res = await fetch(
              `https://nominatim.openstreetmap.org/search?format=json&q=supermarket&bounded=1&viewbox=${longitude - radius},${latitude + radius},${longitude + radius},${latitude - radius}&limit=15`
            );

            const data = await res.json();

            // Map data and calculate distance
            const stores = data.map((place: any, index: number) => ({
              id: index + 1,
              name: place.display_name.split(",")[0],
              lat: parseFloat(place.lat),
              lng: parseFloat(place.lon),
              description: place.display_name,
              distance: calculateDistance(latitude, longitude, parseFloat(place.lat), parseFloat(place.lon)),
            }));

            stores.sort((a: any, b: any) => a.distance - b.distance);
            setNearbyStores(stores);
          } catch (error) {
            console.error("Failed to fetch nearby stores:", error);
            alert("Unable to fetch stores. Please try again later.");
          } finally {
            setLoadingStores(false);
          }
        },
        (error) => {
          console.error("Error fetching location:", error);
          alert("Unable to fetch your location. Please enable GPS.");
          setLoadingStores(false);
        }
      );
    };


    // Auto-fetch nearby stores when grocery tab loads
    useEffect(() => {
      getNearbyStores();
    }, []);


  const user = auth.currentUser;

  // Check for expiring items and create notifications
  const checkExpiringItems = async (items: PantryItem[], userId: string) => {
    const now = new Date();
    const twoDaysFromNow = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
    
    for (const item of items) {
      if (!item.expiryDate) continue;
      
      // Create unique key for this item's expiry notification
      const notificationKey = `${item.id}-${item.expiryDate}`;
      
      // Skip if we've already notified about this item
      if (notifiedItems.has(notificationKey)) continue;
      
      const expiryDate = new Date(item.expiryDate);
      
      // Check if item expires within 2 days
      if (expiryDate > now && expiryDate <= twoDaysFromNow) {
        const daysLeft = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        try {
          // Create notification for expiring item
          await createNotification({
            userId,
            title: 'Pantry Item Expiring Soon!',
            message: `"${item.name}" will expire in ${daysLeft} day${daysLeft > 1 ? 's' : ''}. Use it soon!`,
            type: 'reminder',
          });
          
          // Mark this item as notified
          setNotifiedItems(prev => new Set([...prev, notificationKey]));
        } catch (error) {
          console.error('Error creating expiry notification:', error);
        }
      }
    }
  };

  // Real-time listeners
  useEffect(() => {
    if (!user) return;

    const pantryRef = collection(db, 'users', user.uid, 'pantry');
    const groceryRef = collection(db, 'users', user.uid, 'grocery');

    const unsubscribePantry = onSnapshot(pantryRef, (snapshot) => {
      const pantryData = snapshot.docs.map((doc) => ({
        ...(doc.data() as PantryItem),
        id: doc.id,
      }));
      setPantryItems(pantryData);
      
      // Check for items expiring within 2 days
      checkExpiringItems(pantryData, user.uid);
    });

    const unsubscribeGrocery = onSnapshot(groceryRef, (snapshot) => {
      const groceryData = snapshot.docs.map((doc) => ({
        ...(doc.data() as GroceryItem),
        id: doc.id,
      }));
      setGroceryItems(groceryData);
    });

    return () => {
      unsubscribePantry();
      unsubscribeGrocery();
    };
  }, [user]);

  /* save a grocery item to Firebase */
  const handleAddGroceryItem = async () => {
  if (!user) return;

  if (!newGroceryItem.name || !newGroceryItem.category) {
    alert("Please fill Name and Category.");
    return;
  }

  try {
    await addDoc(collection(db, 'users', user.uid, 'grocery'), {
      ...newGroceryItem,
      createdAt: serverTimestamp(),
    });
    setNewGroceryItem({ name: '', category: '', checked: false });
    alert("Grocery item added ✔");
  } catch (err) {
    console.error(err);
    alert("Failed to add grocery item.");
  }
};

  /* Handle grocery item checkbox - ask if user wants to add to pantry */
  const handleGroceryCheckbox = async (item: GroceryItem) => {
    if (!user) return;

    // If checking (marking as purchased), ask to add to pantry
    if (!item.checked) {
      setSelectedGroceryItem(item);
      setShowPantryDialog(true);
    } else {
      // If unchecking, just update the checkbox
      const itemRef = doc(db, 'users', user.uid, 'grocery', item.id);
      await updateDoc(itemRef, { checked: false });
    }
  };

  /* Add grocery item to pantry and remove from grocery list */
  const handleAddToPantry = async () => {
    if (!user || !selectedGroceryItem) return;

    try {
      // Add to pantry with default values
      const today = new Date();
      const defaultExpiryDate = new Date(today.setDate(today.getDate() + 7)); // 7 days from now
      const expiryDateString = defaultExpiryDate.toISOString().split('T')[0];
      
      await addDoc(collection(db, 'users', user.uid, 'pantry'), {
        name: selectedGroceryItem.name,
        category: selectedGroceryItem.category,
        quantity: 1,
        expiryDate: expiryDateString,
        expiresIn: '1 week',
        createdAt: serverTimestamp(),
      });

      // Delete from grocery list
      await deleteDoc(doc(db, 'users', user.uid, 'grocery', selectedGroceryItem.id));

      setShowPantryDialog(false);
      setSelectedGroceryItem(null);
    } catch (err) {
      console.error('Failed to add to pantry:', err);
      alert('Failed to add item to pantry.');
    }
  };

  /* Just mark as purchased without adding to pantry */
  const handleMarkPurchasedOnly = async () => {
    if (!user || !selectedGroceryItem) return;

    try {
      // Delete from grocery list
      await deleteDoc(doc(db, 'users', user.uid, 'grocery', selectedGroceryItem.id));
      
      setShowPantryDialog(false);
      setSelectedGroceryItem(null);
    } catch (err) {
      console.error('Failed to remove item:', err);
      alert('Failed to remove item from grocery list.');
    }
  };


  const handleAddItem = async () => {
    if (!user) return;
    if (!newItem.name || !newItem.category || !newItem.expiryDate) {
      alert('Please fill all required fields.');
      return;
    }

    const expiresIn = calculateExpiresIn(newItem.expiryDate);

    try {
      await addDoc(collection(db, 'users', user.uid, 'pantry'), {
        ...newItem,
        expiresIn,
        createdAt: serverTimestamp(),
      });
      setShowPopup(false);
      setNewItem({ name: '', category: '', quantity: 1, expiryDate: '' });
    } catch (err) {
      console.error(err);
      alert('Failed to add item.');
    }
  };

  const increaseQuantity = async (itemId: string) => {
    if (!user) return;
    const item = pantryItems.find((i) => i.id === itemId);
    if (!item) return;
    const itemRef = doc(db, 'users', user.uid, 'pantry', itemId);
    await updateDoc(itemRef, { quantity: item.quantity + 1 });
  };

  const reduceQuantity = async (itemId: string) => {
  if (!user) return;

  const item = pantryItems.find((i) => i.id === itemId);
  if (!item) return;

  const itemRef = doc(db, 'users', user.uid, 'pantry', itemId);
  const newQuantity = item.quantity - 1;

  try {
    if (newQuantity <= 0) {
      // Check if item already exists in grocery
      const groceryRef = collection(db, 'users', user.uid, 'grocery');
      const existing = groceryItems.find(g => g.name === item.name && g.category === item.category);

      if (existing) {
        // Optionally: do nothing or update something
        // For example, reset checked to false
        const existingRef = doc(db, 'users', user.uid, 'grocery', existing.id);
        await updateDoc(existingRef, { checked: false });
      } else {
        // Add to grocery
        await addDoc(groceryRef, {
          name: item.name,
          category: item.category,
          checked: false,
          createdAt: serverTimestamp(),
        });
      }

      // Delete from pantry
      await deleteDoc(itemRef);
    } else {
      await updateDoc(itemRef, { quantity: newQuantity });
    }
  } catch (error) {
    console.error("Failed to decrease quantity:", error);
  }
};


  const calculateExpiresIn = (dateString: string) => {
    const today = new Date();
    const expiry = new Date(dateString);
    const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 3600 * 24));
    if (diffDays <= 3) return `${diffDays} days`;
    if (diffDays <= 7) return '1 week';
    return `${Math.ceil(diffDays / 30)} months`;
  };

  const getExpiryClass = (expiresIn: string) => {
    if (expiresIn.includes('day')) return 'expiry-soon';
    if (expiresIn.includes('week')) return 'expiry-medium';
    return 'expiry-good';
  };

  const filteredPantry = pantryItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      ) : !isPremium ? (
        <div className="flex flex-col items-center justify-center min-h-[70vh] p-8">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-yellow-100 dark:bg-yellow-900 p-4 rounded-full">
                <LockIcon size={48} className="text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Premium Feature
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Smart Pantry is available exclusively for Premium members. Upgrade your plan to access inventory management, grocery lists, and recipe suggestions.
            </p>
            <div className="space-y-3">
              <Button 
                onClick={() => navigate('/pricing')}
                className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700"
              >
                Upgrade to Premium
              </Button>
              <Button 
                onClick={() => navigate('/dashboard')}
                variant="ghost"
                className="w-full"
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      ) : (
      <div className="pantry-container">
        <div className="pantry-header">
          <div>
            <h1 className="pantry-title">Smart Pantry</h1>
            
            <p className="pantry-subtitle">Track your groceries and plan your shopping</p>
          </div>

          <div className="pantry-actions">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search items from pantry"
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <SearchIcon size={16} className="search-icon" />
            </div>
            <Button icon={<PlusIcon size={16} />} onClick={() => setShowPopup(true)}>
              Add Item To Pantry
            </Button>
          </div>
        </div>

        {/* -------- Tabs -------- */}
        <div className="tabs-container">
          <button className={`tab-button ${activeTab === 'grocery' ? 'active' : ''}`} onClick={() => setActiveTab('grocery')}>
            Grocery List
          </button>
          <button className={`tab-button ${activeTab === 'pantry' ? 'active' : ''}`} onClick={() => setActiveTab('pantry')}>
            My Pantry
          </button>
          <button className={`tab-button ${activeTab === 'stores' ? 'active' : ''}`} onClick={() => setActiveTab('stores')}>
            Nearby Stores
          </button>
        </div>

        {/* -------- Grocery Tab -------- */}
        {activeTab === 'grocery' && (
            <Card>
              <h2>Grocery List</h2>

              {/* Add Grocery Item Form */}
              <div className="grocery-add-form">
                <input
                  type="text"
                  placeholder="Item Name"
                  value={newGroceryItem.name}
                  onChange={(e) =>
                    setNewGroceryItem({ ...newGroceryItem, name: e.target.value })
                  }
                />
                <select
                  value={newGroceryItem.category}
                  onChange={(e) =>
                    setNewGroceryItem({ ...newGroceryItem, category: e.target.value })
                  }
                >
                  <option value="">Select Category</option>
                  <option value="Fruits">🍎 Fruits</option>
                  <option value="Vegetables">🥦 Vegetables</option>
                  <option value="Dairy">🥛 Dairy</option>
                  <option value="Snacks">🍪 Snacks</option>
                  <option value="Drinks">☕ Drinks</option>
                  <option value="Other">🧂 Other</option>
                </select>
                <button onClick={handleAddGroceryItem}>Add</button>
              </div>

              <div className="overflow-x-auto">
                <table className="pantry-table">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Category</th>
                      <th>Purchased</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groceryItems.map((item) => (
                      <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>{item.category}</td>
                        <td>
                          <input
                            type="checkbox"
                            checked={item.checked}
                            onChange={() => handleGroceryCheckbox(item)}
                          />
                        </td>
                        <td>
                          <button
                            onClick={async () => {
                              await deleteDoc(doc(db, 'users', user.uid, 'grocery', item.id));
                            }}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
                      </Card>
          )}


        {/* -------- Pantry Tab -------- */}
        {activeTab === 'pantry' && (
          <Card>
            <div className="overflow-x-auto">
              <table className="pantry-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Category</th>
                    <th>Quantity</th>
                    <th>Expires In</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPantry.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>{item.category}</td>
                      <td>{item.quantity}</td>
                      <td>
                        <span className={`expiry-badge ${getExpiryClass(item.expiresIn)}`}>
                          {item.expiresIn}
                        </span>
                      </td>
                      <td className="pantry-actions-cell">
                        <button onClick={() => reduceQuantity(item.id)}>-</button>
                        <button onClick={() => increaseQuantity(item.id)}>+</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* AI Tips */}
              {filteredPantry.length > 0 && (
                <div className="ai-suggestion">
                  <div className="ai-suggestion-content">
                    <div className="ai-avatar">
                      <span className="font-bold text-blue-600 dark:text-white-600 ">AI</span>
                    </div>
                    <div>
                      <p className="ai-message">
                        <span className="ai-title">Expiring Soon:</span> Some items are nearing expiry. Use them soon!
                      </p>
                      <p className="ai-tip">
                        Tip: Combine fruits and oats for a healthy snack.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* -------- Nearby Stores Tab -------- */}
        {activeTab === 'stores' && (
          <Card>
            <h2 className="grocery-title mb-3">Nearby Grocery Stores</h2>

            {loadingStores ? (
              <p>Fetching nearby stores...</p>
            ) : nearbyStores.length > 0 ? (
              <div className="grocery-options mt-4">
                {nearbyStores.map((store) => (
                  <div key={store.id} className="grocery-option">
                    <div className="grocery-option-header">
                      <h3 className="grocery-option-title">{store.name}</h3>
                      <span
                        className={`distance-badge ${
                          store.distance < 1
                            ? 'distance-close'
                            : store.distance < 3
                            ? 'distance-medium'
                            : 'distance-far'
                        }`}
                      >
                        {store.distance.toFixed(1)} km away
                      </span>
                    </div>
                    <p className="grocery-option-description">{store.description}</p>
                    <Button
                        size="sm"
                        variant="outline"
                        fullWidth
                        onClick={() => {
                          if (!userLocation) {
                            alert("Location not available");
                            return;
                          }
                          // Create a free Google Maps directions link
                          const directionsUrl = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${store.lat},${store.lng}/@${store.lat},${store.lng},15z`;
                          window.open(directionsUrl, "_blank");
                        }}
                      >
                        View Store Directions
                      </Button>

                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 mt-3">
                Please enable location access to find nearby stores.
              </p>
            )}
          </Card>
        )}

        {/* -------- Add Item Popup -------- */}
        {showPopup && (
          <div className="popup-overlay">
            <div className="popup-container enhanced-popup">
              <h2 className="popup-title">🧺 Add New Pantry Item</h2>
              <div className="popup-form">
                <div className="popup-field">
                  <label>Item Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Milk"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    className="popup-input"
                  />
                </div>
                <div className="popup-field">
                  <label>Category</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className="popup-input"
                  >
                    <option value="">Select Category</option>
                    <option value="Fruits">🍎 Fruits</option>
                    <option value="Vegetables">🥦 Vegetables</option>
                    <option value="Dairy">🥛 Dairy</option>
                    <option value="Snacks">🍪 Snacks</option>
                    <option value="Drinks">☕ Drinks</option>
                    <option value="Other">🧂 Other</option>
                  </select>
                </div>
                <div className="popup-field">
                  <label>Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                    className="popup-input"
                  />
                </div>
                <div className="popup-field">
                  <label>Expiry Date</label>
                  <input
                    type="date"
                    value={newItem.expiryDate}
                    onChange={(e) => setNewItem({ ...newItem, expiryDate: e.target.value })}
                    className="popup-input"
                  />
                </div>
                <div className="popup-actions">
                  <Button onClick={handleAddItem} icon={<CheckIcon size={16} />}>Save Item</Button>
                  <Button variant="outline" onClick={() => setShowPopup(false)} icon={<XIcon size={16} />}>Cancel</Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* -------- Add to Pantry Dialog -------- */}
        {showPantryDialog && selectedGroceryItem && (
          <div className="popup-overlay">
            <div className="popup-container enhanced-popup" style={{ maxWidth: '400px' }}>
              <h2 className="popup-title">📦 Item Purchased</h2>
              <div className="popup-form">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  You purchased <strong>{selectedGroceryItem.name}</strong>.
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Would you like to add this item to your pantry?
                </p>
                <div className="popup-actions">
                  <Button 
                    onClick={handleAddToPantry} 
                    icon={<CheckIcon size={16} />}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    Yes, Add to Pantry
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleMarkPurchasedOnly}
                  >
                    No, Just Remove
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      )}
    </Layout>
  );
};

export default Pantry;
