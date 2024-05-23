# Project Overview

This project is a web application designed for managing consultations, doctor requests, patients, and other related entities. It leverages Supabase for backend operations and authentication.

## Table of Contents
- [Project Overview](#project-overview)
- [File Structure](#file-structure)
- [Setup](#setup)
- [Usage](#usage)
- [Features](#features)
- [License](#license)

## File Structure

### HTML Files
- **`login.html`**: Contains the login page structure.
- **`reset-password.html`**: Contains the password reset page structure.
- **`patient-list.html`**: Displays a list of patients with pagination and search functionality.
- **`profile.html`**: Displays and allows editing of the user's profile.
- **`specialities.html`**: Manages the list of specialities.
- **`doctor-list.html`**: Displays a list of doctors with pagination and search functionality.
- **`Doctor Request.html`**: Manages and displays doctor requests.
- **`consultation-list.html`**: Displays a list of consultations with pagination and search functionality.
- **`index.html`**: The dashboard displaying an overview of the application's key metrics and recent activities.

### JavaScript Files
- **`login.js`**: Handles user authentication.
- **`resetPassword.js`**: Manages password reset operations.
- **`patient.js`**: Fetches and manages patient data, including search and pagination.
- **`profile.js`**: Fetches and updates the user's profile data.
- **`specialities.js`**: Manages CRUD operations for specialities.
- **`doctor.js`**: Fetches and manages doctor data, including search and pagination.
- **`doctorRequest.js`**: Handles doctor request operations, including search and pagination.
- **`consultation.js`**: Manages consultations, including search and pagination.
- **`index.js`**: Handles the dashboard data fetching and display.

### Supabase Configuration
All JavaScript files that interact with the backend use the following Supabase configuration:
```
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_KEY';
const database = supabase.createClient(supabaseUrl, supabaseKey);
```

## Setup

### Prerequisites
- Node.js
- npm or yarn
- Supabase account

### Installation
1. Clone the repository:
```
git clone https://github.com/your-repo/project-name.git
```
2. Navigate to the project directory:
```
cd project-name
```
3. Install dependencies:
```
npm install
```
or
```
yarn install
```

## Usage

### Running the Application
1. Start the development server:
```
npm start
```
or
```
yarn start
```
2. Open your browser and navigate to `http://localhost:3000`.

## Features

- **User Authentication**: Secure login and logout functionality.
- **Password Reset**: Allows users to reset their password.
- **Patient Management**: View, search, and paginate through a list of patients.
- **Profile Management**: View and update user profile information.
- **Specialities Management**: CRUD operations for managing specialities.
- **Doctor Management**: View, search, and paginate through a list of doctors.
- **Doctor Requests**: Manage doctor requests.
- **Consultation Management**: View, search, and paginate through a list of consultations.
- **Dashboard**: Overview of key metrics and recent activities.

## License

This project is licensed under the MIT License. 
```
