import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import {
  ShoppingBagIcon,
  PlusIcon,
  XIcon,
  CheckIcon,
  SearchIcon,
  ChevronDownIcon,
  FlameIcon,
  TimerIcon,
  CakeIcon,
  AppleIcon,
  CoffeeIcon,
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
} from 'firebase/firestore';

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

interface RecipeCard {
  id: number;
  title: string;
  description: string;
  status: string;
  calories: number;
  time: string;
  color: string;
  icon: React.ReactNode;
  mainIngredients: string[];
}

const Pantry: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'grocery' | 'pantry' | 'recipes'>('grocery');
  const [pantryItems, setPantryItems] = useState<PantryItem[]>([]);
  const [groceryItems, setGroceryItems] = useState<GroceryItem[]>([]);
  const [showPopup, setShowPopup] = useState(false);
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


  const user = auth.currentUser;

  // Real-time listeners
  useEffect(() => {
    if (!user) return;

    const pantryRef = collection(db, 'users', user.uid, 'pantry');
    const groceryRef = collection(db, 'users', user.uid, 'grocery');

    const unsubscribePantry = onSnapshot(pantryRef, (snapshot) => {
      const pantryData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as PantryItem),
      }));
      setPantryItems(pantryData);
    });

    const unsubscribeGrocery = onSnapshot(groceryRef, (snapshot) => {
      const groceryData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as GroceryItem),
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

  // Dummy recipe suggestions (can be dynamic later)
  const recipeCards: RecipeCard[] = [
    {
      id: 1,
      title: 'Banana Oatmeal Breakfast',
      description: 'A nutritious breakfast using oats, banana, and optional egg.',
      status: 'All ingredients available',
      calories: 310,
      time: '15 min',
      color: 'amber',
      icon: <CakeIcon size={24} className="text-amber-600" />,
      mainIngredients: ['Oats', 'Banana', 'Egg'],
    },
    {
      id: 2,
      title: 'Apple & PB Energy Bites',
      description: 'Quick energy snack combining apples, peanut butter, and oats.',
      status: 'All ingredients available',
      calories: 180,
      time: '10 min',
      color: 'emerald',
      icon: <AppleIcon size={24} className="text-emerald-600" />,
      mainIngredients: ['Apple', 'Peanut Butter', 'Oats'],
    },
    {
      id: 3,
      title: 'Oatmeal Protein Pancakes',
      description: 'High-protein breakfast pancakes using oats, eggs, and banana.',
      status: 'Missing 1 ingredient',
      calories: 320,
      time: '20 min',
      color: 'purple',
      icon: <CoffeeIcon size={24} className="text-purple-600" />,
      mainIngredients: ['Oats', 'Eggs', 'Banana'],
    },
  ];

  return (
    <Layout>
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
          <button className={`tab-button ${activeTab === 'recipes' ? 'active' : ''}`} onClick={() => setActiveTab('recipes')}>
            Recipe Suggestions
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
                            onChange={async () => {
                              const itemRef = doc(db, 'users', user.uid, 'grocery', item.id);
                              await updateDoc(itemRef, { checked: !item.checked });
                            }}
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
                      <span className="font-bold text-blue-600">AI</span>
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

        {/* -------- Recipes Tab -------- */}
        {activeTab === 'recipes' && (
          <Card>
            <h2 className="grocery-title mb-4">Recipe Suggestions</h2>
            <div className="recipe-grid">
              {recipeCards.map((recipe) => (
                <div key={recipe.id} className={`recipe-card border-${recipe.color}-200`}>
                  <div className={`recipe-header bg-gradient-to-br from-${recipe.color}-100 to-${recipe.color}-200`}>
                    <div className={`recipe-icon-container bg-${recipe.color}-50`}>{recipe.icon}</div>
                    <div className="recipe-info">
                      <h3 className="recipe-title">{recipe.title}</h3>
                      <div className="recipe-meta">
                        <span className="recipe-meta-item">
                          <FlameIcon size={14} className="recipe-meta-icon" />
                          {recipe.calories} cal
                        </span>
                        <span className="recipe-meta-item">
                          <TimerIcon size={14} className="recipe-meta-icon" />
                          {recipe.time}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="recipe-content">
                    <div className="recipe-ingredients">
                      {recipe.mainIngredients.map((ing, idx) => (
                        <span key={idx} className={`recipe-ingredient bg-${recipe.color}-50 text-${recipe.color}-700`}>
                          {ing}
                        </span>
                      ))}
                    </div>
                    <p className="recipe-description">{recipe.description}</p>
                    <div className="recipe-footer">
                      <span className={`recipe-status ${recipe.status.includes('All') ? 'status-available' : 'status-missing'}`}>
                        {recipe.status}
                      </span>
                      <Button size="sm" variant="outline">View Recipe</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
      </div>
    </Layout>
  );
};

export default Pantry;
