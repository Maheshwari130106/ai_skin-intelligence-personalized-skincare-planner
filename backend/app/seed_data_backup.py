"""
Run once to populate demo ingredients & products:

    python -m app.seed_data

This seed file uses INR prices and product-specific image URLs.
"""

from app.database import SessionLocal, Base, engine
from app.models.ingredient import Ingredient
from app.models.product import Product


Base.metadata.create_all(bind=engine)


# ============================================================
# INGREDIENTS
# ============================================================

INGREDIENTS = [
    dict(
        name="Retinoid",
        category="retinoid",
        good_for=["wrinkles", "fine_lines", "acne"],
        avoid_if=["pregnant", "sensitive_skin"],
        interacts_badly_with=["AHAs/BHAs", "Vitamin C"],
        description="Vitamin A derivative that boosts cell turnover and collagen production.",
    ),

    dict(
        name="Niacinamide",
        category="niacinamide",
        good_for=["oily_skin", "dark_spots", "redness"],
        avoid_if=[],
        interacts_badly_with=[],
        description="Reduces oil production, redness, and supports the skin barrier.",
    ),

    dict(
        name="Vitamin C",
        category="vitamin_c",
        good_for=["hyperpigmentation", "dark_spots"],
        avoid_if=[],
        interacts_badly_with=["Retinoid"],
        description="Antioxidant that brightens skin and helps fade dark spots.",
    ),

    dict(
        name="Hyaluronic Acid",
        category="hyaluronic_acid",
        good_for=["dry_skin"],
        avoid_if=[],
        interacts_badly_with=[],
        description="Humectant that draws and holds moisture in the skin.",
    ),

    dict(
        name="Salicylic Acid",
        category="salicylic_acid",
        good_for=["acne", "oily_skin"],
        avoid_if=["dry_skin", "sensitive_skin"],
        interacts_badly_with=["Retinoid"],
        description="BHA that exfoliates inside pores and helps reduce breakouts.",
    ),

    dict(
        name="Ceramides",
        category="ceramides",
        good_for=["dry_skin", "sensitive_skin", "redness"],
        avoid_if=[],
        interacts_badly_with=[],
        description="Lipids that restore and strengthen the skin barrier.",
    ),

    dict(
        name="Peptides",
        category="peptides",
        good_for=["wrinkles", "fine_lines"],
        avoid_if=[],
        interacts_badly_with=[],
        description="Amino acid chains that support collagen and skin firmness.",
    ),

    dict(
        name="AHAs/BHAs",
        category="ahas_bhas",
        good_for=["uneven_skin_tone", "dark_spots"],
        avoid_if=["sensitive_skin"],
        interacts_badly_with=["Retinoid"],
        description="Chemical exfoliants that resurface skin and improve uneven tone.",
    ),
]


# ============================================================
# PRODUCTS
# ============================================================

PRODUCTS = [

    # ============================================================
    # FACE WASH - 5 PRODUCTS
    # ============================================================

    {
        "name": "Gentle Skin Cleanser",
        "brand": "Cetaphil",
        "category": "face_wash",
        "description": "A gentle daily cleanser that removes dirt and impurities without drying the skin.",
        "price": 399.0,
        "currency": "INR",
        "image_url": "/products/facewash/cetaphil-gentle-cleanser.jpg",
        "key_ingredients": ["Glycerin", "Niacinamide", "Panthenol"],
        "suitable_skin_types": ["dry", "sensitive", "normal"],
        "targets_concerns": ["dry_skin", "sensitive_skin"],
        "rating": 4.5,
        "review_count": 12500,
        "buy_url": "https://www.cetaphil.in/",
    },

    {
        "name": "Foaming Facial Cleanser",
        "brand": "CeraVe",
        "category": "face_wash",
        "description": "Foaming cleanser with ceramides and hyaluronic acid for effective yet gentle cleansing.",
        "price": 799.0,
        "currency": "INR",
        "image_url": "/products/facewash/cerave-foaming-cleanser.jpg",
        "key_ingredients": ["Ceramides", "Hyaluronic Acid", "Niacinamide"],
        "suitable_skin_types": ["normal", "oily", "combination"],
        "targets_concerns": ["oily_skin", "acne"],
        "rating": 4.6,
        "review_count": 9800,
        "buy_url": "https://www.cerave.com/",
    },

    {
        "name": "Salicylic Acid 2% Cleanser",
        "brand": "Minimalist",
        "category": "face_wash",
        "description": "A salicylic acid cleanser designed to remove excess oil and help manage acne-prone skin.",
        "price": 299.0,
        "currency": "INR",
        "image_url": "/products/facewash/minimalist-salicylic-cleanser.jpg",
        "key_ingredients": ["Salicylic Acid", "LHA"],
        "suitable_skin_types": ["oily", "combination"],
        "targets_concerns": ["acne", "oily_skin", "dark_spots"],
        "rating": 4.4,
        "review_count": 8700,
        "buy_url": "https://beminimalist.co/",
    },

    {
        "name": "Oil-Free Acne Wash",
        "brand": "Neutrogena",
        "category": "face_wash",
        "description": "An acne-focused cleanser that helps remove excess oil and impurities.",
        "price": 499.0,
        "currency": "INR",
        "image_url": "/products/facewash/neutrogena-acne-wash.jpg",
        "key_ingredients": ["Salicylic Acid"],
        "suitable_skin_types": ["oily", "combination"],
        "targets_concerns": ["acne", "oily_skin"],
        "rating": 4.3,
        "review_count": 7200,
        "buy_url": "https://www.neutrogena.com/",
    },

    {
        "name": "Green Tea Pore Cleansing Face Wash",
        "brand": "Plum",
        "category": "face_wash",
        "description": "Refreshing green tea face wash for oily and combination skin.",
        "price": 345.0,
        "currency": "INR",
        "image_url": "/products/facewash/plum-green-tea-facewash.jpg",
        "key_ingredients": ["Green Tea", "Glycolic Acid"],
        "suitable_skin_types": ["oily", "combination", "normal"],
        "targets_concerns": ["oily_skin", "acne", "uneven_skin_tone"],
        "rating": 4.4,
        "review_count": 6400,
        "buy_url": "https://plumgoodness.com/",
    },


    # ============================================================
    # SERUM - 5 PRODUCTS
    # ============================================================

    {
        "name": "10% Niacinamide Face Serum",
        "brand": "Minimalist",
        "category": "serum",
        "description": "Niacinamide serum designed to improve uneven tone, excess oil and the appearance of pores.",
        "price": 599.0,
        "currency": "INR",
        "image_url": "/products/serum/minimalist-niacinamide.jpg",
        "key_ingredients": ["Niacinamide", "Zinc PCA"],
        "suitable_skin_types": ["oily", "combination", "normal"],
        "targets_concerns": ["acne", "dark_spots", "oily_skin", "uneven_skin_tone"],
        "rating": 4.5,
        "review_count": 15000,
        "buy_url": "https://beminimalist.co/",
    },

    {
        "name": "Niacinamide 10% + Zinc 1%",
        "brand": "The Ordinary",
        "category": "serum",
        "description": "Lightweight serum formulated to target excess sebum and the appearance of blemishes.",
        "price": 650.0,
        "currency": "INR",
        "image_url": "/products/serum/ordinary-niacinamide.jpg",
        "key_ingredients": ["Niacinamide", "Zinc PCA"],
        "suitable_skin_types": ["oily", "combination"],
        "targets_concerns": ["acne", "oily_skin", "dark_spots"],
        "rating": 4.4,
        "review_count": 21000,
        "buy_url": "https://theordinary.com/",
    },

    {
        "name": "15% Vitamin C Face Serum",
        "brand": "Plum",
        "category": "serum",
        "description": "Brightening vitamin C serum that helps improve dullness and uneven skin tone.",
        "price": 699.0,
        "currency": "INR",
        "image_url": "/products/serum/plum-vitamin-c.jpg",
        "key_ingredients": ["Vitamin C", "Vitamin E", "Ferulic Acid"],
        "suitable_skin_types": ["normal", "dry", "combination"],
        "targets_concerns": ["dark_spots", "uneven_skin_tone", "redness"],
        "rating": 4.3,
        "review_count": 5600,
        "buy_url": "https://plumgoodness.com/",
    },

    {
        "name": "10% Niacinamide Serum",
        "brand": "Dot & Key",
        "category": "serum",
        "description": "Lightweight niacinamide serum for brighter and smoother-looking skin.",
        "price": 595.0,
        "currency": "INR",
        "image_url": "/products/serum/dotkey-niacinamide.jpg",
        "key_ingredients": ["Niacinamide", "Cica"],
        "suitable_skin_types": ["oily", "combination", "normal"],
        "targets_concerns": ["acne", "dark_spots", "uneven_skin_tone"],
        "rating": 4.2,
        "review_count": 4300,
        "buy_url": "https://www.dotandkey.com/",
    },

    {
        "name": "Healthy Renew Serum",
        "brand": "Cetaphil",
        "category": "serum",
        "description": "Gentle serum designed to support smoother and healthier-looking skin.",
        "price": 1299.0,
        "currency": "INR",
        "image_url": "/products/serum/cetaphil-healthy-renew.jpg",
        "key_ingredients": ["Retinol", "Hyaluronic Acid"],
        "suitable_skin_types": ["normal", "dry", "combination"],
        "targets_concerns": ["fine_lines", "wrinkles", "uneven_skin_tone"],
        "rating": 4.4,
        "review_count": 3900,
        "buy_url": "https://www.cetaphil.in/",
    },


    # ============================================================
    # MOISTURIZER - 5 PRODUCTS
    # ============================================================

    {
        "name": "Moisturizing Cream",
        "brand": "CeraVe",
        "category": "moisturizer",
        "description": "Rich moisturizing cream with ceramides and hyaluronic acid for long-lasting hydration.",
        "price": 899.0,
        "currency": "INR",
        "image_url": "/products/moisturizer/cerave-moisturizing-cream.jpg",
        "key_ingredients": ["Ceramides", "Hyaluronic Acid"],
        "suitable_skin_types": ["dry", "normal", "sensitive"],
        "targets_concerns": ["dry_skin", "sensitive_skin"],
        "rating": 4.7,
        "review_count": 18000,
        "buy_url": "https://www.cerave.com/",
    },

    {
        "name": "Moisturising Cream",
        "brand": "Cetaphil",
        "category": "moisturizer",
        "description": "Gentle moisturizer that provides lasting hydration for dry and sensitive skin.",
        "price": 549.0,
        "currency": "INR",
        "image_url": "/products/moisturizer/cetaphil-moisturising-cream.jpg",
        "key_ingredients": ["Glycerin", "Sweet Almond Oil"],
        "suitable_skin_types": ["dry", "sensitive", "normal"],
        "targets_concerns": ["dry_skin", "sensitive_skin"],
        "rating": 4.6,
        "review_count": 14300,
        "buy_url": "https://www.cetaphil.in/",
    },

    {
        "name": "B5 Hydrating Moisturizer",
        "brand": "Minimalist",
        "category": "moisturizer",
        "description": "Lightweight barrier-supporting moisturizer with panthenol and hydrating ingredients.",
        "price": 349.0,
        "currency": "INR",
        "image_url": "/products/moisturizer/minimalist-b5-moisturizer.jpg",
        "key_ingredients": ["Panthenol", "Ceramides", "Hyaluronic Acid"],
        "suitable_skin_types": ["normal", "dry", "combination", "sensitive"],
        "targets_concerns": ["dry_skin", "sensitive_skin"],
        "rating": 4.5,
        "review_count": 7200,
        "buy_url": "https://beminimalist.co/",
    },

    {
        "name": "Barrier Repair Moisturizer",
        "brand": "Dot & Key",
        "category": "moisturizer",
        "description": "Barrier-focused moisturizer designed to replenish and soothe dry-looking skin.",
        "price": 595.0,
        "currency": "INR",
        "image_url": "/products/moisturizer/dotkey-barrier-moisturizer.jpg",
        "key_ingredients": ["Ceramides", "Cica", "Hyaluronic Acid"],
        "suitable_skin_types": ["dry", "sensitive", "normal"],
        "targets_concerns": ["dry_skin", "sensitive_skin", "redness"],
        "rating": 4.3,
        "review_count": 4100,
        "buy_url": "https://www.dotandkey.com/",
    },

    {
        "name": "Hydro Boost Water Gel",
        "brand": "Neutrogena",
        "category": "moisturizer",
        "description": "Lightweight water gel moisturizer that provides refreshing hydration without heaviness.",
        "price": 799.0,
        "currency": "INR",
        "image_url": "/products/moisturizer/neutrogena-hydro-boost.jpg",
        "key_ingredients": ["Hyaluronic Acid"],
        "suitable_skin_types": ["oily", "combination", "normal"],
        "targets_concerns": ["dry_skin", "oily_skin"],
        "rating": 4.5,
        "review_count": 9200,
        "buy_url": "https://www.neutrogena.com/",
    },


    # ============================================================
    # SUNSCREEN - 5 PRODUCTS
    # ============================================================

    {
        "name": "SPF 50 PA++++ Sunscreen",
        "brand": "Minimalist",
        "category": "sunscreen",
        "description": "Lightweight broad-spectrum sunscreen designed for daily protection.",
        "price": 399.0,
        "currency": "INR",
        "image_url": "/products/sunscreen/minimalist-spf50.jpg",
        "key_ingredients": ["UV Filters", "Vitamin E"],
        "suitable_skin_types": ["normal", "oily", "combination"],
        "targets_concerns": ["dark_spots", "uneven_skin_tone"],
        "rating": 4.4,
        "review_count": 12000,
        "buy_url": "https://beminimalist.co/",
    },

    {
        "name": "Ultra Sheer Dry-Touch SPF 50+",
        "brand": "Neutrogena",
        "category": "sunscreen",
        "description": "Dry-touch sunscreen with high SPF protection and a lightweight finish.",
        "price": 599.0,
        "currency": "INR",
        "image_url": "/products/sunscreen/neutrogena-ultra-sheer.jpg",
        "key_ingredients": ["UV Filters"],
        "suitable_skin_types": ["oily", "combination", "normal"],
        "targets_concerns": ["dark_spots", "uneven_skin_tone"],
        "rating": 4.5,
        "review_count": 16000,
        "buy_url": "https://www.neutrogena.com/",
    },

    {
        "name": "Ultra Matte Dry Touch Sunscreen SPF 50",
        "brand": "Re'equil",
        "category": "sunscreen",
        "description": "Matte sunscreen suitable for daily use, especially for oily and combination skin.",
        "price": 695.0,
        "currency": "INR",
        "image_url": "/products/sunscreen/reequil-spf50.jpg",
        "key_ingredients": ["UV Filters", "Vitamin E"],
        "suitable_skin_types": ["oily", "combination"],
        "targets_concerns": ["oily_skin", "dark_spots"],
        "rating": 4.5,
        "review_count": 8700,
        "buy_url": "https://www.reequil.com/",
    },

    {
        "name": "Watermelon Cooling Sunscreen SPF 50",
        "brand": "Dot & Key",
        "category": "sunscreen",
        "description": "Lightweight sunscreen with a refreshing finish for everyday sun protection.",
        "price": 495.0,
        "currency": "INR",
        "image_url": "/products/sunscreen/dotkey-watermelon-spf.jpg",
        "key_ingredients": ["UV Filters", "Watermelon Extract"],
        "suitable_skin_types": ["normal", "combination", "oily"],
        "targets_concerns": ["uneven_skin_tone", "dark_spots"],
        "rating": 4.2,
        "review_count": 5200,
        "buy_url": "https://www.dotandkey.com/",
    },

    {
        "name": "Glow+ Dewy Sunscreen SPF 50",
        "brand": "Aqualogica",
        "category": "sunscreen",
        "description": "Hydrating sunscreen with a dewy finish designed for everyday use.",
        "price": 499.0,
        "currency": "INR",
        "image_url": "/products/sunscreen/aqualogica-glow-spf.jpg",
        "key_ingredients": ["UV Filters", "Papaya Extract", "Vitamin C"],
        "suitable_skin_types": ["dry", "normal", "combination"],
        "targets_concerns": ["dry_skin", "uneven_skin_tone", "dark_spots"],
        "rating": 4.3,
        "review_count": 6100,
        "buy_url": "https://aqualogica.in/",
    },


    # ============================================================
    # TONER - 5 PRODUCTS
    # ============================================================

    {
        "name": "PHA 3% Toner",
        "brand": "Minimalist",
        "category": "toner",
        "description": "Gentle exfoliating toner designed to improve skin texture and clarity.",
        "price": 399.0,
        "currency": "INR",
        "image_url": "/products/toner/minimalist-pha-toner.jpg",
        "key_ingredients": ["PHA", "AHA"],
        "suitable_skin_types": ["normal", "combination", "oily"],
        "targets_concerns": ["uneven_skin_tone", "fine_lines", "dark_spots"],
        "rating": 4.3,
        "review_count": 4800,
        "buy_url": "https://beminimalist.co/",
    },

    {
        "name": "Green Tea Alcohol-Free Toner",
        "brand": "Plum",
        "category": "toner",
        "description": "Refreshing toner formulated with green tea for oily and combination skin.",
        "price": 420.0,
        "currency": "INR",
        "image_url": "/products/toner/plum-green-tea-toner.jpg",
        "key_ingredients": ["Green Tea", "Ginkgo"],
        "suitable_skin_types": ["oily", "combination", "normal"],
        "targets_concerns": ["oily_skin", "acne", "redness"],
        "rating": 4.3,
        "review_count": 5300,
        "buy_url": "https://plumgoodness.com/",
    },

    {
        "name": "Cica Calming Toner",
        "brand": "Dot & Key",
        "category": "toner",
        "description": "Soothing toner designed to calm and hydrate sensitive-looking skin.",
        "price": 395.0,
        "currency": "INR",
        "image_url": "/products/toner/dotkey-cica-toner.jpg",
        "key_ingredients": ["Cica", "Hyaluronic Acid"],
        "suitable_skin_types": ["sensitive", "dry", "normal"],
        "targets_concerns": ["redness", "sensitive_skin", "dry_skin"],
        "rating": 4.2,
        "review_count": 3500,
        "buy_url": "https://www.dotandkey.com/",
    },

    {
        "name": "Glycolic Acid 7% Toning Solution",
        "brand": "The Ordinary",
        "category": "toner",
        "description": "Exfoliating toner formulated with glycolic acid to improve skin texture and radiance.",
        "price": 850.0,
        "currency": "INR",
        "image_url": "/products/toner/ordinary-glycolic-toner.jpg",
        "key_ingredients": ["Glycolic Acid", "Aloe Vera"],
        "suitable_skin_types": ["normal", "oily", "combination"],
        "targets_concerns": ["dark_spots", "uneven_skin_tone", "fine_lines"],
        "rating": 4.5,
        "review_count": 19000,
        "buy_url": "https://theordinary.com/",
    },

    {
        "name": "Hydrating Toner",
        "brand": "Deconstruct",
        "category": "toner",
        "description": "Hydrating toner designed to refresh and support a comfortable skin barrier.",
        "price": 349.0,
        "currency": "INR",
        "image_url": "/products/toner/deconstruct-hydrating-toner.jpg",
        "key_ingredients": ["Hyaluronic Acid", "Panthenol"],
        "suitable_skin_types": ["dry", "normal", "sensitive"],
        "targets_concerns": ["dry_skin", "sensitive_skin"],
        "rating": 4.2,
        "review_count": 2800,
        "buy_url": "https://thedeconstruct.in/",
    },


    # ============================================================
    # TREATMENT - 5 PRODUCTS
    # ============================================================

    {
        "name": "Retinol 0.3% Face Serum",
        "brand": "Minimalist",
        "category": "treatment",
        "description": "Retinol treatment designed to support smoother-looking skin and improve the appearance of fine lines.",
        "price": 599.0,
        "currency": "INR",
        "image_url": "/products/treatment/minimalist-retinol.jpg",
        "key_ingredients": ["Retinol", "Vitamin E"],
        "suitable_skin_types": ["normal", "combination", "oily"],
        "targets_concerns": ["fine_lines", "wrinkles", "uneven_skin_tone"],
        "rating": 4.4,
        "review_count": 6800,
        "buy_url": "https://beminimalist.co/",
    },

    {
        "name": "Salicylic Acid 2% Solution",
        "brand": "The Ordinary",
        "category": "treatment",
        "description": "Salicylic acid treatment designed to target blemishes and congested-looking skin.",
        "price": 750.0,
        "currency": "INR",
        "image_url": "/products/treatment/ordinary-salicylic.jpg",
        "key_ingredients": ["Salicylic Acid"],
        "suitable_skin_types": ["oily", "combination"],
        "targets_concerns": ["acne", "oily_skin", "dark_spots"],
        "rating": 4.4,
        "review_count": 11000,
        "buy_url": "https://theordinary.com/",
    },

    {
        "name": "2% Salicylic Acid Face Serum",
        "brand": "The Derma Co",
        "category": "treatment",
        "description": "Acne-focused treatment formulated with salicylic acid to help unclog pores.",
        "price": 499.0,
        "currency": "INR",
        "image_url": "/products/treatment/dermaco-salicylic.jpg",
        "key_ingredients": ["Salicylic Acid", "Niacinamide"],
        "suitable_skin_types": ["oily", "combination"],
        "targets_concerns": ["acne", "oily_skin", "dark_spots"],
        "rating": 4.3,
        "review_count": 9200,
        "buy_url": "https://thedermaco.com/",
    },

    {
        "name": "1% Retinol Serum",
        "brand": "Plum",
        "category": "treatment",
        "description": "Retinol-based treatment designed to support smoother and more even-looking skin.",
        "price": 699.0,
        "currency": "INR",
        "image_url": "/products/treatment/plum-retinol.jpg",
        "key_ingredients": ["Retinol", "Bakuchiol"],
        "suitable_skin_types": ["normal", "combination", "oily"],
        "targets_concerns": ["fine_lines", "wrinkles", "uneven_skin_tone"],
        "rating": 4.2,
        "review_count": 3900,
        "buy_url": "https://plumgoodness.com/",
    },

    {
        "name": "AHA BHA Exfoliating Serum",
        "brand": "Dot & Key",
        "category": "treatment",
        "description": "Exfoliating treatment designed to improve the appearance of clogged pores and uneven texture.",
        "price": 595.0,
        "currency": "INR",
        "image_url": "/products/treatment/dotkey-aha-bha.jpg",
        "key_ingredients": ["AHA", "BHA", "Glycolic Acid"],
        "suitable_skin_types": ["oily", "combination", "normal"],
        "targets_concerns": ["acne", "dark_spots", "uneven_skin_tone"],
        "rating": 4.2,
        "review_count": 4500,
        "buy_url": "https://www.dotandkey.com/",
    },
]
# ============================================================
# SEED FUNCTION
# ============================================================

def seed():
    db = SessionLocal()

    try:
        # ----------------------------------------------------
        # INGREDIENTS
        # ----------------------------------------------------

        for ingredient_data in INGREDIENTS:
            existing = (
                db.query(Ingredient)
                .filter(Ingredient.name == ingredient_data["name"])
                .first()
            )

            if existing:
                for key, value in ingredient_data.items():
                    setattr(existing, key, value)
            else:
                db.add(Ingredient(**ingredient_data))

        # ----------------------------------------------------
        # PRODUCTS
        # ----------------------------------------------------

        for product_data in PRODUCTS:
            existing = (
                db.query(Product)
                .filter(Product.name == product_data["name"])
                .first()
            )

            if existing:
                # Update existing product
                for key, value in product_data.items():
                    if hasattr(existing, key):
                        setattr(existing, key, value)

            else:
                # Add new product
                db.add(Product(**product_data))

        db.commit()

        print(
            f"Successfully seeded/updated "
            f"{len(INGREDIENTS)} ingredients and "
            f"{len(PRODUCTS)} products."
        )

    except Exception as e:
        db.rollback()
        print(f"Seed failed: {e}")
        raise

    finally:
        db.close()


if __name__ == "__main__":
    seed()