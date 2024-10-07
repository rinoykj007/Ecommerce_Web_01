"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
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
} from "react-icons/fa";
import { useSpring, animated, config } from "react-spring";
import Image from "next/image";
import { FloatingWhatsApp } from "react-floating-whatsapp";

const colors = {
  primary: "#3A506B",
  secondary: "#5BC0BE",
  accent: "#FFA500",
  background: "#F0F4F8",
  text: "#1C2541",
};

type Product = {
  id: number;
  name: string;
  price: number;
  rating: number;
  image: string;
  category: string;
};

type CartItem = Product & { quantity: number };

type Category = {
  id: number;
  name: string;
  icon: React.ComponentType;
  subcategories: string[];
};

// Button Component
const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "default" | "outline" | "ghost" | "destructive";
  }
>(({ className, variant = "default", ...props }, ref) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-input hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    destructive:
      "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";

// Input Component
const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      className={`flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

// Card Component
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}
    {...props}
  />
));
Card.displayName = "Card";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={`p-6 pt-0 ${className}`} {...props} />
));
CardContent.displayName = "CardContent";

// DropdownMenu Components
const DropdownMenu = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative inline-block text-left">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === DropdownMenuTrigger) {
          return React.cloneElement(child as React.ReactElement<any>, {
            onClick: () => setIsOpen(!isOpen),
          });
        }
        if (React.isValidElement(child) && child.type === DropdownMenuContent) {
          return isOpen ? child : null;
        }
        return child;
      })}
    </div>
  );
};

const DropdownMenuTrigger = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>;

const DropdownMenuContent = ({ children }: { children: React.ReactNode }) => (
  <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
    <div
      className="py-1"
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="options-menu"
    >
      {children}
    </div>
  </div>
);

const DropdownMenuItem = ({
  children,
  onSelect,
}: {
  children: React.ReactNode;
  onSelect?: () => void;
}) => (
  <a
    href="#"
    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
    role="menuitem"
    onClick={(e) => {
      e.preventDefault();
      onSelect && onSelect();
    }}
  >
    {children}
  </a>
);

export default function FurnitureHaven() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeView, setActiveView] = useState("home");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [activeSubMenu, setActiveSubMenu] = useState<number | null>(null);
  const [adminView, setAdminView] = useState("dashboard");
  const [categories, setCategories] = useState<Category[]>([
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
  const [newCategory, setNewCategory] = useState<Omit<Category, "id">>({
    name: "",
    icon: FaCouch,
    subcategories: [],
  });
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<Omit<Product, "id" | "rating">>({
    name: "",
    price: 0,
    category: "",
    image: "",
  });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "admin@furniturehaven.com",
    role: "Super Admin",
  });

  const mainNavigation = [
    { name: "Home", view: "home" },
    {
      name: "Shop",
      submenu: categories.map((cat) => ({
        name: cat.name,
        view: cat.name.toLowerCase().replace(" ", "-"),
      })),
    },
    {
      name: "Categories",
      submenu: [
        { name: "New Arrivals", view: "new-arrivals" },
        { name: "Best Sellers", view: "best-sellers" },
        { name: "Deals & Offers", view: "deals-offers" },
      ],
    },
    {
      name: "Account",
      submenu: [
        { name: "Sign In / Register", view: "sign-in" },
        { name: "Profile", view: "profile" },
        { name: "Orders", view: "orders" },
        { name: "Wishlist", view: "wishlist" },
        { name: "Cart", view: "cart" },
      ],
    },
    { name: "About Us", view: "about" },
    { name: "Contact Us", view: "contact" },
  ];

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const initialProducts = categories.flatMap((category, categoryIndex) =>
      Array(20)
        .fill(null)
        .map((_, index) => ({
          id: categoryIndex * 20 + index + 1,
          name: `${category.name} Item ${index + 1}`,
          price: 100 + categoryIndex * 50 + index * 10,
          rating: 4 + Math.random(),
          image: getUniqueImage(category.name, index),
          category: category.name,
        }))
    );
    setProducts(initialProducts);
  }, []);

  function getUniqueImage(category: string, index: number) {
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
    return `/placeholder.svg?height=200&width=200&text=${icon}&bg=${color}&fg=ffffff`;
  }

  const fadeIn = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    config: config.molasses,
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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const buyProduct = (productId: number) => {
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

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const updateCartItemQuantity = (productId: number, newQuantity: number) => {
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

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminUsername === "admin" && adminPassword === "password") {
      setIsAdmin(true);
      setActiveView("admin");
    } else {
      alert("Invalid credentials");
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setActiveView("home");
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    setCategories([
      ...categories,
      { ...newCategory, id: categories.length + 1 },
    ]);
    setNewCategory({ name: "", icon: FaCouch, subcategories: [] });
  };

  const handleUpdateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      setCategories(
        categories.map((cat) =>
          cat.id === editingCategory.id ? editingCategory : cat
        )
      );
      setEditingCategory(null);
    }
  };

  const handleDeleteCategory = (id: number) => {
    setCategories(categories.filter((cat) => cat.id !== id));
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    setProducts([
      ...products,
      { ...newProduct, id: products.length + 1, rating: 5 },
    ]);
    setNewProduct({ name: "", price: 0, category: "", image: "" });
  };

  const handleUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      setProducts(
        products.map((prod) =>
          prod.id === editingProduct.id ? editingProduct : prod
        )
      );
      setEditingProduct(null);
    }
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter((prod) => prod.id !== id));
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Profile updated successfully!");
  };

  const handleNavigation = (view: string) => {
    setActiveView(view);
    if (view.includes("room") || view === "office") {
      setActiveCategory(
        view
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      );
    }
    setIsMobileMenuOpen(false);
  };

  const Navbar = () => (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-primary mr-8 flex items-center">
              Furniture Haven
            </h1>
            <div className="hidden lg:flex space-x-4 flex items-center">
              {mainNavigation.map((item, index) => (
                <div key={index} className="relative">
                  {!item.submenu ? (
                    <Button
                      variant="ghost"
                      onClick={() => handleNavigation(item.view)}
                      className="text-text hover:text-primary transition-colors duration-200 py-2 px-3"
                    >
                      {item.name}
                    </Button>
                  ) : (
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button
                          variant="ghost"
                          className="text-text hover:text-primary transition-colors duration-200 py-2 px-3 flex items-center"
                        >
                          {item.name} <FaChevronDown className="ml-1" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {item.submenu.map((subItem, subIndex) => (
                          <DropdownMenuItem
                            key={subIndex}
                            onSelect={() => handleNavigation(subItem.view)}
                          >
                            {subItem.name}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-secondary transition-colors duration-200"
              >
                <FaFacebookF size={18} />
                <span className="sr-only">Facebook</span>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-secondary transition-colors duration-200"
              >
                <FaTwitter size={18} />
                <span className="sr-only">Twitter</span>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-secondary transition-colors duration-200"
              >
                <FaInstagram size={18} />
                <span className="sr-only">Instagram</span>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-secondary transition-colors duration-200"
              >
                <FaLinkedinIn size={18} />
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
            <Button variant="ghost" onClick={() => handleNavigation("cart")}>
              <FaShoppingBag className="text-2xl text-primary" />
              <span className="ml-1">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </Button>
            {isAdmin ? (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button variant="ghost">
                    <FaUser className="text-primary" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onSelect={() => setActiveView("admin")}>
                    <FaCog className="mr-2" />
                    Admin Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={handleLogout}>
                    <FaSignOutAlt className="mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="ghost"
                onClick={() => setActiveView("admin")}
                className="bg-gradient-to-r from-primary to-secondary px-4 py-2 rounded-full transition-all duration-300 hover:from-secondary hover:to-primary"
              >
                Admin Login
              </Button>
            )}
            <Button
              variant="ghost"
              onClick={toggleMobileMenu}
              className="lg:hidden text-primary"
              aria-label="Toggle mobile menu"
            >
              <FaBars size={24} />
            </Button>
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
                {!item.submenu ? (
                  <Button
                    variant="ghost"
                    onClick={() => handleNavigation(item.view)}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-text hover:text-primary hover:bg-background"
                  >
                    {item.name}
                  </Button>
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
                          <Button
                            key={subIndex}
                            variant="ghost"
                            onClick={() => handleNavigation(subItem.view)}
                            className="block w-full text-left px-3 py-2 rounded-md text-sm text-text hover:text-primary hover:bg-background"
                          >
                            {subItem.name}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            <div className="flex justify-center space-x-4 mt-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-secondary transition-colors duration-200"
              >
                <FaFacebookF size={20} />
                <span className="sr-only">Facebook</span>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-secondary transition-colors duration-200"
              >
                <FaTwitter size={20} />
                <span className="sr-only">Twitter</span>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-secondary transition-colors duration-200"
              >
                <FaInstagram size={20} />
                <span className="sr-only">Instagram</span>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-secondary transition-colors duration-200"
              >
                <FaLinkedinIn size={20} />
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>
        </animated.div>
      )}
    </nav>
  );

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
          <Button
            onClick={() => setActiveView("products")}
            className="bg-accent text-black px-6 py-3 rounded-full text-lg font-semibold hover:bg-opacity-90 transition-colors duration-300"
          >
            Shop Now
          </Button>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.slice(0, 3).map((category) => (
              <Card
                key={category.id}
                className="bg-white bg-opacity-20 backdrop-blur-md"
              >
                <CardContent className="p-6">
                  <category.icon className="text-4xl mb-4 text-accent" />
                  <h2 className="text-2xl font-semibold mb-2 text-primary">
                    {category.name}
                  </h2>
                  <p className="mb-4 text-text">
                    Explore our {category.name.toLowerCase()} collection
                  </p>
                  <Button
                    onClick={() => {
                      setActiveView("products");
                      setActiveCategory(category.name);
                    }}
                    className="bg-secondary text-black px-4 py-2 rounded-full text-sm font-semibold hover:bg-opacity-90 transition-colors duration-300"
                  >
                    View Collection
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </animated.div>
    </animated.div>
  );

  const ProductsPage = () => (
    <div>
      <div className="relative mb-4">
        <Input
          type="text"
          placeholder="Search Products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
        <FaSearch className="absolute left-3 top-3 text-gray-400" />
      </div>
      <div>
        <h2 className="text-3xl font-bold mb-6 text-primary">
          {activeCategory === "All" ? "All Products" : activeCategory}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id}>
              <CardContent className="p-4">
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
                <Button
                  onClick={() => buyProduct(product.id)}
                  className="w-full bg-primary text-white"
                >
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        {filteredProducts.length === 0 && (
          <p className="text-text text-center mt-8">No products found.</p>
        )}
      </div>
    </div>
  );

  const CartPage = () => (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="p-8">
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
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      updateCartItemQuantity(item.id, parseInt(e.target.value))
                    }
                    className="w-16 text-center"
                  />
                  <Button
                    onClick={() => removeFromCart(item.id)}
                    variant="destructive"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
            <div className="mt-6 pt-6 border-t">
              <p className="text-2xl font-bold text-primary">
                Total: $
                {cart
                  .reduce((sum, item) => sum + item.price * item.quantity, 0)
                  .toFixed(2)}
              </p>
              <Button className="mt-4 w-full bg-accent text-white">
                Proceed to Checkout
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const AboutPage = () => (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-primary">About Us</h2>
        <p className="text-text mb-4">
          Furniture Haven is your one-stop shop for all your home furnishing
          needs. We pride ourselves on offering a wide selection of high-quality
          furniture at competitive prices.
        </p>
        <p className="text-text mb-4">
          Founded in 2010, we've been helping customers create their dream homes
          for over a decade. Our team of expert designers and customer service
          representatives are always ready to assist you in finding the perfect
          pieces for your space.
        </p>
        <p className="text-text">
          At Furniture Haven, we believe that everyone deserves a beautiful and
          comfortable home. That's why we're committed to providing excellent
          products and service to all our customers.
        </p>
      </CardContent>
    </Card>
  );

  const ContactPage = () => (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-primary">Contact Us</h2>
        <form className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-text mb-1"
            >
              Name
            </label>
            <Input type="text" id="name" name="name" />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-text mb-1"
            >
              Email
            </label>
            <Input type="email" id="email" name="email" />
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
          <Button type="submit" className="w-full">
            Send Message
          </Button>
        </form>
      </CardContent>
    </Card>
  );

  const AdminDashboard = () => (
    <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-8 rounded-lg shadow-md max-w-4xl mx-auto text-white">
      <h2 className="text-3xl font-bold mb-6">Admin Dashboard</h2>
      <div className="flex space-x-4 mb-6">
        {["dashboard", "categories", "products", "profile", "reports"].map(
          (view) => (
            <Button
              key={view}
              onClick={() => setAdminView(view)}
              variant={adminView === view ? "secondary" : "outline"}
              className={
                adminView === view
                  ? "bg-white text-indigo-600"
                  : "bg-transparent text-white border-white hover:bg-white hover:text-indigo-600"
              }
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </Button>
          )
        )}
      </div>
      {adminView === "dashboard" && (
        <div>
          <h3 className="text-2xl font-semibold mb-4">
            Welcome to the Admin Dashboard
          </h3>
          <p className="text-gray-100">
            Here you can manage categories, products, your profile, and view
            reports.
          </p>
        </div>
      )}
      {adminView === "categories" && (
        <div>
          <h3 className="text-2xl font-semibold mb-4">Manage Categories</h3>
          <form onSubmit={handleAddCategory} className="mb-6">
            <Input
              type="text"
              value={newCategory.name}
              onChange={(e) =>
                setNewCategory({ ...newCategory, name: e.target.value })
              }
              placeholder="Category Name"
              className="mb-2 bg-white text-indigo-600"
            />
            <Button
              type="submit"
              className="bg-white text-indigo-600 hover:bg-gray-200"
            >
              Add Category
            </Button>
          </form>
          <ul className="space-y-2">
            {categories.map((category) => (
              <li
                key={category.id}
                className="flex items-center justify-between p-2 bg-white bg-opacity-20 rounded"
              >
                <span>{category.name}</span>
                <div>
                  <Button
                    onClick={() => setEditingCategory(category)}
                    variant="outline"
                    className="mr-2 border-white text-white hover:bg-white hover:text-indigo-600"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDeleteCategory(category.id)}
                    variant="destructive"
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
          {editingCategory && (
            <form onSubmit={handleUpdateCategory} className="mt-4">
              <Input
                type="text"
                value={editingCategory.name}
                onChange={(e) =>
                  setEditingCategory({
                    ...editingCategory,
                    name: e.target.value,
                  })
                }
                className="mb-2 bg-white text-indigo-600"
              />
              <Button
                type="submit"
                className="bg-white text-indigo-600 hover:bg-gray-200"
              >
                Update Category
              </Button>
            </form>
          )}
        </div>
      )}
      {adminView === "products" && (
        <div>
          <h3 className="text-2xl font-semibold mb-4">Manage Products</h3>
          <form onSubmit={handleAddProduct} className="mb-6">
            <Input
              type="text"
              value={newProduct.name}
              onChange={(e) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
              placeholder="Product Name"
              className="mb-2 bg-white text-indigo-600"
            />
            <Input
              type="number"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: Number(e.target.value) })
              }
              placeholder="Price"
              className="mb-2 bg-white text-indigo-600"
            />
            <select
              value={newProduct.category}
              onChange={(e) =>
                setNewProduct({ ...newProduct, category: e.target.value })
              }
              className="w-full mb-2 p-2 border rounded bg-white text-indigo-600"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
            <Button
              type="submit"
              className="bg-white text-indigo-600 hover:bg-gray-200"
            >
              Add Product
            </Button>
          </form>
          <ul className="space-y-2">
            {products.map((product) => (
              <li
                key={product.id}
                className="flex items-center justify-between p-2 bg-white bg-opacity-20 rounded"
              >
                <span>
                  {product.name} - ${product.price} - {product.category}
                </span>
                <div>
                  <Button
                    onClick={() => setEditingProduct(product)}
                    variant="outline"
                    className="mr-2 border-white text-white hover:bg-white hover:text-indigo-600"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDeleteProduct(product.id)}
                    variant="destructive"
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
          {editingProduct && (
            <form onSubmit={handleUpdateProduct} className="mt-4">
              <Input
                type="text"
                value={editingProduct.name}
                onChange={(e) =>
                  setEditingProduct({ ...editingProduct, name: e.target.value })
                }
                className="mb-2 bg-white text-indigo-600"
              />
              <Input
                type="number"
                value={editingProduct.price}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    price: Number(e.target.value),
                  })
                }
                className="mb-2 bg-white text-indigo-600"
              />
              <select
                value={editingProduct.category}
                onChange={(e) =>
                  setEditingProduct({
                    ...editingProduct,
                    category: e.target.value,
                  })
                }
                className="w-full mb-2 p-2 border rounded bg-white text-indigo-600"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <Button
                type="submit"
                className="bg-white text-indigo-600 hover:bg-gray-200"
              >
                Update Product
              </Button>
            </form>
          )}
        </div>
      )}
      {adminView === "profile" && (
        <div>
          <h3 className="text-2xl font-semibold mb-4">Manage Profile</h3>
          <form onSubmit={handleUpdateProfile}>
            <div className="mb-4">
              <label className="block text-gray-200 mb-2">Name</label>
              <Input
                type="text"
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
                className="bg-white text-indigo-600"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-200 mb-2">Email</label>
              <Input
                type="email"
                value={profile.email}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
                className="bg-white text-indigo-600"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-200 mb-2">Role</label>
              <Input
                type="text"
                value={profile.role}
                readOnly
                className="bg-gray-100 text-indigo-600"
              />
            </div>
            <Button
              type="submit"
              className="bg-white text-indigo-600 hover:bg-gray-200"
            >
              Update Profile
            </Button>
          </form>
        </div>
      )}
      {adminView === "reports" && (
        <div>
          <h3 className="text-2xl font-semibold mb-4">View Reports</h3>
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-white bg-opacity-20">
              <CardContent className="p-4">
                <h4 className="text-lg font-semibold mb-2">Total Sales</h4>
                <p className="text-2xl font-bold">$10,245</p>
              </CardContent>
            </Card>
            <Card className="bg-white bg-opacity-20">
              <CardContent className="p-4">
                <h4 className="text-lg font-semibold mb-2">Total Orders</h4>
                <p className="text-2xl font-bold">152</p>
              </CardContent>
            </Card>
            <Card className="bg-white bg-opacity-20">
              <CardContent className="p-4">
                <h4 className="text-lg font-semibold mb-2">
                  Top Selling Category
                </h4>
                <p className="text-2xl font-bold">Living Room</p>
              </CardContent>
            </Card>
            <Card className="bg-white bg-opacity-20">
              <CardContent className="p-4">
                <h4 className="text-lg font-semibold mb-2">New Customers</h4>
                <p className="text-2xl font-bold">24</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div
      className="flex flex-col min-h-screen relative"
      style={{ backgroundColor: colors.background }}
    >
      <Navbar />

      <main className="flex-1 p-6">
        <animated.div style={fadeIn}>
          {activeView === "home" && <LandingPage />}
          {activeView === "products" && <ProductsPage />}
          {activeView === "cart" && <CartPage />}
          {activeView === "about" && <AboutPage />}
          {activeView === "contact" && <ContactPage />}
          {(activeView === "living-room" ||
            activeView === "bedroom" ||
            activeView === "dining-room" ||
            activeView === "office") && <ProductsPage />}
          {activeView === "admin" && !isAdmin && (
            <Card className="max-w-md mx-auto">
              <CardContent className="p-8">
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
                    <Input
                      type="text"
                      id="username"
                      value={adminUsername}
                      onChange={(e) => setAdminUsername(e.target.value)}
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
                    <Input
                      type="password"
                      id="password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Sign In
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
          {activeView === "admin" && isAdmin && <AdminDashboard />}
        </animated.div>
      </main>

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
                {["Home", "Products", "About Us", "Contact"].map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-gray-300 hover:text-white transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Customer Service</h3>
              <ul className="space-y-2">
                {["FAQ", "Shipping", "Returns", "Privacy Policy"].map(
                  (link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-gray-300 hover:text-white transition-colors duration-200"
                      >
                        {link}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Connect With Us</h3>
              <div className="flex space-x-4">
                {[FaFacebookF, FaTwitter, FaInstagram].map((Icon, index) => (
                  <a
                    key={index}
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    <Icon size={24} />
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-700 text-center text-sm text-gray-300">
            <p>&copy; 2023 Furniture Haven. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <FloatingWhatsApp
        phoneNumber="+1234567890"
        accountName="Furniture Haven"
        avatar="/placeholder.svg?height=50&width=50&text=FH"
        statusMessage="Typically replies within 1 hour"
        chatMessage="Hello! How can we help you today?"
        placeholder="Type a message..."
      />
    </div>
  );
}
