const products = [
    {
      title: "iPhone 13 Pro",
      price: "₹79,999",
      desc: "A powerful smartphone with high-end features and long battery life.",
    },
    {
      title: "Asus Expertbook p5",
      price: "₹1,09,999",
      desc: "A sleek and powerful laptop suitable for professionals and creators.",
    },
    {
      title: "Samsung Tablet Z",
      price: "₹39,999",
      desc: "Lightweight tablet perfect for media consumption and light work.",
    },
    {
      title: "Boat Noise Cancelling Headphones",
      price: "₹9,999",
      desc: "Enjoy immersive sound without distractions.",
    },
    {
      title: "Samsung Smartwatch Elite",
      price: "₹14,999",
      desc: "Track your fitness and stay connected on the go.",
    },
    {
      title: "Canon DSLR Camera 500D",
      price: "₹49,999",
      desc: "Capture moments in stunning quality with this DSLR camera.",
    },
  ];
  
  let selectedProduct = null;
  
  function showDetails(index) {
    const product = products[index];
    selectedProduct = { ...product, index }; // Save index too
    document.getElementById("modalTitle").innerText = product.title;
    document.getElementById("modalPrice").innerText = product.price;
    document.getElementById("modalDesc").innerText = product.desc;
    document.getElementById("productModal").style.display = "block";
  
    document.getElementById("buybtn").onclick = function () {
      alert("Thanks for shopping!");
      closeModal();
    };
  
    document.getElementById("negotiateBtn").onclick = function () {
      openChatbot(product);
    };
  }
  
  function closeModal() {
    document.getElementById("productModal").style.display = "none";
    document.getElementById("chat-container").style.display = "none";
  }
  
  function openChatbot(product) {
    document.getElementById("chat-container").style.display = "block";
    document.getElementById("chat-box").innerHTML = `<p><strong>AI:</strong> Hi! You're interested in <em>${product.title}</em> priced at <em>${product.price}</em>. Let's negotiate!</p>`;
  }
  
  // Chatbot interaction
  const chatForm = document.getElementById("chat-form");
  const userInput = document.getElementById("user-input");
  const chatBox = document.getElementById("chat-box");
  
  chatForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const userMessage = userInput.value.trim();
    if (!userMessage) return;
  
    chatBox.innerHTML += `<p><strong>You:</strong> ${userMessage}</p>`;
  
    const response = await fetch("http://localhost:3000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: `I'm interested in ${selectedProduct.title} priced at ${selectedProduct.price}. ${userMessage}. Restrict the discount to 5%. Reply with the new price also.`,
          },
        ],
      }),
    });
  
    const data = await response.json();
    const botReply = data.reply;
  
    chatBox.innerHTML += `<p><strong>AI:</strong> ${botReply}</p>`;
  
    // 🧠 Extract the new price from AI's reply
    const newPrice = extractPrice(botReply);
  
    if (newPrice) {
      const formattedPrice = "₹" + newPrice.toLocaleString();
  
      // Update the price in modal and products array
      selectedProduct.price = formattedPrice;
      products[selectedProduct.index].price = formattedPrice;
  
      document.getElementById("modalPrice").innerText = formattedPrice;
    }
  
    userInput.value = "";
  });
  
  // Helper to extract price from text
  function extractPrice(text) {
    const match = text.match(/(\d{2,}[,\d{2,}]*)/);
    if (match) {
      const priceStr = match[1].replace(/,/g, ""); // Remove commas
      return parseInt(priceStr);
    }
    return null;
  }
  