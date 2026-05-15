# Project Structure Guide

This project has been restructured to facilitate framework implementation (e.g., React, Next.js, or Laravel).

## Directory Map (Component Based)

- `/src/pages/`
    - `/home/Home.html`
    - `/about/About.html`
    - `/contact/Contact.html`
    - `/katalog/Catalog.html`
    - `/detail/BookDetail.html`
    - `/journal/Journal.html`
    - `/article_detail/ArticleDetail.html`
    - `/new_release/NewRelease.html`

- `/src/admin/`
    - `/login/AdminLogin.html`
    - `/dashboard/AdminDashboard.html`
    - `/manage-books/ManageBooks.html`
    - `/manage-articles/ManageArticles.html`
    - `/article-editor/ArticleEditor.html`
    - `/manage-admins/ManageAdmins.html`
    - `/store-settings/StoreSettings.html`

## Conversion Strategy

When migrating to a framework:
1. **Components**: Break down repetitive sections in `src/pages` (Navbar, Footer, Book Cards) into reusable components.
2. **Layouts**: Use the structural patterns in `code.html` to define global layouts.
3. **State Management**: Convert static list items (books, articles) into dynamic data fetches.
4. **Routing**: Map files in `src/pages` to frontend routes and `src/admin` to protected admin routes.
