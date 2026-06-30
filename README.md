# Work Insight - Digital Activity Intelligence Platform
Version 1.0
A daily activity intelligence platform designed to track workloads, productivity, and activity analytics for medical digital teams.

## Tech Stack
- **Backend:** Node.js 22 LTS, Express.js 5
- **Template Engine:** EJS
- **Database:** MariaDB 11.x
- **Styles & UI:** Bootstrap 5.3, AdminLTE 4
- **Libraries:** Apache ECharts, Tom Select, SweetAlert2, Bootstrap Icons

## Project Architecture (MVC)
The project utilizes a clean multilayer MVC structure to ensure separation of concerns:
- **Controllers:** Handle HTTP requests and render views.
- **Services:** Contain business logic.
- **Repositories:** Manage database operations.
- **Middlewares:** Define pre-route filters (Auth, Permissions, Logging, Errors).
- **Validators:** Define express-validator rule sets.
- **Views:** Render standard dynamic layouts with EJS and AdminLTE.

## Getting Started

### Prerequisites
- Node.js 22 LTS
- MariaDB 11.x

### Installation
1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```
