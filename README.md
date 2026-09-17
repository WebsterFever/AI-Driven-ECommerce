# AI-Driven E-Commerce — Patagonix Tech

A full-stack e-commerce application developed as the **M5 Frontend Integrative Project**. The project combines a modern React frontend with Firebase services, role-based access control, AWS S3 image uploads, Vercel Serverless Functions, and automated testing.

## Live Application

**Vercel:** https://ecommerce-front-puce.vercel.app

## Repository

**GitHub:** https://github.com/WebsterFever/AI-Driven-ECommerce

## Project Overview

Patagonix Tech is a retail e-commerce platform with two user roles:

- **Customer** — browse products, search and filter the catalog, manage a shopping cart, complete checkout, and review personal orders.
- **Admin** — access a protected administration area, manage products, upload product images to AWS S3, view all orders, filter them, and update order status.

The project was designed to demonstrate practical knowledge of React architecture, TypeScript, global state management, authentication, authorization, cloud services, serverless functions, security rules, testing, and production deployment.

## Main Features

### Customer Features

- Register with email and password
- Sign in with email and password
- Sign in with Google
- Persistent authentication session
- Browse the product catalog
- Filter products by category
- Search products by name
- View product details
- Add products to the cart
- Update product quantities
- Remove products from the cart
- View cart total
- Complete a simulated checkout
- Create orders in Firestore
- View order history and order details
- Track order status

Supported order statuses:

```text
pending
processing
completed
cancelled
```

### Admin Features

- Protected admin routes
- Separate admin layout
- Create products
- Edit products
- Delete products
- Upload product images to AWS S3
- View all customer orders
- Filter orders by status
- Update order status

## Tech Stack

### Frontend

- React 18
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Context API
- `useReducer`

### Services and Cloud

- Firebase Authentication
- Cloud Firestore
- AWS S3
- AWS SDK
- Vercel Serverless Functions

### Testing

- Vitest
- React Testing Library
- Testing Library User Event
- JSDOM

### Deployment and Version Control

- Vercel
- GitHub

## Architecture

The application is organized by responsibility to keep the codebase easier to understand, test, and maintain.

```text
AI-Driven-ECommerce/
├── api/
│   └── presigned-url.ts
├── public/
├── scripts/
├── src/
│   ├── assets/
│   ├── components/
│   ├── contexts/
│   ├── hooks/
│   ├── pages/
│   ├── routes/
│   ├── services/
│   ├── test/
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   └── main.tsx
├── firestore.rules
├── .env.example
├── package.json
└── vite.config.ts
```

### Why Context API?

Context API is used for shared application state that needs to be accessed by several components without prop drilling.

Authentication and cart state are kept in separate contexts because they represent different responsibilities and have different update flows.

### Why `useReducer` for the Cart?

The cart contains several state transitions, such as:

```text
ADD_ITEM
REMOVE_ITEM
UPDATE_QUANTITY
CLEAR_CART
```

Using `useReducer` centralizes these transitions in one predictable place and makes the cart easier to reason about and test.

### Why Firebase?

Firebase Authentication handles user authentication while Cloud Firestore stores application data such as users, products, and orders.

The main Firestore collections are:

```text
users
products
orders
```

### Why AWS S3?

AWS S3 is used as object storage for product images. This separates image storage from application data and provides a scalable cloud-based solution for uploaded files.

Permanent AWS credentials are never exposed to the React frontend.

## Authentication and Authorization

Firebase Authentication is responsible for identifying the logged-in user.

The application supports two roles:

```text
customer
admin
```

The role is stored in the user's Firestore profile and is used by both frontend route protection and Firestore Security Rules.

A customer cannot promote their own account to admin through the client application.

## Firestore Security

Firestore Security Rules are used in addition to frontend route protection.

Important protections include:

- A user can only create their own profile.
- New client-created profiles must use the `customer` role.
- A customer cannot modify their own role.
- Products can be read publicly.
- Product writes are restricted to admins.
- A customer can only create an order for their own account.
- New orders must start with `pending` status.
- Customers can only read their own orders.
- Admins can read all orders.
- Admin order updates are restricted to approved fields such as status and update timestamp.
- Client-side order deletion is blocked.

The project includes a `firestore.rules` file so the authorization model can be reviewed with the source code.

## AWS S3 Image Upload Flow

Product image uploads use **presigned URLs**.

This design allows the browser to upload directly to S3 without receiving permanent AWS credentials.

### Upload Process

```text
Admin selects an image
        ↓
React frontend
        ↓
POST /api/presigned-url
        ↓
Vercel Serverless Function
        ↓
AWS SDK
        ↓
Temporary presigned upload URL
        ↓
Frontend sends PUT request directly to S3
        ↓
Image stored in S3
        ↓
Public image URL returned/constructed
        ↓
Product stores image URL in Firestore
```

### Why Presigned URLs?

A presigned URL grants temporary permission for a specific S3 operation. The serverless function signs the request using server-side AWS credentials, while the frontend receives only the temporary upload URL.

This keeps permanent AWS secrets outside the browser bundle.

## Environment Variables

Create a local `.env` file based on `.env.example`.

Never commit real secrets to GitHub.

### Firebase — Frontend Variables

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

These variables use the `VITE_` prefix because they are read by the Vite frontend.

### AWS — Serverless Variables

```env
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
AWS_S3_BUCKET_NAME=
```

AWS credentials are used only by the Vercel Serverless Function.

They must **never** be configured as:

```env
VITE_AWS_ACCESS_KEY_ID=
VITE_AWS_SECRET_ACCESS_KEY=
```

Adding the `VITE_` prefix would expose them to the client bundle.

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/WebsterFever/AI-Driven-ECommerce.git
```

### 2. Enter the project directory

```bash
cd AI-Driven-ECommerce
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Copy the example file:

```bash
cp .env.example .env
```

On Windows, you can also create `.env` manually from `.env.example`.

Add your Firebase values for frontend development. AWS credentials should only be used in a secure server-side environment when testing the serverless function locally.

## Firebase Setup

To configure the project from scratch:

1. Create a Firebase project.
2. Enable Firebase Authentication.
3. Enable Email/Password authentication.
4. Enable Google authentication if Google Sign-In will be used.
5. Create a Cloud Firestore database.
6. Configure the required Firestore collections.
7. Publish the Firestore Security Rules.
8. Copy the Firebase web configuration values into the `VITE_FIREBASE_*` environment variables.

## AWS S3 Setup

To configure product image storage:

1. Create an S3 bucket.
2. Choose the AWS region.
3. Configure the required bucket permissions.
4. Configure CORS for the frontend origins used by the application.
5. Create a dedicated IAM identity for the upload flow.
6. Apply least-privilege permissions for product image uploads.
7. Create the credentials required by the serverless function.
8. Configure the AWS environment variables in Vercel.

AWS credentials must never be committed to the repository.

## Local Development

### Run the Vite frontend

```bash
npm run dev
```

### Run with Vercel Serverless Functions

For testing `/api/presigned-url` locally:

```bash
vercel dev
```

This starts the frontend together with the local Vercel Functions environment.

## Available Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
npm test
npm run test:watch
```

### Script Purpose

- `npm run dev` — starts the Vite development server.
- `npm run build` — runs TypeScript build checks and creates a production Vite build.
- `npm run lint` — runs Oxlint.
- `npm run preview` — previews the production build locally.
- `npm test` — runs Vitest once.
- `npm run test:watch` — runs Vitest in watch mode.

## Testing Strategy

The project uses Vitest and React Testing Library.

Testing focuses on important application behavior such as:

- Context providers
- Custom hooks
- Cart reducer actions
- User interactions
- Shopping cart flows
- Checkout behavior
- Authentication-related behavior

Firebase and AWS integrations can be mocked so automated tests do not depend on live external services.

## Deployment

The application is deployed with Vercel.

### Production URL

https://ecommerce-front-puce.vercel.app

### Deployment Notes

Frontend environment variables must use the `VITE_` prefix.

Serverless-only secrets such as AWS credentials must not use `VITE_`.

After modifying Vercel environment variables, redeploy the application so the new values are available to the deployment.

Before considering a production deployment complete, verify both roles:

```text
Customer:
register/login → catalog → cart → checkout → order history

Admin:
login → admin panel → product management → image upload → order management
```

## Responsive Design and UX

The interface is designed to work across different screen sizes and includes reusable components, loading states, empty states, and clear error handling.

## Key Technical Decisions

### Context API + `useReducer`

Chosen to manage application-level state without introducing an additional state-management library. The cart benefits from reducer-based actions because its transitions are explicit and testable.

### Firebase Authentication + Firestore

Chosen to provide authentication, user profiles, product data, and order persistence with a cloud-hosted solution that integrates well with React.

### Role-Based Security

Protected React routes improve the user experience, but they are not treated as the security boundary. Firestore Security Rules enforce authorization at the database level.

### AWS S3 + Presigned URLs

Chosen to keep permanent cloud credentials on the server side while still allowing efficient direct uploads from the browser to object storage.

### Vercel Serverless Functions

Used as a minimal backend layer for security-sensitive operations such as generating AWS S3 presigned URLs.

## What I Learned

This project helped strengthen my understanding of:

- React application architecture
- TypeScript domain modeling
- Context API
- `useReducer`
- Firebase Authentication
- Firestore data modeling
- Role-based authorization
- Firestore Security Rules
- AWS S3
- IAM permissions
- Presigned URLs
- Serverless Functions
- Secure environment variables
- Testing React applications
- Production deployment with Vercel

One of the most important lessons was understanding that hiding an admin page in React is not enough to secure an application. Authorization must also be enforced at the data layer.

I also learned how presigned URLs allow direct browser-to-S3 uploads while keeping permanent AWS credentials outside the frontend.

## AI-Assisted Development Log

The project requirements include documenting meaningful AI-assisted development moments. The goal of this section is to show how AI was used to understand problems, evaluate options, review code, improve tests, and make technical decisions rather than simply copying generated code.

| Area | Example Use | Learning / Decision |
|---|---|---|
| Planning | Broke the project into implementation phases | Followed a staged workflow so authentication, catalog, cart, orders, admin, cloud upload, security, testing, and deployment could be validated separately. |
| Code review | Reviewed TypeScript types and Context design | Improved understanding of domain types, reducer actions, payloads, and separation of responsibilities. |
| Technical decision | Compared client-side uploads with S3 presigned URLs | Chose server-generated presigned URLs so permanent AWS credentials remain server-side. |
| Testing | Reviewed reducer, hook, provider, and integration test cases | Learned to test behavior in isolation and mock Firebase/AWS dependencies. |
| Problem solving | Investigated Firestore permission errors and role rules | Strengthened Firestore rules to prevent role self-promotion and restrict admin order updates. |

> For the final academic submission, this table should reflect the real prompts, lessons, and decisions made during development.

## Security Notes

- `.env` is ignored by Git.
- `.env.example` contains variable names only.
- AWS secrets are server-side only.
- AWS credentials never use a `VITE_` prefix.
- Firestore rules enforce role-based authorization.
- Product upload permissions follow a least-privilege approach.
- Client-side route protection is not treated as the only security layer.

## Author

**Webster Fievre**

GitHub: https://github.com/WebsterFever

## Links

- Repository: https://github.com/WebsterFever/AI-Driven-ECommerce
- Live Application: https://ecommerce-front-puce.vercel.app

---

Built as an academic full-stack e-commerce project focused on modern frontend architecture, cloud integrations, secure file uploads, testing, and production deployment.
