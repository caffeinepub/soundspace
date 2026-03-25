# SoundSpace

## Current State
New project - no existing application files.

## Requested Changes (Diff)

### Add
- Full clone of https://store-bridge-3.preview.emergentagent.com/ (SoundSpace music instrument store)
- Three tags displayed on every product card and product detail page: "AI", "Netaji", "tagine"
- Product image URL displayed below/on the product card

### Modify
- N/A (new project)

### Remove
- N/A

## Implementation Plan
1. Create mockData.ts with all 12 products, categories, types, priceRanges, and 6 blog posts
2. Create Header component (sticky, logo + nav links: Home, Store, Blog, About, Contact, Cart)
3. Create Home page (hero section with big SoundSpace title, EXPLORE COLLECTION + OUR STORY buttons, featured products grid, why choose us section, blog preview)
4. Create Store page (search + category/type/price filters, product grid with cards)
5. Create Product Detail page (full product info, specs, add to cart)
6. Create About page (mission, team, values)
7. Create Blog page (list of blog posts)
8. Create Blog Post detail page
9. Create Contact page (form + contact info)
10. Create Cart page (items, quantities, totals)
11. On each product card AND product detail: show 3 badge tags ("AI", "Netaji", "tagine") and display the product image URL
12. Cart persisted in localStorage
