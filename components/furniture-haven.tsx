"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  FaHeart,
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaShoppingBag,
  FaStar,
  FaChevronDown,
  FaSearch,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaCouch,
  FaBed,
  FaUtensils,
  FaDesktop,
  FaHome,
  FaBoxOpen,
  FaEnvelope,
  FaPlus,
  FaEdit,
  FaTrash,
  FaChartBar,
} from "react-icons/fa";
import logo from "../public/logo.png";
import { useSpring, animated, config } from "react-spring";
import Image from "next/image";

const colors = {
  primary: "#3A506B",
  secondary: "#5BC0BE",
  accent: "#FFA500",
  background: "#F0F4F8",
  text: "#1C2541",
};

export function FurnitureHaven() {
  const [activeProduct, setActiveProduct] = useState(0);
  const [cart, setCart] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeView, setActiveView] = useState("home");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [activeMainMenu, setActiveMainMenu] = useState(null);
  const [activeSubMenu, setActiveSubMenu] = useState(null);
  const [adminView, setAdminView] = useState("dashboard");
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: "Living Room",
      icon: FaCouch,
      subcategories: ["Sofas", "Coffee Tables", "TV Stands"],
    },
    {
      id: 2,
      name: "Bedroom",
      icon: FaBed,
      subcategories: ["Beds", "Dressers", "Nightstands"],
    },
    {
      id: 3,
      name: "Dining Room",
      icon: FaUtensils,
      subcategories: ["Dining Tables", "Dining Chairs", "Buffets"],
    },
    {
      id: 4,
      name: "Office",
      icon: FaDesktop,
      subcategories: ["Desks", "Office Chairs", "Bookcases"],
    },
  ]);
  const [newCategory, setNewCategory] = useState({ name: "", icon: FaCouch });
  const [editingCategory, setEditingCategory] = useState(null);
  const [products, setProducts] = useState([
    ...Array(20)
      .fill()
      .map((_, i) => ({
        id: i + 1,
        name: `Sofa "Classic ${i + 1}"`,
        price: 500 + i * 50,
        rating: 4 + Math.random(),
        image: getUniqueImage("Living Room", i),
        category: "Living Room",
      })),
    ...Array(20)
      .fill()
      .map((_, i) => ({
        id: i + 21,
        name: `Bed "Comfort ${i + 1}"`,
        price: 600 + i * 50,
        rating: 4 + Math.random(),
        image: getUniqueImage("Bedroom", i),
        category: "Bedroom",
      })),
    ...Array(20)
      .fill()
      .map((_, i) => ({
        id: i + 41,
        name: `Dining Table "Elegance ${i + 1}"`,
        price: 400 + i * 50,
        rating: 4 + Math.random(),
        image: getUniqueImage("Dining Room", i),
        category: "Dining Room",
      })),
    ...Array(20)
      .fill()
      .map((_, i) => ({
        id: i + 61,
        name: `Desk "Productivity ${i + 1}"`,
        price: 300 + i * 50,
        rating: 4 + Math.random(),
        image: getUniqueImage("Office", i),
        category: "Office",
      })),
  ]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: 0,
    category: "",
    image: "",
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "admin@furniturehaven.com",
    role: "Super Admin",
  });

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const mainNavigation = [
    { name: "Home", link: "/" },
    {
      name: "Shop",
      submenu: [
        "Living Room",
        "Bedroom",
        "Dining Room",
        "Office",
        "Kitchen",
        "Outdoor",
        "Accessories",
      ],
    },
    {
      name: "Categories",
      submenu: [
        "Furniture",
        "Electronics",
        "Fashion",
        "Beauty & Health",
        "Sports",
        "Deals & Offers",
        "New Arrivals",
        "Best Sellers",
      ],
    },
    {
      name: "Account",
      submenu: ["Sign In / Register", "Profile", "Orders", "Wishlist", "Cart"],
    },
    { name: "About Us", link: "/about" },
    { name: "Contact Us", link: "/contact" },
  ];

  function getUniqueImage(category, index) {
    const colors = ["3A506B", "5BC0BE", "FFA500", "1C2541"];
    const color = colors[index % colors.length];
    const icon =
      category === "Living Room"
        ? "couch"
        : category === "Bedroom"
        ? "bed"
        : category === "Dining Room"
        ? "utensils"
        : "desktop";
    const url = `/placeholder.svg?height=200&width=200&text=${icon}&bg=${color}&fg=ffffff`;
    console.log(url);
    return url;
  }

  const fadeIn = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: config.molasses,
  });

  const dropdownAnimation = useSpring({
    opacity: isDropdownOpen ? 1 : 0,
    transform: isDropdownOpen ? "translateY(0%)" : "translateY(-10%)",
    config: config.gentle,
  });

  const mobileMenuAnimation = useSpring({
    opacity: isMobileMenuOpen ? 1 : 0,
    transform: isMobileMenuOpen ? "translateY(0%)" : "translateY(-100%)",
    config: config.gentle,
  });

  const backgroundAnimation = useSpring({
    from: { backgroundPosition: "0% 50%" },
    to: { backgroundPosition: "100% 50%" },
    config: { duration: 20000 },
    loop: true,
  });

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const buyProduct = (productId) => {
    const productToAdd = products.find((p) => p.id === productId);
    if (productToAdd) {
      setCart((prevCart) => {
        const existingItem = prevCart.find((item) => item.id === productId);
        if (existingItem) {
          return prevCart.map((item) =>
            item.id === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        } else {
          return [...prevCart, { ...productToAdd, quantity: 1 }];
        }
      });
    }
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const updateCartItemQuantity = (productId, newQuantity) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const filteredProducts = useMemo(() => {
    return products.filter(
      (product) =>
        (activeCategory === "All" || product.category === activeCategory) &&
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, activeCategory, searchTerm]);

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminUsername === "admin" && adminPassword === "password") {
      setIsAdmin(true);
      setActiveView("admin");
    } else {
      alert("Invalid credentials");
    }
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    setCategories([
      ...categories,
      { ...newCategory, id: categories.length + 1 },
    ]);
    setNewCategory({ name: "", icon: FaCouch });
  };

  const handleUpdateCategory = (e) => {
    e.preventDefault();
    setCategories(
      categories.map((cat) =>
        cat.id === editingCategory.id ? editingCategory : cat
      )
    );
    setEditingCategory(null);
  };

  const handleDeleteCategory = (id) => {
    setCategories(categories.filter((cat) => cat.id !== id));
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    setProducts([...products, { ...newProduct, id: products.length + 1 }]);
    setNewProduct({ name: "", price: 0, category: "", image: "" });
  };

  const handleUpdateProduct = (e) => {
    e.preventDefault();
    setProducts(
      products.map((prod) =>
        prod.id === editingProduct.id ? editingProduct : prod
      )
    );
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter((prod) => prod.id !== id));
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    // In a real application, you would send this data to your backend
    alert("Profile updated successfully!");
  };

  const LandingPage = () => (
    <animated.div style={fadeIn} className="min-h-screen text-white">
      <animated.div
        style={{
          ...backgroundAnimation,
          backgroundImage: `linear-gradient(45deg, ${colors.primary}, ${colors.secondary}, ${colors.accent}, ${colors.background})`,
          backgroundSize: "400% 400%",
        }}
        className="min-h-screen"
      >
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-primary">
            Welcome to Furniture Haven
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-text">
            Discover comfort and style for every room in your home.
          </p>
          <button
            onClick={() => setActiveView("products")}
            className="bg-accent px-6 py-3 rounded-full text-lg font-semibold hover:bg-opacity-90 transition-colors duration-300"
            style={{ color: "#4d4030de" }}
          >
            Shop Now
          </button>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.slice(0, 3).map((category) => (
              <div
                key={category.id}
                className="bg-white bg-opacity-20 p-6 rounded-lg backdrop-blur-md"
              >
                <category.icon className="text-4xl mb-4 text-accent" />
                <h2 className="text-2xl font-semibold mb-2 text-primary">
                  {category.name}
                </h2>
                <p className="mb-4 text-text">
                  Explore our {category.name.toLowerCase()} collection
                </p>
                <button
                  onClick={() => {
                    setActiveView("products");
                    setActiveCategory(category.name);
                  }}
                  className="bg-secondary text-black px-4 py-2 rounded-full text-sm font-semibold hover:bg-opacity-90 transition-colors duration-300"
                >
                  View Collection
                </button>
              </div>
            ))}
          </div>
        </div>
      </animated.div>
    </animated.div>
  );

  const Navbar = () => (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-primary mr-8 flex items-center">
              <Image
                src={logo}
                alt="Furniture Haven Logo"
                width={40}
                height={40}
                className="mr-2"
              />
            </h1>
            <div className="hidden lg:flex space-x-4 flex items-center ">
              {mainNavigation.map((item, index) => (
                <div
                  key={index}
                  className="relative"
                  onMouseEnter={() => setActiveMainMenu(index)}
                  onMouseLeave={() => setActiveMainMenu(null)}
                >
                  {item.link ? (
                    <a
                      href={item.link}
                      className="text-text hover:text-primary transition-colors duration-200 py-2 px-3"
                    >
                      {item.name}
                    </a>
                  ) : (
                    <button className="text-text hover:text-primary transition-colors duration-200 py-2 px-3 flex items-center">
                      {item.name} <FaChevronDown className="ml-1" />
                    </button>
                  )}
                  {item.submenu && activeMainMenu === index && (
                    <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                      {item.submenu.map((subItem, subIndex) => (
                        <a
                          key={subIndex}
                          href="#"
                          className="block px-4 py-2 text-sm text-text hover:bg-background hover:text-primary"
                        >
                          {subItem}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <FaShoppingBag
                className="text-2xl text-primary cursor-pointer"
                onClick={() => setActiveView("cart")}
              />
              <span className="absolute -top-2 -right-2 bg-accent text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </div>
            {isAdmin ? (
              <div className="flex items-center space-x-2">
                <FaUser className="text-primary cursor-pointer" />
                <FaCog
                  className="text-primary cursor-pointer"
                  onClick={() => setActiveView("admin")}
                />
                <FaSignOutAlt
                  className="text-primary cursor-pointer"
                  onClick={() => setIsAdmin(false)}
                />
              </div>
            ) : (
              <button
                onClick={() => setActiveView("admin")}
                className="bg-gradient-to-r from-primary to-secondary px-4 py-2 rounded-full transition-all duration-300 hover:from-secondary hover:to-primary"
              >
                Admin Login
              </button>
            )}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden text-primary"
              aria-label="Toggle mobile menu"
            >
              <FaBars size={24} />
            </button>
          </div>
        </div>
      </div>
      {isMobileMenuOpen && (
        <animated.div
          style={mobileMenuAnimation}
          className="lg:hidden bg-white shadow-md"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {mainNavigation.map((item, index) => (
              <div key={index}>
                {item.link ? (
                  <a
                    href={item.link}
                    className="block px-3 py-2 rounded-md text-base font-medium text-text hover:text-primary hover:bg-background"
                  >
                    {item.name}
                  </a>
                ) : (
                  <div>
                    <button
                      onClick={() =>
                        setActiveSubMenu(activeSubMenu === index ? null : index)
                      }
                      className="flex justify-between items-center w-full px-3 py-2 rounded-md text-base font-medium text-text hover:text-primary hover:bg-background"
                    >
                      {item.name}
                      <FaChevronDown
                        className={`ml-2 transform transition-transform duration-200 ${
                          activeSubMenu === index ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {activeSubMenu === index && (
                      <div className="pl-4">
                        {item.submenu.map((subItem, subIndex) => (
                          <a
                            key={subIndex}
                            href="#"
                            className="block px-3 py-2 rounded-md text-sm text-text hover:text-primary hover:bg-background"
                          >
                            {subItem}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </animated.div>
      )}
    </nav>
  );

  const AdminDashboard = () => (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-primary">Admin Dashboard</h2>
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setAdminView("dashboard")}
          className={`px-4 py-2 rounded-full ${
            adminView === "dashboard"
              ? "bg-primary text-white"
              : "bg-gray-200 text-text"
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setAdminView("categories")}
          className={`px-4 py-2 rounded-full ${
            adminView === "categories"
              ? "bg-primary text-white"
              : "bg-gray-200 text-text"
          }`}
        >
          Categories
        </button>
        <button
          onClick={() => setAdminView("products")}
          className={`px-4 py-2 rounded-full ${
            adminView === "products"
              ? "bg-primary text-white"
              : "bg-gray-200 text-text"
          }`}
        >
          Products
        </button>
        <button
          onClick={() => setAdminView("profile")}
          className={`px-4 py-2 rounded-full ${
            adminView === "profile"
              ? "bg-primary text-white"
              : "bg-gray-200 text-text"
          }`}
        >
          Profile
        </button>
        <button
          onClick={() => setAdminView("reports")}
          className={`px-4 py-2 rounded-full ${
            adminView === "reports"
              ? "bg-primary text-white"
              : "bg-gray-200 text-text"
          }`}
        >
          Reports
        </button>
      </div>
      {adminView === "dashboard" && (
        <div>
          <h3 className="text-2xl font-semibold mb-4 text-primary">
            Welcome to the Admin Dashboard
          </h3>
          <p className="text-text">
            Here you can manage categories, products, your profile, and view
            reports.
          </p>
        </div>
      )}
      {adminView === "categories" && (
        <div>
          <h3 className="text-2xl font-semibold mb-4 text-primary">
            Manage Categories
          </h3>
          <form onSubmit={handleAddCategory} className="mb-6">
            <input
              type="text"
              value={newCategory.name}
              onChange={(e) =>
                setNewCategory({ ...newCategory, name: e.target.value })
              }
              placeholder="Category Name"
              className="border rounded px-2 py-1 mr-2"
            />
            <button
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded"
            >
              Add Category
            </button>
          </form>
          <ul>
            {categories.map((category) => (
              <li
                key={category.id}
                className="flex items-center justify-between mb-2"
              >
                <span>{category.name}</span>
                <div>
                  <button
                    onClick={() => setEditingCategory(category)}
                    className="bg-secondary text-white px-2 py-1 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
          {editingCategory && (
            <form onSubmit={handleUpdateCategory} className="mt-4">
              <input
                type="text"
                value={editingCategory.name}
                onChange={(e) =>
                  setEditingCategory({
                    ...editingCategory,
                    name: e.target.value,
                  })
                }
                className="border rounded px-2 py-1 mr-2"
              />
              <button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded"
              >
                Update Category
              </button>
            </form>
          )}
        </div>
      )}
      {adminView === "products" && (
        <div>
          <h3 className="text-2xl font-semibold mb-4 text-primary">
            Manage Products
          </h3>
          <form onSubmit={handleAddProduct} className="mb-6">
            <input
              type="text"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
              placeholder="Product Name"
              className="border rounded px-2 py-1 mr-2"
            />
            <input
              type="number"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: e.target.value })
              }
              placeholder="Price"
              className="border rounded px-2 py-1 mr-2"
            />
            <select
              value={newProduct.category}
              onChange={(e) =>
                setNewProduct({ ...newProduct, category: e.target.value })
              }
              className="border rounded px-2 py-1 mr-2"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded"
            >
              Add Product
            </button>
          </form>
          <ul>
            {products.map((product) => (
              <li
                key={product.id}
                className="flex items-center justify-between mb-2"
              >
                <span>
                  {product.name} - ${product.price} - {product.category}
                </span>
                <div>
                  <button
                    onClick={() => setEditingProduct(product)}
                    className="bg-secondary text-white px-2 py-1 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
          {editingProduct && (
            <form onSubmit={handleUpdateProduct} className="mt-4">
              <input
                type="text"
                value={editingProduct.name}
                onChange={(e) =>
                  setEditingProduct({ ...editingProduct, name: e.target.value })
                }
                className="border rounded px-2 py-1 mr-2"
              />
              <input
                type="number"
                value={editingProduct.price}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    price: e.target.value,
                  })
                }
                className="border rounded px-2 py-1 mr-2"
              />
              <select
                value={editingProduct.category}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    category: e.target.value,
                  })
                }
                className="border rounded px-2 py-1 mr-2"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded"
              >
                Update Product
              </button>
            </form>
          )}
        </div>
      )}
      {adminView === "profile" && (
        <div>
          <h3 className="text-2xl font-semibold mb-4 text-primary">
            Manage Profile
          </h3>
          <form onSubmit={handleUpdateProfile}>
            <div className="mb-4">
              <label className="block text-text mb-2">Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                className="border rounded px-2 py-1 w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-text mb-2">Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
                className="border rounded px-2 py-1 w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-text mb-2">Role</label>
              <input
                type="text"
                value={profile.role}
                readOnly
                className="border rounded px-2 py-1 w-full bg-gray-100"
              />
            </div>
            <button
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded"
            >
              Update Profile
            </button>
          </form>
        </div>
      )}
      {adminView === "reports" && (
        <div>
          <h3 className="text-2xl font-semibold mb-4 text-primary">
            View Reports
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-100 p-4 rounded">
              <h4 className="text-lg font-semibold mb-2">Total Sales</h4>
              <p className="text-2xl font-bold">$10,245</p>
            </div>
            <div className="bg-gray-100 p-4 rounded">
              <h4 className="text-lg font-semibold mb-2">Total Orders</h4>
              <p className="text-2xl font-bold">152</p>
            </div>
            <div className="bg-gray-100 p-4 rounded">
              <h4 className="text-lg font-semibold mb-2">
                Top Selling Category
              </h4>
              <p className="text-2xl font-bold">Living Room</p>
            </div>
            <div className="bg-gray-100 p-4 rounded">
              <h4 className="text-lg font-semibold mb-2">New Customers</h4>
              <p className="text-2xl font-bold">24</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ backgroundColor: colors.background }}
    >
      <Navbar />

      {/* Main Content */}
      <animated.div style={fadeIn} className="flex-1 p-6">
        {activeView === "home" && <LandingPage />}
        {activeView === "products" && (
          <>
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search Products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border rounded-full py-2 px-4 w-full pl-10 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6 text-primary">
                Available Products
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="bg-white p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl"
                  >
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={384}
                      height={216}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <h3 className="text-xl font-semibold text-primary mb-2">
                      {product.name}
                    </h3>
                    <p className="text-lg font-bold text-secondary mb-2">
                      ${product.price}
                    </p>
                    <div className="flex items-center mb-4">
                      <span className="text-accent mr-1">
                        {product.rating.toFixed(1)}
                      </span>
                      <FaStar className="text-accent" />
                    </div>
                    <button
                      onClick={() => buyProduct(product.id)}
                      className="w-full bg-primary text-white px-4 py-2 rounded-full hover:bg-secondary transition-colors duration-200"
                    >
                      Add to Cart
                    </button>
                  </div>
                ))}
              </div>
              {filteredProducts.length === 0 && (
                <p className="text-text text-center mt-8">No products found.</p>
              )}
            </div>
          </>
        )}
        {activeView === "contact" && (
          <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-primary">Contact Us</h2>
            <form className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-text mb-1"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-text mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-text mb-1"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-white px-4 py-2 rounded-full hover:bg-secondary transition-colors duration-200"
              >
                Send Message
              </button>
            </form>
          </div>
        )}
        {activeView === "admin" && !isAdmin && (
          <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-primary">
              Admin Login
            </h2>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-text mb-1"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-text mb-1"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary text-white px-4 py-2 rounded-full hover:bg-secondary transition-colors duration-200"
              >
                Sign In
              </button>
            </form>
          </div>
        )}
        {activeView === "admin" && isAdmin && <AdminDashboard />}
        {activeView === "cart" && (
          <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-primary">Your Cart</h2>
            {cart.length === 0 ? (
              <p className="text-text text-center">Your cart is empty.</p>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between border-b py-4"
                  >
                    <div>
                      <h3 className="font-semibold text-lg text-primary">
                        {item.name}
                      </h3>
                      <p className="text-secondary">
                        ${item.price.toFixed(2)} each
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateCartItemQuantity(
                            item.id,
                            parseInt(e.target.value)
                          )
                        }
                        className="w-16 text-center border rounded-md p-1"
                      />
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
                <div className="mt-6 pt-6 border-t">
                  <p className="text-2xl font-bold text-primary">
                    Total: $
                    {cart
                      .reduce(
                        (sum, item) => sum + item.price * item.quantity,
                        0
                      )
                      .toFixed(2)}
                  </p>
                  <button className="mt-4 w-full bg-accent text-white px-6 py-3 rounded-full hover:bg-secondary transition-colors duration-200 text-lg font-semibold">
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </animated.div>

      {/* Footer */}
      <footer className="bg-primary text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">
                About Furniture Haven
              </h3>
              <p className="text-sm text-gray-300">
                Discover comfort and style for every room in your home with our
                curated collection of high-quality furniture.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    Products
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Customer Service</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    FAQ
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    Shipping
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    Returns
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Connect With Us</h3>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  <FaFacebookF size={24} />
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  <FaTwitter size={24} />
                </a>
                <a
                  href="#"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  <FaInstagram size={24} />
                </a>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-700 text-center text-sm text-gray-300">
            <p>&copy; 2023 Furniture Haven. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
