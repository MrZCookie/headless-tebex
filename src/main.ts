// API Response interfaces
interface BasketResponse {
  data: {
    ident: string;
    links: {
      checkout: string;
    };
  };
}

// Create basket
async function createBasket(
  webstoreID: string,
  username: string
): Promise<string | false> {
  const response = await fetch(
    `https://headless.tebex.io/api/accounts/${webstoreID}/baskets`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
      }),
    }
  );

  if (!response.ok) {
    return false;
  }

  const basketData: BasketResponse = await response.json();
  return basketData.data.ident;
}

// Add package to basket
async function addPackage(
  basketId: string,
  packageId: string
): Promise<boolean> {
  const response = await fetch(
    `https://headless.tebex.io/api/baskets/${basketId}/packages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        package_id: packageId,
      }),
    }
  );

  if (!response.ok) {
    return false;
  }

  return true;
}

// Get checkout url
async function getCheckoutUrl(
  webstoreID: string,
  basketId: string
): Promise<string | false> {
  const response = await fetch(
    `https://headless.tebex.io/api/accounts/${webstoreID}/baskets/${basketId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    return false;
  }

  const basketData: BasketResponse = await response.json();
  return basketData.data.links.checkout;
}

// Checkout
async function checkout(webstoreID: string): Promise<void> {
  const searchParams = new URLSearchParams(window.location.search);
  const username = searchParams.get("username");
  const packages = searchParams.get("packages")?.split(",");

  if (!username || !packages || packages.length === 0) {
    console.log("Username and packages are both required.");
    return;
  }

  const basketId = await createBasket(webstoreID, username);
  if (!basketId) {
    console.log("Failed to create basket.");
    return;
  }

  for (const packageId of packages) {
    const packageAdded = await addPackage(basketId, packageId);

    if (!packageAdded) {
      console.log(`Failed to add package ${packageId} to basket.`);
      return;
    }
  }

  const checkoutUrl = await getCheckoutUrl(webstoreID, basketId);
  if (checkoutUrl) {
    window.location.replace(checkoutUrl);
  } else {
    console.log("Failed to retrieve checkout URL.");
  }
}

// Checkout with webstore identifier
checkout(import.meta.env.WEBSTORE_ID);
