import React, { useState } from 'react';
import Layout from '../components/Layout';
import Card from '../components/Card';
import Button from '../components/Button';
import { ShoppingBagIcon, PlusIcon, XIcon, CheckIcon, SearchIcon, ChevronDownIcon, UtensilsIcon, AppleIcon, EggIcon, CakeIcon, CoffeeIcon, SaladIcon, TimerIcon, FlameIcon } from 'lucide-react';
import '../styles/Pantry.css';
interface GroceryItem {
  id: number;
  name: string;
  category: string;
  checked: boolean;
}
interface PantryItem {
  id: number;
  name: string;
  category: string;
  quantity: string;
  expiresIn: string;
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
  const [activeTab, setActiveTab] = useState('grocery');
  const groceryItems: GroceryItem[] = [{
    id: 1,
    name: 'Chickpeas',
    category: 'Legumes',
    checked: false
  }, {
    id: 2,
    name: 'Brown Rice',
    category: 'Grains',
    checked: false
  }, {
    id: 3,
    name: 'Quinoa',
    category: 'Grains',
    checked: false
  }, {
    id: 4,
    name: 'Bell Peppers',
    category: 'Vegetables',
    checked: false
  }, {
    id: 5,
    name: 'Spinach',
    category: 'Vegetables',
    checked: false
  }, {
    id: 6,
    name: 'Carrots',
    category: 'Vegetables',
    checked: false
  }, {
    id: 7,
    name: 'Onions',
    category: 'Vegetables',
    checked: false
  }, {
    id: 8,
    name: 'Turmeric',
    category: 'Spices',
    checked: false
  }, {
    id: 9,
    name: 'Cumin',
    category: 'Spices',
    checked: false
  }, {
    id: 10,
    name: 'Olive Oil',
    category: 'Oils',
    checked: false
  }];
  const [items, setItems] = useState<GroceryItem[]>(groceryItems);
  const toggleItem = (id: number) => {
    setItems(items.map(item => item.id === id ? {
      ...item,
      checked: !item.checked
    } : item));
  };
  const pantryItems: PantryItem[] = [{
    id: 101,
    name: 'Oats',
    category: 'Grains',
    quantity: '500g',
    expiresIn: '2 months'
  }, {
    id: 102,
    name: 'Eggs',
    category: 'Dairy & Eggs',
    quantity: '6',
    expiresIn: '1 week'
  }, {
    id: 103,
    name: 'Green Tea',
    category: 'Beverages',
    quantity: '20 bags',
    expiresIn: '6 months'
  }, {
    id: 104,
    name: 'Bananas',
    category: 'Fruits',
    quantity: '3',
    expiresIn: '3 days'
  }, {
    id: 105,
    name: 'Peanut Butter',
    category: 'Spreads',
    quantity: '250g',
    expiresIn: '3 months'
  }, {
    id: 106,
    name: 'Apples',
    category: 'Fruits',
    quantity: '4',
    expiresIn: '1 week'
  }];
  // Recipe suggestion data
  const recipeCards: RecipeCard[] = [{
    id: 1,
    title: 'Banana Oatmeal Breakfast',
    description: 'A nutritious breakfast using oats, banana, and optional egg for extra protein.',
    status: 'All ingredients available',
    calories: 310,
    time: '15 min',
    color: 'amber',
    icon: <CakeIcon size={24} className="text-amber-600" />,
    mainIngredients: ['Oats', 'Banana', 'Egg']
  }, {
    id: 2,
    title: 'Apple & PB Energy Bites',
    description: 'Quick energy snack combining apples, peanut butter, and oats.',
    status: 'All ingredients available',
    calories: 180,
    time: '10 min',
    color: 'emerald',
    icon: <AppleIcon size={24} className="text-emerald-600" />,
    mainIngredients: ['Apple', 'Peanut Butter', 'Oats']
  }, {
    id: 3,
    title: 'Chickpea & Vegetable Curry',
    description: "Hearty vegetarian curry that's perfect with quinoa or brown rice.",
    status: 'Missing 3 ingredients',
    calories: 380,
    time: '30 min',
    color: 'blue',
    icon: <div style={{width:24, height:24}} className="text-blue-600" />,
    mainIngredients: ['Chickpeas', 'Vegetables', 'Spices']
  }, {
    id: 4,
    title: 'Oatmeal Protein Pancakes',
    description: 'High-protein breakfast pancakes using oats, eggs, and banana.',
    status: 'Missing 1 ingredient',
    calories: 320,
    time: '20 min',
    color: 'purple',
    icon: <CoffeeIcon size={24} className="text-purple-600" />,
    mainIngredients: ['Oats', 'Eggs', 'Banana']
  }];
  const getExpiryClass = (expiresIn: string): string => {
    if (expiresIn.includes('day')) return 'expiry-soon';
    if (expiresIn.includes('week')) return 'expiry-medium';
    return 'expiry-good';
  };
  return <Layout>
      <div className="pantry-container">
        <div className="pantry-header">
          <div>
            <h1 className="pantry-title">Smart Pantry</h1>
            <p className="pantry-subtitle">
              Track your groceries and plan your shopping
            </p>
          </div>
          <div className="pantry-actions">
            <div className="search-container">
              <input type="text" placeholder="Search items..." className="search-input" />
              <SearchIcon size={16} className="search-icon" />
            </div>
            <Button icon={<PlusIcon size={16} />}>Add Item</Button>
          </div>
        </div>
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
        {activeTab === 'grocery' && <>
            <Card className="mb-6">
              <div className="grocery-header">
                <div className="grocery-title-container">
                  <ShoppingBagIcon size={20} className="grocery-icon" />
                  <h2 className="grocery-title">Grocery List</h2>
                </div>
                <div>
                  <Button size="sm" variant="outline">
                    Clear All
                  </Button>
                </div>
              </div>
              <div className="select-all-row">
                <label className="select-all-label">
                  <input type="checkbox" className="select-all-checkbox" />
                  <span className="select-all-text">Select All</span>
                </label>
                <span className="items-count">{items.length} items</span>
              </div>
              <div className="space-y-1">
                {items.map(item => <div key={item.id} className="grocery-item">
                    <div className="item-details">
                      <input type="checkbox" checked={item.checked} onChange={() => toggleItem(item.id)} className="item-checkbox" />
                      <span className={`item-name ${item.checked ? 'checked' : ''}`}>
                        {item.name}
                      </span>
                    </div>
                    <div className="item-meta">
                      <span className="item-category">{item.category}</span>
                      <button className="delete-button">
                        <XIcon size={16} />
                      </button>
                    </div>
                  </div>)}
              </div>
              <div className="grocery-actions">
                <Button variant="outline" icon={<PlusIcon size={16} />}>
                  Add Item
                </Button>
                <Button>Mark Selected as Purchased</Button>
              </div>
            </Card>
            <Card>
              <div className="grocery-header">
                <h2 className="grocery-title">Local Grocery Options</h2>
                <Button size="sm" variant="outline">
                  Refresh
                </Button>
              </div>
              <div className="grocery-options">
                <div className="grocery-option">
                  <div className="grocery-option-header">
                    <h3 className="grocery-option-title">Kandy Fresh Market</h3>
                    <span className="distance-badge distance-close">
                      0.8 km away
                    </span>
                  </div>
                  <p className="grocery-option-description">
                    All items available • Best price for vegetables
                  </p>
                  <Button size="sm" variant="outline" fullWidth>
                    View Store Details
                  </Button>
                </div>
                <div className="grocery-option">
                  <div className="grocery-option-header">
                    <h3 className="grocery-option-title">Organic Grocers</h3>
                    <span className="distance-badge distance-medium">
                      1.2 km away
                    </span>
                  </div>
                  <p className="grocery-option-description">
                    8/10 items available • Best quality organic produce
                  </p>
                  <Button size="sm" variant="outline" fullWidth>
                    View Store Details
                  </Button>
                </div>
                <div className="grocery-option">
                  <div className="grocery-option-header">
                    <h3 className="grocery-option-title">City Supermarket</h3>
                    <span className="distance-badge distance-medium">
                      2.5 km away
                    </span>
                  </div>
                  <p className="grocery-option-description">
                    All items available • Best price overall
                  </p>
                  <Button size="sm" variant="outline" fullWidth>
                    View Store Details
                  </Button>
                </div>
              </div>
            </Card>
          </>}
        {activeTab === 'pantry' && <Card>
            <div className="grocery-header">
              <h2 className="grocery-title">My Pantry Items</h2>
              <Button size="sm" icon={<PlusIcon size={14} />}>
                Add Item
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="pantry-table">
                <thead className="pantry-table-header">
                  <tr>
                    <th className="pantry-table-header-cell">Item</th>
                    <th className="pantry-table-header-cell">Category</th>
                    <th className="pantry-table-header-cell">Quantity</th>
                    <th className="pantry-table-header-cell">Expires In</th>
                    <th className="pantry-table-header-cell">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pantryItems.map(item => <tr key={item.id} className="pantry-table-row">
                      <td className="pantry-table-cell">{item.name}</td>
                      <td className="pantry-table-cell">{item.category}</td>
                      <td className="pantry-table-cell">{item.quantity}</td>
                      <td className="pantry-table-cell">
                        <span className={`expiry-badge ${getExpiryClass(item.expiresIn)}`}>
                          {item.expiresIn}
                        </span>
                      </td>
                      <td className="pantry-actions-cell">
                        <button className="pantry-action-button">
                          <ChevronDownIcon size={16} />
                        </button>
                      </td>
                    </tr>)}
                </tbody>
              </table>
            </div>
            <div className="ai-suggestion">
              <div className="ai-suggestion-content">
                <div className="ai-avatar">
                  <span className="font-bold text-blue-600">AI</span>
                </div>
                <div>
                  <p className="ai-message">
                    <span className="ai-title">Expiring Soon:</span> Your
                    bananas will expire in 3 days. Consider using them in a
                    smoothie or freezing them for later use.
                  </p>
                  <p className="ai-tip">
                    Tip: Based on your pantry, you could make banana oatmeal
                    cookies with your current ingredients.
                  </p>
                </div>
              </div>
            </div>
          </Card>}
        {activeTab === 'recipes' && <Card>
            <h2 className="grocery-title mb-4">Recipe Suggestions</h2>
            <p className="pantry-subtitle mb-6">
              Based on your pantry items and dietary preferences
            </p>
            <div className="recipe-grid">
              {recipeCards.map(recipe => <div key={recipe.id} className={`recipe-card border-${recipe.color}-200`}>
                  <div className={`recipe-header bg-gradient-to-br from-${recipe.color}-100 to-${recipe.color}-200`}>
                    <div className={`recipe-icon-container bg-${recipe.color}-50`}>
                      {recipe.icon}
                    </div>
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
                      {recipe.mainIngredients.map((ingredient, idx) => <span key={idx} className={`recipe-ingredient bg-${recipe.color}-50 text-${recipe.color}-700`}>
                          {ingredient}
                        </span>)}
                    </div>
                    <p className="recipe-description">{recipe.description}</p>
                    <div className="recipe-footer">
                      <span className={`recipe-status ${recipe.status.includes('All') ? 'status-available' : 'status-missing'}`}>
                        {recipe.status}
                      </span>
                      <Button size="sm" variant="outline">
                        View Recipe
                      </Button>
                    </div>
                  </div>
                </div>)}
            </div>
          </Card>}
      </div>
    </Layout>;
};
export default Pantry;


